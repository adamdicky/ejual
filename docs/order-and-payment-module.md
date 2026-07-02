# Order and Payment Module

This document covers the Order and Payment module built on top of the existing
`orders`, `order-items`, `addresses`, `product-variants`, and `inventory` collections.
It records checkout transactions, tracks payment status, and moves an order through
its fulfillment lifecycle from `pending` to `delivered` or `cancelled`.

> **Cart/Checkout dependency**: this module reads an existing `carts` / `cart-items`
> row for the signed-in buyer and converts it into an order. The Cart and Checkout
> module (built by another team member) is what should eventually call
> `placeOrder()` once the buyer has picked an address and payment method. Since that
> UI doesn't exist yet, the "Setting up test data" section below shows how to seed a
> cart by hand so you can exercise this module end-to-end.

## 1. What was added

**Core logic — `src/lib/orders.ts`**
- `calculateOrderTotal(items, shippingFee?)` — sums `unitPrice * quantity` per line item and adds a flat shipping fee (`SHIPPING_FEE = 10`, a deliberate simplification — see the `ponytail:` comment in the file for the upgrade path).
- `createOrderFromCart(payload, user, { paymentMethod, shippingAddressID })` — the cart → order conversion entry point. Validates the address belongs to the buyer, checks stock, snapshots `unitPrice` / `subtotal` / seller onto each `order-items` row (so later price edits don't rewrite historical orders), reserves inventory, clears the converted `cart-items`, sends an order-placed notification, and auto-confirms payment for `card` / `online-banking` (cash-on-delivery stays `pending`).
- `reserveInventory()` — holds stock by incrementing `reservedQuantity`; throws if there isn't enough available stock.
- `updatePaymentStatus()` / `confirmPayment()` — updates `paymentStatus` and keeps inventory consistent (`paid` finalizes the stock hold into a real deduction, `failed` releases it).
- `updateOrderStatus()` — enforces the flow `pending → processing → shipped → delivered`. Buyers may only cancel (while `pending`/`processing`); a seller with at least one item on the order can advance it; `admin` bypasses these checks. Delivering a cash-on-delivery order auto-finalizes payment. Cancelling releases the stock hold, or restocks it if payment had already been finalized. Every transition notifies the buyer.
- Shared display helpers: `orderStatusLabels`, `orderStatusColors`, `paymentStatusLabels`, `paymentStatusColors`.

**Buyer pages**
- `/orders` — list of the signed-in buyer's orders (status, payment, item count, total).
- `/orders/[id]` — order detail: shipping address, line items, subtotal/shipping/total, and a **Cancel order** button (shown only while the order is still `pending` or `processing`).
- "My Orders" button added next to Sign out in the buyer shop shell (`ShopShell`).

**Seller pages**
- `/seller/orders` — every order that contains at least one of the seller's products, grouped with buyer name, item list, and status badges.
- Status-advance / cancel actions on each row ("Mark processing", "Mark shipped", "Mark delivered", "Cancel"), enabled based on the order's current status.
- The seller shell (`SellerShell`, moved to `seller/_components/SellerShell.tsx` so both Products and Orders pages share it) now has a working **Orders** nav link.

**Not built (out of scope)**: cart UI, checkout UI (address/payment selection form), address management UI. These belong to the Cart/Checkout module or a future task. `createOrderFromCart` is ready for that module to call once it collects a `shippingAddressID` and `paymentMethod`.

## 2. Automated tests (authoritative check)

`tests/int/orders.int.spec.ts` runs against your real dev Postgres database and covers every behavior below in code. If you'd rather not click through the browser, this is the fastest way to confirm the module works:

```bash
pnpm run test:int
```

All 7 tests (6 for this module + 1 pre-existing) should pass.

## 3. Manual browser walkthrough

### 3.1 Prerequisites

- Dev server running: `pnpm dev` (or your usual local setup).
- A working Postgres connection (same `.env` used by the app/tests).

### 3.2 Setting up test data

Because there's no cart/checkout UI yet, use the throwaway scripts below to create a
seller, a buyer, a product with two variants and stock, a shipping address, and a cart.
**These are not part of the repo** — save each block as a temporary `.ts` file at the
project root, run it once with `pnpm exec tsx <file>.ts`, then delete the file when
you're done testing. Each script ends with `process.exit(0)` so it terminates on its
own (Payload's DB pool would otherwise keep the process alive).

**`tmp-seed.ts`** — run once:

```ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const seller = await payload.create({
  collection: 'users',
  data: {
    accountStatus: 'active',
    email: 'order-demo-seller@example.com',
    fullName: 'Demo Seller',
    password: 'test1234',
    role: 'customer',
  },
})

const buyer = await payload.create({
  collection: 'users',
  data: {
    accountStatus: 'active',
    email: 'order-demo-buyer@example.com',
    fullName: 'Demo Buyer',
    password: 'test1234',
    role: 'customer',
  },
})

const category = await payload.create({
  collection: 'categories',
  data: { categoryName: 'Demo Category', slug: 'order-demo-category', title: 'Demo Category' },
})

const product = await payload.create({
  collection: 'products',
  data: {
    basePrice: 50,
    category: category.id,
    description: 'Demo product for order module testing',
    productName: 'Order Demo Tee',
    seller: seller.id,
    status: 'available',
  },
})

const variantM = await payload.create({
  collection: 'product-variants',
  data: { additionalPrice: 5, color: 'Black', product: product.id, size: 'M' },
})
const variantL = await payload.create({
  collection: 'product-variants',
  data: { additionalPrice: 8, color: 'White', product: product.id, size: 'L' },
})

await payload.create({
  collection: 'inventory',
  data: { reservedQuantity: 0, stockQuantity: 10, variant: variantM.id },
})
await payload.create({
  collection: 'inventory',
  data: { reservedQuantity: 0, stockQuantity: 10, variant: variantL.id },
})

const address = await payload.create({
  collection: 'addresses',
  data: {
    addressLine1: '1 Demo Street',
    city: 'Johor Bahru',
    country: 'Malaysia',
    phoneNumber: '0123456789',
    postcode: '80000',
    receiverName: 'Demo Buyer',
    state: 'Johor',
    user: buyer.id,
  },
})

console.log({
  addressID: address.id,
  buyerLogin: { email: buyer.email, password: 'test1234' },
  sellerLogin: { email: seller.email, password: 'test1234' },
  variantL: variantL.id,
  variantM: variantM.id,
})
process.exit(0) // getPayload() keeps a DB pool open, so exit explicitly
```

Note the printed `variantM` / `variantL` / `addressID` values — you'll need them next.

**`tmp-add-to-cart.ts`** — run before each order you want to place (edit the variant IDs/quantities to taste):

```ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const { docs: buyers } = await payload.find({
  collection: 'users',
  where: { email: { equals: 'order-demo-buyer@example.com' } },
})
const buyer = buyers[0]

const { docs: existingCarts } = await payload.find({
  collection: 'carts',
  where: { user: { equals: buyer.id } },
})
const cart = existingCarts[0] || (await payload.create({ collection: 'carts', data: { user: buyer.id } }))

// Replace with the variant IDs printed by tmp-seed.ts
await payload.create({ collection: 'cart-items', data: { cart: cart.id, quantity: 2, variant: 1 } })
await payload.create({ collection: 'cart-items', data: { cart: cart.id, quantity: 1, variant: 2 } })

console.log(`Added items to cart ${cart.id} for buyer ${buyer.id}`)
process.exit(0)
```

### 3.3 Test: placing an order (cash on delivery)

This simulates what the checkout button will eventually do by calling the same
function (`createOrderFromCart`) the server action (`placeOrder` in
`src/app/(frontend)/orders/actions.ts`) uses.

**`tmp-place-order.ts`**:

```ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createOrderFromCart } from './src/lib/orders'

const payload = await getPayload({ config })

const { docs: buyers } = await payload.find({
  collection: 'users',
  where: { email: { equals: 'order-demo-buyer@example.com' } },
})
const buyer = buyers[0]

const { docs: addresses } = await payload.find({
  collection: 'addresses',
  where: { user: { equals: buyer.id } },
})

const order = await createOrderFromCart(payload, buyer, {
  paymentMethod: 'cash-on-delivery', // or 'card' / 'online-banking'
  shippingAddressID: addresses[0].id,
})

console.log(`Created order ${order.id} — status: ${order.orderStatus}, payment: ${order.paymentStatus}`)
process.exit(0)
```

Run `tmp-add-to-cart.ts` then `tmp-place-order.ts`.

1. **Log in as the buyer** at `/login` with `order-demo-buyer@example.com` / `test1234`.
2. Go to `/orders`. You should see the new order with status **Pending** and payment **Pending**.
3. Open the order (`/orders/<id>`). Confirm:
   - Shipping address matches the seeded address.
   - Both line items are listed with the correct variant, quantity, unit price, and subtotal.
   - Subtotal + shipping fee (RM 10) = total.
   - A **Cancel order** button is visible (order is still `pending`).

### 3.4 Test: card payment confirms instantly

Run `tmp-add-to-cart.ts` again, then edit `tmp-place-order.ts` to use
`paymentMethod: 'card'` and run it again.

- On `/orders`, the new order should show payment **Paid** immediately (no seller action needed), while order status is still **Pending**.

### 3.5 Test: cancelling an order releases inventory

1. Pick one of the still-`pending` orders from 3.3/3.4 and open it in `/orders/<id>`.
2. Click **Cancel order**. Confirm the status badge flips to **Cancelled** and the button disappears.
3. Optionally verify in a script that the variant's `inventory.reservedQuantity` dropped back down (it should no longer include this order's held quantity).

### 3.6 Test: seller fulfillment flow + COD auto-payment

1. **Log in as the seller** at `/login` with `order-demo-seller@example.com` / `test1234`.
2. Go to `/seller/orders` (via the **Orders** link in the seller nav). You should see every non-cancelled order that contains this seller's product, with buyer name and item list.
3. Pick the cash-on-delivery order from 3.3 (still **Pending** / payment **Pending**).
4. Click **Mark processing** → status becomes **Processing**.
5. Click **Mark shipped** → status becomes **Shipped**.
6. Click **Mark delivered** → status becomes **Delivered**, and payment should flip to **Paid** automatically (cash-on-delivery is only confirmed on delivery).
7. Log back in as the buyer and check `/orders/<id>` for that order — it should now show **Delivered** / **Paid**, and the **Cancel order** button should no longer appear.

### 3.7 Test: guard rails (expected failures)

These aren't reachable through the UI (there's no button for a buyer to advance
fulfillment status, and no button to skip a status), so they're verified by the
automated suite instead — see `tests/int/orders.int.spec.ts`:
- A buyer cannot advance `orderStatus` (only cancel) — attempting it throws
  `"Only the seller can update this order's fulfillment status."`
