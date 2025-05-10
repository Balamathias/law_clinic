import About from '@/components/about'
import Footer from '@/components/footer'
import { SiteHeader } from '@/components/site-header'
import Sponsors from '@/components/sponsors'
import { getSponsors } from '@/services/server/app_settings'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Sponsors of Law Clinic ~ Ahmadu Bello University',
    description: 'See our Sponsors.'
}

const Page = async () => {

  const { data: sponsors } = await getSponsors()

  return (
    <main className='overflow-hidden'>
        <SiteHeader />
        
        <div className='container max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-16 min-h-[70vh]'>
          <Sponsors sponsors={sponsors} />
        </div>

        <Footer />
    </main>
  )
}

export default Page