"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import {
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format, parseISO, isFuture } from 'date-fns'
import { Event } from '@/@types/db'

interface HighlightsProps {
  events: Event[]
}

const categoryColors: Record<string, string> = {
  Workshop: 'bg-emerald-500',
  Conference: 'bg-blue-500',
  Event: 'bg-purple-500',
  Seminar: 'bg-amber-500'
}

const Highlights: React.FC<HighlightsProps> = ({ events }) => {
  const safeDate = (d?: string | null) => {
    if (!d) return null
    try { return parseISO(d) } catch { try { return new Date(d) } catch { return null } }
  }

  const fmt = (d?: Date | null, f?: string, fallback = '—') => {
    if (!d || isNaN(d.getTime())) return fallback
    try { return format(d, f!) } catch { return fallback }
  }

  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const hoverRef = useRef(false)

  const orderedEvents = useMemo(() => (events || []).filter(Boolean), [events])
  const hasEvents = orderedEvents.length > 0
  const current = hasEvents ? orderedEvents[activeIndex % orderedEvents.length] : undefined

  const upcomingEvents = useMemo(() => {
    return orderedEvents
      .filter(e => {
        const d = safeDate(e?.start_date)
        return d && isFuture(d)
      })
      .sort((a, b) => {
        const da = safeDate(a.start_date)?.getTime() || 0
        const db = safeDate(b.start_date)?.getTime() || 0
        return da - db
      })
      .slice(0, 4)
  }, [orderedEvents])

  const goTo = useCallback((idx: number) => {
    if (!hasEvents) return
    setActiveIndex((idx + orderedEvents.length) % orderedEvents.length)
  }, [orderedEvents.length, hasEvents])

  const next = useCallback(() => {
    if (!hasEvents) return
    setActiveIndex(i => (i + 1) % orderedEvents.length)
  }, [orderedEvents.length, hasEvents])

  const prev = useCallback(() => {
    if (!hasEvents) return
    setActiveIndex(i => (i - 1 + orderedEvents.length) % orderedEvents.length)
  }, [orderedEvents.length, hasEvents])

  useEffect(() => {
    if (!hasEvents || hoverRef.current) return
    const id = setInterval(() => next(), 6000)
    return () => clearInterval(id)
  }, [next, hasEvents])

  const startDate = safeDate(current?.start_date)

  if (!hasEvents) {
    return (
      <section className="py-16 md:py-24 bg-[var(--slate-50)]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground mb-8">No events scheduled at the moment. Check back soon!</p>
          <Button asChild variant="outline">
            <Link href="/events">Browse All Events</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-[var(--slate-50)]" aria-labelledby="highlights-heading">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
            Events & Workshops
          </span>
          <h2 id="highlights-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Upcoming Events
          </h2>
          <div className="h-1 w-16 bg-primary mt-6 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Featured Event Carousel */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              onMouseEnter={() => { hoverRef.current = true }}
              onMouseLeave={() => { hoverRef.current = false }}
            >
              {/* Image */}
              <div className="relative h-64 sm:h-72 md:h-80">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={current?.image || '/images/highlights/default.jpg'}
                      alt={current?.title || 'Event'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Category Badge */}
                <div className={`${categoryColors[current?.category_name as string] || 'bg-primary'} absolute top-4 left-4 text-white px-3 py-1.5 rounded-full font-medium text-sm`}>
                  {current?.category_name || 'Event'}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                  <button
                    onClick={prev}
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg"
                    aria-label="Previous event"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg"
                    aria-label="Next event"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Date Badge */}
                <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-foreground">{fmt(startDate, 'd')}</span>
                    <span className="block text-xs font-medium text-primary uppercase">{fmt(startDate, 'MMM')}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 line-clamp-2">
                  {current?.title}
                </h3>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{fmt(startDate, 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{current?.location || 'TBA'}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
                  {current?.short_description || current?.description || 'Details coming soon.'}
                </p>

                <div className="flex items-center justify-between">
                  <Button asChild className="rounded-full">
                    <Link href={`/events/${current?.slug || current?.id}`}>
                      Register Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>

                  {/* Pagination Dots */}
                  <div className="flex gap-2">
                    {orderedEvents.slice(0, 5).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goTo(idx)}
                        className={`h-2 rounded-full transition-all ${idx === activeIndex ? 'bg-primary w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Upcoming Events List */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Coming Up
              </h3>

              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, idx) => {
                    const sDate = safeDate(event.start_date)
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Link
                          href={`/events/${event.slug || event.id}`}
                          className="group flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all"
                        >
                          {/* Date */}
                          <div className="flex-shrink-0 bg-[var(--slate-100)] rounded-lg p-3 text-center min-w-[60px]">
                            <span className="block text-xl font-bold text-foreground">{fmt(sDate, 'd')}</span>
                            <span className="block text-xs font-medium text-muted-foreground uppercase">{fmt(sDate, 'MMM')}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1 mb-1">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {fmt(sDate, 'h:mm a')}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location || 'TBA'}
                              </span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </Link>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="bg-white rounded-xl p-6 border border-dashed border-gray-200 text-center">
                    <p className="text-muted-foreground text-sm">No upcoming events at the moment.</p>
                  </div>
                )}
              </div>

              {/* View All Button */}
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/events" className="flex items-center justify-center gap-2">
                    View All Events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Highlights
