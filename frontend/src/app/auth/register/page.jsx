"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AtSign, Dumbbell, Eye, EyeOff, Lock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegistroPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [sex, setSex] = useState("Other")
  const [birthDate, setBirthDate] = useState("")
  const [mobile, setMobile] = useState("")
  const [role, setRole] = useState("user")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleNextStep = () => {
    setError("")

    if (!name.trim()) return setError("Por favor, ingresa tu nombre")
    if (!lastName.trim()) return setError("Por favor, ingresa tu apellido")
    if (!validateEmail(email)) return setError("Por favor, ingresa un email válido")
    if (!birthDate) return setError("Por favor, selecciona tu fecha de nacimiento")
    if (!mobile.trim() || mobile.length < 8) return setError("Por favor, ingresa un teléfono válido")

    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres")
    if (password !== confirmPassword) return setError("Las contraseñas no coinciden")

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: name,
          lastName,
          email,
          password,
          sex,
          birthDate,
          mobile,
          role,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "No se pudo registrar")

      localStorage.setItem("userProfile", JSON.stringify(data.user))
      localStorage.setItem(
        "userSession",
        JSON.stringify({ email: data.user.email, role: data.user.role || role, loggedIn: true })
      )

      router.push("/auth/login")
    } catch (error) {
      console.error("Error al registrar:", error)
      setError(error.message || "Error inesperado al registrar.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">GymTracker</CardTitle>
          <CardDescription>Crea una nueva cuenta para comenzar</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" autoComplete="given-name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="lastName" autoComplete="family-name" placeholder="Tu apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} className="pl-10 h-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" autoComplete="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                  <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="h-12" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Teléfono</Label>
                  <Input id="mobile" type="tel" autoComplete="tel" placeholder="Ej: 1123456789" value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-12" required />
                </div>

                <div className="space-y-2">
                  <Label>Sexo</Label>
                  <RadioGroup value={sex} onValueChange={setSex} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Male" id="male" />
                      <Label htmlFor="male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Female" id="female" />
                      <Label htmlFor="female">Femenino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Other" id="other" />
                      <Label htmlFor="other">Otro</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de cuenta</Label>
                  <RadioGroup value={role} onValueChange={setRole} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user">Alumno</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="trainer" id="trainer" />
                      <Label htmlFor="trainer">Entrenador</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="button" className="w-full h-12" onClick={handleNextStep}>
                  Continuar
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" autoComplete="new-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12" required />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-12 w-12 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">La contraseña debe tener al menos 6 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="confirmPassword" autoComplete="new-password" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 pr-10 h-12" required />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-12 w-12 text-muted-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button type="button" variant="outline" className="w-1/2 h-12" onClick={() => setStep(1)}>
                    Atrás
                  </Button>
                  <Button type="submit" className="w-1/2 h-12" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                        Registrando...
                      </span>
                    ) : (
                      "Crear cuenta"
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <span>¿Ya tienes una cuenta? </span>
            <Link href="/auth/login" className="text-primary hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
