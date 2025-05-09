"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowUpRight,
  Dumbbell,
  MoreVertical,
  Plus,
  DumbbellIcon as Barbell,
  Footprints,
  Shirt,
  HandIcon as Arm,
  Heart,
  Trash,
} from "lucide-react"


// Mapeo entre el valor categoryIcon y el componente correspondiente de lucide-react
const categoryIcons = {
  Barbell: Barbell,
  Dumbbell: Dumbbell,
  Footprints: Footprints,
  Shirt: Shirt,
  Arm: Arm,
  Heart: Heart,
};

export default function ExerciseHeader({ exercise, router, dialogOpen, setDialogOpen }) {
  const CategoryIcon = categoryIcons[exercise.categoryIcon] || Dumbbell;
  return (
    <div className="flex items-center justify-between">

    <Button
        variant="ghost"
        className="group hidden md:flex"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Volver
      </Button>

      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
        <CategoryIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{exercise.name}</h1>
          <p className="text-muted-foreground">{exercise.category}</p>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Entrenamiento
          </Button>
        </DialogTrigger>
      </Dialog>


    </div>
  );
}
