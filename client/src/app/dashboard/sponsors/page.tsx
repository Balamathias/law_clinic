'use client'

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Heart, Plus, Edit2, Trash2, Globe, Sparkles, ExternalLink } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { ImageUploader } from "@/components/ui/image-uploader"
import {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from "@/services/server/app_settings"
import { Sponsor } from "@/@types/db"
import Loader from "@/components/loader"
import { parseApiError } from "@/services/server.entry"

export default function SponsorsPage() {
  const queryClient = useQueryClient()

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Selected sponsor
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)

  // Form states
  const [name, setName] = useState("")
  const [type, setType] = useState<"person" | "organization">("organization")
  const [url, setUrl] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [ordering, setOrdering] = useState<number>(0)

  // Query
  const { data: sponsorsRes, isLoading } = useQuery({
    queryKey: ["sponsors"],
    queryFn: () => getSponsors(),
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createSponsor,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to create sponsor")
        return
      }
      toast.success("Sponsor created successfully")
      setIsAddOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["sponsors"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to create sponsor")
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateSponsor(id, payload),
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to update sponsor")
        return
      }
      toast.success("Sponsor updated successfully")
      setIsEditOpen(false)
      setSelectedSponsor(null)
      queryClient.invalidateQueries({ queryKey: ["sponsors"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to update sponsor")
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteSponsor,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to delete sponsor")
        return
      }
      toast.success("Sponsor deleted successfully")
      setIsDeleteOpen(false)
      setSelectedSponsor(null)
      queryClient.invalidateQueries({ queryKey: ["sponsors"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to delete sponsor")
    },
  })

  // Helpers
  const resetForm = () => {
    setName("")
    setType("organization")
    setUrl("")
    setImage(null)
    setOrdering(0)
  }

  const handleOpenEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    setName(sponsor.name)
    setType(sponsor.type)
    setUrl(sponsor.url || "")
    setImage(sponsor.image || null)
    setOrdering(sponsor.ordering || 0)
    setIsEditOpen(true)
  }

  const handleOpenDelete = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    setIsDeleteOpen(true)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Sponsor name is required")
      return
    }
    createMutation.mutate({
      name,
      type,
      url: url || null,
      image: image || null,
      ordering: Number(ordering) || null,
    })
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSponsor) return
    if (!name.trim()) {
      toast.error("Sponsor name is required")
      return
    }
    updateMutation.mutate({
      id: selectedSponsor.id,
      payload: {
        name,
        type,
        url: url || null,
        image: image || null,
        ordering: Number(ordering) || null,
      },
    })
  }

  const handleDeleteSubmit = () => {
    if (!selectedSponsor) return
    deleteMutation.mutate(selectedSponsor.id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading sponsors list..." />
      </div>
    )
  }

  const sponsors = sponsorsRes?.data || []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Heart className="size-3.5" />
            Partnerships
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Sponsors & Partners
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Manage donors, sponsoring law firms, and partners displayed on the public website footer and landing page.
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
          <span className="font-semibold text-xs">Add Partner</span>
        </Button>
      </div>

      {/* Main Table Card */}
      {sponsors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center bg-card/30">
          <Heart className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-semibold text-foreground">
            No sponsors listed yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first organization or patron to populate the landing showcase.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold">Logo</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Website</TableHead>
                <TableHead className="font-semibold text-center">Order</TableHead>
                <TableHead className="w-[120px] text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sponsors.map((sponsor) => (
                <TableRow key={sponsor.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="py-3">
                    {sponsor.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sponsor.image}
                        alt={sponsor.name}
                        className="size-10 rounded-lg object-contain border border-border bg-white"
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                        <Sparkles className="size-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground py-3">
                    {sponsor.name}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider rounded-md">
                      {sponsor.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell py-3 max-w-xs truncate">
                    {sponsor.url ? (
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-primary transition-colors text-xs font-mono"
                      >
                        {sponsor.url}
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-xs py-3">
                    {sponsor.ordering ?? 0}
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(sponsor)}
                        className="size-8 rounded-lg hover:bg-muted"
                      >
                        <Edit2 className="size-3.5 text-zinc-600 dark:text-zinc-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(sponsor)}
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
            <DialogTitle className="font-serif text-xl font-bold">Add Sponsor/Partner</DialogTitle>
            <DialogDescription>
              Create a new sponsor banner card.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Logo / Image</Label>
              <ImageUploader
                value={image}
                onChange={setImage}
                category="sponsors"
                id="temp"
                label="Upload logo file"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input
                id="add-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ford Foundation"
                className="rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="add-type" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</Label>
                <select
                  id="add-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="organization">Organization</option>
                  <option value="person">Patron / Person</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-order" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ordering</Label>
                <Input
                  id="add-order"
                  type="number"
                  value={ordering}
                  onChange={(e) => setOrdering(Number(e.target.value))}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website Link</Label>
              <Input
                id="add-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. https://example.com"
                className="rounded-lg"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="rounded-lg">
                {createMutation.isPending ? "Adding..." : "Add Sponsor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">Edit Partner Details</DialogTitle>
            <DialogDescription>
              Update sponsor information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Logo / Image</Label>
              <ImageUploader
                value={image}
                onChange={setImage}
                category="sponsors"
                id={selectedSponsor?.id || "temp"}
                label="Upload logo file"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-type" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</Label>
                <select
                  id="edit-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="organization">Organization</option>
                  <option value="person">Patron / Person</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-order" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ordering</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={ordering}
                  onChange={(e) => setOrdering(Number(e.target.value))}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website Link</Label>
              <Input
                id="edit-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-lg"
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
            <DialogTitle className="font-serif text-xl font-bold text-destructive">Remove Sponsor</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove **{selectedSponsor?.name}**? This cannot be undone.
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
