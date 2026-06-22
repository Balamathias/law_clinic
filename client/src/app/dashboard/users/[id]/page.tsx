'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit2, User as UserIcon, Calendar, ShieldCheck, Mail, Phone, Clock, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/services/client/users'
import { Badge } from '@/components/ui/badge'

const ViewUserPage = () => {
  const { id } = useParams() as { id: string }
  const { data: userRes, isLoading } = useUser(id)
  const user = userRes?.data

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getUserRole = () => {
    if (!user) return 'User'
    if (user.is_superuser) return 'Super Admin'
    if (user.is_staff) return 'Staff'
    return 'User'
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard/users">
            <ArrowLeft className="h-4 w-4" /> 
            Back to Users
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border">
        <CardHeader className="bg-muted/50 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <UserIcon className="size-8 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-serif font-bold">
                  {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : 'User Details'}
                </CardTitle>
                <div className="flex flex-wrap gap-2 items-center">
                  {user && (
                    <>
                      <Badge variant={user.is_active ? 'success' : 'destructive'} className="text-[10px] font-semibold uppercase tracking-wider">
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider border-primary/30 text-primary">
                        {getUserRole()}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {user && (
              <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-4 h-9 self-start sm:self-center gap-1.5 shadow-xs">
                <Link href={`/dashboard/users/${user.id}/edit`}>
                  <Edit2 className="size-3.5" />
                  Edit User
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          {isLoading || !user ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="grid gap-8">
              {/* Profile Details Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <UserIcon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Username</span>
                    <span className="text-sm font-semibold text-foreground">{user.username}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Mail className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-semibold text-foreground break-all">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <BadgeCheck className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">First Name</span>
                    <span className="text-sm font-semibold text-foreground">{user.first_name || '—'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <BadgeCheck className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Last Name</span>
                    <span className="text-sm font-semibold text-foreground">{user.last_name || '—'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Calendar className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Date Joined</span>
                    <span className="text-sm font-semibold text-foreground">{formatDate(user.date_joined)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Clock className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Last Login</span>
                    <span className="text-sm font-semibold text-foreground">{formatDate(user.last_login)}</span>
                  </div>
                </div>
              </div>

              {/* Permissions & Security Section */}
              <div className="rounded-xl border p-6 space-y-4 bg-muted/10">
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  System Permissions & Security
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Account</span>
                    <span className="text-xs font-semibold">{user.is_active ? 'Yes - Account is enabled' : 'No - Account is disabled'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Staff Status</span>
                    <span className="text-xs font-semibold">{user.is_staff ? 'Yes - Staff permissions granted' : 'No - Normal user permissions'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Superuser Privilege</span>
                    <span className="text-xs font-semibold">{user.is_superuser ? 'Yes - Full administrative control' : 'No - Standard control'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ViewUserPage
