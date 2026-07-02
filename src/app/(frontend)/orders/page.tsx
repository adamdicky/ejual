import configPromise from '@payload-config'
import { Button, Card, Container, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { PackageSearch, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

import { getMeUser } from '@/utilities/getMeUser'
import { OrdersTable, type OrderListRow } from './_components/OrdersTable'

export const metadata = {
  title: 'My Orders | eJual',
}

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const { docs: orders } = await payload.find({
    collection: 'orders',
    limit: 100,
    sort: '-orderDate',
    where: { buyer: { equals: user.id } },
  })

  const orderIDs = orders.map((order) => order.id)
  const { docs: orderItems } = orderIDs.length
    ? await payload.find({
        collection: 'order-items',
        limit: 500,
        where: { order: { in: orderIDs } },
      })
    : { docs: [] as { id: number; order: number | { id: number } }[] }

  const itemCountByOrder = new Map<number, number>()
  for (const item of orderItems) {
    const orderID = typeof item.order === 'number' ? item.order : item.order.id
    itemCountByOrder.set(orderID, (itemCountByOrder.get(orderID) || 0) + 1)
  }

  const rows: OrderListRow[] = orders.map((order) => ({
    id: order.id,
    itemCount: itemCountByOrder.get(order.id) || 0,
    orderDate: order.orderDate,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount,
  }))

  return (
    <Container maw={1100} py="xl">
      <Stack gap="lg">
        <Group align="flex-start" justify="space-between">
          <Group gap="xs">
            <ShoppingBag size={26} strokeWidth={1.8} />
            <Title order={1}>My Orders</Title>
          </Group>
          <Link href="/shop" style={{ textDecoration: 'none' }}>
            <Button component="span" variant="default">
              Back to shop
            </Button>
          </Link>
        </Group>

        {rows.length === 0 ? (
          <Card py="xl">
            <Stack align="center" gap="sm" ta="center">
              <ThemeIcon radius="xl" size={56} variant="light">
                <PackageSearch size={28} />
              </ThemeIcon>
              <Text fw={700} size="lg">
                No orders yet
              </Text>
              <Text c="dimmed" maw={420}>
                Items you check out from your cart will show up here so you can track payment and
                delivery status.
              </Text>
              <Link href="/shop" style={{ textDecoration: 'none' }}>
                <Button component="span">Browse the shop</Button>
              </Link>
            </Stack>
          </Card>
        ) : (
          <OrdersTable orders={rows} />
        )}
      </Stack>
    </Container>
  )
}
