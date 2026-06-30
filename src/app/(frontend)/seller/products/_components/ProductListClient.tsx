'use client'

import {
  Badge,
  Button,
  Card,
  Group,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core'
import { Box, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import {
  getProductStock,
  productStatusColors,
  productStatusLabels,
  productStatusOptions,
  type SellerProductRow,
} from '../_lib'

type ProductListClientProps = {
  products: SellerProductRow[]
}

export function ProductListClient({ products }: ProductListClientProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.productName.toLowerCase().includes(normalizedQuery) ||
        product.category.categoryName.toLowerCase().includes(normalizedQuery)

      const matchesStatus = !status || product.status === status

      return matchesQuery && matchesStatus
    })
  }, [products, query, status])

  if (products.length === 0) {
    return (
      <Card py="xl">
        <Stack align="center" gap="md" ta="center">
          <ThemeIcon radius="xl" size={56} variant="light">
            <Box size={28} />
          </ThemeIcon>
          <Stack gap={4}>
            <Text fw={700} size="lg">
              No products yet
            </Text>
            <Text c="dimmed" maw={460}>
              Create your first listing so buyers can discover what you sell on eJual.
            </Text>
          </Stack>
          <Button component={Link} href="/seller/products/new">
            Add product
          </Button>
        </Stack>
      </Card>
    )
  }

  return (
    <Stack gap="md">
      <Card>
        <Group align="end" justify="space-between">
          <Group grow style={{ flex: 1 }}>
            <TextInput
              leftSection={<Search size={16} />}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search by product or category"
              value={query}
            />
            <Select
              clearable
              data={productStatusOptions}
              onChange={setStatus}
              placeholder="Filter by status"
              value={status}
            />
          </Group>
          <Text c="dimmed" size="sm">
            {filteredProducts.length} of {products.length} products
          </Text>
        </Group>
      </Card>

      <Card p={0}>
        <ScrollArea>
          <Table highlightOnHover verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Base price</Table.Th>
                <Table.Th>Variants</Table.Th>
                <Table.Th>Available stock</Table.Th>
                <Table.Th>Updated</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredProducts.map((product) => (
                <Table.Tr key={product.id}>
                  <Table.Td>
                    <Text fw={600}>{product.productName}</Text>
                    <Text c="dimmed" lineClamp={1} size="sm">
                      {product.description}
                    </Text>
                  </Table.Td>
                  <Table.Td>{product.category.categoryName}</Table.Td>
                  <Table.Td>
                    <Badge color={productStatusColors[product.status]} variant="light">
                      {productStatusLabels[product.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>RM {product.basePrice.toFixed(2)}</Table.Td>
                  <Table.Td>{product.variants.length}</Table.Td>
                  <Table.Td>{getProductStock(product)}</Table.Td>
                  <Table.Td>{new Date(product.updatedAt).toLocaleDateString()}</Table.Td>
                  <Table.Td>
                    <Button
                      component={Link}
                      href={`/seller/products/${product.id}/edit`}
                      size="xs"
                      variant="light"
                    >
                      Manage
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Stack>
  )
}
