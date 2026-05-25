import { SiteHeader } from '@/components/site-header'
import React from 'react'

import { Metadata } from 'next'

import { getGalleries } from '@/services/server/app_settings'
import ExecutiveCommittee from '@/components/excos'
import Footer from '@/components/footer'

export const metadata: Metadata = {
    title: 'Executive Committee ~ Law Clinic ~ Ahmadu Bello University',
    description: 'Meet the dedicated student leaders and supervisors who run the ABU Law Clinic. Our executive committee works tirelessly to serve the community through legal aid.'
}

const Page = async () => {
    const { data: galleries } = await getGalleries({ params: { ordering: 'ordering' }})
  return (
    <main className='overflow-hidden'>
        <SiteHeader />

        <div className='mt-16'>
            <ExecutiveCommittee galleries={galleries || []} />
        </div>
        <Footer />
    </main>
  )
}

export default Page
