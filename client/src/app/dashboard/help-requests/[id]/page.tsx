'use client'

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
        <h1 className="text-2xl font-semibold">Help Request Not Found</h1>
        <p className="text-muted-foreground">The requested help request could not be found.</p>
        <Link href="/dashboard/help-requests" className="text-primary hover:underline">Return to inbox</Link>
      </div>
    );
  }

  const users = usersRes?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/help-requests"
          className="inline-flex items-center gap-1 text-small text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-3.5" />
          Inbox
        </Link>
        <h1 className="mt-2 text-h3 font-semibold text-foreground">
          Help Request
        </h1>
        <p className="mt-1 text-small text-muted-foreground">
          Submitted on {new Date(helpRequest.created_at).toLocaleString("en-NG")}
        </p>
      </div>

      <HelpRequestTriage helpRequest={helpRequest} users={users} />
    </div>
  );
}
