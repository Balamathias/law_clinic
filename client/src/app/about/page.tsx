import About from '@/components/about'
import Footer from '@/components/footer'
import { SiteHeader } from '@/components/site-header'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'About Law Clinic ~ Ahmadu Bello University',
    description: 'Learn more about the Law Clinic and its services at Ahmadu Bello University.'
}

const Page = () => {
  return (
    <main className='overflow-hidden'>
        <SiteHeader />
        
        <div className='mt-16 min-h-[70vh]'>
            <About />
        </div>

        <Footer />
    </main>
  )
}

export default Page
