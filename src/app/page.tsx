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
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  };
  const loginWithFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
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
