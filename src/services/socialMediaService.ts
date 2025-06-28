import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];
type SocialAccountInsert = Database['public']['Tables']['social_accounts']['Insert'];

export class SocialMediaService {
  // Instagram connection
  static async connectInstagram(authCode: string): Promise<SocialAccount> {
    try {
      // Exchange auth code for access token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
          client_secret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: `${window.location.origin}/auth/instagram/callback`,
          code: authCode,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || 'Failed to connect Instagram');
      }

      // Get user info
      const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${tokenData.access_token}`);
      const userData = await userResponse.json();

      // Save to database
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const socialAccountData: SocialAccountInsert = {
        user_id: user.user.id,
        platform: 'instagram',
        platform_user_id: userData.id,
        username: userData.username,
        display_name: userData.username,
        access_token: tokenData.access_token,
        followers_count: userData.media_count || 0,
      };

      const { data, error } = await supabase
        .from('social_accounts')
        .insert(socialAccountData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Instagram connection error:', error);
      throw error;
    }
  }

  // Facebook connection
  static async connectFacebook(accessToken: string): Promise<SocialAccount> {
    try {
      // Get user info
      const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
      const userData = await userResponse.json();

      // Get page info (for business accounts)
      const pagesResponse = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
      const pagesData = await pagesResponse.json();

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const socialAccountData: SocialAccountInsert = {
        user_id: user.user.id,
        platform: 'facebook',
        platform_user_id: userData.id,
        username: userData.name,
        display_name: userData.name,
        access_token: accessToken,
        followers_count: 0, // Will be updated via API
      };

      const { data, error } = await supabase
        .from('social_accounts')
        .insert(socialAccountData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Facebook connection error:', error);
      throw error;
    }
  }

  // TikTok connection
  static async connectTikTok(authCode: string): Promise<SocialAccount> {
    try {
      // Exchange auth code for access token
      const tokenResponse = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: import.meta.env.VITE_TIKTOK_CLIENT_KEY,
          client_secret: import.meta.env.VITE_TIKTOK_CLIENT_SECRET,
          code: authCode,
          grant_type: 'authorization_code',
          redirect_uri: `${window.location.origin}/auth/tiktok/callback`,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok || tokenData.error) {
        throw new Error(tokenData.error_description || 'Failed to connect TikTok');
      }

      // Get user info
      const userResponse = await fetch('https://open-api.tiktok.com/user/info/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.data.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: ['open_id', 'union_id', 'avatar_url', 'display_name', 'follower_count']
        }),
      });
      const userData = await userResponse.json();

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const socialAccountData: SocialAccountInsert = {
        user_id: user.user.id,
        platform: 'tiktok',
        platform_user_id: userData.data.user.open_id,
        username: userData.data.user.display_name,
        display_name: userData.data.user.display_name,
        access_token: tokenData.data.access_token,
        refresh_token: tokenData.data.refresh_token,
        followers_count: userData.data.user.follower_count || 0,
      };

      const { data, error } = await supabase
        .from('social_accounts')
        .insert(socialAccountData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('TikTok connection error:', error);
      throw error;
    }
  }

  // Get connected accounts for user
  static async getConnectedAccounts(): Promise<SocialAccount[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('is_active', true)
      .order('connected_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Disconnect account
  static async disconnectAccount(accountId: string): Promise<void> {
    const { error } = await supabase
      .from('social_accounts')
      .update({ is_active: false })
      .eq('id', accountId);

    if (error) throw error;
  }

  // Refresh access token
  static async refreshAccessToken(accountId: string): Promise<void> {
    const { data: account, error: fetchError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (fetchError) throw fetchError;

    // Implementation depends on platform
    // Each platform has different refresh token flows
    // This is a simplified version
    
    const { error: updateError } = await supabase
      .from('social_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    if (updateError) throw updateError;
  }

  // Sync account data (followers, etc.)
  static async syncAccountData(accountId: string): Promise<void> {
    const { data: account, error: fetchError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (fetchError) throw fetchError;

    // Platform-specific sync logic would go here
    // For now, just update the last sync time
    
    const { error: updateError } = await supabase
      .from('social_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    if (updateError) throw updateError;
  }
}

// OAuth URL generators
export const getInstagramAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/instagram/callback`,
    scope: 'user_profile,user_media',
    response_type: 'code',
  });
  
  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
};

export const getFacebookAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_FACEBOOK_APP_ID,
    redirect_uri: `${window.location.origin}/auth/facebook/callback`,
    scope: 'pages_manage_posts,pages_read_engagement,pages_show_list',
    response_type: 'code',
  });
  
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
};

export const getTikTokAuthUrl = () => {
  const params = new URLSearchParams({
    client_key: import.meta.env.VITE_TIKTOK_CLIENT_KEY,
    scope: 'user.info.basic,video.list',
    response_type: 'code',
    redirect_uri: "https://f572-88-250-62-206.ngrok-free.app/auth/tiktok/callback",
    
  });
  
  return `https://www.tiktok.com/auth/authorize/?${params.toString()}`;
};

// Helper functions for OAuth
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}