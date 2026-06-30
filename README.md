# eJual

eJual is a clothing-focused e-commerce system built with Payload CMS, Next.js, PostgreSQL, and Mantine UI. The first completed development slice is the Product and Catalogue Management component for sellers. The next planned components are Cart and Checkout, followed by Order and Payment.

## Tech Stack

- Next.js App Router
- Payload CMS 3
- PostgreSQL through `@payloadcms/db-postgres`
- Mantine UI 9 for app-facing UI
- Geist font family
- Payload auth with the `users` collection and `payload-token` cookie
- Supabase S3-compatible storage for uploaded media when S3 environment variables are configured

## Current App Areas

- `/shop` - buyer catalogue view for browsing clothing products
- `/login` - app-facing login
- `/register` - app-facing registration
- `/seller/products` - seller product catalogue workspace
- `/seller/products/new` - seller product creation
- `/seller/products/[id]/edit` - seller product details, variants, images, and inventory
- `/admin` - Payload admin panel, restricted to users with `role === 'admin'`

Legacy Payload template pages such as `/`, `/search`, and `/posts` redirect into `/shop` so the buyer-facing experience stays consistent with eJual.

## Prerequisites

- Node.js `^18.20.2` or `>=20.9.0`
- pnpm `^9` or `^10`
- A PostgreSQL database. Supabase Postgres is the current expected development database.
- Optional: Supabase Storage configured with S3-compatible credentials for media uploads.

## Local Setup

1. Clone the repository.

```bash
git clone <repo-url>
cd e-jual
```

2. Install dependencies.

```bash
pnpm install
```

3. Create a local `.env` file.

There is no committed `.env.example` at the moment because secrets are project-specific. Ask the project owner for the current development values, then create `.env` in the project root with this shape:

```bash
DATABASE_URL="postgresql://..."
PAYLOAD_SECRET="replace-with-long-random-secret"
PREVIEW_SECRET="replace-with-long-random-secret"
CRON_SECRET="replace-with-long-random-secret"

# Optional but recommended when testing media uploads through Supabase S3
S3_BUCKET="ejual-media"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_ENDPOINT="https://<project-ref>.supabase.co/storage/v1/s3"
S3_REGION="ap-southeast-1"
```

Common URL variables:

```bash
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
__NEXT_PRIVATE_ORIGIN="http://localhost:3000"
```

4. Start the development server.

```bash
pnpm dev
```

5. Open the app.

- App: `http://localhost:3000/shop`
- Payload admin: `http://localhost:3000/admin`

## Database Notes

This project currently uses PostgreSQL, not MongoDB. The existing `docker-compose.yml` is inherited from the Payload template and still references Mongo/Yarn, so do not use it as the recommended eJual setup unless it is updated first.

For Supabase development, use the shared `DATABASE_URL` from the project owner. Be careful with Payload schema changes on shared or production-like databases. Do not generate or run destructive migrations unless the team has reviewed the data impact.

If Payload types need to be refreshed after collection changes:

```bash
pnpm payload generate:types
```

If the admin import map needs to be refreshed:

```bash
pnpm generate:importmap
```

## Main Collections

| Collection | Purpose |
| --- | --- |
| `users` | Payload auth users with `fullName`, `email`, `phoneNumber`, `profileImage`, `role`, and `accountStatus`. |
| `categories` | Clothing category taxonomy with `categoryName`, `title`, `description`, and `slug`. |
| `media` | Uploaded assets, backed by Supabase S3 when configured. |
| `products` | Seller-owned product listings with category, description, base price, status, and featured flag. |
| `product-variants` | Product color, size, and additional price combinations. |
| `product-images` | Product-level images with `displayOrder`. |
| `inventory` | One stock record per variant with `stockQuantity` and system-managed `reservedQuantity`. |
| `carts` | One cart per user. |
| `cart-items` | Variant and quantity rows belonging to a cart. |
| `addresses` | Buyer shipping addresses. |
| `orders` | Buyer order header, shipping address, payment state, order state, and totals. |
| `order-items` | Order line items with variant, seller, quantity, unit price, and subtotal. |
| `notifications` | User-facing order, promotion, or system messages. |

## Development Standards

