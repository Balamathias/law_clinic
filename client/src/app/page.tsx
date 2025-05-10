import HomeComponent from '@/components/home'
import { getTestimonials } from '@/services/server/app_settings'
import { getEvents } from '@/services/server/events'
import React from 'react'

const HomePage = async () => {

  const { data: events } = await getEvents({ params: { limit: 4 } })
  const { data: testimonials } = await getTestimonials({ params: { limit: 10 } })
  return (
    <HomeComponent events={events} testimonials={testimonials} />
  )
}

export default HomePage