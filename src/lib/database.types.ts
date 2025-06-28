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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'individual' | 'agency'
          credits_remaining: number
          subscription_tier: string
          bio: string | null
          phone: string | null
          company: string | null
          language: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'individual' | 'agency'
          credits_remaining?: number
          subscription_tier?: string
          bio?: string | null
          phone?: string | null
          company?: string | null
          language?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'individual' | 'agency'
          credits_remaining?: number
          subscription_tier?: string
          bio?: string | null
          phone?: string | null
          company?: string | null
          language?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          notifications: Json
          appearance: Json
          integrations: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notifications?: Json
          appearance?: Json
          integrations?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notifications?: Json
          appearance?: Json
          integrations?: Json
          created_at?: string
          updated_at?: string
        }
      }
      social_accounts: {
        Row: {
          id: string
          user_id: string
          platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          platform_user_id: string
          username: string
          display_name: string | null
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          followers_count: number
          is_active: boolean
          connected_at: string
          last_sync_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          platform_user_id: string
          username: string
          display_name?: string | null
          access_token: string
          refresh_token?: string | null
          token_expires_at?: string | null
          followers_count?: number
          is_active?: boolean
          connected_at?: string
          last_sync_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          platform_user_id?: string
          username?: string
          display_name?: string | null
          access_token?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          followers_count?: number
          is_active?: boolean
          connected_at?: string
          last_sync_at?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          media_urls: Json
          platforms: Json
          scheduled_for: string | null
          published_at: string | null
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          ai_generated: boolean
          engagement_stats: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          media_urls?: Json
          platforms?: Json
          scheduled_for?: string | null
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          ai_generated?: boolean
          engagement_stats?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          media_urls?: Json
          platforms?: Json
          scheduled_for?: string | null
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          ai_generated?: boolean
          engagement_stats?: Json
          created_at?: string
          updated_at?: string
        }
      }
      media_library: {
        Row: {
          id: string
          user_id: string
          filename: string
          original_name: string
          file_type: string
          file_size: number
          storage_path: string
          public_url: string
          tags: Json
          used_in_posts: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          filename: string
          original_name: string
          file_type: string
          file_size: number
          storage_path: string
          public_url: string
          tags?: Json
          used_in_posts?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          original_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          public_url?: string
          tags?: Json
          used_in_posts?: number
          created_at?: string
        }
      }
      ai_generations: {
        Row: {
          id: string
          user_id: string
          type: 'image' | 'caption' | 'strategy'
          prompt: string
          result: Json
          credits_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'image' | 'caption' | 'strategy'
          prompt: string
          result: Json
          credits_used?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'image' | 'caption' | 'strategy'
          prompt?: string
          result?: Json
          credits_used?: number
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          metric_type: string
          metric_value: number
          recorded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          metric_type: string
          metric_value: number
          recorded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          metric_type?: string
          metric_value?: number
          recorded_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_credits: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: void
      }
    }
    Enums: {
      user_role: 'individual' | 'agency'
      social_platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
      post_status: 'draft' | 'scheduled' | 'published' | 'failed'
      ai_generation_type: 'image' | 'caption' | 'strategy'
    }
  }
}