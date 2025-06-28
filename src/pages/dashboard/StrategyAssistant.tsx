import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  BarChart3,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Zap,
  Star,
  MessageCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const StrategyAssistant: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = React.useState('engagement');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [showRecommendations, setShowRecommendations] = React.useState(false);

  const goals = [
    { id: 'engagement', name: 'Increase Engagement', icon: MessageCircle, color: 'bg-blue-500' },
    { id: 'followers', name: 'Grow Followers', icon: Users, color: 'bg-green-500' },
    { id: 'brand', name: 'Build Brand Awareness', icon: Star, color: 'bg-purple-500' },
    { id: 'sales', name: 'Drive Sales', icon: TrendingUp, color: 'bg-red-500' }
  ];

  const insights = [
    {
      title: 'Best Posting Times',
      value: '2-4 PM, 7-9 PM',
      change: '+23% engagement',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Top Performing Content',
      value: 'Behind-the-scenes',
      change: '45% higher reach',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'Audience Growth',
      value: '+12.5%',
      change: 'This month',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Engagement Rate',
      value: '4.2%',
      change: '+0.8% vs last month',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  const recommendations = [
    {
      category: 'Content Strategy',
      items: [
        {
          title: 'Post more video content',
          description: 'Videos get 48% more engagement than static posts',
          priority: 'High',
          impact: '+35% engagement'
        },
        {
          title: 'Use trending hashtags',
          description: 'Incorporate 3-5 trending hashtags in your niche',
          priority: 'Medium',
          impact: '+20% reach'
        },
        {
          title: 'Share user-generated content',
          description: 'Repost customer content to build community',
          priority: 'Medium',
          impact: '+15% trust'
        }
      ]
    },
    {
      category: 'Posting Schedule',
      items: [
        {
          title: 'Increase posting frequency',
          description: 'Post 5-7 times per week for optimal engagement',
          priority: 'High',
          impact: '+25% visibility'
        },
        {
          title: 'Optimize posting times',
          description: 'Focus on 2-4 PM and 7-9 PM when your audience is most active',
          priority: 'High',
          impact: '+30% engagement'
        }
      ]
    },
    {
      category: 'Audience Engagement',
      items: [
        {
          title: 'Respond to comments faster',
          description: 'Reply within 2 hours to boost algorithm performance',
          priority: 'High',
          impact: '+40% engagement'
        },
        {
          title: 'Ask more questions',
          description: 'End posts with questions to encourage comments',
          priority: 'Medium',
          impact: '+20% comments'
        }
      ]
    }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowRecommendations(true);
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
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
          Strategy Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get AI-powered insights and recommendations to grow your social media presence.
        </p>
      </motion.div>

      {/* Goal Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          What's your primary goal?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedGoal === goal.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className={`w-10 h-10 ${goal.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                  {goal.name}
                </h3>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <Button
            onClick={handleAnalyze}
            loading={isAnalyzing}
            size="lg"
            className="px-8"
          >
            <Target className="h-5 w-5 mr-2" />
            Analyze My Strategy
          </Button>
        </div>
      </motion.div>

      {/* Current Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Current Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <Icon className={`h-5 w-5 ${insight.color}`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {insight.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {insight.value}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {insight.change}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Analysis Loading */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8"
        >
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Analyzing Your Strategy
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI is reviewing your content, audience, and performance data...
            </p>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {showRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Recommendations
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4" />
              <span>Personalized for your goals</span>
            </div>
          </div>

          {recommendations.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {item.impact}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {item.description}
                      </p>
                      <Button size="sm" variant="outline">
                        Implement
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default StrategyAssistant;