/**
 * Device-Specific Scrolling Behavior Manager
 * Provides different scrolling experiences for mobile, tablet, and desktop
 */

class ScrollBehaviorManager {
  constructor() {
    this.deviceType = this.detectDevice();
    this.init();
  }

  /**
   * Detect device type based on viewport width and user agent
   */
  detectDevice() {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = /tablet|ipad|playbook|silk|(android(?!.*mobi))/i.test(userAgent);

    if (width <= 768) {
      return 'mobile';
    } else if (width <= 1024 || isTablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  /**
   * Initialize scrolling behavior
   */
  init() {
    this.setupTestimonialScroll();
    this.setupTableScroll();
    this.setupPageScroll();
    this.setupSmoothAnchors();
    this.setupScrollSnapping();
    this.setupDebouncedResize();
  }

  /**
   * Setup debounced resize to prevent handler thrashing
   */
  setupDebouncedResize() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250); // Wait 250ms after resize ends
    }, { passive: true });
  }

  /**
   * Handle window resize to update device type
   */
  handleResize() {
    const newDeviceType = this.detectDevice();
    if (newDeviceType !== this.deviceType) {
      this.deviceType = newDeviceType;
      // Only reinit affected components, not everything
      this.setupTestimonialScroll();
      this.setupTableScroll();
    }
  }

  /**
   * Setup testimonial carousel scrolling with device-specific behavior
   */
  setupTestimonialScroll() {
    const track = document.querySelector('.testimonialtrack');
    if (!track) return;

    // For desktop and tablet, enable animation
    if (this.deviceType === 'desktop' || this.deviceType === 'tablet') {
      this.setupAnimatedCarousel(track);
    } else {
      // For mobile, use manual scrolling
      this.enableMobileCarouselNavigation(track);
    }
  }

  /**
   * Setup animated carousel for desktop and tablet
   */
  setupAnimatedCarousel(track) {
    // Get all original cards
    const cards = track.querySelectorAll('.customertext');
    if (cards.length === 0) return;

    // Clone all cards and append to create infinite loop effect
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });
    
    // Pause animation on hover
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    }, { passive: true });

    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    }, { passive: true });
  }

  /**
   * Enable mobile carousel navigation (touch-friendly snap scrolling)
   */
  enableMobileCarouselNavigation(track) {
    let isScrolling = false;
    let scrollPos = 0;
    let scrollTimeout;

    // Detect scroll start
    track.addEventListener('touchstart', () => {
      isScrolling = true;
      scrollPos = track.scrollLeft;
    }, { passive: true });

    // Snap to cards on scroll end with throttling
    track.addEventListener('touchend', () => {
      isScrolling = false;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.snapToCard(track), 100);
    }, { passive: true });

    // Handle scroll wheel on mobile web
    track.addEventListener('wheel', (e) => {
      if (!isScrolling) {
        e.preventDefault();
        track.scrollLeft += e.deltaY > 0 ? 50 : -50;
      }
    }, { passive: false });
  }

  /**
   * Enable tablet carousel navigation (moderate interactions with throttling)
   */
  enableTabletCarouselNavigation(track) {
    let scrollTimeout;
    
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.snapToCard(track);
      }, 150);
    }, { passive: true });
  }

  /**
   * Enable desktop carousel hover effects
   */
  enableDesktopCarouselHover(track) {
    const cards = track.querySelectorAll('.customertext');

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
      });
    });
  }

  /**
   * Snap carousel to nearest card
   */
  snapToCard(track) {
    const cards = track.querySelectorAll('.customertext');
    let closest = cards[0];
    let closestDistance = Math.abs(cards[0].offsetLeft - track.scrollLeft);

    cards.forEach((card) => {
      const distance = Math.abs(card.offsetLeft - track.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = card;
      }
    });

    closest.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  /**
   * Setup table scrolling behavior
   */
  setupTableScroll() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;

    switch (this.deviceType) {
      case 'mobile':
        tableContainer.style.scrollBehavior = 'auto';
        tableContainer.addEventListener('scroll', () => this.indicateMobileTableScroll(tableContainer));
        break;

      case 'tablet':
        tableContainer.style.scrollBehavior = 'smooth';
        break;

      case 'desktop':
        tableContainer.style.scrollBehavior = 'smooth';
        break;
    }
  }

  /**
   * Show scroll indicator on mobile table
   */
  indicateMobileTableScroll(container) {
    if (container.scrollLeft > 0) {
      container.style.boxShadow = 'inset 20px 0 20px -20px rgba(0, 0, 0, 0.1)';
    } else {
      container.style.boxShadow = 'none';
    }
  }

  /**
   * Setup page-level scrolling
   */
  setupPageScroll() {
    switch (this.deviceType) {
      case 'mobile':
        // Mobile: instant scroll for internal navigation, smooth for page scroll
        document.documentElement.style.scrollBehavior = 'smooth';
        break;

      case 'tablet':
      case 'desktop':
        // Tablet & Desktop: smooth scrolling for all
        document.documentElement.style.scrollBehavior = 'smooth';
        break;
    }
  }

  /**
   * Setup smooth anchor scrolling with offset for fixed headers
   */
  setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const offset = this.deviceType === 'mobile' ? 80 : 60;
        const topPos = target.offsetTop - offset;

        window.scrollTo({
          top: topPos,
          behavior: this.deviceType === 'mobile' ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  }

  /**
   * Setup scroll snapping behavior
   */
  setupScrollSnapping() {
    const snapContainers = document.querySelectorAll('[data-scroll-snap="enabled"]');

    snapContainers.forEach((container) => {
      switch (this.deviceType) {
        case 'mobile':
          container.style.scrollSnapType = 'x mandatory';
          container.style.scrollSnapStop = 'always';
          break;

        case 'tablet':
          container.style.scrollSnapType = 'x proximity';
          container.style.scrollSnapStop = 'auto';
          break;

        case 'desktop':
          container.style.scrollSnapType = 'x proximity';
          container.style.scrollSnapStop = 'auto';
          break;
      }
    });
  }

  /**
   * Get current device type
   */
  getDeviceType() {
    return this.deviceType;
  }

  /**
   * Enable/disable momentum scrolling (iOS)
   */
  setMomentumScrolling(enabled) {
    const elements = document.querySelectorAll('.testimonialtrack, .table-container, .packages');
    elements.forEach((el) => {
      el.style.webkitOverflowScrolling = enabled ? 'touch' : 'auto';
    });
  }

  /**
   * Get scroll performance metrics
   */
  getScrollMetrics() {
    return {
      deviceType: this.deviceType,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scrollPosition: window.scrollY,
      scrollBehavior: document.documentElement.style.scrollBehavior
    };
  }
}

// Initialize ScrollBehaviorManager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollBehaviorManager = new ScrollBehaviorManager();
  });
} else {
  window.scrollBehaviorManager = new ScrollBehaviorManager();
}

// Expose to global scope for debugging
window.getScrollMetrics = () => window.scrollBehaviorManager?.getScrollMetrics();
