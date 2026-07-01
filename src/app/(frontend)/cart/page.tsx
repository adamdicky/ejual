import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { ShopShell } from '@/app/(frontend)/shop/_components/ShopShell'
import { getMeUser } from '@/utilities/getMeUser'
import { CartPageClient } from './_components/CartPageClient'
import { calculateCartTotals, getAvailableInventoryQuantity } from './_lib'

export const metadata = {
  title: 'Your Cart',
}

export const dynamic = 'force-dynamic'

export default async function CartPage({ searchParams }: { searchParams?: Promise<{ placed?: string }> }) {
  const params = await searchParams
  const currentUser = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const { docs: carts } = await payload.find({
    collection: 'carts',
    limit: 1,
    overrideAccess: false,
    user: currentUser.user,
    where: { user: { equals: currentUser.user.id } },
  })

  const cart = carts[0]
  const cartItems = cart
    ? await payload.find({
        collection: 'cart-items',
        depth: 2,
        limit: 100,
        overrideAccess: false,
        user: currentUser.user,
        where: { cart: { equals: cart.id } },
      })
    : { docs: [] }

  const addresses = await payload.find({
    collection: 'addresses',
    limit: 100,
    overrideAccess: false,
    user: currentUser.user,
    where: { user: { equals: currentUser.user.id } },
  })

  const items = await Promise.all(
    cartItems.docs.map(async (item) => {
      const variant = item.variant as { id: number; color: string; size: string; additionalPrice?: number; product?: number | { id: number; productName?: string; basePrice?: number; seller?: number | { id: number } } }
      const inventoryDoc = await payload.find({
        collection: 'inventory',
        limit: 1,
        where: { variant: { equals: variant.id } },
      })

      const inventory = inventoryDoc.docs[0]
      const product = variant.product && typeof variant.product === 'object' ? variant.product : null
      const availableStock = inventory
        ? getAvailableInventoryQuantity(inventory.stockQuantity, inventory.reservedQuantity)
        : 0

      return {
        availableStock,
        description: product?.productName || 'Product',
        id: item.id,
        productID: product?.id || 0,
        quantity: item.quantity,
        sellerName: product?.seller && typeof product.seller === 'object' ? product.seller.id : null,
        unitPrice: (product?.basePrice || 0) + (variant.additionalPrice || 0),
        variantColor: variant.color,
        variantID: variant.id,
        variantSize: variant.size,
      }
    }),
  )

  const totals = calculateCartTotals(items.map((item) => ({ quantity: item.quantity, unitPrice: item.unitPrice })))
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <ShopShell cartItemCount={cartItemCount} currentUserLabel={currentUser.user.fullName || currentUser.user.email || null}>
      <CartPageClient
        addresses={addresses.docs.map((address) => ({
          id: address.id,
          label: `${address.receiverName} · ${address.addressLine1}, ${address.city}`,
        }))}
        items={items}
        placed={params?.placed === '1'}
        totals={totals}
      />
    </ShopShell>
  )
}
