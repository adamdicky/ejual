'use client'

import { Button, type ButtonProps } from '@mantine/core'
import { useFormStatus } from 'react-dom'

type SubmitButtonProps = ButtonProps & {
  idleLabel: string
  pendingLabel?: string
}

export function SubmitButton({ idleLabel, pendingLabel, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button loading={pending} type="submit" {...props}>
      {pending ? pendingLabel || 'Saving...' : idleLabel}
    </Button>
  )
}
