import { SiteHeader } from '@/components/site-header'
import React from 'react'

import GetHelp from '@/components/get-help'
import { Metadata } from 'next'

import Footer from '@/components/footer'

export const metadata: Metadata = {
    title: 'Get Help ~ Law Clinic ~ Ahmadu Bello University',
    description: 'Get help from the Law Clinic at Ahmadu Bello University.'
}

const Page = () => {
  return (
    <main className='overflow-hidden'>
        <SiteHeader />
        
        <div className='container max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-16 min-h-[70vh]'>
            <GetHelp />
        </div>

        <Footer />
    </main>
  )
}

export default Page