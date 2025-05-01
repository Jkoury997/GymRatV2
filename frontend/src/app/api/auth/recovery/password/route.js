import { NextResponse } from "next/server";

const API_AUTH = process.env.API_AUTH;

export async function POST(req) {
  try {
    const { email, newPassword, otpCode } = await req.json();

    const res = await fetch(`${API_AUTH}/api/recovery/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword, otpCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Error al cambiar la contraseña." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      message: data.message || "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error en el cambio de contraseña:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
