import LoginForm from '@/components/auth/login-form'
import Loader from '@/components/loader'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login | Clinic',
  description: 'Login to your account. Don\'t have an account? Register.',
  openGraph: {
    images: [
      '/static/images/og/register.jpg',
    ]
  }
}

const Page = () => {
  return (
    <div className='p-2.5 sm:p-8 container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10 h-full'>
      <Suspense fallback={<Loader />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

export default Page
