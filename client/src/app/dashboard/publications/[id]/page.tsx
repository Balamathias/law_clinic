import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PublicationForm } from "@/components/dashboard/publications/publication-form";
import { getPublication, getCategories } from "@/services/server/publications";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getPublication(id);
  return {
    title: res.data?.title
      ? `Edit: ${res.data.title} | ABU Law Clinic`
      : "Edit Publication | ABU Law Clinic",
  };
}

export default async function EditPublicationPage({ params }: Props) {
  const { id } = await params;

  const [pubRes, categoriesRes] = await Promise.all([
    getPublication(id),
    getCategories(),
  ]);

  if (!pubRes.data) notFound();

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
          {pubRes.data.title}
        </p>
      </div>

      <PublicationForm
        publication={pubRes.data}
        categories={categoriesRes.data ?? []}
        mode="edit"
      />
    </div>
  );
}
