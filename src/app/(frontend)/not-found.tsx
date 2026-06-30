import { Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { SearchX, ShoppingBag } from 'lucide-react'

import React from 'react'

export const metadata = {
  title: 'Page Not Found | eJual',
}

export default function NotFound() {
  return (
    <Container className="auth-workspace-root" maw={560} py={{ base: 'xl', sm: 80 }}>
      <Stack gap="lg">
        <Stack align="center" gap="xs" ta="center">
          <Group gap="xs">
            <ShoppingBag size={26} strokeWidth={1.8} />
            <Title order={2}>eJual</Title>
          </Group>
          <Text c="dimmed">The page you opened is not available.</Text>
        </Stack>

        <Paper p="xl" radius="md" shadow="sm" withBorder>
          <Stack gap="lg">
            <Group gap="sm" wrap="nowrap">
              <SearchX size={22} strokeWidth={1.8} />
              <Title order={1} size="h2">
                Page not found
              </Title>
            </Group>

            <Text c="dimmed">
              This link does not match an active eJual page. Continue browsing available clothing products from the shop.
            </Text>

            <Group>
              <Button component="a" href="/shop">
                Return to shop
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
