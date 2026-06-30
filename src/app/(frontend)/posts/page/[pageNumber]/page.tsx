import type { Metadata } from 'next/types'

import { redirect } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page() {
  redirect('/shop')
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: pageNumber ? `eJual Shop ${pageNumber}` : 'eJual Shop',
  }
}

export async function generateStaticParams() {
  return []
}
