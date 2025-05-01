// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Convertir la clave secreta en Uint8Array
const SECRET = process.env.JWT_SECRET;
// Variable de entorno que contiene la URL base de la API de autenticación
const API_AUTH = process.env.API_AUTH;

export async function middleware(request) {
  const url = request.nextUrl.clone();

  // Aplica el middleware solo a rutas que empiezan con /dashboard
  if (url.pathname.startsWith("/dashboard")) {
    const tokenCookie = request.cookies.get("accessToken");
    const refreshCookie = request.cookies.get("refreshToken");

    const token = tokenCookie ? tokenCookie.value : null;
    const refreshToken = refreshCookie ? refreshCookie.value : null;


    // Si no hay accessToken, pero sí existe refreshToken, intenta refrescar el token
    if (!token && refreshToken) {

      const refreshResponse = await fetch(`${API_AUTH}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      }

      const data = await refreshResponse.json();
      // Actualizamos la cookie del accessToken con el nuevo valor
      const response = NextResponse.next();
      response.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2, // 2 horas
      });

      return response;
    }

    // Si tampoco existe accessToken ni refreshToken, redirige al login
    if (!token && !refreshToken) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // Si existe accessToken (aunque esté vencido), intentamos verificarlo
    try {
      await jwtVerify(token, SECRET);
      // Si es válido, continúa normalmente
      return NextResponse.next();
    } catch (err) {
      // Si falla la verificación y existe refreshToken, intenta renovar el token
      if (refreshToken) {
        const refreshResponse = await fetch(`${API_AUTH}/api/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          url.pathname = "/auth/login";
          return NextResponse.redirect(url);
        }

        const data = await refreshResponse.json();

        const response = NextResponse.next();
        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 2, // 2 horas
        });
        return response;
      } else {
        // Si falla la verificación y no existe refreshToken, redirige al login
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

// Configuración para aplicar el middleware en rutas /dashboard/...
export const config = {
  matcher: "/dashboard/:path*",
};
