import { getStaffProfile } from "@/lib/auth/profile";
import { NAV_BY_ROL, ROL_LABEL } from "@/lib/nav";
import { StaffNav } from "@/components/staff/nav";
import { SignOutButton } from "./sign-out-button";

export default async function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getStaffProfile();

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Tu cuenta no tiene un perfil de staff asociado todavía. Pide a un
          administrador que te dé de alta en Configuración.
        </p>
        <SignOutButton />
      </div>
    );
  }

  if (!profile.activo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Tu cuenta de staff está desactivada. Contacta con un administrador.
        </p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <span className="text-lg font-semibold text-primary">Zincuenta</span>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {profile.nombre} · {ROL_LABEL[profile.rol]}
          </span>
          <SignOutButton />
        </div>
      </header>
      <StaffNav items={NAV_BY_ROL[profile.rol]} />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
