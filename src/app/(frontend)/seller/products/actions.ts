'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type { File as PayloadFile } from 'payload'
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

const stringAt = (formData: FormData, key: string, index: number): string => {
  const value = String(formData.getAll(key)[index] || '').trim()
  if (!value) throw new Error(`${key} is required.`)
  return value
}

const numberAt = (formData: FormData, key: string, index: number): number => {
  const rawValue = formData.getAll(key)[index]
  const normalizedValue = String(rawValue || '')
    .trim()
    .replace(/^RM\s*/i, '')
    .replace(/,/g, '')
  const value = Number(normalizedValue)
  if (!Number.isFinite(value)) throw new Error(`${key} must be a valid number.`)
  return value
}

const fileFromUpload = async (file: File): Promise<PayloadFile> => {
  const data = await file.arrayBuffer()

  return {
    data: Buffer.from(data),
    mimetype: file.type,
    name: file.name,
    size: file.size,
  }
}

const productImageFilesFromForm = (formData: FormData): File[] =>
  formData
    .getAll('productImages')
    .filter((value): value is File => value instanceof File && value.size > 0)

const requireOwnedProduct = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: Awaited<ReturnType<typeof requireActiveSeller>>,
  productID: number,
) => {
  const { docs } = await payload.find({
    collection: 'products',
    limit: 1,
    overrideAccess: false,
    user,
    where: {
      and: [{ id: { equals: productID } }, { seller: { equals: user.id } }],
    },
  })

  if (!docs.length) throw new Error('Product not found.')
  return docs[0]
}

const attachUploadedImages = async ({
  formData,
  payload,
  productID,
  startOrder = 0,
  user,
}: {
  formData: FormData
  payload: Awaited<ReturnType<typeof getPayload>>
  productID: number
  startOrder?: number
  user: Awaited<ReturnType<typeof requireActiveSeller>>
}) => {
  const files = productImageFilesFromForm(formData)

  for (const [index, file] of files.entries()) {
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: String(formData.get('productImageAlt') || '').trim() || file.name,
      },
      file: await fileFromUpload(file),
      overrideAccess: false,
      user,
    })

    await payload.create({
      collection: 'product-images',
      data: {
        displayOrder: startOrder + index,
        image: media.id,
        product: productID,
      },
      overrideAccess: false,
      user,
    })
  }
}

export const createProduct = async (
  _prevState: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> => {
  let productID: number

  try {
    const user = await requireActiveSeller()
    const payload = await getPayload({ config: configPromise })
    const colors = formData.getAll('color')
    if (!colors.length) throw new Error('At least one variant is required.')

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

    for (let index = 0; index < colors.length; index++) {
      const variant = await payload.create({
        collection: 'product-variants',
        data: {
          additionalPrice: numberAt(formData, 'additionalPrice', index),
          color: stringAt(formData, 'color', index),
          product: product.id,
          size: stringAt(formData, 'size', index),
        },
        overrideAccess: false,
        user,
      })

      await payload.create({
        collection: 'inventory',
        data: {
          reservedQuantity: 0,
          stockQuantity: numberAt(formData, 'stockQuantity', index),
          variant: variant.id,
        },
        overrideAccess: false,
        user,
      })
    }

    await attachUploadedImages({ formData, payload, productID: product.id, user })
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
    await requireOwnedProduct(payload, user, productID)

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
    await requireOwnedProduct(payload, user, productID)

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
    await requireOwnedProduct(payload, user, productID)
    const { docs: variants } = await payload.find({
      collection: 'product-variants',
      limit: 500,
      overrideAccess: false,
      user,
      where: { product: { equals: productID } },
    })
    const variantIDs = variants.map((variant) => variant.id)

    const { docs: inventoryItems } = await payload.find({
      collection: 'inventory',
      limit: 1,
      overrideAccess: false,
      user,
      where: {
        and: [{ id: { equals: inventoryID } }, { variant: { in: variantIDs } }],
      },
    })

    if (!inventoryItems.length) throw new Error('Inventory record not found.')

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
    await requireOwnedProduct(payload, user, productID)
    const { totalDocs } = await payload.find({
      collection: 'product-images',
      limit: 0,
      overrideAccess: false,
      user,
      where: { product: { equals: productID } },
    })

    await attachUploadedImages({ formData, payload, productID, startOrder: totalDocs, user })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Image could not be attached.' }
  }

  revalidatePath('/seller/products')
  revalidatePath(`/seller/products/${productID}/edit`)
  redirect(`/seller/products/${productID}/edit?saved=image`)
}

export const reorderProductImages = async (
  productID: number,
  _prevState: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> => {
  try {
    const user = await requireActiveSeller()
    const payload = await getPayload({ config: configPromise })
    await requireOwnedProduct(payload, user, productID)

    const imageIDs = String(formData.get('imageOrder') || '')
      .split(',')
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id))

    if (!imageIDs.length) throw new Error('Image order is required.')

    const { docs: productImages } = await payload.find({
      collection: 'product-images',
      limit: imageIDs.length,
      overrideAccess: false,
      user,
      where: {
        and: [{ id: { in: imageIDs } }, { product: { equals: productID } }],
      },
    })

    if (productImages.length !== imageIDs.length) {
      throw new Error('Image order contains an invalid product image.')
    }

    await Promise.all(
      imageIDs.map((imageID, index) =>
        payload.update({
          id: imageID,
          collection: 'product-images',
          data: {
            displayOrder: index,
          },
          overrideAccess: false,
          user,
        }),
      ),
    )
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Image order could not be saved.' }
  }

  revalidatePath('/seller/products')
  revalidatePath(`/seller/products/${productID}/edit`)
  redirect(`/seller/products/${productID}/edit?saved=images`)
}
