import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Plus,
  ArrowRight,
  Image,
  Sparkles,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const DashboardOverview: React.FC = () => {
  const stats = [
    {
      name: 'Total Posts',
      value: '248',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Calendar
    },
    {
      name: 'Engagement Rate',
      value: '4.2%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      name: 'Followers',
      value: '12.5K',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      name: 'AI Credits Used',
      value: '156',
      change: '78 remaining',
      changeType: 'neutral' as const,
      icon: Zap
    }
  ];

  const quickActions = [
    {
      name: 'Generate AI Image',
      description: 'Create stunning visuals with AI',
      icon: Image,
      href: '/dashboard/generator',
      color: 'bg-purple-500'
    },
    {
      name: 'Write AI Caption',
      description: 'Generate engaging captions',
      icon: Sparkles,
      href: '/dashboard/captions',
      color: 'bg-blue-500'
    },
    {
      name: 'Get Strategy Tips',
      description: 'AI-powered recommendations',
      icon: Target,
      href: '/dashboard/strategy',
      color: 'bg-green-500'
    },
    {
      name: 'Schedule Post',
      description: 'Plan your content calendar',
      icon: Calendar,
      href: '/dashboard/scheduler',
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    {
      type: 'post',
      title: 'Instagram post published',
      time: '2 hours ago',
      engagement: '45 likes, 12 comments'
    },
    {
      type: 'generation',
      title: 'AI image generated',
      time: '4 hours ago',
      engagement: 'Summer sale banner created'
    },
    {
      type: 'schedule',
      title: 'Post scheduled',
      time: '6 hours ago',
      engagement: 'LinkedIn post for tomorrow'
    },
    {
      type: 'analysis',
      title: 'Strategy analysis completed',
      time: '1 day ago',
      engagement: 'Best posting times updated'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your social media presence today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400'
                      : stat.changeType === 'negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={action.name} to={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.engagement}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;