import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { can, dashboardPathFor } from "@/modules/auth/permissions";
import { fetchUserRoles } from "@/modules/auth/server/roles";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect /admin/* — must be authenticated AND have admin dashboard access
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const roles = await fetchUserRoles(supabase, user.id);
    if (!can({ roles }, "admin-dashboard:view")) {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  // Protect /user/* and /dashboard/* — must be authenticated. Per-page
  // permissions under /dashboard are checked by the pages themselves.
  if (pathname.startsWith("/user") || pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect already-logged-in users away from /login
  if (pathname === "/login" && user) {
    const roles = await fetchUserRoles(supabase, user.id);
    return NextResponse.redirect(new URL(dashboardPathFor({ roles }), request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/dashboard/:path*", "/login"],
};
