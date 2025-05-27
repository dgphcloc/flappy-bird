import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
const supabase = createSupabaseAdminAuthClient();

export async function GET() {
  try {
    const { data, error } = await supabase.rpc("get_top_3_all_time_players");
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error || "Internal server error" },
        { status: 500 }
      );
    }
  }
}
