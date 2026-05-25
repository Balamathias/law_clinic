"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Scale, Users, Calendar, Award, ArrowRight } from 'lucide-react'

const heroImages = [
  '/images/hero/hero1.jpeg',
  '/images/hero/hero2.jpeg',
  '/images/hero/hero3.jpeg',
  '/images/hero/hero4.jpeg',
]

const AUTO_ADVANCE_MS = 8000

const serviceItems = [
  { number: '01', title: 'Legal Consultation', href: '/services#consultation' },
  { number: '02', title: 'Community Education', href: '/services#education' },
  { number: '03', title: 'Legal Representation', href: '/services#representation' },
  { number: '04', title: 'Pro Bono Services', href: '/services#pro-bono' },
]

const stats = [
  { value: '100+', label: 'Active Members', icon: Users },
  { value: '20+', label: 'Annual Events', icon: Calendar },
  { value: '40+', label: 'Years of Excellence', icon: Award },
]

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
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
      className="relative min-h-screen w-full flex items-center"
    >
      {/* Background slideshow */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/88 to-brand-900/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-transparent to-brand-900/30" />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-28 md:py-36 lg:flex lg:min-h-screen lg:items-center">
          <motion.div
            className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - Main Content */}
            <div className="lg:col-span-7 xl:col-span-6">
              <motion.div variants={itemVariants} className="space-y-6 sm:space-y-8">
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 border border-white/10"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <Scale className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium tracking-wide text-white/90 uppercase">
                    Committed to Accessible Justice
                  </span>
                </motion.div>

                {/* Main Heading */}
                <motion.div variants={itemVariants}>
                  <h1
                    id="hero-heading"
                    className="text-display text-white"
                  >
                    <span className="block">Empowering communities</span>
                    <span className="mt-3 block text-2xl font-medium leading-snug tracking-normal text-white/75 md:text-3xl">
                      Through Legal Aid & Education
                    </span>
                  </h1>

                  <div className="flex items-center gap-3 text-white/50 text-xs sm:text-sm mt-4 sm:mt-6">
                    <div className="h-px w-6 sm:w-8 bg-primary" />
                    <span>ABU Law Clinic · Ahmadu Bello University, Zaria</span>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  variants={itemVariants}
                  className="text-lede max-w-xl text-white/70"
                >
                  Justice for the poor and less privileged. We provide timely legal assistance,
                  structured advocacy, and experiential learning that shapes tomorrow's legal professionals.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
                >
                  <Button
                    size="lg"
                    asChild
                  >
                    <Link href="/get-help" className="flex items-center justify-center gap-2">
                      <span>Get Legal Help</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
                    size="lg"
                    asChild
                  >
                    <Link href="/about" className="flex items-center justify-center gap-2">
                      <span>Learn More</span>
                    </Link>
                  </Button>
                </motion.div>

                {/* Stats - Mobile/Tablet */}
                <motion.div
                  variants={itemVariants}
                  className="lg:hidden pt-6 sm:pt-8"
                >
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {stats.map((stat) => {
                      const IconComponent = stat.icon
                      return (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-white/10 bg-white/5 p-3 text-center sm:p-4"
                        >
                          <div className="flex justify-center mb-2">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20">
                              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                          </div>
                          <p className="text-xl sm:text-2xl font-bold text-white">
                            {stat.value}
                          </p>
                          <p className="text-[10px] sm:text-xs text-white/50 font-medium uppercase tracking-wide mt-1">
                            {stat.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Service Items (Desktop) */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-6">
              <motion.div
                variants={containerVariants}
                    className="space-y-1 border-l border-white/10 pl-8 xl:pl-16"
              >
                {serviceItems.map((item, index) => (
                  <motion.div
                    key={item.number}
                    variants={itemVariants}
                    custom={index}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between py-4 xl:py-5 border-b border-white/10 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 xl:gap-6">
                        <span className="text-primary/50 text-sm font-mono">
                          {item.number}
                        </span>
                        <span className="text-white/70 text-base xl:text-lg font-medium group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}

                {/* Stats - Desktop */}
                <motion.div
                  variants={itemVariants}
                  className="pt-8 xl:pt-12"
                >
                  <div className="flex flex-wrap gap-4 xl:gap-6">
                    {stats.map((stat) => {
                      const IconComponent = stat.icon
                      return (
                        <div
                          key={stat.label}
                          className="flex items-center gap-3"
                        >
                          <div className="p-2 rounded-lg bg-primary/20">
                            <IconComponent className="h-4 w-4 xl:h-5 xl:w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xl xl:text-2xl font-bold text-white tracking-tight">
                              {stat.value}
                            </p>
                            <p className="text-[10px] xl:text-xs text-white/50 font-medium uppercase tracking-wider">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Image indicators */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 z-20 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-primary w-6 sm:w-8'
                : 'bg-white/30 w-1.5 sm:w-2 hover:bg-white/50'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2 }}
        aria-hidden="true"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
        >
          <motion.span
            className="block h-2 w-1 rounded-full bg-primary"
            animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
            transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
