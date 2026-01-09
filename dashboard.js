// User Dashboard Functions

// Check authentication
function checkAuth() {
    try {
        // Demo/Testing mode - allow access without auth
        const demoMode = localStorage.getItem('DEMO_MODE') === 'true';
        if (demoMode) {
            // Set demo user data if not exists
            if (!localStorage.getItem('userData')) {
                localStorage.setItem('userData', JSON.stringify({
                    firstName: 'Demo',
                    email: 'demo@example.com',
                    referralCode: 'DEMO_' + Math.random().toString(36).slice(2, 8).toUpperCase()
                }));
            }
            const ud = JSON.parse(localStorage.getItem('userData') || '{}');
            const name = (ud && (ud.firstName || ud.email)) ? (ud.firstName || ud.email) : 'Demo User';
            const disp = document.getElementById('userDisplay'); 
            if (disp) disp.textContent = name;
            return true;
        }
        
        const authRaw = localStorage.getItem('authToken');
        if (!authRaw) { 
            // Enable demo mode by default for localhost testing
            localStorage.setItem('DEMO_MODE', 'true');
            return checkAuth(); // Retry with demo mode enabled
        }
        const parsed = JSON.parse(authRaw || '{}');
        const token = parsed.token;
        if (!token || !window.AuthService || !window.AuthService.verifyToken(token)) { window.location.href = 'auth.html'; return false; }
        // set display name
        const ud = JSON.parse(localStorage.getItem('userData') || '{}');
        const name = (ud && (ud.firstName || ud.email)) ? (ud.firstName || ud.email) : (localStorage.getItem('currentUser') || 'user');
        const disp = document.getElementById('userDisplay'); if (disp) disp.textContent = name;
        return true;
    } catch (e) { 
        // If auth check fails, enable demo mode for testing
        localStorage.setItem('DEMO_MODE', 'true');
        return checkAuth();
    }
}

// Initialize Mobile Dashboard
function initMobileDashboard() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const firstName = userData.firstName || 'User';
    
    // Update greeting
    const greetingEl = document.getElementById('mobileUserGreeting');
    if (greetingEl) {
        greetingEl.textContent = `Hello ${firstName}!`;
    }

    // Update balance information (from userState)
    updateMobileBalance();

    // Add event listeners for mobile features
    setupMobileEventListeners();
}

// Update mobile balance display
function updateMobileBalance() {
    const availableBalanceEl = document.getElementById('mobileAvailableBalance');
    const lockedBalanceEl = document.getElementById('mobileLockedBalance');
    const totalProfitEl = document.getElementById('mobileTotalProfit');
    const bonusEl = document.getElementById('mobileBonus');
    const referralBonusEl = document.getElementById('mobileReferralBonus');
    const withdrawalsEl = document.getElementById('mobileWithdrawals');

    // Calculate locked balance from active investments
    const lockedBalance = userState.activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    // Calculate total profit from profit history
    const totalProfit = userState.profitHistory.reduce((sum, p) => sum + p.amount, 0);
    
    // Calculate referral bonus from referrals
    const referralBonus = userState.referrals.reduce((sum, r) => sum + (r.bonus || 0), 0);
    
    // Calculate total withdrawals from transactions
    const totalWithdrawals = userState.transactions
        .filter(tx => tx.type === 'withdraw')
        .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate bonus (can be from deposits or other sources)
    const bonus = 0; // Default or fetch from userData

    if (availableBalanceEl) availableBalanceEl.textContent = '$' + (userState.balance || 0).toFixed(2);
    if (lockedBalanceEl) lockedBalanceEl.textContent = '$' + lockedBalance.toFixed(2);
    if (totalProfitEl) totalProfitEl.textContent = '$' + totalProfit.toFixed(2);
    if (bonusEl) bonusEl.textContent = '$' + bonus.toFixed(2);
    if (referralBonusEl) referralBonusEl.textContent = '$' + referralBonus.toFixed(2);
    if (withdrawalsEl) withdrawalsEl.textContent = '$' + totalWithdrawals.toFixed(2);
}

// Setup mobile event listeners
function setupMobileEventListeners() {
    // Welcome close button
    const welcomeClose = document.querySelector('.welcome-close');
    if (welcomeClose) {
        welcomeClose.addEventListener('click', () => {
            const banner = document.querySelector('.welcome-banner');
            if (banner) banner.style.display = 'none';
        });
    }

    // Balance visibility toggle
    const balanceToggle = document.getElementById('balanceToggle');
    if (balanceToggle) {
        let balanceVisible = true;
        balanceToggle.addEventListener('click', () => {
            balanceVisible = !balanceVisible;
            const balances = document.querySelectorAll('.balance-amount, .stat-value');
            balances.forEach(el => {
                el.textContent = balanceVisible ? el.textContent : '••••••';
            });
            balanceToggle.querySelector('i').className = balanceVisible 
                ? 'fa-solid fa-eye' 
                : 'fa-solid fa-eye-slash';
        });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                const isOpen = sidebar.classList.toggle('mobile-menu-open');
                document.body.classList.toggle('mobile-menu-active', isOpen);
                
                // Close menu when clicking outside
                if (isOpen) {
                    document.addEventListener('click', closeMobileMenuOnOutsideClick);
                }
            }
        });
    }

    // Close mobile menu on outside click
    function closeMobileMenuOnOutsideClick(e) {
        const sidebar = document.querySelector('.sidebar');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (sidebar && !sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('mobile-menu-open');
            document.body.classList.remove('mobile-menu-active');
            document.removeEventListener('click', closeMobileMenuOnOutsideClick);
        }
    }

    // Close mobile menu when clicking on a nav item
    const sidebarNavItems = document.querySelectorAll('.sidebar .nav a');
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('mobile-menu-open');
                document.body.classList.remove('mobile-menu-active');
            }
        });
    });


    // Bottom navigation items
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    navItems.forEach(item => {
        if (!item.classList.contains('menu-toggle')) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                const nav = item.getAttribute('data-nav');
                handleMobileNavigation(nav);
            });
        }
    });
}

// Handle mobile navigation
function handleMobileNavigation(nav) {
    switch (nav) {
        case 'history':
            // Show transactions section and scroll to it
            const historySection = document.getElementById('transactionsSection');
            if (historySection) {
                historySection.style.display = 'block';
                historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Highlight the section temporarily
                historySection.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                setTimeout(() => {
                    historySection.style.backgroundColor = 'transparent';
                }, 2000);
            } else {
                alert('Transactions section not found');
            }
            break;
        case 'deposit':
            // Open deposit modal
            const depositModal = document.getElementById('depositModal');
            if (depositModal) {
                depositModal.style.display = 'flex';
                depositModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal open
            } else {
                alert('Please contact support for deposit assistance');
            }
            break;
        case 'home':
            // Reload dashboard to home view
            window.location.href = 'dashboard.html';
            break;
        case 'withdraw':
            // Open withdraw modal
            const withdrawModal = document.getElementById('withdrawModal');
            if (withdrawModal) {
                withdrawModal.style.display = 'flex';
                withdrawModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal open
            } else {
                alert('Please contact support for withdrawal assistance');
            }
            break;
    }
}

