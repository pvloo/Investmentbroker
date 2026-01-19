/* <!-- downsection Start--> */
// Example dynamic feature — add hover animations to social icons
document.querySelectorAll('.socials i').forEach(icon => {
  icon.addEventListener('mouseenter', () => icon.style.transform = 'scale(1.2)');
  icon.addEventListener('mouseleave', () => icon.style.transform = 'scale(1)');
});
/* <!-- downsection End--> */

// ============= INVESTMENT BUTTON HANDLER =============
// Handle "Invest Now" buttons on index.html
function handleInvestmentButtonClick(e) {
  const planId = e.target.dataset.plan;
  const planName = e.target.dataset.name;
  const minAmount = e.target.dataset.min;
  const maxAmount = e.target.dataset.max;

  // Check if user is logged in
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    // Not logged in — redirect to registration
    window.location.href = 'auth.html#register';
    return;
  }

  // User is logged in — store investment info and redirect to dashboard
  const investmentInfo = {
    planId,
    planName,
    minAmount: parseInt(minAmount),
    maxAmount: parseInt(maxAmount),
    selectedTime: new Date().toISOString()
  };
  sessionStorage.setItem('selectedInvestmentPlan', JSON.stringify(investmentInfo));
  window.location.href = 'dashboard.html#investment-modal';
}

// Attach listeners to all invest buttons when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.invest-btn').forEach(btn => {
    btn.addEventListener('click', handleInvestmentButtonClick);
  });
});




// Global Market Overview - optimized with market-performance.js
// Use window.coinsData which is set by market-performance.js
// Initialize only if not already set by market-performance.js
if (!window.coinsData) {
    window.coinsData = [];
}

// Initialize table search and filtering after coins data is loaded
function initializeTableFilters() {
    // Search Filter
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = window.coinsData.filter(c => 
                c.name.toLowerCase().includes(term) || 
                c.symbol.toLowerCase().includes(term)
            );
            renderTableRows(filtered);
        });
    }

    // Sorting
    document.querySelectorAll("th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const key = th.getAttribute("data-sort");
            window.coinsData.sort((a, b) => {
                if (typeof a[key] === "string") {
                    return a[key].localeCompare(b[key]);
                }
                return b[key] - a[key];
            });
            renderTableRows(window.coinsData);
        });
    });

    // Filter Tabs
    document.querySelectorAll(".tabs button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;

            let filtered = [...window.coinsData];
            
            // "Recent" shows all coins (default/unfiltered)
            if (filter === "recent") {
                filtered = [...window.coinsData];
            }
            // "Gainers" shows coins with positive 24h change, sorted by best performers
            else if (filter === "gainers") {
                filtered = window.coinsData
                    .filter(c => c.change > 0)
                    .sort((a, b) => b.change - a.change);
            }
            // "ROI" shows all coins sorted by highest ROI
            else if (filter === "roi") {
                filtered = [...window.coinsData].sort((a, b) => {
                    const roiA = parseFloat(a.roi);
                    const roiB = parseFloat(b.roi);
                    return roiB - roiA;
                });
            }

            renderTableRows(filtered);
        });
    });
}

