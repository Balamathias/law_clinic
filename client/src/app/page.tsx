import HomeComponent from '@/components/home'
import { getTestimonials, getSponsors } from '@/services/server/app_settings'
import { getEvents } from '@/services/server/events'
import React from 'react'

const HomePage = async () => {

  const { data: events } = await getEvents({ params: { limit: 4 } })
  const { data: testimonials } = await getTestimonials({ params: { limit: 10 } })
  const { data: sponsors } = await getSponsors({ params: { limit: 20 } })
  
  return (
    <HomeComponent events={events} testimonials={testimonials} sponsors={sponsors} />
  )
}

export default HomePage