// Global state management
const userState = {
    balance: parseFloat(localStorage.getItem('userBalance') || '0'),
    activeInvestments: JSON.parse(localStorage.getItem('activeInvestments') || '[]'),
    profitHistory: JSON.parse(localStorage.getItem('profitHistory') || '[]'),
    transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
    swaps: JSON.parse(localStorage.getItem('swaps') || '[]'),
    managedAccounts: JSON.parse(localStorage.getItem('managedAccounts') || '[]'),
    referrals: JSON.parse(localStorage.getItem('referrals') || '[]'),
    userData: JSON.parse(localStorage.getItem('userData') || '{}')
};

// Initialize managed accounts if not exists
if (userState.managedAccounts.length === 0) {
    userState.managedAccounts = [
        { id: 'acc1', name: 'Premium Growth Account', manager: 'John Smith', balance: 50000, roi: 12.5, status: 'active' },
        { id: 'acc2', name: 'Conservative Fund', manager: 'Sarah Lee', balance: 30000, roi: 6.2, status: 'active' }
    ];
    localStorage.setItem('managedAccounts', JSON.stringify(userState.managedAccounts));
}

// Initialize referral code if not exists
if (!userState.userData.referralCode) {
    userState.userData.referralCode = 'REF_' + Math.random().toString(36).slice(2, 8).toUpperCase();
    localStorage.setItem('userData', JSON.stringify(userState.userData));
}

// Helper function to save userState to localStorage
function saveUserState() {
    localStorage.setItem('userBalance', userState.balance.toString());
    localStorage.setItem('activeInvestments', JSON.stringify(userState.activeInvestments));
    localStorage.setItem('profitHistory', JSON.stringify(userState.profitHistory));
    localStorage.setItem('transactions', JSON.stringify(userState.transactions));
    localStorage.setItem('swaps', JSON.stringify(userState.swaps));
    localStorage.setItem('managedAccounts', JSON.stringify(userState.managedAccounts));
    localStorage.setItem('referrals', JSON.stringify(userState.referrals));
    localStorage.setItem('userData', JSON.stringify(userState.userData));
}

// Initialize demo data if first visit
function initializeDemoData() {
    if (localStorage.getItem('userBalance') === '0' || localStorage.getItem('userBalance') === null) {
        // Set initial balance
        userState.balance = 5000;
        
        // Add sample transactions
        userState.transactions = [
            { type: 'deposit', amount: 1000, currency: 'BTC', timestamp: new Date(Date.now() - 7*24*60*60*1000).toISOString(), status: 'completed' },
            { type: 'deposit', amount: 2000, currency: 'ETH', timestamp: new Date(Date.now() - 5*24*60*60*1000).toISOString(), status: 'completed' },
            { type: 'withdraw', amount: 500, currency: 'USDT', timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), status: 'completed' }
        ];
        
        // Add sample profit history
        userState.profitHistory = [
            { amount: 150.50, source: 'Starter Plan', timestamp: new Date(Date.now() - 4*24*60*60*1000).toISOString(), status: 'completed' },
            { amount: 75.25, source: 'Referral Bonus', timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString(), status: 'completed' }
        ];
        
        // Add sample investment
        userState.activeInvestments = [
            { 
                id: 'inv-demo-1', 
                planId: 'starter', 
                amount: 5000, 
                startDate: new Date(Date.now() - 10*24*60*60*1000).toISOString(), 
                endDate: new Date(Date.now() + 35*24*60*60*1000).toISOString(), 
                expectedRoi: 300, 
                status: 'active' 
            }
        ];
        
        saveUserState();
        // Don't reload - just update the UI
        updateMobileBalance();
    }
}


function handleDeposit(amount, currency) {
    if (amount <= 0) return { success: false, message: 'Invalid amount' };

    const transaction = {
        type: 'deposit',
        amount: amount,
        currency: currency,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    userState.transactions.push(transaction);
    saveUserState();
    return { success: true, message: 'Deposit initiated', transaction };
}

// Withdraw functionality
function handleWithdraw(amount, currency, address) {
    if (amount <= 0 || amount > userState.balance) {
        return { success: false, message: 'Invalid amount or insufficient balance' };
    }

    const transaction = {
        type: 'withdraw',
        amount: amount,
        currency: currency,
        address: address,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    userState.transactions.push(transaction);
    saveUserState();
    return { success: true, message: 'Withdrawal initiated', transaction };
}

// Investment Plans (consolidated Basic + Starter into a single Starter plan)
const investmentPlans = [
    { id: 'starter', name: 'Starter Plan', minAmount: 5000, maxAmount: 9000, duration: 45, roi: 6 },
    { id: 'deluxe', name: 'Deluxe Plan', minAmount: 10000, maxAmount: 29000, duration: 60, roi: 8 },
    { id: 'premium', name: 'Premium Plan', minAmount: 30000, maxAmount: 49000, duration: 90, roi: 12 },
    { id: 'vip', name: 'VIP Plan', minAmount: 100000, maxAmount: 150000, duration: 120, roi: 18 },
    { id: 'gold', name: 'Gold Plan', minAmount: 200000, maxAmount: 300000, duration: 150, roi: 22 },
    { id: 'vip_platinum', name: 'VIP Platinum', minAmount: 500000, maxAmount: 1000000, duration: 180, roi: 30 }
];

function startInvestment(planId, amount) {
    const plan = investmentPlans.find(p => p.id === planId);
    if (!plan) return { success: false, message: 'Invalid investment plan' };
    if (amount < plan.minAmount || amount > plan.maxAmount) {
        return { success: false, message: 'Amount out of range for selected plan' };
    }

    const investment = {
        id: `inv-${Date.now()}`,
        planId: planId,
        amount: amount,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
        expectedRoi: amount * (plan.roi / 100),
        status: 'active'
    };

    userState.activeInvestments.push(investment);
    saveUserState();
    return { success: true, message: 'Investment started', investment };
}

// Profit History
function getProfitHistory() {
    return userState.profitHistory;
}

// Copy Expert Trading
function startCopyTrading(expertId, amount) {
    const copyTrade = {
        id: `copy-${Date.now()}`,
        expertId: expertId,
        amount: amount,
        startDate: new Date().toISOString(),
        status: 'active'
    };

    userState.activeInvestments.push(copyTrade);
    saveUserState();
    return { success: true, message: 'Copy trading initiated', copyTrade };
}

// Transaction History
function getTransactionHistory() {
    return userState.transactions;
}

// Get Active Investments
function getActiveInvestments() {
    return userState.activeInvestments;
}

// Logout function
function logout() {
    // Use AuthService logout if available, else fallback
    try { if (window.AuthService && typeof window.AuthService.logout === 'function') window.AuthService.logout(); } catch (e) { }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    // keep userData for offline UX (optional) — remove if you prefer full wipe
    window.location.href = 'auth.html';
}

// Event Listeners for UI Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language system
    if (window.languageSwitcher) {
        const currentLang = localStorage.getItem('site_language') || 'en';
        window.languageSwitcher.setLanguage(currentLang);
    }
    
    // Check authentication first
    if (!checkAuth()) return;

    // Initialize demo data on first visit (optional - comment out if not needed)
    initializeDemoData();

    // Initialize mobile dashboard if on mobile
    initMobileDashboard();

    // Initialize tile click handlers
    setupTileClickHandlers();

    // Check if user came from investment button on index page
    const selectedPlan = sessionStorage.getItem('selectedInvestmentPlan');
    if (selectedPlan) {
        try {
            const plan = JSON.parse(selectedPlan);
            // Auto-open investment modal with pre-selected plan
            setTimeout(() => {
                const planObj = investmentPlans.find(p => p.id === plan.planId);
                if (planObj) {
                    openInvestModal(plan.planId);
                }
            }, 300);
            sessionStorage.removeItem('selectedInvestmentPlan');
        } catch (e) { console.error('Failed to parse investment plan', e); }
    }

    // Attach click handlers to navigation items
    const nav = document.querySelector('.nav');
    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Check if this is the home button - allow default navigation
        const label = link.querySelector('.label');
        if (label && label.textContent === 'Home') {
            return; // Allow default link behavior for home button
        }

        e.preventDefault();
        const section = label ? label.textContent : '';

        // Remove active class from all links
        nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');

        // Update main content based on section
        updateMainContent(section);
    });

    // Modal closing functionality
    setupModalHandlers();
});

