import React, { memo, useMemo, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OptimizedRouter } from './components/optimized-router/OptimizedRouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const ConnectedAccounts = lazy(() => import('./pages/dashboard/ConnectedAccounts'));
const AIGenerator = lazy(() => import('./pages/dashboard/AIGenerator'));
const AICaptions = lazy(() => import('./pages/dashboard/AICaptions'));
const StrategyAssistant = lazy(() => import('./pages/dashboard/StrategyAssistant'));
const PostScheduler = lazy(() => import('./pages/dashboard/PostScheduler'));
const MediaLibrary = lazy(() => import('./pages/dashboard/MediaLibrary'));
const Analytics = lazy(() => import('./pages/dashboard/Analytics'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const TikTokCallback = lazy(() => import('./pages/auth/TikTokCallback'));

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
});

ProtectedRoute.displayName = 'ProtectedRoute';

const PublicRoute: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
});

PublicRoute.displayName = 'PublicRoute';

const AppRoutes: React.FC = memo(() => {
  const location = useLocation();
  
  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => (
    <Routes location={location} key={location.pathname}>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <>
              <Header />
              <LandingPage />
              <Footer />
            </>
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/tiktok/callback"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <TikTokCallback />
          </Suspense>
        }
      />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="accounts" element={<ConnectedAccounts />} />
        <Route path="generator" element={<AIGenerator />} />
        <Route path="captions" element={<AICaptions />} />
        <Route path="strategy" element={<StrategyAssistant />} />
        <Route path="scheduler" element={<PostScheduler />} />
        <Route path="library" element={<MediaLibrary />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ), [location.pathname]);

  return routes;
});

AppRoutes.displayName = 'AppRoutes';

const AppContent: React.FC = memo(() => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AppRoutes />
    </div>
  );
});

AppContent.displayName = 'AppContent';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OptimizedRouter>
          <AppContent />
        </OptimizedRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;