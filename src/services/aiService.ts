import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type AIGeneration = Database['public']['Tables']['ai_generations']['Row'];
type AIGenerationInsert = Database['public']['Tables']['ai_generations']['Insert'];

export class AIService {
  private static readonly OPENAI_API_URL = 'https://api.openai.com/v1';
  private static readonly API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // Generate AI image
  static async generateImage(prompt: string, style: string = 'modern', format: string = 'square'): Promise<string[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Check user credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits_remaining')
        .eq('id', user.user.id)
        .single();

      if (!profile || profile.credits_remaining < 4) {
        throw new Error('Insufficient credits for image generation');
      }

      // Enhanced prompt based on style and format
      const enhancedPrompt = this.enhanceImagePrompt(prompt, style, format);

      const response = await fetch(`${this.OPENAI_API_URL}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          n: 1,
          size: this.getImageSize(format),
          quality: 'standard',
          style: style === 'modern' ? 'vivid' : 'natural',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate image');
      }

      const data = await response.json();
      const imageUrls = data.data.map((item: any) => item.url);

      // Save generation to database
      await this.saveGeneration(user.user.id, 'image', prompt, { 
        images: imageUrls, 
        style, 
        format 
      }, 4);

      // Deduct credits
      await this.deductCredits(user.user.id, 4);

      return imageUrls;
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  }

  // Generate AI caption
  static async generateCaptions(prompt: string, tone: string, platform: string, count: number = 4): Promise<string[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Check user credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits_remaining')
        .eq('id', user.user.id)
        .single();

      if (!profile || profile.credits_remaining < 2) {
        throw new Error('Insufficient credits for caption generation');
      }

      const systemPrompt = this.getCaptionSystemPrompt(tone, platform);
      const userPrompt = `Create ${count} engaging social media captions for: ${prompt}`;

      const response = await fetch(`${this.OPENAI_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1000,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate captions');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse captions (assuming they're separated by numbers or newlines)
      const captions = this.parseCaptions(content);

      // Save generation to database
      await this.saveGeneration(user.user.id, 'caption', prompt, { 
        captions, 
        tone, 
        platform 
      }, 2);

      // Deduct credits
      await this.deductCredits(user.user.id, 2);

      return captions;
    } catch (error) {
      console.error('Caption generation error:', error);
      throw error;
    }
  }

  // Generate strategy recommendations
  static async generateStrategy(goal: string, currentMetrics: any): Promise<any> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Check user credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits_remaining')
        .eq('id', user.user.id)
        .single();

      if (!profile || profile.credits_remaining < 3) {
        throw new Error('Insufficient credits for strategy generation');
      }

      const systemPrompt = `You are a social media strategy expert. Analyze the provided metrics and goal to create actionable recommendations. Return your response as a JSON object with the following structure:
      {
        "recommendations": [
          {
            "category": "Content Strategy",
            "items": [
              {
                "title": "Recommendation title",
                "description": "Detailed description",
                "priority": "High|Medium|Low",
                "impact": "Expected impact description"
              }
            ]
          }
        ],
        "insights": [
          {
            "title": "Insight title",
            "value": "Key metric or finding",
            "change": "Change description",
            "color": "text-green-600|text-blue-600|text-red-600"
          }
        ]
      }`;

      const userPrompt = `Goal: ${goal}\nCurrent Metrics: ${JSON.stringify(currentMetrics)}\n\nProvide strategic recommendations to achieve this goal.`;

