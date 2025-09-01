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
      className="relative min-h-[100svh] w-full flex items-center overflow-hidden"
    >
      {/* Background slideshow with enhanced gradients */}
      <div aria-hidden="true" className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </AnimatePresence>
        
        {/* Multi-layered gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-900/70 to-neutral-800/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/60 via-transparent to-transparent" />
      </div>

      {/* Glassmorphic decorative elements */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl"
          animate={{ 
            scale: shouldReduceMotion ? 1 : [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
          animate={{ 
            scale: shouldReduceMotion ? 1 : [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-white/5 blur-2xl opacity-60" />
      </div>

      {/* Main Content Container */}
      <div className="container relative z-20 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <motion.div 
          className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[90vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.div variants={itemVariants} className="space-y-6 md:space-y-8">
              
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2.5 rounded-full bg-white/8 backdrop-blur-xl px-4 py-2 ring-1 ring-white/20 shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Scale className="h-3 w-3 text-primary animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90 uppercase">
                  Committed to Accessible Justice
                </span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-3">
                <motion.h1 
                  id="hero-heading" 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.95] text-white"
                  variants={itemVariants}
                >
                  <span className="block bg-gradient-to-br from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-sm">
                    Empowering
                  </span>
                  <span className="block bg-gradient-to-br from-primary-200 via-primary to-primary-600 bg-clip-text text-transparent">
                    Communities
                  </span>
                  <span className="block text-white/85 font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl mt-2">
                    Through Legal Aid & Education
                  </span>
                </motion.h1>
                
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-2 text-white/70 text-sm md:text-base"
                >
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <span>ABU Law Clinic · Ahmadu Bello University, Zaria</span>
                </motion.div>
              </div>

              {/* Description */}
              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-light"
              >
                Justice for the poor and less privileged. We provide timely legal assistance, structured advocacy, 
                and experiential learning that shapes tomorrow's legal professionals.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
              >
                <Button
                  className="group bg-primary hover:bg-primary/90 text-white rounded-full h-12 sm:h-14 px-8 shadow-2xl shadow-primary/30 hover:shadow-primary/40 focus-visible:ring-2 focus-visible:ring-primary/60 transition-all duration-300 font-semibold text-base sm:text-lg"
                  size="lg"
                  asChild
                >
                  <Link href="/get-help" className="flex items-center gap-2">
                    <span>Get Legal Help</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="group rounded-full h-12 sm:h-14 px-8 border-white/30 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/40 focus-visible:ring-2 focus-visible:ring-primary/60 transition-all duration-300 font-semibold text-base sm:text-lg"
                  size="lg"
                  asChild
                >
                  <Link href="/about" className="flex items-center gap-2">
                    <span>Learn More</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Visual Elements */}
          <div className="lg:col-span-5 xl:col-span-6">
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6"
            >
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative"
                  >
                    {/* Glassmorphic card */}
                    <div className="relative rounded-2xl bg-white/10 backdrop-blur-2xl ring-1 ring-white/20 p-6 shadow-xl hover:ring-primary/40 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm ring-1 ring-primary/30">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-right">
                          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                          {stat.label}
                        </h3>
                        <p className="text-xs text-white/60">
                          {stat.description}
                        </p>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-hidden="true"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm flex items-start justify-center p-1.5">
            <motion.span 
              className="block h-2 w-1 rounded-full bg-primary"
              animate={shouldReduceMotion ? {} : { y: [0, 12, 0] }}
              transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
        <span className="text-xs tracking-wider text-white/60 font-medium">Scroll Down</span>
      </motion.div>

      {/* Image indicators */}
      <motion.div 
        className="absolute bottom-8 right-8 z-20 hidden lg:flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {heroImages.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </motion.div>
    </section>
  )
}

export default Hero
