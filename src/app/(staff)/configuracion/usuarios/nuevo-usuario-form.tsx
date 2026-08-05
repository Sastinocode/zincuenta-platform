"use client";

import { useRef, useState, useTransition } from "react";

import { crearUsuarioStaff } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NuevoUsuarioForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [passwordCreada, setPasswordCreada] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    setPasswordCreada(null);
    startTransition(async () => {
      const result = await crearUsuarioStaff(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.success) {
        setPasswordCreada(result.password);
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 rounded-lg border border-border bg-card p-4"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rol">Rol</Label>
          <select
            id="rol"
            name="rol"
            defaultValue="entrenador"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="admin">Admin</option>
            <option value="gestion">Gestión</option>
            <option value="entrenador">Entrenador</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {passwordCreada && (
        <p className="rounded-md bg-accent p-2 text-sm text-accent-foreground">
          Usuario creado. Contraseña temporal: <strong>{passwordCreada}</strong>
          {" "}— compártela y pide que la cambie al entrar.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Creando…" : "Crear usuario"}
      </Button>
    </form>
  );
}
