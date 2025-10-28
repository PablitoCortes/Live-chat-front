import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5500";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

// 💡 Tipo personalizado del token de NextAuth
interface GoogleToken {
  name?: string;
  email?: string;
  picture?: string;
  image?: string;
  sub?: string;
}

export async function GET(req: NextRequest) {
  try {
    console.log("🔄 Iniciando proceso de exchange...");
    const token = await getToken({ req, secret: NEXTAUTH_SECRET }) as GoogleToken | null;

    if (!token) {
      console.error("❌ No next-auth token found");
      return NextResponse.redirect(new URL("/auth/error?error=NoToken&details=No%20authentication%20token%20found", req.url));
    }

    console.log("✅ Token encontrado:", { 
      email: token.email, 
      name: token.name,
      hasPicture: !!token.picture 
    });

    // ✅ TypeScript ya entiende las propiedades
    const userPayload = {
      name: token.name || "",
      email: token.email || "",
      avatarUrl: token.picture || token.image || "",
    };

    // Validar que tenemos los datos mínimos necesarios
    if (!userPayload.email) {
      console.error("❌ No email found in token");
      return NextResponse.redirect(new URL("/auth/error?error=NoEmail&details=No%20email%20found%20in%20authentication%20token", req.url));
    }

    console.log("📤 Enviando payload al backend:", userPayload);
    console.log("🌐 URL del backend:", `${BACKEND_URL}/auth/google-login`);

    let backendRes: Response;
    try {
      backendRes = await fetch(`${BACKEND_URL}/auth/google-login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userPayload),
      });

      console.log("📡 Respuesta del backend:", backendRes.status, backendRes.statusText);
      console.log("📡 Headers de respuesta:", Object.fromEntries(backendRes.headers.entries()));

      // Primero intentamos obtener el texto de la respuesta
      const responseText = await backendRes.text();
      console.log("📄 Respuesta en texto plano:", responseText);
      
      let backendBody;
      try {
        backendBody = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Error parseando JSON:", parseError);
        console.error("❌ Respuesta que no se pudo parsear:", responseText);
        // Solo incluir los primeros 200 caracteres para evitar URLs demasiado largas
        const truncatedResponse = responseText.substring(0, 200);
        return NextResponse.redirect(new URL(`/auth/error?error=InvalidJSONResponse&details=${encodeURIComponent(truncatedResponse)}`, req.url));
      }

      console.log("📦 Cuerpo de respuesta del backend:", backendBody);

      if (!backendRes.ok) {
        console.error("❌ Backend error during exchange:", backendRes.status, backendBody);
        // Solo incluir información esencial para evitar URLs demasiado largas
        const errorSummary = {
          status: backendRes.status,
          message: backendBody?.message || 'Unknown error',
          code: backendBody?.code || 'UNKNOWN'
        };
        return NextResponse.redirect(new URL(`/auth/error?error=BackendExchangeFailed&details=${encodeURIComponent(JSON.stringify(errorSummary))}`, req.url));
      }

      // Obtener el token del backend
      console.log("📦 Datos del backend:", backendBody);
      
      if (!backendBody?.data?.token) {
        console.error("❌ No se recibió token del backend");
        return NextResponse.redirect(new URL("/auth/error?error=NoToken&details=No%20token%20received%20from%20backend", req.url));
      }

      // Crear la cookie manualmente
      const isProduction = process.env.NODE_ENV === "production";
      const cookieValue = `token=${backendBody.data.token}; Path=/; HttpOnly; SameSite=None; ${isProduction ? 'Secure;' : ''} Max-Age=86400`;
      
      console.log("🍪 Estableciendo cookie:", cookieValue);
      
      const response = NextResponse.redirect(new URL("/home", req.url));
      response.headers.set("Set-Cookie", cookieValue);

      return response;
    } catch (fetchError) {
      console.error("💥 Error de fetch:", fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown network error';
      // Truncar el mensaje de error para evitar URLs largas
      const truncatedError = errorMessage.substring(0, 100);
      return NextResponse.redirect(new URL(`/auth/error?error=NetworkError&details=${encodeURIComponent(truncatedError)}`, req.url));
    }
  } catch (err) {
    console.error("💥 Exchange error:", err);
    return NextResponse.redirect(new URL("/api/auth/error?error=ExchangeError", req.url));
  }
}
