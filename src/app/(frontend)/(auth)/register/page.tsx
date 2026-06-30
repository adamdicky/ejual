import { AuthShell } from '../_components/AuthShell'
import { RegisterForm } from '../_components/RegisterForm'
import { getMeUser } from '@/utilities/getMeUser'

export default async function RegisterPage() {
  await getMeUser({ validUserRedirect: '/seller/products' })

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
