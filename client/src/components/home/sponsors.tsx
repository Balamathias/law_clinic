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
    <section className="bg-surface-muted py-20 md:py-28 lg:py-36" aria-labelledby="sponsors-heading">
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
            Our Partners
          </span>
          <h2 id="sponsors-heading" className="text-h2-editorial mt-4 text-foreground">
            Partners & Supporters
          </h2>
          <p className="text-lede mx-auto mt-4 max-w-2xl">
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
          <div className="inline-flex rounded-lg border border-border bg-card p-1.5">
            <button
              onClick={() => setActiveTab('organizations')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                activeTab === 'organizations'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Building2 className="w-4 h-4" />
              Organizations
              {organizationSponsors.length > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  activeTab === 'organizations' ? 'bg-white/20' : 'bg-muted'
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
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Users className="w-4 h-4" />
              Individuals
              {individualSponsors.length > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  activeTab === 'individuals' ? 'bg-white/20' : 'bg-muted'
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
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-border-strong"
                >
                  {/* Logo Area */}
                  <div className="flex h-40 items-center justify-center bg-muted p-6">
                    <div className="relative w-full h-full">
                      <Image
                        src={org.image || '/placeholder-org.jpg'}
                        alt={org.name}
                        fill
                        className="object-contain grayscale transition duration-200 group-hover:grayscale-0"
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
                  <div className="overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-border-strong">
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
              className="rounded-xl border border-dashed border-border bg-card py-12 text-center"
            >
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No organization sponsors yet.</p>
            </motion.div>
          )}

          {activeTab === 'individuals' && individualSponsors.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-border bg-card py-12 text-center"
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
            <Button asChild variant="outline">
              <Link href="/sponsors" className="flex items-center gap-2">
                View All Partners
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild>
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
