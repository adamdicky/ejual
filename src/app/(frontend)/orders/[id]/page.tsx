import configPromise from '@payload-config'
import { Badge, Button, Card, Container, Divider, Group, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import type { Address, Product, ProductVariant, User } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import {
  orderStatusColors,
  orderStatusLabels,
  paymentStatusColors,
  paymentStatusLabels,
} from '@/lib/orders'
import { CancelOrderButton } from '../_components/CancelOrderButton'
import { OrderItemsTable, type OrderDetailItemRow } from '../_components/OrderItemsTable'

type OrderDetailPageProps = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Order Details | eJual',
}

const CANCELLABLE_STATUSES = new Set(['pending', 'processing'])

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const orderID = Number(id)
  if (!Number.isInteger(orderID)) notFound()

  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const { docs: orders } = await payload.find({
    collection: 'orders',
    depth: 1,
    limit: 1,
    where: { and: [{ id: { equals: orderID } }, { buyer: { equals: user.id } }] },
  })

  const order = orders[0]
  if (!order) notFound()

  const { docs: orderItems } = await payload.find({
    collection: 'order-items',
    depth: 2,
    limit: 200,
    where: { order: { equals: orderID } },
  })

  const address = order.shippingAddress as Address

  const itemRows: OrderDetailItemRow[] = orderItems.map((item) => {
    const variant = item.variant as ProductVariant
    const product = variant.product as Product
    const seller = item.seller as User

    return {
      id: item.id,
      productName: product.productName,
      quantity: item.quantity,
      sellerName: seller.fullName || seller.name || 'eJual seller',
      subtotal: item.subtotal,
      unitPrice: item.unitPrice,
      variantLabel: `${variant.color} · ${variant.size}`,
    }
  })

  return (
    <Container maw={1000} py="xl">
      <Stack gap="lg">
        <Group align="flex-start" justify="space-between">
          <Stack gap={4}>
            <Title order={1}>Order #{order.id}</Title>
            <Text c="dimmed">Placed on {new Date(order.orderDate).toLocaleString()}</Text>
          </Stack>
          <Link href="/orders" style={{ textDecoration: 'none' }}>
            <Button component="span" variant="default">
              Back to orders
            </Button>
          </Link>
        </Group>

        <Group gap="sm">
          <Badge color={orderStatusColors[order.orderStatus]} size="lg" variant="light">
            {orderStatusLabels[order.orderStatus]}
          </Badge>
          <Badge color={paymentStatusColors[order.paymentStatus]} size="lg" variant="light">
            Payment {paymentStatusLabels[order.paymentStatus]}
          </Badge>
        </Group>

        <Card>
          <Stack gap="xs">
            <Text fw={700}>Shipping address</Text>
            <Text>{address.receiverName}</Text>
            <Text c="dimmed">{address.phoneNumber}</Text>
            <Text c="dimmed">
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''}
            </Text>
            <Text c="dimmed">
              {address.city}, {address.state} {address.postcode}, {address.country}
            </Text>
          </Stack>
        </Card>

        <Card p={0}>
          <OrderItemsTable items={itemRows} />
        </Card>

        <Card>
          <Stack gap={6}>
            <Group justify="space-between">
              <Text c="dimmed">Subtotal</Text>
              <Text>RM {order.subtotal.toFixed(2)}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">Shipping fee</Text>
              <Text>RM {order.shippingFee.toFixed(2)}</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text fw={700}>Total</Text>
              <Text fw={700} size="lg">
                RM {order.totalAmount.toFixed(2)}
              </Text>
            </Group>
          </Stack>
        </Card>

        {CANCELLABLE_STATUSES.has(order.orderStatus) ? (
          <Group justify="flex-end">
            <CancelOrderButton orderID={order.id} />
          </Group>
        ) : null}
      </Stack>
    </Container>
  )
}
