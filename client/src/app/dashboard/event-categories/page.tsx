'use client'

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CalendarPlus, Plus, Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  getEventCategories,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "@/services/server/events"
import Loader from "@/components/loader"
import { parseApiError } from "@/services/server.entry"

export default function EventCategoriesPage() {
  const queryClient = useQueryClient()
  
  // State for modals
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  // Selected category data
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; description: string | null } | null>(null)
  
  // Form values
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // Fetch categories
  const { data: categoriesRes, isLoading } = useQuery({
    queryKey: ["event-categories"],
    queryFn: () => getEventCategories(),
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEventCategory,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to create category")
        return
      }
      toast.success("Event category created successfully")
      setIsAddOpen(false)
      setName("")
      setDescription("")
      queryClient.invalidateQueries({ queryKey: ["event-categories"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to create category")
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string; description: string } }) =>
      updateEventCategory(id, payload),
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to update category")
        return
      }
      toast.success("Event category updated successfully")
      setIsEditOpen(false)
      setSelectedCategory(null)
      queryClient.invalidateQueries({ queryKey: ["event-categories"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to update category")
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEventCategory,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to delete category")
        return
      }
      toast.success("Event category deleted successfully")
      setIsDeleteOpen(false)
      setSelectedCategory(null)
      queryClient.invalidateQueries({ queryKey: ["event-categories"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to delete category")
    },
  })

  // Handlers
  const handleOpenEdit = (category: any) => {
    setSelectedCategory(category)
    setName(category.name)
    setDescription(category.description || "")
    setIsEditOpen(true)
  }

  const handleOpenDelete = (category: any) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Category name is required")
      return
    }
    createMutation.mutate({ name, description })
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return
    if (!name.trim()) {
      toast.error("Category name is required")
      return
    }
    updateMutation.mutate({
      id: selectedCategory.id,
      payload: { name, description },
    })
  }

  const handleDeleteSubmit = () => {
    if (!selectedCategory) return
    deleteMutation.mutate(selectedCategory.id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading categories..." />
      </div>
    )
  }

  const categories = categoriesRes?.data || []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <CalendarPlus className="size-3.5" />
            Scheduling System
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Event Categories
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Manage categories to classify seminars, legal workshops, community outreach programs, and court visits.
          </p>
        </div>
        
        <Button
          onClick={() => {
            setName("")
            setDescription("")
            setIsAddOpen(true)
          }}
          className="shrink-0 bg-primary text-primary-foreground shadow-xs hover:shadow rounded-xl px-4 py-2 h-10 self-start sm:self-center"
        >
          <Plus className="mr-1.5 size-4" />
          <span className="font-semibold text-xs">Add Category</span>
        </Button>
      </div>

      {/* Main Table Card */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center bg-card/30">
          <CalendarPlus className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-semibold text-foreground">
            No event categories defined
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first event category.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Description</TableHead>
                <TableHead className="w-[120px] text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell max-w-2xl truncate">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(category)}
                        className="size-8 rounded-lg hover:bg-muted"
                      >
                        <Edit2 className="size-3.5 text-zinc-600 dark:text-zinc-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(category)}
                        className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">New Event Category</DialogTitle>
            <DialogDescription>
              Create a new category to group your clinic events.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input
                id="add-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Legal Workshop"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea
                id="add-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of event classification..."
                className="rounded-lg min-h-[80px]"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="rounded-lg">
                {createMutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">Edit Event Category</DialogTitle>
            <DialogDescription>
              Update the name or details of this event category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <DialogTitle className="font-serif text-xl font-bold text-destructive">Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete **{selectedCategory?.name}**? This action cannot be undone.
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
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
