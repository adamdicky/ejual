'use client'

import { Anchor, Box, Container, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

type AuthShellProps = {
  children: ReactNode
  description: string
  footerHref: string
  footerLabel: string
  footerText: string
  title: string
}

export function AuthShell({
  children,
  description,
  footerHref,
  footerLabel,
  footerText,
  title,
}: AuthShellProps) {
  useEffect(() => {
    document.body.classList.add('auth-workspace-active')

    return () => {
      document.body.classList.remove('auth-workspace-active')
    }
  }, [])

  return (
    <Container className="auth-workspace-root" maw={460} py={{ base: 'xl', sm: 80 }}>
      <Stack gap="lg">
        <Box>
          <Group gap="xs" justify="center">
            <ShoppingBag size={26} strokeWidth={1.8} />
            <Title order={2}>eJual</Title>
          </Group>
          <Text c="dimmed" mt="xs" ta="center">
            {description}
          </Text>
        </Box>
        <Paper p="xl" radius="md" shadow="sm" withBorder>
          <Stack gap="lg">
            <Title order={1} size="h2">
              {title}
            </Title>
            {children}
          </Stack>
        </Paper>
        <Text c="dimmed" size="sm" ta="center">
          {footerText}{' '}
          <Anchor component={Link} href={footerHref}>
            {footerLabel}
          </Anchor>
        </Text>
      </Stack>
    </Container>
  )
}
