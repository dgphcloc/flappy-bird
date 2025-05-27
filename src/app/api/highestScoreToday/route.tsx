import { NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseAdminAuthClient();

  const { data, error } = await supabase.rpc("get_highest_score_today");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ highestScore: data });
}
