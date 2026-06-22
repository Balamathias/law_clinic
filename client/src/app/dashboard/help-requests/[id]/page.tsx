'use client'

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, FileClock } from "lucide-react";
import { HelpRequestTriage } from "@/components/dashboard/help-requests/help-request-triage";
import { useHelpRequest } from "@/services/client/help-requests";
import { useUsers } from "@/services/client/users";
import Loader from "@/components/loader";

export default function HelpRequestDetailPage() {
  const { id } = useParams() as { id: string };

  const { data: reqRes, isLoading: isRequestLoading } = useHelpRequest(id);
  const { data: usersRes, isLoading: isUsersLoading } = useUsers({
    params: { is_staff: true, is_active: true }
  });

  if (isRequestLoading || isUsersLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading request details..." />
      </div>
    );
  }

  const helpRequest = reqRes?.data;
  if (!helpRequest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <h1 className="text-2xl font-serif font-bold">Help Request Not Found</h1>
        <p className="text-muted-foreground text-sm">The requested help request could not be found.</p>
        <Link 
          href="/dashboard/help-requests" 
          className="inline-flex items-center justify-center py-2 px-4 border border-border hover:bg-muted/40 transition-colors rounded-xl text-xs font-bold text-foreground"
        >
          Return to inbox
        </Link>
      </div>
    );
  }

  const users = usersRes?.data ?? [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      <div className="space-y-3.5 border-b border-border/40 pb-6">
        <Link
          href="/dashboard/help-requests"
          className="group inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Inbox
        </Link>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <FileClock className="size-3.5" />
              Intake Case File
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Case Request: {helpRequest.full_name.split(' ')[0]}
            </h1>
            <p className="text-xs text-muted-foreground font-semibold inline-flex items-center gap-1.5 mt-1">
              <Calendar className="size-3.5" />
              Submitted {new Date(helpRequest.created_at).toLocaleString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        </div>
      </div>

      <HelpRequestTriage helpRequest={helpRequest} users={users} />
    </div>
  );
}
