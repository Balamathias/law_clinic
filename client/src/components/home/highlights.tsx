"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import {
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format, parseISO, isFuture } from 'date-fns'
import { Event } from '@/@types/db'

// -------------------- Types --------------------
interface HighlightsProps {
  events: Event[]
  heading?: string
  subheading?: string
  tagline?: string
  viewAllHref?: string
  maxUpcoming?: number
  autoPlay?: boolean
  autoPlayInterval?: number // ms
  enableAnimation?: boolean
}

// -------------------- Helpers --------------------
const safeDate = (d?: string | null) => {
  if (!d) return null
  try { return parseISO(d) } catch { try { return new Date(d) } catch { return null } }
}

const fmt = (d?: Date | null, f?: string, fallback = '—') => {
  if (!d || isNaN(d.getTime())) return fallback
  try { return format(d, f!) } catch { return fallback }
}

const categoryColors: Record<string, string> = {
  Workshop: 'bg-emerald-500',
  Conference: 'bg-blue-500',
  Event: 'bg-purple-500',
  Seminar: 'bg-amber-500'
}

const slideVariants = {
  incoming: (dir: number) => ({ x: dir > 0 ? 340 : -340, opacity: 0, scale: 0.9 }),
  active: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 26 } },
  outgoing: (dir: number) => ({ x: dir > 0 ? -340 : 340, opacity: 0, scale: 0.9, transition: { type: 'spring', stiffness: 280, damping: 26 } })
}

