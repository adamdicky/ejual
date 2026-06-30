import { AuthShell } from '../_components/AuthShell'
import { LoginForm } from '../_components/LoginForm'
import { getMeUser } from '@/utilities/getMeUser'

export default async function LoginPage() {
  await getMeUser({ validUserRedirect: '/seller/products' })

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
