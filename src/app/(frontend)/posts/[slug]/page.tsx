import type { Metadata } from 'next'

import { redirect } from 'next/navigation'

export async function generateStaticParams() {
  return []
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post() {
  redirect('/shop')
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  return {
    title: slug ? `eJual Shop | ${decodeURIComponent(slug)}` : 'eJual Shop',
  }
}
