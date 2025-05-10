"use client"

import Link from "next/link"
import { Menu, Home, Info, CalendarDays, Users, Landmark, BookOpen, Mail, ExternalLink, LucideHand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import Image from "next/image"

const navigation = [
  { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
  { name: "About", href: "/about", icon: <Info className="h-5 w-5" /> },
  { name: "Events", href: "#events", icon: <CalendarDays className="h-5 w-5" /> },
  { name: "Excos", href: "/excos", icon: <Users className="h-5 w-5" /> },
  { name: "Sponsors", href: "/sponsors", icon: <Landmark className="h-5 w-5" /> },
  { name: "Publications", href: "/publications", icon: <BookOpen className="h-5 w-5" /> },
  { name: "Contact", href: "/contact", icon: <Mail className="h-5 w-5" /> }
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
          className={`md:hidden relative overflow-hidden group ${useDarkElements ? "text-primary hover:bg-primary/5" : "text-white hover:bg-white/10"}`}
        >
          <Menu className={`h-6 w-6 transition-all duration-300 ${isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="w-[300px] border-l shadow-lg p-0 overflow-hidden"
      >
        <div className="bg-primary/10 p-6">
          <SheetHeader className="mb-2">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo/logo.png"
                alt="ABU Law Clinic Logo"
                width={40}
                height={24}
                className=""
              />
              <SheetTitle className="text-left text-primary text-xl font-bold">ABU Law Clinic</SheetTitle>
            </div>
          </SheetHeader>
          <p className="text-sm text-muted-foreground">Legal assistance and resources</p>
        </div>
        
        <nav className="p-6">
          <div className="space-y-1 mb-6">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-md text-base font-medium transition-all hover:bg-muted group ${
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.icon}
                {item.name}
                {pathname === item.href && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
                )}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t">
            <Link 
              href="/get-help"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full p-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <LucideHand className="h-5 w-5" />
              Get help
            </Link>
          </div>
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} ABU Law Clinic</span>
            <Link 
              href="https://abu.edu.ng" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              ABU Website
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
