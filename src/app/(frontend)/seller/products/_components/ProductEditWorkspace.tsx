'use client'

import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  FileInput,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { AlertCircle, Check, GripVertical, Image, Layers, Ruler } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'

import type { Category, Inventory, ProductImage, ProductVariant } from '@/payload-types'
import { ProductForm } from './ProductForm'
import { SubmitButton } from './SubmitButton'
import { addVariant, attachProductImage, reorderProductImages, updateInventory } from '../actions'
import { getRelationshipID } from '../_lib'

type ProductEditWorkspaceProps = {
  categories: Category[]
  images: ProductImage[]
  inventory: Inventory[]
  product: Parameters<typeof ProductForm>[0]['product']
  variants: ProductVariant[]
}

function AddVariantForm({ productID }: { productID: number }) {
  const [state, formAction] = useActionState(addVariant.bind(null, productID), null)

  return (
    <form action={formAction}>
      <Card>
        <Stack gap="md">
          <Text fw={700}>Add variant</Text>
          {state && typeof state === 'object' && 'error' in state ? (
            <Alert color="red" icon={<AlertCircle size={18} />}>
              {String(state.error)}
            </Alert>
          ) : null}
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
          <Group justify="flex-end">
            <SubmitButton idleLabel="Add variant" pendingLabel="Adding variant..." />
          </Group>
        </Stack>
      </Card>
    </form>
  )
}

function AttachImageForm({ productID }: { productID: number }) {
  const [state, formAction] = useActionState(attachProductImage.bind(null, productID), null)

  return (
    <form action={formAction}>
      <Card>
        <Stack gap="md">
          <Text fw={700}>Attach product image</Text>
          {state && typeof state === 'object' && 'error' in state ? (
            <Alert color="red" icon={<AlertCircle size={18} />}>
              {String(state.error)}
            </Alert>
          ) : null}
          <Group grow>
            <FileInput
              accept="image/*"
              clearable
              description="Images are attached to the product listing, not to individual variants."
              label="Upload product images"
              multiple
              name="productImages"
              placeholder="Choose image files"
              required
            />
            <TextInput label="Image alt text" name="productImageAlt" placeholder="Front view" />
          </Group>
          <Group justify="flex-end">
            <SubmitButton idleLabel="Upload images" pendingLabel="Uploading images..." />
          </Group>
        </Stack>
      </Card>
    </form>
  )
}

function ProductImageOrderForm({
  images,
  productID,
}: {
  images: ProductImage[]
  productID: number
}) {
  const [state, formAction] = useActionState(reorderProductImages.bind(null, productID), null)
  const [orderedImages, setOrderedImages] = useState(images)
  const [draggedID, setDraggedID] = useState<number | null>(null)

  useEffect(() => {
    setOrderedImages(images)
  }, [images])

  const moveImage = (targetID: number) => {
    if (!draggedID || draggedID === targetID) return

    setOrderedImages((currentImages) => {
      const fromIndex = currentImages.findIndex((image) => image.id === draggedID)
      const toIndex = currentImages.findIndex((image) => image.id === targetID)
      if (fromIndex === -1 || toIndex === -1) return currentImages

      const nextImages = [...currentImages]
      const [movedImage] = nextImages.splice(fromIndex, 1)
      nextImages.splice(toIndex, 0, movedImage)
      return nextImages
    })
  }

  if (orderedImages.length === 0) {
    return (
      <Card>
        <Text c="dimmed" ta="center">
          No product images attached yet.
        </Text>
      </Card>
    )
  }

  return (
    <form action={formAction}>
      <Card>
        <Stack gap="md">
          <Group justify="space-between">
            <Stack gap={2}>
              <Text fw={700}>Product image order</Text>
              <Text c="dimmed" size="sm">
                Drag images into the order customers should see them.
              </Text>
            </Stack>
            <SubmitButton idleLabel="Save order" pendingLabel="Saving order..." />
          </Group>
          {state && typeof state === 'object' && 'error' in state ? (
            <Alert color="red" icon={<AlertCircle size={18} />}>
              {String(state.error)}
            </Alert>
          ) : null}
          <input name="imageOrder" type="hidden" value={orderedImages.map((image) => image.id).join(',')} />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {orderedImages.map((productImage, index) => {
              const media = typeof productImage.image === 'number' ? null : productImage.image
              const imageURL = media?.url || media?.thumbnailURL

              return (
                <Box
                  draggable
                  key={productImage.id}
                  onDragEnd={() => setDraggedID(null)}
                  onDragOver={(event) => {
                    event.preventDefault()
                    moveImage(productImage.id)
                  }}
                  onDragStart={() => setDraggedID(productImage.id)}
                  p="md"
                  style={{
                    border: '1px solid var(--mantine-color-default-border)',
                    borderRadius: 'var(--mantine-radius-md)',
                    cursor: 'grab',
                  }}
                >
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <GripVertical size={18} />
                        <Text fw={600}>Image {index + 1}</Text>
                      </Group>
                      <Badge variant="light">Order {index + 1}</Badge>
                    </Group>
                    {imageURL ? (
                      <img
                        alt={media?.alt || `Product image ${index + 1}`}
                        src={imageURL}
                        style={{
                          aspectRatio: '4 / 3',
                          borderRadius: 'var(--mantine-radius-md)',
                          objectFit: 'cover',
                          width: '100%',
                        }}
                      />
                    ) : (
                      <Text c="dimmed" size="sm">
                        Media #{getRelationshipID(productImage.image)}
                      </Text>
                    )}
                  </Stack>
                </Box>
              )
            })}
          </SimpleGrid>
        </Stack>
      </Card>
    </form>
  )
}

