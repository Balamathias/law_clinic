'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Users, ArrowRight, Handshake, ExternalLink, Star, Award, Heart } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Sponsor } from '@/@types/db'
import { cn } from '@/lib/utils'

interface SponsorsProps {
  sponsors: Sponsor[]
}

const SponsorsShowcase: React.FC<SponsorsProps> = ({ sponsors }) => {
  const [activeTab, setActiveTab] = useState<'organizations' | 'individuals'>('individuals')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const organizationSponsors = sponsors?.filter(sponsor => sponsor.type === 'organization') || []
  const individualSponsors = sponsors?.filter(sponsor => sponsor.type === 'person') || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: {
        duration: 0.4
      }
    }
  }

  if (organizationSponsors.length === 0 && individualSponsors.length === 0) {
    return null
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 max-w-7xl mx-auto">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute left-1/4 top-1/3 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute right-1/3 bottom-1/4 w-[600px] h-[600px] bg-gradient-to-l from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <svg className="absolute inset-0 h-full w-full stroke-primary/[0.03]" aria-hidden="true">
          <defs>
            <pattern
              id="sponsor-grid-enhanced"
              width={80}
              height={80}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 80V.5H80" fill="none" strokeWidth="1" />
              <circle cx="40" cy="40" r="1.5" fill="currentColor" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sponsor-grid-enhanced)" />
        </svg>

        {/* Floating Shapes */}
        <motion.div 
          className="absolute top-20 right-20 w-4 h-4 bg-primary/20 rounded-full"
          animate={{ y: [-10, 10, -10], rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-32 left-16 w-6 h-6 border-2 border-primary/30 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="container px-4 mx-auto max-w-7xl relative"></div>
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/20 text-primary text-sm font-semibold shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Handshake className="w-5 h-5 mr-3" />
            </motion.div>
            Our Valued Partners & Supporters
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trusted by Leading
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Organizations & Visionaries
            </span>
          </motion.h2>
          
          <motion.div 
            className="flex items-center justify-center gap-2 mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="h-1 w-12 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
            <div className="h-1.5 w-8 bg-primary rounded-full"></div>
            <div className="h-1 w-12 bg-gradient-to-l from-transparent to-primary rounded-full"></div>
          </motion.div>
          
          <motion.p 
            className="max-w-4xl mx-auto text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {"We're"} honored to collaborate with exceptional partners who share our unwavering commitment to advancing access to justice, legal education, and creating meaningful impact in communities worldwide.
          </motion.p>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
            <div className="flex relative">
              <motion.div
                className="absolute inset-y-1 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg"
                initial={false}
                animate={{
                  x: activeTab === 'individuals' ? 0 : '100%',
                  width: activeTab === 'individuals' ? '50%' : '50%'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setActiveTab('individuals')}
                className={cn(
                  "relative z-10 rounded-xl px-8 py-3 gap-3 transition-colors duration-300 font-semibold",
                  activeTab === 'individuals' 
                    ? 'text-white hover:text-white' 
                    : 'text-foreground/70 hover:text-foreground'
                )}
              >
                <Users className="w-5 h-5" />
                Distinguished Individuals
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {individualSponsors.length}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setActiveTab('organizations')}
                className={cn(
                  "relative z-10 rounded-xl px-8 py-3 gap-3 transition-colors duration-300 font-semibold",
                  activeTab === 'organizations' 
                    ? 'text-white hover:text-white' 
                    : 'text-foreground/70 hover:text-foreground'
                )}
              >
                <Building2 className="w-5 h-5" />
                Leading Organizations
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {organizationSponsors.length}
                </span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Content Sections */}
        <AnimatePresence mode="wait">
          {/* Organizations Tab */}
          {activeTab === 'organizations' && organizationSponsors.length > 0 && (
            <motion.div 
              key="organizations"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-20"
            >
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {organizationSponsors.slice(0, 6).map((org, index) => (
                  <motion.div
                    key={org.id}
                    variants={cardVariants}
                    className="group relative"
                    onMouseEnter={() => setHoveredCard(org.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Logo Section */}
                      <div className="relative h-56 p-8 bg-gradient-to-br from-gray-50/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 flex items-center justify-center overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <motion.img 
                          src={org.image || '/placeholder-org.jpg'} 
                          alt={org.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-all duration-700" 
                          animate={{
                            scale: hoveredCard === org.id ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                        
                        {/* Award Badge */}
                        <motion.div
                          className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ 
                            scale: hoveredCard === org.id ? 1 : 0,
                            rotate: hoveredCard === org.id ? 0 : -180
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Award className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="relative p-8">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                            {org.name}
                          </h3>
                          {org.url && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10"
                                asChild
                              >
                                <a href={org.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-5 h-5" />
                                </a>
                              </Button>
                            </motion.div>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                          {org.description}
                        </p>

                        {/* Partnership Badge */}
                        <div className="mt-6 flex items-center gap-2 text-xs text-primary font-semibold">
                          <Star className="w-4 h-4 fill-current" />
                          Trusted Partner
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Individuals Tab */}
          {activeTab === 'individuals' && individualSponsors.length > 0 && (
            <motion.div 
              key="individuals"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-20"
            >
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {individualSponsors.slice(0, 8).map((person, index) => (
                  <motion.div
                    key={person.id}
                    variants={cardVariants}
                    className="group relative"
                    onMouseEnter={() => setHoveredCard(person.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 dark:border-gray-700/30 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <motion.img 
                          src={person.image || '/placeholder-person.jpg'} 
                          alt={person.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          animate={{
                            scale: hoveredCard === person.id ? 1.05 : 1,
                          }}
                        />
                        
                        {/* Enhanced Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Heart Icon */}
                        <motion.div
                          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ 
                            scale: hoveredCard === person.id ? 1 : 0,
                            rotate: hoveredCard === person.id ? 0 : -90
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Heart className="w-5 h-5 text-white" />
                        </motion.div>
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <motion.div
                            initial={{ y: 10, opacity: 0.8 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="space-y-3"
                          >
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-lg font-semibold border border-white/30">
                              {person.description}
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-primary/90 transition-colors duration-300">
                              {person.name}
                            </h3>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                              <Star className="w-4 h-4 fill-current text-yellow-400" />
                              Distinguished Supporter
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-flex flex-col sm:flex-row gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="rounded-full px-10 py-4 gap-3 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl group">
                <Link href="/sponsors">
                  Explore All Partners
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" variant="outline" className="rounded-full px-10 py-4 gap-3 text-lg font-semibold border-2 hover:bg-primary/5 backdrop-blur-sm">
                <Link href="/sponsors#contact-form">
                  <Handshake className="w-5 h-5" />
                  Join Our Mission
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.p 
            className="text-lg text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Together, {"we're "}building bridges to justice and creating opportunities for positive change in communities worldwide.
          </motion.p>
        </motion.div>
    </section>
  )
}

export default SponsorsShowcase
