import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, FilePlus } from "lucide-react";
import { PublicationForm } from "@/components/dashboard/publications/publication-form";
import { getCategories } from "@/services/server/publications";

export const metadata: Metadata = {
  title: "New Publication | ABU Law Clinic",
};

export default async function NewPublicationPage() {
  const { data: categories } = await getCategories();

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      <div className="space-y-3.5 border-b border-border/40 pb-6">
        <Link
          href="/dashboard/publications"
          className="group inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Publications
        </Link>
        
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <FilePlus className="size-3.5" />
            Editorial Creation
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Create Publication
          </h1>
          <p className="text-sm text-muted-foreground">
            Compose and configure metadata settings for a new clinical journal entry.
          </p>
        </div>
      </div>

      <PublicationForm
        categories={categories ?? []}
        mode="create"
      />
    </div>
  );
}
