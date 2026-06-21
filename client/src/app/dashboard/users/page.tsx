'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import UsersOverview from '@/components/users/users-overview'
import UsersTable from '@/components/users/users-table'
import { PAGE_SIZE } from '@/lib/utils'
import { getUsers, getUsersOview } from '@/services/server/users'
import Loader from '@/components/loader'

const Page = () => {
  const searchParams = useSearchParams()
  
  const params: Record<string, any> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })

  const { data: usersRes, isLoading: isUsersLoading } = useQuery({
    queryKey: ['users-list', params],
    queryFn: () => getUsers({ params }),
  })

  const { data: overviewRes, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['users-overview'],
    queryFn: () => getUsersOview(),
  })

  if (isUsersLoading || isOverviewLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading users data..." />
      </div>
    )
  }

  const users = usersRes?.data || []
  const count = usersRes?.count || 0
  const overview = overviewRes?.data

  return (
    <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto'>
      {overview && <UsersOverview {...overview} />}
      <UsersTable users={users} count={count} pageSize={PAGE_SIZE} />
    </div>
  )
}

export default Page