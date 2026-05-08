export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          created_at: string | null;
          current_period_end: string | null;
          id: string;
          plan: "free" | "pro" | "enterprise";
          status: "active" | "canceled" | "past_due";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          current_period_end?: string | null;
          id?: string;
          plan?: "free" | "pro" | "enterprise";
          status?: "active" | "canceled" | "past_due";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          current_period_end?: string | null;
          id?: string;
          plan?: "free" | "pro" | "enterprise";
          status?: "active" | "canceled" | "past_due";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      generations: {
        Row: {
          created_at: string | null;
          id: string;
          model: string;
          output: string;
          prompt: string;
          tokens_used: number | null;
          type: "blog" | "email" | "social" | "code";
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          model?: string;
          output: string;
          prompt: string;
          tokens_used?: number | null;
          type: "blog" | "email" | "social" | "code";
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          model?: string;
          output?: string;
          prompt?: string;
          tokens_used?: number | null;
          type?: "blog" | "email" | "social" | "code";
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
