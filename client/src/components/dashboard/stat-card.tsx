import Link from "next/link"
import { ArrowUpRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  delta?: {
    value: string
    positive: boolean;
    label?: string;
  }
  href: string
  icon: LucideIcon
  className?: string;
  gradientFrom?: string;
}

export function StatCard({
  label,
  value,
  delta,
  href,
  icon: Icon,
  className,
  gradientFrom = "from-primary/10",
}: StatCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/85 to-card/50 p-6 text-foreground shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {/* Dynamic Background Glow */}
      <div className={cn("absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-gradient-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100", gradientFrom)} />

      {/* Decorative accent top bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors group-hover:text-primary/95">
          {label}
        </span>
        <div className="flex size-8 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground border border-border/40 transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/25">
          <Icon className="size-4" aria-hidden />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-baseline gap-2.5">
          <span className="tnum font-sans text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold shadow-xs",
                delta.positive 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              )}
            >
              {delta.positive ? "↑" : "↓"} {delta.value}
            </span>
          )}
        </div>
        {delta?.label && (
          <span className="text-xs text-muted-foreground/80">
            {delta.label}
          </span>
        )}
      </div>

      <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary/90 opacity-0 transform translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100">
        Explore detailed metrics
        <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </Link>
  )
}
