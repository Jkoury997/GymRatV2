"use client";

import React from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HistoryListItem({ record, isExpanded, toggleExpandRecord, previousRecord }) {
  const maxWeightInRecord = Math.max(...record.series.map((s) => s.weight));
  const prevMaxWeight = previousRecord ? Math.max(...previousRecord.series.map((s) => s.weight)) : 0;
  const difference = previousRecord ? maxWeightInRecord - prevMaxWeight : 0;

  return (
    <Card className="overflow-hidden border p-0">
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
              {record.series.map((serie, serieIndex) => (
                <TableRow key={serieIndex}>
                  <TableCell className="font-medium">{serieIndex + 1}</TableCell>
                  <TableCell>{serie.weight} kg</TableCell>
                  <TableCell className="text-right">{serie.reps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {record.notes && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs font-medium mb-1">Notas:</p>
              <p className="text-sm">{record.notes}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
