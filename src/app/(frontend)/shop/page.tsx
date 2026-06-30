import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category, Inventory, Media, ProductImage, ProductVariant, User } from '@/payload-types'
import { getRelationshipID } from '../seller/products/_lib'
import { ShopCatalogue } from './_components/ShopCatalogue'
import { ShopShell } from './_components/ShopShell'

export const dynamic = 'force-dynamic'

const getRelationship = <T extends { id: number }>(value: number | T): T | null => {
  return typeof value === 'number' ? null : value
}

type ShopPageProps = {
  searchParams?: Promise<{
    category?: string
    q?: string
    sort?: string
  }>
}

const allowedSorts = new Set(['featured', 'newest', 'price-asc', 'price-desc'])

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const activeCategoryID = params?.category ? Number(params.category) : null
  const query = String(params?.q || '').trim()
  const sort = allowedSorts.has(String(params?.sort)) ? String(params?.sort) : 'featured'
  const payload = await getPayload({ config: configPromise })

  const [{ docs: products }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      limit: 100,
      sort: '-updatedAt',
      where: {
        status: {
          equals: 'available',
        },
      },
    }),
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'categoryName',
    }),
  ])

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
          depth: 1,
          limit: 500,
          sort: 'displayOrder',
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

  const shopProducts = products.map((product) => {
    const category = getRelationship<Category>(product.category)
    const seller = getRelationship<User>(product.seller)
    const productVariants = variants.filter((variant) => getRelationshipID(variant.product) === product.id)
    const variantIDsForProduct = new Set(productVariants.map((variant) => variant.id))
    const productInventory = inventory.filter((item) => variantIDsForProduct.has(getRelationshipID(item.variant)))
    const productImages = images.filter((image) => getRelationshipID(image.product) === product.id)
    const primaryImage = productImages[0]
    const media = primaryImage ? getRelationship<Media>(primaryImage.image) : null
    const variantPrices = productVariants.map((variant) => product.basePrice + variant.additionalPrice)
    const prices = variantPrices.length ? variantPrices : [product.basePrice]
    const stock = productInventory.reduce(
      (total, item) => total + Math.max(item.stockQuantity - item.reservedQuantity, 0),
      0,
    )

    return {
      category: category?.categoryName || 'Clothing',
      categoryID: category?.id || 0,
      description: product.description,
      featured: Boolean(product.featured),
      id: product.id,
      imageAlt: media?.alt || product.productName,
      imageURL: media?.url || media?.thumbnailURL || null,
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
      productName: product.productName,
      sellerName: seller?.fullName || seller?.name || 'eJual seller',
      stock,
      updatedAt: product.updatedAt,
      variantCount: productVariants.length,
    }
  })

  return (
    <ShopShell>
      <ShopCatalogue
        activeCategoryID={Number.isFinite(activeCategoryID) ? activeCategoryID : null}
        categories={categories.map((category) => ({
          id: category.id,
          label: category.categoryName,
        }))}
        products={shopProducts}
        query={query}
        sort={sort}
      />
    </ShopShell>
  )
}
