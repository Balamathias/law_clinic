"use client"

import Link from "next/link"
import { Menu, Home, Info, CalendarDays, Users, Landmark, BookOpen, Mail, ExternalLink, LucideHand, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import Image from "next/image"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Events", href: "#events", icon: CalendarDays },
  { name: "Excos", href: "/excos", icon: Users },
  { name: "Sponsors", href: "/sponsors", icon: Landmark },
  { name: "Publications", href: "/publications", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Mail }
]

export function MobileNav() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const [isOpen, setIsOpen] = useState(false)
  
  // Pages with light backgrounds that need dark text/icons
  const lightBgPages = ['/gallery', '/about', '/excos', '/publications', '/blog', '/contact', '/sponsors', '/get-help', '/faq']
  const isLightBgPage = lightBgPages.includes(pathname) || lightBgPages.map(page => Boolean(pathname.startsWith(page))).some(Boolean)
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  })

  // Either we're on a light background page or we've scrolled down
  const useDarkElements = isLightBgPage || isScrolled

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
          className={`md:hidden relative overflow-hidden group rounded-full backdrop-blur-sm ${useDarkElements ? "text-primary hover:bg-primary/10" : "text-white hover:bg-white/15"}`}
        >
          <Menu className={`h-6 w-6 transition-all duration-300 ${isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="w-[300px] sm:w-[340px] border-l shadow-xl p-0 overflow-hidden backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/65"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-primary/5" />
          <div className="relative p-6 pb-4">
            <SheetHeader className="mb-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/logo/logo.png"
                    alt="ABU Law Clinic Logo"
                    width={40}
                    height={24}
                  />
                  <SheetTitle className="text-left text-primary text-xl font-bold tracking-tight">ABU Law Clinic</SheetTitle>
                </div>
                <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-primary/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-[0.78rem] text-muted-foreground/90 leading-relaxed font-medium flex items-center gap-1">
                Legal assistance • Advocacy • Education
              </p>
            </SheetHeader>
          </div>
        </div>
        
        <nav className="p-6 pt-5" aria-label="Mobile site navigation">
          <ul className="space-y-1.5 mb-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={[
                      "group flex items-center gap-3 px-3 py-3 rounded-xl text-[0.9rem] font-medium",
                      "transition-all duration-300 relative overflow-hidden",
                      active
                        ? "text-primary bg-primary/10 ring-1 ring-primary/20"
                        : "text-foreground/80 hover:text-primary hover:bg-muted/60"
                    ].join(' ')}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 group-hover:shadow-sm">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span>{item.name}</span>
                    {active && <span className="ml-auto h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/40" />}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="pt-4 border-t border-border/60">
            <Link
              href="/get-help"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full p-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors text-sm tracking-wide shadow-lg shadow-primary/25"
            >
              <LucideHand className="h-5 w-5" />
              Get help
            </Link>
          </div>
        </nav>
        
        <div className="absolute bottom-5 left-5 right-5 text-[0.65rem] text-muted-foreground/80">
          <div className="flex items-center justify-between gap-3">
            <span className="tracking-wide font-medium">© {new Date().getFullYear()} ABU Law Clinic</span>
            <Link
              href="https://abu.edu.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
            >
              <ExternalLink className="h-3 w-3" />
              ABU Site
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
