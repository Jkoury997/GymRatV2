import { NextResponse } from "next/server";

// Variable de entorno que contiene la URL base de la API de autenticación
const API_AUTH = process.env.API_AUTH;

export async function POST(req) {
  try {
    const { email, otpCode } = await req.json();
    const res = await fetch(`${API_AUTH}/api/recovery/verify-otp-only`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otpCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "OTP no válido" },
        { status: res.status }
      );
    }

    const response = NextResponse.json({
      data
    },{ status: 200 });

    return response;
  } catch (error) {
    console.error("Error en el otp:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
