'use client'

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Image as ImageIcon, Plus, Edit2, Trash2, Images, Folder, Calendar, ArrowRight, ExternalLink } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  getGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
} from "@/services/server/app_settings"
import Loader from "@/components/loader"
import { parseApiError } from "@/services/server.entry"

const DEPARTMENTS = [
  { value: "clinical", label: "Clinical" },
  { value: "research", label: "Research" },
  { value: "litigation", label: "Litigation" },
  { value: "other", label: "Other" },
]

export default function GalleryPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("clinical")

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isManageImagesOpen, setIsManageImagesOpen] = useState(false)

  // Selected entities
  const [selectedGallery, setSelectedGallery] = useState<any | null>(null)

  // Form states - Gallery
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState<any>("clinical")
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [isPrevious, setIsPrevious] = useState(false)
  const [ordering, setOrdering] = useState<number>(0)

  // Form states - Add Image
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [imageDescription, setImageDescription] = useState("")
  const [instagram, setInstagram] = useState("")
  const [xHandle, setXHandle] = useState("")
  const [facebook, setFacebook] = useState("")

  // Queries
  const { data: galleriesRes, isLoading: isGalleriesLoading } = useQuery({
    queryKey: ["galleries"],
    queryFn: () => getGalleries(),
  })

  // Selected Gallery Images query
  const { data: imagesRes, isLoading: isImagesLoading } = useQuery({
    queryKey: ["gallery-images", selectedGallery?.id],
    queryFn: () => getGalleryImages({ params: { gallery: selectedGallery?.id } }),
    enabled: !!selectedGallery?.id && isManageImagesOpen,
  })

  // Mutations - Gallery CRUD
  const createGalleryMutation = useMutation({
    mutationFn: createGallery,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to create gallery")
        return
      }
      toast.success("Gallery created successfully")
      setIsAddOpen(false)
      resetGalleryForm()
      queryClient.invalidateQueries({ queryKey: ["galleries"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to create gallery")
    },
  })

  const updateGalleryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateGallery(id, payload),
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to update gallery")
        return
      }
      toast.success("Gallery updated successfully")
      setIsEditOpen(false)
      setSelectedGallery(null)
      queryClient.invalidateQueries({ queryKey: ["galleries"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to update gallery")
    },
  })

  const deleteGalleryMutation = useMutation({
    mutationFn: deleteGallery,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to delete gallery")
        return
      }
      toast.success("Gallery deleted successfully")
      setIsDeleteOpen(false)
      setSelectedGallery(null)
      queryClient.invalidateQueries({ queryKey: ["galleries"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to delete gallery")
    },
  })

  // Mutations - Images CRUD
  const addImageMutation = useMutation({
    mutationFn: createGalleryImage,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to add image")
        return
      }
      toast.success("Image added to gallery")
      setUploadedImageUrl(null)
      setImageDescription("")
      setInstagram("")
      setXHandle("")
      setFacebook("")
      queryClient.invalidateQueries({ queryKey: ["gallery-images", selectedGallery?.id] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to add image")
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to delete image")
        return
      }
      toast.success("Image removed from gallery")
      queryClient.invalidateQueries({ queryKey: ["gallery-images", selectedGallery?.id] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to remove image")
    },
  })

  // Helper Form resets
  const resetGalleryForm = () => {
    setTitle("")
    setDescription("")
    setDepartment("clinical")
    setYear(new Date().getFullYear())
    setIsPrevious(false)
    setOrdering(0)
  }

  // Handlers
  const handleOpenEdit = (gallery: any) => {
    setSelectedGallery(gallery)
    setTitle(gallery.title)
    setDescription(gallery.description || "")
    setDepartment(gallery.department)
    setYear(gallery.year || new Date().getFullYear())
    setIsPrevious(gallery.is_previous)
    setOrdering(gallery.ordering || 0)
    setIsEditOpen(true)
  }

  const handleOpenDelete = (gallery: any) => {
    setSelectedGallery(gallery)
    setIsDeleteOpen(true)
  }

  const handleOpenManageImages = (gallery: any) => {
    setSelectedGallery(gallery)
    setIsManageImagesOpen(true)
  }

  const handleDeleteSubmit = () => {
    if (!selectedGallery) return
    deleteGalleryMutation.mutate(selectedGallery.id)
  }

  const handleCreateGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Gallery title is required")
      return
    }
    createGalleryMutation.mutate({
      title,
      description,
      department,
      year: Number(year) || null,
      is_previous: isPrevious,
      ordering: Number(ordering) || null,
    })
  }

  const handleUpdateGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGallery) return
    if (!title.trim()) {
      toast.error("Gallery title is required")
      return
    }
    updateGalleryMutation.mutate({
      id: selectedGallery.id,
      payload: {
        title,
        description,
        department,
        year: Number(year) || null,
        is_previous: isPrevious,
        ordering: Number(ordering) || null,
      },
    })
  }

  const handleAddImageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedImageUrl) {
      toast.error("Please upload an image first")
      return
    }
    if (!selectedGallery) return
    addImageMutation.mutate({
      image: uploadedImageUrl,
      description: imageDescription,
      gallery: selectedGallery.id,
      instagram: instagram || null,
      x_handle: xHandle || null,
      facebook: facebook || null,
    })
  }

  if (isGalleriesLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading galleries..." />
      </div>
    )
  }

  const allGalleries = galleriesRes?.data || []
  const filteredGalleries = allGalleries.filter((g) => g.department === activeTab)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <ImageIcon className="size-3.5" />
            Media & CMS
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Gallery Management
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Create folder collections of photos for clinical, research, and litigation departments to present on the main site.
          </p>
        </div>

        <Button
          onClick={() => {
            resetGalleryForm()
            setIsAddOpen(true)
          }}
          className="shrink-0 bg-primary text-primary-foreground shadow-xs hover:shadow rounded-xl px-4 py-2 h-10 self-start sm:self-center"
        >
          <Plus className="mr-1.5 size-4" />
          <span className="font-semibold text-xs">New Folder</span>
        </Button>
      </div>

      {/* Tabs list by department */}
      <Tabs defaultValue="clinical" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-muted/40 p-1.5 rounded-2xl w-full sm:w-auto flex flex-wrap gap-1 h-auto border border-border/40">
          {DEPARTMENTS.map((dept) => (
            <TabsTrigger
              key={dept.value}
              value={dept.value}
              className="rounded-xl px-5 py-2 text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
            >
              {dept.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="focus-visible:outline-none">
          {filteredGalleries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center bg-muted/10">
              <div className="size-14 rounded-2xl bg-muted/40 flex items-center justify-center mb-4">
                <Folder className="size-7 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-bold text-foreground">
                No folders in {DEPARTMENTS.find((d) => d.value === activeTab)?.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                Start by creating a new media folder for this department.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGalleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-5 flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-[9px] font-bold tracking-widest uppercase rounded-lg bg-primary/10 text-primary border-primary/20 px-2 py-0.5">
                        {gallery.year || "General"}
                      </Badge>
                      {gallery.is_previous && (
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest rounded-lg px-2 py-0.5">
                          Archive
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
                        {gallery.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {gallery.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-muted/20 border-t border-border/60 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenManageImages(gallery)}
                      className="text-[11px] font-bold text-primary hover:text-primary/90 gap-1.5 rounded-xl px-3 hover:bg-primary/5 h-8"
                    >
                      <Images className="size-3.5" />
                      Manage Photos
                    </Button>

                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(gallery)}
                        className="size-7 rounded-xl hover:bg-muted"
                      >
                        <Edit2 className="size-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(gallery)}
                        className="size-7 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Folder Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">New Media Folder</DialogTitle>
            <DialogDescription>
              Create a gallery collection folder. Photos can be added inside.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateGallerySubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</Label>
              <Input
                id="add-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Legal Aid Clinic Induction"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea
                id="add-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the event or folder contents..."
                className="rounded-lg min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="add-dept" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</Label>
                <select
                  id="add-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-year" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Year</Label>
                <Input
                  id="add-year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                id="add-prev"
                type="checkbox"
                checked={isPrevious}
                onChange={(e) => setIsPrevious(e.target.checked)}
                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="add-prev" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Mark as past archive session gallery
              </Label>
            </div>
            <DialogFooter className="pt-3 border-t border-border/60">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl border-border font-bold text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" disabled={createGalleryMutation.isPending} className="rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs h-9 shadow-xs">
                {createGalleryMutation.isPending ? "Creating..." : "Create Folder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">Edit Folder Details</DialogTitle>
            <DialogDescription>
              Update structural information for this gallery folder.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateGallerySubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-lg min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-dept" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</Label>
                <select
                  id="edit-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-year" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Year</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                id="edit-prev"
                type="checkbox"
                checked={isPrevious}
                onChange={(e) => setIsPrevious(e.target.checked)}
                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="edit-prev" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Mark as past archive session gallery
              </Label>
            </div>
            <DialogFooter className="pt-3 border-t border-border/60">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl border-border font-bold text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" disabled={updateGalleryMutation.isPending} className="rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs h-9 shadow-xs">
                {updateGalleryMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-destructive">Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete **{selectedGallery?.title}**? This will delete all photos inside it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4 border-t border-border/60">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl border-border font-bold text-xs h-9">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={deleteGalleryMutation.isPending}
              className="rounded-xl font-bold text-xs h-9 bg-rose-600 hover:bg-rose-500"
            >
              {deleteGalleryMutation.isPending ? "Deleting..." : "Delete Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Photos Large Dialog */}
      <Dialog open={isManageImagesOpen} onOpenChange={setIsManageImagesOpen}>
        <DialogContent className="sm:max-w-[650px] md:max-w-[750px] rounded-2xl border-border bg-card max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Images className="size-5 text-primary" />
              Manage Folder: {selectedGallery?.title}
            </DialogTitle>
            <DialogDescription>
              Upload new photos and view current images in this collection.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-5 py-4 border-t border-b border-border/60">
            {/* Upload form left side */}
            <form onSubmit={handleAddImageSubmit} className="md:col-span-2 space-y-4">
              <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Upload New Photo
              </h4>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Select Photo</Label>
                <ImageUploader
                  value={uploadedImageUrl}
                  onChange={setUploadedImageUrl}
                  category="gallery"
                  id={selectedGallery?.id || "temp"}
                  label="Click to select image file"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="img-desc" className="text-xs font-semibold text-muted-foreground font-semibold">Caption / Description</Label>
                <Input
                  id="img-desc"
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Photo caption..."
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Social Links (Optional)</Label>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram Link"
                  className="rounded-lg h-8 text-xs mb-1.5"
                />
                <Input
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                  placeholder="X (Twitter) Link"
                  className="rounded-lg h-8 text-xs mb-1.5"
                />
                <Input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Facebook Link"
                  className="rounded-lg h-8 text-xs"
                />
              </div>
              <Button type="submit" disabled={addImageMutation.isPending} className="w-full rounded-lg font-semibold text-xs h-9">
                {addImageMutation.isPending ? "Adding..." : "Add to Gallery"}
              </Button>
            </form>

            {/* List side right side */}
            <div className="md:col-span-3 flex flex-col space-y-3">
              <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Current Photos ({imagesRes?.data?.length || 0})
              </h4>
              {isImagesLoading ? (
                <div className="flex items-center justify-center py-12 flex-1">
                  <Loader variant="dots" size={24} text="Loading photos..." />
                </div>
              ) : !imagesRes?.data || imagesRes.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl py-12 flex-1 text-center bg-muted/10">
                  <ImageIcon className="size-8 text-muted-foreground/30" />
                  <p className="mt-2 text-xs font-semibold text-zinc-500">Folder is empty</p>
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-2 max-h-[350px] overflow-y-auto pr-1">
                  {imagesRes.data.map((img) => (
                    <div
                      key={img.id}
                      className="group relative border border-border bg-card rounded-2xl overflow-hidden flex flex-col shadow-xs hover:shadow-sm transition-all"
                    >
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.image || undefined}
                          alt={img.description || "Gallery Photo"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                      </div>
                      <div className="p-2 flex-1 flex flex-col justify-between gap-1.5">
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {img.description || "No caption."}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteImageMutation.mutate(img.id)}
                          disabled={deleteImageMutation.isPending}
                          className="size-6 text-destructive hover:bg-destructive/10 hover:text-destructive self-end rounded-md"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border/60">
            <Button type="button" variant="outline" onClick={() => setIsManageImagesOpen(false)} className="rounded-xl border-border font-bold text-xs h-9">
              Close Window
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
