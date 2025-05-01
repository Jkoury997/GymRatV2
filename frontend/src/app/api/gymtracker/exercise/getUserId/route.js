import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_GYMTRACKER = process.env.API_GYMTRACKER;

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Token no encontrado" }, { status: 401 });
    }

    const res = await fetch(`${API_GYMTRACKER}/api/exercises/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ✅ Token en el header
      },
    });

    const data = await res.json();


    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "No se pudo obtener el ejercicio" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      {
        message: "Ejercicio obtenidos con éxito",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al obtener los ejercicio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
