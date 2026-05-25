import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PublicationForm } from "@/components/dashboard/publications/publication-form";
import { getCategories } from "@/services/server/publications";

export const metadata: Metadata = {
  title: "New Publication | ABU Law Clinic",
};

export default async function NewPublicationPage() {
  const { data: categories } = await getCategories();

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
          New publication
        </h1>
      </div>

      <PublicationForm
        categories={categories ?? []}
        mode="create"
      />
    </div>
  );
}
