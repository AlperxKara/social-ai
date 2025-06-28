import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const location = useLocation();
  const prevLocationRef = useRef(location);

  useEffect(() => {
    // Only trigger transition if pathname changed
    if (prevLocationRef.current.pathname !== location.pathname) {
      // Preload next page data if needed
      const preloadData = async () => {
        // Add any preloading logic here
        // For example, prefetch API calls for the next page
      };

      preloadData();
      prevLocationRef.current = location;
    }
  }, [location]);

  return {
    isTransitioning: prevLocationRef.current.pathname !== location.pathname,
    currentPath: location.pathname,
    previousPath: prevLocationRef.current.pathname,
  };
}; 