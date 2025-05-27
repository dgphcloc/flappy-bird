import { NextRequest, NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/server";
interface Params {
  id: string;
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const supabase = await createSupabaseAdminAuthClient();
  const { data, error } = await supabase.rpc("get_average_score_by_user", {
    p_user_id: id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
