"use client";

import React, { useState,useEffect } from "react";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TrainerSection({ students, profile }) {
  const router = useRouter();
  const [linkCode, setLinkCode] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile.linkCode && profile.linkCode.trim() !== "") {
      setLinkCode(profile.linkCode);
    }
  }, [profile.linkCode]);


  const generateCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/trainer/createlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Error al generar código");

      const data = await res.json();
      setLinkCode(data.linkCode);
    } catch (err) {
      console.error("Error generando código de entrenador:", err);
      alert("No se pudo generar el código. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
      <Label className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        Mis Alumnos
      </Label>

      {/* Bloque para mostrar o generar el código */}
      {linkCode && linkCode.trim() !== "" ? (
  <>
    <div className="bg-primary/10 p-3 rounded-lg text-center">
      <p className="text-xs">Tu código de entrenador:</p>
      <p className="text-sm font-bold text-primary">{linkCode}</p>
    </div>

    {students.length === 0 ? (
      <div className="bg-primary/5 p-3 rounded-lg text-center">
        <p className="text-sm font-medium">No tienes alumnos aún</p>
        <p className="text-xs text-muted-foreground">
          Compartí tu código con ellos para comenzar a hacer seguimiento
        </p>
      </div>
    ) : (
      <>
        <div className="space-y-2">
          {students.map((student) => (
            
            <div
              key={student._id}
              className="bg-primary/5 p-3 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium">{student.studentId.firstName} {student.studentId.lastName}</p>
                <p className="text-xs text-muted-foreground">
                  {student.studentId.email || "Sin email"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => router.push(`/alumno/${student.id}`)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Link href="/mis-alumnos">
            <Button variant="outline" className="w-full mt-2">
              <Users className="mr-2 h-4 w-4" />
              Ver todos mis alumnos
            </Button>
          </Link>
        </div>
      </>
    )}
  </>
) : (
  <div className="bg-primary/5 p-4 rounded-lg text-center">
    <p className="text-sm font-medium mb-1">
      Para comenzar a ver el progreso de tus alumnos, necesitás crear tu código de entrenador.
    </p>
    <p className="text-xs text-muted-foreground mb-3">
      Compartilo para que tus alumnos puedan vincularse contigo.
    </p>
    <Button
      onClick={generateCode}
      disabled={loading}
      className="w-full"
      variant="secondary"
    >
      <Sparkles className="h-4 w-4 mr-2" />
      {loading ? "Generando..." : "Crear código de entrenador"}
    </Button>
  </div>
)}
    </div>
  );
}
