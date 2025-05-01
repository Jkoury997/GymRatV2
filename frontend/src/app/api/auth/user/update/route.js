import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_AUTH = process.env.API_AUTH;

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "accessToken no encontrado" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${API_AUTH}/api/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let errorText = "Error al actualizar el usuario";
      try {
        const errData = await res.json();
        errorText = errData.message || errorText;
      } catch (_) {}
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    const updatedUser = await res.json();
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("Error en PUT /api/user/me:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
