import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(255),
    description: z.string().min(10, "Description is required"),
    short_description: z.string().max(140).optional().nullable(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    location: z.string().min(1, "Location is required"),
    virtual_link: z.string().url("Must be a valid URL").optional().nullable(),
    category: z.string().optional().nullable(),
    image: z.string().url("Must be a valid URL").optional().nullable(),
    max_participants: z.number().int().min(0).default(0),
    registration_required: z.boolean().default(false),
    registration_deadline: z.string().optional().nullable(),
    status: z
      .enum(["scheduled", "in_progress", "completed", "cancelled", "postponed"])
      .default("scheduled"),
    featured: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date && data.end_date <= data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["end_date"],
      });
    }
  });

export type EventFormValues = z.infer<typeof eventSchema>;
