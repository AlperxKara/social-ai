class CacheManager {
  private cache = new Map<string, any>();
  private maxSize = 100;

  set(key: string, value: any, ttl: number = 5 * 60 * 1000): void {
    // Clear cache if it's too large
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const item = {
      value,
      timestamp: Date.now(),
      ttl
    };

    this.cache.set(key, item);
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cache page components
  cachePage(path: string, component: any): void {
    this.set(`page:${path}`, component, 10 * 60 * 1000); // 10 minutes
  }

  getPage(path: string): any | null {
    return this.get(`page:${path}`);
  }

  // Cache API responses
  cacheAPI(endpoint: string, data: any): void {
    this.set(`api:${endpoint}`, data, 5 * 60 * 1000); // 5 minutes
  }

  getAPI(endpoint: string): any | null {
    return this.get(`api:${endpoint}`);
  }
}

export const cacheManager = new CacheManager(); 