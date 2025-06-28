import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Copy,
  RefreshCw,
  Heart,
  Share2,
  Settings,
  Wand2,
  Hash,
  Type,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const AICaptions: React.FC = () => {
  const [prompt, setPrompt] = React.useState('');
  const [selectedTone, setSelectedTone] = React.useState('professional');
  const [selectedPlatform, setSelectedPlatform] = React.useState('instagram');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedCaptions, setGeneratedCaptions] = React.useState<string[]>([]);

  const tones = [
    { id: 'professional', name: 'Professional', color: 'bg-blue-500' },
    { id: 'casual', name: 'Casual', color: 'bg-green-500' },
    { id: 'funny', name: 'Funny', color: 'bg-yellow-500' },
    { id: 'inspiring', name: 'Inspiring', color: 'bg-purple-500' },
    { id: 'educational', name: 'Educational', color: 'bg-indigo-500' },
    { id: 'promotional', name: 'Promotional', color: 'bg-red-500' }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', limit: '2,200 characters' },
    { id: 'facebook', name: 'Facebook', limit: '63,206 characters' },
    { id: 'twitter', name: 'Twitter/X', limit: '280 characters' },
    { id: 'linkedin', name: 'LinkedIn', limit: '3,000 characters' },
    { id: 'tiktok', name: 'TikTok', limit: '2,200 characters' }
  ];

  const sampleCaptions = [
    "🌟 Transform your business with AI-powered solutions! Our latest innovation is changing the game for entrepreneurs worldwide. Ready to level up? 💼✨ #AI #Business #Innovation #Entrepreneur #TechTrends",
    "Behind every successful project is a team that believes in the impossible. Today we're celebrating our amazing crew who made this dream a reality! 🎉👥 What's your team working on? #TeamWork #Success #Motivation",
    "The future is here, and it's more exciting than we ever imagined! 🚀 From AI to automation, technology is reshaping how we work, create, and connect. What tech trend are you most excited about? #FutureTech #Innovation #AI",
    "Small steps lead to big changes. Every day is an opportunity to grow, learn, and become better than yesterday. What small step are you taking today? 💪 #GrowthMindset #Motivation #PersonalDevelopment #Success"
  ];

  const quickPrompts = [
    'Product launch announcement',
    'Behind the scenes content',
    'Customer testimonial post',
    'Educational tip sharing',
    'Team appreciation post',
    'Industry trend discussion',
    'Motivational Monday content',
    'Weekend inspiration'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedCaptions(sampleCaptions);
      setIsGenerating(false);
    }, 2500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCharacterLimit = () => {
    const platform = platforms.find(p => p.id === selectedPlatform);
    return platform?.limit || '';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Caption Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create engaging captions that resonate with your audience using AI.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Generate Caption
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's your post about?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your post content, product, or message..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Limit: {getCharacterLimit()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`p-3 rounded-lg border-2 flex items-center space-x-2 transition-colors ${
                        selectedTone === tone.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-3 h-3 ${tone.color} rounded-full`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {tone.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={!prompt.trim()}
                className="w-full"
                size="lg"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Captions
              </Button>
            </div>
          </motion.div>

          {/* Quick Prompts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Prompts
            </h3>
            <div className="space-y-2">
              {quickPrompts.map((quickPrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(quickPrompt)}
                  className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {quickPrompt}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Captions
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="h-4 w-4" />
                <span>2 credits used</span>
              </div>
            </div>

            {isGenerating ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Crafting the perfect captions for you...
                  </p>
                </div>
              </div>
            ) : generatedCaptions.length > 0 ? (
              <div className="space-y-6">
                {generatedCaptions.map((caption, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                          <Type className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Caption {index + 1}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(caption)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {caption}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{caption.length} characters</span>
                      <div className="flex space-x-4">
                        <span className="flex items-center">
                          <Hash className="h-4 w-4 mr-1" />
                          {(caption.match(/#\w+/g) || []).length} hashtags
                        </span>
                        <span className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          {selectedTone}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                      <Button size="sm">
                        Use This Caption
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-center">
                <div>
                  <Sparkles className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No captions generated yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Describe your post and click generate to create engaging captions
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AICaptions;