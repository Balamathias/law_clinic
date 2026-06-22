'use client'

import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Info, Save, Settings, Landmark, FileText, Target } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUploader } from "@/components/ui/image-uploader"
import {
  getAppData,
  createAppData,
  updateAppData,
} from "@/services/server/app_settings"
import { AppData } from "@/@types/db"
import Loader from "@/components/loader"
import { parseApiError } from "@/services/server.entry"

export default function AppDataPage() {
  const queryClient = useQueryClient()

  // Form states
  const [name, setName] = useState("")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [missionStatement, setMissionStatement] = useState("")
  const [visionStatement, setVisionStatement] = useState("")
  const [objectives, setObjectives] = useState("")
  const [history, setHistory] = useState("")

  // Fetch App Data
  const { data: appDataRes, isLoading } = useQuery({
    queryKey: ["app-data"],
    queryFn: () => getAppData(),
  })

  const appDataList = appDataRes?.data || []
  const currentAppData = appDataList[0] || null

  // Sync state with query result
  useEffect(() => {
    if (currentAppData) {
      setName(currentAppData.name)
      setLogoUrl(currentAppData.logo_url)
      setMissionStatement(currentAppData.mission_statement)
      setVisionStatement(currentAppData.vision_statement)
      setObjectives(currentAppData.objectives || "")
      setHistory(currentAppData.history || "")
    }
  }, [currentAppData])

  // Create mutation (if no data exists yet)
  const createMutation = useMutation({
    mutationFn: createAppData,
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to initialize app settings")
        return
      }
      toast.success("Settings initialized successfully")
      queryClient.invalidateQueries({ queryKey: ["app-data"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to initialize settings")
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateAppData(id, payload),
    onSuccess: (res) => {
      if (res.status >= 400) {
        toast.error(res.message || "Failed to update settings")
        return
      }
      toast.success("Settings saved successfully")
      queryClient.invalidateQueries({ queryKey: ["app-data"] })
    },
    onError: (err: any) => {
      toast.error(parseApiError(err) || "Failed to save settings")
    },
  })

  const handleInitialize = () => {
    createMutation.mutate({
      name: "Law Clinic",
      mission_statement: "To provide quality legal aid and clinical education.",
      vision_statement: "To become a world class clinical program.",
      objectives: "Legal aid, education, research",
      history: "Founded to bridge classroom learning and community aid.",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Clinic name is required")
      return
    }

    const payload = {
      name,
      logo_url: logoUrl,
      mission_statement: missionStatement,
      vision_statement: visionStatement,
      objectives: objectives || null,
      history: history || null,
    }

    if (currentAppData) {
      updateMutation.mutate({
        id: currentAppData.id,
        payload,
      })
    } else {
      createMutation.mutate(payload)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading clinic settings..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Settings className="size-3.5" />
            General Settings
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Clinic Configurations
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Configure public identity parameters, statement documents, goals, and history profiles.
          </p>
        </div>
      </div>

      {!currentAppData && !isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center bg-card/30">
          <Info className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-semibold text-foreground">
            No configurations exist
          </p>
          <p className="mt-1 text-sm text-muted-foreground mb-6">
            Settings must be initialized to display info on the main site.
          </p>
          <Button onClick={handleInitialize} disabled={createMutation.isPending} className="rounded-xl px-6">
            {createMutation.isPending ? "Initializing..." : "Initialize App Data"}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-4">
            {/* Tabs control */}
            <div className="md:col-span-3 space-y-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-xl w-full flex justify-start gap-1 mb-6">
                  <TabsTrigger value="general" className="rounded-lg px-4 py-2 text-xs font-semibold">
                    <Landmark className="mr-1.5 size-3.5" />
                    Identity
                  </TabsTrigger>
                  <TabsTrigger value="vision" className="rounded-lg px-4 py-2 text-xs font-semibold">
                    <Target className="mr-1.5 size-3.5" />
                    Mission & Vision
                  </TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg px-4 py-2 text-xs font-semibold">
                    <FileText className="mr-1.5 size-3.5" />
                    Objectives & History
                  </TabsTrigger>
                </TabsList>

                {/* Identity Tab */}
                <TabsContent value="general" className="focus-visible:outline-none space-y-6">
                  <Card className="rounded-xl border border-border shadow-xs">
                    <CardHeader>
                      <CardTitle className="font-serif text-lg font-bold">Identity & Logos</CardTitle>
                      <CardDescription>
                        Set the name and brand image for this Legal Aid Clinic.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="logo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Logo Image</Label>
                        <ImageUploader
                          value={logoUrl}
                          onChange={setLogoUrl}
                          category="gallery"
                          id={currentAppData?.id || "clinic-data"}
                          label="Select clinic logo"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clinic / Portal Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Legal Aid Clinic"
                          className="rounded-lg"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Mission & Vision Tab */}
                <TabsContent value="vision" className="focus-visible:outline-none space-y-6">
                  <Card className="rounded-xl border border-border shadow-xs">
                    <CardHeader>
                      <CardTitle className="font-serif text-lg font-bold">Guiding Principles</CardTitle>
                      <CardDescription>
                        State the primary mission and vision of the legal clinical operations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="mission" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mission Statement</Label>
                        <Textarea
                          id="mission"
                          value={missionStatement}
                          onChange={(e) => setMissionStatement(e.target.value)}
                          placeholder="What is the mission of this clinic..."
                          className="rounded-lg min-h-[120px]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="vision" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vision Statement</Label>
                        <Textarea
                          id="vision"
                          value={visionStatement}
                          onChange={(e) => setVisionStatement(e.target.value)}
                          placeholder="What is the vision of this clinic..."
                          className="rounded-lg min-h-[120px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* History & Objectives Tab */}
                <TabsContent value="history" className="focus-visible:outline-none space-y-6">
                  <Card className="rounded-xl border border-border shadow-xs">
                    <CardHeader>
                      <CardTitle className="font-serif text-lg font-bold">Clinic Archives</CardTitle>
                      <CardDescription>
                        Set key objectives and the historical narrative.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="objectives" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Objectives (Comma-separated)
                        </Label>
                        <Textarea
                          id="objectives"
                          value={objectives}
                          onChange={(e) => setObjectives(e.target.value)}
                          placeholder="Legal Aid, Clinical Education, Human Rights advocacy..."
                          className="rounded-lg min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="history" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clinic History</Label>
                        <Textarea
                          id="history"
                          value={history}
                          onChange={(e) => setHistory(e.target.value)}
                          placeholder="Narrative historical background of the clinic..."
                          className="rounded-lg min-h-[150px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar save action */}
            <div className="space-y-4">
              <Card className="rounded-xl border border-border shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Publishing</CardTitle>
                  <CardDescription className="text-xs">
                    Save values to update the main site layout immediately.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="w-full rounded-xl bg-primary text-primary-foreground font-semibold text-xs py-2.5 h-10 flex items-center justify-center gap-1.5"
                  >
                    <Save className="size-4" />
                    {updateMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
