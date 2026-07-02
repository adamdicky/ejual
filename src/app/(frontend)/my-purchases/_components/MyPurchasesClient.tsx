'use client'

import { Accordion, Badge, Button, Card, Divider, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { CalendarDays, CreditCard, PackageCheck, ShoppingBag, Truck } from 'lucide-react'
import Link from 'next/link'

import { formatDateTime } from '@/utilities/formatDateTime'

type PurchaseItem = {
  id: number
  productName: string
  quantity: number
  subtotal: number
  unitPrice: number
  variantColor: string
  variantSize: string
}

type Purchase = {
  id: number
  items: PurchaseItem[]
  orderDate: string
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  shippingFee: number
  subtotal: number
  totalAmount: number
}

type MyPurchasesClientProps = {
  purchases: Purchase[]
}

type StatusTone = 'gray' | 'teal' | 'red' | 'blue' | 'orange'

const orderStatusTone: Record<string, StatusTone> = {
  cancelled: 'red',
  delivered: 'teal',
  pending: 'gray',
  processing: 'blue',
  shipped: 'orange',
}

const paymentStatusTone: Record<string, StatusTone> = {
  failed: 'red',
  paid: 'teal',
  pending: 'orange',
}

const humanize = (value: string) => value.replace(/-/g, ' ')

const formatPrice = (value: number) => `RM ${value.toFixed(2)}`

export function MyPurchasesClient({ purchases }: MyPurchasesClientProps) {
  const totalSpent = purchases.reduce((total, purchase) => total + purchase.totalAmount, 0)

  const renderOrderCard = (order: Purchase) => (
    <Card key={order.id} p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <Stack gap={2}>
            <Group gap="xs">
              <Text fw={700}>Order #{order.id}</Text>
              <Badge radius="sm" variant="outline">
                {order.items.length} item{order.items.length === 1 ? '' : 's'}
              </Badge>
            </Group>
            <Group c="dimmed" gap={6}>
              <CalendarDays size={14} />
              <Text size="sm">Placed on {formatDateTime(order.orderDate)}</Text>
            </Group>
          </Stack>
          <Group gap="xs">
            <Badge color={paymentStatusTone[order.paymentStatus] || 'gray'} radius="sm" variant="light">
              Payment: {humanize(order.paymentStatus)}
            </Badge>
            <Badge color={orderStatusTone[order.orderStatus] || 'gray'} radius="sm" variant="light">
              Order: {humanize(order.orderStatus)}
            </Badge>
          </Group>
        </Group>

        <Divider />

        <Stack gap="sm">
          {order.items.map((item) => (
            <Card key={item.id} p="sm" radius="md" withBorder>
              <Group justify="space-between" wrap="wrap">
                <Stack gap={0}>
                  <Text fw={600}>{item.productName}</Text>
                  <Text c="dimmed" size="sm">
                    Variant {item.variantColor} · {item.variantSize}
                  </Text>
                  <Text c="dimmed" size="sm">
                    Quantity {item.quantity}
                  </Text>
                </Stack>
                <Stack align="flex-end" gap={0}>
                  <Text c="dimmed" size="sm">
                    {formatPrice(item.unitPrice)} each
                  </Text>
                  <Text fw={600}>{formatPrice(item.subtotal)}</Text>
                </Stack>
              </Group>
            </Card>
          ))}
        </Stack>

        <Card p="sm" radius="md" withBorder>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text c="dimmed">Subtotal</Text>
              <Text>{formatPrice(order.subtotal)}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">Shipping</Text>
              <Text>{formatPrice(order.shippingFee)}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={700}>Total</Text>
              <Text fw={700}>{formatPrice(order.totalAmount)}</Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Card>
  )

  return (
    <Stack gap="lg">
      <Group align="flex-start" justify="space-between" wrap="wrap">
        <Stack gap={4}>
          <Title order={1}>My Purchases</Title>
          <Text c="dimmed">Track your order and payment status for each purchase.</Text>
        </Stack>
        <Button component={Link} href="/shop" leftSection={<ShoppingBag size={16} />} variant="default">
          Continue shopping
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card p="md" withBorder>
          <Group gap="sm">
            <ThemeIcon color="teal" radius="md" size="lg" variant="light">
              <PackageCheck size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text c="dimmed" size="sm">
                Total orders
              </Text>
              <Text fw={700} size="xl">
                {purchases.length}
              </Text>
            </Stack>
          </Group>
        </Card>
        <Card p="md" withBorder>
          <Group gap="sm">
            <ThemeIcon color="blue" radius="md" size="lg" variant="light">
              <Truck size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text c="dimmed" size="sm">
                Active deliveries
              </Text>
              <Text fw={700} size="xl">
                {
                  purchases.filter(
                    (purchase) => purchase.orderStatus === 'pending' || purchase.orderStatus === 'processing' || purchase.orderStatus === 'shipped',
                  ).length
                }
              </Text>
            </Stack>
          </Group>
        </Card>
        <Card p="md" withBorder>
          <Group gap="sm">
            <ThemeIcon color="orange" radius="md" size="lg" variant="light">
              <CreditCard size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text c="dimmed" size="sm">
                Total spent
              </Text>
              <Text fw={700} size="xl">
                {formatPrice(totalSpent)}
              </Text>
            </Stack>
          </Group>
        </Card>
      </SimpleGrid>

      {!purchases.length ? (
        <Card p="xl">
          <Stack align="center" gap="sm" ta="center">
            <PackageCheck size={44} />
            <Text fw={700}>No purchases yet</Text>
            <Text c="dimmed">Your completed checkouts will appear here.</Text>
            <Button component={Link} href="/shop" variant="filled">
              Browse products
            </Button>
          </Stack>
        </Card>
      ) : (
        purchases.length > 1 ? (
          <Accordion chevronPosition="right" variant="separated">
            {purchases.map((order) => (
              <Accordion.Item key={order.id} value={String(order.id)}>
                <Accordion.Control>
                  <Group justify="space-between" w="100%" wrap="wrap">
                    <Stack gap={2}>
                      <Text fw={700}>Order #{order.id}</Text>
                      <Text c="dimmed" size="sm">
                        Placed on {formatDateTime(order.orderDate)}
                      </Text>
                    </Stack>
                    <Group gap="xs">
                      <Badge color={paymentStatusTone[order.paymentStatus] || 'gray'} radius="sm" variant="light">
                        Payment: {humanize(order.paymentStatus)}
                      </Badge>
                      <Badge color={orderStatusTone[order.orderStatus] || 'gray'} radius="sm" variant="light">
                        Order: {humanize(order.orderStatus)}
                      </Badge>
                    </Group>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>{renderOrderCard(order)}</Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Stack gap="md">{purchases.map((order) => renderOrderCard(order))}</Stack>
        )
      )}
    </Stack>
  )
}
