import type { Payload } from 'payload'

import type {
  Address,
  Inventory,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  User,
} from '@/payload-types'
import { getRelationshipID } from '@/app/(frontend)/seller/products/_lib'

export type PayloadUser = User

export type OrderStatus = Order['orderStatus']
export type PaymentStatus = Order['paymentStatus']

export const orderStatusLabels: Record<OrderStatus, string> = {
  cancelled: 'Cancelled',
  delivered: 'Delivered',
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
}

export const orderStatusColors: Record<OrderStatus, string> = {
  cancelled: 'red',
  delivered: 'teal',
  pending: 'gray',
  processing: 'blue',
  shipped: 'indigo',
}

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  failed: 'Failed',
  paid: 'Paid',
  pending: 'Pending',
}

export const paymentStatusColors: Record<PaymentStatus, string> = {
  failed: 'red',
  paid: 'teal',
  pending: 'orange',
}

// ponytail: flat shipping fee for every order. Upgrade path is a courier/weight-based
// rate table once shipping partners are integrated.
export const SHIPPING_FEE = 10

/** Allowed forward transitions for orderStatus. Cancellation is handled separately per-role. */
const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  cancelled: [],
  delivered: [],
  pending: ['processing'],
  processing: ['shipped'],
  shipped: ['delivered'],
}

export function calculateOrderTotal(
  items: { quantity: number; unitPrice: number }[],
  shippingFee: number = SHIPPING_FEE,
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  return { shippingFee, subtotal, totalAmount: subtotal + shippingFee }
}

const findInventoryForVariant = async (
  payload: Payload,
  user: User,
  variantID: number,
): Promise<Inventory> => {
  const { docs } = await payload.find({
    collection: 'inventory',
    limit: 1,
    overrideAccess: false,
    user,
    where: { variant: { equals: variantID } },
  })

  const inventory = docs[0]
  if (!inventory) throw new Error(`Inventory record missing for variant ${variantID}.`)
  return inventory
}

/**
 * Holds stock for an order by incrementing reservedQuantity. Throws if any variant
 * does not have enough available stock (stockQuantity - reservedQuantity).
 *
 * ponytail: no row-level locking, so two concurrent checkouts for the last unit of the
 * same variant could both pass this check (race condition ceiling). Upgrade path is a
 * DB-level lock (e.g. `SELECT ... FOR UPDATE`) around the read/update pair.
 */
export const reserveInventory = async (
  payload: Payload,
  user: User,
  items: { quantity: number; variantID: number }[],
): Promise<void> => {
  for (const item of items) {
    const inventory = await findInventoryForVariant(payload, user, item.variantID)
    const available = inventory.stockQuantity - inventory.reservedQuantity
    if (available < item.quantity) {
      throw new Error(`Only ${Math.max(available, 0)} unit(s) left in stock for one of your items.`)
    }

    await payload.update({
      id: inventory.id,
      collection: 'inventory',
      data: { reservedQuantity: inventory.reservedQuantity + item.quantity },
      overrideAccess: false,
      user,
    })
  }
}

/** Releases a stock hold without touching stockQuantity (order never took the stock). */
const releaseInventory = async (
  payload: Payload,
  user: User,
  items: OrderItem[],
): Promise<void> => {
  for (const item of items) {
    const inventory = await findInventoryForVariant(payload, user, getRelationshipID(item.variant))
    await payload.update({
      id: inventory.id,
      collection: 'inventory',
      data: { reservedQuantity: Math.max(inventory.reservedQuantity - item.quantity, 0) },
      overrideAccess: false,
      user,
    })
  }
}

/** Converts a stock hold into a permanent deduction once payment is confirmed. */
const finalizeInventory = async (
  payload: Payload,
  user: User,
  items: OrderItem[],
): Promise<void> => {
  for (const item of items) {
    const inventory = await findInventoryForVariant(payload, user, getRelationshipID(item.variant))
    await payload.update({
      id: inventory.id,
      collection: 'inventory',
      data: {
        reservedQuantity: Math.max(inventory.reservedQuantity - item.quantity, 0),
        stockQuantity: Math.max(inventory.stockQuantity - item.quantity, 0),
      },
      overrideAccess: false,
      user,
    })
  }
}

/** Returns previously finalized stock, e.g. when a paid order is cancelled/refunded. */
const restockInventory = async (
  payload: Payload,
  user: User,
  items: OrderItem[],
): Promise<void> => {
  for (const item of items) {
    const inventory = await findInventoryForVariant(payload, user, getRelationshipID(item.variant))
    await payload.update({
      id: inventory.id,
      collection: 'inventory',
      data: { stockQuantity: inventory.stockQuantity + item.quantity },
      overrideAccess: false,
      user,
    })
  }
}

