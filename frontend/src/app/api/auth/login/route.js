import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Variable de entorno que contiene la URL base de la API de autenticación
const API_AUTH = process.env.API_AUTH;

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    const res = await fetch(`${API_AUTH}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
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
        { error: data.message || "Credenciales inválidas" },
        { status: res.status }
      )
    }

    const { accessToken, refreshToken, user } = data

    const response = NextResponse.json({
      message: "Login exitoso",
      user,
    })

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 horas
    })

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })


    

    return response
  } catch (error) {
    console.error("Error en el login:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
