import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/auth",
  "/manifest.webmanifest",
  "/sw.js",
  "/icon.svg",
  "/setup",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Degraded mode — if env vars missing, redirect everything (except setup help) to /setup.
  if (!url || !key) {
    const { pathname } = request.nextUrl;
    if (pathname === "/setup" || pathname.startsWith("/_next") || pathname.startsWith("/manifest") || pathname.startsWith("/sw.js") || pathname.startsWith("/icon")) {
      return response;
    }
    const setup = request.nextUrl.clone();
    setup.pathname = "/setup";
    return NextResponse.redirect(setup);
  }

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(toSet) {
      toSet.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      toSet.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options),
      );
    },
  };

  try {
    const supabase = createServerClient<Database>(url, key, { cookies: cookieMethods });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    if (!user && !isPublic(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (user && !isPublic(pathname) && pathname !== "/onboarding") {
      const { data: membership } = await supabase
        .from("memberships")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      if (!membership) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/onboarding";
        return NextResponse.redirect(redirectUrl);
      }
    }

    return response;
  } catch (err) {
    // If Supabase itself fails (network, bad keys), let the request through.
    // Pages will render their own error states.
    console.error("Middleware Supabase error:", err);
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
