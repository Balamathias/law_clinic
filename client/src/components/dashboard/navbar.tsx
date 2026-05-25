"use client"

import { Search } from "lucide-react"
import Breadcrumbs from "./breadcrumbs"
import ThemeToggle from "./theme-toggle"
import UserMenu from "./user-menu"
import MobileDrawer from "./mobile-drawer"
import { useCommandPalette } from "./command-palette"
import type { User } from "@/@types/db"

interface Props {
  user: User
}

export default function DashboardTopbar({ user }: Props) {
  const palette = useCommandPalette()

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/90 backdrop-blur lg:left-60">
      <div className="flex flex-1 items-center gap-3 px-4 lg:px-6">
        <MobileDrawer user={user} />

        <div className="hidden min-w-0 flex-1 sm:block">
          <Breadcrumbs />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => palette.setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open command palette"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">⌘K</kbd>
          </button>

          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
