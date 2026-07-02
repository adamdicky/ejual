'use client'

import { Table } from '@mantine/core'

export type OrderDetailItemRow = {
  id: number
  productName: string
  quantity: number
  sellerName: string
  subtotal: number
  unitPrice: number
  variantLabel: string
}

export function OrderItemsTable({ items }: { items: OrderDetailItemRow[] }) {
  return (
    <Table verticalSpacing="md">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Item</Table.Th>
          <Table.Th>Sold by</Table.Th>
          <Table.Th>Qty</Table.Th>
          <Table.Th>Unit price</Table.Th>
          <Table.Th>Subtotal</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((item) => (
          <Table.Tr key={item.id}>
            <Table.Td>
              <div>
                <strong>{item.productName}</strong>
                <div style={{ color: 'var(--mantine-color-dimmed)', fontSize: 13 }}>
                  {item.variantLabel}
                </div>
              </div>
            </Table.Td>
            <Table.Td>{item.sellerName}</Table.Td>
            <Table.Td>{item.quantity}</Table.Td>
            <Table.Td>RM {item.unitPrice.toFixed(2)}</Table.Td>
            <Table.Td>RM {item.subtotal.toFixed(2)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