Follow `AGENTS.md` before making changes. This repo uses Ponytail Mode:

- Pick the simplest solution that works.
- Reuse existing helpers, components, and patterns before adding new ones.
- Avoid speculative abstractions.
- Keep changes surgical.
- Do not revert unrelated user changes.
- Fix root causes, not symptoms.

For Payload work, start with `.agents/skills/payload/SKILL.md`.

For UI/UX work, use `/Users/admdc/.codex/skills/ui-professional/SKILL.md` when working locally with Codex. The important project rules are:

- Use Mantine components first.
- Keep UI responsive on mobile and desktop.
- Maintain consistent spacing, radius, typography, and color behavior.
- App pages need a clear title, short orientation copy, visible signed-in user state, and one dominant primary action.
- Status indicators must include text labels; do not rely on color alone.
- Seller pages should feel like quiet dashboards.
- Buyer pages should prioritize clothing catalogue browsing.
- Do not show Payload header, footer, or admin bar on buyer/seller/auth pages.

A fuller AI handoff guide exists at:

```text
output/pdf/ejual-development-standards.pdf
```

## Auth And Access Rules

- `/login` and `/register` are the app-facing auth routes.
- Successful login and registration redirect to `/shop`.
- `/admin/login` is only for Payload admin access.
- `/admin` is restricted to users with `role === 'admin'`.
- Customers must not access the Payload admin panel.
- Suspended users may view seller pages but must be blocked from seller mutations.
- Sellers must only view and mutate their own products.
- Buyers must not see or buy their own products.

## Backend Data Rules

- Server reads should use the Payload Local API from Server Components.
- Mutations should use server actions or route handlers.
- User-scoped Payload operations must pass `user` and `overrideAccess: false`.
- Seller mutations must verify product ownership before updating products, variants, images, or inventory.
- `reservedQuantity` is system-managed for cart/checkout reservation logic. Sellers should not edit it manually.
- Revalidate affected routes after mutations with `revalidatePath`.

## Scripts

```bash
pnpm dev                 # Start local dev server
pnpm run build           # Production build
pnpm start               # Start production server after build
pnpm exec tsc --noEmit   # TypeScript check
pnpm lint                # ESLint
pnpm run test:int        # Vitest integration tests
pnpm run test:e2e        # Playwright tests
pnpm test                # Integration + e2e tests
pnpm payload             # Payload CLI
pnpm generate:types      # Generate Payload TypeScript types
pnpm generate:importmap  # Generate Payload admin import map
```

## Verification Checklist

Before handing off a change:

1. Run TypeScript.

```bash
pnpm exec tsc --noEmit
```

2. Run a production build for route, collection, auth, or UI changes.

```bash
pnpm run build
```

3. For UI changes, verify desktop and mobile layouts in a browser.

Required route checks:

- `/shop`
- `/login`
- `/register`
- `/seller/products`
- `/seller/products/new`
- relevant `/seller/products/[id]/edit` pages
- `/admin`
- forbidden/not-found states

Check for:

- no horizontal overflow
- no clipped or overlapping text
- no Payload template chrome on app pages
- no unexpected console errors
- no unexpected non-2xx network requests

## Notes For Cart, Checkout, Order, And Payment Contributors

The next components should use the collections that already exist:

- Cart/Checkout: `carts`, `cart-items`, `inventory`, `addresses`, `products`, `product-variants`
- Order/Payment: `orders`, `order-items`, `addresses`, `inventory`, `notifications`

Expected behavior:

- Prevent users from adding their own products to cart.
- Calculate item price from `products.basePrice + product-variants.additionalPrice`.
- Copy checkout-time prices into `order-items.unitPrice` and `order-items.subtotal`.
- Preserve seller attribution on every order item.
- Update `paymentStatus` and `orderStatus` explicitly.
- Do not add new collections unless the existing model cannot represent the required behavior.

## Project Status

Completed:

- Product and Catalogue Management Component
- Seller product list, creation, edit, variants, images, inventory
- Product image upload through Payload media/Supabase S3
- Buyer shop catalogue
- App-facing login/register
- Admin-only Payload access guard

Next:

- Cart and Checkout Management Component
- Order and Payment Management Component
