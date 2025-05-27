"use client";

import { useEffect, useState, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import useSupabaseClient from "@/lib/supabase/client";
/**
 * const user = useCurrentUser(['id', 'email']);
 * user has type  { id: string; email: string } | null
 */
function useCurrentUser(): User | null;
function useCurrentUser<T extends keyof User>(
  select: T[]
): Pick<User, T> | null;
function useCurrentUser(select?: Array<keyof User>) {
  const supabase = useSupabaseClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
      } catch (error) {
        console.error("Auth state change error:", error);
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const selectedUser = useMemo(() => {
    if (!user) return null;
    if (select) {
      return pick(user, select);
    }
    return user;
  }, [user, select]);

  return selectedUser;
}

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);
}

export default useCurrentUser;
