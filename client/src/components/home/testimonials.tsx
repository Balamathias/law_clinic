"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Testimonial } from '@/@types/db'

interface Props {
  testimonials: Testimonial[]
}

const Testimonials = ({ testimonials }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prevTestimonial = useCallback(() => {
    if (testimonials.length === 0) return
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (isPaused || testimonials.length === 0) return
    const timer = setInterval(nextTestimonial, 6000)
    return () => clearInterval(timer)
  }, [nextTestimonial, isPaused, testimonials.length])

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const current = testimonials[activeIndex]

  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="testimonials-heading">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
            Testimonials
          </span>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            What Our Clients Say
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative bg-[var(--slate-50)] rounded-3xl p-8 sm:p-10 lg:p-12">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 sm:top-10 sm:left-10">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="pt-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Quote Text */}
                  <blockquote className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed mb-8">
                    "{current.quote}"
                  </blockquote>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                      <AvatarImage src={current.image || ''} alt={current.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">{current.name}</h4>
                      <p className="text-muted-foreground text-sm">{current.occupation}</p>
                      {current.category && (
                        <span className="inline-block text-xs text-primary font-medium mt-1">
                          {current.category}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? 'bg-primary w-6'
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
