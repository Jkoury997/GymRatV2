import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_GYMTRACKER = process.env.API_GYMTRACKER


export async function POST(req) {
  try {
    const body = await req.json()
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_GYMTRACKER}/api/exercises/${body.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ✅ Token en el header
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "No se pudo eliminar el ejercicio" },
        { status: res.status }
      )
    }

    return NextResponse.json(
      {
        message: "Eliminacion exitosa",
        data,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Error en la eliminacion del ejercicio:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
