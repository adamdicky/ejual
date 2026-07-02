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
import { Boxes, LayoutDashboard, LogOut, Plus, ShoppingBag, Store } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { logoutUser } from '@/app/(frontend)/(auth)/actions'

type SellerShellProps = {
  activeNav?: 'orders' | 'products'
  children: ReactNode
  description: string
  primaryAction?: {
    href: string
    label: string
  }
  title: string
  userLabel?: string
}

export function SellerShell({
  activeNav = 'products',
  children,
  description,
  primaryAction,
  title,
  userLabel,
}: SellerShellProps) {
  useEffect(() => {
    document.body.classList.add('seller-workspace-active')

    return () => {
      document.body.classList.remove('seller-workspace-active')
    }
  }, [])

  return (
    <AppShell
      className="seller-workspace-root"
      navbar={{ breakpoint: 'md', width: 260 }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Stack gap="lg" h="100%" justify="space-between">
          <Stack gap="lg">
            <Box>
              <Group gap="xs">
                <ShoppingBag size={22} strokeWidth={1.8} />
                <Title order={3}>eJual Seller</Title>
              </Group>
              <Text c="dimmed" mt={4} size="sm">
                Catalogue workspace
              </Text>
              <Badge mt="sm" variant="light">
                Signed in as {userLabel}
              </Badge>
            </Box>
            <Stack gap={4}>
              <NavLink
                active={activeNav === 'products'}
                component={Link}
                href="/seller/products"
                label="Products"
                leftSection={<Boxes size={18} strokeWidth={1.8} />}
              />
              <NavLink
                active={activeNav === 'orders'}
                component={Link}
                href="/seller/orders"
                label="Orders"
                leftSection={<LayoutDashboard size={18} strokeWidth={1.8} />}
              />
            </Stack>
          </Stack>
          <Stack gap="xs">
            <Button
              component={Link}
              href="/shop"
              justify="flex-start"
              leftSection={<Store size={18} />}
              variant="light"
            >
              Shop as Buyer
            </Button>
            <form action={logoutUser}>
              <Button
                color="gray"
                fullWidth
                justify="flex-start"
                leftSection={<LogOut size={18} />}
                type="submit"
                variant="subtle"
              >
                Log out
              </Button>
            </form>
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
                <Button component={Link} href={primaryAction.href} leftSection={<Plus size={18} />}>
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
