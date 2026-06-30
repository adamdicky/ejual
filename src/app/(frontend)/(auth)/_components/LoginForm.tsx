'use client'

import { Alert, PasswordInput, Stack, TextInput } from '@mantine/core'
import { AlertCircle, Mail } from 'lucide-react'
import { useActionState } from 'react'

import { loginUser } from '../actions'
import { SubmitButton } from '../../seller/products/_components/SubmitButton'

export function LoginForm() {
  const [state, formAction] = useActionState(loginUser, null)

  return (
    <form action={formAction}>
      <Stack gap="md">
        {state?.error ? (
          <Alert color="red" icon={<AlertCircle size={18} />} title="Could not sign in">
            {state.error}
          </Alert>
        ) : null}
        <TextInput
          leftSection={<Mail size={16} />}
          label="Email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        <PasswordInput label="Password" name="password" placeholder="Your password" required />
        <SubmitButton idleLabel="Sign in" pendingLabel="Signing in..." />
      </Stack>
    </form>
  )
}
