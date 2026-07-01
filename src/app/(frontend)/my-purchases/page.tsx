import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { ShopShell } from '@/app/(frontend)/shop/_components/ShopShell'
import { getMeUser } from '@/utilities/getMeUser'
import { MyPurchasesClient } from './_components/MyPurchasesClient'

export const metadata = {
  title: 'My Purchases',
}

export const dynamic = 'force-dynamic'

const getRelationshipID = (value: number | { id: number } | null | undefined): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) return value.id
  return null
}

export default async function MyPurchasesPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const [{ docs: cartItems }, { docs: orders }] = await Promise.all([
    payload.find({
      collection: 'cart-items',
      limit: 100,
      overrideAccess: false,
      user,
      where: { 'cart.user': { equals: user.id } },
    }),
    payload.find({
      collection: 'orders',
      limit: 100,
      overrideAccess: false,
      sort: '-orderDate',
      user,
      where: { buyer: { equals: user.id } },
    }),
  ])

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const orderIDs = orders.map((order) => order.id)

  const { docs: orderItems } = orderIDs.length
    ? await payload.find({
        collection: 'order-items',
        depth: 2,
        limit: 500,
        overrideAccess: false,
        sort: '-createdAt',
        user,
        where: { order: { in: orderIDs } },
      })
    : { docs: [] }

  const purchases = orders.map((order) => {
    const items = orderItems
      .filter((item) => getRelationshipID(item.order as number | { id: number }) === order.id)
      .map((item) => {
        const variant = item.variant && typeof item.variant === 'object' ? item.variant : null
        const product = variant?.product && typeof variant.product === 'object' ? variant.product : null

        return {
          id: item.id,
          productName: product?.productName || 'Product',
          quantity: item.quantity,
          subtotal: item.subtotal,
          unitPrice: item.unitPrice,
          variantColor: variant?.color || '-',
          variantSize: variant?.size || '-',
        }
      })

    return {
      id: order.id,
      items,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      shippingFee: order.shippingFee,
      subtotal: order.subtotal,
      totalAmount: order.totalAmount,
    }
  })

  return (
    <ShopShell cartItemCount={cartItemCount} currentUserLabel={user.fullName || user.email || null}>
      <MyPurchasesClient purchases={purchases} />
    </ShopShell>
  )
}
