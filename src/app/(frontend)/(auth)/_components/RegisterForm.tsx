'use client'

import { Alert, PasswordInput, Stack, TextInput } from '@mantine/core'
import { AlertCircle, Mail, Phone, User } from 'lucide-react'
import { useActionState } from 'react'

import { registerUser } from '../actions'
import { SubmitButton } from '../../seller/products/_components/SubmitButton'

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, null)

  return (
    <form action={formAction}>
      <Stack gap="md">
        {state?.error ? (
          <Alert color="red" icon={<AlertCircle size={18} />} title="Could not create account">
            {state.error}
          </Alert>
        ) : null}
        <TextInput
          leftSection={<User size={16} />}
          label="Full name"
          name="fullName"
          placeholder="Adam Dicky"
          required
        />
        <TextInput
          leftSection={<Mail size={16} />}
          label="Email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        <TextInput
          leftSection={<Phone size={16} />}
          label="Phone number"
          name="phoneNumber"
          placeholder="+60 12-345 6789"
        />
        <PasswordInput label="Password" name="password" placeholder="Create a password" required />
        <SubmitButton idleLabel="Create account" pendingLabel="Creating account..." />
      </Stack>
    </form>
  )
}
