// Enhanced language system with full translations
(function () {
  const STORAGE_KEY = 'site_language';

  // Translation dictionary
  const translations = {
    en: {
      // Dashboard titles
      dashboard: 'Dashboard',
      home: 'Home',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      investmentPlans: 'Investment Plans',
      profitHistory: 'Profit History',
      copyExpert: 'Copy Expert',
      transactions: 'Transactions',
      myInvestments: 'My Investments',
      contactSupport: 'Contact Support',
      // Header
      light: 'Light',
      dark: 'Dark',
      english: 'English',
      spanish: 'Spanish',
      french: 'French',
      german: 'German',
      chinese: 'Chinese',
      // Account
      accountOverview: 'Account Overview',
      helloUser: 'Hello User!',
      availableBalance: 'Available Balance',
      totalInvestment: 'Total Investment',
      activeInvestments: 'Active Investments',
      totalProfit: 'Total Profit',
      // Actions
      logout: 'Logout',
      login: 'Login',
      back: 'Back',
      language: 'Language',
      theme: 'Theme',
      // Messages
      loggedInAs: 'Logged in as',
      version: 'Version',
      loading: 'Loading...'
    },
    es: {
      // Dashboard titles
      dashboard: 'Panel de Control',
      home: 'Inicio',
      deposit: 'Depósito',
      withdraw: 'Retirar',
      investmentPlans: 'Planes de Inversión',
      profitHistory: 'Historial de Ganancias',
      copyExpert: 'Copiar Experto',
      transactions: 'Transacciones',
      myInvestments: 'Mis Inversiones',
      contactSupport: 'Soporte',
      // Header
      light: 'Claro',
      dark: 'Oscuro',
      english: 'Inglés',
      spanish: 'Español',
      french: 'Francés',
      german: 'Alemán',
      chinese: 'Chino',
      // Account
      accountOverview: 'Resumen de Cuenta',
      helloUser: '¡Hola Usuario!',
      availableBalance: 'Saldo Disponible',
      totalInvestment: 'Inversión Total',
      activeInvestments: 'Inversiones Activas',
      totalProfit: 'Ganancia Total',
      // Actions
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      back: 'Atrás',
      language: 'Idioma',
      theme: 'Tema',
      // Messages
      loggedInAs: 'Conectado como',
      version: 'Versión',
      loading: 'Cargando...'
    },
    fr: {
      // Dashboard titles
      dashboard: 'Tableau de Bord',
      home: 'Accueil',
      deposit: 'Dépôt',
      withdraw: 'Retrait',
      investmentPlans: 'Plans d\'Investissement',
      profitHistory: 'Historique des Profits',
      copyExpert: 'Copier Expert',
      transactions: 'Transactions',
      myInvestments: 'Mes Investissements',
      contactSupport: 'Support',
      // Header
      light: 'Clair',
      dark: 'Sombre',
      english: 'Anglais',
      spanish: 'Espagnol',
      french: 'Français',
      german: 'Allemand',
      chinese: 'Chinois',
      // Account
      accountOverview: 'Aperçu du Compte',
      helloUser: 'Bonjour Utilisateur!',
      availableBalance: 'Solde Disponible',
      totalInvestment: 'Investissement Total',
      activeInvestments: 'Investissements Actifs',
      totalProfit: 'Profit Total',
      // Actions
      logout: 'Déconnexion',
      login: 'Connexion',
      back: 'Retour',
      language: 'Langue',
      theme: 'Thème',
      // Messages
      loggedInAs: 'Connecté en tant que',
      version: 'Version',
      loading: 'Chargement...'
    },
    de: {
      // Dashboard titles
      dashboard: 'Dashboard',
      home: 'Startseite',
      deposit: 'Einzahlung',
      withdraw: 'Auszahlung',
      investmentPlans: 'Investitionspläne',
      profitHistory: 'Gewinnverlauf',
      copyExpert: 'Expert kopieren',
      transactions: 'Transaktionen',
      myInvestments: 'Meine Investitionen',
      contactSupport: 'Unterstützung',
      // Header
      light: 'Hell',
      dark: 'Dunkel',
      english: 'Englisch',
      spanish: 'Spanisch',
      french: 'Französisch',
      german: 'Deutsch',
      chinese: 'Chinesisch',
      // Account
      accountOverview: 'Kontoübersicht',
      helloUser: 'Hallo Benutzer!',
      availableBalance: 'Verfügbarer Saldo',
      totalInvestment: 'Gesamtinvestition',
      activeInvestments: 'Aktive Investitionen',
      totalProfit: 'Gesamtgewinn',
      // Actions
      logout: 'Abmelden',
      login: 'Anmelden',
      back: 'Zurück',
      language: 'Sprache',
      theme: 'Design',
      // Messages
      loggedInAs: 'Angemeldet als',
      version: 'Version',
      loading: 'Wird geladen...'
    },
    zh: {
      // Dashboard titles
      dashboard: '仪表板',
      home: '首页',
      deposit: '存款',
      withdraw: '提款',
      investmentPlans: '投资计划',
      profitHistory: '利润历史',
      copyExpert: '复制专家',
      transactions: '交易',
      myInvestments: '我的投资',
      contactSupport: '支持',
      // Header
      light: '浅色',
      dark: '深色',
      english: '英文',
      spanish: '西班牙语',
      french: '法语',
      german: '德语',
      chinese: '中文',
      // Account
      accountOverview: '账户概览',
      helloUser: '你好用户!',
      availableBalance: '可用余额',
      totalInvestment: '总投资',
      activeInvestments: '活跃投资',
      totalProfit: '总利润',
      // Actions
      logout: '登出',
      login: '登录',
      back: '返回',
      language: '语言',
      theme: '主题',
      // Messages
      loggedInAs: '登录为',
      version: '版本',
      loading: '加载中...'
    }
  };

  function setLanguage(lang) {
    if (!translations[lang]) {
      console.warn('Language not supported:', lang);
      return;
    }
    
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(STORAGE_KEY, lang);
    
    // Update all data-translate elements
    updatePageTranslations(lang);
    
    // Emit an event so other scripts can react
    window.dispatchEvent(new CustomEvent('language.changed', { detail: { lang } }));
    console.log('Language set to', lang);
  }

  function getTranslation(lang, key) {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    return key;
  }

  function updatePageTranslations(lang) {
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = getTranslation(lang, key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
        if (element.hasAttribute('placeholder')) {
          element.setAttribute('placeholder', translation);
        } else {
          element.textContent = translation;
        }
      } else {
        element.textContent = translation;
      }
    });
    
    // Update specific sidebar nav items
    updateSidebarLabels(lang);
  }

  function updateSidebarLabels(lang) {
    const navItems = {
      'homeBtn': 'home',
      'depositBtn': 'deposit',
      'withdrawBtn': 'withdraw'
    };
    
    for (const [id, key] of Object.entries(navItems)) {
      const element = document.getElementById(id);
      if (element) {
        const label = element.querySelector('.label');
        if (label) {
          label.textContent = getTranslation(lang, key);
        }
      }
    }
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || document.documentElement.lang || 'en';
    
    // Set the language selector dropdown(s) - handle both desktop and mobile
    const selectors = document.querySelectorAll('[id*="languageSelector"]');
    selectors.forEach(selector => {
      selector.value = saved;
      selector.addEventListener('change', function(e) {
        setLanguage(e.target.value);
        // Update all language selectors when one changes
        selectors.forEach(sel => sel.value = e.target.value);
      });
    });
    
    setLanguage(saved);
  }

  // Expose API
  window.languageSwitcher = {
    setLanguage,
    getLanguage: () => document.documentElement.lang,
    getTranslation: (key) => getTranslation(document.documentElement.lang, key),
    updatePageTranslations
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
