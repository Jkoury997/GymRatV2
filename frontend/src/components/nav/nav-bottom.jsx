// components/BottomNav.jsx
"use client"

import Link from "next/link"
import { Dumbbell, TrendingUp, User } from "lucide-react"

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around items-center z-50">
      <Link href="/dashboard" className="flex flex-col items-center p-2 text-primary">
        <Dumbbell className="h-5 w-5" />
        <span className="text-xs font-medium">Ejercicios</span>
      </Link>
      {/* Link deshabilitado con texto "Próximamente" */}
      <div className="flex flex-col items-center p-2 text-muted-foreground opacity-40 cursor-not-allowed">
        <TrendingUp className="h-5 w-5" />
        <span className="text-xs font-medium">Próximamente</span>
      </div>
      <Link href="/dashboard/profile" className="flex flex-col items-center p-2 text-muted-foreground">
        <User className="h-5 w-5" />
        <span className="text-xs font-medium">Perfil</span>
      </Link>
    </nav>
  )
}
