import configPromise from '@payload-config'
import { Card, Stack, Text, ThemeIcon } from '@mantine/core'
import { PackageSearch } from 'lucide-react'
import { getPayload } from 'payload'

import type { Order, Product, ProductVariant, User } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import { SellerShell } from '../_components/SellerShell'
import { SellerOrdersTable, type SellerOrderRow } from './_components/SellerOrdersTable'

export const metadata = {
  title: 'Seller Orders | eJual',
}

export const dynamic = 'force-dynamic'

export default async function SellerOrdersPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const { docs: orderItems } = await payload.find({
    collection: 'order-items',
    depth: 2,
    limit: 500,
    where: { seller: { equals: user.id } },
  })

  const orderIDs = [
    ...new Set(
      orderItems.map((item) => (typeof item.order === 'number' ? item.order : item.order.id)),
    ),
  ]

  const { docs: orders } = orderIDs.length
    ? await payload.find({
        collection: 'orders',
        depth: 1,
        limit: 500,
        sort: '-orderDate',
        where: { id: { in: orderIDs } },
      })
    : { docs: [] as Order[] }

  const itemsByOrder = new Map<number, typeof orderItems>()
  for (const item of orderItems) {
    const orderID = typeof item.order === 'number' ? item.order : item.order.id
    itemsByOrder.set(orderID, [...(itemsByOrder.get(orderID) || []), item])
  }

  const rows: SellerOrderRow[] = orders.map((order) => {
    const buyer = order.buyer as User
    const items = itemsByOrder.get(order.id) || []

    return {
      buyerLabel: buyer.fullName || buyer.email,
      id: order.id,
      items: items.map((item) => {
        const variant = item.variant as ProductVariant
        const product = variant.product as Product
        return {
          id: item.id,
          label: `${item.quantity}x ${product.productName} (${variant.color} · ${variant.size})`,
        }
      }),
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    }
  })

  return (
    <SellerShell
      activeNav="orders"
      description="Track orders that include your products and move them through fulfillment."
      title="Orders"
      userLabel={user.fullName || user.email}
    >
      {rows.length === 0 ? (
        <Card py="xl">
          <Stack align="center" gap="sm" ta="center">
            <ThemeIcon radius="xl" size={56} variant="light">
              <PackageSearch size={28} />
            </ThemeIcon>
            <Text fw={700} size="lg">
              No orders yet
            </Text>
            <Text c="dimmed" maw={460}>
              Orders that include your products will show up here once buyers check out.
            </Text>
          </Stack>
        </Card>
      ) : (
        <SellerOrdersTable orders={rows} />
      )}
    </SellerShell>
  )
}
