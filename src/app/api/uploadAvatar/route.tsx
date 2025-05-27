import { NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { generateFilePath } from "@/helpers/helperStore";

export async function POST(req: Request) {
  const supabase = await createSupabaseAdminAuthClient();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filePath = await generateFilePath(file);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { error: "Failed to get public URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
