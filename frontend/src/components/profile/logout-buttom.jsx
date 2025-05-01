"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Llamada a tu API para cerrar sesión (borrar cookies, invalidar tokens, etc.)
      await fetch("/api/auth/logout", {
        method: "GET", //
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  
    // Redirigir al login
    router.push("/auth/login");
  };
  

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2 text-muted-foreground hover:text-destructive"
    >
      <LogOut className="h-4 w-4" />
      <span>Cerrar sesión</span>
    </Button>
  )
}
