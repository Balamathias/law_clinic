"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, GraduationCap, Scale } from "lucide-react"
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
    icon: MessageSquare,
    title: "Legal Consultation",
    description: "Free guidance to understand your rights, obligations, and available pathways before critical decisions are made.",
    href: "/services#consultation"
  },
  {
    icon: GraduationCap,
    title: "Legal Education",
    description: "Workshops & awareness programs that empower communities with practical knowledge of core legal protections.",
    href: "/services#education"
  },
  {
    icon: Scale,
    title: "Legal Representation",
    description: "Guided advocacy & supervised student participation ensuring ethical, client-centered outcomes.",
    href: "/services#representation"
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
      className="relative py-20 md:py-28 bg-[var(--slate-50)]"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
            Our Services
          </span>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight"
          >
            How We Can Help
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto mt-6 rounded-full" />
          <p className="mt-6 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Comprehensive legal support for those who need it most. We provide accessible services
            to empower individuals and communities.
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
                  <div className="h-full bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                    {/* Icon */}
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <IconComponent className="h-7 w-7" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Link */}
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span>Learn more</span>
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
            className="rounded-full h-12 px-8 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            <Link href="/services">
              Explore All Services
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
