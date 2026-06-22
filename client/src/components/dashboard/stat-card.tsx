import Link from "next/link"
import { ArrowUpRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  delta?: {
    value: string
    positive: boolean
    label?: string
  }
  href: string
  icon: LucideIcon
  className?: string
  themeColor?: 'indigo' | 'violet' | 'amber' | 'teal' | 'default'
}

const COLOR_THEMES = {
  indigo: {
    bg: "hover:bg-indigo-50/10 dark:hover:bg-indigo-950/5",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400",
    border: "hover:border-indigo-200/80 dark:hover:border-indigo-800/80",
    accentLine: "bg-indigo-500",
  },
  violet: {
    bg: "hover:bg-violet-50/10 dark:hover:bg-violet-950/5",
    iconBg: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400",
    border: "hover:border-violet-200/80 dark:hover:border-violet-800/80",
    accentLine: "bg-violet-500",
  },
  amber: {
    bg: "hover:bg-amber-50/10 dark:hover:bg-amber-950/5",
    iconBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
    border: "hover:border-amber-200/80 dark:hover:border-amber-800/80",
    accentLine: "bg-amber-500",
  },
  teal: {
    bg: "hover:bg-teal-50/10 dark:hover:bg-teal-950/5",
    iconBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400",
    border: "hover:border-teal-200/80 dark:hover:border-teal-800/80",
    accentLine: "bg-teal-500",
  },
  default: {
    bg: "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10",
    iconBg: "bg-zinc-100 dark:bg-zinc-900 text-zinc-500",
    border: "hover:border-zinc-300 dark:hover:border-zinc-700",
    accentLine: "bg-zinc-400",
  }
}

export function StatCard({
  label,
  value,
  delta,
  href,
  icon: Icon,
  className,
  themeColor = 'default'
}: StatCardProps) {
  const theme = COLOR_THEMES[themeColor] || COLOR_THEMES.default;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-card p-5 text-foreground transition-all duration-300 shadow-xs overflow-hidden",
        theme.bg,
        theme.border,
        "hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        className
      )}
    >
      {/* Accent strip on hover */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300", theme.accentLine)} />

      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div className={cn("size-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105", theme.iconBg)}>
          <Icon className="size-4.5" aria-hidden />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                "inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                delta.positive 
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
              )}
            >
              {delta.value}
            </span>
          )}
        </div>
        {delta?.label && (
          <span className="text-[10px] text-muted-foreground font-medium">
            {delta.label}
          </span>
        )}
      </div>

      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </div>
    </Link>
  )
}
