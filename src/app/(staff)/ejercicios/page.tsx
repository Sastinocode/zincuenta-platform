import { requireRol } from "@/lib/auth/profile";
import { ModulePlaceholder } from "@/components/staff/module-placeholder";

export default async function EjerciciosPage() {
  await requireRol(["admin", "entrenador"]);

  return (
    <ModulePlaceholder
      title="Ejercicioteca"
      description="El listado de los 137 ejercicios llega en MP-4."
    />
  );
}
