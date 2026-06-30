import { NextRequest, NextResponse } from 'next/server'

const ADMIN_LOGIN_PATH = '/admin/login'
const ADMIN_ROOT = '/admin'
const ADMIN_FORBIDDEN_PATH = '/admin/forbidden'

type AdminTokenPayload = {
  role?: string
}

const base64UrlToUint8Array = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

const timingSafeEqual = (left: Uint8Array, right: Uint8Array) => {
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let index = 0; index < left.length; index++) {
    mismatch |= left[index] ^ right[index]
  }

  return mismatch === 0
}

const verifyPayloadToken = async (token: string, secret: string): Promise<AdminTokenPayload | null> => {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [header, payload, signature] = parts
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign'],
  )

  const signedData = new TextEncoder().encode(`${header}.${payload}`)
  const expectedSignature = new Uint8Array(await crypto.subtle.sign('HMAC', key, signedData))
  const providedSignature = base64UrlToUint8Array(signature)

  if (!timingSafeEqual(expectedSignature, providedSignature)) {
    return null
  }

  const parsedPayload = JSON.parse(new TextDecoder().decode(base64UrlToUint8Array(payload))) as AdminTokenPayload & {
    exp?: number
  }

  if (parsedPayload.exp && parsedPayload.exp <= Math.floor(Date.now() / 1000)) {
    return null
  }

  return parsedPayload
}

const redirectToForbidden = (request: NextRequest) => {
  const url = request.nextUrl.clone()
  url.pathname = ADMIN_FORBIDDEN_PATH
  url.searchParams.set('from', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(url)
}

const redirectToAdminLogin = (request: NextRequest) => {
  const url = request.nextUrl.clone()
  url.pathname = ADMIN_LOGIN_PATH
  url.search = ''
  return NextResponse.redirect(url)
}

const getPayloadToken = async (request: NextRequest): Promise<AdminTokenPayload | null> => {
  const token = request.cookies.get('payload-token')?.value
  const secret = process.env.PAYLOAD_SECRET

  if (!token || !secret) return null

  try {
    return await verifyPayloadToken(token, secret)
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith(ADMIN_ROOT)) {
    return NextResponse.next()
  }

  if (pathname === ADMIN_FORBIDDEN_PATH) {
    return NextResponse.next()
  }

  const payloadToken = await getPayloadToken(request)

  if (pathname.startsWith(ADMIN_LOGIN_PATH)) {
    if (!payloadToken) return NextResponse.next()
    if (payloadToken.role === 'admin') return NextResponse.next()
    return redirectToForbidden(request)
  }

  if (!payloadToken) {
    return redirectToAdminLogin(request)
  }

  if (payloadToken.role !== 'admin') {
    return redirectToForbidden(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