// Setup modal open/close handlers
function setupModalHandlers() {
    // Close buttons for modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Backdrop click to close
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Deposit Modal
    const depositConfirm = document.getElementById('depositConfirm');
    if (depositConfirm) {
        depositConfirm.addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('depositAmount').value);
            if (!amount || amount < 100) {
                alert('Please enter an amount of at least $100');
                return;
            }
            const method = document.getElementById('depositMethod').value;
            if (!method) {
                alert('Please select a payment method');
                return;
            }
            
            // Call the actual deposit handler
            const result = handleDeposit(amount, method);
            if (result.success) {
                alert(result.message + '\nYou will receive further instructions.');
                updateMobileBalance(); // Update display
                const modal = document.getElementById('depositModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = 'auto';
                }
            } else {
                alert('Error: ' + result.message);
            }
        });
    }

    // Withdraw Modal
    const withdrawConfirm = document.getElementById('withdrawConfirm');
    if (withdrawConfirm) {
        withdrawConfirm.addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('withdrawAmount').value);
            const method = document.getElementById('withdrawMethod').value;
            const address = document.getElementById('withdrawAddress').value;
            
            if (!amount || amount < 50) {
                alert('Please enter an amount of at least $50');
                return;
            }
            if (!method) {
                alert('Please select a withdrawal method');
                return;
            }
            if (!address) {
                alert('Please enter your wallet or account address');
                return;
            }
            
            // Call the actual withdraw handler
            const result = handleWithdraw(amount, method, address);
            if (result.success) {
                alert(result.message + '\nYou will receive a confirmation email.');
                updateMobileBalance(); // Update display
                const modal = document.getElementById('withdrawModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = 'auto';
                }
            } else {
                alert('Error: ' + result.message);
            }
        });
    }

    // Show wallet address when crypto selected
    const depositMethod = document.getElementById('depositMethod');
    if (depositMethod) {
        depositMethod.addEventListener('change', (e) => {
            const walletDiv = document.getElementById('depositWallet');
            if (walletDiv) {
                walletDiv.style.display = e.target.value === 'crypto' ? 'block' : 'none';
            }
        });
    }
}

