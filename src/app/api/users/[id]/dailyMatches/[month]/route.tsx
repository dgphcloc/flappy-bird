import { NextRequest, NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/server";

interface Params {
  id: string;
  month: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const supabase = await createSupabaseAdminAuthClient();
  const { id, month } = await params;

  const { data, error } = await supabase.rpc(
    "get_daily_match_counts_by_month",
    {
      p_user_id: id,
      p_month: month,
    }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
