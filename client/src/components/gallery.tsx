'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useAnimation, MotionValue, useTransform, useSpring, useScroll } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Instagram, 
  Twitter, 
  Facebook, 
  ExternalLink, 
  Maximize2, 
  X,
  Image as ImageIcon,
  Calendar,
  Grid3X3
} from 'lucide-react'
import { Gallery as GalleryType, GalleryImage as GalleryImageType } from '@/@types/db'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface GalleryProps {
  gallery: GalleryType
  className?: string
  gridLayout?: 'default' | 'masonry' | 'carousel'
  showSocialLinks?: boolean
  enableLightbox?: boolean
}

export const Gallery: React.FC<GalleryProps> = ({
  gallery,
  className = '',
  gridLayout = 'default',
  showSocialLinks = true,
  enableLightbox = true
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.1 })
  const controls = useAnimation()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const gridOpacity = useTransform(scrollYProgress, [0, 0.1, 0.4, 0.5], [0.2, 1, 1, 0.9])
  const gridScale = useTransform(scrollYProgress, [0, 0.1, 0.4, 0.5], [0.9, 1, 1, 0.98])
  
  const springOptions = { stiffness: 200, damping: 30 }
  const gridOpacitySpring = useSpring(gridOpacity, springOptions)
  const gridScaleSpring = useSpring(gridScale, springOptions)

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const handleImageClick = (image: GalleryImageType, index: number) => {
    if (enableLightbox) {
      setSelectedImage(image)
      setActiveIndex(index)
    }
  }

  const handleNext = () => {
    if (gallery.images.length <= 1) return
    setActiveIndex((prev) => (prev + 1) % gallery.images.length)
    setSelectedImage(gallery.images[(activeIndex + 1) % gallery.images.length])
  }

  const handlePrev = () => {
    if (gallery.images.length <= 1) return
    setActiveIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length)
    setSelectedImage(gallery.images[(activeIndex - 1 + gallery.images.length) % gallery.images.length])
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const formatYear = (year: number | null) => {
    if (!year) return ''
    return year.toString()
  }

  const renderDepartmentBadge = () => {
    const deptColors: Record<string, string> = {
      'clinical': 'bg-primary/20 text-primary',
      'research': 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
      'litigation': 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
      'other': 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
    }
    
    const deptIcons: Record<string, React.ReactNode> = {
      'clinical': <ImageIcon className="w-4 h-4" />,
      'research': <Calendar className="w-4 h-4" />,
      'litigation': <Grid3X3 className="w-4 h-4" />,
      'other': <ImageIcon className="w-4 h-4" />,
    }
    
    return (
      <span 
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium", 
          deptColors[gallery.department]
        )}
      >
        {deptIcons[gallery.department]}
        {gallery.department.charAt(0).toUpperCase() + gallery.department.slice(1)}
      </span>
    )
  }

  // Framer Motion variants
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  }

  const renderMasonryGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {gallery.images.map((image, index) => (
          <motion.div
            key={image.id}
            variants={imageVariants}
            onClick={() => handleImageClick(image, index)}
            className={cn(
              "relative overflow-hidden rounded-xl cursor-pointer group border border-border/40 shadow-sm",
              index % 3 === 0 ? "md:col-span-2" : "",
              index % 5 === 0 ? "row-span-2" : ""
            )}
          >
            <GalleryImageCard 
              image={image} 
              showSocialLinks={showSocialLinks} 
              aspectRatio={index % 3 === 0 ? "landscape" : (index % 5 === 0 ? "portrait" : "square")} 
            />
          </motion.div>
        ))}
      </div>
    )
  }

  const renderDefaultGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.images.map((image, index) => (
          <motion.div
            key={image.id}
            variants={imageVariants}
            onClick={() => handleImageClick(image, index)}
            className="relative overflow-hidden rounded-xl cursor-pointer group border border-border/40 shadow-sm"
          >
            <GalleryImageCard image={image} showSocialLinks={showSocialLinks} />
          </motion.div>
        ))}
      </div>
    )
  }

  const renderCarousel = () => {
    return (
      <div className="relative overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent snap-x">
          {gallery.images.map((image, index) => (
            <motion.div
              key={image.id}
              variants={imageVariants}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-center"
              onClick={() => handleImageClick(image, index)}
            >
              <div className="rounded-xl overflow-hidden cursor-pointer group border border-border/40 shadow-sm h-full">
                <GalleryImageCard image={image} showSocialLinks={showSocialLinks} aspectRatio="landscape" />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-r-lg">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-l-lg">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Gallery Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{gallery.title}</h2>
            {gallery.is_previous && (
              <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-xs font-medium">
                ARCHIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {renderDepartmentBadge()}
            {gallery.year && (
              <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {formatYear(gallery.year)}
              </span>
            )}
          </div>
        </div>
        
        {gallery.description && (
          <p className="text-muted-foreground mb-6">{gallery.description}</p>
        )}
        
        <div className="w-full h-px bg-border mb-6" />
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        style={{ 
          opacity: gridOpacitySpring,
          scale: gridScaleSpring
        }}
      >
        {gallery.images.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No images in this gallery</p>
          </div>
        ) : gridLayout === 'masonry' ? (
          renderMasonryGrid()
        ) : gridLayout === 'carousel' ? (
          renderCarousel()
        ) : (
          renderDefaultGrid()
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <svg 
                className="absolute top-0 left-0 w-full h-full opacity-50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="lightbox-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeOpacity="0.05" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#lightbox-grid)" />
              </svg>
            </div>
            
            <motion.div 
              className="relative z-10 max-w-6xl w-full mx-auto max-h-[90vh] flex flex-col bg-card/50 backdrop-blur-sm rounded-xl border border-border/60 overflow-hidden"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-border/40">
                <div className="text-lg font-medium truncate">{selectedImage.title || 'Gallery Image'}</div>
                <Button size="icon" variant="ghost" onClick={closeLightbox} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative overflow-hidden rounded-lg flex items-center justify-center"
                >
                  <img 
                    src={selectedImage.image || '/placeholder-image.jpg'} 
                    alt={selectedImage.title || 'Gallery image'}
                    className="max-w-full max-h-[60vh] object-contain mx-auto"
                  />
                </motion.div>

                <div className="pt-4 flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    {selectedImage.description && (
                      <p className="text-sm text-muted-foreground">{selectedImage.description}</p>
                    )}
                  </div>
                  {showSocialLinks && (
                    <div className="flex gap-3">
                      {selectedImage.instagram && (
                        <a 
                          href={selectedImage.instagram}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-card hover:bg-accent transition-colors"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {selectedImage.x_handle && (
                        <a 
                          href={selectedImage.x_handle}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-card hover:bg-accent transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {selectedImage.facebook && (
                        <a 
                          href={selectedImage.facebook}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-card hover:bg-accent transition-colors"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 border-t border-border/40">
                <Button 
                  onClick={handlePrev} 
                  variant="outline" 
                  size="sm"
                  className="rounded-full" 
                  disabled={gallery.images.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  {activeIndex + 1} of {gallery.images.length}
                </div>
                
                <Button 
                  onClick={handleNext} 
                  variant="outline" 
                  size="sm"
                  className="rounded-full" 
                  disabled={gallery.images.length <= 1}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface GalleryImageCardProps {
  image: GalleryImageType
  showSocialLinks?: boolean
  aspectRatio?: 'square' | 'portrait' | 'landscape'
}

export const GalleryImageCard: React.FC<GalleryImageCardProps> = ({ 
  image, 
  showSocialLinks = true,
  aspectRatio = 'square' 
}) => {
  const aspectRatioClass = {
    'square': 'aspect-square',
    'portrait': 'aspect-[3/4]',
    'landscape': 'aspect-[16/9]'
  }

  return (
    <div className={cn("relative overflow-hidden", aspectRatioClass[aspectRatio])}>
      {/* Image */}
      <img 
        src={image.image || '/placeholder-image.jpg'} 
        alt={image.title || 'Gallery image'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-medium line-clamp-1 mb-2">{image.title || 'Untitled'}</h3>
          
          {image.description && (
            <p className="text-white/80 text-sm line-clamp-2 mb-3">{image.description}</p>
          )}
          
          {showSocialLinks && (
            <div className="flex gap-2">
              {image.instagram && (
                <a 
                  href={image.instagram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-white" />
                </a>
              )}
              {image.x_handle && (
                <a 
                  href={image.x_handle}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-white" />
                </a>
              )}
              {image.facebook && (
                <a 
                  href={image.facebook}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-white" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Zoom icon */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
          <Maximize2 className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  )
}

export default Gallery
