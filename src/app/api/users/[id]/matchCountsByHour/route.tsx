import { NextRequest, NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/server";

interface Params {
  id: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const supabase = await createSupabaseAdminAuthClient();

  const { id } = await params;

  const { data, error } = await supabase.rpc("get_match_counts_by_hour", {
    p_user_id: id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
