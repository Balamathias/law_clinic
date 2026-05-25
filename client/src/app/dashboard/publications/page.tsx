import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicationsTable from "@/components/publications/publications-table";
import PublicationsOverview from "@/components/publications/publications-overview";
import { getPublications, getPublicationsStats } from "@/services/server/publications";

export const metadata: Metadata = {
  title: "Publications | ABU Law Clinic",
  description: "Manage and publish clinic publications.",
};

interface Props {
  params: Promise<any>;
  searchParams: Promise<Record<string, any>>;
}

export default async function PublicationsPage({ searchParams: _sp }: Props) {
  const searchParams = await _sp;

  const [publications, stats] = await Promise.all([
    getPublications({ params: { ...searchParams } }),
    getPublicationsStats(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header styled with Apple-level visual hierarchy */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider">
            <BookOpen className="size-3.5" />
            Editorial Hub
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Publications
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Draft, edit, publish, and schedule student and staff research papers, legal guidelines, and newsletters.
          </p>
        </div>
        
        <Button asChild className="shrink-0 bg-primary text-primary-foreground shadow-xs hover:shadow rounded-xl px-4 py-2 h-10 self-start sm:self-center">
          <Link href="/dashboard/publications/new">
            <Plus className="mr-1.5 size-4" />
            <span className="font-semibold text-xs">New Publication</span>
          </Link>
        </Button>
      </div>

      {/* Reimagined Publications Overview Card Grid */}
      <PublicationsOverview stats={stats.data} />

      {/* Publications Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold tracking-tight text-foreground">
            All Publications
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            Showing {publications.data?.length ?? 0} of {publications.count ?? 0} items
          </span>
        </div>

        <PublicationsTable
          publications={publications.data}
          count={publications.count}
          pageSize={20}
        />
      </div>
    </div>
  );
}