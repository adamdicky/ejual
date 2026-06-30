import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['buyer', 'paymentStatus', 'orderStatus', 'totalAmount', 'orderDate'],
    useAsTitle: 'buyer',
  },
  fields: [
    {
      name: 'buyer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'shippingAddress',
      type: 'relationship',
      relationTo: 'addresses',
      label: 'Shipping Address',
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Payment Method',
      options: [
        { label: 'Card', value: 'card' },
        { label: 'Online Banking', value: 'online-banking' },
        { label: 'Cash On Delivery', value: 'cash-on-delivery' },
      ],
      required: true,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      label: 'Payment Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
      ],
      required: true,
    },
    {
      name: 'orderStatus',
      type: 'select',
      defaultValue: 'pending',
      label: 'Order Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      required: true,
    },
    {
      name: 'subtotal',
      type: 'number',
      min: 0,
      required: true,
    },
    {
      name: 'shippingFee',
      type: 'number',
      defaultValue: 0,
      label: 'Shipping Fee',
      min: 0,
      required: true,
    },
    {
      name: 'totalAmount',
      type: 'number',
      label: 'Total Amount',
      min: 0,
      required: true,
    },
    {
      name: 'orderDate',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      label: 'Order Date',
      required: true,
    },
  ],
  timestamps: true,
}
