// app/api/auth/refreshtoken/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Variable de entorno que contiene la URL base de la API de autenticación
const API_AUTH = process.env.API_AUTH;

export async function GET(req) {
  try {
    // Obtén el refreshToken de las cookies
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Si no existe el refreshToken, retorna error 401
    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token no encontrado" }, { status: 401 });
    }

    // Realiza la petición al endpoint de refresco del backend.
    const res = await fetch(`${API_AUTH}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Credenciales inválidas" }, { status: res.status });
    }

    const { accessToken } = data;

    const response = NextResponse.json({
      message: "Renovación de credenciales exitosa",
      accessToken,
    });

    // Actualiza la cookie con el nuevo accessToken
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 horas
    });

    return response;
  } catch (error) {
    console.error("Error en la renovación del token:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
