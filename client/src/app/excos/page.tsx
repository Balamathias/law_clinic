import { SiteHeader } from '@/components/site-header'
import React from 'react'

import { Metadata } from 'next'

import Footer from '@/components/footer'
import { getGalleries } from '@/services/server/app_settings'
import Gallery from '@/components/gallery'

export const metadata: Metadata = {
    title: 'Gallery ~ Law Clinic ~ Ahmadu Bello University',
    description: 'Gallery from the Law Clinic at Ahmadu Bello University.'
}

const Page = async () => {
    const { data: galleries } = await getGalleries({ params: { ordering: 'ordering' }})
  return (
    <main className='overflow-hidden'>
        <SiteHeader />
        
        <div className='container max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-16 min-h-[70vh]'>
            {
                galleries?.map((gallery) => (
                    <div key={gallery.id} className="my-10">
                        <Gallery gallery={gallery} />
                    </div>
                ))
            }
        </div>

        <Footer />
    </main>
  )
}

export default Page