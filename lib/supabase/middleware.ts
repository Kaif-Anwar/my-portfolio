import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSessionEmailFromRequest } from "@/lib/admin-session";
import { isAuthorizedAdminEmail } from "@/lib/admin-credentials";

function isAuthenticatedAdmin(
  request: NextRequest,
  supabaseUserEmail?: string,
  sessionEmail?: string | null
): boolean {
  if (sessionEmail && isAuthorizedAdminEmail(sessionEmail)) {
    return true;
  }
  if (supabaseUserEmail && isAuthorizedAdminEmail(supabaseUserEmail)) {
    return true;
  }
  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!isAdminRoute) {
    return supabaseResponse;
  }

  const sessionEmail = await getAdminSessionEmailFromRequest(request);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let supabaseUserEmail: string | undefined;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    supabaseUserEmail = user?.email;

    if (!isLoginPage && user && !isAuthorizedAdminEmail(user.email)) {
      await supabase.auth.signOut();
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.searchParams.set("error", "unauthorized");
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete("portfolio_admin_session");
      return response;
    }
  }

  const authenticated = isAuthenticatedAdmin(request, supabaseUserEmail, sessionEmail);

  if (!isLoginPage && !authenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginPage && authenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
