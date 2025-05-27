import { NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const supabaseAdmin = createSupabaseAdminAuthClient();
  const { searchParams } = new URL(request.url);
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  if (!start_date || !end_date) {
    return NextResponse.json(
      {
        error: `Missing parameters. Received start: ${start_date}, end: ${end_date}`,
      },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin.rpc("get_daily_user_counts", {
      start_date,
      end_date,
    });

    if (error) throw error;
    console.log("DATA", data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
}
