"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarCheck2, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event, User } from "@/@types/db";
import { registerForEvent, unregisterFromEvent } from "@/services/server/events";

interface EventRegisterButtonProps {
  event: Event;
  currentUser: User | null;
  isRegisteredInitial: boolean;
}

export function EventRegisterButton({
  event,
  currentUser,
  isRegisteredInitial,
}: EventRegisterButtonProps) {
  const router = useRouter();
  const [registered, setRegistered] = useState(isRegisteredInitial);
  const [loading, setLoading] = useState(false);

  if (!currentUser) {
    return (
      <Button asChild className="w-full">
        <a href={`/login?next=/events/${event.slug}`}>
          <CalendarCheck2 className="size-4" />
          Log in to register
        </a>
      </Button>
    );
  }

  // Check if registration deadline has passed or if event is full
  const deadlinePassed =
    event.registration_deadline && new Date(event.registration_deadline) < new Date();
  const isFull =
    event.max_participants > 0 &&
    (event.registration_count ?? 0) >= event.max_participants;

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await registerForEvent(event.slug);
      if (res?.data) {
        setRegistered(true);
        toast.success("Successfully registered for event!");
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to register for event");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    setLoading(true);
    try {
      const res = await unregisterFromEvent(event.slug);
      if (res?.status === 200 || res?.status === 204 || !res?.error) {
        setRegistered(false);
        toast.success("Successfully cancelled registration");
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to cancel registration");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg bg-green-50 border border-green-200 p-3.5 text-center text-small font-medium text-green-800 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400">
          ✓ You are registered for this event
        </div>
        <Button
          onClick={handleUnregister}
          disabled={loading}
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <LogOut className="size-4" />
              Cancel registration
            </>
          )}
        </Button>
      </div>
    );
  }

  if (event.status === "cancelled") {
    return (
      <Button disabled className="w-full" variant="secondary">
        Event Cancelled
      </Button>
    );
  }

  if (event.status === "completed") {
    return (
      <Button disabled className="w-full" variant="secondary">
        Event Completed
      </Button>
    );
  }

  if (deadlinePassed) {
    return (
      <Button disabled className="w-full" variant="secondary">
        Registration Closed (Deadline passed)
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button disabled className="w-full" variant="secondary">
        Event Full (Capacity reached)
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={loading}
      className="w-full"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <CalendarCheck2 className="size-4" />
          Register for event
        </>
      )}
    </Button>
  );
}
