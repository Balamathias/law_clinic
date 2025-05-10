import React from 'react'
import EditUserForm from '@/components/users/edit-user-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { getUser } from '@/services/server/users'

interface Props {
    params: Promise<{id: string}>,
    searchParams: Promise<Record<string, any>>,
}

const EditUserPage = async ({ params: _params, searchParams }: Props) => {
  const { id } = await _params
  const { data: user } = await getUser(id)

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
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Edit User
            {user && <span className="text-muted-foreground font-normal">- {user.email}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-1/3 mt-6" />
            </div>
          ) : (
            <EditUserForm user={user} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EditUserPage
