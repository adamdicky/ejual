'use client'

import {
  Alert,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'

import type { Category, Product } from '@/payload-types'
import { productStatusOptions } from '../_lib'
import { createProduct, updateProduct } from '../actions'
import { SubmitButton } from './SubmitButton'

type ProductFormProps = {
  categories: Category[]
  product?: Product
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const action = product ? updateProduct.bind(null, product.id) : createProduct
  const [state, formAction] = useActionState(action, null)
  const categoryOptions = categories.map((category) => ({
    label: category.categoryName || category.title,
    value: String(category.id),
  }))

  return (
    <form action={formAction}>
      <Card>
        <Stack gap="md">
          {state && typeof state === 'object' && 'error' in state ? (
            <Alert color="red" icon={<AlertCircle size={18} />} title="Could not save product">
              {String(state.error)}
            </Alert>
          ) : null}

          <TextInput
            defaultValue={product?.productName}
            label="Product name"
            name="productName"
            placeholder="Cotton oversized tee"
            required
          />
          <Select
            data={categoryOptions}
            defaultValue={product ? String(typeof product.category === 'number' ? product.category : product.category.id) : undefined}
            disabled={categoryOptions.length === 0}
            label="Category"
            name="category"
            placeholder={categoryOptions.length ? 'Select category' : 'Create a category in Payload first'}
            required
          />
          <Textarea
            autosize
            defaultValue={product?.description}
            label="Description"
            minRows={4}
            name="description"
            placeholder="Describe the product, material, fit, and what customers should know."
            required
          />
          <Group grow>
            <NumberInput
              decimalScale={2}
              defaultValue={product?.basePrice}
              fixedDecimalScale
              label="Base price"
              min={0}
              name="basePrice"
              prefix="RM "
              required
            />
            {product ? (
              <Select
                data={productStatusOptions}
                defaultValue={product.status || 'available'}
                label="Status"
                name="status"
                required
              />
            ) : null}
          </Group>
          {!product ? (
            <Alert color="blue" title="Product status">
              New products start as Available. You can change the status after the product is created.
            </Alert>
          ) : null}
          {!product ? (
            <>
              <Divider />
              <Stack gap="sm">
                <Text fw={700}>First variant</Text>
                <Group grow>
                  <TextInput label="Color" name="color" placeholder="Black" required />
                  <TextInput label="Size" name="size" placeholder="M" required />
                </Group>
                <Group grow>
                  <NumberInput
                    decimalScale={2}
                    defaultValue={0}
                    fixedDecimalScale
                    label="Additional price"
                    min={0}
                    name="additionalPrice"
                    prefix="RM "
                    required
                  />
                  <NumberInput defaultValue={0} label="Stock quantity" min={0} name="stockQuantity" required />
                </Group>
              </Stack>
            </>
          ) : null}
          <Switch
            defaultChecked={Boolean(product?.featured)}
            description="Featured products can be highlighted in catalogue surfaces later."
            label="Feature this product"
            name="featured"
          />
          <Group justify="space-between">
            <Button component={Link} href="/seller/products" variant="subtle">
              Back to products
            </Button>
            <SubmitButton
              disabled={categoryOptions.length === 0}
              idleLabel={product ? 'Save product' : 'Create product'}
              pendingLabel={product ? 'Saving product...' : 'Creating product...'}
            />
          </Group>
        </Stack>
      </Card>
    </form>
  )
}
