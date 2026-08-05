"use client";

import { useState, useTransition } from "react";

import { actualizarUsuarioStaff } from "./actions";
import type { Rol } from "@/lib/auth/profile";

const ROLES: { value: Rol; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "gestion", label: "Gestión" },
  { value: "entrenador", label: "Entrenador" },
];

interface Perfil {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
}

export function UsuarioRow({ profile }: { profile: Perfil }) {
  const [rol, setRol] = useState(profile.rol);
  const [activo, setActivo] = useState(profile.activo);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRolChange(nuevoRol: Rol) {
    setRol(nuevoRol);
    setError(null);
    startTransition(async () => {
      const result = await actualizarUsuarioStaff(profile.id, { rol: nuevoRol });
      if (result?.error) setError(result.error);
    });
  }

  function handleActivoChange(nuevoActivo: boolean) {
    setActivo(nuevoActivo);
    setError(null);
    startTransition(async () => {
      const result = await actualizarUsuarioStaff(profile.id, {
        activo: nuevoActivo,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2 border-b border-border py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{profile.nombre}</p>
        <p className="text-xs text-muted-foreground">{profile.email}</p>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <div className="flex items-center gap-3">
        <select
          className="h-9 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50"
          value={rol}
          disabled={pending}
          onChange={(e) => handleRolChange(e.target.value as Rol)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={activo}
            disabled={pending}
            onChange={(e) => handleActivoChange(e.target.checked)}
          />
          Activo
        </label>
      </div>
    </div>
  );
}
