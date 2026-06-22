'use client'

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Quote, Plus, Edit2, Trash2, User, Landmark } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/ui/image-uploader"
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/services/server/app_settings"
import { Testimonial } from "@/@types/db"
import Loader from "@/components/loader"
import { parseApiError } from "@/services/server.entry"

export default function TestimonialsPage() {
  const queryClient = useQueryClient()

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Selected testimonial
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  // Form states
  const [name, setName] = useState("")
  const [occupation, setOccupation] = useState("")
  const [quote, setQuote] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [category, setCategory] = useState("")

  // Query
  const { data: testimonialsRes, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => getTestimonials(),
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to create testimonial")
        return
      }
      toast.success("Testimonial added successfully")
      setIsAddOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to create testimonial")
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateTestimonial(id, payload),
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to update testimonial")
        return
      }
      toast.success("Testimonial updated successfully")
      setIsEditOpen(false)
      setSelectedTestimonial(null)
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to update testimonial")
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to delete testimonial")
        return
      }
      toast.success("Testimonial deleted successfully")
      setIsDeleteOpen(false)
      setSelectedTestimonial(null)
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to delete testimonial")
    },
  })

  // Helpers
  const resetForm = () => {
    setName("")
    setOccupation("")
    setQuote("")
    setImage(null)
    setCategory("")
  }

  const handleOpenEdit = (t: Testimonial) => {
    setSelectedTestimonial(t)
    setName(t.name)
    setOccupation(t.occupation)
    setQuote(t.quote || "")
    setImage(t.image || null)
    setCategory(t.category || "")
    setIsEditOpen(true)
  }

  const handleOpenDelete = (t: Testimonial) => {
    setSelectedTestimonial(t)
    setIsDeleteOpen(true)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !occupation.trim() || !quote.trim()) {
      toast.error("Name, occupation, and quote are required")
      return
    }
    createMutation.mutate({
      name,
      occupation,
      quote,
      image: image || null,
      category: category || null,
    })
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTestimonial) return
    if (!name.trim() || !occupation.trim() || !quote.trim()) {
      toast.error("Name, occupation, and quote are required")
      return
    }
    updateMutation.mutate({
      id: selectedTestimonial.id,
      payload: {
        name,
        occupation,
        quote,
        image: image || null,
        category: category || null,
      },
    })
  }

  const handleDeleteSubmit = () => {
    if (!selectedTestimonial) return
    deleteMutation.mutate(selectedTestimonial.id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading testimonials..." />
      </div>
    )
  }

  const testimonials = testimonialsRes?.data || []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Quote className="size-3.5" />
            Social Proof
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Testimonials
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Manage reviews and recommendations from clinic clients, alumni, and collaborating legal bodies.
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm()
            setIsAddOpen(true)
          }}
          className="shrink-0 bg-primary text-primary-foreground shadow-xs hover:shadow rounded-xl px-4 py-2 h-10 self-start sm:self-center"
        >
          <Plus className="mr-1.5 size-4" />
          <span className="font-semibold text-xs">Add Review</span>
        </Button>
      </div>

      {/* Main Grid */}
      {testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center bg-card/30">
          <Quote className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-semibold text-foreground">
            No testimonials listed yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Patron reviews and client success quotes will be shown here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group rounded-xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {t.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.image}
                        alt={t.name}
                        className="size-12 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="size-12 rounded-full bg-muted flex items-center justify-center border border-border">
                        <User className="size-5 text-muted-foreground/50" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif text-base font-bold text-foreground line-clamp-1">
                        {t.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {t.occupation}
                      </p>
                    </div>
                  </div>
                  {t.category && (
                    <Badge variant="outline" className="text-[9px] font-semibold tracking-wider uppercase rounded-md">
                      {t.category}
                    </Badge>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute -left-1 -top-2 text-3xl font-serif text-primary/10 select-none">“</span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-4 leading-relaxed pl-3 italic">
                    {t.quote}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenEdit(t)}
                  className="size-8 rounded-lg hover:bg-muted"
                >
                  <Edit2 className="size-3.5 text-zinc-600 dark:text-zinc-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDelete(t)}
                  className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">New Testimonial</DialogTitle>
            <DialogDescription>
              Write client reviews or sponsor feedback.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avatar / Photo</Label>
              <ImageUploader
                value={image}
                onChange={setImage}
                category="avatars"
                id="temp"
                label="Upload photo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="add-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input
                  id="add-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-occ" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Occupation / Role</Label>
                <Input
                  id="add-occ"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Alumni / Staff"
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-cat" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
              <Input
                id="add-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Client, Alumni, Partner"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-quote" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quote / Feedback</Label>
              <Textarea
                id="add-quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Write the quote text..."
                className="rounded-lg min-h-[100px]"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="rounded-lg">
                {createMutation.isPending ? "Adding..." : "Add Review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">Edit Testimonial</DialogTitle>
            <DialogDescription>
              Modify feedback content and author credentials.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avatar / Photo</Label>
              <ImageUploader
                value={image}
                onChange={setImage}
                category="avatars"
                id={selectedTestimonial?.id || "temp"}
                label="Upload photo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-occ" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Occupation / Role</Label>
                <Input
                  id="edit-occ"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-cat" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
              <Input
                id="edit-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-quote" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quote / Feedback</Label>
              <Textarea
                id="edit-quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="rounded-lg min-h-[100px]"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="rounded-lg">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-destructive">Remove Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete **{selectedTestimonial?.name}**'s review? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={deleteMutation.isPending}
              className="rounded-lg"
            >
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
