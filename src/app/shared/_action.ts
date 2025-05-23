"use server";

import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import createSupabaseServerClient from "@/lib/supabase/server";
import getUserSession from "@/lib/supabase/getUserSession";

export type SignInUsernameInput = {
  password: string;
  username: string;
};
export type SignUpWithUsernameInput = {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
};
export async function signInWithUsernameAndPassword(user: SignInUsernameInput) {
  try {
    const supabaseAdmin = await createSupabaseAdminAuthClient();
    const supabaseClient = await createSupabaseServerClient();
    const { data, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", user.username)
      .single();

    if (profileError) {
      console.error("Error finding user:", profileError);
      throw new Error("User not found");
    }

    if (!data) {
      throw new Error("User not found");
    }
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(data.id);

    if (userError) {
      console.error("Error getting user:", userError);
      throw new Error("Invalid username or password");
    }

    if (!userData || !userData.user || !userData.user.email) {
      throw new Error("Invalid username or password");
    }

    // Đăng nhập với email và password
    const result = await supabaseClient.auth.signInWithPassword({
      email: userData.user.email,
      password: user.password,
    });

    return JSON.stringify(result);
  } catch (error) {
    console.error("Error in signInWithUsernameAndPassword:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Invalid username or password";
    return JSON.stringify({ error: { message: errorMessage } });
  }
}

export async function signUpWithUsernameAndPassword({
  data,
}: {
  data: SignUpWithUsernameInput;
}) {
  const supabase = await createSupabaseServerClient();
  const signUpResult = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
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

export async function signInWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = await createSupabaseServerClient();
  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  return result;
}

export const getTopHighestPlayer = async (quantity: number) => {
  const supabase = await createSupabaseServerClient();
  const result = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("score", { ascending: false })
    .limit(quantity);
  return result;
};

export const getProfileRank = async () => {
  const {
    data: { session },
  } = await getUserSession();
  const id = session?.user.id;
  if (!id) return;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_profile_rank", {
    target_id: id,
  });

  if (error) {
    return null;
  } else {
    return data;
  }
};

export const getCurrentUserProfile = async () => {
  const {
    data: { session },
  } = await getUserSession();
  if (!session) return null;
  const id = session.user.id;
  const supabase = await createSupabaseAdminAuthClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return data;
};
