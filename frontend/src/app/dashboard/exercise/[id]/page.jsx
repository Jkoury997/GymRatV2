"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ExerciseHeader from "@/components/excersice/exercise-header";
import TrainingDialog from "@/components/excersice/tarining-dialogue";
import SummaryCards from "@/components/excersice/summary-card";
import TabContent from "@/components/excersice/tab-content";
import NoRecordsMessage from "@/components/excersice/no-records-message";
import BottomNav from "@/components/nav/nav-bottom";
import TrainingFixedDialog from "@/components/excersice/traingin-dialogue-first";

export default function EjercicioDetalle({ params }) {
  const { id } = use(params);              // desempaqueta el id
  const router = useRouter();

  const [exercise, setExercise] = useState(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenFirst, setDialogOpenFirst] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  // toggle para expandir/colapsar cada registro
  const toggleExpandRecord = (date) => {
    setExpandedRecord(prev => (prev === date ? null : date));
  };

  useEffect(() => {
    if (id)  fetchRecords();
  }, [id]);  // sólo id

  const fetchRecords = async () => {
    setIsLoading(true); // comenzar carga
    try {
      const res = await fetch(
        `/api/gymtracker/workout/listbyid?exerciseUserId=${encodeURIComponent(id)}`
      );
      const resdata = await res.json();
  
      if (!res.ok) throw new Error(resdata.error || "Error fetching");
  
      const records = Array.isArray(resdata.data) ? resdata.data : [];
  
      if (records.length > 0) {
        const info = records[0].exerciseUserId;
        setExercise({
          id: info._id,
          name: info.name,
          category: info.category?.name ?? "Sin categoría",
          categoryIcon: info.category?.icon ?? null,
          records: records.map(r => ({
            date: r.date,
            series: r.series,
            notes: r.notes,
          })),
        });
      } else {
        setExercise(null);
        setDialogOpenFirst(true);
      }
    } catch (error) {
      console.error("❌ fetchRecords:", error);
      router.push("/dashboard");
    } finally {
      setIsLoading(false); // terminó carga
    }
  };
  
  if (isLoading || exercise === undefined) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  // si no hay exercise, mostramos sólo el diálogo
  if (!isLoading && exercise === null) {
    return (
      <div className="container py-6 flex justify-center items-center min-h-[50vh] p-3">
        <TrainingFixedDialog
          dialogOpenFirst={dialogOpenFirst}
          setDialogOpenFirst={setDialogOpenFirst}
          exerciseUserId={id}
          onSuccess={fetchRecords}
        />
      </div>
    );
  }
  

  // cálculos auxiliares

  const sortedRecords = [...exercise.records].sort(
    // Para que firstRecord sea el más antiguo, orden ascendente; 
    // si querés al revés invertí a new Date(b.date) - new Date(a.date)
    (a, b) => new Date(a.date) - new Date(b.date)
  );


  const hasRecords = exercise?.records?.length > 0;
  const maxWeight = hasRecords
    ? Math.max(...exercise.records.flatMap(r => r.series.map(s => s.weight)))
    : 0;

  const sorted = [...exercise.records].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const initialMax = sorted.length
    ? Math.max(...sorted[0].series.map(s => s.weight))
    : 0;
  const latestMax = sorted.length
    ? Math.max(...sorted.at(-1).series.map(s => s.weight))
    : 0;
  const totalProgress = latestMax - initialMax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-3 pb-16">
      <div className="container max-w-4xl py-6 space-y-6">
        <ExerciseHeader
          exercise={exercise}
          router={router}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />

        <TrainingDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          exerciseUserId={id}
          onSuccess={fetchRecords}
        />

        {hasRecords ? (
          <>
            <SummaryCards
              maxWeight={maxWeight}
              totalProgress={totalProgress}
              firstRecord={sortedRecords[0]}
              recordsCount={sortedRecords.length}
            />

            <TabContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              exercise={{
                ...exercise.meta,
                records: sortedRecords,
              }}
              expandedRecord={expandedRecord}
              toggleExpandRecord={toggleExpandRecord}
            />
          </>
        ) : (
          <NoRecordsMessage
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