// Function to update main content based on selected section
function updateMainContent(section) {
    const main = document.querySelector('main');
    let content = '';

    switch (section) {
        case 'Deposit':
            content = `
                <h2>Deposit Funds</h2>
                <div class="form-container">
                    <form id="depositForm" class="dashboard-form">
                        <div class="form-group">
                            <label for="depositAmount">Amount</label>
                            <input type="number" id="depositAmount" min="0" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="depositCurrency">Select Cryptocurrency</label>
                            <select id="depositCurrency" required>
                                <option value="">-- Choose Currency --</option>
                                <option value="BTC">Bitcoin (BTC)</option>
                                <option value="ETH">Ethereum (ETH)</option>
                                <option value="USDT">Tether (USDT)</option>
                                <option value="BNB">Binance Coin (BNB)</option>
                                <option value="XRP">Ripple (XRP)</option>
                                <option value="SOL">Solana (SOL)</option>
                                <option value="DOGE">Dogecoin (DOGE)</option>
                                <option value="ADA">Cardano (ADA)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="depositNetwork">Select Network</label>
                            <select id="depositNetwork" required>
                                <option value="">-- Choose Network --</option>
                                <option value="mainnet">Mainnet</option>
                                <option value="bep20">BEP20 (Binance Smart Chain)</option>
                                <option value="erc20">ERC20 (Ethereum)</option>
                                <option value="trc20">TRC20 (Tron)</option>
                                <option value="solana">Solana Network</option>
                                <option value="polygon">Polygon (MATIC)</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-primary">Deposit</button>
                    </form>
                </div>
            `;
            break;

        case 'Withdraw':
            content = `
                <h2>Withdraw Funds</h2>
                <div class="form-container">
                    <form id="withdrawForm" class="dashboard-form">
                        <div class="form-group">
                            <label for="withdrawAmount">Amount</label>
                            <input type="number" id="withdrawAmount" min="0" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="withdrawCurrency">Select Cryptocurrency</label>
                            <select id="withdrawCurrency" required>
                                <option value="">-- Choose Currency --</option>
                                <option value="BTC">Bitcoin (BTC)</option>
                                <option value="ETH">Ethereum (ETH)</option>
                                <option value="USDT">Tether (USDT)</option>
                                <option value="BNB">Binance Coin (BNB)</option>
                                <option value="XRP">Ripple (XRP)</option>
                                <option value="SOL">Solana (SOL)</option>
                                <option value="DOGE">Dogecoin (DOGE)</option>
                                <option value="ADA">Cardano (ADA)</option>
                                <option value="LINK">Chainlink (LINK)</option>
                                <option value="LTC">Litecoin (LTC)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="withdrawMethod">Withdrawal Method</label>
                            <select id="withdrawMethod" required>
                                <option value="">-- Choose Method --</option>
                                <option value="wallet">Blockchain Wallet Address</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="paypal">PayPal</option>
                                <option value="stripe">Credit/Debit Card (Stripe)</option>
                                <option value="sepa">SEPA Transfer</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="withdrawAddress">Wallet Address / Account Details</label>
                            <input type="text" id="withdrawAddress" placeholder="Enter wallet address or account number" required>
                        </div>
                        <div class="form-group">
                            <label for="withdrawNetwork">Network (if applicable)</label>
                            <select id="withdrawNetwork">
                                <option value="">-- Select Network --</option>
                                <option value="mainnet">Mainnet</option>
                                <option value="bep20">BEP20</option>
                                <option value="erc20">ERC20</option>
                                <option value="trc20">TRC20</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-primary">Withdraw</button>
                    </form>
                </div>
            `;
            break;

        case 'Investment Plans':
            content = `
                <h2>Investment Plans</h2>
                <div class="plans-grid">
                    ${investmentPlans.map((plan, idx) => `
                        <div class="plan-card" data-index="${idx}">
                            <h3>${plan.name}</h3>
                            <div class="plan-details">
                                <p>Min: $${plan.minAmount.toLocaleString()}</p>
                                <p>Max: $${plan.maxAmount.toLocaleString()}</p>
                                <p>Duration: ${plan.duration} days</p>
                                <p>ROI: ${plan.roi}%</p>
                            </div>
                            <button class="btn-invest" data-plan="${plan.id}">Invest Now</button>
                        </div>
                    `).join('')}
                </div>
            `;
            break;

        case 'Profit History':
            const profits = getProfitHistory();
            content = `
                <h2>Profit History</h2>
                <div class="table-container">
                    <table class="dashboard-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Source</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${profits.length ? profits.map(profit => `
                                <tr>
                                    <td>${new Date(profit.timestamp).toLocaleDateString()}</td>
                                    <td>$${profit.amount.toFixed(2)}</td>
                                    <td>${profit.source}</td>
                                    <td>${profit.status}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="4">No profit history available</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
            break;

        case 'Copy Expert':
            content = `
                <h2>Copy Expert Trading</h2>
                <div class="experts-grid">
                    <div class="expert-card">
                        <img src="images/expert1.jpg" alt="Expert 1" class="expert-avatar">
                        <h3>John Doe</h3>
                        <p>Success Rate: 89%</p>
                        <p>Total Profit: $158,932</p>
                        <button class="btn-copy" data-expert="exp1">Copy Now</button>
                    </div>
                    <div class="expert-card">
                        <img src="images/expert2.jpg" alt="Expert 2" class="expert-avatar">
                        <h3>Jane Smith</h3>
                        <p>Success Rate: 92%</p>
                        <p>Total Profit: $243,567</p>
                        <button class="btn-copy" data-expert="exp2">Copy Now</button>
                    </div>
                </div>
            `;
            break;

        case 'Transactions':
            const transactions = getTransactionHistory();
            content = `
                <h2>Transaction History</h2>
                <div class="table-container">
                    <table class="dashboard-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${transactions.length ? transactions.map(tx => `
                                <tr>
                                    <td>${new Date(tx.timestamp).toLocaleDateString()}</td>
                                    <td>${tx.type}</td>
                                    <td>${tx.amount}</td>
                                    <td>${tx.currency}</td>
                                    <td>${tx.status}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="5">No transactions available</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
            break;

        case 'My Investments':
            const investments = getActiveInvestments();
            content = `
                <h2>My Investments</h2>
                <div class="investments-grid">
                    ${investments.length ? investments.map(inv => `
                        <div class="investment-card">
                            <h3>${inv.planId}</h3>
                            <div class="investment-details">
                                <p>Amount: $${inv.amount}</p>
                                <p>Start Date: ${new Date(inv.startDate).toLocaleDateString()}</p>
                                <p>End Date: ${new Date(inv.endDate).toLocaleDateString()}</p>
                                <p>Expected ROI: $${inv.expectedRoi}</p>
                                <p class="status ${inv.status}">${inv.status}</p>
                            </div>
                        </div>
                    `).join('') : '<p class="no-data">No active investments</p>'}
                </div>
            `;
            break;

        case 'Contact Support':
            content = renderContactSupportView();
            break;

        default:
            // Home view - keep existing content
            return;
    }

    main.innerHTML = content;
    attachEventHandlers(section);
}

// Attach event handlers for the different sections
function attachEventHandlers(section) {
    switch (section) {
        case 'Deposit':
            const depositForm = document.getElementById('depositForm');
            if (depositForm) {
                depositForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const amount = parseFloat(document.getElementById('depositAmount').value);
                    const currency = document.getElementById('depositCurrency').value;
                    const result = handleDeposit(amount, currency);
                    alert(result.message);
                });
            }
            break;

        case 'Withdraw':
            const withdrawForm = document.getElementById('withdrawForm');
            if (withdrawForm) {
                withdrawForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const amount = parseFloat(document.getElementById('withdrawAmount').value);
                    const currency = document.getElementById('withdrawCurrency').value;
                    const address = document.getElementById('withdrawAddress').value;
                    const result = handleWithdraw(amount, currency, address);
                    alert(result.message);
                });
            }
            break;

        case 'Investment Plans':
            const investButtons = document.querySelectorAll('.btn-invest');
            investButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const planId = e.target.dataset.plan;
                    // open modal flow for investing
                    openInvestModal(planId);
                });
            });
            break;

        case 'Copy Expert':
            const copyButtons = document.querySelectorAll('.btn-copy');
            copyButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const expertId = e.target.dataset.expert;
                    const amount = prompt('Enter amount to copy trade:');
                    if (amount) {
                        const result = startCopyTrading(expertId, parseFloat(amount));
                        alert(result.message);
                    }
                });
            });
            break;

        case 'Contact Support':
            const supportForm = document.getElementById('contactSupportForm');
            if (supportForm) {
                supportForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const subject = document.getElementById('supportSubject').value;
                    const message = document.getElementById('supportMessage').value;
                    const attachment = document.getElementById('supportAttachment').files[0];

                    const ticket = {
                        id: `TKT-${Date.now()}`,
                        subject: subject,
                        message: message,
                        attachment: attachment ? attachment.name : null,
                        status: 'open',
                        createdAt: new Date().toISOString(),
                        userId: localStorage.getItem('currentUser') || 'unknown'
                    };

                    let tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
                    tickets.push(ticket);
                    localStorage.setItem('supportTickets', JSON.stringify(tickets));

                    alert(`Support ticket submitted successfully!\nTicket ID: ${ticket.id}`);
                    supportForm.reset();
                });
            }
            break;
    }
}


