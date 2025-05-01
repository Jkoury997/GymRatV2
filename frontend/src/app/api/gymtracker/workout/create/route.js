import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_GYMTRACKER = process.env.API_GYMTRACKER

export async function POST(req) {
  try {

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Token no encontrado" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${API_GYMTRACKER}/api/workouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ✅ Token en el header
        
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "No se pudo registrar el entrenamiento" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      {
        message: "Entrenamiento registrado con éxito",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error al registrar el entrenamiento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
