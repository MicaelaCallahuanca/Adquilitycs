export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          contacto_principal: string | null
          created_at: string
          estado: Database["public"]["Enums"]["cliente_estado"]
          fecha_inicio: string | null
          fee_mensual: number | null
          horas_contratadas_mes: number | null
          id: string
          nivel_riesgo: Database["public"]["Enums"]["nivel_riesgo"]
          nombre: string
          proxima_fecha_clave: string | null
          servicios_activos: string[]
          tipo: Database["public"]["Enums"]["cliente_tipo"] | null
          updated_at: string
        }
        Insert: {
          contacto_principal?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["cliente_estado"]
          fecha_inicio?: string | null
          fee_mensual?: number | null
          horas_contratadas_mes?: number | null
          id?: string
          nivel_riesgo?: Database["public"]["Enums"]["nivel_riesgo"]
          nombre: string
          proxima_fecha_clave?: string | null
          servicios_activos?: string[]
          tipo?: Database["public"]["Enums"]["cliente_tipo"] | null
          updated_at?: string
        }
        Update: {
          contacto_principal?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["cliente_estado"]
          fecha_inicio?: string | null
          fee_mensual?: number | null
          horas_contratadas_mes?: number | null
          id?: string
          nivel_riesgo?: Database["public"]["Enums"]["nivel_riesgo"]
          nombre?: string
          proxima_fecha_clave?: string | null
          servicios_activos?: string[]
          tipo?: Database["public"]["Enums"]["cliente_tipo"] | null
          updated_at?: string
        }
        Relationships: []
      }
      semanas: {
        Row: {
          capacidad_disponible_h: number
          created_at: string
          id: string
          notas_revision: string | null
          revision_viernes_hecha: boolean
          semana_fin: string
          semana_inicio: string
          updated_at: string
        }
        Insert: {
          capacidad_disponible_h?: number
          created_at?: string
          id?: string
          notas_revision?: string | null
          revision_viernes_hecha?: boolean
          semana_fin: string
          semana_inicio: string
          updated_at?: string
        }
        Update: {
          capacidad_disponible_h?: number
          created_at?: string
          id?: string
          notas_revision?: string | null
          revision_viernes_hecha?: boolean
          semana_fin?: string
          semana_inicio?: string
          updated_at?: string
        }
        Relationships: []
      }
      sops: {
        Row: {
          created_at: string
          dueño: string | null
          estado: Database["public"]["Enums"]["sop_estado"]
          id: string
          nombre: string
          pasos: Json
          servicio: Database["public"]["Enums"]["sop_servicio"] | null
          tipo: Database["public"]["Enums"]["sop_tipo"]
          ultima_actualizacion: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dueño?: string | null
          estado?: Database["public"]["Enums"]["sop_estado"]
          id?: string
          nombre: string
          pasos?: Json
          servicio?: Database["public"]["Enums"]["sop_servicio"] | null
          tipo?: Database["public"]["Enums"]["sop_tipo"]
          ultima_actualizacion?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dueño?: string | null
          estado?: Database["public"]["Enums"]["sop_estado"]
          id?: string
          nombre?: string
          pasos?: Json
          servicio?: Database["public"]["Enums"]["sop_servicio"] | null
          tipo?: Database["public"]["Enums"]["sop_tipo"]
          ultima_actualizacion?: string
          updated_at?: string
        }
        Relationships: []
      }
      tareas: {
        Row: {
          bloqueada_por: string | null
          categoria: Database["public"]["Enums"]["tarea_categoria"] | null
          cliente_id: string | null
          created_at: string
          deadline_interno: string | null
          deadline_real: string | null
          esfuerzo: string | null
          esfuerzo_horas: number | null
          estado: Database["public"]["Enums"]["tarea_estado"]
          fecha_cierre: string | null
          id: string
          impacto: Database["public"]["Enums"]["tarea_impacto"] | null
          nombre: string
          notas: string | null
          prioridad_score: number | null
          semana_id: string | null
          sop_id: string | null
          subtipo: string | null
          tiempo_estimado_horas: number | null
          tiempo_real_horas: number | null
          updated_at: string
          urgencia: Database["public"]["Enums"]["tarea_urgencia"] | null
        }
        Insert: {
          bloqueada_por?: string | null
          categoria?: Database["public"]["Enums"]["tarea_categoria"] | null
          cliente_id?: string | null
          created_at?: string
          deadline_interno?: string | null
          deadline_real?: string | null
          esfuerzo?: string | null
          esfuerzo_horas?: number | null
          estado?: Database["public"]["Enums"]["tarea_estado"]
          fecha_cierre?: string | null
          id?: string
          impacto?: Database["public"]["Enums"]["tarea_impacto"] | null
          nombre: string
          notas?: string | null
          prioridad_score?: number | null
          semana_id?: string | null
          sop_id?: string | null
          subtipo?: string | null
          tiempo_estimado_horas?: number | null
          tiempo_real_horas?: number | null
          updated_at?: string
          urgencia?: Database["public"]["Enums"]["tarea_urgencia"] | null
        }
        Update: {
          bloqueada_por?: string | null
          categoria?: Database["public"]["Enums"]["tarea_categoria"] | null
          cliente_id?: string | null
          created_at?: string
          deadline_interno?: string | null
          deadline_real?: string | null
          esfuerzo?: string | null
          esfuerzo_horas?: number | null
          estado?: Database["public"]["Enums"]["tarea_estado"]
          fecha_cierre?: string | null
          id?: string
          impacto?: Database["public"]["Enums"]["tarea_impacto"] | null
          nombre?: string
          notas?: string | null
          prioridad_score?: number | null
          semana_id?: string | null
          sop_id?: string | null
          subtipo?: string | null
          tiempo_estimado_horas?: number | null
          tiempo_real_horas?: number | null
          updated_at?: string
          urgencia?: Database["public"]["Enums"]["tarea_urgencia"] | null
        }
        Relationships: [
          {
            foreignKeyName: "tareas_bloqueada_por_fkey"
            columns: ["bloqueada_por"]
            isOneToOne: false
            referencedRelation: "tareas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "v_clientes_metricas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_semana_id_fkey"
            columns: ["semana_id"]
            isOneToOne: false
            referencedRelation: "semanas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_semana_id_fkey"
            columns: ["semana_id"]
            isOneToOne: false
            referencedRelation: "v_semanas_metricas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_sop_id_fkey"
            columns: ["sop_id"]
            isOneToOne: false
            referencedRelation: "sops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_sop_id_fkey"
            columns: ["sop_id"]
            isOneToOne: false
            referencedRelation: "v_sops_metricas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_clientes_metricas: {
        Row: {
          alerta_capacidad: string | null
          contacto_principal: string | null
          created_at: string | null
          estado: Database["public"]["Enums"]["cliente_estado"] | null
          fecha_inicio: string | null
          fee_mensual: number | null
          horas_consumidas_mes: number | null
          horas_contratadas_mes: number | null
          id: string | null
          nivel_riesgo: Database["public"]["Enums"]["nivel_riesgo"] | null
          nombre: string | null
          proxima_fecha_clave: string | null
          rentabilidad: number | null
          servicios_activos: string[] | null
          tipo: Database["public"]["Enums"]["cliente_tipo"] | null
          updated_at: string | null
        }
        Relationships: []
      }
      v_semanas_metricas: {
        Row: {
          capacidad_asignada_h: number | null
          capacidad_disponible_h: number | null
          created_at: string | null
          id: string | null
          notas_revision: string | null
          pct_capacidad_usada: number | null
          revision_viernes_hecha: boolean | null
          semana_fin: string | null
          semana_inicio: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      v_sops_metricas: {
        Row: {
          created_at: string | null
          dueño: string | null
          estado: Database["public"]["Enums"]["sop_estado"] | null
          id: string | null
          nombre: string | null
          pasos: Json | null
          servicio: Database["public"]["Enums"]["sop_servicio"] | null
          tipo: Database["public"]["Enums"]["sop_tipo"] | null
          ultima_actualizacion: string | null
          updated_at: string | null
          usado_en_tareas: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cliente_estado: "Activo" | "Onboarding" | "En pausa" | "Cerrado"
      cliente_tipo: "Empresa fija" | "Freelance" | "Nuevo"
      nivel_riesgo: "Bajo" | "Medio" | "Alto"
      sop_estado: "Vigente" | "Necesita revisión" | "Obsoleto"
      sop_servicio:
        | "SEO"
        | "Ads"
        | "Tracking"
        | "Auditoría"
        | "Onboarding"
        | "Reportes"
        | "Cierre mensual"
        | "Facturación"
        | "QA"
      sop_tipo: "Proceso" | "Checklist" | "Plantilla"
      tarea_categoria: "Producción" | "Comercial" | "Gestión" | "Formación"
      tarea_estado:
        | "Backlog"
        | "Esta semana"
        | "Hoy"
        | "En progreso"
        | "Esperando cliente"
        | "En revisión"
        | "Hecho"
      tarea_impacto: "Alto" | "Medio" | "Bajo"
      tarea_urgencia: "Hoy" | "Esta semana" | "Próxima semana"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cliente_estado: ["Activo", "Onboarding", "En pausa", "Cerrado"],
      cliente_tipo: ["Empresa fija", "Freelance", "Nuevo"],
      nivel_riesgo: ["Bajo", "Medio", "Alto"],
      sop_estado: ["Vigente", "Necesita revisión", "Obsoleto"],
      sop_servicio: [
        "SEO",
        "Ads",
        "Tracking",
        "Auditoría",
        "Onboarding",
        "Reportes",
        "Cierre mensual",
        "Facturación",
        "QA",
      ],
      sop_tipo: ["Proceso", "Checklist", "Plantilla"],
      tarea_categoria: ["Producción", "Comercial", "Gestión", "Formación"],
      tarea_estado: [
        "Backlog",
        "Esta semana",
        "Hoy",
        "En progreso",
        "Esperando cliente",
        "En revisión",
        "Hecho",
      ],
      tarea_impacto: ["Alto", "Medio", "Bajo"],
      tarea_urgencia: ["Hoy", "Esta semana", "Próxima semana"],
    },
  },
} as const
