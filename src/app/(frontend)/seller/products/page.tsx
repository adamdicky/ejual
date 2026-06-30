import configPromise from '@payload-config'
import { Alert, Card, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { AlertCircle, Box, Layers, PackageCheck } from 'lucide-react'
import { getPayload } from 'payload'

import type { Inventory, ProductImage, ProductVariant } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import { ProductListClient } from './_components/ProductListClient'
import { SellerShell } from './_components/SellerShell'
import { getProductStock, type SellerProductRow } from './_lib'

export default async function SellerProductsPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 100,
    sort: '-updatedAt',
    where: {
      seller: {
        equals: user.id,
      },
    },
  })

  const productIDs = products.map((product) => product.id)

  const [{ docs: variants }, { docs: images }] = await Promise.all([
    productIDs.length
      ? payload.find({
          collection: 'product-variants',
          limit: 500,
          where: { product: { in: productIDs } },
        })
      : Promise.resolve({ docs: [] as ProductVariant[] }),
    productIDs.length
      ? payload.find({
          collection: 'product-images',
          limit: 500,
          where: { product: { in: productIDs } },
        })
      : Promise.resolve({ docs: [] as ProductImage[] }),
  ])

  const variantIDs = variants.map((variant) => variant.id)
  const { docs: inventory } = variantIDs.length
    ? await payload.find({
        collection: 'inventory',
        limit: 500,
        where: { variant: { in: variantIDs } },
      })
    : { docs: [] as Inventory[] }

  const rows = products.map((product) => ({
    ...product,
    images: images.filter((image) => {
      const productID = typeof image.product === 'number' ? image.product : image.product.id
      return productID === product.id
    }),
    inventory,
    variants: variants.filter((variant) => {
      const productID = typeof variant.product === 'number' ? variant.product : variant.product.id
      return productID === product.id
    }),
  })) as SellerProductRow[]

  const totalStock = rows.reduce((total, product) => total + getProductStock(product), 0)
  const availableProducts = rows.filter((product) => product.status === 'available').length

  return (
    <SellerShell
      description="Manage listings, variants, image references, and stock before moving into cart and order workflows."
      primaryAction={{ href: '/seller/products/new', label: 'Add product' }}
      title="Products"
      userLabel={user.fullName || user.email}
    >
      {user.accountStatus !== 'active' ? (
        <Alert color="red" icon={<AlertCircle size={18} />} title="Seller actions blocked">
          Your account is suspended. You can review products, but product changes are disabled.
        </Alert>
      ) : null}

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card>
          <Group>
            <ThemeIcon variant="light">
              <Box size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text c="dimmed" size="sm">
                Products
              </Text>
              <Text fw={700} size="xl">
                {rows.length}
              </Text>
            </Stack>
          </Group>
        </Card>
        <Card>
          <Group>
            <ThemeIcon color="teal" variant="light">
              <PackageCheck size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text c="dimmed" size="sm">
                Available
              </Text>
              <Text fw={700} size="xl">
                {availableProducts}
              </Text>
            </Stack>
          </Group>
        </Card>
        <Card>
          <Group>
            <ThemeIcon color="orange" variant="light">
              <Layers size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text c="dimmed" size="sm">
                Stock after reservations
              </Text>
              <Text fw={700} size="xl">
                {totalStock}
              </Text>
            </Stack>
          </Group>
        </Card>
      </SimpleGrid>

      <ProductListClient products={rows} />
    </SellerShell>
  )
}
