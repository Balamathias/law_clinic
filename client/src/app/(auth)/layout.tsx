import React, { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='bg-gradient-to-br dark:from-gray-950 dark:via-background dark:to-gray-950'>
      <main className='flex items-center justify-center min-h-screen'>
        {children}
      </main>
    </div>
  )
}

export default Layout