const getOrderItems = async (
  payload: Payload,
  user: User,
  orderID: number,
): Promise<OrderItem[]> => {
  const { docs } = await payload.find({
    collection: 'order-items',
    limit: 200,
    overrideAccess: false,
    user,
    where: { order: { equals: orderID } },
  })

  return docs
}

const notifyUser = async (
  payload: Payload,
  actingUser: User,
  targetUserID: number,
  title: string,
  message: string,
): Promise<void> => {
  await payload.create({
    collection: 'notifications',
    data: { isRead: false, message, title, type: 'order', user: targetUserID },
    overrideAccess: false,
    user: actingUser,
  })
}

type OrderItemDraft = {
  quantity: number
  sellerID: number
  unitPrice: number
  variantID: number
}

const createOrderItemRows = async (
  payload: Payload,
  user: User,
  orderID: number,
  items: OrderItemDraft[],
): Promise<void> => {
  for (const item of items) {
    await payload.create({
      collection: 'order-items',
      data: {
        order: orderID,
        quantity: item.quantity,
        seller: item.sellerID,
        subtotal: item.unitPrice * item.quantity,
        unitPrice: item.unitPrice,
        variant: item.variantID,
      },
      overrideAccess: false,
      user,
    })
  }
}

/**
 * Converts the buyer's current cart into an order: validates the shipping address and
 * stock, snapshots pricing and seller attribution onto order-items, reserves inventory,
 * and clears the converted cart-items. Card/online-banking payments are confirmed
 * immediately (simulated gateway); cash-on-delivery stays pending until delivery.
 */
export const createOrderFromCart = async (
  payload: Payload,
  user: User,
  {
    paymentMethod,
    shippingAddressID,
  }: { paymentMethod: Order['paymentMethod']; shippingAddressID: number },
): Promise<Order> => {
  const { docs: addresses } = await payload.find({
    collection: 'addresses',
    limit: 1,
    overrideAccess: false,
    user,
    where: { and: [{ id: { equals: shippingAddressID } }, { user: { equals: user.id } }] },
  })
  if (!addresses.length) throw new Error('Shipping address not found.')

  const { docs: carts } = await payload.find({
    collection: 'carts',
    limit: 1,
    overrideAccess: false,
    user,
    where: { user: { equals: user.id } },
  })
  const cart = carts[0]
  if (!cart) throw new Error('Your cart is empty.')

  const { docs: cartItems } = await payload.find({
    collection: 'cart-items',
    depth: 2,
    limit: 200,
    overrideAccess: false,
    user,
    where: { cart: { equals: cart.id } },
  })
  if (!cartItems.length) throw new Error('Your cart is empty.')

  const drafts: OrderItemDraft[] = []
  for (const cartItem of cartItems) {
    const variant = cartItem.variant
    if (typeof variant === 'number') throw new Error('Cart item is missing variant details.')

    const product = variant.product as number | Product
    if (typeof product === 'number') throw new Error('Cart item is missing product details.')

    if (getRelationshipID(product.seller) === user.id) {
      throw new Error(`You cannot order your own product ("${product.productName}").`)
    }

    const inventory = await findInventoryForVariant(payload, user, variant.id)
    const available = inventory.stockQuantity - inventory.reservedQuantity
    if (available < cartItem.quantity) {
      throw new Error(
        `"${product.productName}" only has ${Math.max(available, 0)} unit(s) left in stock.`,
      )
    }

    drafts.push({
      quantity: cartItem.quantity,
      sellerID: getRelationshipID(product.seller),
      unitPrice: product.basePrice + variant.additionalPrice,
      variantID: variant.id,
    })
  }

  const totals = calculateOrderTotal(drafts)

  const order = await payload.create({
    collection: 'orders',
    data: {
      buyer: user.id,
      orderDate: new Date().toISOString(),
      orderStatus: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      shippingAddress: shippingAddressID,
      shippingFee: totals.shippingFee,
      subtotal: totals.subtotal,
      totalAmount: totals.totalAmount,
    },
    overrideAccess: false,
    user,
  })

  await createOrderItemRows(payload, user, order.id, drafts)
  await reserveInventory(
    payload,
    user,
    drafts.map((item) => ({ quantity: item.quantity, variantID: item.variantID })),
  )

  for (const cartItem of cartItems) {
    await payload.delete({ id: cartItem.id, collection: 'cart-items', overrideAccess: false, user })
  }

  await notifyUser(
    payload,
    user,
    user.id,
    'Order placed',
    `Your order #${order.id} has been placed and is awaiting payment confirmation.`,
  )

  if (paymentMethod !== 'cash-on-delivery') {
    return updatePaymentStatus(payload, user, order.id, 'paid')
  }

  return order
}

