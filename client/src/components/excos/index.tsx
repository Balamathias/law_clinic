'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Users,
  Instagram,
  Twitter,
  Facebook,
  Calendar,
  X,
  Mail,
  ArrowRight,
  ChevronDown
} from 'lucide-react'
import { Gallery as GalleryType, GalleryImage as GalleryImageType } from '@/@types/db'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '../footer'

interface ExecutiveCommitteeProps {
  galleries: GalleryType[]
}

const ExecutiveCommittee = ({ galleries }: ExecutiveCommitteeProps) => {
  const shouldReduceMotion = useReducedMotion()
  const [selectedMember, setSelectedMember] = useState<GalleryImageType | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Set initial active tab
  useEffect(() => {
    if (galleries.length > 0 && !activeTab) {
      const currentGallery = galleries.find(g => !g.is_previous)
      setActiveTab(currentGallery?.id || galleries[0].id)
    }
  }, [galleries, activeTab])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false)
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedMember])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
  }

  const activeGallery = galleries.find(g => g.id === activeTab)

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center"
            variants={shouldReduceMotion ? {} : containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-primary mb-4 sm:mb-6">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Our Leadership
              </span>
            </motion.div>

            <motion.h1
              variants={shouldReduceMotion ? {} : itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 px-2"
            >
              Meet the{' '}
              <span className="text-primary">Executive Committee</span>
            </motion.h1>

            <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
              <div className="h-1 w-16 sm:w-20 bg-primary mx-auto rounded-full mb-4 sm:mb-6" />
            </motion.div>

            <motion.p
              variants={shouldReduceMotion ? {} : itemVariants}
              className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2"
            >
              Our dedicated team of student leaders and supervisors work tirelessly to ensure
              the smooth running of the Law Clinic.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation - Mobile Dropdown / Desktop Tabs */}
      {galleries.length > 1 && (
        <section className="border-b border-gray-200 bg-white sticky top-16 z-30">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            {/* Mobile Dropdown */}
            <div className="sm:hidden relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDropdownOpen(!isDropdownOpen)
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-left"
              >
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Viewing</span>
                  <span className="font-medium text-foreground">
                    {activeGallery?.title || 'Select Committee'}
                    {activeGallery?.year && ` (${activeGallery.year})`}
                  </span>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-40"
                  >
                    {galleries.map((gallery) => (
                      <button
                        key={gallery.id}
                        onClick={() => {
                          setActiveTab(gallery.id)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center justify-between ${
                          activeTab === gallery.id
                            ? 'bg-primary/5 text-primary'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">
                          {gallery.title}
                          {gallery.year && <span className="text-muted-foreground ml-1">({gallery.year})</span>}
                        </span>
                        {gallery.is_previous && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Archive
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {galleries.map((gallery) => (
                <button
                  key={gallery.id}
                  onClick={() => setActiveTab(gallery.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === gallery.id
                      ? gallery.is_previous
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-primary text-white shadow-md'
                      : gallery.is_previous
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {gallery.title}
                  {gallery.year && <span className="opacity-70">({gallery.year})</span>}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Grid */}
      <section className="py-10 sm:py-16 bg-[var(--slate-50)]">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          {activeGallery && (
            <motion.div
              key={activeGallery.id}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gallery Header */}
              <div className="mb-8 sm:mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 flex-wrap">
                      {activeGallery.title}
                      {activeGallery.is_previous && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          ARCHIVE
                        </span>
                      )}
                    </h2>
                    {activeGallery.description && (
                      <p className="text-sm sm:text-base text-muted-foreground mt-1">{activeGallery.description}</p>
                    )}
                  </div>
                  {activeGallery.year && (
                    <span className="inline-flex items-center gap-1.5 bg-white text-gray-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-gray-200 self-start">
                      <Calendar className="w-3.5 h-3.5" />
                      {activeGallery.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Members Grid */}
              {activeGallery.images.length === 0 ? (
                <div className="py-12 sm:py-16 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No Members Yet</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Team members will be added soon.</p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                  variants={shouldReduceMotion ? {} : containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {activeGallery.images.map((member) => (
                    <motion.div
                      key={member.id}
                      variants={shouldReduceMotion ? {} : itemVariants}
                      className="group"
                    >
                      <div
                        className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedMember(member)}
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={member.title || 'Team member'}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <span className="text-primary/40 text-3xl sm:text-5xl font-bold">
                                {member.title?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                          )}

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              View
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 sm:p-4">
                          <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {member.title || 'Team Member'}
                          </h3>
                          {member.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-0.5">
                              {member.description}
                            </p>
                          )}

                          {/* Social Links - Desktop only */}
                          {(member.instagram || member.x_handle || member.facebook) && (
                            <div className="hidden sm:flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                              {member.instagram && (
                                <a
                                  href={member.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                                >
                                  <Instagram className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {member.x_handle && (
                                <a
                                  href={member.x_handle}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                  <Twitter className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {member.facebook && (
                                <a
                                  href={member.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                  <Facebook className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedMember(null)}
            />

            {/* Modal - Bottom sheet on mobile, centered on desktop */}
            <motion.div
              className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Drag handle - mobile only */}
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full" />

              {/* Image */}
              <div className="relative aspect-square sm:aspect-[4/3] bg-gray-100">
                {selectedMember.image ? (
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.title || 'Team member'}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-primary/40 text-6xl sm:text-8xl font-bold">
                      {selectedMember.title?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                  {selectedMember.title || 'Team Member'}
                </h3>

                {selectedMember.description && (
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5">
                    {selectedMember.description}
                  </p>
                )}

                {/* Social Links */}
                {(selectedMember.instagram || selectedMember.x_handle || selectedMember.facebook) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.instagram && (
                      <a
                        href={selectedMember.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium"
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </a>
                    )}
                    {selectedMember.x_handle && (
                      <a
                        href={selectedMember.x_handle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </a>
                    )}
                    {selectedMember.facebook && (
                      <a
                        href={selectedMember.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative bg-[var(--navy-900)] rounded-2xl sm:rounded-3xl p-6 sm:p-10 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Want to Join Our Team?
                </h2>
                <p className="text-white/70 text-sm sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto">
                  We're looking for passionate law students who want to make a difference.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button asChild size="lg" className="rounded-full h-11 sm:h-12 px-6 sm:px-8 font-semibold shadow-lg shadow-primary/25">
                    <Link href="/contact" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Get In Touch
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full h-11 sm:h-12 px-6 sm:px-8 font-semibold border-white/20 text-white hover:bg-white/10">
                    <Link href="/about" className="flex items-center gap-2">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ExecutiveCommittee
