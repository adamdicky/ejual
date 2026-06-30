import Link from 'next/link'

import { getOptionalMeUser } from '@/utilities/getMeUser'

type ForbiddenPageProps = {
  searchParams?: Promise<{
    from?: string
  }>
}

export default async function AdminForbiddenPage({ searchParams }: ForbiddenPageProps) {
  const params = await searchParams
  const currentUser = await getOptionalMeUser()

  return (
    <main
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
      }}
    >
      <section
        style={{
          background: 'var(--theme-elevation-0)',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '12px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)',
          maxWidth: '560px',
          padding: '32px',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'var(--theme-elevation-500)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: 0,
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          Admin access only
        </div>
        <h1 style={{ fontSize: '32px', lineHeight: 1.1, margin: 0 }}>You are not allowed to open this page.</h1>
        <p style={{ color: 'var(--theme-elevation-700)', margin: '16px 0 0' }}>
          {currentUser
            ? `${currentUser.fullName || currentUser.email} is signed in, but this account does not have administrator access for ${params?.from || '/admin'}.`
            : `This area is reserved for administrators. Sign in with an admin account to continue to ${params?.from || '/admin'}.`}
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          <Link
            href="/shop"
            style={{
              background: 'var(--theme-success-500)',
              borderRadius: '8px',
              color: 'white',
              padding: '10px 14px',
              textDecoration: 'none',
            }}
          >
            Return to shop
          </Link>
          <Link
            href={currentUser ? '/seller/products' : '/login'}
            style={{
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '8px',
              color: 'var(--theme-text)',
              padding: '10px 14px',
              textDecoration: 'none',
            }}
          >
            {currentUser ? 'Open seller workspace' : 'Sign in'}
          </Link>
        </div>
      </section>
    </main>
  )
}
