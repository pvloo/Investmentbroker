/**
 * Market Performance Optimizer
 * Implements caching, lazy loading, and optimized data fetching
 */

class MarketPerformanceOptimizer {
  constructor() {
    this.API_BASE = "https://api.coingecko.com/api/v3";
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    this.CACHE_KEY = 'rivertrade_market_cache';
    this.GLOBAL_KEY = 'rivertrade_global_cache';
    this.COINS_KEY = 'rivertrade_coins_cache';
    this.isLoading = false;
    this.requestQueue = new Map();
    this.init();
  }

  /**
   * Initialize the optimizer
   */
  init() {
    this.setupLazyLoading();
    this.setupRequestDeduplication();
    this.prefetchOnIdle();
  }

  /**
   * Setup lazy loading with Intersection Observer
   */
  setupLazyLoading() {
    const marketSection = document.querySelector('.marketvh');
    
    // Always fetch data immediately if visible, don't wait for intersection
    if (marketSection && marketSection.offsetParent !== null) {
      // Element is visible on page load
      this.fetchDashboardOptimized();
      return;
    }

    if (!marketSection || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.fetchDashboardOptimized();
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (marketSection) {
      observer.observe(marketSection);
    }
  }

  /**
   * Setup request deduplication to prevent concurrent API calls
   */
  setupRequestDeduplication() {
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000; // Minimum 1 second between requests
  }

  /**
   * Prefetch data on idle time (requestIdleCallback) with immediate init
   */
  prefetchOnIdle() {
    // Initialize immediately with cached data if available
    const cached = this.getCache(this.CACHE_KEY);
    if (cached && !this.isCacheExpired(cached.timestamp)) {
      // Data already rendered by setupLazyLoading
      return;
    }

    // Prefetch in background after short delay
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => this.warmCache(), { timeout: 2000 });
    } else {
      setTimeout(() => this.warmCache(), 1000);
    }
  }

  /**
   * Warm the cache with fresh data in the background
   */
  async warmCache() {
    const cached = this.getCache(this.CACHE_KEY);
    if (!cached || this.isCacheExpired(cached.timestamp)) {
      try {
        await this.fetchDashboardOptimized(true); // Background refresh
      } catch (e) {
        console.debug('Background cache update failed (non-blocking)', e);
      }
    }
  }

  /**
   * Get cached data
   */
  getCache(key) {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error('Cache read error:', e);
      return null;
    }
  }

  /**
   * Set cached data
   */
  setCache(key, data) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      );
    } catch (e) {
      console.error('Cache write error:', e);
    }
  }

  /**
   * Check if cache is expired
   */
  isCacheExpired(timestamp) {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  /**
   * Deduplicate requests - prevents duplicate API calls
   */
  async deduplicateRequest(key, fetchFn) {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key);
    }

    const request = fetchFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, request);
    return request;
  }

  /**
   * Optimized dashboard fetch with caching - shows cache immediately
   */
  async fetchDashboardOptimized(isBackground = false) {
    if (!isBackground && this.isLoading) return;

    // Check if we have cache and show it immediately
    const cached = this.getCache(this.CACHE_KEY);
    if (cached && !this.isCacheExpired(cached.timestamp)) {
      this.renderDashboard(cached.data, true); // Render from cache immediately - no loading state
      // Still refresh in background if cache is older than 2 minutes
      if (!isBackground && (Date.now() - cached.timestamp > 2 * 60 * 1000)) {
        this.deduplicateRequest('dashboard-bg', () =>
          this.fetchDashboardData().then(data => {
            this.setCache(this.CACHE_KEY, data);
            this.renderDashboard(data, false);
          }).catch(e => console.debug('Background refresh failed', e))
        );
      }
      return;
    }

    // Show skeleton loaders only if we have no cache
    if (!isBackground) {
      this.showSkeletonLoaders();
      this.isLoading = true;
    }

    try {
      // Deduplicate requests
      const data = await this.deduplicateRequest('dashboard', () =>
        this.fetchDashboardData()
      );

      // Cache the results
      this.setCache(this.CACHE_KEY, data);

      // Render the data
      this.renderDashboard(data, false);
    } catch (error) {
      if (!isBackground) {
        console.error('Failed to fetch dashboard data:', error);
        // Only show error if we have no cache at all
        if (!cached) {
          this.showError('Failed to load market data. Please try again.');
        }
      }
    } finally {
      if (!isBackground) {
        this.isLoading = false;
      }
    }
  }

  /**
   * Fetch dashboard data with parallel requests and CORS proxy fallback
   */
  async fetchDashboardData() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      // Try direct fetch first
      const [globalRes, coinsRes] = await Promise.all([
        fetch(`${this.API_BASE}/global?localization=false`, { signal: controller.signal }),
        fetch(
          `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en`,
          { signal: controller.signal }
        )
      ]);

      if (!globalRes.ok || !coinsRes.ok) {
        throw new Error('API request failed');
      }

      const [global, coins] = await Promise.all([
        globalRes.json(),
        coinsRes.json()
      ]);

      // Format the data once
      return {
        global: this.formatGlobalData(global.data),
        coins: this.formatCoinsData(coins),
        timestamp: Date.now()
      };
    } catch (error) {
      console.debug('Direct API fetch failed, trying CORS proxy:', error.message);
      
      // Try CORS proxy fallback
      try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const globalUrl = corsProxy + encodeURIComponent(`${this.API_BASE}/global?localization=false`);
        const coinsUrl = corsProxy + encodeURIComponent(
          `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en`
        );

        clearTimeout(timeout);
        const timeout2 = setTimeout(() => controller.abort(), 10000);

        const [globalRes, coinsRes] = await Promise.all([
          fetch(globalUrl, { signal: controller.signal }),
          fetch(coinsUrl, { signal: controller.signal })
        ]);

        if (!globalRes.ok || !coinsRes.ok) {
          throw new Error('CORS proxy request failed');
        }

        const [global, coins] = await Promise.all([
          globalRes.json(),
          coinsRes.json()
        ]);

        clearTimeout(timeout2);

        return {
          global: this.formatGlobalData(global.data),
          coins: this.formatCoinsData(coins),
          timestamp: Date.now()
        };
      } catch (proxyError) {
        console.debug('CORS proxy also failed:', proxyError.message);
        throw new Error('Failed to fetch data from both direct API and CORS proxy');
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Format global market data
   */
  formatGlobalData(g) {
    return {
      marketCap: `$${(g.total_market_cap.usd / 1e12).toFixed(2)}T`,
      volume: `$${(g.total_volume.usd / 1e9).toFixed(2)}B`,
      btcDominance: `${g.market_cap_percentage.btc.toFixed(2)}%`,
      ethDominance: `${g.market_cap_percentage.eth.toFixed(2)}%`,
      overview: 'Projects: 3640 | Funds: 417 | Platforms: 118'
    };
  }

  /**
   * Format coins data with pre-computed values
   */
  formatCoinsData(coins) {
    return coins.map(c => ({
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      image: c.image,
      rank: c.market_cap_rank || '-',
      price: c.current_price,
      change: c.price_change_percentage_24h || 0,
      roi: (Math.random() * 3).toFixed(2) + 'x',
      marketcap: c.market_cap || 0
    }));
  }

  /**
   * Render dashboard with pre-rendered HTML
   */
  renderDashboard(data, fromCache = false) {
    // Update date
    const dateEl = document.getElementById('date');
    if (dateEl) {
      dateEl.textContent = new Date().toDateString();
    }

    // Update overview
    const overviewEl = document.getElementById('overview');
    if (overviewEl) {
      overviewEl.textContent = data.global.overview;
    }

    // Update stats cards - batch DOM updates
    const updates = [
      ['market-cap', data.global.marketCap],
      ['volume', data.global.volume],
      ['btc', data.global.btcDominance],
      ['eth', data.global.ethDominance]
    ];

    requestAnimationFrame(() => {
      updates.forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = value;
          el.parentElement.style.opacity = '1';
          el.parentElement.style.pointerEvents = 'auto';
        }
      });
    });

    // Store coins data globally for use in main.js filters
    if (typeof window !== 'undefined' && window.coinsData !== undefined) {
      window.coinsData = data.coins;
      
      // Trigger filter initialization if available
      if (typeof window.initializeTableFilters === 'function') {
        window.initializeTableFilters();
      }
    }

    // Render table with document fragment for better performance
    this.renderTable(data.coins);

    if (!fromCache) {
      // Schedule next refresh
      this.scheduleNextRefresh();
    }
  }

  /**
   * Render table efficiently using DocumentFragment
   */
  renderTable(coins) {
    const tbody = document.querySelector('#projects tbody');
    if (!tbody) return;

    // Use innerHTML with template for better performance
    const html = coins
      .slice(0, 50)
      .map(c => `
      <tr>
        <td>
          <img src="${c.image}" alt="${c.name}" loading="lazy" decoding="async" style="width:24px;height:24px;margin-right:8px;border-radius:50%;vertical-align:middle;" />
          ${c.name}
        </td>
        <td>${c.rank}</td>
        <td>$${c.price.toLocaleString()}</td>
        <td class="${c.change >= 0 ? 'positive' : 'negative'}">${c.change.toFixed(2)}%</td>
        <td>${c.roi}</td>
        <td>$${(c.marketcap / 1e9).toFixed(2)}B</td>
      </tr>
    `)
      .join('');

    // Single DOM update
    tbody.innerHTML = html;

    // Enable lazy loading for images after render
    requestAnimationFrame(() => this.setupImageLazyLoading());
  }

  /**
   * Setup lazy loading for table images - use native browser lazy loading
   */
  setupImageLazyLoading() {
    // Modern browsers support native lazy loading via 'loading="lazy"' attribute
    // If IntersectionObserver available, use it for unsupported browsers
    if (typeof IntersectionObserver !== 'undefined') {
      const images = document.querySelectorAll('#projects img[loading="lazy"]');
      if (images.length === 0) return;

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            // Force load for browsers without native lazy loading support
            if (img.dataset.src && !img.src.startsWith('data:')) {
              img.src = img.dataset.src;
            }
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Show skeleton loaders
   */
  showSkeletonLoaders() {
    const statsCards = document.querySelectorAll('.stats .card');
    statsCards.forEach(card => {
      card.style.opacity = '0.6';
      card.style.pointerEvents = 'none';
    });

    const tbody = document.querySelector('#projects tbody');
    if (tbody) {
      tbody.innerHTML = Array.from({ length: 8 })
        .map(
          () => `
        <tr style="opacity: 0.5;">
          <td><span style="background: #444; width: 120px; height: 20px; display: inline-block; border-radius: 4px;"></span></td>
          <td><span style="background: #444; width: 40px; height: 20px; display: inline-block; border-radius: 4px;"></span></td>
          <td><span style="background: #444; width: 80px; height: 20px; display: inline-block; border-radius: 4px;"></span></td>
          <td><span style="background: #444; width: 60px; height: 20px; display: inline-block; border-radius: 4px;"></span></td>
          <td><span style="background: #444; width: 50px; height: 20px; display: inline-block; border-radius: 4px;"></span></td>
          <td><span style="background: #444; width: 70px; height: 20px; display: inline-block; border-radius: 4px;"></span></td>
        </tr>
      `
        )
        .join('');
    }
  }

  /**
   * Schedule next refresh
   */
  scheduleNextRefresh() {
    setTimeout(() => {
      this.fetchDashboardOptimized(true); // Background refresh
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Show error message
   */
  showError(message) {
    const tbody = document.querySelector('#projects tbody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #999;">${message}</td></tr>`;
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      cacheStatus: this.getCache(this.CACHE_KEY) ? 'cached' : 'empty',
      isLoading: this.isLoading,
      pendingRequests: this.requestQueue.size
    };
  }

  /**
   * Clear cache (for testing)
   */
  clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.GLOBAL_KEY);
    localStorage.removeItem(this.COINS_KEY);
  }
}

// Initialize optimizer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.marketOptimizer = new MarketPerformanceOptimizer();
  });
} else {
  window.marketOptimizer = new MarketPerformanceOptimizer();
}

// Expose for debugging
window.getMarketMetrics = () => window.marketOptimizer?.getMetrics();
window.clearMarketCache = () => window.marketOptimizer?.clearCache();
