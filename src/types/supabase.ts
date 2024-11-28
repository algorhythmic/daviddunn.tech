export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analytics_apps: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          url: string
          display_order: number
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          url: string
          display_order?: number
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          url?: string
          display_order?: number
          status?: string
        }
      }
      app_analytics: {
        Row: {
          id: string
          created_at: string
          app_id: string
          event_type: string
          event_data: Json
          timestamp: string
        }
        Insert: {
          id?: string
          created_at?: string
          app_id: string
          event_type: string
          event_data: Json
          timestamp?: string
        }
        Update: {
          id?: string
          created_at?: string
          app_id?: string
          event_type?: string
          event_data?: Json
          timestamp?: string
        }
      }
      streamlit_apps: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          url: string
          display_order: number
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          url: string
          display_order?: number
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          url?: string
          display_order?: number
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
