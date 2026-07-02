'use client'

import { Badge, Button, Card, Table } from '@mantine/core'
import Link from 'next/link'

import { orderStatusColors, orderStatusLabels, paymentStatusColors, paymentStatusLabels } from '@/lib/orders'
import type { Order } from '@/payload-types'

export type OrderListRow = Pick<
  Order,
  'id' | 'orderDate' | 'orderStatus' | 'paymentStatus' | 'totalAmount'
> & {
  itemCount: number
}

export function OrdersTable({ orders }: { orders: OrderListRow[] }) {
  return (
    <Card p={0}>
      <Table highlightOnHover verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order</Table.Th>
            <Table.Th>Placed</Table.Th>
            <Table.Th>Items</Table.Th>
            <Table.Th>Payment</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.map((order) => (
            <Table.Tr key={order.id}>
              <Table.Td>#{order.id}</Table.Td>
              <Table.Td>{new Date(order.orderDate).toLocaleDateString()}</Table.Td>
              <Table.Td>{order.itemCount}</Table.Td>
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
              <Table.Td>RM {order.totalAmount.toFixed(2)}</Table.Td>
              <Table.Td>
                <Button component={Link} href={`/orders/${order.id}`} size="xs" variant="light">
                  View
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  )
}
