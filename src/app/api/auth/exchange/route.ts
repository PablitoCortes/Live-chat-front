import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

interface Auth0Token {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = (await getToken({ req, secret: NEXTAUTH_SECRET })) as Auth0Token | null;

    if (!token) {
      console.error("❌ No next-auth token found");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userPayload = {
      name: token.name || "",
      email: token.email || "",
      avatarUrl: token.picture || "",
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
