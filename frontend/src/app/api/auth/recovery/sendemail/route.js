
import { NextResponse } from "next/server"

// Variable de entorno que contiene la URL base de la API de autenticación
const API_AUTH = process.env.API_AUTH;

export async function POST(req) {
  try {
    const { email} = await req.json()
    const res = await fetch(`${API_AUTH}/api/recovery/generate-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email}),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Email no valido" },
        { status: res.status }
      )
    }

    const response = NextResponse.json({
      message: "Envio exitoso",
    })


    return response
  } catch (error) {
    console.error("Error en el SendEmail:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
