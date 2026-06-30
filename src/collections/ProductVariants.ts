import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['product', 'color', 'size', 'additionalPrice'],
    useAsTitle: 'product',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'color',
      type: 'text',
      required: true,
    },
    {
      name: 'size',
      type: 'text',
      required: true,
    },
    {
      name: 'additionalPrice',
      type: 'number',
      defaultValue: 0,
      label: 'Additional Price',
      min: 0,
      required: true,
    },
  ],
  timestamps: true,
}
