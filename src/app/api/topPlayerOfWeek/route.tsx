import { NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseAdminAuthClient();

  try {
    const { data, error } = await supabase.rpc("get_top_3_players_this_week");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = (err as Error).message ?? "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
