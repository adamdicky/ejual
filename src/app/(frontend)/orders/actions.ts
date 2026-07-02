'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type { Order } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import { createOrderFromCart, updateOrderStatus } from '@/lib/orders'

export type OrderActionState = {
  error?: string
} | null

/**
 * Converts the signed-in buyer's cart into an order. This is the integration point the
 * cart/checkout flow should call once the buyer has picked a shipping address and
 * payment method.
 */
export const placeOrder = async (
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> => {
  let order: Order

  try {
    const { user } = await getMeUser({ nullUserRedirect: '/login' })
    const payload = await getPayload({ config: configPromise })

    const shippingAddressID = Number(formData.get('shippingAddressID'))
    if (!Number.isInteger(shippingAddressID)) throw new Error('Shipping address is required.')

    const paymentMethod = String(formData.get('paymentMethod') || '') as Order['paymentMethod']
    if (!['card', 'online-banking', 'cash-on-delivery'].includes(paymentMethod)) {
      throw new Error('Payment method is required.')
    }

    order = await createOrderFromCart(payload, user, { paymentMethod, shippingAddressID })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Order could not be placed.' }
  }

  revalidatePath('/orders')
  redirect(`/orders/${order.id}`)
}

export const cancelOrder = async (
  orderID: number,
  _prevState: OrderActionState,
  _formData: FormData,
): Promise<OrderActionState> => {
  try {
    const { user } = await getMeUser({ nullUserRedirect: '/login' })
    const payload = await getPayload({ config: configPromise })
    await updateOrderStatus(payload, user, orderID, 'cancelled')
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Order could not be cancelled.' }
  }

  revalidatePath('/orders')
  revalidatePath(`/orders/${orderID}`)
  return null
}
