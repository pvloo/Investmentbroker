// ============== CHATBOT KNOWLEDGE BASE ==============

const supportKnowledgeBase = {
  // Account & Registration
  account: {
    keywords: ['account', 'register', 'signup', 'login', 'password', 'profile', 'user'],
    responses: [
      "📝 <b>Account Registration:</b> Click 'Sign Up' on the homepage and fill in your email, password, and personal details. You'll receive a verification email.",
      "🔐 <b>Login Issues:</b> Make sure you're using the correct email and password. If you forgot your password, use the 'Forgot Password' option on the login page.",
      "👤 <b>Profile Management:</b> You can update your profile, including first name, last name, country, phone, and preferred currency in the Dashboard → Profile section.",
      "🔑 <b>Password Security:</b> Use a strong password with at least 8 characters, numbers, and special characters. Never share your password with anyone."
    ]
  },

  // Deposits
  deposit: {
    keywords: ['deposit', 'fund', 'add money', 'credit', 'top up', 'how to fund'],
    responses: [
      "💰 <b>How to Deposit:</b> Go to Dashboard → Deposit. Select your preferred currency (BTC, ETH, USDT) and enter the amount. Minimum deposit is $100.",
      "⏱️ <b>Deposit Times:</b> Crypto deposits usually confirm within 10-30 minutes. Bank transfers may take 1-3 business days.",
      "💳 <b>Payment Methods:</b> We accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT), and bank transfers.",
      "✅ <b>Deposit Confirmation:</b> Once your deposit is confirmed, funds appear in your account balance immediately."
    ]
  },

  // Withdrawals
  withdrawal: {
    keywords: ['withdraw', 'withdraw funds', 'cash out', 'transfer out', 'send money'],
    responses: [
      "💸 <b>How to Withdraw:</b> Go to Dashboard → Withdraw. Enter your wallet address, amount, and select the currency. Minimum withdrawal is $50.",
      "⏱️ <b>Withdrawal Times:</b> Withdrawals process within 24-48 hours. Network confirmation may take additional time.",
      "🔐 <b>Withdrawal Security:</b> We require wallet address verification for security. Make sure you enter the correct address.",
      "❌ <b>Withdrawal Hold:</b> New accounts have a 5-day hold on withdrawals. This is a security measure to prevent fraud."
    ]
  },

  // Investments & Plans
  investment: {
    keywords: ['investment', 'invest', 'plan', 'starter plan', 'premium', 'vip', 'roi', 'return'],
    responses: [
      "📊 <b>Investment Plans:</b> We offer 6 plans: Starter ($5K-9K, 6% ROI), Deluxe ($10K-29K, 8% ROI), Premium ($30K-49K, 12% ROI), VIP ($100K-150K, 18% ROI), Gold ($200K-300K, 22% ROI), and VIP Platinum ($500K+, 30% ROI).",
      "⏳ <b>Investment Duration:</b> Plans range from 45 to 180 days. Your investment automatically matures at the end of the term.",
      "💹 <b>How ROI Works:</b> ROI (Return on Investment) is the profit percentage. For example, a $10,000 investment at 8% ROI earns $800 profit.",
      "✨ <b>Auto-Compounding:</b> Profits can be reinvested for compound growth. Ask about our auto-reinvestment feature."
    ]
  },

  // Transactions & History
  transaction: {
    keywords: ['transaction', 'history', 'statement', 'records', 'transaction history'],
    responses: [
      "📋 <b>Transaction History:</b> View all your transactions in Dashboard → Transactions. You can filter by type (deposit, withdrawal, investment).",
      "📥 <b>Download Statement:</b> You can export your transaction history as CSV or PDF from the Transactions section.",
      "⏰ <b>Transaction Status:</b> All transactions show their status: Pending, Completed, or Failed. Pending transactions usually complete within 24 hours."
    ]
  },

  // Copy Trading
  copytrading: {
    keywords: ['copy trading', 'copy expert', 'expert trader', 'auto trade', 'copy trade'],
    responses: [
      "🤖 <b>Copy Trading Explained:</b> Copy Trading allows you to automatically replicate the trades of successful traders. Your investment grows with theirs.",
      "⭐ <b>Top Traders:</b> We have experienced traders with 85-95% success rates. Choose traders based on their track record and strategy.",
      "💰 <b>Minimum for Copy Trading:</b> You need at least $1,000 in your account to start copy trading.",
      "🎯 <b>Profit Sharing:</b> You keep 90% of profits, and our platform takes 10% commission. No hidden fees!"
    ]
  },

  // Referral Program
  referral: {
    keywords: ['referral', 'refer', 'commission', 'earn', 'invite', 'referral code'],
    responses: [
      "🎁 <b>Referral Program:</b> Earn commissions by inviting friends! Each successful referral earns you 10% of their first deposit.",
      "🔗 <b>Your Referral Link:</b> Share your unique referral link from Dashboard → Referrals. Friends who sign up using your link count as referrals.",
      "💵 <b>Unlimited Earnings:</b> There's no limit to how many people you can refer or how much you can earn.",
      "🏆 <b>Tier Bonuses:</b> Reach 10 referrals → Silver (extra 2%), 50 referrals → Gold (extra 5%), 100+ referrals → Platinum (extra 10%)."
    ]
  },

  // Fees & Charges
  fees: {
    keywords: ['fees', 'charge', 'commission', 'cost', 'expense', 'how much does it cost'],
    responses: [
      "💸 <b>Account Fees:</b> No account creation fees or monthly maintenance fees.",
      "💳 <b>Deposit Fees:</b> No fees for deposits to your account.",
      "📤 <b>Withdrawal Fees:</b> Network fees apply (varies by currency): BTC (0.0005 BTC), ETH (0.01 ETH), USDT ($2).",
      "🤝 <b>Trading Fees:</b> Copy trading has a 10% profit commission. Investment plans have no hidden fees.",
      "📊 <b>Currency Conversion:</b> Minimal conversion fee of 0.5% when converting between currencies."
    ]
  },

  // Security
  security: {
    keywords: ['security', 'safe', 'hacking', 'scam', '2fa', 'two factor', 'encrypted'],
    responses: [
      "🔒 <b>Account Security:</b> Your account is protected with industry-standard encryption and multi-layer security protocols.",
      "🔐 <b>Two-Factor Authentication:</b> Enable 2FA in Account Settings → Security for an extra layer of protection.",
      "💳 <b>Fund Safety:</b> All deposits are held in segregated accounts and insured up to $250,000.",
      "🚨 <b>Report Suspicious Activity:</b> If you notice unauthorized access, change your password immediately and contact our support team.",
      "✅ <b>Verified & Licensed:</b> We are fully regulated and comply with international financial regulations."
    ]
  },

  // Technical & Platform
  technical: {
    keywords: ['app', 'website', 'bug', 'error', 'not working', 'crash', 'slow', 'technical issue', 'problem'],
    responses: [
      "📱 <b>Mobile App:</b> Download our app from Google Play or Apple App Store for better experience and push notifications.",
      "🌐 <b>Browser Compatibility:</b> Our website works best on Chrome, Firefox, Safari, and Edge. Keep your browser updated.",
      "⚙️ <b>Technical Issues:</b> Try clearing your browser cache and cookies. If the problem persists, use a different browser or contact support.",
      "📞 <b>Live Support:</b> Having technical issues? Contact our support team via chat, email at support@rivertrade.com, or call +1-800-RIVER-01."
    ]
  },

  // KYC & Verification
  kyc: {
    keywords: ['kyc', 'verification', 'verify', 'document', 'id', 'identity', 'aml', 'know your customer'],
    responses: [
      "✅ <b>KYC Verification:</b> KYC (Know Your Customer) is required for security. You'll need to verify your email and provide a valid ID.",
      "📸 <b>Document Requirements:</b> Provide a government-issued ID (passport, driver's license) and a recent utility bill for address verification.",
      "⏱️ <b>Verification Time:</b> Most verifications complete within 24 hours. Premium members get priority verification.",
      "🔒 <b>Data Privacy:</b> Your personal information is encrypted and stored securely. We never share your data with third parties."
    ]
  },

  // Taxes & Compliance
  tax: {
    keywords: ['tax', 'report', 'irs', 'capital gains', 'compliance', 'legal'],
    responses: [
      "📋 <b>Tax Information:</b> We provide detailed transaction records for tax reporting. Download your tax report from Dashboard → Reports.",
      "💰 <b>Capital Gains:</b> Profits from investments are subject to capital gains tax. Consult a tax professional for your specific situation.",
      "📊 <b>1099 Forms:</b> Users in the US receive 1099 forms for transactions exceeding $20,000. These are sent by January 31st.",
      "⚖️ <b>Regulatory Compliance:</b> We comply with all local and international financial regulations and AML (Anti-Money Laundering) laws."
    ]
  },

  // Customer Support
  support: {
    keywords: ['support', 'help', 'contact', 'customer service', 'assistance', 'help center'],
    responses: [
      "📞 <b>Contact Support:</b> Email: support@rivertrade.com | Chat: Available 24/7 in the app | Phone: +1-800-RIVER-01",
      "⏰ <b>Support Hours:</b> Our team responds to emails within 2 hours during business hours. Chat support is available 24/7.",
      "📚 <b>Help Center:</b> Visit our Help Center for FAQ, guides, and video tutorials.",
      "🎯 <b>Quick Resolution:</b> Include your account email and a detailed description for faster assistance."
    ]
  },

  // General Site Info
  general: {
    keywords: ['what is', 'about', 'rivertrade', 'platform', 'how it works', 'who are you', 'company'],
    responses: [
      "🌊 <b>About Rivertrade:</b> Rivertrade is a leading crypto investment platform founded in 2020. We help millions of users grow their wealth through crypto investments.",
      "🎯 <b>Our Mission:</b> To democratize crypto investing and make it accessible to everyone, from beginners to professionals.",
      "💼 <b>How It Works:</b> Sign up → Deposit funds → Choose an investment plan → Earn profits → Withdraw anytime.",
      "🌍 <b>Global Reach:</b> We serve users in 150+ countries with 24/7 multilingual support."
    ]
  }
};

