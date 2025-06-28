import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  BarChart3,
  Calendar,
  Target,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState('7d');
  const [selectedPlatform, setSelectedPlatform] = React.useState('all');

  const periods = [
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
    { id: '90d', name: '90 Days' },
    { id: '1y', name: '1 Year' }
  ];

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: BarChart3, color: 'text-gray-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' }
  ];

  const metrics = [
    {
      name: 'Total Reach',
      value: '45.2K',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      name: 'Engagement Rate',
      value: '4.2%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: Heart,
      color: 'text-red-500'
    },
    {
      name: 'New Followers',
      value: '1.2K',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-green-500'
    },
    {
      name: 'Comments',
      value: '892',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: MessageCircle,
      color: 'text-purple-500'
    }
  ];

  const topPosts = [
    {
      id: '1',
      title: 'Product Launch Announcement',
      platform: 'instagram',
      reach: '12.5K',
      engagement: '8.2%',
      likes: 1024,
      comments: 89,
      shares: 156,
      date: '2024-01-15',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      title: 'Behind the Scenes Video',
      platform: 'facebook',
      reach: '8.9K',
      engagement: '6.7%',
      likes: 567,
      comments: 45,
      shares: 89,
      date: '2024-01-14',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '3',
      title: 'Industry Insights Thread',
      platform: 'twitter',
      reach: '6.3K',
      engagement: '5.4%',
      likes: 234,
      comments: 67,
      shares: 123,
      date: '2024-01-13',
      image: null
    }
  ];

  const audienceData = [
    { age: '18-24', percentage: 15, gender: { male: 45, female: 55 } },
    { age: '25-34', percentage: 35, gender: { male: 48, female: 52 } },
    { age: '35-44', percentage: 28, gender: { male: 52, female: 48 } },
    { age: '45-54', percentage: 15, gender: { male: 55, female: 45 } },
    { age: '55+', percentage: 7, gender: { male: 60, female: 40 } }
  ];

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className={`h-4 w-4 ${platform.color}`} />;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your social media performance and audience insights.
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {period.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform:</span>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {metric.name}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Engagement Over Time
          </h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 78, 52, 89, 95, 73, 84].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Platform Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Platform Performance
          </h2>
          <div className="space-y-4">
            {[
              { platform: 'instagram', name: 'Instagram', value: 45, color: 'bg-pink-500' },
              { platform: 'facebook', name: 'Facebook', value: 32, color: 'bg-blue-600' },
              { platform: 'twitter', name: 'Twitter', value: 18, color: 'bg-blue-400' },
              { platform: 'linkedin', name: 'LinkedIn', value: 25, color: 'bg-blue-700' }
            ].map((item) => (
              <div key={item.platform} className="flex items-center">
                <div className="flex items-center space-x-3 w-24">
                  {getPlatformIcon(item.platform)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Performing Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performing Posts
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {topPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                {post.image ? (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(post.platform)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Reach</span>
                      <p className="font-medium text-gray-900 dark:text-white">{post.reach}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Engagement</span>
                      <p className="font-medium text-gray-900 dark:text-white">{post.engagement}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Likes</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formatNumber(post.likes)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Comments</span>
                      <p className="font-medium text-gray-900 dark:text-white">{post.comments}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Shares</span>
                      <p className="font-medium text-gray-900 dark:text-white">{post.shares}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Audience Demographics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Audience Demographics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Age Distribution
            </h3>
            <div className="space-y-3">
              {audienceData.map((item) => (
                <div key={item.age} className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-16">
                    {item.age}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Gender Split
            </h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="52, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">52%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Female</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Female (52%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Male (48%)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;