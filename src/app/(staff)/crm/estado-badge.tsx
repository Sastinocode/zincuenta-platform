const ESTADO_STYLES: Record<string, string> = {
  activo: "bg-accent text-accent-foreground",
  pausado: "bg-amber-100 text-amber-800",
  baja: "bg-muted text-muted-foreground",
};

const ESTADO_LABEL: Record<string, string> = {
  activo: "Activo",
  pausado: "Pausado",
  baja: "Baja",
};

export function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        ESTADO_STYLES[estado] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {ESTADO_LABEL[estado] ?? estado}
    </span>
  );
}
