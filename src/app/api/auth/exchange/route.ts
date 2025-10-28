import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req, NextResponse.next());
    const user = session?.user;

    if (!user) {
      console.error("❌ No Auth0 session found");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const userPayload = {
      name: user.name || "",
      email: user.email || "",
      avatarUrl: (user as any).picture || "",
    };

    const backendRes = await fetch(`${BACKEND_URL}/api/auth/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPayload),
    });

    const backendBody = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      console.error("❌ Backend error:", backendRes.status, backendBody);
      return NextResponse.redirect(new URL("/api/auth/error?error=BackendExchangeFailed", req.url));
    }

    const setCookieHeader = backendRes.headers.get("set-cookie");
    const response = NextResponse.redirect(new URL("/home", req.url));
    if (setCookieHeader) response.headers.set("Set-Cookie", setCookieHeader);

    return response;
  } catch (err) {
    console.error("💥 Exchange error:", err);
    return NextResponse.redirect(new URL("/api/auth/error?error=ExchangeError", req.url));
  }
}
