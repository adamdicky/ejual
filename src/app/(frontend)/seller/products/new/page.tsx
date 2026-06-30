import configPromise from '@payload-config'
import { Alert } from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import { getPayload } from 'payload'

import { getMeUser } from '@/utilities/getMeUser'
import { ProductForm } from '../_components/ProductForm'
import { SellerShell } from '../_components/SellerShell'

export const metadata = {
  title: 'Add Product | eJual',
}

export default async function NewSellerProductPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'categoryName',
  })

  return (
    <SellerShell
      description="Create the listing details first. Variants, image references, and inventory are managed after the product exists."
      title="Add product"
      userLabel={user.fullName || user.email}
    >
      {user.accountStatus !== 'active' ? (
        <Alert color="red" icon={<AlertCircle size={18} />} title="Seller actions blocked">
          Your account is suspended. Product creation is disabled.
        </Alert>
      ) : (
        <ProductForm categories={categories} />
      )}
    </SellerShell>
  )
}