- An order can't skip stages (e.g. `pending` → `delivered` directly) or be
  cancelled once `delivered`.
- A seller cannot place an order for their own product (checked in
  `createOrderFromCart`).

### 3.8 Cleaning up

**`tmp-cleanup.ts`** — deletes everything the scripts above created:

```ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const { docs: users } = await payload.find({
  collection: 'users',
  where: { email: { in: ['order-demo-seller@example.com', 'order-demo-buyer@example.com'] } },
})
const userIDs = users.map((user) => user.id)

const { docs: orders } = await payload.find({ collection: 'orders', where: { buyer: { in: userIDs } } })
for (const order of orders) {
  await payload.delete({ collection: 'order-items', where: { order: { equals: order.id } } })
  await payload.delete({ id: order.id, collection: 'orders' })
}

await payload.delete({ collection: 'notifications', where: { user: { in: userIDs } } })
await payload.delete({ collection: 'cart-items', where: {} }).catch(() => {}) // narrow this if you have other real cart data
await payload.delete({ collection: 'carts', where: { user: { in: userIDs } } })
await payload.delete({ collection: 'addresses', where: { user: { in: userIDs } } })

const { docs: products } = await payload.find({ collection: 'products', where: { seller: { in: userIDs } } })
for (const product of products) {
  await payload.delete({ collection: 'inventory', where: {} }).catch(() => {})
  await payload.delete({ collection: 'product-variants', where: { product: { equals: product.id } } })
  await payload.delete({ id: product.id, collection: 'products' })
}

await payload.delete({ collection: 'categories', where: { slug: { equals: 'order-demo-category' } } })
for (const id of userIDs) {
  await payload.delete({ id, collection: 'users' })
}

console.log('Cleanup done.')
process.exit(0)
```

> The `cart-items` and `inventory` deletes above use an empty `where` as a
> shortcut — double-check your database only has the demo data before running
> this, or narrow the `where` to the specific variant/cart IDs printed by
> `tmp-seed.ts`.

Delete the `tmp-*.ts` files afterward — they should not be committed.

## 4. Quick reference: files touched

| Area | Path |
|---|---|
| Core logic | `src/lib/orders.ts` |
| Buyer order list | `src/app/(frontend)/orders/page.tsx` |
| Buyer order detail | `src/app/(frontend)/orders/[id]/page.tsx` |
| Buyer server actions | `src/app/(frontend)/orders/actions.ts` |
| Seller order list | `src/app/(frontend)/seller/orders/page.tsx` |
| Seller server actions | `src/app/(frontend)/seller/orders/actions.ts` |
| Shared seller shell | `src/app/(frontend)/seller/_components/SellerShell.tsx` |
| Integration tests | `tests/int/orders.int.spec.ts` |
