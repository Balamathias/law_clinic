import { SiteHeader } from '@/components/site-header'
import { getPublication } from '@/services/server/publications'
import { Metadata, ResolvingMetadata } from 'next'
import React from 'react'
import PublicationDetail from '@/components/publications/publication-detail'
import { motion } from 'framer-motion'

interface Props {
    params: Promise<{id: string}>,
    searchParams: Promise<Record<string, any>>,
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id

  const { data: publication } = await getPublication(id)

  const previousImages = (await parent).openGraph?.images || []

  if (!publication) {
    return {
      title: 'Publication Not Found',
    }
  }

  return {
    title: publication.title,
    openGraph: {
      title: publication.title,
      description: publication.excerpt || publication.content || 'No description available',
      images: publication.featured_image ? [
        {
          url: publication.featured_image,
          // You can add width and height if known
          // width: 800,
          // height: 600,
        },
      ] : [],
    },
  }
}

const Page = async ({ searchParams: _searchParams, params }: Props) => {
  const { data: publication } = await getPublication(( await params)?.id)

  return (
    <main className='overflow-hidden'>
        <SiteHeader />
        
        <div className='container max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-16'>
            <PublicationDetail publication={publication} />
        </div>
    </main>
  )
}

export default Page