'use server'

import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export type AuthActionState = {
  error?: string
} | null

const authRedirect = '/seller/products'

const stringFromForm = (formData: FormData, key: string): string => {
  const value = String(formData.get(key) || '').trim()
  if (!value) throw new Error(`${key} is required.`)
  return value
}

const setPayloadTokenCookie = async (token: string, exp?: number) => {
  const cookieStore = await cookies()
  const maxAge = exp ? Math.max(exp - Math.floor(Date.now() / 1000), 0) : undefined

  cookieStore.set('payload-token', token, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

const loginAndSetCookie = async (email: string, password: string) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.login({
    collection: 'users',
    data: {
      email,
      password,
    },
  })

  if (!result.token) throw new Error('Login failed.')
  await setPayloadTokenCookie(result.token, result.exp)
}

export const loginUser = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  try {
    await loginAndSetCookie(stringFromForm(formData, 'email'), stringFromForm(formData, 'password'))
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Login failed.' }
  }

  redirect(authRedirect)
}

export const registerUser = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  try {
    const email = stringFromForm(formData, 'email')
    const password = stringFromForm(formData, 'password')
    const fullName = stringFromForm(formData, 'fullName')
    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'users',
      data: {
        accountStatus: 'active',
        email,
        fullName,
        name: fullName,
        password,
        phoneNumber: String(formData.get('phoneNumber') || '').trim(),
        role: 'customer',
      },
      overrideAccess: true,
    })

    await loginAndSetCookie(email, password)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Registration failed.' }
  }

  redirect(authRedirect)
}
