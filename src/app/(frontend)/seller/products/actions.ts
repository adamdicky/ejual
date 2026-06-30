'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getMeUser } from '@/utilities/getMeUser'
import type { ProductStatus } from './_lib'

export type SellerActionState = {
  error?: string
} | null

const requireActiveSeller = async () => {
  const { user } = await getMeUser({ nullUserRedirect: '/admin/login' })

  if (user.accountStatus !== 'active') {
    throw new Error('Your account is suspended. Product changes are disabled.')
  }

  return user
}

const numberFromForm = (formData: FormData, key: string): number => {
  const rawValue = formData.get(key)
  const normalizedValue = String(rawValue || '')
    .trim()
    .replace(/^RM\s*/i, '')
    .replace(/,/g, '')
  const value = Number(normalizedValue)
  if (!Number.isFinite(value)) throw new Error(`${key} must be a valid number.`)
  return value
}

const stringFromForm = (formData: FormData, key: string): string => {
  const value = String(formData.get(key) || '').trim()
  if (!value) throw new Error(`${key} is required.`)
  return value
}

export const createProduct = async (
  _prevState: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> => {
  let productID: number

  try {
    const user = await requireActiveSeller()
    const payload = await getPayload({ config: configPromise })
    const initialVariant = {
      additionalPrice: numberFromForm(formData, 'additionalPrice'),
      color: stringFromForm(formData, 'color'),
      size: stringFromForm(formData, 'size'),
      stockQuantity: numberFromForm(formData, 'stockQuantity'),
    }

    const product = await payload.create({
      collection: 'products',
      data: {
        basePrice: numberFromForm(formData, 'basePrice'),
        category: numberFromForm(formData, 'category'),
        description: stringFromForm(formData, 'description'),
        featured: formData.get('featured') === 'on',
        productName: stringFromForm(formData, 'productName'),
        seller: user.id,
        status: 'available',
      },
      overrideAccess: false,
      user,
    })
    productID = product.id

    const variant = await payload.create({
      collection: 'product-variants',
      data: {
        additionalPrice: initialVariant.additionalPrice,
        color: initialVariant.color,
        product: product.id,
        size: initialVariant.size,
      },
      overrideAccess: false,
      user,
    })

    await payload.create({
      collection: 'inventory',
      data: {
        reservedQuantity: 0,
        stockQuantity: initialVariant.stockQuantity,
        variant: variant.id,
      },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Product could not be created.' }
  }

  revalidatePath('/seller/products')
  redirect(`/seller/products/${productID}/edit`)
}

export const updateProduct = async (
  productID: number,
  _prevState: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> => {
  try {
    const user = await requireActiveSeller()
    const payload = await getPayload({ config: configPromise })

    await payload.update({
      id: productID,
      collection: 'products',
      data: {
        basePrice: numberFromForm(formData, 'basePrice'),
        category: numberFromForm(formData, 'category'),
        description: stringFromForm(formData, 'description'),
        featured: formData.get('featured') === 'on',
        productName: stringFromForm(formData, 'productName'),
        status: stringFromForm(formData, 'status') as ProductStatus,
      },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Product could not be saved.' }
  }

  revalidatePath('/seller/products')
  revalidatePath(`/seller/products/${productID}/edit`)
  redirect(`/seller/products/${productID}/edit?saved=product`)
}

export const addVariant = async (
  productID: number,
  _prevState: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> => {
  try {
    const user = await requireActiveSeller()
    const payload = await getPayload({ config: configPromise })

    const variant = await payload.create({
      collection: 'product-variants',
      data: {
        additionalPrice: numberFromForm(formData, 'additionalPrice'),
        color: stringFromForm(formData, 'color'),
        product: productID,
        size: stringFromForm(formData, 'size'),
      },
      overrideAccess: false,
      user,
    })

    await payload.create({
      collection: 'inventory',
      data: {
        reservedQuantity: 0,
        stockQuantity: numberFromForm(formData, 'stockQuantity'),
        variant: variant.id,
      },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Variant could not be added.' }
  }

  revalidatePath('/seller/products')
  revalidatePath(`/seller/products/${productID}/edit`)
  redirect(`/seller/products/${productID}/edit?saved=variant`)
}

export const updateInventory = async (
  productID: number,
  inventoryID: number,
  _prevState: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> => {
  try {
    const user = await requireActiveSeller()
    const payload = await getPayload({ config: configPromise })

    await payload.update({
      id: inventoryID,
      collection: 'inventory',
      data: {
        stockQuantity: numberFromForm(formData, 'stockQuantity'),
      },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Inventory could not be updated.' }
  }

  revalidatePath('/seller/products')
  revalidatePath(`/seller/products/${productID}/edit`)
  redirect(`/seller/products/${productID}/edit?saved=inventory`)
}

export const attachProductImage = async (
  productID: number,
  _prevState: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> => {
  try {
    const user = await requireActiveSeller()
    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'product-images',
      data: {
        displayOrder: numberFromForm(formData, 'displayOrder'),
        image: numberFromForm(formData, 'mediaID'),
        product: productID,
      },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Image could not be attached.' }
  }

  revalidatePath('/seller/products')
  revalidatePath(`/seller/products/${productID}/edit`)
  redirect(`/seller/products/${productID}/edit?saved=image`)
}
