"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const heroImages = [
  '/images/hero/hero1.jpeg',
  '/images/hero/hero2.jpeg',
  '/images/hero/hero3.jpeg',
  '/images/hero/hero4.jpeg',
]

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background Images */}
      <AnimatePresence initial={false}>
        <motion.div 
          key={currentImageIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      </AnimatePresence>
      
      {/* Simple Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 z-10" />
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 max-w-7xl">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              ABU Law Clinic
              <span className="block text-white/80 text-xl md:text-2xl font-normal mt-2">
                Ahmadu Bello University, Zaria
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mt-5 max-w-lg leading-relaxed">
              Justice for the poor and the less privileged. We provide legal assistance 
              and representation to those who need it most.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md 
                         shadow-lg transition-all duration-300"
                size="lg"
                asChild
              >
                <Link href="/get-help">Reach Out</Link>
              </Button>

              <Button 
                variant="outline" 
                className="border-white/70 text-white hover:bg-white/10 px-8 py-3 
                         rounded-md transition-all duration-300 text-black"
                size="lg"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Stats - Simplified */}
          <motion.div 
            className="flex gap-8 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[
              { value: '100+', label: 'Active Members' },
              { value: '20+', label: 'Annual Events' },
              { value: '40+', label: 'Years of Excellence' },
            ].map((stat) => (
              <div key={stat.label} className="text-left">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Simplified Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L12 19M12 19L6 13M12 19L18 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
