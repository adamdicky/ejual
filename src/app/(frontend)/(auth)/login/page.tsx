import { AuthShell } from '../_components/AuthShell'
import { LoginForm } from '../_components/LoginForm'
import { getMeUser } from '@/utilities/getMeUser'

export const metadata = {
  title: 'Sign in | eJual',
}

export default async function LoginPage() {
  await getMeUser({ validUserRedirect: '/shop' })

  return (
    <AuthShell
      description="Sign in to manage buying and selling on eJual."
      footerHref="/register"
      footerLabel="Create an account"
      footerText="New to eJual?"
      title="Sign in"
    >
      <LoginForm />
    </AuthShell>
  )
}
