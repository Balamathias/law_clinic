'use client'

import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { User as UserIcon, Lock, Save, Sparkles, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUploader } from "@/components/ui/image-uploader"
import {
  getUser,
  updateUser,
  changePassword,
} from "@/services/server/auth"
import Loader from "@/components/loader"
import { parseApiError } from "@/services/server.entry"

export default function ProfilePage() {
  const queryClient = useQueryClient()

  // Profile Form state
  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)

  // Password Form state
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Query Current User
  const { data: userRes, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getUser(),
  })

  const currentUser = userRes?.data || null

  // Sync state with current user query
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      setFirstName(currentUser.first_name || "")
      setLastName(currentUser.last_name || "")
      setPhone(currentUser.phone || "")
      setAvatar(currentUser.avatar || null)
    }
  }, [currentUser])

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to update profile")
        return
      }
      toast.success("Profile updated successfully")
      queryClient.invalidateQueries({ queryKey: ["current-user"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to update profile")
    },
  })

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to change password")
        return
      }
      toast.success("Password changed successfully")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to change password")
    },
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      toast.error("Username is required")
      return
    }
    updateProfileMutation.mutate({
      username,
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
      avatar: avatar || null,
    })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword) {
      toast.error("All password fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    changePasswordMutation.mutate({
      old_password: oldPassword,
      new_password: newPassword,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading your profile..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <UserIcon className="size-3.5" />
            Account Management
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Manage your personal profile details, user privileges, and account security.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Main Panel */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-xl w-full flex justify-start gap-1 mb-6">
              <TabsTrigger value="profile" className="rounded-lg px-4 py-2 text-xs font-semibold">
                <UserIcon className="mr-1.5 size-3.5" />
                Profile Details
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg px-4 py-2 text-xs font-semibold">
                <Lock className="mr-1.5 size-3.5" />
                Security & Passwords
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="focus-visible:outline-none space-y-6">
              <form onSubmit={handleProfileSubmit}>
                <Card className="rounded-xl border border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg font-bold">Personal Information</CardTitle>
                    <CardDescription>
                      Update your name, contact phone, and account handle.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        <ImageUploader
                          value={avatar}
                          onChange={setAvatar}
                          category="avatars"
                          id={currentUser?.id || "user-avatar"}
                          label="Upload Profile Photo"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="username" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="johndoe"
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                        <Input
                          id="email"
                          value={currentUser?.email || ""}
                          disabled
                          className="rounded-lg bg-muted/40 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +2348000000000"
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="rounded-xl px-5 font-semibold text-xs h-10 gap-1.5"
                      >
                        <Save className="size-4" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="focus-visible:outline-none space-y-6">
              <form onSubmit={handlePasswordSubmit}>
                <Card className="rounded-xl border border-border shadow-xs">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg font-bold">Change Password</CardTitle>
                    <CardDescription>
                      Ensure your account remains secure by updating your access password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="oldPass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Password</Label>
                      <Input
                        id="oldPass"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="newPass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Password</Label>
                        <Input
                          id="newPass"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirm New Password</Label>
                        <Input
                          id="confirmPass"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        className="rounded-xl px-5 font-semibold text-xs h-10 gap-1.5"
                      >
                        <Save className="size-4" />
                        {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
          <Card className="rounded-xl border border-border shadow-xs bg-muted/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-semibold">User Role</span>
                <span className="font-semibold text-foreground">
                  {currentUser?.is_superuser ? "Super Admin" : currentUser?.is_staff ? "Clinic Staff" : "User"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-semibold">Active State</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground font-semibold">Date Joined</span>
                <span className="font-semibold text-foreground">
                  {currentUser ? new Date(currentUser.date_joined).toLocaleDateString("en-NG") : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
