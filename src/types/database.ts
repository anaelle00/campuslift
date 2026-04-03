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
      comment_reactions: {
        Row: {
          comment_id: string;
          created_at: string;
          reaction_type: "like" | "dislike";
          user_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          reaction_type: "like" | "dislike";
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          reaction_type?: "like" | "dislike";
          user_id?: string;
        };
        Relationships: [];
      };
      comment_reports: {
        Row: {
          comment_id: string;
          created_at: string;
          details: string | null;
          id: string;
          reason: "spam" | "harassment" | "hate" | "misinformation" | "other";
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: "open" | "resolved" | "dismissed";
          user_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          details?: string | null;
          id?: string;
          reason: "spam" | "harassment" | "hate" | "misinformation" | "other";
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: "open" | "resolved" | "dismissed";
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          details?: string | null;
          id?: string;
          reason?: "spam" | "harassment" | "hate" | "misinformation" | "other";
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: "open" | "resolved" | "dismissed";
          user_id?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          body: string;
          created_at: string;
          deleted_at: string | null;
          id: string;
          parent_id: string | null;
          project_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          parent_id?: string | null;
          project_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          parent_id?: string | null;
          project_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string | null;
          id: string;
          project_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          project_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          project_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      pledges: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          project_id: string;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          project_id: string;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          project_id?: string;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          display_name: string | null;
          id: string;
          organization: string | null;
          phone: string | null;
          role: "user" | "admin";
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          display_name?: string | null;
          id: string;
          organization?: string | null;
          phone?: string | null;
          role?: "user" | "admin";
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          display_name?: string | null;
          id?: string;
          organization?: string | null;
          phone?: string | null;
          role?: "user" | "admin";
          username?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          category: string;
          created_at: string;
          current_amount: number;
          deadline: string;
          description: string;
          id: string;
          image_url: string;
          owner_id: string;
          owner_name: string;
          owner_username: string;
          short_description: string;
          status: "draft" | "published" | "archived";
          supporters_count: number;
          target_amount: number;
          title: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          current_amount?: number;
          deadline: string;
          description: string;
          id?: string;
          image_url: string;
          owner_id: string;
          owner_name: string;
          owner_username: string;
          short_description: string;
          status?: "draft" | "published" | "archived";
          supporters_count?: number;
          target_amount: number;
          title: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          current_amount?: number;
          deadline?: string;
          description?: string;
          id?: string;
          image_url?: string;
          owner_id?: string;
          owner_name?: string;
          owner_username?: string;
          short_description?: string;
          status?: "draft" | "published" | "archived";
          supporters_count?: number;
          target_amount?: number;
          title?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      record_stripe_support: {
        Args: {
          p_amount: number;
          p_checkout_session_id: string;
          p_payment_intent_id: string | null;
          p_project_id: string;
          p_user_id: string;
        };
        Returns: {
          already_processed: boolean;
          current_amount: number;
          supporters_count: number;
        }[];
      };
      support_project: {
        Args: {
          p_amount: number;
          p_project_id: string;
        };
        Returns: {
          current_amount: number;
          supporters_count: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
