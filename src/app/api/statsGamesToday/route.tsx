import { NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseAdminAuthClient();

  const { data, error } = await supabase.rpc("get_total_games_today");

  if (error) {
    console.error("Error fetching games today:", error);
    return NextResponse.json(
      { error: "Failed to fetch game count" },
      { status: 500 }
    );
  }

  return NextResponse.json({ total_games_today: data });
}
