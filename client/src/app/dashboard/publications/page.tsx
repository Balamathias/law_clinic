import React from 'react'
import PublicationsOverview from '@/components/publications/publications-overview'
import PublicationsTable from '@/components/publications/publications-table'
import { PAGE_SIZE } from '@/lib/utils'
import { getPublications, getPublicationStats } from '@/services/server/publications'

interface Props {
  params: Promise<any>,
  searchParams: Promise<Record<string, any>>,
}

const Page = async ({ searchParams: _searchParams }: Props) => {
  const searchParams = await _searchParams;

  const [publications, stats] = await Promise.all([
    getPublications({
      params: {
        ...searchParams,
      },
    }),
    getPublicationStats()
  ]);

  console.log(publications, stats)

  return (
    <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto'>
      <PublicationsOverview stats={stats?.data} />
      <PublicationsTable 
        publications={publications.data} 
        count={publications.count} 
        pageSize={PAGE_SIZE} 
      />
    </div>
  )
}

export default Page