"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Dumbbell,
  Edit,
  Plus,
  Save,
  Weight,
  X,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TrainingFixedDialog({ exerciseUserId }) {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [series, setSeries] = useState([{ weight: 0, reps: 10 }]);

  const updateSeries = (index, field, value) => {
    const updated = [...series];
    updated[index][field] = value;
    setSeries(updated);
  };

  const addSeries = () =>
    setSeries([...series, { weight: series.at(-1)?.weight || 0, reps: 10 }]);

  const removeSeries = (index) => {
    if (series.length > 1) {
      setSeries(series.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!exerciseUserId || !date || series.length === 0) return;

    setIsSubmitting(true);

    const newRecord = {
      exerciseUserId,
      date,
      series: series.map((s) => ({
        weight: s.weight,
        reps: s.reps,
      })),
      notes: notes.trim() || undefined,
    };

    try {
      const res = await fetch("/api/gymtracker/workout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al guardar el entrenamiento:", errorData);
        return;
      }

      await res.json();
      router.back(); // volver al finalizar
    } catch (error) {
      console.error("Error al enviar el entrenamiento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open>
      <AlertDialogContent className="max-w-md pointer-events-auto">
        <AlertDialogHeader className="mb-2 flex justify-between items-center">
          <AlertDialogTitle className="flex items-center gap-2">
            <Weight className="h-5 w-5 text-primary" />
            Registrar Entrenamiento
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Fecha
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                Series
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSeries}
                className="h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Añadir serie
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {series.map((serie, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-card"
                >
                  <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`weight-${index}`} className="text-xs">
                        Peso (kg)
                      </Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        value={serie.weight}
                        onChange={(e) =>
                          updateSeries(index, "weight", parseFloat(e.target.value) || 0)
                        }
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`reps-${index}`} className="text-xs">
                        Repeticiones
                      </Label>
                      <Input
                        id={`reps-${index}`}
                        type="number"
                        value={serie.reps}
                        onChange={(e) =>
                          updateSeries(index, "reps", parseInt(e.target.value) || 0)
                        }
                        className="h-9"
                      />
                    </div>
                  </div>
                  {series.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSeries(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              Notas (opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Ej: Buena técnica, aumentar peso la próxima vez"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              onClick={handleSave}
              disabled={isSubmitting || !date || series.length === 0}
              className="h-11"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Entrenamiento
                </span>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
