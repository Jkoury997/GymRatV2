"use client";

import React from "react";
import { Weight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function NoRecordsMessage({ dialogOpen, setDialogOpen }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl shadow-sm border">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <Weight className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-xl font-semibold">No hay registros</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Comienza agregando tu primer entrenamiento para ver tu progreso a lo largo del tiempo
      </p>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Entrenamiento
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
}
