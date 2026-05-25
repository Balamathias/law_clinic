"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { randomUUID } from "crypto";

import {
  publicationSchema,
  type PublicationFormValues,
} from "./publication-form.schema";
import { TiptapEditor } from "./tiptap-editor";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Publication, PublicationCategory } from "@/@types/db";
import {
  createPublication,
  type CreatePublicationPayload,
} from "@/services/server/publications";

interface PublicationFormProps {
  publication?: Publication;
  categories: PublicationCategory[];
  mode: "create" | "edit";
}

// Generate a stable ID for this form session (used for R2 image upload path)
const SESSION_ID =
  typeof crypto !== "undefined" ? crypto.randomUUID?.() ?? "pub-new" : "pub-new";

export function PublicationForm({
  publication,
  categories,
  mode,
}: PublicationFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema) as any,
    defaultValues: {
      title: publication?.title ?? "",
      slug: publication?.slug ?? "",
      excerpt: publication?.excerpt ?? "",
      content: publication?.content ?? "",
      content_format: publication?.content_format ?? "html",
      featured_image: publication?.featured_image ?? null,
      categories:
        publication?.categories?.map((c) => c.id) ?? [],
      status: publication?.status ?? "draft",
      is_featured: publication?.is_featured ?? false,
      allow_comments: publication?.allow_comments ?? true,
      meta_title: publication?.meta_title ?? "",
      meta_description: publication?.meta_description ?? "",
      keywords: publication?.keywords ?? "",
      mins_read: publication?.mins_read ?? 0,
    },
  });

  const contentFormat = watch("content_format");
  const featuredImage = watch("featured_image");
  const pubId = publication?.id ?? SESSION_ID;

  const onSubmit = async (values: PublicationFormValues) => {
    setSubmitting(true);
    try {
      const payload: CreatePublicationPayload = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt ?? undefined,
        featured_image: values.featured_image ?? undefined,
        status: values.status,
        is_featured: values.is_featured,
        allow_comments: values.allow_comments,
        meta_title: values.meta_title ?? undefined,
        meta_description: values.meta_description ?? undefined,
        keywords: values.keywords ?? undefined,
        mins_read: values.mins_read,
        content_format: values.content_format,
        categories: values.categories,
      } as any;

      const res =
        mode === "create"
          ? await createPublication(payload)
          : await (await import("@/services/server/publications")).updatePublication(
              publication!.id,
              payload
            );

      if (res?.data) {
        toast.success(
          mode === "create"
            ? "Publication created successfully"
            : "Publication updated successfully"
        );
        router.push("/dashboard/publications");
        router.refresh();
      } else {
        toast.error(res?.message ?? "Failed to save publication");
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* === Main column === */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="pub-title">Title *</Label>
            <Input
              id="pub-title"
              placeholder="Publication title"
              {...register("title")}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-small text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="pub-excerpt">Excerpt</Label>
            <Textarea
              id="pub-excerpt"
              placeholder="Short summary shown in listings…"
              rows={3}
              {...register("excerpt")}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Content *</Label>
              <Controller
                name="content_format"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-8 w-36 text-small">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="html">Rich text (HTML)</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {contentFormat === "html" ? (
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    publicationId={pubId}
                    placeholder="Start writing your publication…"
                  />
                )}
              />
            ) : (
              <Textarea
                id="pub-content"
                placeholder="Write in Markdown…"
                rows={20}
                className="font-mono text-small"
                {...register("content")}
              />
            )}
            {errors.content && (
              <p className="text-small text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* SEO section */}
          <details className="rounded-lg border border-border">
            <summary className="cursor-pointer select-none px-4 py-3 text-small font-medium text-ink hover:bg-surface-muted">
              SEO & Metadata
            </summary>
            <div className="space-y-4 px-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="pub-meta-title">Meta title</Label>
                <Input
                  id="pub-meta-title"
                  placeholder="Override page title for search engines"
                  {...register("meta_title")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pub-meta-desc">Meta description</Label>
                <Textarea
                  id="pub-meta-desc"
                  placeholder="Search engine description (max 300 chars)"
                  rows={3}
                  {...register("meta_description")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pub-keywords">Keywords</Label>
                <Input
                  id="pub-keywords"
                  placeholder="comma, separated, keywords"
                  {...register("keywords")}
                />
              </div>
            </div>
          </details>
        </div>

        {/* === Sidebar === */}
        <div className="space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="pub-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <Controller
              name="is_featured"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="pub-featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="pub-featured" className="cursor-pointer">
              Featured publication
            </Label>
          </div>

          {/* Allow comments */}
          <div className="flex items-center gap-3">
            <Controller
              name="allow_comments"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="pub-comments"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="pub-comments" className="cursor-pointer">
              Allow comments
            </Label>
          </div>

          {/* Reading time */}
          <div className="space-y-2">
            <Label htmlFor="pub-mins">Estimated read time (mins)</Label>
            <Input
              id="pub-mins"
              type="number"
              min={0}
              {...register("mins_read", { valueAsNumber: true })}
            />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border border-border p-3">
                {categories.map((cat) => {
                  const selected = watch("categories") ?? [];
                  const checked = selected.includes(cat.id);
                  return (
                    <div key={cat.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={checked}
                        onCheckedChange={(v) => {
                          const current = watch("categories") ?? [];
                          setValue(
                            "categories",
                            v
                              ? [...current, cat.id]
                              : current.filter((id) => id !== cat.id)
                          );
                        }}
                      />
                      <Label
                        htmlFor={`cat-${cat.id}`}
                        className="cursor-pointer text-small"
                      >
                        {cat.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Featured image */}
          <div className="space-y-2">
            <Label>Featured image</Label>
            <ImageUploader
              value={featuredImage ?? null}
              onChange={(url) => setValue("featured_image", url)}
              category="publications"
              id={pubId}
              label="Upload featured image"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting
              ? "Saving…"
              : mode === "create"
              ? "Create publication"
              : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/dashboard/publications")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
