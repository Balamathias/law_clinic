"use client"

import React, { useMemo, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePublications } from '@/services/client/publications'
import PublicationCard from '../publications/publication-card'
import { Skeleton } from '@/components/ui/skeleton'

const Publications = () => {
  const { data, isPending } = usePublications({ params: { limit: 6 } })
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const publications = useMemo(() => data?.data?.slice(0, 6) || [], [data])
  const hasItems = publications.length > 0

  if (isPending) return <PublicationsSkeleton />

  return (
    <section aria-labelledby="publications-heading" className="relative py-16 md:py-24 bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              Latest Articles
            </span>
            <h2 id="publications-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Publications
            </h2>
            <div className="h-1 w-16 bg-primary mt-6 rounded-full" />
            <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
              Explore articles, insights, and research from our team and contributors.
            </p>
          </div>

          <Button asChild className="hidden md:flex rounded-full" variant="outline">
            <Link href="/publications" className="flex items-center gap-2">
              Browse All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Grid */}
        {hasItems ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {publications.map((pub, idx) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group"
              >
                <div className="h-full transition-transform duration-300 group-hover:-translate-y-1">
                  <PublicationCard publication={pub} index={idx} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-dashed border-gray-200 bg-[var(--slate-50)] p-12 text-center"
          >
            <p className="text-muted-foreground text-base">No publications available yet. Check back soon.</p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href="/publications">Browse Archive</Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Mobile CTA */}
        {hasItems && (
          <motion.div
            className="mt-10 text-center md:hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild className="rounded-full w-full max-w-xs">
              <Link href="/publications" className="flex items-center gap-2 justify-center">
                View All Publications
                <ArrowRight className="h-4 w-4" />
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
  <section className="relative py-16 md:py-24 bg-white">
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4 max-w-xl">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-1 w-16" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </section>
)
