"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const Banner = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="banner-heading"
      className="relative bg-background py-20 md:py-28 lg:py-36"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card Container - QUAD Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl border border-border bg-brand-900"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left Content */}
            <div className="relative z-10 p-8 sm:p-10 lg:p-14 xl:p-16">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-gold"
              >
                Partner With Us
              </motion.span>

              <motion.h2
                id="banner-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-h2-editorial mb-6 text-white"
              >
                Ready to get the help you deserve?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-8 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg"
              >
                Our team of dedicated law students and supervisors is ready to help you
                navigate your legal challenges with tailored solutions for your unique situation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="group h-12 bg-white px-8 font-semibold text-brand-900 hover:bg-white/90"
                >
                  <Link href="/get-help" className="flex items-center gap-2">
                    <span>Get in touch</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 border-white/20 bg-white/5 px-8 font-semibold text-white hover:border-white/30 hover:bg-white/10"
                >
                  <Link href="/contact">
                    Contact us
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0">
                <Image
                  src="/images/banner/clinic-image-1.jpg"
                  alt="Legal consultation at ABU Law Clinic"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                {/* Gradient overlay for text contrast on left */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/50 to-transparent" />
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute bottom-8 right-8 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">40+</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Years of Service</p>
                    <p className="text-white/60 text-sm">Trusted legal support</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/70" />
        </motion.div>
      </div>
    </section>
  )
}

export default Banner