// Optimized table rendering with pre-formatted data
function renderTableRows(data) {
    const tbody = document.querySelector("#projects tbody");
    if (!tbody) return;

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    data.slice(0, 50).forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${c.image}" alt="${c.name}" loading="lazy" style="width:24px;height:24px;margin-right:8px;border-radius:50%;vertical-align:middle;" /> ${c.name}</td>
            <td>${c.rank}</td>
            <td>$${c.price.toLocaleString()}</td>
            <td class="${c.change >= 0 ? "positive" : "negative"}">${c.change.toFixed(2)}%</td>
            <td>${c.roi}</td>
            <td>$${(c.marketcap / 1e9).toFixed(2)}B</td>
        `;
        fragment.appendChild(tr);
    });

    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

// Initialize filters when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeTableFilters();
    });
} else {
    initializeTableFilters();
}

// Handle "Invest Now" buttons
document.querySelectorAll(".star").forEach(btn => {
    btn.addEventListener("click", () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'auth.html#register';
        }
    });
});

// ============= BITCOIN CALCULATOR =============
// Real-time Bitcoin to Currency converter using live prices
(function initBitcoinCalculator() {
    const btcInput = document.getElementById('btc-value');
    const currencyInput = document.getElementById('currency-value');
    const currencySelect = document.getElementById('currency-select');
    
    if (!btcInput || !currencyInput || !currencySelect) return;

    // Store Bitcoin prices in memory
    let bitcoinPrices = {};
    let lastFetchTime = 0;
    const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes
    const CACHE_KEY = 'btc_prices_cache';

    // Fetch Bitcoin prices with CORS proxy fallback
    async function fetchBitcoinPrices() {
        const now = Date.now();
        
        // Check memory cache first
        if (bitcoinPrices && Object.keys(bitcoinPrices).length > 0 && now - lastFetchTime < CACHE_DURATION) {
            return bitcoinPrices;
        }

        // Check localStorage cache
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                if (parsed.timestamp && now - parsed.timestamp < CACHE_DURATION) {
                    bitcoinPrices = parsed.data;
                    lastFetchTime = parsed.timestamp;
                    return bitcoinPrices;
                }
            } catch (e) {
                console.debug('Cache parse error:', e);
            }
        }

        try {
            const currencies = ['usd', 'eur', 'gbp', 'cad', 'jpy'];
            const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencies.join(',')}`;
            
            // Try direct fetch first
            let response = await Promise.race([
                fetch(apiUrl),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);
            
            if (!response.ok) throw new Error('Direct fetch failed');
            
            const data = await response.json();
            bitcoinPrices = data.bitcoin || {};
            lastFetchTime = now;
            
            // Cache to localStorage
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: bitcoinPrices,
                timestamp: now
            }));
            
            return bitcoinPrices;
        } catch (error) {
            console.debug('Bitcoin calculator fetch error:', error.message);
            
            // Try CORS proxy as fallback
            try {
                const corsProxy = 'https://api.allorigins.win/raw?url=';
                const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,gbp,cad,jpy`;
                const proxyUrl = corsProxy + encodeURIComponent(apiUrl);
                
                const response = await Promise.race([
                    fetch(proxyUrl),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);
                
                if (response.ok) {
                    const data = await response.json();
                    bitcoinPrices = data.bitcoin || {};
                    lastFetchTime = now;
                    
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: bitcoinPrices,
                        timestamp: now
                    }));
                    
                    return bitcoinPrices;
                }
            } catch (proxyError) {
                console.debug('CORS proxy fallback also failed');
            }
            
            // Final fallback: use localStorage if available
            const fallbackData = localStorage.getItem(CACHE_KEY);
            if (fallbackData) {
                try {
                    const parsed = JSON.parse(fallbackData);
                    bitcoinPrices = parsed.data;
                    return bitcoinPrices;
                } catch (e) {
                    console.debug('Fallback cache parse error');
                }
            }
            
            // Last resort: hardcoded fallback prices
            return {
                usd: 42000,
                eur: 38500,
                gbp: 33000,
                cad: 57000,
                jpy: 6200000
            };
        }
    }

    // Convert BTC to selected currency
    async function convertBTC() {
        const btcAmount = parseFloat(btcInput.value) || 0;
        const selectedCurrency = currencySelect.value.toLowerCase();

        const prices = await fetchBitcoinPrices();
        const price = prices[selectedCurrency] || 0;
        const convertedAmount = (btcAmount * price).toFixed(2);

        currencyInput.value = convertedAmount;
    }

    // Add event listeners
    btcInput.addEventListener('input', convertBTC);
    currencySelect.addEventListener('change', convertBTC);

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', async () => {
        await fetchBitcoinPrices();
        convertBTC();
    });

    // Also run if DOM is already loaded
    if (document.readyState !== 'loading') {
        fetchBitcoinPrices();
        convertBTC();
    }
})();
