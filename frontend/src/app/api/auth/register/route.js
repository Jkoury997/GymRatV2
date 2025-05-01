import { NextResponse } from "next/server"

// Variable de entorno que contiene la URL base de la API de autenticación
const API_AUTH = process.env.API_AUTH;

export async function POST(req) {
  try {
    const body = await req.json()

    const res = await fetch(`${API_AUTH}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const text = await res.text()

    let data
    try {
      data = JSON.parse(text)
    } catch (err) {
      console.error("⚠️ Respuesta no válida de la API externa:", text)
      return NextResponse.json(
        { error: "Respuesta inválida del servidor de autenticación" },
        { status: 502 }
      )
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "No se pudo registrar" },
        { status: res.status }
      )
    }

    // Si tu API también devuelve tokens al registrarse, podés guardarlos como en login:
    const { accessToken, refreshToken, user } = data

    const response = NextResponse.json({
      message: "Registro exitoso",
      user,
    })

    if (accessToken) {
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2, // 2 horas
      })
    }

    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      })
    }

    return response
  } catch (error) {
    console.error("Error en el registro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
