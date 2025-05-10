"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Quote, ChevronLeft, ChevronRight, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Testimonial } from '@/@types/db'

// Animated Text Component
const AnimatedText = ({ text }: { text: string }) => {
  const words = text?.split(' ');
  
  return (
    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="mr-3 inline-block">
          {word?.split('')?.map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1 + (wordIndex * 0.1) + (charIndex * 0.03),
                duration: 0.6, 
                ease: "easeOut"
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h2>
  );
}

// Decorative pattern SVG
const PatternBackground = () => (
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="url(#smallGrid)" />
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
)

const TestimonialCard = ({ testimonial, isActive }: { testimonial: Testimonial, isActive: boolean }) => {
  return (
    <motion.div
      className={`bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transition-all duration-500 ${isActive ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-50 z-0'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0.5, y: 0, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Quote icon */}
      <div className="mb-6">
        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary">
          <Quote size={24} />
        </div>
      </div>

      {/* Testimonial text */}
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed text-lg">{testimonial.quote}</p>
      </div>

      {/* Rating stars */}
      <div className="flex mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="h-5 w-5 text-amber-400 fill-amber-400" />
        ))}
      </div>
      
      {/* Client info */}
      <div className="flex items-center">
        <div className="mr-4 relative">
          {testimonial.image ? (
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage 
                src={testimonial.image}
                alt={testimonial.name}
              />
              <AvatarFallback>
                <Users className="h-6 w-6 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center border-2 border-primary/20">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
          <div className="text-sm text-gray-500">{testimonial.occupation}</div>
          <div className="text-xs font-semibold mt-1 text-primary">{testimonial.category}</div>
        </div>
      </div>
    </motion.div>
  )
}

interface Props {
  testimonials: Testimonial[]; // Replace with actual type if available
}

const Testimonials = ({ testimonials }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <PatternBackground />
      <div className="absolute top-0 right-0 w-1/2 h-1/3 bg-gradient-to-b from-primary/5 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-primary/5 to-transparent blur-3xl pointer-events-none"></div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          {/* Left section - Title and CTA */}
          <div className="lg:w-5/12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Decorative circles */}
              <motion.div 
                className="absolute -left-8 -top-8 w-16 h-16 border-2 border-primary/10 rounded-full"
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -right-4 bottom-1/3 w-24 h-24 border-2 border-primary/10 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <AnimatedText text="Here is what our clients say" />
                
                <motion.p 
                  className="text-gray-600 text-lg mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  We've helped hundreds of individuals get the legal support they need. 
                  These are just a few of their stories.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg font-medium group shadow-xl shadow-primary/20">
                  <Link href="/contact">
                    <span className="flex items-center">
                      Get Legal Help
                      <motion.div 
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </span>
                  </Link>
                </Button>
                
                <motion.div 
                  className="absolute -z-10 inset-0 bg-primary/20 rounded-xl blur-xl"
                  animate={{ opacity: [0.4, 0.6, 0.4], scale: [0.95, 1, 0.95] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              </motion.div>
              
              {/* Stats */}
              <motion.div 
                className="mt-12 grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                {[
                  { label: 'Success Rate', value: '92%' },
                  { label: 'Cases Handled', value: '1,200+' },
                  { label: 'Client Satisfaction', value: '4.9/5' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right section - Testimonials */}
          <div className="lg:w-7/12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[480px] md:h-[420px]">
                <AnimatePresence mode="wait">
                  {testimonials?.map((testimonial, index) => (
                    <div 
                      key={testimonial.id}
                      className={`absolute inset-0 transition-all duration-500 ${index === activeIndex ? 'z-10' : 'z-0'}`}
                    >
                      <TestimonialCard 
                        testimonial={testimonial} 
                        isActive={index === activeIndex} 
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Navigation buttons */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? 'bg-primary scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Arrow controls */}
              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:text-primary transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:text-primary transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
