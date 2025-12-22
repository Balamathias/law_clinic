"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Publication } from '@/@types/db'
import { format } from 'date-fns'
import Image from 'next/image'

interface PublicationCardProps {
  publication: Publication
  index?: number
}

const PublicationCard = ({ publication, index = 0 }: PublicationCardProps) => {
  const shouldReduceMotion = useReducedMotion()

  const categoryName = publication.categories?.[0]?.name || 'Article'
  const authorName = publication.author?.first_name && publication.author?.last_name
    ? `${publication.author.first_name} ${publication.author.last_name}`
    : publication.author?.email || 'ABU Law Clinic'

  return (
    <motion.article
      className="group h-full"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/publications/${publication.slug}`} className="block h-full">
        <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
            {publication.featured_image ? (
              <Image
                src={publication.featured_image}
                alt={publication.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-primary/40 text-4xl font-bold">
                  {publication.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/95 backdrop-blur-sm text-foreground shadow-sm">
                {categoryName}
              </span>
            </div>

            {/* Arrow indicator on hover */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 flex-grow flex flex-col">
            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {publication.title}
            </h3>

            {/* Excerpt */}
            {publication.excerpt && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                {publication.excerpt}
              </p>
            )}

            {/* Meta Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground/80 truncate max-w-[120px]">
                    {authorName}
                  </span>
                </div>

                {/* Date and Read Time */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {publication.created_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(publication.created_at), 'MMM d')}
                    </span>
                  )}
                  {publication.mins_read && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {publication.mins_read} min
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default PublicationCard
