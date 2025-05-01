"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserTrainerLink({ profile, onChange  }) {
  const [trainerCode, setTrainerCode] = useState("");
  const [trainerDialogOpen, setTrainerDialogOpen] = useState(false);
  const [trainerLinkStatus, setTrainerLinkStatus] = useState(null); // "success", "error", null
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    if (profile?.links?.length > 0) {
      setSelectedTrainer(profile.links[0]);
    }
  }, [profile?.links]);

  const handleTrainerCodeSubmit = async () => {
    setTrainerLinkStatus(null);

    try {
      const res = await fetch("/api/auth/trainer/trainerlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkCode: trainerCode }),
      });

      if (!res.ok) throw new Error("Vinculación fallida");

      const data = await res.json();
      console.log(data)
      setTrainerLinkStatus("success");
      setSelectedTrainer(data.trainer);
      setTrainerDialogOpen(false);
      onChange?.(); // 👈 notificar al padre
    } catch (err) {
      console.error("❌ Error al vincular entrenador:", err);
      setTrainerLinkStatus("error");
    }
  };

  const unlinkTrainer = async () => {
    try {
      const res = await fetch("/api/auth/trainer/trainerunlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Desvinculación fallida");

      setSelectedTrainer(null);
      setTrainerLinkStatus("");
      setTrainerCode("")
      onChange?.(); // 👈 notificar al padre


    } catch (err) {
      console.error("❌ Error al desvincular entrenador:", err);
    }
  };

  return (
    <div className="space-y-2 bg-muted/20 p-4 rounded-lg">
      <Label className="flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-muted-foreground" />
        Vincular con Entrenador
      </Label>

      {selectedTrainer ? (
        <div className="mt-2 flex items-center justify-between bg-primary/5 p-3 rounded-lg">
          <div>
            <p className="text-sm font-medium">Entrenador actual:</p>
            <p className="text-primary font-medium">
              {selectedTrainer.firstName
                ? `${selectedTrainer.firstName} ${selectedTrainer.lastName ?? ""}`
                : selectedTrainer.email}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={unlinkTrainer}
            className="text-destructive hover:text-destructive "
          >
            Desvincular
          </Button>
        </div>
      ) : (
        <Dialog open={trainerDialogOpen} onOpenChange={setTrainerDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full mt-1">
              <UserPlus className="mr-2 h-4 w-4" />
              Vincular con Entrenador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vincular con Entrenador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="trainer-code">Código de Entrenador</Label>
                <Input
                  id="trainer-code"
                  placeholder="Ej: AAABBB"
                  value={trainerCode}
                  onChange={(e) => setTrainerCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Pedile a tu entrenador su código para vincularte.
                </p>
              </div>

              {trainerLinkStatus === "success" && (
                <div className="bg-green-500/10 text-green-600 p-3 rounded-lg flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <p className="text-sm">¡Vinculación exitosa!</p>
                </div>
              )}
              {trainerLinkStatus === "error" && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <p className="text-sm">Código no válido. Intentalo de nuevo.</p>
                </div>
              )}

              <Button
                type="button"
                className="w-full"
                onClick={handleTrainerCodeSubmit}
                disabled={!trainerCode.trim() || trainerLinkStatus === "success"}
              >
                Vincular
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <p className="text-xs text-muted-foreground mt-2">
        Vincularte con un entrenador le permitirá ver tu progreso y ayudarte con tus entrenamientos.
      </p>
    </div>
  );
}
