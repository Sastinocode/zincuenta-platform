// Tipos de la BBDD (Supabase), escritos a mano para las tablas de los
// Bloques 1 (CORE) y 2 (CRM) ya aplicados. A medida que se apliquen más
// bloques, o cuando haya acceso al CLI de Supabase, regenerar completo con:
// `npx supabase gen types typescript --project-id <id> > src/lib/types.ts`

export type Rol = "admin" | "gestion" | "entrenador";
export type TipoSeguimiento = "nota" | "llamada" | "incidencia" | "revision";

export interface Database {
  public: {
    Tables: {
      core_profiles: {
        Row: {
          id: string;
          nombre: string;
          email: string;
          rol: Rol;
          activo: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          nombre: string;
          email: string;
          rol: Rol;
          activo?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["core_profiles"]["Insert"]>;
        Relationships: [];
      };
      core_clientes: {
        Row: {
          id: string;
          nombre: string;
          apellidos: string | null;
          email: string | null;
          telefono: string | null;
          fecha_nacimiento: string | null;
          sexo: "M" | "F" | "otro" | null;
          entrenador_id: string | null;
          estado: "activo" | "pausado" | "baja";
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          apellidos?: string | null;
          email?: string | null;
          telefono?: string | null;
          fecha_nacimiento?: string | null;
          sexo?: "M" | "F" | "otro" | null;
          entrenador_id?: string | null;
          estado?: "activo" | "pausado" | "baja";
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["core_clientes"]["Insert"]>;
        Relationships: [];
      };
      core_salas: {
        Row: {
          id: string;
          nombre: string;
          pin: string;
          device_token: string;
          activa: boolean;
        };
        Insert: {
          id?: string;
          nombre: string;
          pin: string;
          device_token?: string;
          activa?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["core_salas"]["Insert"]>;
        Relationships: [];
      };
      crm_seguimientos: {
        Row: {
          id: string;
          cliente_id: string;
          autor_id: string;
          tipo: TipoSeguimiento;
          texto: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          autor_id: string;
          tipo?: TipoSeguimiento;
          texto: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["crm_seguimientos"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
