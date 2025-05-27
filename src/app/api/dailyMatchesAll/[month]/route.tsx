import { NextRequest, NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/server";

interface Params {
  month: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { month } = await params;
  const supabase = await createSupabaseAdminAuthClient();

  const { data, error } = await supabase.rpc(
    "get_daily_match_counts_all_users_by_month",
    { p_month: month }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
