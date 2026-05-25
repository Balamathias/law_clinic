"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, User } from 'lucide-react'
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
    <section className="bg-background py-20 md:py-28 lg:py-36" aria-labelledby="testimonials-heading">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-eyebrow inline-block">
            Testimonials
          </span>
          <h2 id="testimonials-heading" className="text-h2-editorial mt-4 text-foreground">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative rounded-xl border border-border bg-card p-8 sm:p-10 lg:p-12">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 sm:top-10 sm:left-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
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
                  <blockquote className="mb-8 font-serif text-3xl italic leading-tight text-foreground sm:text-4xl">
                    "{current.quote}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-border">
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
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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
                        : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
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
