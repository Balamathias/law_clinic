"use client";

import { useState } from "react";
import { Circle, UserPlus, FileText, CheckCircle, Save, Phone, Mail, User, ShieldCheck } from "lucide-react";
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
import type { HelpRequest, User as DBUser } from "@/@types/db";
import { useUpdateHelpRequest } from "@/services/client/help-requests";
import { cn } from "@/lib/utils";

interface HelpRequestTriageProps {
  helpRequest: HelpRequest;
  users: DBUser[];
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "text-amber-500" },
  { value: "in_review", label: "In review", color: "text-blue-500" },
  { value: "assigned", label: "Assigned", color: "text-purple-500" },
  { value: "resolved", label: "Resolved", color: "text-green-500" },
  { value: "closed", label: "Closed", color: "text-gray-400" },
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
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-8 shadow-xs">
          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/60 flex items-center gap-1.5">
              <User className="size-4 text-primary" />
              Contact Information
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full name</p>
                <p className="font-serif text-base font-bold text-foreground">{helpRequest.full_name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email address</p>
                <a 
                  href={`mailto:${helpRequest.email}`}
                  className="font-semibold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5 break-all"
                >
                  <Mail className="size-3.5 text-muted-foreground" />
                  {helpRequest.email}
                </a>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone number</p>
                <a 
                  href={`tel:${helpRequest.phone_number}`}
                  className="font-semibold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Phone className="size-3.5 text-muted-foreground" />
                  {helpRequest.phone_number}
                </a>
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/60 flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              Case Context & Details
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Legal issue type</p>
                <p className="font-serif text-base font-bold text-foreground">{helpRequest.legal_issue_type}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Had previous legal help?</p>
                <p className="font-semibold text-sm text-foreground capitalize inline-flex items-center gap-1.5">
                  <span className={cn(
                    "size-2 rounded-full",
                    helpRequest.had_previous_help === 'yes' ? 'bg-emerald-500' : 'bg-zinc-400'
                  )} />
                  {helpRequest.had_previous_help}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description of issue</p>
              <div className="rounded-2xl border border-border bg-muted/20 px-6 py-5 text-sm text-foreground whitespace-pre-wrap leading-relaxed shadow-xs">
                {helpRequest.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triage side panel */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
          <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
            <CheckCircle className="size-4.5 text-primary" />
            Triage & Workflow
          </h2>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="triage-status" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as HelpRequest["status"]);
                if (v === "assigned" && !assignedTo && staffUsers.length > 0) {
                  setAssignedTo(staffUsers[0].id);
                }
              }}
            >
              <SelectTrigger id="triage-status" className="h-10 rounded-xl border-border focus:ring-primary/20 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <Circle className={cn("size-2 fill-current", opt.color)} />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee Select */}
          <div className="space-y-2">
            <Label htmlFor="triage-assignee" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Staff</Label>
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
              <SelectTrigger id="triage-assignee" className="h-10 rounded-xl border-border focus:ring-primary/20 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card">
                <SelectItem value="unassigned" className="rounded-lg cursor-pointer text-xs font-semibold">Unassigned</SelectItem>
                {staffUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id} className="rounded-lg cursor-pointer text-xs font-semibold">
                    {`${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <Label htmlFor="triage-notes" className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <FileText className="size-3.5 text-muted-foreground" />
              Internal Notes
            </Label>
            <Textarea
              id="triage-notes"
              placeholder="Case updates, contact logs..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={5}
              className="text-xs font-medium rounded-xl border-border focus:ring-primary/20 bg-background leading-relaxed"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-2 h-10 rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs transition-colors"
          >
            <Save className="size-4" />
            {saving ? "Saving changes..." : "Save Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
