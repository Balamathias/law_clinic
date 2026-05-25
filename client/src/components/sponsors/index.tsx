'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Building2, ExternalLink, Handshake, Users } from 'lucide-react'
import Link from 'next/link'

import type { Sponsor } from '@/@types/db'
import { Button } from '@/components/ui/button'

interface Props {
  sponsors: Sponsor[]
}

export default function Sponsors({ sponsors = [] }: Props) {
  const organizationSponsors = sponsors.filter((sponsor) => sponsor.type === 'organization')
  const individualSponsors = sponsors.filter((sponsor) => sponsor.type === 'person')

  return (
    <div>
      <section className="bg-background py-20 md:py-28 lg:py-36">
        <div className="container-editorial">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-eyebrow inline-flex items-center gap-2">
              <Handshake className="size-4 text-primary" />
              Partnerships & Collaborations
            </span>
            <h1 className="text-h1-editorial mt-5 text-foreground">Our partners and supporters</h1>
            <p className="text-lede mt-5">
              Organizations and individuals who help the clinic sustain legal aid, student
              training, and public legal education.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-20 md:py-28 lg:py-36">
        <div className="container-editorial">
          <div className="mb-8 flex items-center gap-3">
            <Building2 className="size-5 text-primary" aria-hidden />
            <h2 className="font-serif text-3xl font-semibold text-foreground">Organization partners</h2>
          </div>

          {organizationSponsors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {organizationSponsors.map((org, index) => (
                <motion.article
                  key={org.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex h-36 items-center justify-center rounded-lg bg-muted p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={org.image || '/placeholder-org.jpg'}
                      alt={org.name}
                      className="max-h-full max-w-full object-contain grayscale transition duration-200 hover:grayscale-0"
                    />
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-semibold text-foreground">{org.name}</h3>
                      {org.description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {org.description}
                        </p>
                      )}
                    </div>
                    {org.url && (
                      <a
                        href={org.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${org.name}`}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No organization partners are listed yet.
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-20 md:py-28 lg:py-36">
        <div className="container-editorial">
          <div className="mb-8 flex items-center gap-3">
            <Users className="size-5 text-primary" aria-hidden />
            <h2 className="font-serif text-3xl font-semibold text-foreground">Individual supporters</h2>
          </div>

          {individualSponsors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {individualSponsors.map((person, index) => (
                <motion.article
                  key={person.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="aspect-[3/4] bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={person.image || '/placeholder-person.jpg'}
                      alt={person.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-semibold text-foreground">{person.name}</h3>
                    {person.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {person.description}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No individual supporters are listed yet.
            </div>
          )}
        </div>
      </section>

      <section className="bg-brand-900 py-20 md:py-28 lg:py-36">
        <div className="container-prose text-center">
          <h2 className="font-serif text-4xl font-semibold text-white">Partner with the clinic</h2>
          <p className="mt-4 text-lg leading-8 text-white/70">
            We welcome support for legal aid, outreach, and clinical education.
          </p>
          <Button asChild className="mt-8 bg-white text-brand-900 hover:bg-white/90">
            <Link href="/contact">
              Start a conversation
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