//   <!-- TradingView library (loaded dynamically by script below) -->
// ---------------- Invest modal (opens when user clicks Invest Now) ----------------
const investModalEl = document.getElementById('investModal');
const investBackdrop = document.getElementById('investModalBackdrop');
const investTitle = document.getElementById('investModalTitle');
const investDetails = document.getElementById('investPlanDetails');
const investAmountInput = document.getElementById('investAmount');
const investConfirmBtn = document.getElementById('investConfirm');
const investCancelBtn = document.getElementById('investCancel');

function openInvestModal(planId) {
    const plan = investmentPlans.find(p => p.id === planId);
    if (!plan) return alert('Plan not found');
    // populate modal
    investTitle.textContent = `Invest in ${plan.name}`;
    investDetails.textContent = `${plan.name} — Min: $${plan.minAmount.toLocaleString()} • Max: $${plan.maxAmount.toLocaleString()} • Duration: ${plan.duration} days • ROI: ${plan.roi}%`;
    investAmountInput.value = plan.minAmount;
    investConfirmBtn.dataset.plan = planId;
    investModalEl.style.display = 'flex';
    investModalEl.setAttribute('aria-hidden', 'false');
    setTimeout(() => investAmountInput.focus(), 50);
}

function closeInvestModal() {
    investModalEl.style.display = 'none';
    investModalEl.setAttribute('aria-hidden', 'true');
    investConfirmBtn.removeAttribute('data-plan');
    investAmountInput.value = '';
}

// modal controls
if (investConfirmBtn) {
    investConfirmBtn.addEventListener('click', async () => {
        const planId = investConfirmBtn.dataset.plan;
        const amount = parseFloat(investAmountInput.value);
        if (isNaN(amount) || amount <= 0) return alert('Please enter a valid amount');

        // Check local balance first
        if (userState.balance < amount) {
            alert('Insufficient funds. Please deposit first.');
            closeInvestModal();
            return;
        }

        // Try to create investment on backend, but fallback to local if offline
        const authRaw = localStorage.getItem('authToken');
        let token = null;
        try {
            token = authRaw ? JSON.parse(authRaw).token : null;
        } catch (err) {
            token = null;
        }

        // Check if we have a token and can connect to backend
        let apiSuccess = false;
        if (token) {
            try {
                const payload = {
                    investmentType: planId,
                    symbol: planId,
                    amount,
                    currentValue: amount,
                    notes: `Plan ${planId}`
                };
                const ires = await fetch('/api/investments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(payload)
                });

                if (ires.ok) {
                    const idata = await ires.json();
                    apiSuccess = true;
                    alert(idata.message || 'Investment created successfully');
                }
            } catch (e) {
                console.log('API call failed, using local fallback:', e.message);
            }
        }

        // If API didn't work, process locally
        if (!apiSuccess) {
            const result = startInvestment(planId, amount);
            if (result.success) {
                alert(result.message);
                updateMobileBalance();
            } else {
                alert(result.message);
                return;
            }
        }

        closeInvestModal();
    });
}
if (investCancelBtn) investCancelBtn.addEventListener('click', closeInvestModal);
if (investBackdrop) investBackdrop.addEventListener('click', closeInvestModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && investModalEl && investModalEl.getAttribute('aria-hidden') === 'false') closeInvestModal(); });
// ---------------- Theme toggle ----------------
const themeToggles = document.querySelectorAll('[id*="themeToggle"]');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');
const saved = localStorage.getItem('dashboard-theme');
if (saved) document.body.setAttribute('data-theme', saved);
applyThemeToUI();

themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('dashboard-theme', next);
        themeToggles.forEach(t => t.setAttribute('aria-pressed', String(next === 'dark')));
        applyThemeToUI();
        // re-render charts with new theme
        reloadTradingViewWidgets();
    });
});

function applyThemeToUI() {
    const t = document.body.getAttribute('data-theme') || 'light';
    const icons = document.querySelectorAll('[id*="themeIcon"]');
    const labels = document.querySelectorAll('[id*="themeLabel"]');
    
    if (t === 'dark') { 
        icons.forEach(icon => icon.className = 'fa-solid fa-moon');
        labels.forEach(label => label.textContent = 'Dark');
    } else { 
        icons.forEach(icon => icon.className = 'fa-regular fa-sun');
        labels.forEach(label => label.textContent = 'Light');
    }
}

// ---------------- Time display ----------------
const timeDisplay = document.getElementById('timeDisplay');
function refreshTime() { const d = new Date(); timeDisplay.textContent = d.toLocaleString() + ' • ' + d.toISOString().slice(0, 10); } refreshTime(); setInterval(refreshTime, 1000);

// ---------------- WebSocket live updates (Binance combined miniTicker stream) ----------------
const pairIds = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];
const uiMap = { BTCUSDT: { priceEl: document.getElementById('btcPrice'), changeEl: document.getElementById('btcChange') }, ETHUSDT: { priceEl: document.getElementById('ethPrice'), changeEl: document.getElementById('ethChange') }, BNBUSDT: { priceEl: document.getElementById('bnbPrice'), changeEl: document.getElementById('bnbChange') }, SOLUSDT: { priceEl: document.getElementById('solPrice'), changeEl: document.getElementById('solChange') }, XRPUSDT: { priceEl: document.getElementById('xrpPrice'), changeEl: document.getElementById('xrpChange') }, DOGEUSDT: { priceEl: document.getElementById('dogePrice'), changeEl: document.getElementById('dogeChange') } };
const streams = pairIds.map(p => p.toLowerCase() + '@miniTicker').join('/');
const WS_URL = `wss://stream.binance.com:9443/stream?streams=${streams}`;
let ws = null; let reconnectDelay = 1000;
function connect() { ws = new WebSocket(WS_URL); ws.onopen = () => { console.log('Binance WS connected'); reconnectDelay = 1000 }; ws.onmessage = (ev) => { try { const msg = JSON.parse(ev.data); const data = msg.data || msg; const sym = data.s; const price = parseFloat(data.c); const open = parseFloat(data.o); if (!isFinite(price)) return; const pct = open ? ((price - open) / open * 100).toFixed(2) : '0.00'; const map = uiMap[sym]; if (map) { map.priceEl.textContent = formatUSD(price); map.changeEl.textContent = pct + '%'; map.changeEl.style.color = parseFloat(pct) >= 0 ? 'limegreen' : 'tomato'; } } catch (err) { console.error('WS parse error', err) } }; ws.onclose = () => { console.warn('Binance WS closed — reconnecting in', reconnectDelay); setTimeout(() => { reconnectDelay = Math.min(30000, reconnectDelay * 1.5); connect(); }, reconnectDelay) }; ws.onerror = (e) => { console.error('WS error', e); ws.close() }; }
try { connect(); } catch (e) { console.error('WS failed', e) }
function formatUSD(n) { return typeof n === 'number' ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : n }

