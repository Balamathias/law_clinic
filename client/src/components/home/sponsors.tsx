'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Users, ArrowRight, Handshake, ExternalLink, Star } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Sponsor } from '@/@types/db'
import { cn } from '@/lib/utils'

interface SponsorsProps {
  sponsors: Sponsor[]
}

const SponsorsShowcase: React.FC<SponsorsProps> = ({ sponsors }) => {
  const [activeTab, setActiveTab] = useState<'organizations' | 'individuals'>('individuals')

  const organizationSponsors = sponsors?.filter(sponsor => sponsor.type === 'organization') || []
  const individualSponsors = sponsors?.filter(sponsor => sponsor.type === 'person') || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  if (organizationSponsors.length === 0 && individualSponsors.length === 0) {
    return null
  }

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute right-1/3 bottom-1/4 w-[400px] h-[400px] bg-gradient-to-l from-accent/10 to-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Geometric patterns */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-primary/20 rounded-lg rotate-45 animate-spin" style={{animationDuration: '20s'}} />
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-accent/20 rounded-full animate-bounce" style={{animationDuration: '3s'}} />
        
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern
              id="sponsor-grid-pattern"
              width={40}
              height={40}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 40V.5H40" fill="none" stroke="currentColor" strokeWidth={0.5} className="text-primary/10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sponsor-grid-pattern)" />
        </svg>
      </div>

      <div className="container px-4 mx-auto max-w-7xl">
        {/* Enhanced Header Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center px-6 py-2.5 mb-8 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary text-sm font-semibold shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Star className="w-4 h-4 mr-2 fill-current" />
            Our Trusted Partners & Supporters
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Empowered by
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Excellence & Vision
            </span>
          </h2>
          
          <motion.div 
            className="h-1.5 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          <p className="max-w-4xl mx-auto text-xl text-muted-foreground leading-relaxed">
            We collaborate with visionary organizations and distinguished individuals who champion our mission to democratize access to justice and transform legal education.
          </p>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-card/50 backdrop-blur-sm p-1.5 rounded-2xl border border-border/50 shadow-lg">
            <Button
              variant={activeTab === 'individuals' ? 'default' : 'ghost'}
              size="lg"
              onClick={() => setActiveTab('individuals')}
              className={cn(
                "rounded-xl px-8 py-3 gap-3 transition-all duration-300 font-semibold",
                activeTab === 'individuals' 
                  ? 'shadow-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground' 
                  : 'hover:bg-secondary/80'
              )}
            >
              <Users className="w-5 h-5" />
              Individuals
              <span className="bg-background/20 px-2 py-0.5 rounded-full text-xs">
                {individualSponsors.length}
              </span>
            </Button>
            <Button
              variant={activeTab === 'organizations' ? 'default' : 'ghost'}
              size="lg"
              onClick={() => setActiveTab('organizations')}
              className={cn(
                "rounded-xl px-8 py-3 gap-3 transition-all duration-300 font-semibold",
                activeTab === 'organizations' 
                  ? 'shadow-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground' 
                  : 'hover:bg-secondary/80'
              )}
            >
              <Building2 className="w-5 h-5" />
              Organizations
              <span className="bg-background/20 px-2 py-0.5 rounded-full text-xs">
                {organizationSponsors.length}
              </span>
            </Button>
          </div>
        </motion.div>

        {/* Enhanced Tab Content */}
        <AnimatePresence mode="wait">
          {/* Organizations Tab */}
          {activeTab === 'organizations' && organizationSponsors.length > 0 && (
            <motion.div 
              key="organizations"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {organizationSponsors.slice(0, 6).map((org, index) => (
                  <motion.div
                    key={org.id}
                    variants={itemVariants}
                    className="group bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/30"
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className="h-56 p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                      <motion.img 
                        src={org.image || '/placeholder-org.jpg'} 
                        alt={org.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-lg relative z-10" 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {org.name}
                        </h3>
                        {org.url && (
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
                        )}
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {org.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Individuals Tab */}
          {activeTab === 'individuals' && individualSponsors.length > 0 && (
            <motion.div 
              key="individuals"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mb-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {individualSponsors.slice(0, 8).map((person, index) => (
                  <motion.div
                    key={person.id}
                    variants={itemVariants}
                    className="group bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/30"
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <motion.img 
                        src={person.image || '/placeholder-person.jpg'} 
                        alt={person.name}
                        className="w-full h-full object-cover transition-transform duration-700" 
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <motion.span 
                          className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs rounded-full mb-3 font-semibold hidden"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {person.description}
                        </motion.span>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary/90 transition-colors duration-300">
                          {person.name}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
            <Button 
              asChild 
              size="lg" 
              className="rounded-full px-10 py-4 gap-3 group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg text-lg font-semibold"
            >
              <Link href="/sponsors">
                View All Partners
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="rounded-full px-10 py-4 gap-3 border-2 hover:bg-primary/5 text-lg font-semibold"
            >
              <Link href="/sponsors#contact-form">
                <Handshake className="w-5 h-5" />
                Partner With Us
              </Link>
            </Button>
          </div>
          
          <motion.p 
            className="text-muted-foreground mt-6 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Join our mission to make justice accessible for all
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default SponsorsShowcase
