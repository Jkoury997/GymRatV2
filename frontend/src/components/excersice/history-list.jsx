"use client";

import React from "react";
import HistoryListItem from "@/components/excersice/records-card";

export default function HistoryList({ records, expandedRecord, toggleExpandRecord }) {
  // Ordena de más reciente a más viejo
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-4">
      {sortedRecords.map((record, index) => {
        const previousRecord =
          index < sortedRecords.length - 1
            ? sortedRecords[index + 1]
            : null;

        return (
          <HistoryListItem
            key={`${record.date}-${index}`} 
            record={record}
            isExpanded={expandedRecord === record.date}
            toggleExpandRecord={toggleExpandRecord}
            previousRecord={previousRecord}
          />
        );
      })}
    </div>
  );
}
