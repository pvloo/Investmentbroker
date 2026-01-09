/**
 * TradingView Ticker Tape Loader
 * Loads the TradingView widget with mobile-responsive configuration
 */

class TradingViewLoader {
  constructor() {
    this.container = document.querySelector('[data-lazy-tradingview]');
    this.isLoaded = false;
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    if (!this.container) return;

    // Load widget on page load or when scrolled into view
    if ('IntersectionObserver' in window) {
      this.setupLazyLoad();
    } else {
      // Fallback: load after 1 second
      setTimeout(() => this.loadWidget(), 1000);
    }

    // Handle resize to adapt configuration
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
  }

  /**
   * Setup lazy loading with Intersection Observer
   */
  setupLazyLoad() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoaded) {
            this.loadWidget();
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );

    observer.observe(this.container);
  }

  /**
   * Get responsive configuration based on device
   */
  getConfig() {
    // Configuration to ensure all symbols display on both mobile and desktop
    const config = {
      symbols: [
        { title: 'S&P 500', proName: 'OANDA:SPX500USD' },
        { title: 'Nasdaq 100', proName: 'OANDA:NAS100USD' },
        { title: 'EUR/USD', proName: 'FX_IDC:EURUSD' },
        { title: 'BTC/USD', proName: 'BITSTAMP:BTCUSD' },
        { title: 'ETH/USD', proName: 'BITSTAMP:ETHUSD' }
      ],
      colorTheme: 'dark',
      isTransparent: true,
      displayMode: 'adaptive',
      showSymbolLogo: true,
      locale: 'en'
    };

    return config;
  }

  /**
   * Load TradingView widget
   */
  loadWidget() {
    if (this.isLoaded) return;
    this.isLoaded = true;

    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;

    // Get responsive configuration
    const config = this.getConfig();

    // Attach config as script text content
    script.textContent = JSON.stringify(config);

    // Append to container
    this.container.appendChild(script);

    console.log('TradingView widget loaded for', this.isMobile ? 'mobile' : 'desktop');
  }

  /**
   * Handle resize to update device type
   */
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    // If device type changed and widget is loaded, you could reload
    // (optional - TradingView handles responsive internally)
    if (wasMobile !== this.isMobile) {
      console.log('Device type changed to', this.isMobile ? 'mobile' : 'desktop');
    }
  }

  /**
   * Get loader status
   */
  getStatus() {
    return {
      containerFound: !!this.container,
      isLoaded: this.isLoaded,
      isMobile: this.isMobile,
      supportsIntersectionObserver: 'IntersectionObserver' in window,
      windowWidth: window.innerWidth
    };
  }
}

// Initialize loader when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.tradingViewLoader = new TradingViewLoader();
  });
} else {
  window.tradingViewLoader = new TradingViewLoader();
}

// Expose for debugging
window.getTradingViewStatus = () => window.tradingViewLoader?.getStatus();
