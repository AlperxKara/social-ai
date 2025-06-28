import React, { memo, useMemo, useCallback } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { cacheManager } from '../../utils/cacheManager';

interface OptimizedRouterProps {
  children: React.ReactNode;
}

const RouterContent: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Preload next possible routes
  const preloadRoutes = useCallback(() => {
    const routes = [
      '/dashboard',
      '/dashboard/accounts',
      '/dashboard/generator',
      '/dashboard/captions',
      '/dashboard/strategy',
      '/dashboard/scheduler',
      '/dashboard/library',
      '/dashboard/analytics',
      '/dashboard/settings'
    ];

    routes.forEach(route => {
      if (!cacheManager.has(`route:${route}`)) {
        // Preload route data
        cacheManager.set(`route:${route}`, { preloaded: true }, 30 * 60 * 1000);
      }
    });
  }, []);

  // Memoize location changes
  const locationKey = useMemo(() => {
    return `${location.pathname}${location.search}`;
  }, [location.pathname, location.search]);

  // Preload routes when location changes
  React.useEffect(() => {
    preloadRoutes();
  }, [location.pathname, preloadRoutes]);

  // Cache current page
  React.useEffect(() => {
    cacheManager.cachePage(location.pathname, { timestamp: Date.now() });
  }, [location.pathname]);

  return (
    <div key={locationKey}>
      {children}
    </div>
  );
});

RouterContent.displayName = 'RouterContent';

export const OptimizedRouter: React.FC<OptimizedRouterProps> = memo(({ children }) => {
  return (
    <BrowserRouter>
      <RouterContent>
        {children}
      </RouterContent>
    </BrowserRouter>
  );
});

OptimizedRouter.displayName = 'OptimizedRouter'; 