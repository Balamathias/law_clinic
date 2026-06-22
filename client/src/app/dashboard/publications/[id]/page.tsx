'use client'

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PublicationForm } from "@/components/dashboard/publications/publication-form";
import { usePublication, useCategories } from "@/services/client/publications";
import Loader from "@/components/loader";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="space-y-6">
        <div>
          <Link
            href="/dashboard/publications"
            className="inline-flex items-center gap-1 text-small text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-3.5" />
            Publications
          </Link>
          <h1 className="mt-2 text-h3 font-semibold text-foreground">
            Publication Not Found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/publications"
          className="inline-flex items-center gap-1 text-small text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-3.5" />
          Publications
        </Link>
        <h1 className="mt-2 text-h3 font-semibold text-foreground">
          Edit publication
        </h1>
        <p className="mt-1 text-small text-muted-foreground">
          {publication.title}
        </p>
      </div>

      <PublicationForm
        publication={publication}
        categories={categories}
        mode="edit"
      />
    </div>
  );
}
