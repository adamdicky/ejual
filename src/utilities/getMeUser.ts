import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { User } from '../payload-types'
import { getClientSideURL, getServerSideURL } from './getURL'

export const getOptionalMeUser = async (): Promise<User | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) return null

  const baseURL = getClientSideURL() || getServerSideURL()
  const meUserReq = await fetch(`${baseURL}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  })

  if (!meUserReq.ok) return null

  const { user }: { user?: User } = await meUserReq.json()
  return user || null
}

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  const baseURL = getClientSideURL() || getServerSideURL()

  const meUserReq = await fetch(`${baseURL}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  })

  const {
    user,
  }: {
    user: User
  } = await meUserReq.json()

  if (validUserRedirect && meUserReq.ok && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    redirect(nullUserRedirect)
  }

  // Token will exist here because if it doesn't the user will be redirected
  return {
    token: token!,
    user,
  }
}
