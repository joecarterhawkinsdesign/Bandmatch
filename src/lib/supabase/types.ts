export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          bio: string;
          instruments: string[];
          genres: string[];
          city: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          bio?: string;
          instruments?: string[];
          genres?: string[];
          city?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      swipes: {
        Row: {
          id: string;
          swiper_id: string;
          swiped_id: string;
          direction: "left" | "right";
          created_at: string;
        };
        Insert: {
          id?: string;
          swiper_id: string;
          swiped_id: string;
          direction: "left" | "right";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["swipes"]["Insert"]>;
      };
      matches: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_a: string;
          user_b: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
      };
    };
  };
};
