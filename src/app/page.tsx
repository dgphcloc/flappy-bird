"use client";
import Profile from "@/components/profile";

import { Button } from "@mantine/core";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loginWithGoogle = async () => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${currentUrl}/api/auth/callback`,
      },
    });
  };
  const loginWithFacebook = async () => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${currentUrl}/api/auth/callback`,
      },
    });
  };
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <Button onClick={loginWithGoogle}>google</Button>
      <Button onClick={loginWithFacebook}>facebook</Button>

      <Button onClick={logout}>log out</Button>
      <Profile />
    </>
  );
}
