'use client'

import { AppShell, Box, Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import { LayoutDashboard, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

type ShopShellProps = {
  children: ReactNode
}

export function ShopShell({ children }: ShopShellProps) {
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
            <Group align="center" justify="space-between">
              <Box>
                <Group gap="xs">
                  <ShoppingBag size={26} strokeWidth={1.8} />
                  <Title order={1}>eJual Shop</Title>
                </Group>
                <Text c="dimmed" mt={4}>
                  Browse clothing from sellers across eJual.
                </Text>
              </Box>
              <Button
                component={Link}
                href="/seller/products"
                leftSection={<LayoutDashboard size={18} />}
                variant="filled"
              >
                Seller Workspace
              </Button>
            </Group>
            {children}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
