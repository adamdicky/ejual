'use client'

import { AppShell, Badge, Box, Button, Container, Group, Stack, Text, Title } from '@mantine/core'
<<<<<<< HEAD
import {
  LayoutDashboard,
  LogOut,
  PackageCheck,
  PackageSearch,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react'
=======
import { LayoutDashboard, LogOut, PackageCheck, PackageSearch, ShoppingBag, ShoppingCart } from 'lucide-react'
>>>>>>> a892ff4 (feat: Update .README and import missing icon)
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { logoutUser } from '@/app/(frontend)/(auth)/actions'

type ShopShellProps = {
  cartItemCount?: number
  children: ReactNode
  currentUserLabel?: string | null
}

export function ShopShell({ children, currentUserLabel, cartItemCount }: ShopShellProps) {
  useEffect(() => {
    document.body.classList.add('shop-workspace-active')

    return () => {
      document.body.classList.remove('shop-workspace-active')
    }
  }, [])

  return (
    <AppShell className="shop-workspace-root" padding="md">
      <AppShell.Main>
        <Container maw={1500} py="lg">
          <Stack gap="lg">
            <Group align="flex-start" justify="space-between">
              <Box>
                <Group gap="xs">
                  <ShoppingBag size={26} strokeWidth={1.8} />
                  <Title order={1}>eJual Shop</Title>
                </Group>
                <Text c="dimmed" mt={4}>
                  Browse clothing from sellers across eJual.
                </Text>
              </Box>
              <Stack align="flex-end" gap="xs">
                <Badge color={currentUserLabel ? 'teal' : 'gray'} size="lg" variant="light">
                  {currentUserLabel ? `Signed in as ${currentUserLabel}` : 'Browsing as guest'}
                </Badge>
                <Group gap="sm">
                  {currentUserLabel ? (
                    <>
                      <Button
                        component={Link}
                        href="/orders"
                        leftSection={<PackageSearch size={16} />}
                        variant="default"
                      >
                        My Orders
                      </Button>
                      <form action={logoutUser}>
                        <Button leftSection={<LogOut size={16} />} type="submit" variant="default">
                          Log out
                        </Button>
                      </form>
                    </>
                  ) : (
                    <Button component={Link} href="/login" variant="default">
                      Sign in
                    </Button>
                  )}
                  <Button
                    component={Link}
                    href="/cart"
                    leftSection={<ShoppingCart size={18} />}
                    variant="default"
                  >
                    Cart {typeof cartItemCount === 'number' ? `(${cartItemCount})` : ''}
                  </Button>
                  <Button
                    component={Link}
                    href="/my-purchases"
                    leftSection={<PackageCheck size={18} />}
                    variant="default"
                  >
                    My Purchases
                  </Button>
                  <Button
                    component={Link}
                    href="/seller/products"
                    leftSection={<LayoutDashboard size={18} />}
                    variant="filled"
                  >
                    Seller Workspace
                  </Button>
                </Group>
              </Stack>
            </Group>
            {children}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
