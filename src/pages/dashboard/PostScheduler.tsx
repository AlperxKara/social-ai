import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Send,
  Image,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const PostScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'calendar' | 'list'>('calendar');

  const scheduledPosts = [
    {
      id: '1',
      title: 'Product Launch Announcement',
      content: 'Excited to announce our latest product! 🚀 #ProductLaunch #Innovation',
      platforms: ['instagram', 'facebook', 'twitter'],
      scheduledTime: '2024-01-15T14:00:00',
      status: 'scheduled',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      title: 'Behind the Scenes',
      content: 'Take a look behind the scenes of our creative process! ✨ #BehindTheScenes',
      platforms: ['instagram', 'linkedin'],
      scheduledTime: '2024-01-16T10:30:00',
      status: 'scheduled',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '3',
      title: 'Customer Testimonial',
      content: 'Amazing feedback from our customers! Thank you for trusting us 💙 #CustomerLove',
      platforms: ['facebook', 'linkedin'],
      scheduledTime: '2024-01-17T16:00:00',
      status: 'published',
      image: null
    },
    {
      id: '4',
      title: 'Weekly Tips',
      content: 'Monday motivation: 5 tips to boost your productivity this week! 💪 #MondayMotivation',
      platforms: ['twitter', 'linkedin'],
      scheduledTime: '2024-01-18T09:00:00',
      status: 'draft',
      image: null
    }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' }
  ];

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className={`h-4 w-4 ${platform.color}`} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const upcomingPosts = scheduledPosts.filter(post => 
    new Date(post.scheduledTime) > new Date() && post.status === 'scheduled'
  );

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
            Post Scheduler
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Plan and schedule your social media content across all platforms.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create Post
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Scheduled Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {scheduledPosts.filter(p => p.status === 'scheduled').length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Published Today
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                3
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Draft Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {scheduledPosts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <Edit className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Next Post
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {upcomingPosts.length > 0 ? formatDate(upcomingPosts[0].scheduledTime) : 'None'}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4 mr-2 inline" />
            Calendar View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            List View
          </button>
        </div>
      </motion.div>

      {/* Scheduled Posts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scheduled Posts
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {scheduledPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {post.image && (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!post.image && (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {post.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(post.scheduledTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {post.platforms.map((platformId) => (
                          <span key={platformId}>
                            {getPlatformIcon(platformId)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Create Post Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Post
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Post Title"
                placeholder="Enter post title..."
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  placeholder="Write your post content..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platforms
                </label>
                <div className="flex space-x-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <label key={platform.id} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <Icon className={`h-5 w-5 ${platform.color} mr-2`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {platform.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                />
                <Input
                  label="Time"
                  type="time"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button>
                Schedule Post
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PostScheduler;