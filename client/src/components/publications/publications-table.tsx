'use client'

import { Publication } from '@/@types/db'
import React, { useState } from 'react'
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  publications: Publication[],
  count: number,
  pageSize?: number
}

const PublicationsTable = ({ publications, count, pageSize = 10 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null)
  
  const totalPages = Math.ceil(count / pageSize)

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handlePublicationAction = (publication: Publication, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/publications/${publication.id}`)
        break
      case 'edit':
        router.push(`/dashboard/publications/${publication.id}/edit`)
        break
      case 'delete':
        setPublicationToDelete(publication)
        break
    }
  }

  const handleDeleteConfirm = async () => {
    if (!publicationToDelete) return
    
    try {
      // API call to delete publication would go here
      // await deletePublication(publicationToDelete.id)
      console.log(`Deleting publication: ${publicationToDelete.id}`)
      setPublicationToDelete(null)
      // Refresh data or show success message
    } catch (error) {
      console.error('Failed to delete publication:', error)
      // Show error message
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength = 70) => {
    if (text?.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (publications?.length === 0) {
    return (
      <Card className="w-full p-12 text-center bg-background/50">
        <div className="flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No publications found</h3>
          <p className="text-sm text-muted-foreground">
            There are no publications to display at the moment.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <Table>
        <TableCaption>List of publications in the system</TableCaption>
        <TableHeader>
          <TableRow className="bg-secondary/20 hover:bg-secondary/30 dark:bg-muted/50 dark:hover:bg-muted/60">
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Published</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publications?.map((publication) => (
            <TableRow key={publication.id} className="hover:bg-muted/30 transition-all duration-150">
              <TableCell className="py-4 font-medium">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 border shadow-sm rounded-md shrink-0">
                    <AvatarImage 
                      src={publication.featured_image || ''} 
                      alt={publication.title} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary rounded-md">
                      <FileText className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium leading-tight mb-1">
                      {publication.title}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {publication.excerpt ? truncateText(publication.excerpt) : truncateText(publication.content?.replace(/<[^>]*>/g, ''))}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {publication.category_name ? (
                  <Badge variant="outline" className="bg-secondary/30 hover:bg-secondary/40">
                    {publication.category_name}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Uncategorized</span>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm">{publication.author?.email || "Unknown"}</span>
              </TableCell>
              <TableCell>
                <Badge variant={publication.status === 'published' ? "default" : "outline"} 
                  className={`${publication.status === 'published' 
                    ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400 border border-green-300/30' 
                    : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 border border-amber-300/30'}`}
                >
                  {publication.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                {publication.status === 'published' ? (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(publication.published_at)}
                  </div>
                ) : (
                  "Not published"
                )}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] animate-in zoom-in-50 duration-200">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handlePublicationAction(publication, 'view')}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Article</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePublicationAction(publication, 'edit')}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Article</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handlePublicationAction(publication, 'delete')}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * pageSize, count)}</span> of{' '}
            <span className="font-medium">{count}</span> publications
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="flex items-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!publicationToDelete} onOpenChange={() => setPublicationToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the publication{' '}
              <span className="font-medium">
                "{publicationToDelete?.title}"
              </span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPublicationToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PublicationsTable
