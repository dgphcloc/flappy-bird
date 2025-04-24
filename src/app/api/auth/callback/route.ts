import { NextResponse } from "next/server";
import createSupabaseServerClient from "@/lib/supabase/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { User } from "@supabase/supabase-js";
/**
 * Because the trigger is not used, this should be used instead
 */
const makeProfileForGoogleUser = async (user: User) => {
  const supbabse = await createSupabaseAdminAuthClient();
  await supbabse.from("profiles").upsert({
    id: user.id,
    username: user.user_metadata.name,
  });
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/Game";
  if (code) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      await makeProfileForGoogleUser(user);
      console.log("USER GOOGLE", user.user_metadata.full_name);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  /**
   * hanlde error
   */
  return NextResponse.redirect(`${origin}/api/auth/auth-code-error?message=`);
}
