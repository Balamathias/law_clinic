"use client";

import { useState } from "react";
import { Circle, UserPlus, FileText, CheckCircle, Save } from "lucide-react";
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
import { useUpdateHelpRequest } from "@/services/client/help-requests";

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
  const [status, setStatus] = useState<HelpRequest["status"]>(helpRequest.status);
  const [assignedTo, setAssignedTo] = useState<string | null>(helpRequest.assigned_to);
  const [internalNotes, setInternalNotes] = useState(helpRequest.internal_notes ?? "");

  const { mutate: updateRequest, isPending: saving } = useUpdateHelpRequest();

  const handleSave = () => {
    updateRequest({
      id: helpRequest.id,
      payload: {
        status,
        assigned_to: assignedTo || null,
        internal_notes: internalNotes || null,
      },
      partial: true
    });
  };

  const staffUsers = users.filter((u) => u.is_active && (u.is_staff || u.is_superuser));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Help Request details */}
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 p-6 space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Contact Information
            </span>
            <div className="mt-3 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Full name</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 mt-1">{helpRequest.full_name}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 mt-1">{helpRequest.email}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Phone number</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 mt-1">{helpRequest.phone_number}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Case Details
            </span>
            <div className="mt-3 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Legal issue type</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 mt-1">{helpRequest.legal_issue_type}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Had previous legal help?</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 mt-1 capitalize">
                  {helpRequest.had_previous_help}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Description of issue</p>
              <div className="mt-2 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-900/10 px-5 py-4 text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                {helpRequest.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triage side panel */}
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 p-6 space-y-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 text-base">
            <CheckCircle className="size-4.5 text-primary" />
            Triage & Workflow
          </h2>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="triage-status" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as HelpRequest["status"]);
                if (v === "assigned" && !assignedTo && staffUsers.length > 0) {
                  setAssignedTo(staffUsers[0].id);
                }
              }}
            >
              <SelectTrigger id="triage-status" className="h-10 rounded-lg">
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
            <Label htmlFor="triage-assignee" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Assigned Staff</Label>
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
              <SelectTrigger id="triage-assignee" className="h-10 rounded-lg">
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
            <Label htmlFor="triage-notes" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <FileText className="size-3.5 text-zinc-400" />
              Internal Notes
            </Label>
            <Textarea
              id="triage-notes"
              placeholder="Case updates, contact logs..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={5}
              className="text-sm rounded-lg"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-2 h-10 rounded-lg gap-2"
          >
            <Save className="size-4" />
            {saving ? "Saving changes..." : "Save Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
