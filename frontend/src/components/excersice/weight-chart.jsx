"use client";

import React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export default function WeightChart({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-10">
        No hay registros aún para este ejercicio.
      </div>
    );
  }

  // Ordena de más antiguo a más reciente
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const data = sortedRecords.map((record) => {
    const maxWeight = Math.max(...record.series.map((s) => s.weight));
    const avgWeight =
      record.series.reduce((sum, s) => sum + s.weight, 0) / record.series.length;

    return {
      date: new Date(record.date).toLocaleDateString("es-AR", {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      maxWeight,
      avgWeight: Number.parseFloat(avgWeight.toFixed(1)),
    };
  });

  // Calcula dominio del eje Y
  const allWeights = data.flatMap((d) => [d.maxWeight, d.avgWeight]);
  const minWeight = Math.max(0, Math.min(...allWeights) - 5);
  const maxWeight = Math.max(...allWeights) + 5;

  return (
    <ChartContainer
      config={{
        maxWeight: {
          label: "Peso máximo (kg)",
          color: "#000000",
        },
        avgWeight: {
          label: "Peso promedio (kg)",
          color: "#000000",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            domain={[minWeight, maxWeight]}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <ChartTooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="maxWeight"
            stroke="#000000"
            strokeWidth={3}
            activeDot={{ r: 6, stroke: "#000000", strokeWidth: 2, fill: "#000000" }}
            dot={{ r: 4, stroke: "#000000", strokeWidth: 1, fill: "#000000" }}
          />
          <Line
            type="monotone"
            dataKey="avgWeight"
            stroke="#000000"
            strokeWidth={2}
            strokeDasharray="4 4"
            activeDot={{ r: 6, stroke: "#000000", strokeWidth: 2, fill: "#000000" }}
            dot={{ r: 4, stroke: "#000000", strokeWidth: 1, fill: "#000000" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-md p-3">
        <p className="text-sm font-medium">{label}</p>
        <div className="space-y-1 mt-1">
          <p className="text-xs flex items-center justify-between gap-3">
            <span className="font-medium">Peso máximo:</span>
            <span className="font-bold">{payload[0].value} kg</span>
          </p>
          <p className="text-xs flex items-center justify-between gap-3">
            <span className="font-medium">Peso promedio:</span>
            <span>{payload[1].value} kg</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}
