'use client'

import { User } from '@/@types/db'
import React, { useState } from 'react'
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteUser } from '@/services/client/users'
import { cn } from "@/lib/utils"

interface Props {
  users: User[],
  count: number,
  pageSize?: number
}

const UsersTable = ({ users, count, pageSize = 10 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()
  const totalPages = Math.ceil(count / pageSize)

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleUserAction = (user: User, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/users/${user.id}`)
        break
      case 'edit':
        router.push(`/dashboard/users/${user.id}/edit`)
        break
      case 'delete':
        setUserToDelete(user)
        break
    }
  }

  const handleDeleteConfirm = () => {
    if (!userToDelete) return
    deleteUser(userToDelete.id, {
      onSuccess: () => {
        setUserToDelete(null)
      }
    })
  }

  const getInitials = (user: User) => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadge = (user: User) => {
    if (user.is_superuser) {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg">
          Admin
        </Badge>
      )
    }
    if (user.is_staff) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg">
          Staff
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-zinc-500/10 text-zinc-750 dark:text-zinc-450 border-zinc-550/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg">
        User
      </Badge>
    )
  }

  if (users.length === 0) {
    return (
      <div className="w-full p-12 text-center border border-dashed border-border bg-muted/20 rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">No users found</h3>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            There are no users to display at the moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[280px] font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5 pl-6">User</TableHead>
            <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Email</TableHead>
            <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Status</TableHead>
            <TableHead className="hidden md:table-cell font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Role</TableHead>
            <TableHead className="hidden lg:table-cell font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Joined</TableHead>
            <TableHead className="hidden lg:table-cell font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Last Active</TableHead>
            <TableHead className="text-right font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="group border-b border-border/80 hover:bg-muted/40 transition-colors duration-150">
              <TableCell className="py-3.5 font-medium pl-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border rounded-xl shrink-0 overflow-hidden shadow-xs">
                    <AvatarImage className='object-cover' src={user.avatar || ''} alt={`${user.first_name || ''} ${user.last_name || ''}`} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-xs rounded-xl">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-serif text-sm font-bold leading-snug mb-0.5 text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => handleUserAction(user, 'view')}>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}` 
                        : user.username || user.email.split('@')[0]}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-semibold">
                      @{user.username || '—'}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="py-3.5 text-xs text-muted-foreground font-semibold">
                {user.email}
              </TableCell>
              
              <TableCell className="py-3.5">
                <Badge variant="outline" 
                  className={cn(
                    "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                    user.is_active 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                  )}
                >
                  <span className={cn("size-1.5 rounded-full mr-1.5 shrink-0", user.is_active ? "bg-emerald-500" : "bg-rose-500")} />
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              
              <TableCell className="hidden md:table-cell py-3.5">
                {getRoleBadge(user)}
              </TableCell>
              
              <TableCell className="hidden lg:table-cell text-muted-foreground text-xs py-3.5 font-semibold">
                {formatDate(user.date_joined)}
              </TableCell>
              
              <TableCell className="hidden lg:table-cell text-muted-foreground text-xs py-3.5 font-semibold">
                {formatDate(user.last_login)}
              </TableCell>
              
              <TableCell className="text-right py-3.5 pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-xl hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px] rounded-2xl border-border shadow-md bg-card">
                    <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-2.5 py-1.5">User Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => handleUserAction(user, 'view')}
                      className="cursor-pointer font-semibold text-xs rounded-xl py-1.5 px-2.5"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>View User</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUserAction(user, 'edit')}
                      className="cursor-pointer font-semibold text-xs rounded-xl py-1.5 px-2.5"
                    >
                      <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>Edit User</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      onClick={() => handleUserAction(user, 'delete')}
                      className="text-rose-600 focus:text-rose-600 cursor-pointer font-semibold text-xs rounded-xl py-1.5 px-2.5"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      <span>Delete User</span>
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
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/20">
          <div className="text-xs text-muted-foreground font-semibold">
            Showing <span className="text-foreground">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="text-foreground">{Math.min(currentPage * pageSize, count)}</span> of{' '}
            <span className="text-foreground">{count}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 rounded-xl border-border hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-xs font-bold text-muted-foreground px-1">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 rounded-xl border-border hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-base font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
              Are you sure you want to delete the user{' '}
              <span className="font-bold text-foreground">
                {userToDelete?.first_name && userToDelete?.last_name 
                  ? `${userToDelete.first_name} ${userToDelete.last_name}` 
                  : userToDelete?.email}
              </span>?
              This action cannot be undone and will permanently remove this user account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setUserToDelete(null)} disabled={isDeleting} className="rounded-xl font-bold text-xs h-8 border-border">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting} className="rounded-xl font-bold text-xs h-8 bg-rose-600 hover:bg-rose-500 text-white">
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UsersTable