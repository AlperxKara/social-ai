import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  security: boolean;
}

interface UserSettings {
  bio?: string;
  phone?: string;
  company?: string;
  language: string;
  timezone: string;
  notifications: NotificationSettings;
}

export const Settings: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form states
  const [profileData, setProfileData] = React.useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    bio: '',
    phone: '',
    company: '',
    role: profile?.role || 'individual'
  });

  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [userSettings, setUserSettings] = React.useState<UserSettings>({
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      marketing: false,
      security: true
    }
  });

  const [billingInfo, setBillingInfo] = React.useState({
    plan: 'Pro',
    price: '$29',
    period: 'month',
    nextBilling: '2024-02-15',
    paymentMethod: '**** 4242'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Globe }
  ];

  // Load user settings on component mount
  React.useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      // Load additional user data from a settings table or profile extensions
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          email: data.email || '',
          bio: data.bio || '',
          phone: data.phone || '',
          company: data.company || '',
          role: data.role || 'individual'
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          email: profileData.email,
          role: profileData.role as 'individual' | 'agency',
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      await updateProfile({
        full_name: profileData.full_name,
        email: profileData.email,
        role: profileData.role as 'individual' | 'agency'
      });

      showMessage('success', 'Profile updated successfully!');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      showMessage('success', 'Password updated successfully!');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      // In a real app, you'd save this to a user_settings table
      // For now, we'll just show success
      showMessage('success', 'Notification preferences updated!');
    } catch (error: any) {
      showMessage('error', 'Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // First delete user data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Then delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user?.id || '');
      
      if (authError) throw authError;

      showMessage('success', 'Account deleted successfully');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
              />
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
              <Input
                label="Phone Number"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
              <Input
                label="Company"
                value={profileData.company}
                onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    value="individual"
                    checked={profileData.role === 'individual'}
                    onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Individual</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    value="agency"
                    checked={profileData.role === 'agency'}
                    onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Agency</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleProfileUpdate} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={loadUserSettings}>
                Cancel
              </Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {Object.entries(userSettings.notifications).map(([key, value]) => {
                  const notificationTypes = {
                    email: { icon: Mail, title: 'Email Notifications', desc: 'Receive notifications via email' },
                    push: { icon: Smartphone, title: 'Push Notifications', desc: 'Receive push notifications on your device' },
                    marketing: { icon: Bell, title: 'Marketing Updates', desc: 'Receive updates about new features and promotions' },
                    security: { icon: Shield, title: 'Security Alerts', desc: 'Receive alerts about account security' }
                  };

                  const config = notificationTypes[key as keyof typeof notificationTypes];
                  const Icon = config.icon;

                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{config.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{config.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setUserSettings(prev => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              [key]: e.target.checked
                            }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleNotificationUpdate} loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Change Password
              </h3>
              <div className="space-y-4 max-w-md">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
                <Button onClick={handlePasswordChange} loading={loading}>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Two-Factor Authentication
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Two-factor authentication is not enabled
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Active Sessions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Current Session
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chrome on macOS • Active now
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded-full">
                    Current
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Current Plan
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      {billingInfo.plan} Plan
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {billingInfo.price}/{billingInfo.period} • Next billing: {billingInfo.nextBilling}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Credits remaining: {profile?.credits_remaining || 0}
                    </p>
                  </div>
                  <Button variant="outline">
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Payment Method
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {billingInfo.paymentMethod}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expires 12/25
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Billing History
              </h3>
              <div className="space-y-3">
                {[
                  { date: '2024-01-01', amount: '$29.00', status: 'Paid' },
                  { date: '2023-12-01', amount: '$29.00', status: 'Paid' },
                  { date: '2023-11-01', amount: '$29.00', status: 'Paid' }
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {invoice.date}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pro Plan - Monthly
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {invoice.amount}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded-full">
                        {invoice.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Theme
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                    <div className="flex space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-200 rounded" />
                      <div className="h-2 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">Light</p>
                </button>

                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="bg-gray-800 rounded-lg p-4 mb-3 shadow-sm">
                    <div className="flex space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-600 rounded" />
                      <div className="h-2 bg-gray-700 rounded w-3/4" />
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark</p>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Language
              </h3>
              <select 
                value={userSettings.language}
                onChange={(e) => setUserSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Timezone
              </h3>
              <select 
                value={userSettings.timezone}
                onChange={(e) => setUserSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="UTC">UTC</option>
                <option value="Europe/Istanbul">Turkey Time (TRT)</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="CET">Central European Time</option>
                <option value="JST">Japan Standard Time</option>
              </select>
            </div>

            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Connected Apps
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Google Analytics', status: 'Connected', color: 'bg-green-100 text-green-800' },
                  { name: 'Zapier', status: 'Not Connected', color: 'bg-gray-100 text-gray-800' },
                  { name: 'Slack', status: 'Connected', color: 'bg-green-100 text-green-800' },
                  { name: 'Discord', status: 'Not Connected', color: 'bg-gray-100 text-gray-800' }
                ].map((app, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {app.name}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${app.color}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {app.status === 'Connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                API Access
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      API Key
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use this key to access our API
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Generate New Key
                  </Button>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded border font-mono text-sm">
                  sk_live_••••••••••••••••••••••••••••••••
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      {/* Message Display */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>

          {/* Danger Zone */}
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
              Danger Zone
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400 mb-3">
              Once you delete your account, there is no going back.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={handleDeleteAccount}
              loading={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {renderTabContent()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;