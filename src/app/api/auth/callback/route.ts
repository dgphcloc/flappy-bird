import { NextResponse } from "next/server";
import createSupabaseServerClient from "@/lib/supabase/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { v4 as uuidv4 } from "uuid";
/**
 * Because the trigger is not used, this should be used instead
 */
const makeProfileForUser = async (id: string) => {
  const supbabse = await createSupabaseAdminAuthClient();
  const { data, error } = await supbabse.from("profiles").upsert({
    id: id,
    username: uuidv4(),
  });
  console.log("user profile", data, error);
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
      await makeProfileForUser(user.id);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  /**
   * hanlde error
   */
  return NextResponse.redirect(`${origin}/api/auth/auth-code-error?message=`);
}
