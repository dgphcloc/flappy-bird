import { NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseAdminAuthClient();

  const { data, error } = await supabase.rpc("get_active_user_percentage");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data[0] });
}
