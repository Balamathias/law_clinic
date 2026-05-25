"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpenCheck, GraduationCap, Scale } from "lucide-react"
import Link from "next/link"
import React from "react"

interface FeatureItem {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

const features: FeatureItem[] = [
  {
    icon: Scale,
    title: "Access To Justice",
    description: "We provide careful, free legal support for people who need help understanding and defending their rights.",
    href: "/get-help"
  },
  {
    icon: GraduationCap,
    title: "Student Formation",
    description: "Students learn by serving real communities under supervision, building discipline, empathy, and professional judgment.",
    href: "/excos"
  },
  {
    icon: BookOpenCheck,
    title: "Public Legal Education",
    description: "Workshops, publications, and outreach help communities make informed decisions before problems become crises.",
    href: "/publications"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

export default function Features() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="features-heading"
      className="relative bg-surface-muted py-20 md:py-28 lg:py-36"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-eyebrow inline-block">
            Our Mission
          </span>
          <h2
            id="features-heading"
            className="text-h2-editorial mt-4 text-foreground"
          >
            Law in service of people
          </h2>
          <p className="text-lede mt-5">
            The clinic brings legal education, supervised practice, and community service into one
            careful institutional rhythm.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:gap-8 md:grid-cols-3"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <motion.article
                key={feature.title}
                variants={shouldReduceMotion ? {} : itemVariants}
                className="group relative"
              >
                <Link href={feature.href} className="block h-full">
                  <div className="h-full rounded-xl border border-border bg-card p-6 transition-colors duration-200 hover:border-border-strong">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <IconComponent className="h-7 w-7" />
                    </div>

                    <h3 className="mb-3 font-serif text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {feature.title}
                    </h3>
                    <p className="mb-6 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-primary">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-14"
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-8 font-semibold"
          >
            <Link href="/about">
              Read about the clinic
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
