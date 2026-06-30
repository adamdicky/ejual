import { Alert, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { LockKeyhole, ShoppingBag } from 'lucide-react'

import { getOptionalMeUser } from '@/utilities/getMeUser'

export const metadata = {
  title: 'Access Denied | eJual',
}

type ForbiddenPageProps = {
  searchParams?: Promise<{
    from?: string
  }>
}

export default async function ForbiddenPage({ searchParams }: ForbiddenPageProps) {
  const params = await searchParams
  const currentUser = await getOptionalMeUser()

  return (
    <Container className="auth-workspace-root" maw={560} py={{ base: 'xl', sm: 80 }}>
      <Stack gap="lg">
        <Stack align="center" gap="xs" ta="center">
          <Group gap="xs">
            <ShoppingBag size={26} strokeWidth={1.8} />
            <Title order={2}>eJual</Title>
          </Group>
          <Text c="dimmed">
            This area is reserved for administrators.
          </Text>
        </Stack>

        <Paper p="xl" radius="md" shadow="sm" withBorder>
          <Stack gap="lg">
            <Group gap="sm" wrap="nowrap">
              <LockKeyhole size={22} strokeWidth={1.8} />
              <Title order={1} size="h2">
                Access denied
              </Title>
            </Group>

            <Alert color="orange" title="Admin access only" variant="light">
              {currentUser
                ? `${currentUser.fullName || currentUser.email} is signed in, but this account does not have permission to open ${params?.from || '/admin'}.`
                : `You do not have permission to open ${params?.from || '/admin'}.`}
            </Alert>

            <Text c="dimmed">
              Use an administrator account to enter the Payload admin panel. Buyer and seller features remain available from the main eJual app.
            </Text>

            <Group>
              <Button component="a" href="/shop">
                Return to shop
              </Button>
              {!currentUser ? (
                <Button component="a" href="/login" variant="default">
                  Sign in
                </Button>
              ) : null}
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
