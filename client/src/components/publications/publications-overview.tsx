"use client";

import React from 'react';
import { 
  FilePenLine, 
  FileText, 
  PenSquare,
  BookOpenCheck,
  Sparkles,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { useRouter } from 'next/navigation';
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
      <div 
        className="group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-card p-5 text-foreground transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/5 hover:border-indigo-500/20"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Total Publications
          </span>
          <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <FileText className="size-4.5" aria-hidden />
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <span className="font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {totalCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            Articles in database
          </span>
        </div>
      </div>

      {/* Published Articles Card */}
      <div 
        className="group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-card p-5 text-foreground transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5 hover:border-emerald-500/20"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Published Articles
          </span>
          <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <BookOpenCheck className="size-4.5" aria-hidden />
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {publishedCount.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              {publishedPercentage}% of total
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">
            Publicly active articles
          </span>
        </div>
      </div>

      {/* Draft Articles Card */}
      <div 
        className="group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-card p-5 text-foreground transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:bg-amber-50/10 dark:hover:bg-amber-950/5 hover:border-amber-500/20"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Draft Articles
          </span>
          <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <PenSquare className="size-4.5" aria-hidden />
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {draftCount.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400">
              {draftPercentage}% of total
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">
            In review or composition
          </span>
        </div>
      </div>

      {/* Publication Management Card */}
      <div className="flex flex-col justify-between rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-foreground">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Operations
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground font-medium leading-relaxed">
            Create new posts or manage existing content tags.
          </p>
        </div>
        
        <div className="mt-4 flex flex-col gap-2.5">
          <Button 
            onClick={() => router.push('/dashboard/publications/new')}
            className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-8 rounded-xl shadow-xs transition-colors"
          >
            <FilePenLine className="mr-2 size-3.5" />
            New Publication
          </Button>
          
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-0.5">
            <span className="flex items-center gap-1">
              <Layers className="size-3" />
              {featuredCount} Featured
            </span>
            <button 
              className="hover:text-primary transition-colors inline-flex items-center gap-0.5"
              onClick={() => router.push('/dashboard/publications/categories')}
            >
              Categories
              <ArrowUpRight className="size-3" />
            </button>
          </div>
        </div>
      </div>
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
          className="min-h-[140px] rounded-2xl border border-border bg-card p-5 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="size-4.5 rounded bg-muted" />
          </div>
          <div className="h-8 w-16 rounded bg-muted" />
          <div className="h-3 w-32 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
};
