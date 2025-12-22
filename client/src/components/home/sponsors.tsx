'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Users, ArrowRight, Handshake, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Sponsor } from '@/@types/db'
import { cn } from '@/lib/utils'

interface SponsorsProps {
  sponsors: Sponsor[]
}

const SponsorsShowcase: React.FC<SponsorsProps> = ({ sponsors }) => {
  const [activeTab, setActiveTab] = useState<'organizations' | 'individuals'>('organizations')

  const organizationSponsors = sponsors?.filter(sponsor => sponsor.type === 'organization') || []
  const individualSponsors = sponsors?.filter(sponsor => sponsor.type === 'person') || []

  if (organizationSponsors.length === 0 && individualSponsors.length === 0) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <section className="py-16 md:py-24 bg-[var(--slate-50)]" aria-labelledby="sponsors-heading">
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
            Our Partners
          </span>
          <h2 id="sponsors-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Partners & Supporters
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto mt-6 rounded-full" />
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Organizations and individuals who share our vision of accessible justice for all.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex bg-white rounded-full p-1.5 border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab('organizations')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                activeTab === 'organizations'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Building2 className="w-4 h-4" />
              Organizations
              {organizationSponsors.length > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  activeTab === 'organizations' ? 'bg-white/20' : 'bg-gray-100'
                )}>
                  {organizationSponsors.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('individuals')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                activeTab === 'individuals'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Users className="w-4 h-4" />
              Individuals
              {individualSponsors.length > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  activeTab === 'individuals' ? 'bg-white/20' : 'bg-gray-100'
                )}>
                  {individualSponsors.length}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'organizations' && organizationSponsors.length > 0 && (
            <motion.div
              key="organizations"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {organizationSponsors.slice(0, 6).map((org) => (
                <motion.div
                  key={org.id}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Logo Area */}
                  <div className="h-40 p-6 bg-[var(--slate-100)] flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={org.image || '/placeholder-org.jpg'}
                        alt={org.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {org.name}
                      </h3>
                      {org.url && (
                        <a
                          href={org.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {org.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {org.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'individuals' && individualSponsors.length > 0 && (
            <motion.div
              key="individuals"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {individualSponsors.slice(0, 8).map((person) => (
                <motion.div
                  key={person.id}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <Image
                        src={person.image || '/placeholder-person.jpg'}
                        alt={person.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Name Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1">
                          {person.name}
                        </h3>
                        {person.description && (
                          <p className="text-white/70 text-xs line-clamp-1 mt-0.5">
                            {person.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty States */}
          {activeTab === 'organizations' && organizationSponsors.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200"
            >
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No organization sponsors yet.</p>
            </motion.div>
          )}

          {activeTab === 'individuals' && individualSponsors.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200"
            >
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No individual sponsors yet.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="rounded-full" variant="outline">
              <Link href="/sponsors" className="flex items-center gap-2">
                View All Partners
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/contact" className="flex items-center gap-2">
                <Handshake className="w-4 h-4" />
                Become a Partner
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SponsorsShowcase
