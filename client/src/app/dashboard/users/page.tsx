import UsersOverview from '@/components/users/users-overview'
import UsersTable from '@/components/users/users-table'
import { PAGE_SIZE } from '@/lib/utils'
import { getUsers, getUsersOview } from '@/services/server/users'
import React from 'react'


interface Props {
    params: Promise<any>,
    searchParams: Promise<Record<string, any>>,
}

const Page = async ({ searchParams: _searchParams }: Props) => {
  const searchParams = await _searchParams

const [{ data: users, count }, { data: overview }] = await Promise.all([
    getUsers({
        params: {
            ...searchParams,
        },
    }),
    getUsersOview()
])

  return (
    <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto'>
      <UsersOverview {...overview!}  />
      <UsersTable users={users} count={count} pageSize={PAGE_SIZE} />
    </div>
  )
}

export default Page