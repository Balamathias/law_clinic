import Publications from '@/components/publications/publications'
import { SiteHeader } from '@/components/site-header'
import { PAGE_SIZE } from '@/lib/utils'
import { getPublications } from '@/services/server/publications'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Publications ~ Ahmadu Bello University Law Clinic',
    description: 'The official publications of the Ahmadu Bello University Law Clinic',
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

        <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto mt-16'>
            <Publications publications={publications} count={count} pageSize={PAGE_SIZE} />
        </div>
    </main>
  )
}

export default Page