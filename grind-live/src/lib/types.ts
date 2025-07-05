// Ce type sera à compléter avec le schéma réel Supabase généré via supabase gen types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url: string | null;
          xp: number;
          level: number;
          bio: string | null;
          goal: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          avatar_url?: string | null;
          xp?: number;
          level?: number;
          bio?: string | null;
          goal?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          avatar_url?: string | null;
          xp?: number;
          level?: number;
          bio?: string | null;
          goal?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          date: string;
          duration: number | null;
          total_volume: number | null;
          notes: string | null;
          status: 'draft' | 'in_progress' | 'completed' | 'live';
          is_live: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          date: string;
          duration?: number | null;
          total_volume?: number | null;
          notes?: string | null;
          status?: 'draft' | 'in_progress' | 'completed' | 'live';
          is_live?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          date?: string;
          duration?: number | null;
          total_volume?: number | null;
          notes?: string | null;
          status?: 'draft' | 'in_progress' | 'completed' | 'live';
          is_live?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          muscle_groups: string[] | null;
          equipment: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description?: string | null;
          muscle_groups?: string[] | null;
          equipment?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          muscle_groups?: string[] | null;
          equipment?: string[] | null;
          created_at?: string;
        };
      };
      exercise_logs: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          sets: number;
          reps: number | null;
          weight: number | null;
          duration: number | null;
          distance: number | null;
          rest_time: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_id: string;
          exercise_id: string;
          sets: number;
          reps?: number | null;
          weight?: number | null;
          duration?: number | null;
          distance?: number | null;
          rest_time?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_id?: string;
          exercise_id?: string;
          sets?: number;
          reps?: number | null;
          weight?: number | null;
          duration?: number | null;
          distance?: number | null;
          rest_time?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      xp_history: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          description: string;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          description: string;
          source: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          description?: string;
          source?: string;
          created_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          xp_reward: number;
          criteria: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          xp_reward?: number;
          criteria?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          xp_reward?: number;
          criteria?: Json | null;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          date_awarded: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          date_awarded?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          date_awarded?: string;
        };
      };
      friendships: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          image_url: string | null;
          workout_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          image_url?: string | null;
          workout_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          image_url?: string | null;
          workout_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      user_stats: {
        Row: {
          id: string | null;
          username: string | null;
          xp: number | null;
          level: number | null;
          total_workouts: number | null;
          live_workouts: number | null;
          total_badges: number | null;
          total_friends: number | null;
          last_workout_date: string | null;
        };
      };
    };
    Functions: {
      get_activity_feed: {
        Args: {
          user_uuid: string;
          limit_count?: number;
        };
        Returns: {
          id: string;
          type: string;
          content: string;
          user_id: string;
          username: string;
          avatar_url: string | null;
          created_at: string;
          data: Json;
        }[];
      };
    };
  };
};

// Types utilitaires pour faciliter l'utilisation
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Types spécifiques pour les tables principales
export type User = Tables<'users'>;
export type Workout = Tables<'workouts'>;
export type Exercise = Tables<'exercises'>;
export type ExerciseLog = Tables<'exercise_logs'>;
export type XpHistory = Tables<'xp_history'>;
export type Badge = Tables<'badges'>;
export type UserBadge = Tables<'user_badges'>;
export type Friendship = Tables<'friendships'>;
export type Post = Tables<'posts'>;
export type Comment = Tables<'comments'>;
export type Like = Tables<'likes'>;
export type Notification = Tables<'notifications'>;

// Types pour les insertions
export type UserInsert = Inserts<'users'>;
export type WorkoutInsert = Inserts<'workouts'>;
export type ExerciseLogInsert = Inserts<'exercise_logs'>;
export type PostInsert = Inserts<'posts'>;

// Types pour les mises à jour
export type UserUpdate = Updates<'users'>;
export type WorkoutUpdate = Updates<'workouts'>;
export type PostUpdate = Updates<'posts'>;
