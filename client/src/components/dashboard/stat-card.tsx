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
        "group relative flex min-h-[130px] flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 text-foreground transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-950",
        "hover:border-zinc-400 dark:hover:border-zinc-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
        <Icon className="size-4.5 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors" aria-hidden />
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                "text-xs font-medium",
                delta.positive 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : "text-rose-600 dark:text-rose-400"
              )}
            >
              {delta.positive ? "+" : "-"}{delta.value}
            </span>
          )}
        </div>
        {delta?.label && (
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {delta.label}
          </span>
        )}
      </div>

      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ArrowUpRight className="size-3.5 text-zinc-400 dark:text-zinc-500" />
      </div>
    </Link>
  )
}

