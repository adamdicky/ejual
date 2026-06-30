import type { Metadata } from 'next/types'

import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/shop')
}

export function generateMetadata(): Metadata {
  return {
    title: 'eJual Shop',
  }
}
