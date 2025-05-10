import Footer from '@/components/footer'
import React, { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
        {children}
        <Footer />
    </div>
  )
}

export default Layout