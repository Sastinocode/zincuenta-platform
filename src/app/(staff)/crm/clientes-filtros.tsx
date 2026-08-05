"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Entrenador {
  id: string;
  nombre: string;
}

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-40";

export function ClientesFiltros({ entrenadores }: { entrenadores: Entrenador[] }) {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action="/crm"
      method="get"
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex-1 space-y-1.5">
        <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
          Buscar
        </label>
        <Input
          id="q"
          name="q"
          placeholder="Nombre o email"
          defaultValue={searchParams.get("q") ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="estado" className="text-xs font-medium text-muted-foreground">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          defaultValue={searchParams.get("estado") ?? ""}
          onChange={() => formRef.current?.requestSubmit()}
          className={selectClassName}
        >
          <option value="">Todos</option>
          <option value="activo">Activo</option>
          <option value="pausado">Pausado</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="entrenador" className="text-xs font-medium text-muted-foreground">
          Entrenador
        </label>
        <select
          id="entrenador"
          name="entrenador"
          defaultValue={searchParams.get("entrenador") ?? ""}
          onChange={() => formRef.current?.requestSubmit()}
          className={selectClassName}
        >
          <option value="">Todos</option>
          {entrenadores.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="semaforo" className="text-xs font-medium text-muted-foreground">
          Semáforo BodyMAP
        </label>
        <select
          id="semaforo"
          disabled
          title="Disponible cuando se implemente BodyMAP (MP-3)"
          className={`${selectClassName} cursor-not-allowed text-muted-foreground opacity-60`}
        >
          <option>Próximamente</option>
        </select>
      </div>

      <Button type="submit" size="sm">
        Buscar
      </Button>
    </form>
  );
}
