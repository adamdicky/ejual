'use client'

import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { AlertCircle, Check, Image, Layers, Ruler } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useActionState, useEffect } from 'react'

import type { Category, Inventory, ProductImage, ProductVariant } from '@/payload-types'
import { ProductForm } from './ProductForm'
import { SubmitButton } from './SubmitButton'
import { addVariant, attachProductImage, updateInventory } from '../actions'
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
            <NumberInput
              description="Use an existing Payload media document ID."
              label="Media ID"
              min={1}
              name="mediaID"
              required
            />
            <NumberInput defaultValue={0} label="Display order" min={0} name="displayOrder" required />
          </Group>
          <Group justify="flex-end">
            <SubmitButton idleLabel="Attach image" pendingLabel="Attaching image..." />
          </Group>
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
          <Card p={0}>
            <Table verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Media</Table.Th>
                  <Table.Th>Display order</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {images.map((image) => (
                  <Table.Tr key={image.id}>
                    <Table.Td>Media #{getRelationshipID(image.image)}</Table.Td>
                    <Table.Td>{image.displayOrder}</Table.Td>
                  </Table.Tr>
                ))}
                {images.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Text c="dimmed" ta="center">
                        No product images attached yet.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : null}
              </Table.Tbody>
            </Table>
          </Card>
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
