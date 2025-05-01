"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, AtSign, Check, Dumbbell, Eye, EyeOff, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Pasos del proceso de recuperación
// "email" | "otp" | "newPassword" | "success"

export default function RecuperarPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState("email")
  const [countdown, setCountdown] = useState(0)
  const [verifiedOtp, setVerifiedOtp] = useState("");

  // Manejar el contador para reenviar OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Función para validar email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Función para solicitar OTP enviando el email a la API de recuperación de contraseña
const requestOtp = async () => {
  setError("");
  setSuccess("");

  // Validamos el formato del email antes de enviarlo
  if (!validateEmail(email)) {
    setError("Por favor, ingresa un email válido");
    return;
  }

  setIsSubmitting(true);

  try {
    // Realiza la petición POST al endpoint de recuperación
    const response = await fetch("/api/auth/recovery/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    // Si la respuesta no es exitosa, mostrará el error
    if (!response.ok) {
      setError(data.error || "Ocurrió un error al enviar el OTP");
      setIsSubmitting(false);
      return;
    }

    // Si el envío es exitoso, se muestra un mensaje y se avanza al siguiente paso
    setSuccess(`Código OTP enviado a ${email}`);
    setCurrentStep("otp");
    setCountdown(120); // Se inicia el contador de 60 segundos (opcional)

  } catch (error) {
    console.error("Error al solicitar OTP:", error);
    setError("Ocurrió un error en el servidor");
  } finally {
    setIsSubmitting(false);
  }
};


  // Función para manejar cambios en los campos de OTP
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && !/^\d+$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Mover al siguiente campo si se ingresó un dígito
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  // Función para manejar la tecla de retroceso en OTP
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  // Función para verificar OTP
  const verifyOtp = async () => {
    setError("");
    const enteredOtp = otp.join("");
  
    if (enteredOtp.length !== 6) {
      setError("Por favor, ingresa el código completo de 6 dígitos");
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/recovery/verifyotponly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,         // Asegúrate de que la variable 'email' esté definida en el scope
          otpCode: enteredOtp
        })
      });
  
      const { data } = await response.json();

  
      if (!response.ok) {
        // Si la respuesta no es OK, se muestra el error devuelto por la API
        setError(data.error || "Error al verificar OTP.");
      } else {
        // Se verifica la propiedad isValidOTP
        if (data.isValidOTP) {
          setVerifiedOtp(enteredOtp); // ← guardás el OTP verificado
          setCurrentStep("newPassword");
        } else {
          setError("Código OTP incorrecto. Inténtalo de nuevo.");
        }
      }
    } catch (err) {
      console.error("Error al verificar OTP:", err);
      setError("Error al verificar OTP, por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Función para reenviar OTP
  const resendOtp = () => {
    // Generar nuevo OTP
    requestOtp()

    setSuccess(`Nuevo código OTP enviado a ${email}`)
    setCountdown(200) // Reiniciar contador
  }

  // Función para establecer nueva contraseña
  const setNewPasswordHandler = async () => {
    setError("");
  
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const res = await fetch("/api/auth/recovery/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          otpCode: verifiedOtp,           // Asegurate que tenés este valor guardado
          newPassword: newPassword
        })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || "Error al cambiar la contraseña");
      } else {
        console.log(data.message); // Mensaje del backend
        setCurrentStep("success");
      }
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      setError("Ocurrió un error al conectar con el servidor.");
    }
  
    setIsSubmitting(false);
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
          <CardDescription>
            {currentStep === "email" && "Ingresa tu email para recibir un código de verificación"}
            {currentStep === "otp" && "Ingresa el código de verificación enviado a tu email"}
            {currentStep === "newPassword" && "Establece tu nueva contraseña"}
            {currentStep === "success" && "¡Tu contraseña ha sido actualizada con éxito!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4 mr-2" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {currentStep === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <Button type="button" className="w-full h-12" onClick={requestOtp} disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  "Enviar código de verificación"
                )}
              </Button>
            </div>
          )}

          {currentStep === "otp" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-0">Código de verificación</Label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="h-14 text-center text-xl font-bold w-12"
                      autoComplete="off"
                    />
                  ))}
                </div>
                <div className="text-center mt-2">
                  {countdown > 0 ? (
                    <p className="text-sm text-muted-foreground">Reenviar código en {countdown} segundos</p>
                  ) : (
                    <Button type="button" variant="link" className="p-0 h-auto text-sm" onClick={resendOtp}>
                      ¿No recibiste el código? Reenviar
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="w-1/2 h-12" onClick={() => setCurrentStep("email")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atrás
                </Button>
                <Button
                  type="button"
                  className="w-1/2 h-12"
                  onClick={verifyOtp}
                  disabled={isSubmitting || otp.join("").length !== 6}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                      Verificando...
                    </span>
                  ) : (
                    "Verificar"
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === "newPassword" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">La contraseña debe tener al menos 6 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                  </Button>
                </div>
              </div>

              <Button type="button" className="w-full h-12" onClick={setNewPasswordHandler} disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                    Actualizando...
                  </span>
                ) : (
                  "Actualizar contraseña"
                )}
              </Button>
            </div>
          )}

          {currentStep === "success" && (
            <div className="space-y-4 text-center">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg flex flex-col items-center">
                <div className="bg-green-100 p-2 rounded-full mb-2">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium">¡Contraseña actualizada con éxito!</p>
                <p className="text-sm mt-1">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              </div>

              <Button type="button" className="w-full h-12" onClick={() => router.push("/auth/login")}>
                Ir a iniciar sesión
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-primary hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a iniciar sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

