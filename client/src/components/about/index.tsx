'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, BookOpen, Globe, GraduationCap, Scale, Target, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

const objectives = [
  {
    icon: Globe,
    title: 'Access to justice',
    description: 'Offer pro bono legal support to people who cannot afford representation.',
  },
  {
    icon: GraduationCap,
    title: 'Clinical education',
    description: 'Give students supervised practical training rooted in ethics and service.',
  },
  {
    icon: Users,
    title: 'Community outreach',
    description: 'Teach rights, responsibilities, and legal processes in accessible language.',
  },
  {
    icon: BookOpen,
    title: 'Policy advocacy',
    description: 'Work with partners to address systemic issues affecting underserved people.',
  },
]

const timeline = [
  {
    year: '2005',
    title: 'Foundation',
    description: 'The clinic was established to connect practical legal education with public service.',
  },
  {
    year: '2008',
    title: 'Initial growth',
    description: 'Students began structured supervised work for people with limited access to counsel.',
  },
  {
    year: '2015',
    title: 'Service expansion',
    description: 'Community legal education, mediation, and supervised representation expanded.',
  },
  {
    year: 'Present',
    title: 'Continued excellence',
    description: 'The clinic remains a home for legal aid, advocacy, and experiential learning.',
  },
]

export default function About() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div>
      <section className="bg-background py-20 md:py-28 lg:py-36">
        <div className="container-editorial">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="text-eyebrow inline-flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              About Us
            </span>
            <h1 className="text-h1-editorial mt-5 text-foreground">
              A legal clinic built around service, trust, and practical learning
            </h1>
            <p className="text-lede mx-auto mt-6 max-w-3xl">
              Ahmadu Bello University Pro Bono Law Clinic provides free legal assistance to
              people who cannot afford representation while training students to practice with
              care, discipline, and social responsibility.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/get-help">
                  Get Legal Assistance
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/excos">Meet Our Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-surface-muted py-20 md:py-28 lg:py-36">
        <div className="container-editorial">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-border bg-card p-6 md:p-8">
              <Target className="size-6 text-primary" aria-hidden />
              <h2 className="mt-5 font-serif text-3xl font-semibold text-foreground">Mission</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                We provide high-quality legal services to underserved communities while giving law
                students supervised, hands-on experience that bridges classroom learning and
                ethical legal practice.
              </p>
            </article>
            <article className="rounded-xl border border-border bg-card p-6 md:p-8">
              <Scale className="size-6 text-primary" aria-hidden />
              <h2 className="mt-5 font-serif text-3xl font-semibold text-foreground">Vision</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                We aim to be a leading center of clinical legal education in Nigeria, known for
                competent, compassionate practitioners and meaningful contributions to access to
                justice.
              </p>
            </article>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {objectives.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-xl border border-border bg-card p-6">
                <Icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-5 font-serif text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-900 py-20 md:py-28 lg:py-36">
        <div className="container-editorial">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Our Journey
          </span>
          <h2 className="font-serif text-4xl font-semibold text-white md:text-5xl">Our History</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {timeline.map((item) => (
              <article key={item.year} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <p className="font-mono text-sm text-gold">{item.year}</p>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28 lg:py-36">
        <div className="container-prose text-center">
          <h2 className="text-h2-editorial text-foreground">Join us in the mission</h2>
          <p className="text-lede mt-4">
            Whether you need assistance, want to volunteer, or want to support the work, the
            clinic is built around people taking the next careful step together.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/get-help">Request help</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