function InventoryForm({
  inventoryItem,
  productID,
  variant,
}: {
  inventoryItem?: Inventory
  productID: number
  variant: ProductVariant
}) {
  const [state, formAction] = useActionState(
    inventoryItem ? updateInventory.bind(null, productID, inventoryItem.id) : async () => null,
    null,
  )

  return (
    <form action={formAction}>
      <Card>
        <Group align="end" justify="space-between">
          <Stack gap={2}>
          <Text fw={600}>
            {variant.color} / {variant.size}
          </Text>
          <Text c="dimmed" size="sm">
            + RM {variant.additionalPrice.toFixed(2)}
          </Text>
          </Stack>
          <NumberInput
            defaultValue={inventoryItem?.stockQuantity ?? 0}
            disabled={!inventoryItem}
            label="Stock"
            min={0}
            name="stockQuantity"
            required
          />
          <Stack gap={2}>
            <Text c="dimmed" size="sm">
              Reserved
            </Text>
            <Text fw={600}>{inventoryItem?.reservedQuantity ?? 0}</Text>
          </Stack>
          <Stack gap={4}>
          {state && typeof state === 'object' && 'error' in state ? (
            <Text c="red" size="sm">
              {String(state.error)}
            </Text>
          ) : null}
          <SubmitButton disabled={!inventoryItem} idleLabel="Update" pendingLabel="Updating..." size="xs" />
          </Stack>
        </Group>
      </Card>
    </form>
  )
}

export function ProductEditWorkspace({
  categories,
  images,
  inventory,
  product,
  variants,
}: ProductEditWorkspaceProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const saved = searchParams.get('saved')
    if (!saved) return

    notifications.show({
      color: 'teal',
      icon: <Check size={18} />,
      message: 'Your catalogue changes have been saved.',
      title: 'Saved',
    })
  }, [searchParams])

  if (!product) return null

  const inventoryByVariantID = new Map(
    inventory.map((item) => [getRelationshipID(item.variant), item] as const),
  )

  return (
    <Tabs defaultValue="details">
      <Tabs.List>
        <Tabs.Tab leftSection={<Layers size={16} />} value="details">
          Details
        </Tabs.Tab>
        <Tabs.Tab leftSection={<Ruler size={16} />} value="variants">
          Variants
        </Tabs.Tab>
        <Tabs.Tab leftSection={<Image size={16} />} value="images">
          Images
        </Tabs.Tab>
        <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel pt="lg" value="details">
        <ProductForm categories={categories} product={product} />
      </Tabs.Panel>

      <Tabs.Panel pt="lg" value="variants">
        <Stack gap="lg">
          <AddVariantForm productID={product.id} />
          <Card p={0}>
            <Table verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Variant</Table.Th>
                  <Table.Th>Additional price</Table.Th>
                  <Table.Th>Inventory</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {variants.map((variant) => (
                  <Table.Tr key={variant.id}>
                    <Table.Td>
                      {variant.color} / {variant.size}
                    </Table.Td>
                    <Table.Td>RM {variant.additionalPrice.toFixed(2)}</Table.Td>
                    <Table.Td>
                      {inventoryByVariantID.has(variant.id) ? (
                        <Badge color="teal" variant="light">
                          Tracked
                        </Badge>
                      ) : (
                        <Badge color="orange" variant="light">
                          Missing
                        </Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
                {variants.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <Text c="dimmed" ta="center">
                        No variants yet.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : null}
              </Table.Tbody>
            </Table>
          </Card>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel pt="lg" value="images">
        <Stack gap="lg">
          <AttachImageForm productID={product.id} />
          <ProductImageOrderForm images={images} productID={product.id} />
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel pt="lg" value="inventory">
        <Stack gap="md">
          {variants.map((variant) => (
            <InventoryForm
              inventoryItem={inventoryByVariantID.get(variant.id)}
              key={variant.id}
              productID={product.id}
              variant={variant}
            />
          ))}
          {variants.length === 0 ? (
            <Card>
              <Text c="dimmed" ta="center">
                Add variants before tracking inventory.
              </Text>
            </Card>
          ) : null}
        </Stack>
      </Tabs.Panel>
    </Tabs>
  )
}
