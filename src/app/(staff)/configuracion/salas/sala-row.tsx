"use client";

import { useState, useTransition } from "react";

import { actualizarSala } from "./actions";
import { Input } from "@/components/ui/input";

interface Sala {
  id: string;
  nombre: string;
  pin: string;
  activa: boolean;
}

export function SalaRow({ sala }: { sala: Sala }) {
  const [nombre, setNombre] = useState(sala.nombre);
  const [pin, setPin] = useState(sala.pin);
  const [activa, setActiva] = useState(sala.activa);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function guardar(cambios: { nombre?: string; pin?: string; activa?: boolean }) {
    setError(null);
    startTransition(async () => {
      const result = await actualizarSala(sala.id, cambios);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2 border-b border-border py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-2">
        <Input
          value={nombre}
          disabled={pending}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() =>
            nombre.trim() &&
            nombre.trim() !== sala.nombre &&
            guardar({ nombre: nombre.trim() })
          }
          className="max-w-[10rem]"
        />
        <Input
          value={pin}
          disabled={pending}
          inputMode="numeric"
          onChange={(e) => setPin(e.target.value)}
          onBlur={() =>
            /^\d{4,6}$/.test(pin) && pin !== sala.pin && guardar({ pin })
          }
          className="max-w-[6rem]"
        />
      </div>
      <div className="flex items-center gap-3">
        {error && <p className="text-xs text-destructive">{error}</p>}
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={activa}
            disabled={pending}
            onChange={(e) => {
              setActiva(e.target.checked);
              guardar({ activa: e.target.checked });
            }}
          />
          Activa
        </label>
      </div>
    </div>
  );
}
