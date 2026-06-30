import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['receiverName', 'user', 'city', 'state', 'isDefault'],
    useAsTitle: 'receiverName',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'receiverName',
      type: 'text',
      label: 'Receiver Name',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
      required: true,
    },
    {
      name: 'addressLine1',
      type: 'text',
      label: 'Address Line 1',
      required: true,
    },
    {
      name: 'addressLine2',
      type: 'text',
      label: 'Address Line 2',
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'state',
      type: 'text',
      required: true,
    },
    {
      name: 'postcode',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      defaultValue: 'Malaysia',
      required: true,
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Address',
    },
  ],
  timestamps: true,
}
