import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PREFIXES = ["/login", "/forgot-password", "/welcome", "/signup"];
const ONBOARDING_PREFIXES = ["/welcome", "/signup", "/name", "/time", "/notifications", "/done"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const isPublic = PUBLIC_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
  const isOnboarding = ONBOARDING_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

  // Not signed in: only public routes allowed.
  if (!user && !isPublic && path !== "/") {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/welcome";
    return NextResponse.redirect(redirect);
  }

  // Signed in but onboarding incomplete: keep them inside onboarding.
  if (user && !isOnboarding && path !== "/") {
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!prefs?.onboarding_completed) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/name";
      return NextResponse.redirect(redirect);
    }
  }

  return response;
}
