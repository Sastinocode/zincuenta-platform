"use client";

import { useRef, useState, useTransition } from "react";

import { crearSeguimiento } from "../../actions";
import { Button } from "@/components/ui/button";

const TIPOS = [
  { value: "nota", label: "Nota" },
  { value: "llamada", label: "Llamada" },
  { value: "incidencia", label: "Incidencia" },
  { value: "revision", label: "Revisión" },
];

export function SeguimientoForm({ clienteId }: { clienteId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await crearSeguimiento(clienteId, formData);
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
      className="space-y-2 rounded-lg border border-border bg-card p-3"
    >
      <select
        name="tipo"
        defaultValue="nota"
        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
      >
        {TIPOS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <textarea
        name="texto"
        required
        rows={2}
        placeholder="Escribe una nota…"
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Guardando…" : "Añadir nota"}
      </Button>
    </form>
  );
}
