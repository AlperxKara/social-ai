import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];
type SocialAccountInsert = Database['public']['Tables']['social_accounts']['Insert'];

export class SocialMediaService {
  // Instagram profil linkinden veri çekme
  static async connectInstagramByProfile(profileUrl: string): Promise<SocialAccount> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Kullanıcı doğrulanmamış');

      // Instagram profil URL'sinden kullanıcı adını çıkar
      const username = this.extractUsernameFromUrl(profileUrl, 'instagram');
      if (!username) throw new Error('Geçersiz Instagram profil linki');

      // Instagram verilerini çek (web scraping simulation)
      const profileData = await this.scrapeInstagramProfile(username);

      const socialAccountData: SocialAccountInsert = {
        user_id: user.user.id,
        platform: 'instagram',
        platform_user_id: profileData.id,
        username: profileData.username,
        display_name: profileData.full_name,
        access_token: profileUrl, // Profil linkini token olarak saklıyoruz
        followers_count: profileData.followers,
        profile_url: profileUrl,
      };

      const { data, error } = await supabase
        .from('social_accounts')
        .insert(socialAccountData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Instagram bağlantı hatası:', error);
      throw error;
    }
  }

  // TikTok profil linkinden veri çekme
  static async connectTikTokByProfile(profileUrl: string): Promise<SocialAccount> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Kullanıcı doğrulanmamış');

      const username = this.extractUsernameFromUrl(profileUrl, 'tiktok');
      if (!username) throw new Error('Geçersiz TikTok profil linki');

      const profileData = await this.scrapeTikTokProfile(username);

      const socialAccountData: SocialAccountInsert = {
        user_id: user.user.id,
        platform: 'tiktok',
        platform_user_id: profileData.id,
        username: profileData.username,
        display_name: profileData.display_name,
        access_token: profileUrl,
        followers_count: profileData.followers,
        profile_url: profileUrl,
      };

      const { data, error } = await supabase
        .from('social_accounts')
        .insert(socialAccountData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('TikTok bağlantı hatası:', error);
      throw error;
    }
  }

  // Facebook profil linkinden veri çekme
  static async connectFacebookByProfile(profileUrl: string): Promise<SocialAccount> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Kullanıcı doğrulanmamış');

      const username = this.extractUsernameFromUrl(profileUrl, 'facebook');
      if (!username) throw new Error('Geçersiz Facebook profil linki');

      const profileData = await this.scrapeFacebookProfile(username);

      const socialAccountData: SocialAccountInsert = {
        user_id: user.user.id,
        platform: 'facebook',
        platform_user_id: profileData.id,
        username: profileData.username,
        display_name: profileData.name,
        access_token: profileUrl,
        followers_count: profileData.followers,
        profile_url: profileUrl,
      };

      const { data, error } = await supabase
        .from('social_accounts')
        .insert(socialAccountData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Facebook bağlantı hatası:', error);
      throw error;
    }
  }

  // Twitter profil linkinden veri çekme
  static async connectTwitterByProfile(profileUrl: string): Promise<SocialAccount> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Kullanıcı doğrulanmamış');

      const username = this.extractUsernameFromUrl(profileUrl, 'twitter');
      if (!username) throw new Error('Geçersiz Twitter profil linki');

      const profileData = await this.scrapeTwitterProfile(username);

      const socialAccountData: SocialAccountInsert = {
        user_id: user.user.id,
        platform: 'twitter',
        platform_user_id: profileData.id,
        username: profileData.username,
        display_name: profileData.name,
        access_token: profileUrl,
        followers_count: profileData.followers,
        profile_url: profileUrl,
      };

      const { data, error } = await supabase
        .from('social_accounts')
        .insert(socialAccountData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Twitter bağlantı hatası:', error);
      throw error;
    }
  }

  // LinkedIn profil linkinden veri çekme
  static async connectLinkedInByProfile(profileUrl: string): Promise<SocialAccount> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Kullanıcı doğrulanmamış');

      const username = this.extractUsernameFromUrl(profileUrl, 'linkedin');
      if (!username) throw new Error('Geçersiz LinkedIn profil linki');

      const profileData = await this.scrapeLinkedInProfile(username);

      const socialAccountData: SocialAccountInsert = {
        user_id: user.user.id,
        platform: 'linkedin',
        platform_user_id: profileData.id,
        username: profileData.username,
        display_name: profileData.name,
        access_token: profileUrl,
        followers_count: profileData.followers,
        profile_url: profileUrl,
      };

      const { data, error } = await supabase
        .from('social_accounts')
        .insert(socialAccountData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('LinkedIn bağlantı hatası:', error);
      throw error;
    }
  }

  // URL'den kullanıcı adını çıkarma
  private static extractUsernameFromUrl(url: string, platform: string): string | null {
    try {
      const urlObj = new URL(url);
      
      switch (platform) {
        case 'instagram':
          // https://instagram.com/username veya https://www.instagram.com/username
          const instagramMatch = urlObj.pathname.match(/^\/([^\/]+)\/?$/);
          return instagramMatch ? instagramMatch[1] : null;
          
        case 'tiktok':
          // https://tiktok.com/@username veya https://www.tiktok.com/@username
          const tiktokMatch = urlObj.pathname.match(/^\/@?([^\/]+)\/?$/);
          return tiktokMatch ? tiktokMatch[1] : null;
          
        case 'facebook':
          // https://facebook.com/username veya https://www.facebook.com/username
          const facebookMatch = urlObj.pathname.match(/^\/([^\/]+)\/?$/);
          return facebookMatch ? facebookMatch[1] : null;
          
        case 'twitter':
          // https://twitter.com/username veya https://x.com/username
          const twitterMatch = urlObj.pathname.match(/^\/([^\/]+)\/?$/);
          return twitterMatch ? twitterMatch[1] : null;
          
        case 'linkedin':
          // https://linkedin.com/in/username
          const linkedinMatch = urlObj.pathname.match(/^\/in\/([^\/]+)\/?$/);
          return linkedinMatch ? linkedinMatch[1] : null;
          
        default:
          return null;
      }
    } catch {
      return null;
    }
  }

  // Instagram profil verilerini çekme (simülasyon)
  private static async scrapeInstagramProfile(username: string): Promise<any> {
    // Gerçek uygulamada burada web scraping veya public API kullanılır
    // Şimdilik simüle edilmiş veri döndürüyoruz
    await new Promise(resolve => setTimeout(resolve, 1000)); // API çağrısını simüle et
    
    return {
      id: `ig_${username}_${Date.now()}`,
      username: username,
      full_name: `${username} (Instagram)`,
      followers: Math.floor(Math.random() * 10000) + 1000,
      following: Math.floor(Math.random() * 1000) + 100,
      posts: Math.floor(Math.random() * 500) + 50,
      bio: `${username} Instagram profili`,
      is_verified: Math.random() > 0.8,
      is_private: false // Sadece herkese açık profiller kabul edilir
    };
  }

  // TikTok profil verilerini çekme (simülasyon)
  private static async scrapeTikTokProfile(username: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `tt_${username}_${Date.now()}`,
      username: username,
      display_name: `${username} (TikTok)`,
      followers: Math.floor(Math.random() * 50000) + 5000,
      following: Math.floor(Math.random() * 2000) + 200,
      likes: Math.floor(Math.random() * 100000) + 10000,
      videos: Math.floor(Math.random() * 200) + 20,
      bio: `${username} TikTok profili`,
      is_verified: Math.random() > 0.9
    };
  }

  // Facebook profil verilerini çekme (simülasyon)
  private static async scrapeFacebookProfile(username: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `fb_${username}_${Date.now()}`,
      username: username,
      name: `${username} (Facebook)`,
      followers: Math.floor(Math.random() * 20000) + 2000,
      friends: Math.floor(Math.random() * 5000) + 500,
      posts: Math.floor(Math.random() * 1000) + 100,
      bio: `${username} Facebook profili`,
      is_verified: Math.random() > 0.85
    };
  }

  // Twitter profil verilerini çekme (simülasyon)
  private static async scrapeTwitterProfile(username: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `tw_${username}_${Date.now()}`,
      username: username,
      name: `${username} (Twitter)`,
      followers: Math.floor(Math.random() * 15000) + 1500,
      following: Math.floor(Math.random() * 3000) + 300,
      tweets: Math.floor(Math.random() * 2000) + 200,
      bio: `${username} Twitter profili`,
      is_verified: Math.random() > 0.9
    };
  }

  // LinkedIn profil verilerini çekme (simülasyon)
  private static async scrapeLinkedInProfile(username: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `li_${username}_${Date.now()}`,
      username: username,
      name: `${username} (LinkedIn)`,
      followers: Math.floor(Math.random() * 8000) + 800,
      connections: Math.floor(Math.random() * 2000) + 200,
      posts: Math.floor(Math.random() * 300) + 30,
      bio: `${username} LinkedIn profili`,
      is_verified: Math.random() > 0.7
    };
  }

  // Bağlı hesapları getir
  static async getConnectedAccounts(): Promise<SocialAccount[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Kullanıcı doğrulanmamış');

    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('is_active', true)
      .order('connected_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Hesap verilerini güncelle (dinamik veri çekme)
  static async syncAccountData(accountId: string): Promise<void> {
    const { data: account, error: fetchError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (fetchError) throw fetchError;

    let updatedData: any = {};

    // Platform'a göre güncel verileri çek
    switch (account.platform) {
      case 'instagram':
        const igData = await this.scrapeInstagramProfile(account.username);
        updatedData = {
          followers_count: igData.followers,
          last_sync_at: new Date().toISOString()
        };
        break;
        
      case 'tiktok':
        const ttData = await this.scrapeTikTokProfile(account.username);
        updatedData = {
          followers_count: ttData.followers,
          last_sync_at: new Date().toISOString()
        };
        break;
        
      case 'facebook':
        const fbData = await this.scrapeFacebookProfile(account.username);
        updatedData = {
          followers_count: fbData.followers,
          last_sync_at: new Date().toISOString()
        };
        break;
        
      case 'twitter':
        const twData = await this.scrapeTwitterProfile(account.username);
        updatedData = {
          followers_count: twData.followers,
          last_sync_at: new Date().toISOString()
        };
        break;
        
      case 'linkedin':
        const liData = await this.scrapeLinkedInProfile(account.username);
        updatedData = {
          followers_count: liData.followers,
          last_sync_at: new Date().toISOString()
        };
        break;
    }

    const { error: updateError } = await supabase
      .from('social_accounts')
      .update(updatedData)
      .eq('id', accountId);

    if (updateError) throw updateError;
  }

  // Hesap bağlantısını kaldır
  static async disconnectAccount(accountId: string): Promise<void> {
    const { error } = await supabase
      .from('social_accounts')
      .update({ is_active: false })
      .eq('id', accountId);

    if (error) throw error;
  }

  // Profil URL'sini doğrula
  static validateProfileUrl(url: string, platform: string): boolean {
    try {
      const urlObj = new URL(url);
      
      switch (platform) {
        case 'instagram':
          return urlObj.hostname.includes('instagram.com');
        case 'tiktok':
          return urlObj.hostname.includes('tiktok.com');
        case 'facebook':
          return urlObj.hostname.includes('facebook.com');
        case 'twitter':
          return urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com');
        case 'linkedin':
          return urlObj.hostname.includes('linkedin.com') && urlObj.pathname.includes('/in/');
        default:
          return false;
      }
    } catch {
      return false;
    }
  }

  // Hesap analitik verilerini çek
  static async getAccountAnalytics(accountId: string, days: number = 30): Promise<any> {
    const { data: account } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (!account) throw new Error('Hesap bulunamadı');

    // Simüle edilmiş analitik veriler
    const analytics = {
      followers_growth: Math.floor(Math.random() * 500) + 50,
      engagement_rate: (Math.random() * 5 + 1).toFixed(2),
      posts_count: Math.floor(Math.random() * 20) + 5,
      likes_total: Math.floor(Math.random() * 10000) + 1000,
      comments_total: Math.floor(Math.random() * 1000) + 100,
      shares_total: Math.floor(Math.random() * 500) + 50,
      reach: Math.floor(Math.random() * 50000) + 5000,
      impressions: Math.floor(Math.random() * 100000) + 10000
    };

    return analytics;
  }
}

// Platform URL örnekleri
export const getPlatformUrlExamples = () => ({
  instagram: 'https://instagram.com/kullaniciadi',
  tiktok: 'https://tiktok.com/@kullaniciadi',
  facebook: 'https://facebook.com/kullaniciadi',
  twitter: 'https://twitter.com/kullaniciadi',
  linkedin: 'https://linkedin.com/in/kullaniciadi'
});