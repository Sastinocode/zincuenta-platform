import type { Rol } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  /** Si true, solo se marca activo con match exacto (no por prefijo). */
  exact?: boolean;
}

export const NAV_BY_ROL: Record<Rol, NavItem[]> = {
  admin: [
    { href: "/crm", label: "CRM" },
    { href: "/ejercicios", label: "Ejercicios" },
    { href: "/sesiones", label: "Sesiones" },
    { href: "/bodymap", label: "BodyMAP" },
    { href: "/configuracion", label: "Configuración" },
  ],
  gestion: [
    { href: "/crm", label: "CRM" },
    { href: "/sesiones", label: "Agenda" },
    { href: "/bodymap", label: "BodyMAP" },
  ],
  entrenador: [
    { href: "/crm", label: "CRM" },
    { href: "/ejercicios", label: "Ejercicios" },
    { href: "/sesiones", label: "Sesiones" },
    { href: "/bodymap", label: "BodyMAP" },
  ],
};

export const ROL_LABEL: Record<Rol, string> = {
  admin: "Admin",
  gestion: "Gestión",
  entrenador: "Entrenador",
};
