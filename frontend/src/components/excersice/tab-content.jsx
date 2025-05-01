"use client";

import React from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import WeightChart from "@/components/excersice/weight-chart";
import HistoryList from "@/components/excersice/history-list";

export default function TabContent({ activeTab, setActiveTab, exercise, expandedRecord, toggleExpandRecord }) {
  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "chart" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("chart")}
        >
          <TrendingUp className="h-4 w-4" />
          Gráfico
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "history" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("history")}
        >
          <Calendar className="h-4 w-4" />
          Historial
        </button>
      </div>

      {activeTab === "chart" ? (
        <div className="p-4">
          <div >
  <WeightChart records={exercise.records} />
</div>
        </div>
      ) : (
        <div className="p-4">
          <HistoryList
            records={exercise.records}
            expandedRecord={expandedRecord}
            toggleExpandRecord={toggleExpandRecord}
          />
        </div>
      )}
    </div>
  );
}
