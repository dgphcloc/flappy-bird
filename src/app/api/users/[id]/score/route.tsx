import { NextRequest, NextResponse } from "next/server";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

interface Params {
  id: string;
}

function isValidScore(score: number) {
  return Number.isInteger(score) && score >= 0 && score <= 2000000000;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const { score } = (await request.json()) as { score: number };

  if (!isValidScore(score)) {
    return NextResponse.json(
      { error: "Invalid score. Must be between 0 and 2,000,000,000." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminAuthClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ score })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { error: "Failed to update score. Please try again." },
      { status: 500 }
    );
  }

  const updatedProfile = data?.[0];

  return NextResponse.json({ score: updatedProfile?.score }, { status: 200 });
}
