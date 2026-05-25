import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getHelpRequests, getHelpRequestsStats } from "@/services/server/help-requests";

export const metadata: Metadata = {
  title: "Help Requests Inbox | ABU Law Clinic",
  description: "Manage incoming legal help requests.",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-500",
  in_review: "bg-blue-500",
  assigned: "bg-purple-500",
  resolved: "bg-green-500",
  closed: "bg-gray-400",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  in_review: "secondary",
  assigned: "outline",
  resolved: "outline",
  closed: "outline",
};

interface Props {
  searchParams: Promise<Record<string, any>>;
}

export default async function HelpRequestsPage({ searchParams: _sp }: Props) {
  const searchParams = await _sp;

  const [helpRequests, stats] = await Promise.all([
    getHelpRequests({ params: searchParams }),
    getHelpRequestsStats(),
  ]);

  const s = stats.data;
  const requests = helpRequests.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h3 font-semibold text-foreground">
            Help Requests Inbox
          </h1>
          <p className="mt-1 text-small text-muted-foreground">
            {s?.total ?? 0} total · {s?.new ?? 0} new · {s?.in_review ?? 0} in review
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-5">
        {[
          { label: "Total", value: s?.total ?? 0 },
          { label: "New", value: s?.new ?? 0, color: "text-amber-600" },
          { label: "In review", value: s?.in_review ?? 0, color: "text-blue-600" },
          { label: "Assigned", value: s?.assigned ?? 0, color: "text-purple-600" },
          { label: "Resolved", value: s?.resolved ?? 0, color: "text-green-600" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-small text-muted-foreground">{card.label}</p>
            <p className={`mt-1 text-h4 font-semibold ${card.color ?? ""}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Inbox list */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Inbox className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-medium text-muted-foreground">
            Inbox is empty
          </p>
          <p className="mt-1 text-small text-muted-foreground">
            New help requests will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {requests.map((req) => (
            <Link
              key={req.id}
              href={`/dashboard/help-requests/${req.id}`}
              className="flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group"
            >
              <span className="mt-1.5 shrink-0">
                <Circle
                  className={`size-2.5 fill-current ${
                    STATUS_COLORS[req.status]?.replace("bg-", "text-") ??
                    "text-gray-400"
                  }`}
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {req.full_name}
                  </span>
                  <Badge variant={STATUS_VARIANTS[req.status] ?? "outline"}>
                    {req.status.replace("_", " ")}
                  </Badge>
                  {req.assigned_to_name && (
                    <span className="text-xs text-muted-foreground">
                      → {req.assigned_to_name}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-small text-muted-foreground">
                  <span className="font-medium text-foreground/70">
                    {req.legal_issue_type}
                  </span>{" "}
                  · {req.email} · {req.phone_number}
                </p>
                <p className="mt-1 text-small text-muted-foreground line-clamp-2">
                  {req.description}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(req.created_at).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
