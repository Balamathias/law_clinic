'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, ArrowRight, Handshake, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Sponsor } from '@/@types/db'
import { cn } from '@/lib/utils'

interface SponsorsProps {
  sponsors: Sponsor[]
}

const SponsorsShowcase: React.FC<SponsorsProps> = ({ sponsors }) => {
  const [activeTab, setActiveTab] = useState<'organizations' | 'individuals'>('organizations')

  const organizationSponsors = sponsors?.filter(sponsor => sponsor.type === 'organization') || []
  const individualSponsors = sponsors?.filter(sponsor => sponsor.type === 'person') || []

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  if (organizationSponsors.length === 0 && individualSponsors.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <svg className="absolute right-0 top-0 h-full w-full stroke-primary/5" aria-hidden="true">
          <defs>
            <pattern
              id="sponsor-grid-pattern"
              width={60}
              height={60}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 60V.5H60" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#sponsor-grid-pattern)" />
        </svg>
      </div>

      <div className="container px-4 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Handshake className="w-4 h-4 mr-2" />
            Our Partners & Supporters
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Trusted by Leading Organizations
            <br />
            <span className="text-primary">& Distinguished Individuals</span>
          </h2>
          
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"></div>
          
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
           {"We're"} proud to collaborate with exceptional partners who share our commitment to advancing access to justice and legal education.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-secondary/30 p-1 rounded-full border border-border/60">
            <Button
              variant={activeTab === 'organizations' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('organizations')}
              className={cn(
                "rounded-full px-6 gap-2 transition-all",
                activeTab === 'organizations' ? 'shadow-sm' : ''
              )}
            >
              <Building2 className="w-4 h-4" />
              Organizations ({organizationSponsors.length})
            </Button>
            <Button
              variant={activeTab === 'individuals' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('individuals')}
              className={cn(
                "rounded-full px-6 gap-2 transition-all",
                activeTab === 'individuals' ? 'shadow-sm' : ''
              )}
            >
              <Users className="w-4 h-4" />
              Individuals ({individualSponsors.length})
            </Button>
          </div>
        </motion.div>

        {/* Organizations Tab */}
        {activeTab === 'organizations' && organizationSponsors.length > 0 && (
          <motion.div 
            key="organizations"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {organizationSponsors.slice(0, 6).map((org, index) => (
                <motion.div
                  key={org.id}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-xl border border-border/40 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="h-48 p-8 bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center overflow-hidden">
                    <motion.img 
                      src={org.image || '/placeholder-org.jpg'} 
                      alt={org.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-500" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{org.name}</h3>
                        <div className="text-xs font-medium text-primary/80 mb-3">{org.description}</div>
                      </div>
                      {org.url && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          asChild
                        >
                          <a href={org.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3">
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {individualSponsors.slice(0, 8).map((person, index) => (
                <motion.div
                  key={person.id}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-xl overflow-hidden border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative">
                    <motion.img 
                      src={person.image || '/placeholder-person.jpg'} 
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-2 py-0.5 bg-primary/20 backdrop-blur-sm text-primary text-xs rounded-md mb-2 font-medium">
                        {person.description}
                      </span>
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary/90 transition-colors">
                        {person.name}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full px-8 gap-2 group">
              <Link href="/sponsors">
                View All Partners
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 gap-2">
              <Link href="/sponsors#contact-form">
                <Handshake className="w-4 h-4" />
                Partner With Us
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Join our mission to make justice accessible for all
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default SponsorsShowcase
