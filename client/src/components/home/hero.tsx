"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'

const heroImages = [
  '/images/hero/hero1.jpeg',
  '/images/hero/hero2.jpeg',
  '/images/hero/hero3.jpeg',
  '/images/hero/hero4.jpeg',
]

const AUTO_ADVANCE_MS = 8000

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(interval)
  }, [shouldReduceMotion])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Background Slideshow */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.35 : 1.0, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        {/* Charcoal & dark forest green vignette gradient overlay for supreme contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/95 via-neutral-900/80 to-brand-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-brand-900/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-transparent to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-center min-h-screen">
        <div className="py-24 md:py-32 w-full flex flex-col items-center justify-center">
          <motion.div
            className="flex flex-col items-center text-center max-w-4xl mx-auto w-full space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4 w-full flex flex-col items-center">
              <h1
                id="hero-heading"
                className="text-display text-white leading-tight font-semibold tracking-tight text-center"
              >
                <span className="block bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                  Empowering
                </span>
                <span className="inline-block bg-gradient-to-r from-emerald-300 via-emerald-400 to-primary bg-clip-text text-transparent italic font-normal px-2">
                  communities
                </span>
                <span className="mt-4 block font-sans text-xl font-medium tracking-normal text-white/80 sm:text-2xl md:text-3xl leading-snug text-center">
                  Through Legal Aid & Education
                </span>
              </h1>

              <div className="flex items-center justify-center gap-3 text-white/50 text-xs sm:text-sm mt-4 sm:mt-6">
                <div className="h-px w-6 sm:w-8 bg-primary" />
                <span>ABU Law Clinic · Ahmadu Bello University, Zaria</span>
                <div className="h-px w-6 sm:w-8 bg-primary" />
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed text-center"
            >
              Justice for the poor and less privileged. We provide timely legal assistance,
              structured advocacy, and experiential learning that shapes tomorrow's legal professionals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-2 w-full"
            >
              <Button
                size="lg"
                className="group bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 sm:h-13 rounded-full transition-all duration-300 shadow-lg shadow-white/5 w-full sm:w-auto"
                asChild
              >
                <Link href="/get-help" className="flex items-center justify-center gap-2">
                  <span>Get Legal Help</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 font-semibold px-8 h-12 sm:h-13 rounded-full transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
                size="lg"
                asChild
              >
                <Link href="/about" className="flex items-center justify-center gap-2">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Image Indicators */}
      <div
        className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 z-20 flex gap-2"
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-primary w-6 sm:w-8 shadow-md shadow-primary/20'
                : 'bg-white/30 w-1.5 sm:w-2 hover:bg-white/50'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1 bg-neutral-950/20 backdrop-blur-sm"
        >
          <motion.span
            className="block h-1.5 w-1 rounded-full bg-primary"
            animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
            transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
