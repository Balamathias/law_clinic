"use client";

import React from 'react';
import { 
  FilePenLine, 
  FileText, 
  PenSquare,
  BookOpenCheck,
  Sparkles,
  Layers
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
      <div className="group relative flex min-h-[130px] flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 text-foreground transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-700">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Total Publications
          </span>
          <FileText className="size-4.5 text-zinc-400 dark:text-zinc-500 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300" aria-hidden />
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <span className="font-sans text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {totalCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Articles in database
          </span>
        </div>
      </div>

      {/* Published Articles Card */}
      <div className="group relative flex min-h-[130px] flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 text-foreground transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-700">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Published Articles
          </span>
          <BookOpenCheck className="size-4.5 text-zinc-400 dark:text-zinc-500 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300" aria-hidden />
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {publishedCount.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {publishedPercentage}% of total
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Publicly active articles
          </span>
        </div>
      </div>

      {/* Draft Articles Card */}
      <div className="group relative flex min-h-[130px] flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 text-foreground transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-700">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Draft Articles
          </span>
          <PenSquare className="size-4.5 text-zinc-400 dark:text-zinc-500 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300" aria-hidden />
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {draftCount.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {draftPercentage}% of total
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            In review or composition
          </span>
        </div>
      </div>

      {/* Publication Management Card */}
      <div className="flex flex-col justify-between rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-5 text-foreground dark:border-zinc-800 dark:bg-zinc-900/25">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            <Sparkles className="size-3.5" />
            Operations
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
            Create new posts or manage existing content tags.
          </p>
        </div>
        
        <div className="mt-4 flex flex-col gap-2.5">
          <Button 
            onClick={() => router.push('/dashboard/publications/new')}
            className="w-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-medium text-xs h-8 rounded-lg shadow-sm"
          >
            <FilePenLine className="mr-2 size-3.5" />
            New Publication
          </Button>
          
          <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider px-0.5">
            <span className="flex items-center gap-1">
              <Layers className="size-3" />
              {featuredCount} Featured
            </span>
            <button 
              className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              onClick={() => router.push('/dashboard/publications/categories')}
            >
              Categories →
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
          className="min-h-[130px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="size-4.5 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="h-8 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
};
