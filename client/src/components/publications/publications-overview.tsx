'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FilePenLine, 
  FileText, 
  PenSquare,
  BookOpenCheck,
  FileStack,
  BarChart
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicationStats } from '@/@types/db';

interface Props {
  stats: PublicationStats | null;
}

const PublicationsOverview = ({ stats }: Props) => {
  const router = useRouter();

  const totalCount = stats?.total_count || 0;
  const publishedCount = stats?.published_count || 0;
  const draftCount = stats?.draft_count || 0;
  const categoryCount = stats?.by_category?.length || 0;
  
  const publishedPercentage = totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0;
  const draftPercentage = totalCount > 0 ? Math.round((draftCount / totalCount) * 100) : 0;

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5">
            <CardTitle className="text-sm font-medium">Total Publications</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{totalCount.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>Articles in the system</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-green-500/5">
            <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{publishedCount.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>{publishedPercentage}% of all publications</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500" 
                style={{ width: `${publishedPercentage}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-amber-500/5">
            <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
            <PenSquare className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{draftCount.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>{draftPercentage}% of all publications</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${draftPercentage}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="relative"
      >
        <Card className="overflow-hidden h-full shadow-sm border-dashed">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm font-medium">Publication Management</CardTitle>
            <CardDescription className="text-xs">
              Create or manage publications
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[calc(100%-70px)] items-center py-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Button 
                onClick={() => router.push('/dashboard/publications/new')}
                className="w-full flex items-center justify-center group relative overflow-hidden bg-primary"
                size="lg"
              >
                <span className="absolute inset-0 bg-white/10 group-hover:translate-y-0 translate-y-full transition-transform duration-300 ease-in-out"></span>
                <FilePenLine 
                  className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12 duration-300" 
                />
                <span>New Publication</span>
              </Button>
            </motion.div>
            
            {categoryCount > 0 && (
              <div className="mt-4 text-xs text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FileStack className="h-3.5 w-3.5" />
                  <span>{categoryCount} {categoryCount === 1 ? 'category' : 'categories'} available</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs hover:text-primary"
                  onClick={() => router.push('/dashboard/publications/categories')}
                >
                  Manage Categories
                </Button>

                {stats?.featured_count ? (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <BarChart className="h-3.5 w-3.5 text-blue-500" />
                    <span>{stats.featured_count} featured article{stats.featured_count !== 1 ? 's' : ''}</span>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PublicationsOverview;

const PublicationsOverviewSkeleton = () => {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Total Publications Card */}
      <div>
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5">
            <CardTitle className="text-sm font-medium">Total Publications</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="h-8 w-20 mb-1" />
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>Articles in the system</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Published Articles Card */}
      <div>
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-green-500/5">
            <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="h-8 w-20 mb-1" />
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <Skeleton className="h-full w-3/4 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Draft Articles Card */}
      <div>
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-amber-500/5">
            <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
            <PenSquare className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="h-8 w-20 mb-1" />
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <Skeleton className="h-full w-1/4 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Publication Management Card */}
      <div>
        <Card className="overflow-hidden h-full shadow-sm border-dashed">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm font-medium">Publication Management</CardTitle>
            <CardDescription className="text-xs">
              Create or manage publications
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[calc(100%-70px)] items-center py-6">
            <Button 
              disabled
              className="w-full flex items-center justify-center bg-primary"
              size="lg"
            >
              <FilePenLine className="mr-2 h-4 w-4" />
              <span>New Publication</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { PublicationsOverviewSkeleton };
