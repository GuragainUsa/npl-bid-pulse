export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      auction_state: {
        Row: {
          auction_active: boolean | null
          created_at: string | null
          current_bid: number | null
          current_player_id: number | null
          highest_bidder: string | null
          id: number
          lucky_draw_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          auction_active?: boolean | null
          created_at?: string | null
          current_bid?: number | null
          current_player_id?: number | null
          highest_bidder?: string | null
          id?: number
          lucky_draw_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auction_active?: boolean | null
          created_at?: string | null
          current_bid?: number | null
          current_player_id?: number | null
          highest_bidder?: string | null
          id?: number
          lucky_draw_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_state_current_player_id_fkey"
            columns: ["current_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          base_price: number
          batting_role: string | null
          bowling_role: string | null
          category: string
          created_at: string | null
          first_name: string
          id: number
          image_url: string | null
          interested_teams: string[] | null
          last_name: string
          middle_name: string | null
          player_type: string
          province: string
          sn: number
          sold_price: number | null
          status: string | null
          team_name: string | null
          updated_at: string | null
          wicket_keeper: boolean | null
        }
        Insert: {
          base_price: number
          batting_role?: string | null
          bowling_role?: string | null
          category: string
          created_at?: string | null
          first_name: string
          id?: number
          image_url?: string | null
          interested_teams?: string[] | null
          last_name: string
          middle_name?: string | null
          player_type: string
          province: string
          sn: number
          sold_price?: number | null
          status?: string | null
          team_name?: string | null
          updated_at?: string | null
          wicket_keeper?: boolean | null
        }
        Update: {
          base_price?: number
          batting_role?: string | null
          bowling_role?: string | null
          category?: string
          created_at?: string | null
          first_name?: string
          id?: number
          image_url?: string | null
          interested_teams?: string[] | null
          last_name?: string
          middle_name?: string | null
          player_type?: string
          province?: string
          sn?: number
          sold_price?: number | null
          status?: string | null
          team_name?: string | null
          updated_at?: string | null
          wicket_keeper?: boolean | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string | null
          display_name: string
          grade_a_count: number | null
          grade_b_count: number | null
          grade_c_count: number | null
          id: number
          local_talent_count: number | null
          marquee_count: number | null
          name: string
          remaining_purse: number | null
          total_purse: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          grade_a_count?: number | null
          grade_b_count?: number | null
          grade_c_count?: number | null
          id?: number
          local_talent_count?: number | null
          marquee_count?: number | null
          name: string
          remaining_purse?: number | null
          total_purse?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          grade_a_count?: number | null
          grade_b_count?: number | null
          grade_c_count?: number | null
          id?: number
          local_talent_count?: number | null
          marquee_count?: number | null
          name?: string
          remaining_purse?: number | null
          total_purse?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
