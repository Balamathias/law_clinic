'use client'

import { Publication } from '@/@types/db'
import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

import { Merriweather } from 'next/font/google'

const merriweather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700', '900'] })

import MarkdownPreview from '@/components/markdown-preview'
import { cn } from '@/lib/utils'

interface PublicationDetailProps {
  publication: Publication | null
}

const PublicationDetail: React.FC<PublicationDetailProps> = ({ publication }) => {
  if (!publication) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Publication not found</h2>
        <p className="text-muted-foreground mb-6">The publication you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/publications">View all publications</Link>
        </Button>
      </motion.div>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy')
    } catch (e) {
      return 'Unknown date'
    }
  }

  const publishedDate = publication.published_at ? formatDate(publication.published_at) : formatDate(publication.created_at)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Button variant="ghost" size="sm" asChild className="group flex items-center gap-2">
          <Link href="/publications">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to publications</span>
          </Link>
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {publication.categories?.map(category => (
            <span 
              key={category.id} 
              className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
            >
              {category.name}
            </span>
          ))}
          {!publication.categories?.length && publication.category_name && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {publication.category_name}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{publication.title}</h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={publication.author?.avatar || ''} alt={publication.author_name || 'Author'} />
              <AvatarFallback>
                {publication.author?.first_name?.[0] || publication.author_name?.[0] || 'A'}
              </AvatarFallback>
            </Avatar>
            <span>{publication.author_name || publication.author?.first_name || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{publishedDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{publication.mins_read} min read</span>
          </div>
        </div>
      </motion.div>

      {/* Feature image */}
      {publication.featured_image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 overflow-hidden rounded-xl"
        >
          <img 
            src={publication.featured_image}
            alt={publication.title}
            className="w-full h-auto object-cover object-center hover:scale-105 transition-transform duration-700"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="dark:prose-invert max-w-none"
      >
        <MarkdownPreview content={publication?.content!} className={cn(merriweather.className, '')} />
      </motion.div>

      {/* Author box */}
      {publication.author && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 p-6 border rounded-xl bg-card"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={publication.author.avatar || ''} alt={publication.author_name || 'Author'} />
              <AvatarFallback className="text-lg">
                {publication.author.first_name?.[0] || 
                 publication.author.email?.[0]?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-lg font-semibold">
                {`${publication.author.first_name || ''} ${publication.author.last_name || ''}`}
              </h3>
              {publication.author.email && (
                <p className="text-sm text-muted-foreground">{publication.author.email}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Publish date footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-10 pt-4 border-t text-sm text-muted-foreground"
      >
        <p>
          {publication.status === 'published' 
            ? `Published on ${publishedDate}` 
            : `Last updated on ${formatDate(publication.updated_at)}`}
        </p>
      </motion.div>
    </div>
  )
}

export default PublicationDetail