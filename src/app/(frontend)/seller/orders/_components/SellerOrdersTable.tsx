'use client'

import { Badge, Card, Group, ScrollArea, Stack, Table, Text } from '@mantine/core'

import { orderStatusColors, orderStatusLabels, paymentStatusColors, paymentStatusLabels } from '@/lib/orders'
import type { Order } from '@/payload-types'
import { OrderStatusActions } from './OrderStatusActions'

export type SellerOrderRow = Pick<Order, 'id' | 'orderDate' | 'orderStatus' | 'paymentStatus'> & {
  buyerLabel: string
  items: { id: number; label: string }[]
}

export function SellerOrdersTable({ orders }: { orders: SellerOrderRow[] }) {
  return (
    <Card p={0}>
      <ScrollArea>
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order</Table.Th>
              <Table.Th>Buyer</Table.Th>
              <Table.Th>Your items</Table.Th>
              <Table.Th>Payment</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>
                  <Text fw={600}>#{order.id}</Text>
                  <Text c="dimmed" size="sm">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </Text>
                </Table.Td>
                <Table.Td>{order.buyerLabel}</Table.Td>
                <Table.Td>
                  <Stack gap={2}>
                    {order.items.map((item) => (
                      <Text key={item.id} size="sm">
                        {item.label}
                      </Text>
                    ))}
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Badge color={paymentStatusColors[order.paymentStatus]} variant="light">
                    {paymentStatusLabels[order.paymentStatus]}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={orderStatusColors[order.orderStatus]} variant="light">
                    {orderStatusLabels[order.orderStatus]}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group justify="flex-end">
                    <OrderStatusActions orderID={order.id} orderStatus={order.orderStatus} />
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  )
}
