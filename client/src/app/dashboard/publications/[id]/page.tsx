'use client'

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileEdit } from "lucide-react";
import { PublicationForm } from "@/components/dashboard/publications/publication-form";
import { usePublication, useCategories } from "@/services/client/publications";
import Loader from "@/components/loader";

export default function EditPublicationPage() {
  const { id } = useParams() as { id: string };

  const { data: pubRes, isLoading: isPubLoading } = usePublication(id);
  const { data: categoriesRes, isLoading: isCatsLoading } = useCategories();

  if (isPubLoading || isCatsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading publication..." />
      </div>
    );
  }

  const publication = pubRes?.data;
  const categories = categoriesRes?.data || [];

  if (!publication) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <h1 className="text-2xl font-serif font-bold">Publication Not Found</h1>
        <p className="text-muted-foreground text-sm">The requested publication could not be found.</p>
        <Link 
          href="/dashboard/publications" 
          className="inline-flex items-center justify-center py-2 px-4 border border-border hover:bg-muted/40 transition-colors rounded-xl text-xs font-bold text-foreground"
        >
          Return to list
        </Link>
      </div>
    );
  }

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
            <FileEdit className="size-3.5" />
            Editorial Workspace
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Edit Publication
          </h1>
          <p className="text-sm text-muted-foreground">
            {publication.title}
          </p>
        </div>
      </div>

      <PublicationForm
        publication={publication}
        categories={categories}
        mode="edit"
      />
    </div>
  );
}
