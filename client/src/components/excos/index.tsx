'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Facebook, Instagram, Mail, Twitter, Users, X } from 'lucide-react'
import Link from 'next/link'

import type { Gallery as GalleryType, GalleryImage as GalleryImageType } from '@/@types/db'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ExecutiveCommitteeProps {
  galleries: GalleryType[]
}

export default function ExecutiveCommittee({ galleries }: ExecutiveCommitteeProps) {
  const shouldReduceMotion = useReducedMotion()
  const [selectedMember, setSelectedMember] = useState<GalleryImageType | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)

  useEffect(() => {
    if (galleries.length > 0 && !activeTab) {
      const currentGallery = galleries.find((gallery) => !gallery.is_previous)
      setActiveTab(currentGallery?.id || galleries[0].id)
    }
  }, [galleries, activeTab])

  useEffect(() => {
    document.body.style.overflow = selectedMember ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedMember])

  const activeGallery = galleries.find((gallery) => gallery.id === activeTab)

  return (
    <div>
      <section className="bg-background py-20 md:py-28 lg:py-36">
        <div className="container-editorial">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="text-eyebrow inline-flex items-center gap-2">
              <Users className="size-4 text-primary" />
              Our Leadership
            </span>
            <h1 className="text-h1-editorial mt-5 text-foreground">Executive Committee</h1>
            <p className="text-lede mt-5">
              Student leaders and supervisors steward the clinic's service, outreach, and learning work.
            </p>
          </motion.div>
        </div>
      </section>

      {galleries.length > 1 && (
        <section className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="container-editorial py-4">
            <div className="flex gap-2 overflow-x-auto">
              {galleries.map((gallery) => (
                <button
                  key={gallery.id}
                  type="button"
                  onClick={() => setActiveTab(gallery.id)}
                  className={cn(
                    'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors',
                    activeTab === gallery.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground',
                  )}
                >
                  {gallery.title}
                  {gallery.year && <span className="opacity-75">({gallery.year})</span>}
                  {gallery.is_previous && (
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs text-foreground">
                      Archive
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-surface-muted py-20 md:py-28 lg:py-36">
        <div className="container-editorial">
          {activeGallery ? (
            <>
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-foreground">
                    {activeGallery.title}
                  </h2>
                  {activeGallery.description && (
                    <p className="mt-2 text-muted-foreground">{activeGallery.description}</p>
                  )}
                </div>
                {activeGallery.year && (
                  <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                    <Calendar className="size-4 text-primary" />
                    {activeGallery.year}
                  </span>
                )}
              </div>

              {activeGallery.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {activeGallery.images.map((member, index) => (
                    <motion.article
                      key={member.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedMember(member)}
                        className="group block w-full overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:border-border-strong"
                      >
                        <div className="relative aspect-square bg-muted">
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={member.title || 'Team member'}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-primary/40">
                              <span className="font-serif text-5xl font-semibold">
                                {member.title?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="line-clamp-1 font-serif text-lg font-semibold text-foreground group-hover:text-primary">
                            {member.title || 'Team Member'}
                          </h3>
                          {member.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {member.description}
                            </p>
                          )}
                        </div>
                      </button>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                  <Users className="mx-auto size-10 text-muted-foreground" />
                  <h3 className="mt-4 font-serif text-2xl font-semibold text-foreground">No members yet</h3>
                  <p className="mt-2 text-muted-foreground">Team members will be added soon.</p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <h2 className="font-serif text-2xl font-semibold text-foreground">No committee gallery yet</h2>
              <p className="mt-2 text-muted-foreground">Executive committee information will appear here.</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-foreground/60"
              onClick={() => setSelectedMember(null)}
              aria-label="Close member details"
            />
            <motion.div
              className="relative max-h-[90vh] w-full overflow-hidden rounded-t-xl border border-border bg-card sm:max-w-md sm:rounded-xl"
              initial={shouldReduceMotion ? false : { y: 40 }}
              animate={{ y: 0 }}
              exit={shouldReduceMotion ? undefined : { y: 40 }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={() => setSelectedMember(null)}
                className="absolute right-3 top-3 z-10 bg-card/80 backdrop-blur"
              >
                <X className="size-4" />
              </Button>

              <div className="relative aspect-square bg-muted sm:aspect-[4/3]">
                {selectedMember.image ? (
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.title || 'Team member'}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-primary/40">
                    <span className="font-serif text-7xl font-semibold">
                      {selectedMember.title?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-serif text-2xl font-semibold text-foreground">
                  {selectedMember.title || 'Team Member'}
                </h3>
                {selectedMember.description && (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selectedMember.description}
                  </p>
                )}

                {(selectedMember.instagram || selectedMember.x_handle || selectedMember.facebook) && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedMember.instagram && (
                      <SocialLink href={selectedMember.instagram} label="Instagram" icon={Instagram} />
                    )}
                    {selectedMember.x_handle && (
                      <SocialLink href={selectedMember.x_handle} label="Twitter" icon={Twitter} />
                    )}
                    {selectedMember.facebook && (
                      <SocialLink href={selectedMember.facebook} label="Facebook" icon={Facebook} />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-brand-900 py-20 md:py-28 lg:py-36">
        <div className="container-prose text-center">
          <h2 className="font-serif text-4xl font-semibold text-white">Want to join our team?</h2>
          <p className="mt-4 text-lg leading-8 text-white/70">
            We welcome students who want to learn through service and disciplined practice.
          </p>
          <Button asChild className="mt-8 bg-white text-brand-900 hover:bg-white/90">
            <Link href="/contact">
              <Mail className="size-4" />
              Get in touch
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <Icon className="size-4" />
      {label}
    </a>
  )
}
