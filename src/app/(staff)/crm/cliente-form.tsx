"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Entrenador {
  id: string;
  nombre: string;
}

interface ClienteFormValues {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  sexo: string;
  entrenador_id: string;
  estado: string;
  notas: string;
}

interface ClienteFormProps {
  entrenadores: Entrenador[];
  defaultValues?: Partial<ClienteFormValues>;
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>;
  submitLabel: string;
  readOnly?: boolean;
}

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50";

export function ClienteForm({
  entrenadores,
  defaultValues,
  onSubmit,
  submitLabel,
  readOnly = false,
}: ClienteFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            required
            disabled={readOnly}
            defaultValue={defaultValues?.nombre}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            name="apellidos"
            disabled={readOnly}
            defaultValue={defaultValues?.apellidos}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            disabled={readOnly}
            defaultValue={defaultValues?.email}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            disabled={readOnly}
            defaultValue={defaultValues?.telefono}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
          <Input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            disabled={readOnly}
            defaultValue={defaultValues?.fecha_nacimiento}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sexo">Sexo</Label>
          <select
            id="sexo"
            name="sexo"
            disabled={readOnly}
            defaultValue={defaultValues?.sexo ?? ""}
            className={selectClassName}
          >
            <option value="">Sin especificar</option>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="entrenador_id">Entrenador asignado</Label>
          <select
            id="entrenador_id"
            name="entrenador_id"
            disabled={readOnly}
            defaultValue={defaultValues?.entrenador_id ?? ""}
            className={selectClassName}
          >
            <option value="">Sin asignar</option>
            {entrenadores.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="estado">Estado</Label>
          <select
            id="estado"
            name="estado"
            disabled={readOnly}
            defaultValue={defaultValues?.estado ?? "activo"}
            className={selectClassName}
          >
            <option value="activo">Activo</option>
            <option value="pausado">Pausado</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notas">Notas</Label>
        <textarea
          id="notas"
          name="notas"
          disabled={readOnly}
          defaultValue={defaultValues?.notas}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {readOnly ? (
        <p className="text-xs text-muted-foreground">
          Solo puedes ver este cliente: no está asignado a ti.
        </p>
      ) : (
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : submitLabel}
        </Button>
      )}
    </form>
  );
}
