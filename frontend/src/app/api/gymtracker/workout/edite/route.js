import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_GYMTRACKER = process.env.API_GYMTRACKER;

export async function PUT(req, { params }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Token no encontrado" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const res = await fetch(`${API_GYMTRACKER}/api/workouts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "No se pudo actualizar el entrenamiento" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      {
        message: "Entrenamiento actualizado con éxito",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al actualizar el entrenamiento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
