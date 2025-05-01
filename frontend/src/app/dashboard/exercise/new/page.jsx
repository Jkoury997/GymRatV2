"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {Shirt,Footprints,Dumbbell,Armchair,HeartPulse,Activity,Infinity,Move3D,HelpCircle,ArrowLeft,Search,QrCode,Plus} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const iconMap = {
    Shirt,
    Footprints,
    Dumbbell,
    Armchair,
    HeartPulse,
    Activity,
    Infinity,
    Move3D,
    HelpCircle
}

export default function AgregarEjercicio() {
  const router = useRouter()

  const [apiCategories, setApiCategories] = useState([])
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [machineId, setMachineId] = useState("")
  const [exerciseGeneral,setExerciseGeneral] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("category")
  const [searchCategory, setSearchCategory] = useState("")
  const [filteredExercises, setFilteredExercises] = useState([])

  // Fetch categorías con ejercicios desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/gymtracker/category/list") // Reemplazá con tu URL real
        const data = await res.json()
        setApiCategories(data.data)
      } catch (error) {
        console.error("Error al obtener categorías:", error)
      }
    }

    fetchCategories()
  }, [])

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !category) return
  
    setIsSubmitting(true)

    const payload = {
      name,
      category,
      ...(exerciseGeneral && { exerciseGeneral }),
      ...(machineId && { machineId }),
    }
  
  
    if (exerciseGeneral) payload.exerciseGeneral = exerciseGeneral
    if (machineId) payload.machineId = machineId
  


    try {
      const res = await fetch(`/api/gymtracker/exercise/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
  
      const data = await res.json()
      console.log(data)
  
      if (!res.ok) {
        console.error("❌ Error:", data.error || "No se pudo crear el ejercicio")
        return
      }
  
      console.log("✅ Ejercicio creado:", data)
      router.push("/dashboard")
    } catch (err) {
      console.error("❌ Error de red o servidor:", err.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  

  // Filtrar ejercicios por categoría seleccionada
  const filterExercisesByCategory = (categoryId) => {
    setSearchCategory(categoryId)
    const selected = apiCategories.find((c) => c._id === categoryId)
    setFilteredExercises(selected?.exercises || [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-16">
      <div className="container max-w-md py-6 p-2">
        <Button variant="ghost" className="mb-4 group" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Volver
        </Button>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Nuevo Ejercicio</CardTitle>
            </div>
            <CardDescription>Crea un nuevo ejercicio para hacer seguimiento</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" />
                  Manual
                </TabsTrigger>
                <TabsTrigger value="category" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Por Categoría
                </TabsTrigger>
                {/*
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Escanear QR
                </TabsTrigger>
                */}
              </TabsList>

              {/* TAB: MANUAL */}
              <TabsContent value="manual">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Ejercicio</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Press de Banca"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Categoría</Label>
                    <RadioGroup value={category} onValueChange={setCategory} className="grid grid-cols-2 gap-2">
                      {apiCategories.map((cat) => (
                        <div key={cat._id} className="flex items-center space-x-2">
                          <RadioGroupItem value={cat._id} id={cat._id} className="peer sr-only" />
                          <Label
                            htmlFor={cat._id}
                            className="flex items-center gap-2 w-full p-3 border rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <span className="text-primary font-medium">{cat.name}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 mt-6 shadow-sm"
                    disabled={isSubmitting || !name || !category}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar Ejercicio"}
                  </Button>
                </form>
              </TabsContent>

              {/* TAB: POR CATEGORÍA */}
              <TabsContent value="category">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Selecciona una categoría</Label>
                    <RadioGroup
                      value={searchCategory}
                      onValueChange={filterExercisesByCategory}
                      className="grid grid-cols-2 gap-2"
                    >
                      {apiCategories.map((cat) => {
                        const Icon = iconMap[cat.icon] || Dumbbell // fallback en caso de que no venga o sea inválido

                        return (
                            <div key={cat._id} className="flex items-center space-x-2">
                            <RadioGroupItem value={cat._id} id={`search-${cat._id}`} className="peer sr-only" />
                            <Label
                              htmlFor={`search-${cat._id}`}
                              className="flex items-center gap-2 w-full p-3 border rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                            >
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="text-primary font-medium">{cat.name}</span>
                            </Label>
                          </div>
                        )
})}
                    </RadioGroup>
                  </div>

                  {searchCategory && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">
                        Ejercicios de {apiCategories.find((c) => c._id === searchCategory)?.name}
                      </h3>
                      {filteredExercises.length > 0 ? (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {filteredExercises.map((exercise) => (
                            <div
                              key={exercise._id}
                              className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => {
                                setExerciseGeneral(exercise._id)
                                setName(exercise.name)
                                setCategory(exercise.category)
                                setActiveTab("manual")
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{exercise.name}</p>
                                  <p className="text-xs text-muted-foreground">
  {apiCategories.find((cat) => cat._id === exercise.category)?.name || "Categoría desconocida"}
</p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-muted/20 rounded-lg">
                          <p className="text-muted-foreground">No hay ejercicios en esta categoría</p>
                        </div>
                      )}
                    </div>
                  )}

                  <Button type="button" variant="outline" onClick={() => setActiveTab("manual")} className="w-full">
                    Volver al modo manual
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
