import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Download,
  Copy,
  Heart,
  Share2,
  Settings,
  Wand2,
  Image as ImageIcon,
  Palette,
  Square,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AIService } from '../../services/aiService';
import { useAuth } from '../../contexts/AuthContext';

export const AIGenerator: React.FC = () => {
  const { profile } = useAuth();
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedFormat, setSelectedFormat] = React.useState('square');
  const [selectedStyle, setSelectedStyle] = React.useState('modern');
  const [generatedImages, setGeneratedImages] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string>('');

  const formats = [
    { id: 'square', name: 'Square (1:1)', description: 'Instagram post' },
    { id: 'story', name: 'Story (9:16)', description: 'Instagram/Facebook story' },
    { id: 'landscape', name: 'Landscape (16:9)', description: 'Facebook/LinkedIn post' },
    { id: 'banner', name: 'Banner (3:1)', description: 'Cover photos' }
  ];

  const styles = [
    { id: 'modern', name: 'Modern', color: 'bg-blue-500' },
    { id: 'vintage', name: 'Vintage', color: 'bg-amber-500' },
    { id: 'minimalist', name: 'Minimalist', color: 'bg-gray-500' },
    { id: 'bold', name: 'Bold', color: 'bg-red-500' },
    { id: 'nature', name: 'Nature', color: 'bg-green-500' },
    { id: 'tech', name: 'Tech', color: 'bg-purple-500' }
  ];

  const quickPrompts = [
    'Modern office workspace with laptop and coffee',
    'Tropical beach sunset with palm trees',
    'Minimalist product photography on white background',
    'Urban city skyline at night with neon lights',
    'Cozy coffee shop interior with warm lighting',
    'Professional team meeting in modern conference room',
    'Creative workspace with design tools and plants',
    'Luxury lifestyle product showcase'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      const images = await AIService.generateImage(prompt, selectedStyle, selectedFormat);
      setGeneratedImages(images);
    } catch (error: any) {
      setError(error.message || 'Failed to generate images. Please try again.');
      console.error('Image generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveImage = (imageUrl: string) => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Image Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create stunning visuals for your social media posts with AI.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Credits Remaining</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {profile?.credits_remaining || 0}
            </div>
          </div>
        </div>
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
              Generate Image
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe your image
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A modern minimalist workspace with laptop, coffee, and plants..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Be specific and descriptive for better results
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedFormat === format.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {format.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {format.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-lg border-2 flex items-center space-x-2 transition-colors ${
                        selectedStyle === style.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-4 h-4 ${style.color} rounded-full`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {style.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={!prompt.trim() || isGenerating || (profile?.credits_remaining || 0) < 4}
                className="w-full"
                size="lg"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Images (4 credits)'}
              </Button>

              {(profile?.credits_remaining || 0) < 4 && (
                <div className="text-sm text-red-600 dark:text-red-400 text-center">
                  Insufficient credits. You need 4 credits to generate images.
                </div>
              )}
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
                Generated Images
              </h2>
              {generatedImages.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Sparkles className="h-4 w-4" />
                  <span>4 credits used</span>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            {isGenerating ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Generating your amazing images...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    This may take 30-60 seconds
                  </p>
                </div>
              </div>
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSaveImage(image)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => copyToClipboard(image)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Actions below image */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-1" />
                          Use as Template
                        </Button>
                      </div>
                      <Button size="sm">
                        Save to Library
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-center">
                <div>
                  <ImageIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No images generated yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter a prompt and click generate to create stunning visuals with AI
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

export default AIGenerator;