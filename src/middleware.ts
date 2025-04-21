import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getUserSession from "./lib/supabase/getUserSession";

const publicPaths = [
  "/Game",
  "/signInAdmin",
  "/api/*",
  "/_next/static/*",
  "/favicon.ico",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    publicPaths.some((path) => {
      const regex = new RegExp(`^${path.replace("*", ".*")}$`);
      return regex.test(pathname);
    })
  ) {
    return NextResponse.next();
  }

  const {
    data: { session },
  } = await getUserSession();

  /**
   * check authen
   */
  if (!session) {
    return NextResponse.redirect(new URL("/signInAdmin", request.url));
  }

  /**
   * check admin role
   */
  if (pathname.startsWith("/admin")) {
    const isAdmin: boolean = session.user.app_metadata.admin_role;
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/Game", request.url));
    }
  }

  return NextResponse.next();
}
