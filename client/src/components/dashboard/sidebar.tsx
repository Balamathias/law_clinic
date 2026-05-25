"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Logo from "../logo"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { User } from "@/@types/db"
import {
  NAV_ITEMS,
  GROUP_LABELS,
  type NavGroup,
  filterNavForUser,
  groupNavItems,
} from "./nav-items"

import { useSidebar } from "./sidebar-context"

const GROUP_ORDER: NavGroup[] = ["main", "content", "operations", "cms", "account"]

interface Props {
  user: User | null
}

const DashboardSidebar = ({ user }: Props) => {
  const pathname = usePathname()
  const { collapsed, toggle, mounted } = useSidebar()

  const visible = filterNavForUser(NAV_ITEMS, user)
  const byGroup = groupNavItems(visible)

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-card lg:flex",
      )}
      aria-label="Dashboard navigation"
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!collapsed ? (
          <Logo textClassName="text-base" />
        ) : (
          <div className="mx-auto">
            <Image src="/images/logo/logo.png" alt="ABU Law Clinic" width={28} height={28} priority />
          </div>
        )}
        {mounted && (
          <button
            onClick={toggle}
            className="ml-auto inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {GROUP_ORDER.map(group => {
          const items = byGroup[group]
          if (!items || items.length === 0) return null
          return (
            <div key={group} className="mb-6 last:mb-2">
              {!collapsed && GROUP_LABELS[group] && (
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
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-4 shrink-0",
                            active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>
    </motion.aside>
  )
}

export default DashboardSidebar
