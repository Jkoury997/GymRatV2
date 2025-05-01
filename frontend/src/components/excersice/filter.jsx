"use client"

import React from "react"
import { Search, X, Filter as FilterIcon, Dumbbell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * ExerciseFilter
 *
 * Props:
 * - searchTerm: string
 * - onSearchChange: (value: string) => void
 * - clearSearchTerm: () => void
 * - categories: Category[]
 * - selectedCategory: string | null
 * - onCategorySelect: (categoryId: string) => void
 * - clearFilters: () => void
 * - categoryIcons: Record<string, React.ComponentType<any>>
 */
export function ExerciseFilter({
  categories,
  selectedCategory = null,
  onCategorySelect,
  clearFilters,
  categoryIcons = {},
}) {
  return (
    <div className="space-y-4">
      

        <div className="flex flex-wrap gap-2 mb-1">
          {categories.map((category) => {
            const isSelected = selectedCategory === category._id
            const CategoryIcon = categoryIcons[category.icon] || Dumbbell

            return (
              <Badge
                key={category._id}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer ${isSelected ? "bg-primary" : "hover:bg-primary/10"}`}
                onClick={() => onCategorySelect(category._id)}
              >
                <CategoryIcon className="h-3 w-3 mr-1" />
                {category.name}
              </Badge>
            )
          })}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
          </div>
          {selectedCategory && (

            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
  )
}
