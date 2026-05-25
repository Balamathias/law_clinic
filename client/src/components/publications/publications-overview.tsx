"use client";

import React from 'react';
import { 
  FilePenLine, 
  FileText, 
  PenSquare,
  BookOpenCheck,
  FileStack,
  BarChart,
  Sparkles,
  Layers
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export interface PublicationsStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
}

interface Props {
  stats: PublicationsStats | null;
}

const PublicationsOverview = ({ stats }: Props) => {
  const router = useRouter();

  const totalCount = stats?.total ?? 0;
  const publishedCount = stats?.published ?? 0;
  const draftCount = stats?.draft ?? 0;
  const featuredCount = stats?.featured ?? 0;
  
  const publishedPercentage = totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0;
  const draftPercentage = totalCount > 0 ? Math.round((draftCount / totalCount) * 100) : 0;

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Total Publications Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/85 to-card/50 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
      >
        <div className="absolute -right-10 -top-10 -z-10 size-28 rounded-full bg-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Publications</span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {totalCount.toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground font-medium">Articles in system database</p>
        <div className="mt-4 h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
        </div>
      </motion.div>

      {/* Published Articles Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/85 to-card/50 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-green-500/20 hover:shadow-md"
      >
        <div className="absolute -right-10 -top-10 -z-10 size-28 rounded-full bg-green-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Published Articles</span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            <BookOpenCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {publishedCount.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
            {publishedPercentage}%
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground font-medium">Publicly active articles</p>
        <div className="mt-4 h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500" 
            style={{ width: `${publishedPercentage}%` }} 
          />
        </div>
      </motion.div>

      {/* Draft Articles Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/85 to-card/50 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/20 hover:shadow-md"
      >
        <div className="absolute -right-10 -top-10 -z-10 size-28 rounded-full bg-amber-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Draft Articles</span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <PenSquare className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {draftCount.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            {draftPercentage}%
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground font-medium">In review or composition</p>
        <div className="mt-4 h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-500" 
            style={{ width: `${draftPercentage}%` }} 
          />
        </div>
      </motion.div>

      {/* Publication Management Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="overflow-hidden h-full rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5 flex flex-col justify-between hover:border-primary/45 transition-colors duration-300">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Content Operations
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Create a new public post or manage existing categories and tags.
            </p>
          </div>
          
          <div className="mt-5 space-y-3">
            <Button 
              onClick={() => router.push('/dashboard/publications/new')}
              className="w-full flex items-center justify-center group relative overflow-hidden bg-primary text-primary-foreground shadow-sm hover:shadow transition-all duration-200 py-1.5 h-9 rounded-xl"
            >
              <FilePenLine className="mr-2 size-4 transition-transform group-hover:rotate-6" />
              <span className="font-semibold text-xs">New Publication</span>
            </Button>
            
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 font-medium">
              <span className="flex items-center gap-1">
                <Layers className="size-3" />
                {featuredCount} Featured
              </span>
              <button 
                className="hover:text-primary transition-colors hover:underline"
                onClick={() => router.push('/dashboard/publications/categories')}
              >
                Categories →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicationsOverview;

export const PublicationsOverviewSkeleton = () => {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[148px] rounded-2xl border border-border/50 bg-card p-6 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-24 rounded bg-muted" />
            <div className="size-8 rounded-xl bg-muted" />
          </div>
          <div className="h-8 w-16 rounded bg-muted" />
          <div className="h-2 w-full rounded bg-muted" />
        </div>
      ))}
    </div>
  );
};
