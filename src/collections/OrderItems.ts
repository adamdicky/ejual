import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const OrderItems: CollectionConfig = {
  slug: 'order-items',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['order', 'variant', 'seller', 'quantity', 'subtotal'],
    useAsTitle: 'variant',
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
      required: true,
    },
    {
      name: 'seller',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      min: 1,
      required: true,
    },
    {
      name: 'unitPrice',
      type: 'number',
      label: 'Unit Price',
      min: 0,
      required: true,
    },
    {
      name: 'subtotal',
      type: 'number',
      min: 0,
      required: true,
    },
  ],
  timestamps: true,
}
