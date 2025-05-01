"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function WeekdaysSelector({ weekdays, preferredWorkoutDays, handleWorkoutDayToggle }) {
  return (
    <div className="space-y-2">
      <Label>Días de entrenamiento</Label>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <Button
            key={day.value}
            type="button"
            variant="outline"
            size="sm"
            className={`h-10 ${
              (preferredWorkoutDays || []).includes(day.value)
                ? "bg-primary/10 border-primary text-primary"
                : ""
            }`}
            onClick={() => handleWorkoutDayToggle(day.value)}
          >
            {day.label.substring(0, 1)}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Selecciona los días que sueles entrenar</p>
    </div>
  );
}
