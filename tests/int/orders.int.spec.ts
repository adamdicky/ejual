import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { Address, Category, Product, ProductVariant, User } from '@/payload-types'
import {
  calculateOrderTotal,
  createOrderFromCart,
  SHIPPING_FEE,
  updateOrderStatus,
} from '@/lib/orders'

let payload: Payload

let seller: User
let buyer: User
let category: Category
let product: Product
let variant: ProductVariant
let address: Address

const cleanupUserIDs: number[] = []
const cleanupOrderIDs: number[] = []

const createCartWithItem = async (buyerUser: User, variantID: number, quantity: number) => {
  const { docs: existingCarts } = await payload.find({
    collection: 'carts',
    where: { user: { equals: buyerUser.id } },
  })
  const cart =
    existingCarts[0] ||
    (await payload.create({
      collection: 'carts',
      data: { user: buyerUser.id },
    }))
  const cartItem = await payload.create({
    collection: 'cart-items',
    data: { cart: cart.id, quantity, variant: variantID },
  })
  return { cart, cartItem }
}

const getInventoryForVariant = async (variantID: number) => {
  const { docs } = await payload.find({
    collection: 'inventory',
    where: { variant: { equals: variantID } },
  })
  return docs[0]
}

describe('Order and Payment', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    seller = await payload.create({
      collection: 'users',
      data: {
        accountStatus: 'active',
        email: 'order-test-seller@example.com',
        fullName: 'Order Test Seller',
        password: 'test1234',
        role: 'customer',
      },
    })
    cleanupUserIDs.push(seller.id)

    buyer = await payload.create({
      collection: 'users',
      data: {
        accountStatus: 'active',
        email: 'order-test-buyer@example.com',
        fullName: 'Order Test Buyer',
        password: 'test1234',
        role: 'customer',
      },
    })
    cleanupUserIDs.push(buyer.id)

    category = await payload.create({
      collection: 'categories',
      data: {
        categoryName: 'Order Test Category',
        slug: 'order-test-category',
        title: 'Order Test Category',
      },
    })

    product = await payload.create({
      collection: 'products',
      data: {
        basePrice: 50,
        category: category.id,
        description: 'Order module test product',
        productName: 'Order Test Product',
        seller: seller.id,
        status: 'available',
      },
    })

    variant = await payload.create({
      collection: 'product-variants',
      data: { additionalPrice: 5, color: 'Black', product: product.id, size: 'M' },
    })

    await payload.create({
      collection: 'inventory',
      data: { reservedQuantity: 0, stockQuantity: 10, variant: variant.id },
    })

    address = await payload.create({
      collection: 'addresses',
      data: {
        addressLine1: '1 Test Street',
        city: 'Johor Bahru',
        country: 'Malaysia',
        phoneNumber: '0123456789',
        postcode: '80000',
        receiverName: 'Order Test Buyer',
        state: 'Johor',
        user: buyer.id,
      },
    })
  })

  afterAll(async () => {
    for (const orderID of cleanupOrderIDs) {
      await payload
        .delete({
          collection: 'order-items',

          where: { order: { equals: orderID } },
        })
        .catch(() => {})
      await payload.delete({ id: orderID, collection: 'orders' }).catch(() => {})
    }
    await payload
      .delete({
        collection: 'notifications',

        where: { user: { in: cleanupUserIDs } },
      })
      .catch(() => {})
    await payload
      .delete({
        collection: 'cart-items',

        where: { variant: { equals: variant.id } },
      })
      .catch(() => {})
    await payload
      .delete({
        collection: 'carts',

        where: { user: { in: cleanupUserIDs } },
      })
      .catch(() => {})
    await payload.delete({ id: address.id, collection: 'addresses' }).catch(() => {})
    await payload
      .delete({
        collection: 'inventory',

        where: { variant: { equals: variant.id } },
      })
      .catch(() => {})
    await payload.delete({ id: variant.id, collection: 'product-variants' }).catch(() => {})
    await payload.delete({ id: product.id, collection: 'products' }).catch(() => {})
    await payload.delete({ id: category.id, collection: 'categories' }).catch(() => {})
    for (const userID of cleanupUserIDs) {
      await payload.delete({ id: userID, collection: 'users' }).catch(() => {})
    }
  })

  it('calculates order totals from unit price and quantity', () => {
    const totals = calculateOrderTotal([{ quantity: 2, unitPrice: 55 }])
    expect(totals.subtotal).toBe(110)
    expect(totals.shippingFee).toBe(SHIPPING_FEE)
    expect(totals.totalAmount).toBe(110 + SHIPPING_FEE)
  })

  it('creates an order from the cart, reserves inventory, and clears cart items (cash on delivery)', async () => {
    const { cartItem } = await createCartWithItem(buyer, variant.id, 2)

    const order = await createOrderFromCart(payload, buyer, {
      paymentMethod: 'cash-on-delivery',
      shippingAddressID: address.id,
    })
    cleanupOrderIDs.push(order.id)

    expect(order.subtotal).toBe(55 * 2)
    expect(order.shippingFee).toBe(SHIPPING_FEE)
    expect(order.totalAmount).toBe(55 * 2 + SHIPPING_FEE)
    expect(order.orderStatus).toBe('pending')
    expect(order.paymentStatus).toBe('pending')

    const { docs: orderItems } = await payload.find({
      collection: 'order-items',
      depth: 0,
      where: { order: { equals: order.id } },
    })
    expect(orderItems).toHaveLength(1)
    expect(orderItems[0].seller).toBe(seller.id)
    expect(orderItems[0].unitPrice).toBe(55)
    expect(orderItems[0].subtotal).toBe(110)

    const inventory = await getInventoryForVariant(variant.id)
    expect(inventory.reservedQuantity).toBe(2)
    expect(inventory.stockQuantity).toBe(10)

    const remainingCartItem = await payload
      .findByID({ id: cartItem.id, collection: 'cart-items' })
      .catch(() => null)
    expect(remainingCartItem).toBeNull()
  })

  it('finalizes inventory and payment when a cash-on-delivery order is delivered', async () => {
    const { docs: pendingOrders } = await payload.find({
      collection: 'orders',

      where: { buyer: { equals: buyer.id } },
    })
    const order = pendingOrders[0]

    await updateOrderStatus(payload, seller, order.id, 'processing')
    await updateOrderStatus(payload, seller, order.id, 'shipped')
    const delivered = await updateOrderStatus(payload, seller, order.id, 'delivered')

    expect(delivered.orderStatus).toBe('delivered')
    expect(delivered.paymentStatus).toBe('paid')

    const inventory = await getInventoryForVariant(variant.id)
    expect(inventory.reservedQuantity).toBe(0)
    expect(inventory.stockQuantity).toBe(8)
  })

  it('confirms payment immediately for card orders', async () => {
    await createCartWithItem(buyer, variant.id, 1)

    const order = await createOrderFromCart(payload, buyer, {
      paymentMethod: 'card',
      shippingAddressID: address.id,
    })
    cleanupOrderIDs.push(order.id)

    expect(order.paymentStatus).toBe('paid')

    const inventory = await getInventoryForVariant(variant.id)
    expect(inventory.reservedQuantity).toBe(0)
    expect(inventory.stockQuantity).toBe(7)
  })

  it('releases the inventory hold when a pending order is cancelled', async () => {
    await createCartWithItem(buyer, variant.id, 3)

    const order = await createOrderFromCart(payload, buyer, {
      paymentMethod: 'cash-on-delivery',
      shippingAddressID: address.id,
    })
    cleanupOrderIDs.push(order.id)

    const beforeCancel = await getInventoryForVariant(variant.id)
    expect(beforeCancel.reservedQuantity).toBe(3)

    const cancelled = await updateOrderStatus(payload, buyer, order.id, 'cancelled')
    expect(cancelled.orderStatus).toBe('cancelled')

    const afterCancel = await getInventoryForVariant(variant.id)
    expect(afterCancel.reservedQuantity).toBe(0)
    expect(afterCancel.stockQuantity).toBe(7)
  })

  it('prevents a buyer from advancing fulfillment status', async () => {
    await createCartWithItem(buyer, variant.id, 1)

    const order = await createOrderFromCart(payload, buyer, {
      paymentMethod: 'cash-on-delivery',
      shippingAddressID: address.id,
    })
    cleanupOrderIDs.push(order.id)

    await expect(updateOrderStatus(payload, buyer, order.id, 'processing')).rejects.toThrow(
      "Only the seller can update this order's fulfillment status.",
    )
  })
})
