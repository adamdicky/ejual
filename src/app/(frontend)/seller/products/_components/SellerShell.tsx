'use client'

import {
  AppShell,
  Badge,
  Box,
  Button,
  Container,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Boxes, LayoutDashboard, Plus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

type SellerShellProps = {
  children: ReactNode
  description: string
  primaryAction?: {
    href: string
    label: string
  }
  title: string
}

export function SellerShell({ children, description, primaryAction, title }: SellerShellProps) {
  useEffect(() => {
    document.body.classList.add('seller-workspace-active')

    return () => {
      document.body.classList.remove('seller-workspace-active')
    }
  }, [])

  return (
    <AppShell navbar={{ breakpoint: 'md', width: 260 }} padding="md">
      <AppShell.Navbar p="md">
        <Stack gap="lg">
          <Box>
            <Group gap="xs">
              <ShoppingBag size={22} strokeWidth={1.8} />
              <Title order={3}>eJual Seller</Title>
            </Group>
            <Text c="dimmed" mt={4} size="sm">
              Catalogue workspace
            </Text>
          </Box>
          <Stack gap={4}>
            <NavLink
              active
              component={Link}
              href="/seller/products"
              label="Products"
              leftSection={<Boxes size={18} strokeWidth={1.8} />}
            />
            <NavLink
              disabled
              label="Orders"
              leftSection={<LayoutDashboard size={18} strokeWidth={1.8} />}
              rightSection={<Badge variant="light">Next</Badge>}
            />
          </Stack>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container maw={1180} py="xl">
          <Stack gap="xl">
            <Group align="flex-start" justify="space-between">
              <Box>
                <Title order={1}>{title}</Title>
                <Text c="dimmed" mt={6}>
                  {description}
                </Text>
              </Box>
              {primaryAction ? (
                <Button
                  component={Link}
                  href={primaryAction.href}
                  leftSection={<Plus size={18} />}
                >
                  {primaryAction.label}
                </Button>
              ) : null}
            </Group>
            {children}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
