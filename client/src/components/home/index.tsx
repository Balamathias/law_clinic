"use client"

import Features from '@/components/home/features'
import FAQs from '@/components/home/faqs'
import Hero from '@/components/home/hero'
import Testimonials from '@/components/home/testimonials'
import Banner from '@/components/home/banner'
import Publications from '@/components/home/publications'
import Highlights from '@/components/home/highlights'
import SponsorsShowcase from '@/components/home/sponsors'
import { SiteHeader } from '@/components/site-header'
import Footer from '@/components/footer'
import React from 'react'
import { Event, Testimonial, Sponsor } from '@/@types/db'

interface Props {
  events: Event[],
  testimonials: Testimonial[],
  sponsors?: Sponsor[],
}

const HomeComponent = ({ events, testimonials, sponsors }: Props) => {
  return (
    <div className="w-full overflow-hidden">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Banner />        {events?.length && <Highlights events={events} />}
        <Publications />
        <SponsorsShowcase sponsors={sponsors || []} />
        <FAQs />
        <Testimonials testimonials={testimonials} />
      </main>
      <Footer />
    </div>
  )
}

export default HomeComponent