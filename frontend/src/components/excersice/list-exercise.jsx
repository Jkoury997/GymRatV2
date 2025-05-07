"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExerciseFilter } from "@/components/excersice/filter";

const iconMap = {
  Shirt,
  Barbell,
  Dumbbell,
  Footprints,
  Arm,
  Heart,
};

export function ExerciseList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resWorkouts, resCategories, resExercises] = await Promise.all([
          fetch("/api/gymtracker/workout/list"),
          fetch("/api/gymtracker/category/list"),
          fetch("/api/gymtracker/exercise/getUserId"),
        ]);

        const [workoutsRes, categoriesRes, exercisesRes] = await Promise.all([
          resWorkouts.json(),
          resCategories.json(),
          resExercises.json(),
        ]);

        const workouts = Array.isArray(workoutsRes)
          ? workoutsRes
          : workoutsRes.data || [];
        const allCategories = Array.isArray(categoriesRes)
          ? categoriesRes
          : categoriesRes.data || [];
        const exercises = Array.isArray(exercisesRes)
          ? exercisesRes
          : exercisesRes.data || [];

        const categoryMap = {};
        allCategories.forEach((cat) => {
          categoryMap[cat._id] = { name: cat.name, icon: cat.icon };
        });

        const workoutMap = {};
        workouts.forEach((w) => {
          const id = w.exerciseUserId._id;
          if (!workoutMap[id]) workoutMap[id] = [];
          workoutMap[id].push({
            date: w.date,
            series: w.series,
            notes: w.notes,
          });
        });

        const merged = exercises.map((exercise) => {
          const cat = categoryMap[exercise.category] || {};
          const records = (workoutMap[exercise._id] || []).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          return {
            id: exercise._id,
            name: exercise.name,
            categoryId: exercise.category,
            categoryName: cat.name || "Desconocida",
            icon: cat.icon || "Dumbbell",
            records,
          };
        });

        const usedCategoryIds = new Set(merged.map((e) => e.categoryId));
        const filteredCategories = allCategories.filter((cat) =>
          usedCategoryIds.has(cat._id)
        );
        setCategories(filteredCategories);

        const sortedItems = merged.sort((a, b) => {
          const da = a.records[0]?.date ? new Date(a.records[0].date) : 0;
          const db = b.records[0]?.date ? new Date(b.records[0].date) : 0;
          return db - da;
        });

        setItems(sortedItems);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.categoryId === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  if (loading)
    return <p className="text-center py-8">Cargando ejercicios...</p>;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg border border-dashed">
        <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">No hay ejercicios</h2>
        <p className="text-muted-foreground mb-4">
          Comenzá agregando tu primer ejercicio
        </p>
        <Link href="/dashboard/exercise/new">
          <Button className="rounded-full shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Ejercicio
          </Button>
        </Link>
      </div>
    );
  }

  const confirmDelete = async () => {
    if (!exerciseToDelete) return;
    try {
      const res = await fetch("/api/gymtracker/exercise/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: exerciseToDelete.id }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.filter((item) => item.id !== exerciseToDelete.id)
        );
        setExerciseToDelete(null);
      } else {
        console.error("Error al eliminar ejercicio");
      }
    } catch (err) {
      console.error("Error de red al eliminar ejercicio", err);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ExerciseFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        clearFilters={clearFilters}
        categoryIcons={iconMap}
      />

      {filteredItems.map((exercise) => {
        // Ordenar registros: más reciente a más antiguo
        const sortedRecords = [...exercise.records].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Último y penúltimo registro
        const lastRecord = sortedRecords[0];
        const prevRecord = sortedRecords[1];

        // Cálculo de pesos
        const lastMax = lastRecord
          ? Math.max(...lastRecord.series.map((s) => s.weight))
          : 0;
        const prevMax = prevRecord
          ? Math.max(...prevRecord.series.map((s) => s.weight))
          : 0;
        const diff = lastRecord && prevRecord ? lastMax - prevMax : 0;

        const Icon = iconMap[exercise.icon] || Dumbbell;

        return (
          <Card
            key={exercise.id}
            className="overflow-hidden hover:shadow-md transition-all border pt-0 pb-2"
          >
            <div className="bg-primary/5 p-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-md">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  {exercise.categoryName}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/dashboard/exercise/${exercise.id}`}>
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setExerciseToDelete(exercise)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardContent className="p-4 pt-0">
              <h3 className="text-lg font-semibold mb-3">{exercise.name}</h3>

              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Último peso máximo:
                  </p>
                  <p className="text-2xl font-bold">
                    {lastRecord ? `${lastMax} kg` : "Sin registros"}
                  </p>
                  {lastRecord?.series.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {lastRecord.series.length}{" "}
                      {lastRecord.series.length === 1 ? "serie" : "series"} en
                      total
                    </p>
                  )}
                </div>

                {diff !== 0 && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      diff > 0
                        ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                        : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {diff > 0 ? "+" : ""}
                    {diff} kg
                  </div>
                )}
              </div>

              {lastRecord?.date && (
                <p className="text-xs text-muted-foreground mb-3">
                  Último entrenamiento:{" "}
                  {new Date(lastRecord.date).toLocaleDateString("es-AR", {
                    timeZone: "UTC",
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}

              <Link href={`/dashboard/exercise/${exercise.id}`}>
                <Button
                  variant="outline"
                  className="w-full group hover:border-primary/50"
                >
                  Ver progreso
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
      {exerciseToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">¿Eliminar ejercicio?</h2>
            <p className="text-muted-foreground mb-6">
              Esta acción eliminará también sus registros. ¿Estás seguro?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setExerciseToDelete(null)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
