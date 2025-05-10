'use client'

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { Gallery as GalleryType } from '@/@types/db'
import { Button } from './ui/button'
import { GalleryImageCard } from './gallery'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface GalleryShowcaseProps {
  gallery: GalleryType
  className?: string
  showMoreUrl?: string
}

export const GalleryShowcase: React.FC<GalleryShowcaseProps> = ({ 
  gallery, 
  className = '',
  showMoreUrl
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const maxVisibleImages = 4
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
    if (activeIndex < gallery.images.length - maxVisibleImages) {
      setActiveIndex(activeIndex + 1)
    }
  }
  
  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  }
  
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  }
  
  const formatYear = (year: number | null) => {
    if (!year) return ''
    return year.toString()
  }
  
  return (
    <div className={cn("relative py-8", className)} ref={ref}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      </div>
      
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex justify-between items-end mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">{gallery.title}</h2>
          {gallery.year && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="capitalize">{gallery.department}</span>
              <span className="mx-2">•</span>
              <span>{formatYear(gallery.year)}</span>
            </div>
          )}
        </div>
        
        {showMoreUrl && (
          <Button variant="link" asChild className="gap-1.5">
            <Link href={showMoreUrl}>
              View Gallery <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </motion.div>
      
      {/* Images carousel */}
      <div className="relative">
        <motion.div
          ref={scrollContainerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 hide-scrollbar snap-x"
        >
          {gallery.images.map((image, index) => (
            <motion.div 
              key={image.id} 
              variants={itemVariants}
              className="flex-shrink-0 w-[280px] md:w-[300px] snap-start"
            >
              <div className="relative overflow-hidden rounded-xl border border-border/40 shadow-sm">
                <GalleryImageCard 
                  image={image} 
                  showSocialLinks={false} 
                  aspectRatio="landscape"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Navigation buttons */}
        {gallery.images.length > maxVisibleImages && (
          <>
            <Button 
              size="icon" 
              variant="outline" 
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-background/80 backdrop-blur-sm"
              onClick={handlePrev}
              disabled={activeIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant="outline" 
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-background/80 backdrop-blur-sm"
              onClick={handleNext}
              disabled={activeIndex >= gallery.images.length - maxVisibleImages}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default GalleryShowcase
