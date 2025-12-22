'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Scale, Users, BookOpen, GraduationCap, ShieldCheck, Globe, Target, Eye, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'

const objectives = [
  {
    icon: Globe,
    title: "Access to Justice",
    description: "To offer pro bono legal services to those who cannot afford legal representation, ensuring equal access to justice regardless of socioeconomic status."
  },
  {
    icon: GraduationCap,
    title: "Legal Education",
    description: "To provide practical legal training and experiential learning opportunities for law students, equipping them with essential skills and preparing them for professional practice."
  },
  {
    icon: Users,
    title: "Community Outreach",
    description: "To raise awareness about legal rights, responsibilities, and procedures through community outreach programs and legal literacy initiatives."
  },
  {
    icon: BookOpen,
    title: "Policy Advocacy",
    description: "To collaborate with local organizations, government agencies, and stakeholders to address systemic legal issues and advocate for policy reforms."
  }
]

const timeline = [
  {
    year: "2005",
    title: "Foundation",
    description: "The Ahmadu Bello University Law Clinic was established, marking a significant milestone in practical legal education at Ahmadu Bello University."
  },
  {
    year: "2008",
    title: "Initial Growth",
    description: "Our founders recognized that access to justice is a fundamental right and aimed to create a platform for law students to gain practical experience while providing free legal support."
  },
  {
    year: "2015",
    title: "Service Expansion",
    description: "We expanded our services to include full representation in court, mediation, and community legal education programs reaching thousands of community members."
  },
  {
    year: "Present",
    title: "Continued Excellence",
    description: "Today, the ABU Law Clinic stands as a testament to innovation in legal education and a beacon of hope for those seeking justice in our community."
  }
]

const About = () => {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={shouldReduceMotion ? {} : containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Scale className="h-4 w-4" />
                About Us
              </span>
            </motion.div>

            <motion.h1
              variants={shouldReduceMotion ? {} : itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
            >
              A Fundamental Right That Is{' '}
              <span className="text-primary">Accessible to All</span>
            </motion.h1>

            <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-8" />
            </motion.div>

            <motion.p
              variants={shouldReduceMotion ? {} : itemVariants}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              At Ahmadu Bello University Pro Bono Law Clinic, we believe that justice is a fundamental
              right that should be accessible to all, regardless of financial circumstances. Our mission is
              to provide free legal assistance to individuals who cannot afford legal representation,
              ensuring that everyone has the opportunity to understand and defend their rights.
            </motion.p>

            <motion.div
              variants={shouldReduceMotion ? {} : itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button asChild size="lg" className="rounded-full h-12 px-8 font-semibold shadow-lg shadow-primary/25">
                <Link href="/get-help" className="flex items-center gap-2">
                  Get Legal Assistance
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-8 font-semibold">
                <Link href="/services">Our Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 sm:py-20 bg-[var(--slate-50)]">
        <div className="container px-4 sm:px-6">
          <motion.div
            className="grid lg:grid-cols-2 gap-8 lg:gap-12"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Mission Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">Our Purpose</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Mission & Vision</h2>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  The Ahmadu Bello University Law Clinic envisions becoming a leading center of excellence
                  in clinical legal education in Nigeria, recognized for producing competent, compassionate,
                  and socially responsible legal practitioners who significantly contribute to access to
                  justice and the development of the legal system.
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-muted-foreground leading-relaxed">
                    Committed to this vision, the Clinic provides high-quality legal services to underserved
                    communities while ensuring practical hands-on experience to law students. By bridging
                    the gap between legal education and practice, we aim to foster a strong sense of social
                    responsibility, ethical conduct, and professional excellence among future legal professionals.
                  </p>
                </div>
              </div>
            </div>

            {/* Objectives Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">What We Do</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Our Objectives</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {objectives.map((objective, index) => {
                    const Icon = objective.icon
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{objective.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{objective.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-[var(--navy-900)]">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Our History
            </h2>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-white/20 sm:-translate-x-px" />

              {/* Timeline entries */}
              <div className="space-y-8 sm:space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col sm:flex-row gap-4 sm:gap-8 ${index % 2 === 1 ? 'sm:flex-row-reverse' : ''}`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-primary sm:-translate-x-1.5 translate-y-2" />

                    {/* Content */}
                    <div className={`flex-1 pl-12 sm:pl-0 ${index % 2 === 1 ? 'sm:text-right sm:pr-12' : 'sm:text-left sm:pl-12'}`}>
                      <span className="inline-block text-primary font-bold text-xl sm:text-2xl mb-2">{item.year}</span>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-white/60 text-sm sm:text-base leading-relaxed">{item.description}</p>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden sm:block flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Closing statement */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 sm:mt-16 text-center"
            >
              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                As we look to the future, we remain committed to our founding principles of practical
                learning and public service, continually adapting to meet the evolving legal needs of
                our society. We strive for a more equitable legal system for all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-[var(--slate-50)]">
        <div className="container px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Join Us In Our Mission
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                  Whether you're seeking legal assistance, interested in volunteering, or want to support
                  our cause, we welcome you to be part of our community dedicated to making justice
                  accessible for all.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="rounded-full h-12 px-8 font-semibold shadow-lg shadow-primary/25">
                    <Link href="/contact" className="flex items-center gap-2">
                      Get In Touch
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-8 font-semibold">
                    <Link href="/excos">Meet Our Team</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
