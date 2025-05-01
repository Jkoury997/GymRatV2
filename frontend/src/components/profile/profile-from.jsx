"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User } from "lucide-react";

 import {Button} from "@/components/ui/button"
 import {Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription} from "@/components/ui/card"
 import {Input} from "@/components/ui/input"
 import {Label}from "@/components/ui/label"
  import {Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue}from "@/components/ui/select"


import LogoutButton from "@/components/profile/logout-buttom";
import BottomNav from "@/components/nav/nav-bottom";

export default function ProfileForm({
  profile,
  setProfile,
  onSubmit,
  children
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) await onSubmit(profile);
      else console.log("Perfil guardado:", profile);

      setTimeout(() => setIsSubmitting(false), 1000);
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-3 pb-16">
      <div className="container max-w-md py-4">
        <Card className="shadow-sm">
          <CardHeader >
            <div className="flex items-center gap-2">
              <CardTitle>Tu Perfil</CardTitle>
            </div>
            <CardDescription>
              Personaliza tu experiencia en GymTracker
            </CardDescription>
          </CardHeader>

          <CardContent>
          <div className="flex items-center gap-2 mb-3">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <Label className="font-medium">Datos personales</Label>
                </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="Tu nombre"
                    value={profile.firstName || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="Tu apellido"
                    value={profile.lastName || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
                

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={profile.email || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Teléfono</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="+54 11 0000 0000"
                      value={profile.mobile || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, mobile: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profile.birthDate?.slice(0, 10) || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, birthDate: e.target.value })
                        
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sex">Género</Label>
                    <Select
                      value={profile.sex || ""}
                      onValueChange={(value) =>
                        setProfile({ ...profile, sex: value })
                      }
                    >
                      <SelectTrigger id="sex" className="w-full">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Masculino</SelectItem>
                        <SelectItem value="Female">Femenino</SelectItem>
                        <SelectItem value="Other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {children}


              <Button
                type="submit"
                className="w-full h-11 mt-6 shadow-sm"
                disabled={isSubmitting || !profile.firstName}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Perfil
                  </span>
                )}
              </Button>
            
            
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
