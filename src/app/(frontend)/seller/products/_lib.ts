import type { Category, Inventory, Product, ProductImage, ProductVariant, User } from '@/payload-types'

export type ProductStatus = Product['status']

export type SellerProductRow = Product & {
  category: Category
  images: ProductImage[]
  inventory: Inventory[]
  seller: User
  variants: ProductVariant[]
}

export const productStatusOptions: { label: string; value: ProductStatus }[] = [
  { label: 'Available', value: 'available' },
  { label: 'Out of stock', value: 'out-of-stock' },
  { label: 'Hidden', value: 'hidden' },
]

export const productStatusLabels: Record<ProductStatus, string> = {
  available: 'Available',
  hidden: 'Hidden',
  'out-of-stock': 'Out of stock',
}

export const productStatusColors: Record<ProductStatus, string> = {
  available: 'teal',
  hidden: 'gray',
  'out-of-stock': 'orange',
}

export const getRelationshipID = (value: number | { id: number }): number => {
  return typeof value === 'number' ? value : value.id
}

export const getProductStock = (product: SellerProductRow): number => {
  const variantIDs = new Set(product.variants.map((variant) => variant.id))

  return product.inventory.reduce((total, item) => {
    const variantID = getRelationshipID(item.variant)
    if (!variantIDs.has(variantID)) return total
    return total + item.stockQuantity - item.reservedQuantity
  }, 0)
}
