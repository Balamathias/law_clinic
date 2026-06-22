"use client"

import Link from "next/link"
import { Menu, X, ArrowRight, Scale, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Image from "next/image"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/#events" },
  { name: "Publications", href: "/publications" },
  { name: "Team", href: "/excos" },
  { name: "Contact", href: "/contact" },
]

const quickLinks = [
  { name: "Executive Committee", href: "/excos" },
  { name: "Our Sponsors", href: "/sponsors" },
  { name: "FAQs", href: "/faq" },
]

interface MobileNavProps {
  useDarkElements?: boolean
}

export function MobileNav({ useDarkElements = false }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const [activeHash, setActiveHash] = useState("")

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleHashChange = () => {
      setActiveHash(window.location.hash)
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('popstate', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('popstate', handleHashChange)
    }
  }, [])

  const isActive = (href: string) => {
    const [path, hash] = href.split('#')
    const hasHash = !!hash

    if (hasHash) {
      return pathname === path && activeHash === '#' + hash
    }

    if (path === '/') {
      return pathname === '/' && !activeHash
    }

    return pathname === path || pathname.startsWith(path + '/')
  }

  const menuVariants = {
    closed: {
      x: "100%",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    open: {
      x: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const containerVariants = {
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    },
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    open: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
  }

  // Menu overlay content
  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] lg:hidden"
          variants={shouldReduceMotion ? {} : menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Content */}
          <div className="relative ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto bg-brand-900 text-primary-foreground">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-white/90">
                  <Image
                    src="/images/logo/logo.png"
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="block font-serif text-lg font-semibold text-white">ABU Law Clinic</span>
                  <span className="block text-white/50 text-xs">Ahmadu Bello University</span>
                </div>
              </Link>

              {/* Close button in header */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="min-h-12 min-w-12 rounded-md text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Main Navigation */}
            <motion.nav
              className="flex-1 px-4 py-8 sm:px-6"
              variants={shouldReduceMotion ? {} : containerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              aria-label="Mobile navigation"
            >
              <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="mb-6">
                <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest">
                  <Scale className="h-3.5 w-3.5 text-primary" />
                  <span>Menu</span>
                </div>
              </motion.div>

              <ul className="space-y-1">
                {navigation.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <motion.li key={item.name} variants={shouldReduceMotion ? {} : itemVariants}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                      className="group flex min-h-14 items-center justify-between border-b border-white/10 py-3 transition-colors duration-200"
                      >
                        <span className={[
                          "font-serif text-3xl font-semibold leading-tight transition-colors sm:text-4xl",
                          active ? "text-primary" : "text-white/80 group-hover:text-white"
                        ].join(' ')}>
                          {item.name}
                        </span>
                        <div className={[
                          "flex items-center gap-2 transition-all",
                          active ? "opacity-100" : "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                        ].join(' ')}>
                          {active && <span className="w-2 h-2 rounded-full bg-primary" />}
                          <ArrowRight className={["h-5 w-5", active ? "text-primary" : "text-white/50"].join(' ')} />
                        </div>
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

              {/* CTA Button */}
              <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="mt-6 sm:mt-8">
                <Button
                  asChild
                  className="min-h-12 w-full text-sm font-semibold sm:text-base"
                >
                  <Link
                    href="/get-help"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2"
                  >
                    Get Legal Help
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="mt-8 sm:mt-10">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3 sm:mb-4">
                  Quick Links
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex min-h-12 items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:text-sm"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.nav>

            {/* Footer */}
            <motion.div
              className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-6 border-t border-white/10"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm">
                <a
                  href="tel:+2341234567890"
                  className="flex min-h-12 items-center gap-3 text-white/70 transition-colors hover:text-white"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm">+234 123 456 7890</span>
                </a>
                <a
                  href="mailto:contact@abulawclinic.org"
                  className="flex min-h-12 items-center gap-3 text-white/70 transition-colors hover:text-white"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm truncate">contact@abulawclinic.org</span>
                </a>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[10px] sm:text-xs text-white/40">
                <span>© {new Date().getFullYear()} ABU Law Clinic</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>Zaria, Nigeria</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "lg:hidden relative z-[101] min-h-12 min-w-12 rounded-md transition-colors",
          isOpen
            ? "text-white hover:bg-white/10"
            : useDarkElements
              ? "text-foreground hover:bg-muted"
              : "text-white hover:bg-white/10"
        ].join(' ')}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={shouldReduceMotion ? { opacity: 1 } : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { rotate: 90, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={shouldReduceMotion ? { opacity: 1 } : { rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { rotate: -90, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Render menu in portal to escape any parent overflow/clipping */}
      {mounted && createPortal(menuContent, document.body)}
    </>
  )
}
