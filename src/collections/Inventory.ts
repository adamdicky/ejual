import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['variant', 'stockQuantity', 'reservedQuantity'],
    useAsTitle: 'variant',
  },
  fields: [
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
      required: true,
      unique: true,
    },
    {
      name: 'stockQuantity',
      type: 'number',
      defaultValue: 0,
      label: 'Stock Quantity',
      min: 0,
      required: true,
    },
    {
      name: 'reservedQuantity',
      type: 'number',
      defaultValue: 0,
      label: 'Reserved Quantity',
      min: 0,
      required: true,
    },
  ],
  timestamps: true,
}