// fallback/mock updates
const mockBase = { BTCUSDT: 60000, ETHUSDT: 3500, BNBUSDT: 450, SOLUSDT: 120, XRPUSDT: 0.6, DOGEUSDT: 0.08 };
setInterval(() => { pairIds.forEach(p => { const el = uiMap[p].priceEl; const ch = uiMap[p].changeEl; if (el && (el.textContent === '--' || el.textContent === '')) { const base = mockBase[p]; const price = +(base * (1 + (Math.random() - 0.5) * 0.01)).toFixed(6); el.textContent = formatUSD(price); const pct = (Math.random() - 0.5) * 4; ch.textContent = pct.toFixed(2) + '%'; ch.style.color = pct >= 0 ? 'limegreen' : 'tomato'; } }) }, 2200);

// ----------------- TradingView widgets -----------------
// We'll load s3.tradingview.com/tv.js once and create widgets for selected symbols
const TV_SCRIPT = 'https://s3.tradingview.com/tv.js';
let TV = null; // will hold TradingView global when loaded
let activeWidgets = {};

// symbols and human labels
const chartSymbols = [{ id: 'BTCUSDT', symbol: 'BINANCE:BTCUSDT', label: 'BTC/USDT' }, { id: 'ETHUSDT', symbol: 'BINANCE:ETHUSDT', label: 'ETH/USDT' }, { id: 'BNBUSDT', symbol: 'BINANCE:BNBUSDT', label: 'BNB/USDT' }, { id: 'SOLUSDT', symbol: 'BINANCE:SOLUSDT', label: 'SOL/USDT' }, { id: 'XRPUSDT', symbol: 'BINANCE:XRPUSDT', label: 'XRP/USDT' }, { id: 'DOGEUSDT', symbol: 'BINANCE:DOGEUSDT', label: 'DOGE/USDT' }];

// load TradingView script
function loadTradingViewScript(cb) {
    if (window.TradingView) { TV = window.TradingView; cb && cb(); return; }
    const s = document.createElement('script'); s.src = TV_SCRIPT; s.async = true; s.onload = () => { TV = window.TradingView; cb && cb(); }; s.onerror = () => { console.error('Failed to load TradingView script'); }; document.head.appendChild(s);
}

// create chart card DOM
function createChartCard(id, label) {
    const card = document.createElement('div'); card.className = 'chart-card'; card.id = 'card-' + id;
    const title = document.createElement('div'); title.className = 'chart-title'; title.textContent = label;
    const wrap = document.createElement('div'); wrap.className = 'chart-wrapper'; wrap.id = 'tv-' + id;
    card.appendChild(title); card.appendChild(wrap);
    return card;
}

function clearChartsSection() {
    const s = document.getElementById('chartsSection'); s.innerHTML = '';
    activeWidgets = {};
}

function createWidgetsFor(symbolIds) {
    // ensure library loaded
    loadTradingViewScript(() => {
        const theme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const container = document.getElementById('chartsSection');
        // add cards
        symbolIds.forEach(id => {
            const cfg = chartSymbols.find(c => c.id === id);
            if (!cfg) return;
            const card = createChartCard(cfg.id, cfg.label);
            container.appendChild(card);
            // create TradingView widget
            try {
                const widget = new TradingView.widget({
                    autosize: true,
                    symbol: cfg.symbol,
                    interval: '60',
                    timezone: 'Etc/UTC',
                    theme: theme,
                    style: '1',
                    locale: 'en',
                    toolbar_bg: theme === 'dark' ? '#0b0d0f' : '#ffffff',
                    enable_publishing: false,
                    allow_symbol_change: true,
                    hide_side_toolbar: false,
                    container_id: 'tv-' + cfg.id
                });
                activeWidgets[cfg.id] = widget;
            } catch (e) { console.error('TradingView widget error', e) }
        });
    });
}

function reloadTradingViewWidgets() {
    // destroy/replace by clearing and recreating using current filter
    const filter = document.getElementById('chartFilter').value;
    applyFilterAndRender(filter);
}

function applyFilterAndRender(filter) {
    clearChartsSection();
    let toShow = [];
    if (filter === 'all') toShow = chartSymbols.map(c => c.id);
    else if (filter === 'top3') toShow = chartSymbols.slice(0, 3).map(c => c.id);
    else toShow = [filter];
    createWidgetsFor(toShow);
    
    // Add 'single-chart' class if only one chart is displayed
    const chartsGrid = document.getElementById('chartsSection');
    if (chartsGrid) {
        if (toShow.length === 1) {
            chartsGrid.classList.add('single-chart');
        } else {
            chartsGrid.classList.remove('single-chart');
        }
    }
}

// init filter dropdown behavior
document.getElementById('chartFilter').addEventListener('change', (e) => {
    applyFilterAndRender(e.target.value);
});

// initial render: show all
applyFilterAndRender('all');

// ============= NEW FEATURE FUNCTIONS =============

// SWAP CRYPTO
function handleCryptoSwap(fromCrypto, toCrypto, amount) {
    if (amount <= 0) return { success: false, message: 'Invalid amount' };
    const mockRate = { 'BTC': 1, 'ETH': 15, 'USDT': 40000, 'BNB': 300 };
    const rate = (mockRate[toCrypto] || 1) / (mockRate[fromCrypto] || 1);
    const swapResult = {
        id: `swap-${Date.now()}`,
        from: fromCrypto,
        to: toCrypto,
        fromAmount: amount,
        toAmount: (amount * rate).toFixed(6),
        rate: rate.toFixed(6),
        timestamp: new Date().toISOString(),
        status: 'completed'
    };
    userState.swaps.push(swapResult);
    return { success: true, message: 'Swap completed', swap: swapResult };
}

// MANAGED ACCOUNTS
function addManagedAccount(name, manager, balance) {
    const acc = {
        id: `acc-${Date.now()}`,
        name,
        manager,
        balance,
        roi: (Math.random() * 20 + 5).toFixed(2),
        status: 'active',
        createdAt: new Date().toISOString()
    };
    userState.managedAccounts.push(acc);
    return { success: true, account: acc };
}

function getManagedAccounts() {
    return userState.managedAccounts;
}

// PROFILE FUNCTIONS
function updateUserProfile(updates) {
    const current = JSON.parse(localStorage.getItem('userData') || '{}');
    const updated = { ...current, ...updates };
    localStorage.setItem('userData', JSON.stringify(updated));
    userState.userData = updated;
    return { success: true, userData: updated };
}

function getUserProfile() {
    return JSON.parse(localStorage.getItem('userData') || {});
}

// REFERRALS
function getReferralLink() {
    const code = userState.userData.referralCode || ('REF_' + Math.random().toString(36).slice(2, 8).toUpperCase());
    return `${window.location.origin}/?ref=${code}`;
}

function addReferral(referredEmail) {
    const referral = {
        id: `ref-${Date.now()}`,
        email: referredEmail,
        status: 'pending',
        commission: 0,
        joinedAt: new Date().toISOString()
    };
    userState.referrals.push(referral);
    return { success: true, referral };
}

