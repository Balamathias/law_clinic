import { z } from "zod";

export const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1, "Content is required"),
  content_format: z.enum(["markdown", "html"]).default("html"),
  featured_image: z.string().url("Must be a valid URL").optional().nullable(),
  categories: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  is_featured: z.boolean().default(false),
  allow_comments: z.boolean().default(true),
  meta_title: z.string().max(100).optional().nullable(),
  meta_description: z.string().max(300).optional().nullable(),
  keywords: z.string().max(255).optional().nullable(),
  mins_read: z.number().int().min(0).default(0),
});

export type PublicationFormValues = z.infer<typeof publicationSchema>;
