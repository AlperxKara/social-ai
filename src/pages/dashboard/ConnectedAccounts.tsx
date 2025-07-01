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
  Music,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Copy,
  Eye
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SocialMediaService, getPlatformUrlExamples } from '../../services/socialMediaService';
import type { Database } from '../../lib/database.types';

type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];

export const ConnectedAccounts: React.FC = () => {
  const [accounts, setAccounts] = React.useState<SocialAccount[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [connectingPlatform, setConnectingPlatform] = React.useState<string | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('');
  const [profileUrl, setProfileUrl] = React.useState('');
  const [urlError, setUrlError] = React.useState('');

  const platforms = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'bg-pink-500',
      description: 'Fotoğraf ve video paylaşım platformu'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: Music, 
      color: 'bg-black',
      description: 'Kısa video içerik platformu'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'bg-blue-600',
      description: 'Sosyal ağ platformu'
    },
    { 
      id: 'twitter', 
      name: 'Twitter/X', 
      icon: Twitter, 
      color: 'bg-blue-400',
      description: 'Mikroblog platformu'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'bg-blue-700',
      description: 'Profesyonel ağ platformu'
    }
  ];

  const urlExamples = getPlatformUrlExamples();

  React.useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      setLoading(true);
      const connectedAccounts = await SocialMediaService.getConnectedAccounts();
      setAccounts(connectedAccounts);
    } catch (error) {
      console.error('Bağlı hesaplar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedPlatform || !profileUrl.trim()) {
      setUrlError('Platform ve profil linki gerekli');
      return;
    }

    // URL doğrulama
    if (!SocialMediaService.validateProfileUrl(profileUrl, selectedPlatform)) {
      setUrlError('Geçersiz profil linki. Lütfen doğru format kullanın.');
      return;
    }

    setConnectingPlatform(selectedPlatform);
    setUrlError('');

    try {
      let result;
      
      switch (selectedPlatform) {
        case 'instagram':
          result = await SocialMediaService.connectInstagramByProfile(profileUrl);
          break;
        case 'tiktok':
          result = await SocialMediaService.connectTikTokByProfile(profileUrl);
          break;
        case 'facebook':
          result = await SocialMediaService.connectFacebookByProfile(profileUrl);
          break;
        case 'twitter':
          result = await SocialMediaService.connectTwitterByProfile(profileUrl);
          break;
        case 'linkedin':
          result = await SocialMediaService.connectLinkedInByProfile(profileUrl);
          break;
        default:
          throw new Error('Desteklenmeyen platform');
      }

      await loadConnectedAccounts();
      setShowAddModal(false);
      setProfileUrl('');
      setSelectedPlatform('');
    } catch (error: any) {
      setUrlError(error.message || 'Hesap bağlanırken hata oluştu');
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await SocialMediaService.disconnectAccount(accountId);
      await loadConnectedAccounts();
    } catch (error) {
      console.error('Hesap bağlantısı kesilirken hata:', error);
    }
  };

  const handleSync = async (accountId: string) => {
    try {
      await SocialMediaService.syncAccountData(accountId);
      await loadConnectedAccounts();
    } catch (error) {
      console.error('Hesap senkronize edilirken hata:', error);
    }
  };

  const getConnectedAccount = (platformId: string) => {
    return accounts.find(account => account.platform === platformId && account.is_active);
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className="h-4 w-4 text-white" />;
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          Bağlı Hesaplar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sosyal medya hesaplarınızı profil linkleri ile bağlayın ve tek yerden yönetin.
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              Önemli Bilgi
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Bu sistemi kullanabilmek için sosyal medya hesaplarınızın <strong>herkese açık</strong> olması gerekmektedir. 
              Gizli/özel hesaplardan veri çekilemez. Hesaplarınızı bağladıktan sonra takipçi sayısı, gönderi sayısı ve 
              etkileşim verileri otomatik olarak güncellenecektir.
            </p>
          </div>
        </div>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {platform.description}
                    </p>
                  </div>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => connectedAccount && handleSync(connectedAccount.id)}
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {connectedAccount ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Bağlı
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{connectedAccount.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFollowerCount(connectedAccount.followers_count)} takipçi
                    </p>
                  </div>

                  {connectedAccount.last_sync_at && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Son güncelleme: {new Date(connectedAccount.last_sync_at).toLocaleDateString('tr-TR')}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(connectedAccount.id)}
                      className="flex-1"
                    >
                      Bağlantıyı Kes
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
                      onClick={() => window.open(connectedAccount.profile_url || '', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-5 w-5 bg-gray-300 rounded-full" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Bağlı Değil
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hesabınızı bağlamak için profil linkinizi ekleyin
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setShowAddModal(true);
                    }}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Hesap Bağla
                  </Button>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Hesap Bağla
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setProfileUrl('');
                  setUrlError('');
                  setSelectedPlatform('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            {selectedPlatform && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`p-2 ${platforms.find(p => p.id === selectedPlatform)?.color} rounded-lg`}>
                    {getPlatformIcon(selectedPlatform)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {platforms.find(p => p.id === selectedPlatform)?.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Profil linkinizi girin
                    </p>
                  </div>
                </div>

                <div>
                  <Input
                    label="Profil Linki"
                    value={profileUrl}
                    onChange={(e) => {
                      setProfileUrl(e.target.value);
                      setUrlError('');
                    }}
                    placeholder={urlExamples[selectedPlatform as keyof typeof urlExamples]}
                    error={urlError}
                  />
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(urlExamples[selectedPlatform as keyof typeof urlExamples])}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Örnek formatı kopyala
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Eye className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        <strong>Önemli:</strong> Hesabınızın herkese açık olduğundan emin olun. 
                        Gizli hesaplardan veri çekilemez.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setProfileUrl('');
                      setUrlError('');
                      setSelectedPlatform('');
                    }}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button
                    onClick={handleConnect}
                    loading={connectingPlatform === selectedPlatform}
                    disabled={!profileUrl.trim() || connectingPlatform === selectedPlatform}
                    className="flex-1"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Bağla
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Usage Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Kullanım İpuçları
        </h3>
        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
            <span>Hesaplarınızın herkese açık olduğundan emin olun</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
            <span>Profil linklerini doğru formatta girin (örnekleri takip edin)</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
            <span>Veriler otomatik olarak güncellenecek, manuel senkronizasyon da yapabilirsiniz</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
            <span>Hesap verileriniz güvenli şekilde şifrelenerek saklanır</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default ConnectedAccounts;