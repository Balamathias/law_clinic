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
      className="relative py-16 sm:py-20 md:py-24 bg-white"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card Container - QUAD Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-[var(--navy-900)] shadow-2xl"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left Content */}
            <div className="relative z-10 p-8 sm:p-10 lg:p-14 xl:p-16">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-6"
              >
                Partner With Us
              </motion.span>

              <motion.h2
                id="banner-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
              >
                Ready to get the help you deserve?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
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
                  className="group bg-white text-[var(--navy-900)] hover:bg-white/90 rounded-full h-12 px-8 font-semibold"
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
                  className="rounded-full h-12 px-8 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 font-semibold"
                >
                  <Link href="/services">
                    Explore services
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
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-900)] via-[var(--navy-900)]/50 to-transparent" />
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20"
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

          {/* Decorative background elements */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Banner
