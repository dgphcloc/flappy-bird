"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
type ProfileRecord = {
  id?: string;
  updated_at?: string;
  username?: string;
  avatar_url?: string;
  score?: number;
};
type ProfileEventPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  record: ProfileRecord;
};

const ProfileRealtimeContext = createContext<ProfileEventPayload | null>(null);

export function ProfileSubscriptionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [latestProfileEvent, setLatestProfileEvent] =
    useState<ProfileEventPayload | null>(null);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const channel = supabase.channel("realtime:profile");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          setLatestProfileEvent({ eventType: "INSERT", record: payload.new });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          setLatestProfileEvent({ eventType: "UPDATE", record: payload.new });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "profiles" },
        (payload) => {
          setLatestProfileEvent({ eventType: "DELETE", record: payload.old });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <ProfileRealtimeContext.Provider value={latestProfileEvent}>
      {children}
    </ProfileRealtimeContext.Provider>
  );
}

export function useProfileRealtime() {
  return useContext(ProfileRealtimeContext);
}
