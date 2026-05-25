"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";

import { eventSchema, type EventFormValues } from "./event-form.schema";
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
import type { Event, EventCategory } from "@/@types/db";
import { createEvent, updateEvent } from "@/services/server/events";

interface EventFormProps {
  event?: Event;
  categories: EventCategory[];
  mode: "create" | "edit";
}

const SESSION_ID =
  typeof crypto !== "undefined"
    ? crypto.randomUUID?.() ?? "evt-new"
    : "evt-new";

export function EventForm({ event, categories, mode }: EventFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      short_description: event?.short_description ?? "",
      start_date: event?.start_date
        ? event.start_date.slice(0, 16)
        : "",
      end_date: event?.end_date ? event.end_date.slice(0, 16) : "",
      location: event?.location ?? "",
      virtual_link: event?.virtual_link ?? "",
      category: event?.category ?? null,
      image: event?.image ?? null,
      max_participants: event?.max_participants ?? 0,
      registration_required: event?.registration_required ?? false,
      registration_deadline: event?.registration_deadline
        ? event.registration_deadline.slice(0, 16)
        : null,
      status: event?.status ?? "scheduled",
      featured: event?.featured ?? false,
    },
  });

  const registrationRequired = watch("registration_required");
  const image = watch("image");
  const evtId = event?.id ?? SESSION_ID;

  const onSubmit = async (values: EventFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        max_participants: values.max_participants ?? 0,
        registration_required: values.registration_required ?? false,
        featured: values.featured ?? false,
        virtual_link: values.virtual_link || null,
        registration_deadline: values.registration_deadline || null,
        image: values.image || null,
        category: values.category || null,
        short_description: values.short_description || null,
      };

      const res =
        mode === "create"
          ? await createEvent(payload)
          : await updateEvent(event!.slug, payload);

      if (res?.data) {
        toast.success(
          mode === "create" ? "Event created successfully" : "Event updated"
        );
        router.push("/dashboard/events");
        router.refresh();
      } else {
        toast.error(res?.message ?? "Failed to save event");
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
        {/* Main column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="evt-title">Title *</Label>
            <Input
              id="evt-title"
              placeholder="Event title"
              {...register("title")}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-small text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evt-short-desc">
              Short description{" "}
              <span className="text-muted-foreground">(shown in listings, 140 chars)</span>
            </Label>
            <Input
              id="evt-short-desc"
              placeholder="Brief summary for event listings"
              maxLength={140}
              {...register("short_description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evt-desc">Description *</Label>
            <Textarea
              id="evt-desc"
              placeholder="Full event description (Markdown supported)"
              rows={12}
              className="font-mono text-small"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-small text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="evt-start">Start date & time *</Label>
              <Input
                id="evt-start"
                type="datetime-local"
                {...register("start_date")}
                className={errors.start_date ? "border-destructive" : ""}
              />
              {errors.start_date && (
                <p className="text-small text-destructive">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="evt-end">End date & time *</Label>
              <Input
                id="evt-end"
                type="datetime-local"
                {...register("end_date")}
                className={errors.end_date ? "border-destructive" : ""}
              />
              {errors.end_date && (
                <p className="text-small text-destructive">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="evt-location">Location *</Label>
              <Input
                id="evt-location"
                placeholder="Physical location"
                {...register("location")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evt-virtual">Virtual link</Label>
              <Input
                id="evt-virtual"
                type="url"
                placeholder="https://meet.google.com/..."
                {...register("virtual_link")}
              />
            </div>
          </div>

          {/* Registration */}
          <div className="rounded-lg border border-border p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Controller
                name="registration_required"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="evt-reg-required"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="evt-reg-required" className="cursor-pointer">
                Registration required
              </Label>
            </div>

            {registrationRequired && (
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="evt-max">
                    Max participants{" "}
                    <span className="text-muted-foreground">(0 = unlimited)</span>
                  </Label>
                  <Input
                    id="evt-max"
                    type="number"
                    min={0}
                    {...register("max_participants", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evt-deadline">Registration deadline</Label>
                  <Input
                    id="evt-deadline"
                    type="datetime-local"
                    {...register("registration_deadline")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="evt-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) => field.onChange(v || null)}
                >
                  <SelectTrigger id="evt-category">
                    <SelectValue placeholder="Select category…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="evt-featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="evt-featured" className="cursor-pointer">
              Featured event
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Cover image</Label>
            <ImageUploader
              value={image ?? null}
              onChange={(url) => setValue("image", url)}
              category="events"
              id={evtId}
              label="Upload cover image"
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting
              ? "Saving…"
              : mode === "create"
              ? "Create event"
              : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/dashboard/events")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
