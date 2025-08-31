"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Scale, Users, Calendar, Award } from 'lucide-react'

// Centralized hero slides (could be extended later for CMS integration)
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

  // Cycle background images
  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(interval)
  }, [shouldReduceMotion])

  const stats = [
    { 
      value: '100+', 
      label: 'Active Members',
      icon: Users,
      description: 'Dedicated volunteers'
    },
    { 
      value: '20+', 
      label: 'Annual Events',
      icon: Calendar,
      description: 'Community outreach'
    },
    { 
      value: '40+', 
      label: 'Years of Excellence',
      icon: Award,
      description: 'Serving justice'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[92vh] md:min-h-screen w-full flex items-center overflow-hidden pt-20 md:pt-0"
    >
      {/* Background slideshow */}
      <div aria-hidden="true" className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.4 : 1.4, ease: 'easeOut' }}
          />
        </AnimatePresence>
        {/* Layered gradient & vignette for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/85 via-neutral-950/65 to-neutral-900/40" />
        <div className="absolute inset-0 bg-gradient-radial from-neutral-900/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Decorative blurred shapes (subtle) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/25 blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl opacity-30" />
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="max-w-2xl lg:max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="[&>*]:max-w-prose"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/15 backdrop-blur-md mb-6 shadow-sm">
              <span aria-hidden className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[0.68rem] sm:text-[0.7rem] md:text-xs font-semibold tracking-wider text-white/85 uppercase">Committed to Accessible Justice</span>
            </div>
            <h1 id="hero-heading" className="font-semibold text-white tracking-tight leading-[1.05] text-3xl sm:text-4xl md:text-[3.2rem] lg:text-[3.55rem] xl:text-[3.8rem] drop-shadow-sm">
              <span className="font-bold bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">Empowering Communities</span>
              <span className="block font-medium text-white/85 mt-2">Through Legal Aid & Education</span>
              <span className="block font-normal text-white/70 text-sm sm:text-base md:text-lg mt-4">ABU Law Clinic · Ahmadu Bello University, Zaria</span>
            </h1>
            <p className="mt-7 text-[0.95rem] sm:text-base md:text-lg text-white/90 leading-relaxed md:leading-[1.6] max-w-xl md:max-w-2xl">
              Justice for the poor and less privileged. We provide timely legal assistance, structured advocacy,
              and experiential learning that shapes tomorrow’s legal professionals.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-9">
              <Button
                className="bg-primary hover:bg-primary/90 text-white rounded-full h-11 px-7 shadow-lg shadow-primary/25 hover:shadow-primary/35 focus-visible:ring-2 focus-visible:ring-primary/60"
                size="lg"
                asChild
              >
                <Link href="/get-help" aria-label="Reach out for legal help">Reach Out</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full h-11 px-7 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/60"
                size="lg"
                asChild
              >
                <Link href="/about" aria-label="Learn more about the clinic">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-3 sm:gap-5 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.08, duration: 0.45 }}
                className="relative group"
              >
                <div className="rounded-2xl bg-white/6 backdrop-blur-xl ring-1 ring-white/15 px-2.5 sm:px-4 py-4 sm:py-5 shadow-sm hover:ring-primary/30 transition-colors">
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary drop-shadow-sm tracking-tight">{s.value}</p>
                  <p className="text-[10px] sm:text-[11px] md:text-xs font-medium tracking-wider uppercase text-white/70 mt-1">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1, duration: 0.8 }}
        aria-hidden="true"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 9, 0] }}
          transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border border-white/25 flex items-start justify-center p-1"
        >
          <span className="block h-2 w-1 rounded-full bg-white/90" />
        </motion.div>
        <div className="text-xs tracking-wide text-white/70">Scroll</div>
      </motion.div>
    </section>
  )
}

export default Hero
