'use client'

import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  FileInput,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core'
import { AlertCircle, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useState } from 'react'

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
  const [variantCount, setVariantCount] = useState(1)
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
                <Group justify="space-between">
                  <Text fw={700}>Variants</Text>
                  <Button
                    leftSection={<Plus size={16} />}
                    onClick={() => setVariantCount((count) => count + 1)}
                    type="button"
                    variant="light"
                  >
                    Add another variant
                  </Button>
                </Group>
                {Array.from({ length: variantCount }, (_, index) => (
                  <Box
                    bg="var(--mantine-color-gray-light)"
                    key={index}
                    p="md"
                    style={{
                      border: '1px solid var(--mantine-color-default-border)',
                      borderRadius: 'var(--mantine-radius-md)',
                    }}
                  >
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={600}>{index === 0 ? 'First variant' : `Variant ${index + 1}`}</Text>
                        {index > 0 ? (
                          <Button
                            color="red"
                            leftSection={<Trash2 size={16} />}
                            onClick={() => setVariantCount((count) => Math.max(1, count - 1))}
                            size="xs"
                            type="button"
                            variant="subtle"
                          >
                            Remove
                          </Button>
                        ) : null}
                      </Group>
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
                        <NumberInput
                          defaultValue={0}
                          label="Stock quantity"
                          min={0}
                          name="stockQuantity"
                          required
                        />
                      </Group>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </>
          ) : null}
          {!product ? (
            <>
              <Divider />
              <Stack gap="sm">
                <Text fw={700}>Product images</Text>
                <FileInput
                  accept="image/*"
                  clearable
                  description="Images are attached to the product listing, not to individual variants."
                  label="Upload product images"
                  multiple
                  name="productImages"
                  placeholder="Choose image files"
                />
                <TextInput
                  label="Image alt text"
                  name="productImageAlt"
                  placeholder="Black cotton oversized tee"
                />
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
