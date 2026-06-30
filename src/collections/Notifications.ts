import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'user', 'type', 'isRead', 'createdAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Order', value: 'order' },
        { label: 'Promotion', value: 'promotion' },
        { label: 'System', value: 'system' },
      ],
      required: true,
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
      label: 'Read',
    },
  ],
  timestamps: true,
}
