import Publications from '@/components/publications/publications'
import { SiteHeader } from '@/components/site-header'
import { PAGE_SIZE } from '@/lib/utils'
import { getPublications } from '@/services/server/publications'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Publications ~ Ahmadu Bello University Law Clinic',
    description: 'Explore our collection of articles, research papers, and legal insights from the ABU Law Clinic team.',
}

interface Props {
    params: Promise<any>,
    searchParams: Promise<Record<string, any>>,
}

const Page = async ({ searchParams: _searchParams }: Props) => {

  const searchParams = await _searchParams

  const { data: publications, count } = await getPublications({ params: { ...searchParams, page_size: PAGE_SIZE, search: searchParams?.q } })

  return (
    <main className='overflow-hidden'>
        <SiteHeader />

        <div className='mt-16'>
            <Publications publications={publications || []} count={count || 0} pageSize={PAGE_SIZE} />
        </div>
    </main>
  )
}

export default Page
