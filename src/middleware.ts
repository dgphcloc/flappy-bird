import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getUserSession from "./lib/supabase/getUserSession";
export const config = {
  matcher: ["/admin/:path*", "/admin"],
};

export async function middleware(request: NextRequest) {
  console.log("auth middleware");
  const {
    data: { session },
  } = await getUserSession();
  console.log(JSON.stringify(session));
  if (!session) {
    console.log("Không có user, redirect...");
    return NextResponse.redirect(new URL("/signInAdmin", request.url));
  }
  return NextResponse.next();
}
