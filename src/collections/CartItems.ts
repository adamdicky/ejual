import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const CartItems: CollectionConfig = {
  slug: 'cart-items',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['cart', 'variant', 'quantity'],
    useAsTitle: 'variant',
  },
  fields: [
    {
      name: 'cart',
      type: 'relationship',
      relationTo: 'carts',
      required: true,
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      min: 1,
      required: true,
    },
  ],
  timestamps: true,
}
