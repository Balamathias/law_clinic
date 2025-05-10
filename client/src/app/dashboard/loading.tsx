import React from 'react'
import Loader from '@/components/loader'

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader variant="dots" size={64} text="" />
    </div>
  )
}

export default Loading