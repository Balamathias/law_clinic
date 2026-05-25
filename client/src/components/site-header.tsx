"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import { MobileNav } from "./mobile-nav"
import Image from "next/image"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/#events" },
  { name: "Publications", href: "/publications" },
  { name: "Team", href: "/excos" },
  { name: "Contact", href: "/contact" }
]

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const prefersReduced = useReducedMotion()
  const pathname = usePathname()

  // Pages with light backgrounds that need dark text immediately
  const lightBgPages = ['/gallery', '/about', '/excos', '/publications', '/blog', '/contact', '/sponsors', '/get-help', '/faq', '/services']
  const isLightBgPage = lightBgPages.some(page => pathname === page || pathname.startsWith(page + '/'))

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40)
  })

  const useDarkText = isLightBgPage || isScrolled

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return pathname === "/"
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <motion.header
      role="banner"
      aria-label="Primary navigation"
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-card/95 backdrop-blur-md border-b border-border"
          : isLightBgPage
            ? "bg-card/85 backdrop-blur-sm"
            : "bg-transparent"
      ].join(' ')}
      initial={prefersReduced ? false : { y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium z-50"
      >
        Skip to main content
      </a>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              href="/"
              className="group flex items-center gap-3"
              aria-label="ABU Law Clinic - Go to homepage"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border/40 bg-card/90 transition-colors group-hover:border-primary/40">
                <Image
                  src="/images/logo/logo.png"
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className={[
                  "block font-serif text-lg font-semibold tracking-tight transition-colors",
                  useDarkText ? "text-foreground" : "text-white"
                ].join(' ')}>
                  ABU Law Clinic
                </span>
                <span className={[
                  "block text-xs font-medium tracking-wide transition-colors",
                  useDarkText ? "text-muted-foreground" : "text-white/60"
                ].join(' ')}>
                  Ahmadu Bello University
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main menu">
            {navItems.map((item, i) => {
              const active = isActive(item.href)
              return (
                <motion.div
                  key={item.name}
                  initial={prefersReduced ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      active
                        ? useDarkText
                          ? "text-primary bg-primary/10"
                          : "text-white bg-white/15"
                        : useDarkText
                          ? "text-muted-foreground hover:text-primary hover:bg-muted"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                    ].join(' ')}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              )
            })}

            {/* CTA Button */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="ml-4"
            >
              <Button
                asChild
                className="h-10 px-6 font-semibold"
              >
                <Link href="/get-help" className="flex items-center gap-2">
                  Get Help
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </nav>

          {/* Mobile Navigation Trigger */}
          <MobileNav useDarkElements={useDarkText} />
        </div>
      </div>
    </motion.header>
  )
}
