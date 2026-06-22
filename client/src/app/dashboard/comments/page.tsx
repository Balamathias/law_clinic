'use client'

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MessageSquare, Check, X, Trash2, ShieldAlert } from "lucide-react"
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
import {
  getComments,
  updateComment,
  deleteComment,
  ClinicComment,
} from "@/services/server/publications"
import Loader from "@/components/loader"
import { parseApiError } from "@/services/server.entry"

export default function CommentsPage() {
  const queryClient = useQueryClient()
  
  // Modals state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<ClinicComment | null>(null)

  // Fetch comments
  const { data: commentsRes, isLoading } = useQuery({
    queryKey: ["publication-comments"],
    queryFn: () => getComments(),
  })

  // Approve/Reject mutation
  const toggleApprovalMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      updateComment(id, { is_approved: isApproved }),
    onSuccess: (res, variables) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to update comment status")
        return
      }
      toast.success(variables.isApproved ? "Comment approved successfully" : "Comment rejected successfully")
      queryClient.invalidateQueries({ queryKey: ["publication-comments"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to update comment status")
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to delete comment")
        return
      }
      toast.success("Comment deleted successfully")
      setIsDeleteOpen(false)
      setSelectedComment(null)
      queryClient.invalidateQueries({ queryKey: ["publication-comments"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to delete comment")
    },
  })

  // Handlers
  const handleToggleApproval = (comment: ClinicComment) => {
    toggleApprovalMutation.mutate({
      id: comment.id,
      isApproved: !comment.is_approved,
    })
  }

  const handleOpenDelete = (comment: ClinicComment) => {
    setSelectedComment(comment)
    setIsDeleteOpen(true)
  }

  const handleDeleteSubmit = () => {
    if (!selectedComment) return
    deleteMutation.mutate(selectedComment.id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading comments inbox..." />
      </div>
    )
  }

  const comments = commentsRes?.data || []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <MessageSquare className="size-3.5" />
            Moderation Queue
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Comments Moderation
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Review and approve user comments to maintain constructive legal discourse across public resources.
          </p>
        </div>
      </div>

      {/* Table Card */}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center bg-card/30">
          <MessageSquare className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-semibold text-foreground">
            No comments in the queue
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Comments left on your publications will appear here for moderation.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold">Author</TableHead>
                <TableHead className="font-semibold">Comment</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-[180px] text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-medium text-foreground py-4">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {comment.author
                          ? `${comment.author.first_name ?? ""} ${comment.author.last_name ?? ""}`.trim() ||
                            comment.author.username
                          : "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {comment.author?.email || "—"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs md:max-w-md py-4">
                    <p className="text-sm text-foreground line-clamp-3 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden md:table-cell py-4">
                    {new Date(comment.created_at).toLocaleString("en-NG")}
                  </TableCell>
                  <TableCell className="py-4">
                    {comment.is_approved ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 rounded-md px-2 py-0.5">
                        <Check className="size-3" /> Approved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 rounded-md px-2 py-0.5 animate-pulse">
                        <ShieldAlert className="size-3" /> Pending Review
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleApproval(comment)}
                        className={`h-8 rounded-lg font-semibold text-xs transition-all ${
                          comment.is_approved
                            ? "hover:bg-amber-50 dark:hover:bg-amber-950/20 text-zinc-600 dark:text-zinc-400 hover:text-amber-600"
                            : "bg-primary text-primary-foreground hover:bg-primary/95"
                        }`}
                      >
                        {comment.is_approved ? (
                          <>
                            <X className="mr-1 size-3.5" />
                            Reject
                          </>
                        ) : (
                          <>
                            <Check className="mr-1 size-3.5" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(comment)}
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

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-destructive">Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 p-3 rounded-lg border border-border/60 text-xs text-muted-foreground my-2">
            <p className="font-semibold text-foreground mb-1">Comment preview:</p>
            <p className="line-clamp-3 leading-relaxed">{selectedComment?.content}</p>
          </div>
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
