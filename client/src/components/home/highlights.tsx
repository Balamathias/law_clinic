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
  Workshop: 'bg-primary',
  Conference: 'bg-info',
  Event: 'bg-brand-700',
  Seminar: 'bg-gold text-foreground'
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
      <section className="bg-surface-muted py-20 md:py-28 lg:py-36">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-eyebrow inline-block mb-3">Events & Workshops</span>
          <h2 className="text-h2-editorial text-foreground mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">No events scheduled at the moment. Check back soon!</p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/events">Browse All Events</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="bg-surface-muted py-20 md:py-28 lg:py-36" aria-labelledby="highlights-heading">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-eyebrow inline-block">
            Events & Workshops
          </span>
          <h2 id="highlights-heading" className="text-h2-editorial mt-4 text-foreground">
            Upcoming Events
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Featured Event Carousel */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow duration-300"
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
                <div className={`${categoryColors[current?.category_name as string] || 'bg-primary'} absolute top-4 left-4 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs tracking-wide uppercase shadow-sm backdrop-blur-sm`}>
                  {current?.category_name || 'Event'}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                  <button
                    onClick={prev}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/80 dark:bg-black/50 text-foreground backdrop-blur-md transition-all hover:bg-white dark:hover:bg-black/70 hover:scale-105 shadow-sm"
                    aria-label="Previous event"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/80 dark:bg-black/50 text-foreground backdrop-blur-md transition-all hover:bg-white dark:hover:bg-black/70 hover:scale-105 shadow-sm"
                    aria-label="Next event"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Date Badge */}
                <div className="absolute bottom-4 left-4 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md px-4 py-3 shadow-md">
                  <div className="text-center">
                    <span className="block text-2xl font-extrabold text-foreground leading-none">{fmt(startDate, 'd')}</span>
                    <span className="block text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{fmt(startDate, 'MMM')}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-7">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3 line-clamp-2 tracking-tight">
                  {current?.title}
                </h3>

                <div className="flex flex-wrap gap-4 mb-4 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1.5 rounded-lg">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{fmt(startDate, 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1.5 rounded-lg">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{current?.location || 'TBA'}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
                  {current?.short_description || current?.description || 'Details coming soon.'}
                </p>

                <div className="flex items-center justify-between">
                  <Button asChild className="rounded-xl shadow-xs font-bold text-xs h-10 px-5">
                    <Link href={`/events/${current?.slug || current?.id}`}>
                      Register Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>

                  {/* Pagination Dots */}
                  <div className="flex items-center gap-1.5">
                    {orderedEvents.slice(0, 5).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goTo(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-primary w-7' : 'bg-muted-foreground/20 w-2 hover:bg-muted-foreground/40'}`}
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
              <h3 className="font-serif text-lg font-bold text-foreground mb-6 flex items-center gap-2.5 border-b border-border/40 pb-4">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
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
                          className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5"
                        >
                          {/* Date */}
                          <div className="min-w-[56px] flex-shrink-0 rounded-xl bg-primary/5 border border-primary/10 p-3 text-center">
                            <span className="block text-xl font-extrabold text-foreground leading-none">{fmt(sDate, 'd')}</span>
                            <span className="block text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{fmt(sDate, 'MMM')}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-serif font-bold text-foreground text-sm group-hover:text-primary transition-colors duration-200 line-clamp-1 mb-1.5">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-primary/60" />
                                {fmt(sDate, 'h:mm a')}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-primary/60" />
                                {event.location || 'TBA'}
                              </span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
                        </Link>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center">
                    <div className="size-10 rounded-2xl bg-muted/40 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="size-5 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold">No upcoming events at the moment.</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">Check back soon for new workshops and seminars.</p>
                  </div>
                )}
              </div>

              {/* View All Button */}
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full rounded-xl border-border font-bold text-xs h-10 hover:bg-muted/40 transition-colors">
                  <Link href="/events" className="flex items-center justify-center gap-2">
                    View All Events
                    <ArrowRight className="h-3.5 w-3.5" />
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
