"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { FileText, Settings, Image as ImageIcon, Save, X, Eye, Sparkles } from "lucide-react";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* === Main column === */}
        <div className="space-y-6">
          {/* Main Form Fields */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-xs">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="pub-title" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Title *</Label>
              <Input
                id="pub-title"
                placeholder="Enter publication title..."
                {...register("title")}
                className={errors.title ? "border-destructive focus-visible:ring-destructive/20 h-10 rounded-xl" : "h-10 rounded-xl border-border focus-visible:ring-primary/20"}
              />
              {errors.title && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="pub-excerpt" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Excerpt / Summary</Label>
              <Textarea
                id="pub-excerpt"
                placeholder="A short summary shown in listings and search engines..."
                rows={3}
                {...register("excerpt")}
                className="rounded-xl border-border focus-visible:ring-primary/20 text-xs font-medium leading-relaxed"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Content *</Label>
                <Controller
                  name="content_format"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-8 w-36 text-xs font-semibold rounded-lg border-border focus:ring-primary/20 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border bg-card">
                        <SelectItem value="html" className="text-xs font-medium rounded-lg cursor-pointer">Rich text (HTML)</SelectItem>
                        <SelectItem value="markdown" className="text-xs font-medium rounded-lg cursor-pointer">Markdown</SelectItem>
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
                  placeholder="Write your article in Markdown format..."
                  rows={20}
                  className="font-mono text-xs rounded-xl border-border focus-visible:ring-primary/20 leading-relaxed bg-background p-4"
                  {...register("content")}
                />
              )}
              {errors.content && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          {/* SEO section */}
          <details className="group rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <summary className="cursor-pointer select-none px-6 py-4 text-xs font-bold text-foreground uppercase tracking-wider hover:bg-muted/40 transition-colors flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                SEO & Metadata Settings
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold group-open:hidden">Expand</span>
              <span className="text-[10px] text-muted-foreground font-semibold hidden group-open:inline">Collapse</span>
            </summary>
            
            <div className="space-y-5 px-6 pb-6 pt-2 border-t border-border/60">
              <div className="space-y-2">
                <Label htmlFor="pub-meta-title" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Meta title</Label>
                <Input
                  id="pub-meta-title"
                  placeholder="Override default search engine page title..."
                  {...register("meta_title")}
                  className="h-10 rounded-xl border-border focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pub-meta-desc" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Meta description</Label>
                <Textarea
                  id="pub-meta-desc"
                  placeholder="Search engine meta snippet (recommended under 160 characters)..."
                  rows={3}
                  {...register("meta_description")}
                  className="rounded-xl border-border focus-visible:ring-primary/20 text-xs font-medium leading-relaxed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pub-keywords" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Keywords</Label>
                <Input
                  id="pub-keywords"
                  placeholder="e.g. landlord rights, law clinic, renter guidelines"
                  {...register("keywords")}
                  className="h-10 rounded-xl border-border focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </details>
        </div>

        {/* === Sidebar === */}
        <div className="space-y-6">
          {/* Configuration Card */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xs">
            <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Settings className="size-4.5 text-primary" />
              Settings
            </h2>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Publication Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="pub-status" className="h-10 rounded-xl border-border focus:ring-primary/20 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-card">
                      <SelectItem value="draft" className="rounded-lg cursor-pointer text-xs font-semibold">Draft</SelectItem>
                      <SelectItem value="published" className="rounded-lg cursor-pointer text-xs font-semibold">Published</SelectItem>
                      <SelectItem value="archived" className="rounded-lg cursor-pointer text-xs font-semibold">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3.5 pt-2">
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
                      className="rounded-md"
                    />
                  )}
                />
                <Label htmlFor="pub-featured" className="cursor-pointer text-xs font-semibold text-foreground">
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
                      className="rounded-md"
                    />
                  )}
                />
                <Label htmlFor="pub-comments" className="cursor-pointer text-xs font-semibold text-foreground">
                  Allow reader comments
                </Label>
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categories</Label>
                <div className="max-h-48 overflow-y-auto space-y-2.5 rounded-xl border border-border p-3.5 bg-background">
                  {categories.map((cat) => {
                    const selected = watch("categories") ?? [];
                    const checked = selected.includes(cat.id);
                    return (
                      <div key={cat.id} className="flex items-center gap-2.5">
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
                          className="rounded-md"
                        />
                        <Label
                          htmlFor={`cat-${cat.id}`}
                          className="cursor-pointer text-xs font-semibold text-foreground"
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
            <div className="space-y-2 pt-2 border-t border-border/60">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Featured Image</Label>
              <ImageUploader
                value={featuredImage ?? null}
                onChange={(url) => setValue("featured_image", url)}
                category="publications"
                id={pubId}
                label="Upload image"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-border/60">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-10 rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs transition-colors"
              >
                <Save className="size-4" />
                {submitting
                  ? "Saving…"
                  : mode === "create"
                  ? "Create Publication"
                  : "Save Changes"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 rounded-xl border-border text-foreground hover:bg-muted font-bold text-xs"
                onClick={() => router.push("/dashboard/publications")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
