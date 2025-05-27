import { NextRequest, NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

interface Params {
  id: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const body = await request.json();
  const { score } = body;

  const supabase = await createSupabaseAdminAuthClient();

  const { data, error } = await supabase.from("user_histories").insert({
    user_id: id,
    score: score,
  });

  if (error) {
    return NextResponse.json(
      { message: "Failed to save score", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Score saved successfully", data },
    { status: 201 }
  );
}
