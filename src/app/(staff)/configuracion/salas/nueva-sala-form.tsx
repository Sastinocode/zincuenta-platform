"use client";

import { useRef, useState, useTransition } from "react";

import { crearSala } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NuevaSalaForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await crearSala(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 rounded-lg border border-border bg-card p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre de la sala</Label>
          <Input id="nombre" name="nombre" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pin">PIN (4-6 dígitos)</Label>
          <Input id="pin" name="pin" inputMode="numeric" pattern="\d{4,6}" required />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Creando…" : "Crear sala"}
      </Button>
    </form>
  );
}
