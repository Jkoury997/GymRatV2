import { cookies } from "next/headers"
import { NextResponse } from "next/server"
// Variable de entorno que contiene la URL base de la API de autenticación
const API_AUTH = process.env.API_AUTH;

export async function GET() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Token de actualización no encontrado" },
        { status: 401 }
      )
    }

    const res = await fetch(`${API_AUTH}/api/auth/logout`, {
      method: "POST", // 👈 cambiamos a POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      const error = await res.json()
      return NextResponse.json(
        { error: error.message || "Error al cerrar sesión" },
        { status: res.status }
      )
    }

    const response = NextResponse.json({ message: "Logout exitoso" })

    // Eliminar cookies
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    response.cookies.set("userId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Error en el logout:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
