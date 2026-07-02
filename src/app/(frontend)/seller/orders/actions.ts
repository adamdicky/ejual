'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'

import type { Order } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import { updateOrderStatus } from '@/lib/orders'

export type SellerOrderActionState = {
  error?: string
} | null

export const advanceOrderStatus = async (
  orderID: number,
  nextStatus: Order['orderStatus'],
  _prevState: SellerOrderActionState,
  _formData: FormData,
): Promise<SellerOrderActionState> => {
  try {
    const { user } = await getMeUser({ nullUserRedirect: '/login' })
    const payload = await getPayload({ config: configPromise })
    await updateOrderStatus(payload, user, orderID, nextStatus)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Order status could not be updated.' }
  }

  revalidatePath('/seller/orders')
  return null
}
