"use client"

import Link from "next/link"
import { Dumbbell, Plus, TrendingUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
//import { ExerciseFilter } from "@/components/excersice/filter"



 import { ExerciseList } from "@/components/excersice/list-exercise"
import BottomNav from "@/components/nav/nav-bottom"
// import { UserGreeting } from "@/components/user-greeting"
// import { SessionCheck } from "@/components/session-check"


export default function Home() {
    return (
      <>
        {/*<SessionCheck />*/}
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-3">
        <div className="container max-w-4xl py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Gymo</h1>
                <p className="text-muted-foreground text-sm">Registra tus pesos y sigue tu progreso</p>
              </div>
            </div>
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-muted/50">
                <User className="h-6 w-6 " />
                <span className="sr-only">Perfil</span>
              </Button>
            </Link>
          </div>
  
            {/* Componente de saludo y frase motivadora */}
            {/*<UserGreeting />*/}
  
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Mis Ejercicios</h2>
            </div>
            <Link href="/dashboard/exercise/new">
              <Button className="rounded-full shadow-md hover:shadow-lg transition-all">
                <Plus className="mr-1 h-4 w-4" />
                Nuevo Ejercicio
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border">
              <ExerciseList />
              </div>
        </div>

        <BottomNav></BottomNav>
      </div>
    </>
    )
  }