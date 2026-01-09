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
    if (!marketSection && typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.fetchDashboardOptimized();
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
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
   * Prefetch data on idle time (requestIdleCallback)
   */
  prefetchOnIdle() {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => this.warmCache(), { timeout: 5000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => this.warmCache(), 3000);
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
   * Optimized dashboard fetch with caching
   */
  async fetchDashboardOptimized(isBackground = false) {
    if (!isBackground && this.isLoading) return;

    // Check if we have fresh cache
    const cached = this.getCache(this.CACHE_KEY);
    if (cached && !this.isCacheExpired(cached.timestamp)) {
      this.renderDashboard(cached.data, true); // Render from cache immediately
      return;
    }

    // Show skeleton loaders if not in background
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
        this.showError('Failed to load market data. Please try again.');
      }
    } finally {
      if (!isBackground) {
        this.isLoading = false;
      }
    }
  }

  /**
   * Fetch dashboard data with parallel requests
   */
  async fetchDashboardData() {
    const [globalRes, coinsRes] = await Promise.all([
      fetch(`${this.API_BASE}/global?localization=false`),
      fetch(
        `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en`
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

    const fragment = document.createDocumentFragment();
    const rows = coins
      .slice(0, 50)
      .map(c => this.createTableRow(c));

    rows.forEach(row => fragment.appendChild(row));

    // Single DOM update
    tbody.innerHTML = '';
    tbody.appendChild(fragment);

    // Enable lazy loading for images
    this.setupImageLazyLoading();
  }

  /**
   * Create optimized table row
   */
  createTableRow(c) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <img src="${c.image}" alt="${c.name}" loading="lazy" style="width:24px;height:24px;margin-right:8px;border-radius:50%;vertical-align:middle;" />
        ${c.name}
      </td>
      <td>${c.rank}</td>
      <td>$${c.price.toLocaleString()}</td>
      <td class="${c.change >= 0 ? 'positive' : 'negative'}">${c.change.toFixed(2)}%</td>
      <td>${c.roi}</td>
      <td>$${(c.marketcap / 1e9).toFixed(2)}B</td>
    `;
    return tr;
  }

  /**
   * Setup lazy loading for table images
   */
  setupImageLazyLoading() {
    if (typeof IntersectionObserver !== 'undefined') {
      const images = document.querySelectorAll('#projects img[loading="lazy"]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src; // Trigger load
            observer.unobserve(img);
          }
        });
      });
      images.forEach(img => observer.observe(img));
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
