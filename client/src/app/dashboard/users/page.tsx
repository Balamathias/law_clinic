'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Users2 } from 'lucide-react'
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
    <div className='space-y-8 max-w-7xl mx-auto px-1'>
      {/* Premium Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Users2 className="size-3.5" />
            Clinic Directory
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Roster & Users
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Configure system privilege roles, enroll new staff members, and audit clinic credentials.
          </p>
        </div>
      </div>

      {overview && <UsersOverview {...overview} />}
      <UsersTable users={users} count={count} pageSize={PAGE_SIZE} />
    </div>
  )
}

export default Page