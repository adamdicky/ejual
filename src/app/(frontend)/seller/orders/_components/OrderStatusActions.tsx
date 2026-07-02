'use client'

import { Alert, Button, Group, Stack } from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import type { Order } from '@/payload-types'
import { advanceOrderStatus } from '../actions'

const NEXT_STATUS: Partial<Record<Order['orderStatus'], { label: string; status: Order['orderStatus'] }>> = {
  pending: { label: 'Mark processing', status: 'processing' },
  processing: { label: 'Mark shipped', status: 'shipped' },
  shipped: { label: 'Mark delivered', status: 'delivered' },
}

const CANCELLABLE_STATUSES = new Set<Order['orderStatus']>(['pending', 'processing'])

function StatusButton({
  label,
  nextStatus,
  orderID,
  variant,
}: {
  label: string
  nextStatus: Order['orderStatus']
  orderID: number
  variant: 'filled' | 'light'
}) {
  const [state, formAction] = useActionState(advanceOrderStatus.bind(null, orderID, nextStatus), null)
  const { pending } = useFormStatus()

  return (
    <Stack gap={4}>
      <form action={formAction}>
        <Button
          color={nextStatus === 'cancelled' ? 'red' : undefined}
          loading={pending}
          size="xs"
          type="submit"
          variant={variant}
        >
          {label}
        </Button>
      </form>
      {state?.error ? (
        <Alert color="red" icon={<AlertCircle size={14} />} p="xs">
          {state.error}
        </Alert>
      ) : null}
    </Stack>
  )
}

export function OrderStatusActions({ orderID, orderStatus }: { orderID: number; orderStatus: Order['orderStatus'] }) {
  const advance = NEXT_STATUS[orderStatus]

  if (!advance && !CANCELLABLE_STATUSES.has(orderStatus)) return null

  return (
    <Group gap="xs" justify="flex-end" wrap="nowrap">
      {advance ? (
        <StatusButton label={advance.label} nextStatus={advance.status} orderID={orderID} variant="filled" />
      ) : null}
      {CANCELLABLE_STATUSES.has(orderStatus) ? (
        <StatusButton label="Cancel" nextStatus="cancelled" orderID={orderID} variant="light" />
      ) : null}
    </Group>
  )
}
