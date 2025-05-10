import React, { PropsWithChildren } from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { getUser } from '@/services/server/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/dashboard/navbar'

const Layout = async ({ children }: PropsWithChildren) => {
  const { data: user } = await getUser()
  
  return (
    <div className='bg-background md:bg-secondary md:dark:bg-background min-h-screen'>
      <DashboardSidebar user={user} />
      <Navbar user={user} />
      <main className='lg:pl-[220px]'>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout