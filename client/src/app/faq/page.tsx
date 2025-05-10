import { SiteHeader } from '@/components/site-header'
import React from 'react'

import { Metadata } from 'next'

import Footer from '@/components/footer'
import FAQs from '@/components/home/faqs'

export const metadata: Metadata = {
    title: 'FAQs ~ Law Clinic ~ Ahmadu Bello University',
    description: 'See our frequently asked questions at Ahmadu Bello University Law Clinic.'
}

const Page = () => {
  return (
    <main className='overflow-hidden'>
        <SiteHeader />
        
        <div className=''>
            <FAQs />
        </div>

        <Footer />
    </main>
  )
}

export default Page