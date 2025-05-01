"use client";

import React from "react";
import { Weight, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ maxWeight, totalProgress, firstRecord, recordsCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card shadow-sm p-2">
        <CardContent className="p-2">
          <div className="flex items-center gap-2 mb-1">
            <Weight className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Peso máximo</h3>
          </div>
          <p className="text-2xl font-bold">{maxWeight} kg</p>
          <p className="text-xs text-muted-foreground">Tu mejor marca</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm p-2">
        <CardContent className="p-2">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Progreso</h3>
          </div>
          <p className={`text-2xl font-bold ${
              totalProgress > 0
                ? "text-green-600"
                : totalProgress < 0
                ? "text-red-600"
                : ""
            }`}>
            {totalProgress > 0 ? "+" : ""}
            {totalProgress} kg
          </p>
          <p className="text-xs text-muted-foreground">
            Desde {firstRecord ? new Date(firstRecord.date).toLocaleDateString("es-AR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm p-2">
        <CardContent className="p-2">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Entrenamientos</h3>
          </div>
          <p className="text-2xl font-bold">{recordsCount}</p>
          <p className="text-xs text-muted-foreground">Total de sesiones</p>
        </CardContent>
      </Card>
    </div>
  );
}
