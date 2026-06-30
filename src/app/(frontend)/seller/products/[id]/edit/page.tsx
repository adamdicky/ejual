import configPromise from '@payload-config'
import { Alert, Button } from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import type { Inventory, ProductImage, ProductVariant } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import { ProductEditWorkspace } from '../../_components/ProductEditWorkspace'
import { SellerShell } from '../../_components/SellerShell'

type EditSellerProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditSellerProductPage({ params }: EditSellerProductPageProps) {
  const { id } = await params
  const productID = Number(id)
  if (!Number.isInteger(productID)) notFound()

  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1,
    where: {
      and: [
        { id: { equals: productID } },
        {
          seller: {
            equals: user.id,
          },
        },
      ],
    },
  })

  const product = products[0]
  if (!product) notFound()

  const [{ docs: categories }, { docs: variants }, { docs: images }] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'categoryName',
    }),
    payload.find({
      collection: 'product-variants',
      limit: 200,
      where: { product: { equals: product.id } },
    }),
    payload.find({
      collection: 'product-images',
      limit: 200,
      sort: 'displayOrder',
      where: { product: { equals: product.id } },
    }),
  ])

  const variantIDs = variants.map((variant) => variant.id)
  const { docs: inventory } = variantIDs.length
    ? await payload.find({
        collection: 'inventory',
        limit: 200,
        where: { variant: { in: variantIDs } },
      })
    : { docs: [] as Inventory[] }

  return (
    <SellerShell
      description="Update the listing, then manage purchasable variants, product image references, and stock records."
      title={product.productName}
    >
      {user.accountStatus !== 'active' ? (
        <Alert
          color="red"
          icon={<AlertCircle size={18} />}
          title="Seller actions blocked"
          variant="light"
        >
          Your account is suspended. Product changes are disabled.
          <Button component={Link} href="/seller/products" ml="md" size="xs" variant="light">
            Back to products
          </Button>
        </Alert>
      ) : (
        <ProductEditWorkspace
          categories={categories}
          images={images as ProductImage[]}
          inventory={inventory}
          product={product}
          variants={variants as ProductVariant[]}
        />
      )}
    </SellerShell>
  )
}
