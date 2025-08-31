"use client"

import React, { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePublications } from '@/services/client/publications'
import PublicationCard from '../publications/publication-card'
import { Skeleton } from '@/components/ui/skeleton'

interface PublicationsProps {
  limit?: number
  headingPrimary?: string
  headingSecondary?: string
  viewAllHref?: string
  mobileViewAllHref?: string
  emptyMessage?: string
  highlightFirst?: boolean
  className?: string
  background?: 'subtle' | 'gradient' | 'grid'
}

const Publications: React.FC<PublicationsProps> = ({
  limit = 6,
  headingPrimary = 'Our',
  headingSecondary = 'Publications',
  viewAllHref = '/publications',
  mobileViewAllHref = '/publications',
  emptyMessage = 'No publications available yet. Check back soon.',
  highlightFirst = true,
  className = '',
  background = 'gradient'
}) => {
  const { data, isPending } = usePublications({ params: { limit } })
  const shouldReduceMotion = useReducedMotion()

  if (isPending) return <PublicationsSkeleton />

  const publications = useMemo(() => data?.data?.slice(0, limit) || [], [data, limit])
  const hasItems = publications.length > 0

  const bgMap = {
    subtle: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    grid: 'bg-gray-50 before:absolute before:inset-0 before:[background:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] before:[background-size:28px_28px] before:opacity-50'
  }

  return (
    <section aria-labelledby="publications-heading" className={`relative py-20 ${bgMap[background]} ${className}`}>
      {/* Decorative blobs (no randomness) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -right-28 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={shouldReduceMotion ? {} : { scale: [1.1, 0.95, 1.1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="container max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <h2 id="publications-heading" className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-gray-900">
              <span className="block">{headingPrimary.toUpperCase()}</span>
              <span className="bg-gradient-to-r from-primary via-primary/70 to-primary/50 bg-clip-text text-transparent">{headingSecondary.toUpperCase()}</span>
            </h2>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary to-primary/40 rounded-full" />
            <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed max-w-prose hidden sm:block">
              Explore recent articles, insights, and research authored by our team and contributors.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            whileHover={{ scale: 1.045 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:block"
          >
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-7 group">
              <Link href={viewAllHref} aria-label="See all publications" className="flex items-center gap-2">
                See All
                <motion.span
                  animate={shouldReduceMotion ? {} : { x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className="inline-flex"
                >
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>
        {/* Grid / Empty */}
        {hasItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {publications.map((pub, idx) => {
              const highlight = highlightFirst && idx === 0
              return (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: idx * 0.07 }}
                  className={highlight ? 'md:col-span-2 lg:col-span-1' : ''}
                >
                  <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
                    <PublicationCard publication={pub} index={idx} />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-2xl border border-dashed border-gray-300 bg-white/60 backdrop-blur-sm p-14 text-center"
          >
            <p className="text-gray-500 text-base md:text-lg font-medium">{emptyMessage}</p>
            <div className="mt-8">
              <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                <Link href={viewAllHref}>Browse Archive</Link>
              </Button>
            </div>
          </motion.div>
        )}
        {/* Mobile CTA */}
        {hasItems && (
          <motion.div
            className="mt-12 text-center md:hidden"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-7">
              <Link href={mobileViewAllHref} aria-label="View more publications" className="flex items-center gap-2 justify-center">
                View More Publications
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Publications

export const PublicationsSkeleton = () => (
  <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div className="container max-w-7xl mx-auto px-4">
      <div className="space-y-8">
        <div className="space-y-4 max-w-xl">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </section>
)
