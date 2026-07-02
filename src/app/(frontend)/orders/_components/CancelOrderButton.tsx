'use client'

import { Alert, Button } from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { cancelOrder } from '../actions'

function CancelSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button color="red" loading={pending} type="submit" variant="light">
      {pending ? 'Cancelling...' : 'Cancel order'}
    </Button>
  )
}

export function CancelOrderButton({ orderID }: { orderID: number }) {
  const [state, formAction] = useActionState(cancelOrder.bind(null, orderID), null)

  return (
    <form action={formAction}>
      {state?.error ? (
        <Alert color="red" icon={<AlertCircle size={16} />} mb="sm">
          {state.error}
        </Alert>
      ) : null}
      <CancelSubmitButton />
    </form>
  )
}
