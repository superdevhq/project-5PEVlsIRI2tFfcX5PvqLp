export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          age: number | null
          created_at: string
          email: string | null
          goals: string | null
          height: number | null
          id: string
          join_date: string
          name: string
          notes: string | null
          phone: string | null
          profile_image: string | null
          trainer_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          email?: string | null
          goals?: string | null
          height?: number | null
          id?: string
          join_date?: string
          name: string
          notes?: string | null
          phone?: string | null
          profile_image?: string | null
          trainer_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          email?: string | null
          goals?: string | null
          height?: number | null
          id?: string
          join_date?: string
          name?: string
          notes?: string | null
          phone?: string | null
          profile_image?: string | null
          trainer_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          name: string
          notes: string | null
          order_index: number
          reps: number
          rest_time: number
          sets: number
          updated_at: string
          weight: number | null
          workout_plan_id: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          name: string
          notes?: string | null
          order_index: number
          reps: number
          rest_time: number
          sets: number
          updated_at?: string
          weight?: number | null
          workout_plan_id: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          name?: string
          notes?: string | null
          order_index?: number
          reps?: number
          rest_time?: number
          sets?: number
          updated_at?: string
          weight?: number | null
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          fats: number
          id: string
          meal_id: string
          name: string
          protein: number
          quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string
          fats: number
          id?: string
          meal_id: string
          name: string
          protein: number
          quantity: number
          unit: string
          updated_at?: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          fats?: number
          id?: string
          meal_id?: string
          name?: string
          protein?: number
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "foods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string
          id: string
          name: string
          nutrition_plan_id: string
          order_index: number
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          nutrition_plan_id: string
          order_index: number
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          nutrition_plan_id?: string
          order_index?: number
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_nutrition_plan_id_fkey"
            columns: ["nutrition_plan_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
          sender_type: string
          timestamp: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
          sender_type: string
          timestamp?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
          sender_type?: string
          timestamp?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_plans: {
        Row: {
          carbs_grams: number
          client_id: string
          created_at: string
          daily_calories: number
          description: string | null
          end_date: string
          fats_grams: number
          id: string
          name: string
          protein_grams: number
          start_date: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          carbs_grams: number
          client_id: string
          created_at?: string
          daily_calories: number
          description?: string | null
          end_date: string
          fats_grams: number
          id?: string
          name: string
          protein_grams: number
          start_date: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          carbs_grams?: number
          client_id?: string
          created_at?: string
          daily_calories?: number
          description?: string | null
          end_date?: string
          fats_grams?: number
          id?: string
          name?: string
          protein_grams?: number
          start_date?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_plans_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_photos: {
        Row: {
          created_at: string
          id: string
          photo_url: string
          progress_record_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_url: string
          progress_record_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_url?: string
          progress_record_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_progress_record_id_fkey"
            columns: ["progress_record_id"]
            isOneToOne: false
            referencedRelation: "progress_records"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_records: {
        Row: {
          arms: number | null
          chest: number | null
          client_id: string
          created_at: string
          date: string
          hips: number | null
          id: string
          notes: string | null
          thighs: number | null
          updated_at: string
          waist: number | null
          weight: number
        }
        Insert: {
          arms?: number | null
          chest?: number | null
          client_id: string
          created_at?: string
          date?: string
          hips?: number | null
          id?: string
          notes?: string | null
          thighs?: number | null
          updated_at?: string
          waist?: number | null
          weight: number
        }
        Update: {
          arms?: number | null
          chest?: number | null
          client_id?: string
          created_at?: string
          date?: string
          hips?: number | null
          id?: string
          notes?: string | null
          thighs?: number | null
          updated_at?: string
          waist?: number | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          end_date: string
          id: string
          name: string
          start_date: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
