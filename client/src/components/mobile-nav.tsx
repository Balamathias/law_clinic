"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Members", href: "/members" },
  { name: "Resources", href: "/resources" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  // Pages with light backgrounds that need dark text/icons
  const lightBgPages = ['/gallery', '/about', '/members', '/resources', '/blog', '/contact']
  const isLightBgPage = lightBgPages.includes(pathname)
  
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
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`md:hidden ${useDarkElements ? "text-primary" : "text-white"}`}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-left text-primary">ADR Society</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-lg font-medium hover:text-primary transition-colors">
              {item.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

