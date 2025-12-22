"use client"

import { Publication } from '@/@types/db'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PublicationCard from './publication-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  ArrowRight,
  Newspaper
} from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Footer from '@/components/footer'

interface Props {
  publications: Publication[],
  count: number,
  pageSize: number,
}

const Publications = ({ publications, count, pageSize }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentPage = Number(searchParams.get('page') || '1')
  const totalPages = Math.ceil(count / pageSize)

  // Reset to page 1 when search changes
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])

  // Handle search submission
  const handleSearch = () => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }
    params.set('page', '1')
    router.push(`/publications?${params.toString()}`)
    setTimeout(() => setIsLoading(false), 500)
  }

  // Handle search key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/publications?${params.toString()}`)
  }

  // Pagination navigation
  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages) return

    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/publications?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setIsLoading(false), 300)
  }

  // Create pagination array with ellipses
  const getPaginationItems = () => {
    const items: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      items.push(1)

      if (currentPage > 3) {
        items.push('ellipsis')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        items.push(i)
      }

      if (currentPage < totalPages - 2) {
        items.push('ellipsis')
      }

      items.push(totalPages)
    }

    return items
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={shouldReduceMotion ? {} : containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Newspaper className="h-4 w-4" />
                Publications
              </span>
            </motion.div>

            <motion.h1
              variants={shouldReduceMotion ? {} : itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
            >
              Legal{' '}
              <span className="text-primary">Insights & Research</span>
            </motion.h1>

            <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-8" />
            </motion.div>

            <motion.p
              variants={shouldReduceMotion ? {} : itemVariants}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              Explore our collection of articles, research papers, and legal analysis written by
              our team of law students and supervisors. Stay informed about legal developments
              and educational resources.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={shouldReduceMotion ? {} : itemVariants}
              className="max-w-xl mx-auto"
            >
              <div className={cn(
                "relative rounded-full transition-all duration-200 border-2 bg-white shadow-sm",
                isSearchFocused
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-gray-200"
              )}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyDown={handleKeyDown}
                  className="rounded-full border-0 pl-12 pr-28 py-6 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-24 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <Button
                  onClick={handleSearch}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-10 px-5"
                >
                  Search
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-16 sm:py-20 bg-[var(--slate-50)]">
        <div className="container px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {searchParams.get('q')
                  ? `Results for "${searchParams.get('q')}"`
                  : "All Publications"}
              </h2>
              <p className="text-muted-foreground">
                {count > 0 ? (
                  <>Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, count)} of {count} publications</>
                ) : (
                  'No publications found'
                )}
              </p>
            </div>
          </div>

          {/* Empty State */}
          {publications.length === 0 ? (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No publications found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchParams.get('q')
                  ? `We couldn't find any publications matching "${searchParams.get('q')}". Try a different search term.`
                  : "There are no publications available at the moment. Check back later for updates."}
              </p>
              {searchParams.get('q') && (
                <Button variant="outline" onClick={clearSearch} className="rounded-full">
                  Clear search
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              {/* Publications Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  variants={shouldReduceMotion ? {} : containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {publications.map((publication, index) => (
                    <motion.div
                      key={publication.id}
                      variants={shouldReduceMotion ? {} : itemVariants}
                    >
                      <PublicationCard
                        publication={publication}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    disabled={currentPage === 1}
                    onClick={() => navigateToPage(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPaginationItems().map((item, index) => (
                      item === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={item}
                          variant={item === currentPage ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "rounded-full h-10 w-10 p-0",
                            item === currentPage && "shadow-md"
                          )}
                          onClick={() => navigateToPage(item as number)}
                        >
                          {item}
                        </Button>
                      )
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    disabled={currentPage === totalPages}
                    onClick={() => navigateToPage(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-[var(--navy-900)] rounded-3xl p-8 sm:p-12 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                  Have a Legal Research Topic?
                </h2>
                <p className="text-white/70 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                  Our team of law students and supervisors are always looking for meaningful research
                  topics. If you have a suggestion or would like to collaborate, we'd love to hear from you.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="rounded-full h-12 px-8 font-semibold shadow-lg shadow-primary/25">
                    <Link href="/contact" className="flex items-center gap-2">
                      Get In Touch
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-8 font-semibold border-white/20 text-white hover:bg-white/10">
                    <Link href="/about">Learn About Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Publications
