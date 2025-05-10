"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { usePathname } from "next/navigation"
import { MobileNav } from "./mobile-nav"
import Image from "next/image"
import { Button } from "./ui/button"
import { LucideHand } from "lucide-react"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()
  
  const lightBgPages = ['/gallery', '/about', '/excos', '/publications', '/blog', '/contact', '/sponsors', '/get-help', '/faq']
  const isLightBgPage = lightBgPages.includes(pathname) || lightBgPages.map(page => Boolean(pathname.startsWith(page))).some(Boolean)
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  })

  const useDarkText = isLightBgPage || isScrolled

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isLightBgPage 
          ? "bg-background border-b shadow-sm py-3" 
          : "bg-transparent py-6"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center space-x-2 flex-row-reverse gap-1.5">
            <span className={`text-xl font-bold hidden md:block ${useDarkText ? 'text-primary' : 'text-white text-shadow'}`}>
              ABU Law Clinic
            </span>
            <Image
              src="/images/logo/logo.png"
              alt="ABU Law Clinic Logo"
              width={50}
              height={50}
              className=""
            />
          </Link>
        </motion.div>
        <MobileNav />
        <nav className="hidden md:flex items-center space-x-6">
          {[
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
            { name: "Events", href: "/events" },
            { name: "Excos", href: "/excos" },
            { name: "Sponsors", href: "/sponsors" },
            { name: "Publications", href: "/publications" },
            { name: "Contact", href: "/contact" }
          ].map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * i }}
            >
              <Link 
                href={item.href} 
                className={`text-sm font-medium transition-all duration-200 hover:scale-110 inline-block ${
                  useDarkText
                    ? 'text-foreground hover:text-primary' 
                    : 'text-white hover:text-white text-shadow-sm hover:text-glow'
                }`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Link passHref href="/get-help" className="">
              <Button className="rounded-xl">
                Get help
                <LucideHand />
              </Button>
            </Link>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  )
} 