// ============== CRYPTO PRICE FUNCTION ==============

async function fetchCryptoPrice(query) {
    const cryptoMap = {
        bitcoin: "bitcoin",
        btc: "bitcoin",
        ethereum: "ethereum",
        eth: "ethereum",
        solana: "solana",
        sol: "solana",
        dogecoin: "dogecoin",
        doge: "dogecoin",
        ripple: "ripple",
        xrp: "ripple",
        cardano: "cardano",
        ada: "cardano",
        polkadot: "polkadot",
        dot: "polkadot"
    };

    const match = Object.keys(cryptoMap).find(key => query.toLowerCase().includes(key));
    if (!match) return null;

    const coin = cryptoMap[match];
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
        const data = await res.json();

        if (!data[coin]) return null;
        const price = data[coin].usd.toLocaleString();
        return `💰 The current price of <b>${coin.charAt(0).toUpperCase() + coin.slice(1)}</b> is <b>$${price} USD</b>.`;
    } catch (err) {
        return null;
    }
}

// ============== INTELLIGENT RESPONSE FUNCTION ==============

function getResponse(query) {
    const lowerQuery = query.toLowerCase().trim();

    // Search knowledge base
    for (const [category, data] of Object.entries(supportKnowledgeBase)) {
        const matchKeyword = data.keywords.some(keyword => lowerQuery.includes(keyword));
        if (matchKeyword) {
            const randomIndex = Math.floor(Math.random() * data.responses.length);
            return data.responses[randomIndex];
        }
    }

    // Fallback responses
    const fallbacks = [
        "🤔 I'm not sure about that. Can you rephrase your question? Try asking about: deposits, withdrawals, investments, referrals, or crypto prices.",
        "I can help with account, deposits, withdrawals, investments, trading, referrals, fees, security, KYC, taxes, and more. What would you like to know?",
        "💡 Tip: You can ask me about 'How to deposit?', 'What's Bitcoin price?', 'How referrals work?', or any platform-related questions!",
        "🤝 Not sure? You can also contact our support team at support@rivertrade.com or use the live chat feature."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ============== SEND MESSAGE FUNCTION ==============

async function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    const chatBody = document.getElementById('chatBody');

    // user message
    const userMsg = document.createElement('div');
    userMsg.classList.add('message');
    userMsg.innerHTML = `<div class="user-bubble">${text}</div>`;
    chatBody.appendChild(userMsg);
    input.value = '';

    chatBody.scrollTop = chatBody.scrollHeight;

    // bot thinking
    const botMsg = document.createElement('div');
    botMsg.classList.add('message');
    botMsg.innerHTML = `<div class="bot-icon">M</div><div class="bubble">Thinking...</div>`;
    chatBody.appendChild(botMsg);

    // Get response (check for crypto price first, then knowledge base)
    setTimeout(async () => {
        let reply;
        
        // Check if it's a crypto price query
        if (text.toLowerCase().match(/price|cost|worth|value|bitcoin|ethereum|btc|eth|solana|dogecoin|ripple|cardano|polkadot/i)) {
            const priceReply = await fetchCryptoPrice(text);
            reply = priceReply || getResponse(text);
        } else {
            reply = getResponse(text);
        }
        
        botMsg.querySelector('.bubble').innerHTML = reply;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 300);
}