import { AuthShell } from '../_components/AuthShell'
import { RegisterForm } from '../_components/RegisterForm'
import { getMeUser } from '@/utilities/getMeUser'

export const metadata = {
  title: 'Create account | eJual',
}

export default async function RegisterPage() {
  await getMeUser({ validUserRedirect: '/shop' })

  return (
    <AuthShell
      description="Create your eJual account to buy items and manage seller listings."
      footerHref="/login"
      footerLabel="Sign in"
      footerText="Already have an account?"
      title="Create account"
    >
      <RegisterForm />
    </AuthShell>
  )
}
