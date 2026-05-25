import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { HelpRequestTriage } from "@/components/dashboard/help-requests/help-request-triage";
import { getHelpRequest } from "@/services/server/help-requests";
import { getUsers } from "@/services/server/users";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getHelpRequest(id);
  return {
    title: res.data
      ? `Triage: ${res.data.full_name} | ABU Law Clinic`
      : "Help Request Details | ABU Law Clinic",
  };
}

export default async function HelpRequestDetailPage({ params }: Props) {
  const { id } = await params;

  const [reqRes, usersRes] = await Promise.all([
    getHelpRequest(id),
    getUsers({ params: { is_staff: true, is_active: true } }),
  ]);

  if (!reqRes.data) notFound();

  const helpRequest = reqRes.data;
  const users = usersRes.data ?? [];

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
