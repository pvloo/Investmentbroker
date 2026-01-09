// // Language logic is handled by `language.js` which exposes `window.initLanguageSelector()`
// if (window.initLanguageSelector && typeof window.initLanguageSelector === 'function') {
//   try { window.initLanguageSelector(); } catch (e) { console.warn('initLanguageSelector failed', e); }
// }

// Currency selector (defensive)
const currencySel = document.getElementById('currency') || document.getElementById('currency-select');
if (currencySel) {
  currencySel.addEventListener('change', e => {
    localStorage.setItem('currency', e.target.value);
    location.reload();
  });
}

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('theme', mode);
}


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
let coinsData = [];

// Initialize table search and filtering after coins data is loaded
function initializeTableFilters() {
    // Search Filter
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = coinsData.filter(c => 
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
            coinsData.sort((a, b) => {
                if (typeof a[key] === "string") {
                    return a[key].localeCompare(b[key]);
                }
                return b[key] - a[key];
            });
            renderTableRows(coinsData);
        });
    });

    // Filter Tabs
    document.querySelectorAll(".tabs button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;

            let filtered = [...coinsData];
            if (filter === "gainers") filtered = coinsData.filter(c => c.change > 5);
            if (filter === "roi") filtered = coinsData.filter(c => parseFloat(c.roi) > 1.5);

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
