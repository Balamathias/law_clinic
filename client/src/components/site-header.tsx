"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import { MobileNav } from "./mobile-nav"
import Image from "next/image"
import { Button } from "./ui/button"
import { LucideHand } from "lucide-react"

// Modern, glassy, responsive, reduced-clutter site header
export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const prefersReduced = useReducedMotion()
  const pathname = usePathname()

  // Pages that naturally have lighter backgrounds; we adapt text color sooner
  const lightBgPages = ['/gallery', '/about', '/excos', '/publications', '/blog', '/contact', '/sponsors', '/get-help', '/faq']
  const isLightBgPage = lightBgPages.some(page => pathname === page || pathname.startsWith(page + '/'))

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!prefersReduced) setIsScrolled(latest > 40)
  })

  const useDarkText = isLightBgPage || isScrolled

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "#events" },
    { name: "Excos", href: "/excos" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Publications", href: "/publications" },
    { name: "Contact", href: "/contact" }
  ]

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false // section anchor, handled client-side
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <motion.header
      role="banner"
      aria-label="Primary navigation"
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "px-2 md:px-0",
        isScrolled || isLightBgPage
          ? "backdrop-blur-md bg-white/70 dark:bg-neutral-950/60 border-b border-border/40 shadow-sm"
          : "bg-transparent"
      ].join(' ')}
      initial={prefersReduced ? false : { y: -56, opacity: 0 }}
      animate={prefersReduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Skip link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-primary text-primary-foreground rounded px-3 py-2 text-sm">Skip to main content</a>
    <div className="container max-w-7xl mx-auto flex items-center justify-between gap-4 py-2.5 md:py-2">
        <motion.div
      initial={prefersReduced ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center"
        >
          <Link href="/" className="group flex items-center gap-2" aria-label="Go to homepage">
            <span className={[
        "font-semibold tracking-tight hidden md:inline-block",
        "text-[clamp(1.05rem,1vw+0.6rem,1.35rem)]",
              useDarkText ? "text-primary" : "text-white drop-shadow"
            ].join(' ')}>
              ABU Law Clinic
            </span>
            <div className="relative aspect-square h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/20 group-hover:ring-primary/60 transition-all">
              <Image
                src="/images/logo/logo.png"
                alt="ABU Law Clinic Logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </motion.div>

        {/* Mobile navigation trigger (existing component) */}
        <MobileNav />

        {/* Desktop navigation */}
        <nav className="hidden md:block" aria-label="Main menu">
          <ul className="flex items-center gap-1.5">
          {navItems.map((item, i) => {
            const active = isActive(item.href)
            return (
              <motion.li
                key={item.name}
                initial={prefersReduced ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.04 * i }}
                className="relative"
              >
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    "relative px-3.5 py-2 text-[0.83rem] font-medium rounded-full tracking-wide",
                    "transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    active
                      ? useDarkText
                        ? "text-primary"
                        : "text-white"
                      : useDarkText
                        ? "text-foreground/65 hover:text-primary"
                        : "text-white/75 hover:text-white"
                  ].join(' ')}
                >
                  <span className="relative z-10 mix-blend-normal">{item.name}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/15 dark:bg-primary/25 backdrop-blur-sm"
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
            <motion.li
              initial={prefersReduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.45 }}
              className="pl-1"
            >
              <Link passHref href="/get-help">
                <Button className="rounded-full h-9 px-5 shadow-md shadow-primary/25 hover:shadow-primary/35 focus-visible:ring-2 focus-visible:ring-primary/60">
                  <span className="flex items-center gap-1.5">Get help <LucideHand className="h-4 w-4" /></span>
                </Button>
              </Link>
            </motion.li>
          </ul>
        </nav>
      </div>
    </motion.header>
  )
}