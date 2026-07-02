'use server'

import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { getMeUser } from '@/utilities/getMeUser'
import { getAvailableInventoryQuantity } from './_lib'

export type CartActionState = {
  cartItemCount?: number
  error?: string
  success?: string
} | null

const getRelationshipID = (value: number | { id: number } | null | undefined): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) return value.id
  return null
}

const requireSignedInUser = async () => {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  return user
}

const getOrCreateCart = async (payload: Awaited<ReturnType<typeof getPayload>>, userID: number) => {
  const { docs: carts } = await payload.find({
    collection: 'carts',
    limit: 1,
    overrideAccess: false,
    user: { id: userID } as never,
    where: { user: { equals: userID } },
  })

  if (carts[0]) return carts[0]

  return payload.create({
    collection: 'carts',
    data: { user: userID },
    overrideAccess: false,
    user: { id: userID } as never,
  })
}

export const addToCart = async (_prevState: CartActionState, formData: FormData): Promise<CartActionState> => {
  try {
    const user = await requireSignedInUser()
    const payload = await getPayload({ config: configPromise })
    const variantID = Number(formData.get('variantID'))
    const quantity = Number(formData.get('quantity') || 1)

    if (!Number.isInteger(variantID) || variantID <= 0) throw new Error('Invalid product selection.')
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Quantity must be at least 1.')

    const { docs: variants } = await payload.find({
      collection: 'product-variants',
      limit: 1,
      where: { id: { equals: variantID } },
    })

    if (!variants[0]) throw new Error('Product variant not found.')
    const productID = getRelationshipID(variants[0].product)
    if (!productID) throw new Error('Product not found for this variant.')

    const product = await payload.findByID({
      collection: 'products',
      id: productID,
      depth: 0,
    })

    if (getRelationshipID(product.seller as number | { id: number }) === user.id) {
      throw new Error('You cannot add your own product to the cart.')
    }

    const { docs: inventoryDocs } = await payload.find({
      collection: 'inventory',
      limit: 1,
      where: { variant: { equals: variantID } },
    })

    const inventory = inventoryDocs[0]
    if (!inventory) throw new Error('Inventory not found for this item.')

    const availableStock = getAvailableInventoryQuantity(inventory.stockQuantity, inventory.reservedQuantity)
    if (availableStock < quantity) throw new Error('Not enough stock available.')

    const cart = await getOrCreateCart(payload, user.id)

    const { docs: existingItems } = await payload.find({
      collection: 'cart-items',
      limit: 1,
      overrideAccess: false,
      user,
      where: {
        and: [{ cart: { equals: cart.id } }, { variant: { equals: variantID } }],
      },
    })

    if (existingItems[0]) {
      const nextQuantity = existingItems[0].quantity + quantity
      if (availableStock < nextQuantity) throw new Error('Not enough stock available.')

      await payload.update({
        id: existingItems[0].id,
        collection: 'cart-items',
        data: { quantity: nextQuantity },
        overrideAccess: false,
        user,
      })
    } else {
      await payload.create({
        collection: 'cart-items',
        data: { cart: cart.id, quantity, variant: variantID },
        overrideAccess: false,
        user,
      })
    }

    const { docs: updatedCartItems } = await payload.find({
      collection: 'cart-items',
      limit: 100,
      overrideAccess: false,
      user,
      where: { cart: { equals: cart.id } },
    })

    const cartItemCount = updatedCartItems.reduce((total, item) => total + item.quantity, 0)

    revalidatePath('/cart')
    revalidatePath('/shop')
    return {
      cartItemCount,
      success: 'Item added to cart.',
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to add item to cart.' }
  }
}

export const updateCartItem = async (_prevState: CartActionState, formData: FormData): Promise<CartActionState> => {
  try {
    const user = await requireSignedInUser()
    const payload = await getPayload({ config: configPromise })
    const itemID = Number(formData.get('itemID'))
    const quantity = Number(formData.get('quantity'))

    if (!Number.isInteger(itemID) || itemID <= 0) throw new Error('Invalid cart item.')
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Quantity must be at least 1.')

    const { docs: items } = await payload.find({
      collection: 'cart-items',
      limit: 1,
      overrideAccess: false,
      user,
      where: { id: { equals: itemID } },
    })

    if (!items[0]) throw new Error('Cart item not found.')
    const variantID = getRelationshipID(items[0].variant as number | { id: number })
    if (!variantID) throw new Error('Variant not found for this cart item.')

    const { docs: inventoryDocs } = await payload.find({
      collection: 'inventory',
      limit: 1,
      where: { variant: { equals: variantID } },
    })

    const inventory = inventoryDocs[0]
    if (!inventory) throw new Error('Inventory not found for this item.')

    const availableStock = getAvailableInventoryQuantity(inventory.stockQuantity, inventory.reservedQuantity)
    if (availableStock < quantity) throw new Error('Not enough stock available.')

    await payload.update({
      id: itemID,
      collection: 'cart-items',
      data: { quantity },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to update cart item.' }
  }

  revalidatePath('/cart')
  return { success: 'Cart updated.' }
}

export const removeCartItem = async (_prevState: CartActionState, formData: FormData): Promise<CartActionState> => {
  try {
    const user = await requireSignedInUser()
    const payload = await getPayload({ config: configPromise })
    const itemID = Number(formData.get('itemID'))

    if (!Number.isInteger(itemID) || itemID <= 0) throw new Error('Invalid cart item.')

    await payload.delete({
      id: itemID,
      collection: 'cart-items',
      overrideAccess: false,
      user,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to remove cart item.' }
  }

  revalidatePath('/cart')
  return { success: 'Item removed from cart.' }
}

export const createAddress = async (_prevState: CartActionState, formData: FormData): Promise<CartActionState> => {
  try {
    const user = await requireSignedInUser()
    const payload = await getPayload({ config: configPromise })
    const receiverName = String(formData.get('receiverName') || '').trim()
    const phoneNumber = String(formData.get('phoneNumber') || '').trim()
    const addressLine1 = String(formData.get('addressLine1') || '').trim()
    const addressLine2 = String(formData.get('addressLine2') || '').trim()
    const city = String(formData.get('city') || '').trim()
    const state = String(formData.get('state') || '').trim()
    const postcode = String(formData.get('postcode') || '').trim()
    const country = String(formData.get('country') || 'Malaysia').trim() || 'Malaysia'
    const isDefault = formData.get('isDefault') === 'on'

    if (!receiverName) throw new Error('Receiver name is required.')
    if (!phoneNumber) throw new Error('Phone number is required.')
    if (!addressLine1) throw new Error('Address line 1 is required.')
    if (!city) throw new Error('City is required.')
    if (!state) throw new Error('State is required.')
    if (!postcode) throw new Error('Postcode is required.')

    if (isDefault) {
      const { docs: existingAddresses } = await payload.find({
        collection: 'addresses',
        limit: 100,
        overrideAccess: false,
        user,
        where: { user: { equals: user.id } },
      })

      await Promise.all(
        existingAddresses
          .filter((address) => Boolean(address.isDefault))
          .map((address) =>
            payload.update({
              id: address.id,
              collection: 'addresses',
              data: { isDefault: false },
              overrideAccess: false,
              user,
            }),
          ),
      )
    }

    await payload.create({
      collection: 'addresses',
      data: {
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        country,
        isDefault,
        phoneNumber,
        postcode,
        receiverName,
        state,
        user: user.id,
      },
      overrideAccess: false,
      user,
    })

    revalidatePath('/cart')
    return { success: 'Address added successfully.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to add address.' }
  }
}

export const placeOrder = async (_prevState: CartActionState, formData: FormData): Promise<CartActionState> => {
  try {
    const user = await requireSignedInUser()
    const payload = await getPayload({ config: configPromise })
    const addressID = Number(formData.get('addressID'))
    const paymentMethod = String(formData.get('paymentMethod') || 'cash-on-delivery') as
      | 'card'
      | 'online-banking'
      | 'cash-on-delivery'

    if (!Number.isInteger(addressID) || addressID <= 0) throw new Error('Please select a shipping address.')

    const { docs: cartItems } = await payload.find({
      collection: 'cart-items',
      limit: 100,
      overrideAccess: false,
      user,
      where: { 'cart.user': { equals: user.id } },
    })

    if (!cartItems.length) throw new Error('Your cart is empty.')

    const { docs: addresses } = await payload.find({
      collection: 'addresses',
      limit: 1,
      overrideAccess: false,
      user,
      where: { id: { equals: addressID }, user: { equals: user.id } },
    })

    if (!addresses[0]) throw new Error('Shipping address not found.')

    const orderItems = [] as Array<{
      inventoryID: number
      nextStockQuantity: number
      quantity: number
      seller: number
      subtotal: number
      unitPrice: number
      variant: number
    }>

    for (const item of cartItems) {
      const variantID = getRelationshipID(item.variant as number | { id: number })
      if (!variantID) throw new Error('Product variant not found in cart.')

      const { docs: inventoryDocs } = await payload.find({
        collection: 'inventory',
        limit: 1,
        where: { variant: { equals: variantID } },
      })

      const inventory = inventoryDocs[0]
      if (!inventory) throw new Error('Inventory not found for this item.')

      const availableStock = getAvailableInventoryQuantity(inventory.stockQuantity, inventory.reservedQuantity)
      if (availableStock < item.quantity) throw new Error('One or more items in your cart are no longer available.')

      const variant = await payload.findByID({
        collection: 'product-variants',
        id: variantID,
        depth: 1,
      })

      const productID = getRelationshipID(variant.product as number | { id: number })
      if (!productID) throw new Error('Product not found for this variant.')

      const product = await payload.findByID({
        collection: 'products',
        id: productID,
        depth: 0,
      })

      const sellerID = getRelationshipID(product.seller as number | { id: number })
      if (!sellerID) throw new Error('Seller not found for this product.')

      const unitPrice = product.basePrice + (variant.additionalPrice || 0)
      orderItems.push({
        inventoryID: inventory.id,
        nextStockQuantity: inventory.stockQuantity - item.quantity,
        quantity: item.quantity,
        seller: sellerID,
        subtotal: unitPrice * item.quantity,
        unitPrice,
        variant: variantID,
      })
    }

    const subtotal = orderItems.reduce((total, item) => total + item.subtotal, 0)
    const shippingFee = subtotal > 0 ? 10 : 0
    const totalAmount = subtotal + shippingFee

    const order = await payload.create({
      collection: 'orders',
      data: {
        buyer: user.id,
        orderDate: new Date().toISOString(),
        orderStatus: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        shippingAddress: addressID,
        shippingFee,
        subtotal,
        totalAmount,
      },
      overrideAccess: false,
      user,
    })

    for (const item of orderItems) {
      await payload.create({
        collection: 'order-items',
        data: {
          order: order.id,
          quantity: item.quantity,
          seller: item.seller,
          subtotal: item.subtotal,
          unitPrice: item.unitPrice,
          variant: item.variant,
        },
        overrideAccess: false,
        user,
      })

      await payload.update({
        id: item.inventoryID,
        collection: 'inventory',
        data: {
          stockQuantity: item.nextStockQuantity,
        },
        overrideAccess: false,
        user,
      })
    }

    for (const item of cartItems) {
      await payload.delete({
        id: item.id,
        collection: 'cart-items',
        overrideAccess: false,
        user,
      })
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to place order.' }
  }

  revalidatePath('/cart')
  revalidatePath('/shop')
  redirect('/cart?placed=1')
}
