import React, { useMemo, useCallback } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Calendar,
  BarChart3,
  Settings,
  Users,
  Sparkles,
  Target,
  FolderOpen,
  Link as LinkIcon,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Memoize navigation items to prevent re-creation
const createNavigationItems = (userRole?: string) => [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Connected Accounts', href: '/dashboard/accounts', icon: LinkIcon },
  { name: 'AI Image Generator', href: '/dashboard/generator', icon: Image },
  { name: 'AI Captions', href: '/dashboard/captions', icon: Sparkles },
  { name: 'Strategy Assistant', href: '/dashboard/strategy', icon: Target },
  { name: 'Post Scheduler', href: '/dashboard/scheduler', icon: Calendar },
  { name: 'Media Library', href: '/dashboard/library', icon: FolderOpen },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ...(userRole === 'agency' ? [{ name: 'Team', href: '/dashboard/team', icon: Users }] : []),
  { name: 'Settings', href: '/dashboard/settings', icon: Settings }
];

export const DashboardLayout: React.FC = React.memo(() => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = useMemo(() => 
    createNavigationItems(profile?.role), 
    [profile?.role]
  );

  const isActive = useCallback((href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [signOut]);

  // Memoize sidebar content
  const sidebarContent = useMemo(() => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SocialAI
          </span>
        </Link>
        <button
          onClick={handleSidebarClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleSidebarClose}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User menu */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {profile?.full_name || user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign out
        </button>
      </div>
    </div>
  ), [navigation, isActive, handleSidebarClose, handleSignOut, profile?.full_name, user?.email]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={handleSidebarClose}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleSidebarToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {profile?.role} Plan
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;