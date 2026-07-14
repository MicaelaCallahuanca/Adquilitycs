export type UserRole = "internal" | "client";
export type ContentPlatform =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "landing"
  | "other";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "customer"
  | "lost";
export type ProjectStatus = "kickoff" | "active" | "paused" | "completed";
export type ScopeOwner = "agency" | "client";
export type TaskStatus = "pending" | "in_progress" | "done";
export type FindingArea =
  | "adquisicion"
  | "tracking"
  | "analytics"
  | "embudo"
  | "landing_pages"
  | "conversiones";
export type FindingImpact = "alto" | "medio" | "bajo";
export type FindingStatus = "identificado" | "en_progreso" | "resuelto";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id?: string; name: string; created_at?: string };
        Update: { id?: string; name?: string; created_at?: string };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole;
          organization_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          organization_id?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
          organization_id?: string | null;
        };
        Relationships: [];
      };
      content_items: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          platform: ContentPlatform;
          url: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          platform: ContentPlatform;
          url?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          platform?: ContentPlatform;
          url?: string | null;
          published_at?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          organization_id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          content_id: string | null;
          status: LeadStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          content_id?: string | null;
          status?: LeadStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          content_id?: string | null;
          status?: LeadStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      lead_notes: {
        Row: {
          id: string;
          lead_id: string;
          author_id: string | null;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          author_id?: string | null;
          body: string;
          created_at?: string;
        };
        Update: { body?: string };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          status: ProjectStatus;
          started_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          status?: ProjectStatus;
          started_at?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          status?: ProjectStatus;
          started_at?: string | null;
        };
        Relationships: [];
      };
      scope_items: {
        Row: {
          id: string;
          project_id: string;
          description: string;
          owner: ScopeOwner;
          status: TaskStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          description: string;
          owner: ScopeOwner;
          status?: TaskStatus;
          created_at?: string;
        };
        Update: {
          description?: string;
          owner?: ScopeOwner;
          status?: TaskStatus;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          week_of: string | null;
          status: TaskStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          week_of?: string | null;
          status?: TaskStatus;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          week_of?: string | null;
          status?: TaskStatus;
        };
        Relationships: [];
      };
      growth_findings: {
        Row: {
          id: string;
          project_id: string;
          area: FindingArea;
          problema: string;
          consecuencia: string | null;
          solucion: string | null;
          impacto: FindingImpact;
          prioridad: number;
          status: FindingStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          area: FindingArea;
          problema: string;
          consecuencia?: string | null;
          solucion?: string | null;
          impacto: FindingImpact;
          prioridad?: number;
          status?: FindingStatus;
          created_at?: string;
        };
        Update: {
          area?: FindingArea;
          problema?: string;
          consecuencia?: string | null;
          solucion?: string | null;
          impacto?: FindingImpact;
          prioridad?: number;
          status?: FindingStatus;
        };
        Relationships: [];
      };
      monthly_reports: {
        Row: {
          id: string;
          project_id: string;
          period_month: number;
          period_year: number;
          summary: string | null;
          metrics: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          period_month: number;
          period_year: number;
          summary?: string | null;
          metrics?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          summary?: string | null;
          metrics?: Record<string, unknown> | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