      const response = await fetch(`${this.OPENAI_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate strategy');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      let strategy;
      try {
        strategy = JSON.parse(content);
      } catch {
        // Fallback if JSON parsing fails
        strategy = { recommendations: [], insights: [] };
      }

      // Save generation to database
      await this.saveGeneration(user.user.id, 'strategy', `Goal: ${goal}`, strategy, 3);

      // Deduct credits
      await this.deductCredits(user.user.id, 3);

      return strategy;
    } catch (error) {
      console.error('Strategy generation error:', error);
      throw error;
    }
  }

  // Helper methods
  private static enhanceImagePrompt(prompt: string, style: string, format: string): string {
    let enhanced = prompt;
    
    // Add style modifiers
    switch (style) {
      case 'modern':
        enhanced += ', modern design, clean aesthetics, contemporary style';
        break;
      case 'vintage':
        enhanced += ', vintage style, retro aesthetics, classic design';
        break;
      case 'minimalist':
        enhanced += ', minimalist design, simple composition, clean lines';
        break;
      case 'bold':
        enhanced += ', bold colors, dynamic composition, striking visuals';
        break;
      case 'nature':
        enhanced += ', natural elements, organic textures, earthy tones';
        break;
      case 'tech':
        enhanced += ', futuristic design, tech aesthetics, digital elements';
        break;
    }

    // Add format-specific instructions
    switch (format) {
      case 'square':
        enhanced += ', optimized for Instagram post, square composition';
        break;
      case 'story':
        enhanced += ', vertical format, Instagram story optimized';
        break;
      case 'landscape':
        enhanced += ', horizontal format, Facebook/LinkedIn optimized';
        break;
      case 'banner':
        enhanced += ', wide banner format, cover photo style';
        break;
    }

    enhanced += ', high quality, professional, social media ready';
    
    return enhanced;
  }

  private static getImageSize(format: string): string {
    switch (format) {
      case 'square':
        return '1024x1024';
      case 'story':
        return '1024x1792';
      case 'landscape':
        return '1792x1024';
      case 'banner':
        return '1792x1024';
      default:
        return '1024x1024';
    }
  }

  private static getCaptionSystemPrompt(tone: string, platform: string): string {
    let prompt = `You are a social media expert creating engaging captions for ${platform}. `;
    
    switch (tone) {
      case 'professional':
        prompt += 'Use a professional, business-appropriate tone. Focus on value and expertise.';
        break;
      case 'casual':
        prompt += 'Use a casual, friendly tone. Be conversational and approachable.';
        break;
      case 'funny':
        prompt += 'Use humor and wit. Be entertaining while staying relevant.';
        break;
      case 'inspiring':
        prompt += 'Be motivational and uplifting. Inspire action and positive thinking.';
        break;
      case 'educational':
        prompt += 'Focus on teaching and sharing knowledge. Be informative and helpful.';
        break;
      case 'promotional':
        prompt += 'Focus on promoting products/services. Be persuasive but not pushy.';
        break;
    }

    // Platform-specific guidelines
    switch (platform) {
      case 'instagram':
        prompt += ' Include relevant hashtags (3-5). Keep it engaging and visual-focused.';
        break;
      case 'twitter':
        prompt += ' Keep it concise (under 280 characters). Use relevant hashtags sparingly.';
        break;
      case 'linkedin':
        prompt += ' Professional tone. Can be longer and more detailed. Focus on business value.';
        break;
      case 'facebook':
        prompt += ' Can be conversational and longer. Encourage engagement.';
        break;
      case 'tiktok':
        prompt += ' Trendy and engaging. Use popular hashtags and encourage interaction.';
        break;
    }

    prompt += ' Create multiple variations with different approaches but consistent tone.';
    
    return prompt;
  }

  private static parseCaptions(content: string): string[] {
    // Split by numbers (1., 2., etc.) or double newlines
    const captions = content
      .split(/\d+\.\s*|\n\n/)
      .map(caption => caption.trim())
      .filter(caption => caption.length > 10);
    
    return captions.slice(0, 4); // Return max 4 captions
  }

  private static async saveGeneration(userId: string, type: 'image' | 'caption' | 'strategy', prompt: string, result: any, creditsUsed: number): Promise<void> {
    const generationData: AIGenerationInsert = {
      user_id: userId,
      type,
      prompt,
      result,
      credits_used: creditsUsed,
    };

    const { error } = await supabase
      .from('ai_generations')
      .insert(generationData);

    if (error) {
      console.error('Error saving AI generation:', error);
    }
  }

  private static async deductCredits(userId: string, amount: number): Promise<void> {
    const { error } = await supabase.rpc('deduct_credits', {
      user_id: userId,
      amount: amount
    });

    if (error) {
      console.error('Error deducting credits:', error);
    }
  }

  // Get user's AI generation history
  static async getGenerationHistory(type?: 'image' | 'caption' | 'strategy'): Promise<AIGeneration[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    let query = supabase
      .from('ai_generations')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }
}