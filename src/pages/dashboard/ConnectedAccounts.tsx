import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Instagram,
  Facebook,
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink,
  Loader2,
  RefreshCw,
  Music
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SocialMediaService, getInstagramAuthUrl, getFacebookAuthUrl, getTikTokAuthUrl } from '../../services/socialMediaService';
import type { Database } from '../../lib/database.types';

type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];

export const ConnectedAccounts: React.FC = () => {
  const [accounts, setAccounts] = React.useState<SocialAccount[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [connectingPlatform, setConnectingPlatform] = React.useState<string | null>(null);

  const platforms = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'bg-pink-500',
      authUrl: getInstagramAuthUrl()
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'bg-blue-600',
      authUrl: getFacebookAuthUrl()
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: Music, 
      color: 'bg-black',
      authUrl: getTikTokAuthUrl()
    }
  ];

  React.useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      setLoading(true);
      const connectedAccounts = await SocialMediaService.getConnectedAccounts();
      setAccounts(connectedAccounts);
    } catch (error) {
      console.error('Error loading connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    setConnectingPlatform(platform);
    
    const platformConfig = platforms.find(p => p.id === platform);
    if (platformConfig) {
      // Redirect to OAuth URL
      window.location.href = platformConfig.authUrl;
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await SocialMediaService.disconnectAccount(accountId);
      await loadConnectedAccounts();
    } catch (error) {
      console.error('Error disconnecting account:', error);
    }
  };

  const handleSync = async (accountId: string) => {
    try {
      await SocialMediaService.syncAccountData(accountId);
      await loadConnectedAccounts();
    } catch (error) {
      console.error('Error syncing account:', error);
    }
  };

  const getConnectedAccount = (platformId: string) => {
    return accounts.find(account => account.platform === platformId && account.is_active);
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className={`h-4 w-4 text-white`} />;
  };

  const getStatusIcon = (account: SocialAccount | undefined) => {
    if (!account) {
      return <div className="h-5 w-5 bg-gray-300 rounded-full" />;
    }
    
    // Check if token is expired
    const isExpired = account.token_expires_at && new Date(account.token_expires_at) < new Date();
    
    if (isExpired) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
    
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getStatusText = (account: SocialAccount | undefined) => {
    if (!account) {
      return 'Not Connected';
    }
    
    const isExpired = account.token_expires_at && new Date(account.token_expires_at) < new Date();
    
    if (isExpired) {
      return 'Token Expired';
    }
    
    return 'Connected';
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Connected Accounts
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Connect your social media accounts to start managing them from one place.
        </p>
      </motion.div>

      {/* Connected Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform, index) => {
          const connectedAccount = getConnectedAccount(platform.id);
          const Icon = platform.icon;
          
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${platform.color} rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {platform.name}
                    </h3>
                    {connectedAccount && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{connectedAccount.username}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => connectedAccount && handleSync(connectedAccount.id)}
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(connectedAccount)}
                  <span className={`text-sm font-medium ${
                    connectedAccount && getStatusText(connectedAccount) === 'Connected'
                      ? 'text-green-600 dark:text-green-400'
                      : connectedAccount && getStatusText(connectedAccount) === 'Token Expired'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {getStatusText(connectedAccount)}
                  </span>
                </div>
                {connectedAccount && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFollowerCount(connectedAccount.followers_count)} followers
                  </div>
                )}
              </div>

              {connectedAccount && connectedAccount.last_sync_at && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Last synced: {new Date(connectedAccount.last_sync_at).toLocaleDateString()}
                </div>
              )}

              <div className="flex space-x-2">
                {connectedAccount ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(connectedAccount.id)}
                      className="flex-1"
                    >
                      Disconnect
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3"
                      onClick={() => handleSync(connectedAccount.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleConnect(platform.id)}
                    className="flex-1"
                    size="sm"
                    loading={connectingPlatform === platform.id}
                    disabled={connectingPlatform === platform.id}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>

              {connectedAccount && getStatusText(connectedAccount) === 'Token Expired' && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Connection expired. Please reconnect your account to continue posting.
                  </p>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => handleConnect(platform.id)}
                  >
                    Reconnect
                  </Button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add New Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Plus className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Connect More Platforms
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Add more social media accounts to expand your reach and manage everything from one dashboard.
        </p>
        <div className="flex justify-center space-x-2">
          {platforms.filter(p => !getConnectedAccount(p.id)).map((platform) => {
            const Icon = platform.icon;
            return (
              <Button
                key={platform.id}
                variant="outline"
                size="sm"
                onClick={() => handleConnect(platform.id)}
                className="flex items-center space-x-2"
              >
                <div className={`p-1 ${platform.color} rounded`}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <span>{platform.name}</span>
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Connection Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          Connection Tips
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-300">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>Ensure you have admin access to all accounts you want to connect</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>Check your privacy settings to allow third-party app connections</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>Reconnect accounts if you experience any posting issues</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>Your account data is securely encrypted and stored</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default ConnectedAccounts;