"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import React, { useRef } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Mock images (replace with actual image paths later)
const bannerImages = [
  '/images/banner/clinic-image-1.jpg',
  '/images/banner/clinic-image-2.jpg',
  '/images/banner/clinic-image-3.jpg',
]

const AnimatedGradientText = ({ text }: { text: string }) => {
  return (
    <span className="relative">
      {text}
      <motion.span 
        className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      >
        {text}
      </motion.span>
    </span>
  )
}

const Banner = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const rotateLeft = useTransform(scrollYProgress, [0, 1], [0, -5])
  const rotateRight = useTransform(scrollYProgress, [0, 1], [0, 5])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section 
      ref={ref}
      className="relative bg-[#0a0c10] overflow-hidden py-20 md:py-32"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
          animate={{ 
            x: [0, -20],
            y: [0, -20]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 30,
            ease: "linear"
          }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Left content - Text */}
          <motion.div 
            className="lg:w-1/2 text-white z-10 order-2 lg:order-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <h3 className="text-primary font-semibold mb-3 tracking-wider">
                Empowering Justice, Defending Rights
              </h3>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Creating a supportive network where law students <AnimatedGradientText text="thrive together" /> through learning and advocacy
              </h2>
              
              <motion.p 
                className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                Join our community of passionate advocates working to provide quality legal services to those who need it most while building the skills to become exceptional legal professionals.
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg font-medium group shadow-xl shadow-primary/20 flex items-center gap-2">
                <Link href="/get-started">
                  GET LEGAL HELP
                  <motion.div 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Link>
              </Button>
              
              <motion.div 
                className="inline-flex items-center gap-2 text-lg ml-2 text-white/80 hover:text-white cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.15, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"></path>
                      <path d="M17 17h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1"></path>
                      <path d="M12 22v-8.3a4 4 0 0 0-1.73-3.3L8 9"></path>
                      <path d="M16 9l-2.27 1.4A4 4 0 0 0 12 13.7V22"></path>
                      <path d="M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0"></path>
                    </svg>
                  </motion.div>
                </span>
                Learn More About Us
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Right content - Image gallery */}
          <motion.div 
            className="lg:w-1/2 relative order-1 lg:order-2 hidden md:block"
            style={{ opacity }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] transform -rotate-1 mx-4 sm:mx-0">
              {/* Image 1 */}
              <motion.div 
                className="absolute top-[5%] sm:top-0 left-[5%] sm:left-0 w-[65%] sm:w-[75%] h-[60%] sm:h-[70%] overflow-hidden rounded-xl shadow-2xl border border-white/10 z-10"
                style={{ y: y1, rotate: rotateLeft, scale }}
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${bannerImages[0]}')`, backgroundPosition: 'center center' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-bold uppercase tracking-wider bg-primary/90 px-2 py-0.5 inline-block rounded-sm">
                    Outreach Event
                  </p>
                </div>
              </motion.div>
              
              {/* Image 2 */}
              <motion.div 
                className="absolute bottom-[5%] sm:bottom-0 right-[5%] sm:right-0 w-[60%] sm:w-[70%] h-[50%] sm:h-[60%] overflow-hidden rounded-xl shadow-2xl border border-white/10"
                style={{ y: y2, rotate: rotateRight, scale }}
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${bannerImages[1]}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-bold uppercase tracking-wider bg-primary/90 px-2 py-0.5 inline-block rounded-sm">
                    Community Action
                  </p>
                </div>
              </motion.div>
              
              {/* Image 3 */}
              <motion.div 
                className="absolute top-[25%] right-[15%] sm:right-[10%] w-[40%] sm:w-[50%] h-[35%] sm:h-[45%] overflow-hidden rounded-xl shadow-2xl border border-white/10 z-20"
                style={{ y: y3, scale }}
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${bannerImages[2]}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-bold uppercase tracking-wider bg-primary/90 px-2 py-0.5 inline-block rounded-sm">
                    ABU Team
                  </p>
                </div>
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -bottom-8 -left-8 w-20 sm:w-32 h-20 sm:h-32 border-2 border-primary/30 rounded-full hidden sm:block"
                animate={{
                  scale: [1, 1.2, 1],
                  borderColor: ["rgba(22, 163, 74, 0.3)", "rgba(22, 163, 74, 0.15)", "rgba(22, 163, 74, 0.3)"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Animated dots */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 hidden sm:block">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Stats */}
        <motion.div
          className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { label: "Law Students", value: "500+", icon: "👨‍⚖️" },
            { label: "Cases Handled", value: "1000+", icon: "📝" },
            { label: "Years of Service", value: "40+", icon: "🏛️" },
            { label: "Community Impact", value: "High", icon: "🤝" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 text-center"
              whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl mb-2 mx-auto">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Banner