function getReferrals() {
    return userState.referrals;
}

function getReferralStats() {
    const active = userState.referrals.filter(r => r.status === 'active').length;
    const totalCommission = userState.referrals.reduce((sum, r) => sum + (r.commission || 0), 0);
    return { total: userState.referrals.length, active, totalCommission };
}

// ============= TILE CLICK HANDLERS =============

function setupTileClickHandlers() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const label = tile.querySelector('.label')?.textContent || '';
            showTileContent(label);
        });
    });
}

function showTileContent(tileLabel) {
    const main = document.querySelector('main');
    let html = '';

    switch (tileLabel) {
        case 'Transactions':
            html = renderTransactionsView();
            break;
        case 'My Investments':
            html = renderMyInvestmentsView();
            break;
        case 'Swap Crypto':
            html = renderSwapCryptoView();
            break;
        case 'Managed Accounts':
            html = renderManagedAccountsView();
            break;
        case 'Profile':
            html = renderProfileView();
            break;
        case 'Referrals':
            html = renderReferralsView();
            break;
        case 'Contact Support':
            html = renderContactSupportView();
            break;
        default:
            return;
    }

    // Clear old sections and insert new content
    const oldSections = main.querySelectorAll('section');
    oldSections.forEach(s => s.remove());
    
    const section = document.createElement('section');
    section.innerHTML = html;
    main.appendChild(section);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    attachTileFeatureHandlers(tileLabel);
}