// -------------------- Component --------------------
const Highlights: React.FC<HighlightsProps> = ({
  events,
  heading = 'Highlight Events &',
  subheading = 'Workshops',
  tagline = 'Join us at our upcoming events and workshops to learn about important legal topics, receive free consultations, and connect with our community of legal professionals.',
  viewAllHref = '/events',
  maxUpcoming = 3,
  autoPlay = true,
  autoPlayInterval = 6000,
  enableAnimation = true,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const allowAnim = enableAnimation && !shouldReduceMotion
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const hoverRef = useRef(false)
  const focusWithinRef = useRef(false)

  const orderedEvents = useMemo(() => (events || []).filter(Boolean), [events])

  // Guard against empty list
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
      .slice(0, maxUpcoming)
  }, [orderedEvents, maxUpcoming])

  const goTo = useCallback((idx: number) => {
    if (!hasEvents) return
    setDirection(idx > activeIndex ? 1 : -1)
    setActiveIndex((idx + orderedEvents.length) % orderedEvents.length)
  }, [activeIndex, orderedEvents.length, hasEvents])

  const next = useCallback(() => {
    if (!hasEvents) return
    setDirection(1)
    setActiveIndex(i => (i + 1) % orderedEvents.length)
  }, [orderedEvents.length, hasEvents])

  const prev = useCallback(() => {
    if (!hasEvents) return
    setDirection(-1)
    setActiveIndex(i => (i - 1 + orderedEvents.length) % orderedEvents.length)
  }, [orderedEvents.length, hasEvents])

  // Autoplay
  useEffect(() => {
    if (!autoPlay || !allowAnim || !hasEvents) return
    if (hoverRef.current || focusWithinRef.current) return
    const id = setInterval(() => next(), autoPlayInterval)
    return () => clearInterval(id)
  }, [autoPlay, autoPlayInterval, allowAnim, next, hasEvents, activeIndex])

  // Keyboard navigation
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [next, prev])

  const startDate = safeDate(current?.start_date)
  const endDate = safeDate(current?.end_date)

  return (
    <section id="events" className="relative overflow-hidden py-8 sm:py-12 lg:py-20" aria-labelledby="highlights-heading">
      {/* Background Pattern */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 w-full h-full opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute -top-10 -left-10 sm:-top-20 sm:-left-20 w-40 h-40 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 sm:-bottom-20 sm:-right-20 w-40 h-40 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column */}
          <div className="xl:w-5/12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="mb-6 sm:mb-8 lg:mb-10"
            >
              <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full inline-flex items-center text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Workshops & Events
              </div>
              <h2 id="highlights-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
                {heading}
                <br className="hidden sm:block" />
                <span className="text-primary"> {subheading}</span>
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-primary mb-4 sm:mb-6" />
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                {tagline}
              </p>
            </motion.div>

            {/* Upcoming Events */}
            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 lg:mt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                Upcoming Events
              </h3>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {upcomingEvents.map((event, idx) => {
                    const sDate = safeDate(event.start_date)
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.08, duration: 0.4 }}
                        className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary/40 outline-none"
                      >
                        <button
                          onClick={() => goTo(orderedEvents.findIndex(ev => ev.id === event.id))}
                          className="text-left flex w-full items-start gap-3"
                          aria-label={`View details for ${event.title}`}
                        >
                          <div className="bg-gray-50 h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-lg flex flex-col items-center justify-center border">
                            <span className="text-xs font-bold text-primary">{fmt(sDate, 'MMM')}</span>
                            <span className="text-sm sm:text-base font-bold text-gray-900">{fmt(sDate, 'd')}</span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1 mb-1">{event.title}</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500">
                              <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{fmt(sDate, 'h:mm a')}</span>
                              <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{event.location || 'TBA'}</span>
                            </div>
                          </div>
                          <div className={`${categoryColors[event?.category_name as string] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>{event.category_name}</div>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white/60 backdrop-blur-sm border border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500 text-sm sm:text-base">No upcoming events at the moment. Check back soon!</p>
                </div>
              )}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="pt-3 sm:pt-4">
                <Button asChild size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/5 w-full sm:w-auto">
                  <Link href={viewAllHref} aria-label="View all events" className="flex items-center justify-center">
                    View All Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right Column */}
          <div className="xl:w-7/12 w-full mt-6 sm:mt-8 xl:mt-0" aria-live="polite">
            {hasEvents ? (
              <div
                ref={containerRef}
                tabIndex={0}
                onMouseEnter={() => { hoverRef.current = true }}
                onMouseLeave={() => { hoverRef.current = false }}
                onFocus={() => { focusWithinRef.current = true }}
                onBlur={() => { focusWithinRef.current = false }}
                className="relative bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 outline-none focus:ring-2 focus:ring-primary/40"
                role="group"
                aria-roledescription="carousel"
                aria-label="Featured events carousel"
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={allowAnim ? slideVariants : undefined}
                    initial={allowAnim ? 'incoming' : undefined}
                    animate={allowAnim ? 'active' : undefined}
                    exit={allowAnim ? 'outgoing' : undefined}
                    className="flex flex-col"
                    role="group"
                    aria-label={`${current?.title || 'Event'} (${activeIndex + 1} of ${orderedEvents.length})`}
                  >
                    {/* Image */}
                    <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80">
                      <Image
                        src={current?.image || '/images/highlights/default.jpg'}
                        alt={current?.title || 'Event image'}
                        fill
                        className="object-cover"
                        priority={activeIndex === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent" />
                      {/* Controls */}
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={prev}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label="Previous event"
                        >
                          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={next}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label="Next event"
                        >
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.button>
                      </div>
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                        {activeIndex + 1} / {orderedEvents.length}
                      </div>
                      <div className={`${categoryColors[current?.category_name as string] || 'bg-primary'} absolute top-3 sm:top-4 right-3 sm:right-4 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm`}> {current?.category_name || 'Event'} </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 flex-grow">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 line-clamp-2">{current?.title || 'Untitled Event'}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4 text-sm text-gray-600">
                        <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-primary" /><span className="truncate">{fmt(startDate, 'MMM d, yyyy')}</span></div>
                        <div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary" /><span>{fmt(startDate, 'h:mm a')}</span></div>
                        <div className="flex items-center sm:col-span-2 lg:col-span-1"><MapPin className="h-4 w-4 mr-2 text-primary" /><span className="truncate">{current?.location || 'TBA'}</span></div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5 text-sm">
                        {endDate && <div className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-md flex items-center"><Clock className="h-3.5 w-3.5 mr-1" />Ends: {fmt(endDate, 'h:mm a')}</div>}
                        {typeof current?.max_participants === 'number' && (
                          <div className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-md flex items-center"><Users className="h-3.5 w-3.5 mr-1" />{current.max_participants} attendees</div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-3 sm:line-clamp-4 leading-relaxed">{current?.description || 'Details coming soon.'}</p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                          <Link href={`#${current?.id || ''}`} aria-label={`Register for ${current?.title || 'event'}`}>Register Now</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                {/* Dots */}
                <div className="flex justify-center mt-3 sm:mt-4 space-x-2 pb-4" aria-label="Carousel pagination">
                  {orderedEvents.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${idx === activeIndex ? 'bg-primary scale-110' : 'bg-gray-300 hover:bg-gray-400'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                      aria-current={idx === activeIndex}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 border border-dashed border-gray-300 text-center text-gray-500">
                <p className="text-base sm:text-lg">No events to display yet. Once events are published they will appear here.</p>
                <div className="mt-6">
                  <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                    <Link href={viewAllHref}>Browse All Events</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Highlights
