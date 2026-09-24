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
      app_config: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          body: string
          channel: string
          created_at: string
          error: string | null
          id: string
          provider_sid: string | null
          recipient: Database["public"]["Enums"]["notify_recipient"]
          reservation_id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["notify_status"]
          to_phone: string
        }
        Insert: {
          body: string
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          provider_sid?: string | null
          recipient: Database["public"]["Enums"]["notify_recipient"]
          reservation_id: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notify_status"]
          to_phone: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          provider_sid?: string | null
          recipient?: Database["public"]["Enums"]["notify_recipient"]
          reservation_id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notify_status"]
          to_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          code: string
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          pickup_by: string | null
          qty: number
          status: Database["public"]["Enums"]["reservation_status"]
          store_id: string
          total_price: number | null
          unit_price: number
          updated_at: string
          wine_id: string
        }
        Insert: {
          code?: string
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          pickup_by?: string | null
          qty?: number
          status?: Database["public"]["Enums"]["reservation_status"]
          store_id: string
          total_price?: number | null
          unit_price?: number
          updated_at?: string
          wine_id: string
        }
        Update: {
          code?: string
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          pickup_by?: string | null
          qty?: number
          status?: Database["public"]["Enums"]["reservation_status"]
          store_id?: string
          total_price?: number | null
          unit_price?: number
          updated_at?: string
          wine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wines"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          city: string
          created_at: string
          hours: string | null
          id: string
          image: string | null
          is_active: boolean
          lat: number | null
          lng: number | null
          name: string
          neighborhood: string | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string
          slug: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string
          created_at?: string
          hours?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          name: string
          neighborhood?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone: string
          slug: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          hours?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          name?: string
          neighborhood?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      wines: {
        Row: {
          category: string | null
          country: string | null
          created_at: string
          id: string
          image: string | null
          is_active: boolean
          name: string
          notes: string | null
          pairing: string | null
          price: number
          producer: string | null
          region: string | null
          slug: string
          stock_qty: number
          store_id: string
          updated_at: string
          varietal: string | null
          vintage: string | null
        }
        Insert: {
          category?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image?: string | null
          is_active?: boolean
          name: string
          notes?: string | null
          pairing?: string | null
          price: number
          producer?: string | null
          region?: string | null
          slug: string
          stock_qty?: number
          store_id: string
          updated_at?: string
          varietal?: string | null
          vintage?: string | null
        }
        Update: {
          category?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image?: string | null
          is_active?: boolean
          name?: string
          notes?: string | null
          pairing?: string | null
          price?: number
          producer?: string | null
          region?: string | null
          slug?: string
          stock_qty?: number
          store_id?: string
          updated_at?: string
          varietal?: string | null
          vintage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wines_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      notify_recipient: "store_owner" | "super_admin"
      notify_status: "pending" | "sent" | "failed"
      reservation_status:
        | "received"
        | "preparing"
        | "ready"
        | "picked_up"
        | "cancelled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      notify_recipient: ["store_owner", "super_admin"],
      notify_status: ["pending", "sent", "failed"],
      reservation_status: [
        "received",
        "preparing",
        "ready",
        "picked_up",
        "cancelled",
      ],
    },
  },
} as const
