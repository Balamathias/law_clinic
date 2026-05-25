"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Circle, UserPlus, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HelpRequest, User } from "@/@types/db";
import { partialUpdateHelpRequest } from "@/services/server/help-requests";

interface HelpRequestTriageProps {
  helpRequest: HelpRequest;
  users: User[];
}

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In review" },
  { value: "assigned", label: "Assigned" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function HelpRequestTriage({
  helpRequest,
  users,
}: HelpRequestTriageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<HelpRequest["status"]>(helpRequest.status);
  const [assignedTo, setAssignedTo] = useState<string | null>(helpRequest.assigned_to);
  const [internalNotes, setInternalNotes] = useState(helpRequest.internal_notes ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await partialUpdateHelpRequest(helpRequest.id, {
        status,
        assigned_to: assignedTo || null,
        internal_notes: internalNotes || null,
      } as any);

      if (res?.data) {
        toast.success("Help request updated successfully");
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update help request");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Only show active staff/superusers for assignment
  const staffUsers = users.filter((u) => u.is_active && (u.is_staff || u.is_superuser));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Help Request details */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Information
            </span>
            <div className="mt-2 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Full name</p>
                <p className="font-medium text-foreground mt-0.5">{helpRequest.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground mt-0.5">{helpRequest.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone number</p>
                <p className="font-medium text-foreground mt-0.5">{helpRequest.phone_number}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Case Details
            </span>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Legal issue type</p>
                <p className="font-medium text-foreground mt-0.5">{helpRequest.legal_issue_type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Had previous legal help?</p>
                <p className="font-medium text-foreground mt-0.5 capitalize">
                  {helpRequest.had_previous_help}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground font-medium">Description of issue</p>
              <div className="mt-1.5 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-small text-ink whitespace-pre-wrap leading-relaxed">
                {helpRequest.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triage side panel */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-semibold text-foreground flex items-center gap-2 text-base">
            <CheckCircle className="size-4.5 text-primary" />
            Triage & Workflow
          </h2>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="triage-status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as HelpRequest["status"]);
                // If moving to assigned, auto set assigned if none selected yet
                if (v === "assigned" && !assignedTo && staffUsers.length > 0) {
                  setAssignedTo(staffUsers[0].id);
                }
              }}
            >
              <SelectTrigger id="triage-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <Circle
                        className={`size-2 fill-current ${
                          opt.value === "new"
                            ? "text-amber-500"
                            : opt.value === "in_review"
                            ? "text-blue-500"
                            : opt.value === "assigned"
                            ? "text-purple-500"
                            : opt.value === "resolved"
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee Select */}
          <div className="space-y-2">
            <Label htmlFor="triage-assignee">Assigned Staff</Label>
            <Select
              value={assignedTo ?? "unassigned"}
              onValueChange={(v) => {
                const value = v === "unassigned" ? null : v;
                setAssignedTo(value);
                if (value && status === "new") {
                  setStatus("assigned");
                } else if (!value && status === "assigned") {
                  setStatus("in_review");
                }
              }}
            >
              <SelectTrigger id="triage-assignee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {staffUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {`${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <Label htmlFor="triage-notes" className="flex items-center gap-1.5">
              <FileText className="size-3.5" />
              Internal Notes
            </Label>
            <Textarea
              id="triage-notes"
              placeholder="Case updates, internal assignments, contact log..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={6}
              className="text-small"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-2"
          >
            {saving ? "Saving changes..." : "Save details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
