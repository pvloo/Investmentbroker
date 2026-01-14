// ============== CHATBOT KNOWLEDGE BASE ==============

const supportKnowledgeBase = {
  // Account & Registration
  account: {
    keywords: ['account', 'register', 'signup', 'login', 'password', 'profile', 'user'],
    responses: [
      "Hey! Setting up an account is super easy. Just click 'Sign Up' and fill in your email, password, and some basic info. You'll get a verification email - just confirm it and you're good to go!",
      "Trouble logging in? No worries! Double-check your email and password first. If you can't remember your password, just click 'Forgot Password' on the login page and we'll help you reset it.",
      "Want to update your profile? You can change your name, location, phone number, and preferred currency anytime in your Dashboard settings. It only takes a minute!",
      "For security, make sure your password is strong - mix in some numbers and special characters, and don't share it with anyone. It's your account, so keep it safe!"
    ]
  },

  // Deposits
  deposit: {
    keywords: ['deposit', 'fund', 'add money', 'credit', 'top up', 'how to fund'],
    responses: [
      "Ready to add funds? Go to your Dashboard and hit the Deposit button. You can add money using Bitcoin, Ethereum, Tether, or bank transfer. The minimum is $1000 to get started.",
      "Crypto deposits usually show up in your account within 10-30 minutes - sometimes even faster! Bank transfers can take 1-3 business days depending on your bank.",
      "We accept most major cryptocurrencies and bank transfers. Whatever works best for you!",
      "Once your deposit comes through, the money shows up in your account balance right away. You can then start investing or trading whenever you want."
    ]
  },

  // Withdrawals
  withdrawal: {
    keywords: ['withdraw', 'withdraw funds', 'cash out', 'transfer out', 'send money'],
    responses: [
      "To withdraw your funds, just go to Dashboard → Withdraw. Enter the amount you want to take out, provide your wallet address, and choose your currency. Minimum withdrawal is $50.",
      "Most withdrawals process within 24-48 hours. After that, it depends on the network, but usually it's pretty quick!",
      "We need you to verify your wallet address for security - just to make sure the money goes to the right place. It's a safety measure we take seriously.",
      "Fair warning: new accounts have a 5-day hold on withdrawals. It's just a security thing to prevent fraud. After that, you can withdraw anytime!"
    ]
  },

  // Investments & Plans
  investment: {
    keywords: ['investment', 'invest', 'plan', 'starter plan', 'premium', 'vip', 'roi', 'return'],
    responses: [
      "We've got investment plans for everyone! From Starter plans (5K-9K with 6% ROI) all the way up to VIP Platinum ($500K+ with 30% ROI). Pick the one that fits your budget.",
      "The plans last between 45-180 days. When the time is up, your investment matures and you get your money plus profits. You can also reinvest if you want to compound your returns!",
      "ROI just means Return on Investment - it's the profit percentage you earn. So if you invest $10,000 at 8% ROI, you make $800 in profit. Pretty straightforward!",
      "You can actually reinvest your profits automatically to get compound growth over time. It's like making money on your money!"
    ]
  },

  // Transactions & History
  transaction: {
    keywords: ['transaction', 'history', 'statement', 'records', 'transaction history'],
    responses: [
      "Want to see what's happening with your account? Check out Dashboard → Transactions. You can see all your deposits, withdrawals, and investments in one place.",
      "You can download your transaction history as a PDF or CSV file - super useful if you need it for taxes or records.",
      "All your transactions have a status: Pending (still processing), Completed (all done), or Failed (something went wrong). Pending ones usually clear within 24 hours."
    ]
  },

  // Copy Trading
  copytrading: {
    keywords: ['copy trading', 'copy expert', 'expert trader', 'auto trade', 'copy trade'],
    responses: [
      "Copy Trading is awesome! You basically let experienced traders do the trading for you, and you automatically profit from their trades. It's like having a pro working for you 24/7!",
      "We have some really skilled traders on the platform - many with 85-95% win rates. You can check out their performance and decide who you want to follow.",
      "You need at least $1,000 to start copy trading, but then it's hands-off. Just pick a trader and let them work their magic!",
      "Here's the deal: you keep 90% of the profits and we take 10% as a commission. No hidden charges, super transparent!"
    ]
  },

  // Referral Program
  referral: {
    keywords: ['referral', 'refer', 'commission', 'earn', 'invite', 'referral code'],
    responses: [
      "Love free money? Share your referral link with friends and family! You'll earn 10% commission on their first deposit. It's that simple.",
      "Your unique referral link is in Dashboard → Referrals. Just share it, and anyone who signs up through your link becomes your referral. Easy income!",
      "There's no cap on referrals - invite 1 person or 1,000, you'll earn on all of them. The more friends you refer, the more you make!",
      "We also have tier bonuses. Get 10 referrals and unlock Silver status for an extra 2% commission, 50 referrals for Gold (5% extra), and 100+ for Platinum (10% extra)!"
    ]
  },

  // Fees & Charges
  fees: {
    keywords: ['fees', 'charge', 'commission', 'cost', 'expense', 'how much does it cost'],
    responses: [
      "Good news - creating an account is completely free! No sign-up fees, no monthly charges, nothing like that.",
      "Depositing money? Also free! We don't charge anything to add funds to your account.",
      "Withdrawals do have small network fees depending on what currency you're using (Bitcoin, Ethereum, Tether, etc.), but they're pretty minimal.",
      "When you profit from copy trading or investments, we take a small commission. It's transparent and fair - you always know what you're paying.",
      "If you need to convert between currencies, there's a tiny 0.5% fee. But honestly, that's pretty standard in crypto!"
    ]
  },

  // Security
  security: {
    keywords: ['security', 'safe', 'hacking', 'scam', '2fa', 'two factor', 'encrypted'],
    responses: [
      "Your account is seriously secure. We use bank-level encryption and multi-layer security. Your money is protected!",
      "Want extra protection? Turn on Two-Factor Authentication in your Account Settings. It adds another security layer so even if someone gets your password, they can't access your account.",
      "All deposits are kept in separate accounts and insured up to $250,000. Your funds are safe with us!",
      "See something weird in your account? Change your password right away and contact our support team immediately. We take fraud seriously!",
      "We're fully regulated and licensed - we follow all international financial rules. You can trust us with your money!"
    ]
  },

  // Technical & Platform
  technical: {
    keywords: ['app', 'website', 'bug', 'error', 'not working', 'crash', 'slow', 'technical issue', 'problem'],
    responses: [
      "Our mobile app is available on Google Play and Apple App Store - way better experience than the web version, plus you get instant notifications!",
      "Works best on Chrome, Firefox, Safari, or Edge. If you're using an older browser, try updating it - that usually fixes things!",
      "Try clearing your browser cache first - sounds tech-y but it actually solves most issues! If it still doesn't work, try a different browser or hit up support.",
      "Need help urgently? Our support team is here for you - email support@rivertrade.com, use the chat in the app, or call +1-800-RIVER-01!"
    ]
  },

  // KYC & Verification
  kyc: {
    keywords: ['kyc', 'verification', 'verify', 'document', 'id', 'identity', 'aml', 'know your customer'],
    responses: [
      "Yeah, we need to verify your identity - it's called KYC (Know Your Customer) and it's just for security. You'll confirm your email and upload a valid ID.",
      "Just grab your passport or driver's license and a recent utility bill to prove your address. Takes 5 minutes to upload!",
      "Verification usually takes 24 hours. If you're a premium member, we prioritize your verification - you'll be verified even faster!",
      "Don't worry about your info - it's super encrypted and secure. We never, ever sell or share your personal data."
    ]
  },

  // Taxes & Compliance
  tax: {
    keywords: ['tax', 'report', 'irs', 'capital gains', 'compliance', 'legal'],
    responses: [
      "We keep detailed records of everything so you can download a tax report anytime. Just go to Dashboard → Reports and grab what you need.",
      "Profits you make are considered capital gains - you'll probably owe taxes on them. Maybe chat with a tax pro to figure out exactly how much!",
      "If you're in the US and your transactions are over $20,000, we'll send you a 1099 form by January 31st. It's just for tax filing purposes.",
      "We follow all the rules - we're compliant with international financial laws and AML regulations. We're legitimate and regulated!"
    ]
  },

  // Customer Support
  support: {
    keywords: ['support', 'help', 'contact', 'customer service', 'assistance', 'help center'],
    responses: [
      "Need help? Hit up support@rivertrade.com, use the 24/7 live chat in your app, or call +1-800-RIVER-01. We're here for you!",
      "During business hours we usually get back to emails in about 2 hours. Chat support? That's around 24/7 so you can always find someone!",
      "Check out our Help Center - tons of FAQs, guides, and video tutorials. Might have your answer right there!",
      "When you contact support, tell us your account email and what's going on. The more details you give, the faster we can help!"
    ]
  },

  // General Site Info
  general: {
    keywords: ['what is', 'about', 'rivertrade', 'platform', 'how it works', 'who are you', 'company'],
    responses: [
      "Rivertrade is a crypto investment platform - been around since 2020 and helping tons of people make money through crypto. Pretty cool, right?",
      "Our whole thing is making crypto investing accessible to everyone - whether you're a total beginner or a seasoned pro. We're here for all skill levels!",
      "It's simple: Create an account → Add some money → Pick an investment plan that works for you → Watch your money grow → Cash out whenever!",
      "We've got millions of users worldwide across 150+ countries, and we offer support in multiple languages 24/7. You're not alone on this journey!"
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

// AI Context and conversation history
const conversationHistory = [];


async function getAIResponse(query) {
    // Only use AI if API key is set, otherwise fall back to knowledge base
    if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '') {
        return getResponse(query);
    }

    try {
        // Add user message to history
        conversationHistory.push({
            role: "user",
            content: query
        });

        // Keep conversation history manageable (last 10 exchanges)
        if (conversationHistory.length > 20) {
            conversationHistory.shift();
        }

        const systemPrompt = `You are River, a friendly and helpful AI customer support assistant for Rivertrade, a cryptocurrency investment platform. 
Your personality is warm, professional, and conversational - like a real human support agent who genuinely wants to help.
You have extensive knowledge about:
- Account registration and management
- Deposits and withdrawals
- Investment plans and ROI
- Copy trading and referral programs
- Crypto prices and market info
- Platform security and KYC verification
- Fees, taxes, and compliance
- Technical support

Guidelines:
- Be friendly and use casual language
- Use contractions and natural speech patterns
- Ask follow-up questions if you need clarification
- Provide clear, concise answers
- If you're unsure, admit it and suggest contacting support at support@rivertrade.com
- Keep responses conversational, not robotic`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...conversationHistory
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            console.error('OpenAI API error:', response.status);
            return getResponse(query);
        }

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        // Add AI response to history
        conversationHistory.push({
            role: "assistant",
            content: aiReply
        });

        return aiReply;
    } catch (error) {
        console.error('AI error, falling back to knowledge base:', error);
        return getResponse(query);
    }
}

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
        "Hmm, I'm not quite sure about that! Can you try rewording your question? I'm pretty good with stuff like deposits, withdrawals, investments, referrals, and crypto prices!",
        "I can help with pretty much everything - accounts, deposits, withdrawals, investments, trading, referrals, fees, security, and more. What's on your mind?",
        "Hey! Try asking me something like 'How do I deposit?' or 'What's Bitcoin's price?' or 'How does the referral program work?' - I love answering those!",
        "Not sure what to ask? No worries! You can also reach out to our real support team at support@rivertrade.com or use the live chat. They're awesome!"
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
    botMsg.innerHTML = `<div class="bot-icon">R</div><div class="bubble">Thinking...</div>`;
    chatBody.appendChild(botMsg);

    // Get response (check for crypto price first, then AI or knowledge base)
    setTimeout(async () => {
        let reply;
        
        // Check if it's a crypto price query
        if (text.toLowerCase().match(/price|cost|worth|value|bitcoin|ethereum|btc|eth|solana|dogecoin|ripple|cardano|polkadot/i)) {
            const priceReply = await fetchCryptoPrice(text);
            reply = priceReply || await getAIResponse(text);
        } else {
            // Use AI if available, otherwise fall back to knowledge base
            reply = await getAIResponse(text);
        }
        
        botMsg.querySelector('.bubble').innerHTML = reply;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 300);
}