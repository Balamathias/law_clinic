import Link from "next/link"
import { ArrowUpRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  delta?: {
    value: string
    positive: boolean
  }
  href: string
  icon: LucideIcon
  className?: string
}

export function StatCard({
  label,
  value,
  delta,
  href,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-40 flex-col gap-5 rounded-lg border border-border bg-surface p-5 text-foreground transition-colors duration-150",
        "hover:border-border-strong hover:bg-surface/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
          {label}
        </span>
        <Icon className="size-4 text-ink-subtle transition-colors group-hover:text-foreground" aria-hidden />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="tnum text-4xl font-semibold leading-none tracking-tight text-foreground">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "text-sm font-medium",
              delta.positive ? "text-success" : "text-danger",
            )}
          >
            {delta.value}
          </span>
        )}
      </div>

      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
        View all
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </Link>
  )
}