function renderTransactionsView() {
    const transactions = getTransactionHistory();
    return `
        <div class="feature-container transactions-container">
            <h2>Transaction History</h2>
            <div class="filter-bar">
                <input type="text" id="txFilter" placeholder="Search transactions..." class="search-input">
                <select id="txTypeFilter" class="filter-select">
                    <option value="">All Types</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdraw">Withdrawals</option>
                    <option value="swap">Swaps</option>
                </select>
            </div>
            <div class="table-container">
                <table class="feature-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Currency</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactions.length ? transactions.map(tx => `
                            <tr>
                                <td>${new Date(tx.timestamp).toLocaleDateString()}</td>
                                <td><span class="badge badge-${tx.type}">${tx.type.toUpperCase()}</span></td>
                                <td>${tx.amount}</td>
                                <td>${tx.currency}</td>
                                <td><span class="status-${tx.status}">${tx.status}</span></td>
                            </tr>
                        `).join('') : '<tr><td colspan="5" class="text-center">No transactions yet</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderMyInvestmentsView() {
    const investments = getActiveInvestments();
    const plans = investmentPlans;
    return `
        <div class="feature-container investments-container">
            <h2>My Investments</h2>
            <div class="investments-grid">
                ${investments.length ? investments.map(inv => {
        const plan = plans.find(p => p.id === inv.planId);
        return `
                        <div class="investment-card">
                            <h3>${plan?.name || 'Investment'}</h3>
                            <div class="card-stat">
                                <span class="stat-label">Amount Invested:</span>
                                <span class="stat-value">$${inv.amount.toLocaleString()}</span>
                            </div>
                            <div class="card-stat">
                                <span class="stat-label">Expected ROI:</span>
                                <span class="stat-value" style="color: limegreen;">+$${inv.expectedRoi.toFixed(2)}</span>
                            </div>
                            <div class="card-stat">
                                <span class="stat-label">Start Date:</span>
                                <span class="stat-value">${new Date(inv.startDate).toLocaleDateString()}</span>
                            </div>
                            <div class="card-stat">
                                <span class="stat-label">End Date:</span>
                                <span class="stat-value">${new Date(inv.endDate).toLocaleDateString()}</span>
                            </div>
                            <div class="card-stat">
                                <span class="stat-label">Status:</span>
                                <span class="stat-value badge badge-${inv.status}">${inv.status.toUpperCase()}</span>
                            </div>
                        </div>
                    `;
    }).join('') : '<p class="no-data">No active investments</p>'}
            </div>
        </div>
    `;
}

function renderSwapCryptoView() {
    const cryptos = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'DOGE'];
    return `
        <div class="feature-container swap-container">
            <h2>Swap Crypto</h2>
            <form id="swapForm" class="feature-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="fromCrypto">From Crypto</label>
                        <select id="fromCrypto" required>
                            ${cryptos.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                    <button type="button" class="swap-button" id="swapToggle">⇆</button>
                    <div class="form-group">
                        <label for="toCrypto">To Crypto</label>
                        <select id="toCrypto" required>
                            ${cryptos.map(c => `<option value="${c}" ${c === 'ETH' ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="swapAmount">Amount to Swap</label>
                    <input type="number" id="swapAmount" min="0.001" step="0.001" placeholder="Enter amount" required>
                </div>
                <div id="swapPreview" class="swap-preview"></div>
                <button type="submit" class="btn-primary">Execute Swap</button>
            </form>
            <div class="swaps-history">
                <h3>Recent Swaps</h3>
                ${userState.swaps.length ? userState.swaps.slice(-5).reverse().map(swap => `
                    <div class="swap-item">
                        <span>${swap.from} → ${swap.to}</span>
                        <span>${swap.fromAmount} ${swap.from} = ${swap.toAmount} ${swap.to}</span>
                        <span class="status-${swap.status}">${swap.status}</span>
                    </div>
                `).join('') : '<p class="no-data">No swaps yet</p>'}
            </div>
        </div>
    `;
}

function renderManagedAccountsView() {
    const accounts = getManagedAccounts();
    return `
        <div class="feature-container accounts-container">
            <h2>Managed Accounts</h2>
            <p class="info-text">Professional accounts managed by our experienced traders</p>
            <div class="accounts-grid">
                ${accounts.map(acc => `
                    <div class="account-card">
                        <div class="account-header">
                            <h3>${acc.name}</h3>
                            <span class="badge badge-${acc.status}">${acc.status.toUpperCase()}</span>
                        </div>
                        <div class="account-info">
                            <p><strong>Manager:</strong> ${acc.manager}</p>
                            <p><strong>Current Balance:</strong> $${acc.balance.toLocaleString()}</p>
                            <p><strong>ROI:</strong> <span style="color: limegreen;">+${acc.roi}%</span></p>
                            <p><strong>Created:</strong> ${new Date(acc.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button class="btn-secondary view-account-btn" data-id="${acc.id}">View Details</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderProfileView() {
    const user = getUserProfile();
    return `
        <div class="feature-container profile-container">
            <h2>User Profile & Settings</h2>
            <form id="profileForm" class="feature-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="pFirstName">First Name</label>
                        <input type="text" id="pFirstName" value="${user.firstName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="pLastName">Last Name</label>
                        <input type="text" id="pLastName" value="${user.lastName || ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="pEmail">Email</label>
                    <input type="email" id="pEmail" value="${user.email || ''}" disabled>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="pCountry">Country</label>
                        <input type="text" id="pCountry" value="${user.country || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="pPhone">Phone</label>
                        <input type="tel" id="pPhone" value="${user.phone || ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="pCurrency">Main Currency</label>
                    <select id="pCurrency">
                        <option value="USD" ${user.currency === 'USD' ? 'selected' : ''}>USD</option>
                        <option value="EUR" ${user.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                        <option value="GBP" ${user.currency === 'GBP' ? 'selected' : ''}>GBP</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Save Changes</button>
            </form>
        </div>
    `;
}

function renderReferralsView() {
    const stats = getReferralStats();
    const referrals = getReferrals();
    const refLink = getReferralLink();
    return `
        <div class="feature-container referrals-container">
            <h2>Referral Program</h2>
            <div class="referral-stats">
                <div class="stat-box">
                    <h4>Total Referrals</h4>
                    <p class="stat-number">${stats.total}</p>
                </div>
                <div class="stat-box">
                    <h4>Active Referrals</h4>
                    <p class="stat-number">${stats.active}</p>
                </div>
                <div class="stat-box">
                    <h4>Total Commission</h4>
                    <p class="stat-number">$${stats.totalCommission.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="referral-link-section">
                <h3>Your Referral Link</h3>
                <div class="ref-link-box">
                    <input type="text" id="referralLink" value="${refLink}" readonly class="ref-link-input">
                    <button id="copyRefLink" class="btn-secondary">Copy Link</button>
                </div>
            </div>

            <div class="referrals-list">
                <h3>Your Referrals</h3>
                ${referrals.length ? `
                    <table class="feature-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Commission</th>
                                <th>Joined Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${referrals.map(ref => `
                                <tr>
                                    <td>${ref.email}</td>
                                    <td><span class="badge badge-${ref.status}">${ref.status}</span></td>
                                    <td>$${ref.commission.toFixed(2)}</td>
                                    <td>${new Date(ref.joinedAt).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="no-data">No referrals yet. Share your link to get started!</p>'}
            </div>
        </div>
    `;
}

function renderContactSupportView() {
    return `
        <div class="feature-container support-container">
            <h2>Contact Support</h2>
            <div class="support-content">
                <div class="support-form-section">
                    <h3>Send us a Message</h3>
                    <form id="contactSupportForm" class="feature-form">
                        <div class="form-group">
                            <label for="supportSubject">Subject</label>
                            <select id="supportSubject" required>
                                <option value="">-- Select Subject --</option>
                                <option value="deposit_issue">Deposit Issue</option>
                                <option value="withdrawal_issue">Withdrawal Issue</option>
                                <option value="account_security">Account Security</option>
                                <option value="investment_help">Investment Help</option>
                                <option value="technical_issue">Technical Issue</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="supportMessage">Message</label>
                            <textarea id="supportMessage" rows="6" placeholder="Describe your issue..." required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="supportAttachment">Attachment (optional)</label>
                            <input type="file" id="supportAttachment">
                        </div>
                        <button type="submit" class="btn-primary">Submit Ticket</button>
                    </form>
                </div>

                <div class="support-info-section">
                    <h3>Support Information</h3>
                    <div class="support-info-box">
                        <h4><i class="fa-solid fa-envelope"></i> Email</h4>
                        <p>support@rivertrade.com</p>
                    </div>
                    <div class="support-info-box">
                        <h4><i class="fa-solid fa-headset"></i> Live Chat</h4>
                        <p>Available 24/7</p>
                    </div>
                    <div class="support-info-box">
                        <h4><i class="fa-solid fa-phone"></i> Phone</h4>
                        <p>+1 (800) 123-4567</p>
                    </div>
                    <div class="support-info-box">
                        <h4><i class="fa-solid fa-clock"></i> Response Time</h4>
                        <p>Within 24 hours</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function attachTileFeatureHandlers(tileLabel) {
    switch (tileLabel) {
        case 'Swap Crypto':
            const swapForm = document.getElementById('swapForm');
            if (swapForm) {
                document.getElementById('swapToggle')?.addEventListener('click', () => {
                    const from = document.getElementById('fromCrypto').value;
                    const to = document.getElementById('toCrypto').value;
                    document.getElementById('fromCrypto').value = to;
                    document.getElementById('toCrypto').value = from;
                });

                swapForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const from = document.getElementById('fromCrypto').value;
                    const to = document.getElementById('toCrypto').value;
                    const amount = parseFloat(document.getElementById('swapAmount').value);
                    const result = handleCryptoSwap(from, to, amount);
                    if (result.success) {
                        alert('Swap successful: ' + amount + ' ' + from + ' → ' + result.swap.toAmount + ' ' + to);
                        swapForm.reset();
                    } else {
                        alert(result.message);
                    }
                });
            }
            break;

        case 'Managed Accounts':
            document.querySelectorAll('.view-account-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const accId = e.target.dataset.id;
                    alert('Viewing account details for: ' + accId);
                });
            });
            break;

        case 'Profile':
            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const updates = {
                        firstName: document.getElementById('pFirstName').value,
                        lastName: document.getElementById('pLastName').value,
                        country: document.getElementById('pCountry').value,
                        phone: document.getElementById('pPhone').value,
                        currency: document.getElementById('pCurrency').value
                    };
                    const result = updateUserProfile(updates);
                    if (result.success) {
                        alert('Profile updated successfully!');
                        // Update sidebar user display
                        const disp = document.getElementById('userDisplay');
                        if (disp) disp.textContent = updates.firstName || result.userData.email;
                    }
                });
            }
            break;

        case 'Referrals':
            const copyBtn = document.getElementById('copyRefLink');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const link = document.getElementById('referralLink').value;
                    navigator.clipboard.writeText(link).then(() => {
                        alert('Referral link copied to clipboard!');
                    });
                });
            }
            break;

        case 'Contact Support':
            const supportForm = document.getElementById('contactSupportForm');
            if (supportForm) {
                supportForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const subject = document.getElementById('supportSubject').value;
                    const message = document.getElementById('supportMessage').value;
                    const attachment = document.getElementById('supportAttachment').files[0];

                    if (!subject || !message) {
                        alert('Please fill in all required fields');
                        return;
                    }

                    const ticket = {
                        id: `TKT-${Date.now()}`,
                        subject: subject,
                        message: message,
                        attachment: attachment ? attachment.name : null,
                        status: 'open',
                        createdAt: new Date().toISOString(),
                        userId: localStorage.getItem('currentUser') || 'unknown'
                    };

                    // Save ticket to localStorage
                    let tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
                    tickets.push(ticket);
                    localStorage.setItem('supportTickets', JSON.stringify(tickets));

                    alert(`Support ticket submitted successfully!\nTicket ID: ${ticket.id}\n\nOur team will respond within 24 hours.`);
                    supportForm.reset();
                });
            }
            break;
    }
}