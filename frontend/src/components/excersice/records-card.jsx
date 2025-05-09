"use client";
import { useState, useEffect } from "react"; // si aún no lo tenés
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HistoryListItem({ record, isExpanded, toggleExpandRecord, previousRecord }) {
  const maxWeightInRecord = Math.max(...record.series.map((s) => s.weight));
  const prevMaxWeight = previousRecord ? Math.max(...previousRecord.series.map((s) => s.weight)) : 0;
  const difference = previousRecord ? maxWeightInRecord - prevMaxWeight : 0;
  
const [editableSeries, setEditableSeries] = useState([]);
const [editableNotes, setEditableNotes] = useState("");


useEffect(() => {
  if (isExpanded) {
    setEditableSeries(record.series);
    setEditableNotes(record.notes || "");
  }
}, [isExpanded]);

const handleEditRecord = async () => {
  const updatedData = {
    notes: editableNotes,
    series: editableSeries,
  };

  try {
    const res = await fetch(`/api/gymtracker/workout/edite/${record._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Error al actualizar");
    const result = await res.json();
    console.log("Actualizado:", result);
    alert("Registro actualizado con éxito");
  } catch (err) {
    console.error(err);
    alert("Hubo un error al actualizar el registro");
  }
};

  

  return (
    <Card className="block overflow-hidden hover:shadow-md transition-all border pt-0 pb-1">
      <div
        className="p-3 flex items-center justify-between bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => toggleExpandRecord(record.date)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
          <p className="font-medium">
  {new Date(record.date).toLocaleDateString("es-AR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}
</p>
            <p className="text-xs text-muted-foreground">
              {record.series.length} {record.series.length === 1 ? "serie" : "series"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="font-medium">{maxWeightInRecord} kg</span>
              {difference !== 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    difference > 0
                      ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                      : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {difference > 0 ? "+" : ""}
                  {difference}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Peso máximo</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandRecord(record.date);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="p-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Serie</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead className="text-right">Repeticiones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
  {editableSeries.map((serie, index) => (
    <TableRow key={index}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <input
          type="number"
          value={serie.weight || "0"}
          onChange={(e) => {
            const newSeries = [...editableSeries];
            newSeries[index].weight = parseFloat(e.target.value);
            setEditableSeries(newSeries);
          }}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </TableCell>
      <TableCell>
        <input
          type="number"
          value={serie.reps || "0"}
          onChange={(e) => {
            const newSeries = [...editableSeries];
            newSeries[index].reps = parseInt(e.target.value);
            setEditableSeries(newSeries);
          }}
          className="w-full border rounded px-2 py-1 text-sm text-right"
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>

          {record.notes && (
            <div className="mt-3">
            <p className="text-xs font-medium mb-1">Notas:</p>
            <textarea
              value={editableNotes}
              onChange={(e) => setEditableNotes(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              rows={2}
            />
          </div>
          )}

<Button
  variant="secondary"
  className="mt-4 w-full"
  onClick={handleEditRecord}
>
  Guardar cambios
</Button>

        </CardContent>
      )}
      
    </Card>
    
  );
}
