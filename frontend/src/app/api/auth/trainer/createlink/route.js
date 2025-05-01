import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_AUTH = process.env.API_AUTH;

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "accessToken no encontrado" }, { status: 401 });
    }

    const res = await fetch(`${API_AUTH}/api/trainer/link-create`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      let errorText = "Error al generar código";
      try {
        const errData = await res.json();
        errorText = errData.message || errorText;
      } catch (_) {}
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error en POST /api/trainer-link:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
