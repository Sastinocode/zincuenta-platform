import { getStaffProfile } from "@/lib/auth/profile";
import { ModulePlaceholder } from "@/components/staff/module-placeholder";

export default async function SesionesPage() {
  const profile = await getStaffProfile();

  if (profile?.rol === "gestion") {
    return (
      <ModulePlaceholder
        title="Agenda"
        description="La vista de sesiones programadas por día llega en MP-5."
      />
    );
  }

  return (
    <ModulePlaceholder
      title="Sesiones"
      description="El creador de sesiones, la agenda y el historial llegan en MP-5, MP-6 y MP-7."
    />
  );
}
