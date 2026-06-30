import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Carts: CollectionConfig = {
  slug: 'carts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['user', 'updatedAt'],
    useAsTitle: 'user',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
  ],
  timestamps: true,
}
