"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

type UserHistories = {
  id?: number;
  score?: number;
  updated_at?: string;
  user_id?: string;
};
type EventPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  record: UserHistories;
};

const RealtimeContext = createContext<EventPayload | null>(null);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [latest, setLatest] = useState<EventPayload | null>(null);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const channel = supabase.channel("realtime:user_histories");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_histories" },
        (payload) => {
          setLatest({ eventType: "INSERT", record: payload.new });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_histories" },
        (payload) => {
          setLatest({ eventType: "UPDATE", record: payload.new });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "user_histories" },
        (payload) => {
          setLatest({ eventType: "DELETE", record: payload.old });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <RealtimeContext.Provider value={latest}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  return useContext(RealtimeContext);
}
