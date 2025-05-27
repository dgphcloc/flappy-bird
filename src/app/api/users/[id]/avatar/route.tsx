// app/api/users/[id]/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

interface Params {
  id: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params;

  const { newUrl } = (await request.json()) as { newUrl: string };
  const supabase = createSupabaseAdminAuthClient();

  try {
    // 1. Lấy avatar cũ từ DB
    const { data: profile, error: fetchErr } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", id)
      .single();
    if (fetchErr) throw fetchErr;

    // 2. Xoá file avatar cũ nếu có
    const currentAvatar = profile.avatar_url;
    if (currentAvatar) {
      const oldPath = currentAvatar.split("/").pop()!;
      const { error: deleteErr } = await supabase.storage
        .from("avatars")
        .remove([oldPath]);
      if (deleteErr) {
        // chỉ warn, không throw để vẫn update được URL mới
        console.warn("Cannot delete old avatar:", deleteErr);
      }
    }

    // 3. Update URL mới vào bảng profiles
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ avatar_url: newUrl })
      .eq("id", id);
    if (updateErr) throw updateErr;

    // 4. Trả về avatar_url mới
    return NextResponse.json({ avatar_url: newUrl }, { status: 200 });
  } catch (error: unknown) {
    const message = (error as Error).message ?? "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
