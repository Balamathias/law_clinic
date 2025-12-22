"use client"

import React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Clock,
  Scale,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Legal Consultation", href: "/services#consultation" },
      { label: "Legal Education", href: "/services#education" },
      { label: "Representation", href: "/services#representation" },
      { label: "Pro Bono Cases", href: "/services#pro-bono" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Publications", href: "/publications" },
      { label: "Events", href: "/#events" },
      { label: "FAQs", href: "/faq" },
      { label: "Get Help", href: "/get-help" },
    ]
  },
  {
    title: "Organization",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Executive Committee", href: "/excos" },
      { label: "Our Sponsors", href: "/sponsors" },
      { label: "Contact", href: "/contact" },
    ]
  }
]

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/abu-law-clinic", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/abu_law_clinic", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/abu_lawclinic", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/abu-law-clinic-8801681aa", label: "LinkedIn" },
]

const contactInfo = [
  { icon: MapPin, text: "Faculty of Law, Ahmadu Bello University, Zaria, Nigeria" },
  { icon: Mail, text: "contact@abulawclinic.org" },
  { icon: Phone, text: "+234 123 456 7890" },
  { icon: Clock, text: "Mon-Fri: 9AM - 5PM" },
]

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const prefersReduced = useReducedMotion()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.info("Newsletter subscription coming soon!")
  }

  return (
    <footer className={cn("relative bg-[var(--navy-950)] text-white overflow-hidden", className)}>
      {/* Background decorations */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand Column */}
            <motion.div
              className="lg:col-span-4"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl ring-2 ring-white/10">
                  <Image
                    src="/images/logo/logo.png"
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="block text-xl font-bold text-white">ABU Law Clinic</span>
                  <span className="block text-xs text-white/50 font-medium">Ahmadu Bello University</span>
                </div>
              </Link>

              {/* Tagline */}
              <div className="flex items-center gap-2 mb-6">
                <Scale className="h-4 w-4 text-primary" />
                <span className="text-sm text-white/70 font-medium">Justice for the poor and less privileged</span>
              </div>

              {/* Description */}
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
                Providing free legal services to those in need while training the next generation of
                legal advocates committed to access to justice and the rule of law.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-primary hover:border-primary hover:text-white transition-all duration-200"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </motion.div>

            {/* Links Columns */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerLinks.map((group, groupIndex) => (
                <motion.div
                  key={group.title}
                  initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * (groupIndex + 1) }}
                >
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    {group.title}
                  </h3>
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-white/60 hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Newsletter Column */}
            <motion.div
              className="lg:col-span-3"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Stay Updated
              </h3>
              <p className="text-sm text-white/60 mb-4">
                Subscribe to receive news about events, publications, and legal resources.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-l-lg rounded-r-none focus-visible:ring-1 focus-visible:ring-primary"
                    required
                  />
                  <Button
                    type="submit"
                    className="h-11 px-4 rounded-l-none bg-primary hover:bg-primary/90"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-white/40">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
                {contactInfo.slice(0, 2).map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-white/60">{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="py-6 border-t border-white/10"
          initial={prefersReduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} ABU Law Clinic. All rights reserved.
            </p>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span className="text-white/20">|</span>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span className="text-white/20">|</span>
              <a
                href="https://abu.edu.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                ABU Website
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
