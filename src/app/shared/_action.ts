import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import createSupabaseServerClient from "@/lib/supabase/server";

export type SignInUsernameInput = {
  password: string;
  username: string;
};
export type SignUpWithUsernameInput = {
  password: string;
  passwordConfirm: string;
  username: string;
};
export async function signInWithUsernameAndPassword(user: SignInUsernameInput) {
  const supabaseAdmin = await createSupabaseAdminAuthClient();
  const supabaseClient = await createSupabaseServerClient();
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username", user.username)
    .single();
  if (!data) {
    throw new Error("Invalid username or password");
  }
  const record = supabaseAdmin.auth.admin.getUserById(data.id);
  if (!record) {
    throw new Error("");
  }
  const result = await supabaseClient.auth.signInWithPassword({
    email: (await record).data.user?.email as string,
    password: user.password,
  });
  return JSON.stringify(result);
}

export async function signUpWithUsernameAndPassword({
  data,
  emailRedirectTo,
}: {
  data: SignUpWithUsernameInput & { email: string };
  emailRedirectTo?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const signUpResult = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo,
    },
  });
  if (signUpResult.error) {
    return JSON.stringify({ error: signUpResult.error });
  }
  if (signUpResult.data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: signUpResult.data.user.id,
      username: data.username,
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(signUpResult.data.user.id);
      return JSON.stringify({ error: profileError });
    }
  }
  return JSON.stringify(signUpResult);
}
