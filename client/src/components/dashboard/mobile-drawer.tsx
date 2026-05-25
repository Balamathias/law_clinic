"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import Logo from "../logo"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { User } from "@/@types/db"
import {
  NAV_ITEMS,
  GROUP_LABELS,
  type NavGroup,
  filterNavForUser,
  groupNavItems,
} from "./nav-items"

const GROUP_ORDER: NavGroup[] = ["main", "content", "operations", "cms", "account"]

interface Props {
  user: User | null
}

export default function MobileDrawer({ user }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const visible = filterNavForUser(NAV_ITEMS, user)
  const byGroup = groupNavItems(visible)

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] max-w-sm border-r border-border p-0">
        <SheetHeader className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {GROUP_ORDER.map(group => {
            const items = byGroup[group]
            if (!items || items.length === 0) return null
            return (
              <div key={group} className="mb-6 last:mb-2">
                {GROUP_LABELS[group] && (
                  <div className="mb-1.5 px-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {GROUP_LABELS[group]}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {items.map(item => {
                    const active = isActive(item.href)
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                            active
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <item.icon className={cn("size-4", active ? "text-primary" : "")} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
