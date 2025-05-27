import { NextResponse, NextRequest } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

interface Params {
  id: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params;

  const supabase = createSupabaseAdminAuthClient();

  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const { error: dbError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
