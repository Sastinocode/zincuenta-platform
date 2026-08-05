import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StaffHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Bienvenido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>Sesión iniciada como {user?.email}.</p>
        <p>
          Los módulos (CRM, Ejercicioteca, Sesiones, BodyMAP) todavía no están
          implementados.
        </p>
      </CardContent>
    </Card>
  );
}