const requireOrder = async (payload: Payload, user: User, orderID: number): Promise<Order> => {
  const order = await payload.findByID({
    id: orderID,
    collection: 'orders',
    overrideAccess: false,
    user,
  })
  if (!order) throw new Error('Order not found.')
  return order
}

/**
 * Updates paymentStatus and keeps inventory consistent: moving to 'paid' finalizes the
 * stock hold into a real deduction, moving to 'failed' releases the hold.
 */
export const updatePaymentStatus = async (
  payload: Payload,
  user: User,
  orderID: number,
  status: PaymentStatus,
): Promise<Order> => {
  const order = await requireOrder(payload, user, orderID)
  if (order.paymentStatus === status) return order

  const orderItems = await getOrderItems(payload, user, orderID)

  if (status === 'paid') {
    await finalizeInventory(payload, user, orderItems)
  } else if (status === 'failed' && order.paymentStatus === 'pending') {
    await releaseInventory(payload, user, orderItems)
  }

  const updated = await payload.update({
    id: orderID,
    collection: 'orders',
    data: { paymentStatus: status },
    overrideAccess: false,
    user,
  })

  await notifyUser(
    payload,
    user,
    getRelationshipID(order.buyer),
    'Payment update',
    `Payment for order #${orderID} is now ${paymentStatusLabels[status].toLowerCase()}.`,
  )

  return updated
}

export const confirmPayment = (payload: Payload, user: User, orderID: number): Promise<Order> =>
  updatePaymentStatus(payload, user, orderID, 'paid')

const assertCanUpdateOrderStatus = (
  order: Order,
  orderItems: OrderItem[],
  user: User,
  nextStatus: OrderStatus,
): void => {
  if (user.role === 'admin') return

  const isBuyer = getRelationshipID(order.buyer) === user.id
  const isSeller = orderItems.some((item) => getRelationshipID(item.seller) === user.id)

  if (nextStatus === 'cancelled') {
    if (!isBuyer && !isSeller) throw new Error('You are not part of this order.')
    return
  }

  if (!isSeller) throw new Error("Only the seller can update this order's fulfillment status.")
}

/**
 * Advances or cancels an order. Buyers may only cancel (while pending/processing);
 * sellers with at least one item on the order may advance pending -> processing ->
 * shipped -> delivered. Cancelling releases held inventory, or restocks it if payment
 * had already been finalized. Delivering a cash-on-delivery order finalizes payment.
 */
export const updateOrderStatus = async (
  payload: Payload,
  user: User,
  orderID: number,
  nextStatus: OrderStatus,
): Promise<Order> => {
  const order = await requireOrder(payload, user, orderID)
  const orderItems = await getOrderItems(payload, user, orderID)

  assertCanUpdateOrderStatus(order, orderItems, user, nextStatus)

  if (nextStatus === 'cancelled') {
    if (order.orderStatus === 'cancelled' || order.orderStatus === 'delivered') {
      throw new Error(`Order #${orderID} can no longer be cancelled.`)
    }
  } else if (!ORDER_STATUS_FLOW[order.orderStatus].includes(nextStatus)) {
    throw new Error(`Order #${orderID} cannot move from ${order.orderStatus} to ${nextStatus}.`)
  }

  if (nextStatus === 'cancelled') {
    if (order.paymentStatus === 'paid') {
      await restockInventory(payload, user, orderItems)
    } else {
      await releaseInventory(payload, user, orderItems)
    }
  }

  let paymentStatus: PaymentStatus | undefined
  if (
    nextStatus === 'delivered' &&
    order.paymentMethod === 'cash-on-delivery' &&
    order.paymentStatus !== 'paid'
  ) {
    await finalizeInventory(payload, user, orderItems)
    paymentStatus = 'paid'
  }

  const updated = await payload.update({
    id: orderID,
    collection: 'orders',
    data: { orderStatus: nextStatus, ...(paymentStatus ? { paymentStatus } : {}) },
    overrideAccess: false,
    user,
  })

  await notifyUser(
    payload,
    user,
    getRelationshipID(order.buyer),
    'Order update',
    `Order #${orderID} is now ${orderStatusLabels[nextStatus].toLowerCase()}.`,
  )

  return updated
}
