const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// ============ Real-time reCAPTCHA Verification ============
async function verifyRecaptcha() {
  try {
    if (!window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return false;
    }

    // Use production or test key from window variable
    const siteKey = window.recaptchaSiteKey || 'YOUR_PRODUCTION_SITE_KEY_HERE';
    const token = await window.grecaptcha.execute(siteKey, { action: 'submit' });

    // Send token to backend for verification
    const response = await fetch('/api/verify-captcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    const data = await response.json();
    return data.success;
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    return false;
  }
}

// ============ Register/Login Handler Updates ============

registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
});

loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
});

// Registration handler: validate, save a simple user record in localStorage (dev only), and redirect to dashboard
// Registration handler using AuthService
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('registerMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const pass = document.getElementById("regPassword").value;
    const confirm = document.getElementById("confirmPassword").value;
    
    if (pass !== confirm) {
        if (msgEl) msgEl.textContent = 'Passwords do not match.';
        return;
    }

    // Verify reCAPTCHA before registering
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verifying...'; }
    const captchaValid = await verifyRecaptcha();
    
    if (!captchaValid) {
        if (msgEl) msgEl.textContent = 'reCAPTCHA verification failed. Please try again.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Register'; }
        return;
    }

    // Collect form values
    const user = {
        firstName: document.getElementById('regFirstName')?.value.trim() || '',
        lastName: document.getElementById('regLastName')?.value.trim() || '',
        email: document.getElementById('regEmail')?.value.trim() || '',
        country: document.getElementById('regCountry')?.value.trim() || '',
        countryCode: document.getElementById('regCountryCode')?.value.trim() || '',
        phone: document.getElementById('regPhone')?.value.trim() || '',
        currency: document.getElementById('regCurrency')?.value || '',
        wantsBonus: document.getElementById('bonus')?.checked || false,
        createdAt: new Date().toISOString()
    };

    if (!user.email) {
        if (msgEl) msgEl.textContent = 'Please provide an email address.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Register'; }
        return;
    }

    if (submitBtn) { submitBtn.textContent = 'Registering...'; }
    if (msgEl) { msgEl.textContent = ''; }
    try {
        // Use global AuthService (dev mock) — if you later wire to real API, replace this call
        const res = await window.AuthService.register(user, pass);
        if (msgEl) msgEl.textContent = 'Registration successful — redirecting to dashboard...';
        // small delay so user sees message
        setTimeout(() => window.location.href = 'dashboard.html', 700);
    } catch (err) {
        console.error('Registration failed', err);
        if (msgEl) msgEl.textContent = (err && err.message) ? err.message : 'Registration failed';
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Register'; }
    }
});

// Basic login handler that uses AuthService
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginForm input[type="email"]')?.value.trim() || '';
    const password = document.querySelector('#loginForm input[type="password"]')?.value || '';
    const btn = e.target.querySelector('button[type="submit"]');
    const msg = document.getElementById('registerMessage');
    
    if (!email || !password) { 
        if (msg) msg.textContent = 'Please provide email and password.'; 
        return; 
    }
    
    // Verify reCAPTCHA before login
    if (btn) { btn.disabled = true; btn.textContent = 'Verifying...'; }
    const captchaValid = await verifyRecaptcha();
    
    if (!captchaValid) {
        if (msg) msg.textContent = 'reCAPTCHA verification failed. Please try again.';
        if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
        return;
    }
    
    if (btn) { btn.textContent = 'Signing in...'; }
    try {
        await window.AuthService.login(email, password);
        window.location.href = 'dashboard.html';
    } catch (err) {
        if (msg) msg.textContent = (err && err.message) ? err.message : 'Login failed';
    } finally { if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; } }
});

// Activate tab from URL hash (e.g. auth.html#login or auth.html#register)
(function () {
    function activateFromHash() {
        const hash = (location.hash || "").replace('#', '').toLowerCase();
        if (hash === 'login') {
            // Use the same click behavior to ensure classes are toggled
            loginTab.click();
        } else if (hash === 'register') {
            registerTab.click();
        }
    }

    // If script is loaded after DOM (it is, since auth.html includes it at bottom), run once
    try {
        activateFromHash();
    } catch (err) {
        // If elements aren't present yet, listen for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', activateFromHash);
    }

    // Also react if the hash changes while the page is open
    window.addEventListener('hashchange', activateFromHash);
})();

// reCAPTCHA key resolver: supports production key, local dev test key, and forced dev via query/localStorage
(function () {
    const TEST_SITEKEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    const localHosts = ['localhost', '127.0.0.1', '::1'];
    const recaptchaEl = document.querySelector('.captcha-container .g-recaptcha');
    if (!recaptchaEl) return;

    // Read keys from DOM attributes
    const attrSiteKey = recaptchaEl.getAttribute('data-sitekey') || '';
    const prodKey = (recaptchaEl.getAttribute('data-prod-sitekey') || '').trim();

    // Support forcing dev mode via query param or localStorage
    const params = new URLSearchParams(window.location.search);
    const paramForceDev = params.get('recaptcha_dev') === '1';
    if (paramForceDev) localStorage.setItem('recaptchaDev', '1');
    const lsForceDev = localStorage.getItem('recaptchaDev') === '1';

    const isLocalHost = localHosts.includes(location.hostname) || location.protocol === 'file:';
    const isDevMode = paramForceDev || lsForceDev || isLocalHost;

    // Determine which key to use: dev -> TEST_SITEKEY, else prodKey if provided, else attrSiteKey
    const chosenKey = isDevMode ? TEST_SITEKEY : (prodKey || attrSiteKey);

    const currentKey = recaptchaEl.getAttribute('data-sitekey') || '';
    if (chosenKey && currentKey !== chosenKey) {
        if (!recaptchaEl.id) recaptchaEl.id = 'g-recaptcha-' + Math.random().toString(36).slice(2, 9);
        recaptchaEl.setAttribute('data-sitekey', chosenKey);

        function renderNow() {
            try {
                if (window.grecaptcha && typeof grecaptcha.render === 'function') {
                    recaptchaEl.innerHTML = '';
                    grecaptcha.render(recaptchaEl.id, { sitekey: chosenKey });
                }
            } catch (e) {
                // ignore
            }
        }

        if (window.grecaptcha && typeof grecaptcha.render === 'function') {
            renderNow();
        } else {
            window.addEventListener('load', function () { setTimeout(renderNow, 300); });
            setTimeout(renderNow, 800);
        }
    }

    // (dev banner removed) — the script will still switch keys in dev mode but no banner is shown
})();