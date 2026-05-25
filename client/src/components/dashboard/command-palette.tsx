"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search } from "lucide-react"
import { NAV_ITEMS, GROUP_LABELS, type NavGroup, filterNavForUser, groupNavItems } from "./nav-items"
import type { User } from "@/@types/db"

const GROUP_ORDER: NavGroup[] = ["main", "content", "operations", "cms", "account"]

type PaletteCtx = { open: boolean; setOpen: (v: boolean) => void }
const Ctx = createContext<PaletteCtx>({ open: false, setOpen: () => {} })

export function useCommandPalette() {
  return useContext(Ctx)
}

interface Props {
  user: User
  children: React.ReactNode
}

export function CommandPaletteProvider({ user, children }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const visible = filterNavForUser(NAV_ITEMS, user)
  const byGroup = groupNavItems(visible)

  const navigate = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[14vh]"
      >
        <div
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
        <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border px-3.5">
            <Search className="size-4 text-muted-foreground" />
            <Command.Input
              placeholder="Type a command or search…"
              className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">ESC</kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results.
            </Command.Empty>
            {GROUP_ORDER.map(group => {
              const items = byGroup[group]
              if (!items || items.length === 0) return null
              return (
                <Command.Group
                  key={group}
                  heading={GROUP_LABELS[group] || "Navigate"}
                  className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {items.map(item => (
                    <Command.Item
                      key={item.href}
                      value={`${item.label} ${item.href}`}
                      onSelect={() => navigate(item.href)}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground data-[selected=true]:bg-muted"
                    >
                      <item.icon className="size-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )
            })}
          </Command.List>
        </div>
      </Command.Dialog>
    </Ctx.Provider>
  )
}
