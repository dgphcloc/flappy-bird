import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import useSupabaseClient from "@/lib/supabase/client";

function useCurrentUser() {
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

  return user;
}

export default useCurrentUser;
