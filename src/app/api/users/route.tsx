import { generateFilePath, generateUserEmailTemp } from "@/helpers/helperStore";
import { NextResponse, NextRequest } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const score = Number(formData.get("score"));
    const avatarFile = formData.get("avatar") as File | null;

    const supabase = await createSupabaseAdminAuthClient();

    const {
      data: { user },
      error: createUserError,
    } = await supabase.auth.admin.createUser({
      email: generateUserEmailTemp(),
      password,
    });

    if (createUserError || !user) {
      return NextResponse.json(
        { error: createUserError?.message || "Failed to create user" },
        { status: 500 }
      );
    }

    let avatar_url = "";

    if (avatarFile) {
      const filePath = await generateFilePath(avatarFile);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);

      if (uploadError) {
        console.warn("Failed to upload avatar:", uploadError.message);
      } else if (uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        avatar_url = publicUrlData.publicUrl;
      }
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        username,
        score,
        avatar_url,
      },
      { onConflict: "id" }
    );

    if (profileError && profileError.code === "23505") {
      return NextResponse.json(
        { error: `Username "${username}" already exists.` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: `User created successfully`, userId: user.id },
      { status: 201 }
    );
  } catch (e: unknown) {
    const message = (e as Error).message ?? "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
