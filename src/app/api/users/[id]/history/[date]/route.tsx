import { NextRequest, NextResponse } from "next/server";
import { fetchHistoryByPage } from "@/app/admin/_action";
import { addDays, format } from "date-fns";

interface Params {
  id: string;
  date: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id, date } = await params;
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = parseInt(searchParams.get("perPage") ?? "15");
  const inputDate = new Date(date);
  const nextDate = addDays(inputDate, 1);
  const dateTo = format(nextDate, "yyyy-MM-dd");
  const result = await fetchHistoryByPage(page, perPage, date, dateTo, {
    col: "user_id",
    value: id,
  });
  if (!result) {
    return NextResponse.json({ history: [], total: 0 }, { status: 200 });
  }

  const { data, total } = result;
  return NextResponse.json({ data, total }, { status: 200 });
}
