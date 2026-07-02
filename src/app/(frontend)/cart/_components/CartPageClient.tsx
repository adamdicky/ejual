'use client'

import { Accordion, Alert, Badge, Button, Card, Checkbox, Group, NativeSelect, NumberInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { CheckCircle2, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'

import { createAddress, placeOrder, removeCartItem, updateCartItem } from '../actions'

function formatPrice(value: number) {
  return `RM ${value.toFixed(2)}`
}

type CartItem = {
  availableStock: number
  description: string
  id: number
  productID: number
  quantity: number
  sellerName: number | null
  unitPrice: number
  variantColor: string
  variantID: number
  variantSize: string
}

type CartPageClientProps = {
  addresses: Array<{ id: number; label: string }>
  items: CartItem[]
  placed: boolean
  totals: { shippingFee: number; subtotal: number; total: number }
}

export function CartPageClient({ addresses, items, placed, totals }: CartPageClientProps) {
  const router = useRouter()
  const [updateState, updateAction, isUpdating] = useActionState(updateCartItem, null)
  const [removeState, removeAction, isRemoving] = useActionState(removeCartItem, null)
  const [placeOrderState, placeOrderAction, isPlacingOrder] = useActionState(placeOrder, null)
  const [createAddressState, createAddressAction, isCreatingAddress] = useActionState(createAddress, null)

  useEffect(() => {
    if (createAddressState?.success) {
      router.refresh()
    }
  }, [createAddressState?.success, router])

  return (
    <Stack gap="lg">
        <Group align="flex-start" justify="space-between" wrap="wrap">
          <Stack gap={4}>
            <Title order={1}>Cart & Checkout</Title>
            <Text c="dimmed">Review your items, choose a delivery address, and place your order.</Text>
          </Stack>
          <Button component={Link} href="/shop" leftSection={<ShoppingBag size={16} />} variant="default">
            Continue shopping
          </Button>
        </Group>

        {placed ? <Alert color="teal">Your order has been placed successfully.</Alert> : null}
        {updateState?.error ? <Alert color="red">{updateState.error}</Alert> : null}
        {removeState?.error ? <Alert color="red">{removeState.error}</Alert> : null}
        {placeOrderState?.error ? <Alert color="red">{placeOrderState.error}</Alert> : null}
        {createAddressState?.error ? <Alert color="red">{createAddressState.error}</Alert> : null}
        {createAddressState?.success ? <Alert color="teal">{createAddressState.success}</Alert> : null}

        {!items.length ? (
          <Card p="xl">
            <Stack align="center" gap="sm" ta="center">
              <ShoppingBag size={44} />
              <Text fw={700}>Your cart is empty</Text>
              <Text c="dimmed">Add a product from the shop to start checkout.</Text>
              <Button component={Link} href="/shop" variant="filled">
                Browse products
              </Button>
            </Stack>
          </Card>
        ) : (
          <Group align="flex-start" grow gap="lg" wrap="wrap">
            <Stack flex={1} gap="lg">
              {items.map((item) => (
                <Card key={item.id} p="lg">
                  <Group align="flex-start" justify="space-between" wrap="wrap">
                    <Stack gap="xs">
                      <Group gap="xs">
                        <Text fw={700}>{item.description}</Text>
                        <Badge color="teal" leftSection={<CheckCircle2 size={12} />} variant="light">
                          {item.availableStock > 0 ? `${item.availableStock} available` : 'Out of stock'}
                        </Badge>
                      </Group>
                      <Text c="dimmed" size="sm">
                        Variant {item.variantColor} · {item.variantSize}
                      </Text>
                      <Text c="dimmed" size="sm">
                        {formatPrice(item.unitPrice)} each
                      </Text>
                    </Stack>
                    <Stack align="flex-end" gap="sm">
                      <Group gap="sm">
                        <form action={updateAction}>
                          <input name="itemID" type="hidden" value={item.id} />
                          <Group gap="sm">
                            <NumberInput
                              aria-label={`Quantity for ${item.description}`}
                              defaultValue={item.quantity}
                              max={item.availableStock}
                              min={1}
                              name="quantity"
                              size="sm"
                              step={1}
                              w={90}
                            />
                            <Button loading={isUpdating} type="submit" variant="default">
                              Update
                            </Button>
                          </Group>
                        </form>
                        <form action={removeAction}>
                          <input name="itemID" type="hidden" value={item.id} />
                          <Button loading={isRemoving} leftSection={<Trash2 size={16} />} type="submit" variant="subtle">
                            Remove
                          </Button>
                        </form>
                      </Group>
                      <Text fw={700}>{formatPrice(item.unitPrice * item.quantity)}</Text>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>

            <Card p="lg" style={{ minWidth: 320 }} w={{ base: '100%', md: 360 }}>
              <Stack gap="md">
                <Title order={3}>Checkout</Title>
                <Text c="dimmed">Choose a delivery address and payment method to complete the order.</Text>
                <Card withBorder>
                  <Accordion chevronPosition="right" defaultValue={null} variant="separated">
                    <Accordion.Item value="new-address">
                      <Accordion.Control>
                        <Text fw={600} size="sm">
                          Add new address
                        </Text>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <form action={createAddressAction}>
                          <Stack gap="sm">
                            <TextInput label="Receiver name" name="receiverName" required />
                            <TextInput label="Phone number" name="phoneNumber" required />
                            <TextInput label="Address line 1" name="addressLine1" required />
                            <TextInput label="Address line 2 (optional)" name="addressLine2" />
                            <Group grow>
                              <TextInput label="City" name="city" required />
                              <TextInput label="State" name="state" required />
                            </Group>
                            <Group grow>
                              <TextInput label="Postcode" name="postcode" required />
                              <TextInput defaultValue="Malaysia" label="Country" name="country" required />
                            </Group>
                            <Checkbox label="Set as default address" name="isDefault" />
                            <Button loading={isCreatingAddress} type="submit" variant="default">
                              Save address
                            </Button>
                          </Stack>
                        </form>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Card>
                <form action={placeOrderAction}>
                  <Stack gap="md">
                    <NativeSelect
                      data={addresses.length ? addresses.map((address) => ({ label: address.label, value: String(address.id) })) : [{ label: 'No addresses yet', value: '' }]}
                      label="Shipping address"
                      name="addressID"
                      required
                    />
                    <NativeSelect
                      data={[
                        { label: 'Cash on delivery', value: 'cash-on-delivery' },
                        { label: 'Card', value: 'card' },
                        { label: 'Online banking', value: 'online-banking' },
                      ]}
                      defaultValue="cash-on-delivery"
                      label="Payment method"
                      name="paymentMethod"
                      required
                    />
                    <Card withBorder>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text c="dimmed">Subtotal</Text>
                          <Text>{formatPrice(totals.subtotal)}</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text c="dimmed">Shipping</Text>
                          <Text>{formatPrice(totals.shippingFee)}</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text fw={700}>Total</Text>
                          <Text fw={700}>{formatPrice(totals.total)}</Text>
                        </Group>
                      </Stack>
                    </Card>
                    <Button loading={isPlacingOrder} type="submit" variant="filled">
                      Place order
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Card>
          </Group>
        )}
      </Stack>
  )
}
