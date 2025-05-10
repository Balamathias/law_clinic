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
    <div className="relative min-h-[600px] h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Images with crossfade */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <motion.div 
            key={index}
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('${img}')`,
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.05,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
      </div>
      
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/75 to-black/70 z-10 w-full h-full" />
      
      {/* Subtle Decorative Elements */}
      <div className="absolute inset-0 z-10 opacity-15">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,138,0,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(16,138,0,0.15),transparent_70%)]"></div>
      </div>
      
      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12 lg:py-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight tracking-tight">
              <span className="block">ABU Law Clinic</span>
              <span className="text-white/90 font-normal italic text-xl sm:text-2xl md:text-3xl mt-1 block">
                Ahmadu Bello University, Zaria
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-xl leading-relaxed font-light"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Justice for the poor and the less privileged.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-6 rounded-md shadow-lg transition-all duration-200"
              size="lg"
              asChild
            >
              <Link href="/get-started">Reach Out</Link>
            </Button>

            <Button 
              variant="outline" 
              className="border-white/80 border text-black dark:text-white hover:bg-white/10 font-medium px-6 sm:px-8 py-2.5 sm:py-6 rounded-md backdrop-blur-sm transition-all duration-200"
              size="lg"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-12 md:mt-16 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { label: 'Active Members', value: '1000+' },
              { label: 'Annual Events', value: '200+' },
              { label: 'Years of Excellence', value: '40+' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                className="text-center backdrop-blur-sm bg-white/8 border border-white/10 rounded-lg py-3 px-2"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + (i * 0.1), duration: 0.4 }}
                whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <p className="text-2xl md:text-3xl font-bold text-white mb-0.5">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div
          className="w-5 h-9 border border-white/60 rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <motion.div 
            className="w-1 h-2 bg-primary rounded-full mt-2"
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
        <p className="text-xs uppercase text-white/70 mt-2 tracking-wider text-center font-medium">
          Explore
        </p>
      </motion.div>
    </div>
  )
}

export default Hero
