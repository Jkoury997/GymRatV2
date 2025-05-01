"use client"
import { Spinner } from "@/components/ui/spinner"

export function LoadingScreen({ message = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground font-medium">{message}</p>
    </div>
  )
}
