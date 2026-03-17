// ============================================
// BIM App — Authentication
// ============================================

let currentClient = null;
let currentMerchant = null;
let clientRadius = 10;
let favCategories = [];
let favProducts = [];
let notifEnabled = false;

// ============================================
// CLIENT AUTH
// ============================================

function showProfilePanel(panel) {
  ['profile-logged-out', 'profile-register', 'profile-login', 'profile-logged-in'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const map = {
    'out': 'profile-logged-out',
    'register': 'profile-register',
    'login': 'profile-login',
    'in': 'profile-logged-in'
  };
  const target = document.getElementById(map[panel]);
  if (target) target.style.display = panel === 'out' ? 'flex' : 'block';
}

function renderProfileView() {
  if (currentClient) {
    showProfilePanel('in');
    const nameEl = document.getElementById('profile-name-display');
    const emailEl = document.getElementById('profile-email-display');
    if (nameEl) nameEl.textContent = (currentClient.firstName || '') + ' ' + (currentClient.lastName || '');
    if (emailEl) emailEl.textContent = currentClient.email || '';
    // Restore saved preferences
    const radiusSlider = document.getElementById('radius-slider');
    const radiusDisplay = document.getElementById('radius-display');
    if (radiusSlider) radiusSlider.value = clientRadius;
    if (radiusDisplay) radiusDisplay.textContent = clientRadius + ' km';
    renderFavCategories();
  } else {
    showProfilePanel('out');
  }
}

async function registerClient() {
  const firstName = document.getElementById('reg-prenom')?.value.trim();
  const lastName = document.getElementById('reg-nom')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  const errEl = document.getElementById('reg-client-error');

  if (!firstName) { if (errEl) { errEl.textContent = 'Prénom requis'; errEl.style.display = 'block'; } return; }
  if (!email) { if (errEl) { errEl.textContent = 'Email requis'; errEl.style.display = 'block'; } return; }
  if (!password || password.length < 6) { if (errEl) { errEl.textContent = 'Mot de passe : 6 caractères minimum'; errEl.style.display = 'block'; } return; }

  // Supabase Auth
  const { data, error } = await signUp(email, password, { first_name: firstName, last_name: lastName });
  
  if (error) {
    // Fallback localStorage si Supabase pas dispo
    if (error === 'Supabase non connecté' || !supabaseClient) {
      currentClient = { firstName, lastName, email, radius: 10, favCats: [], favProducts: [] };
      localStorage.setItem('bim_current_client', email);
      localStorage.setItem('bim_client_' + email, JSON.stringify(currentClient));
      showToast('✨ Compte créé : ' + firstName);
      renderProfileView();
      return;
    }
    if (errEl) { errEl.textContent = error.message || 'Erreur d\'inscription'; errEl.style.display = 'block'; }
    return;
  }

  currentClient = { firstName, lastName, email, userId: data?.user?.id };
  localStorage.setItem('bim_current_client', email);
  localStorage.setItem('bim_client_' + email, JSON.stringify(currentClient));
  showToast('✨ Bienvenue ' + firstName + ' !');
  renderProfileView();
}

async function loginClient() {
  const email = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const errEl = document.getElementById('login-client-error');

  if (!email || !password) {
    if (errEl) { errEl.textContent = 'Email et mot de passe requis'; errEl.style.display = 'block'; }
    return;
  }

  const { data, error } = await signIn(email, password);

  if (error) {
    // Fallback localStorage
    if (error === 'Supabase non connecté' || !supabaseClient) {
      const saved = localStorage.getItem('bim_client_' + email);
      if (saved) {
        currentClient = JSON.parse(saved);
        localStorage.setItem('bim_current_client', email);
        showToast('👋 Bon retour ' + (currentClient.firstName || '') + ' !');
        renderProfileView();
        return;
      }
      if (errEl) { errEl.textContent = 'Compte introuvable'; errEl.style.display = 'block'; }
      return;
    }
    if (errEl) { errEl.textContent = error.message || 'Erreur de connexion'; errEl.style.display = 'block'; }
    return;
  }

  const saved = localStorage.getItem('bim_client_' + email);
  currentClient = saved ? JSON.parse(saved) : { email, userId: data?.user?.id };
  localStorage.setItem('bim_current_client', email);
  showToast('👋 Bon retour !');
  renderProfileView();
}

function logoutClient() {
  localStorage.removeItem('bim_current_client');
  currentClient = null;
  signOut();
  const dot = document.getElementById('profile-dot');
  if (dot) dot.style.display = 'none';
  renderProfileView();
  showToast('Déconnecté');
}

function loadClientSession() {
  try {
    const email = localStorage.getItem('bim_current_client');
    if (email) {
      const account = JSON.parse(localStorage.getItem('bim_client_' + email));
      if (account) {
        currentClient = account;
        clientRadius = account.radius || 10;
        favCategories = account.favCats || [];
        favProducts = account.favProducts || [];
        const dot = document.getElementById('profile-dot');
        if (dot) dot.style.display = 'block';
      }
    }
  } catch (e) { console.error('Session load error:', e); }
}

// ============================================
// MERCHANT AUTH
// ============================================

function showPanel(name) {
  ['login-choice', 'register-form', 'signin-form'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = name === 'choice' ? 'login-choice' : name + '-form';
  const el = document.getElementById(target);
  if (el) el.style.display = 'flex';
}

function openMerchantSpace() {
  const saved = localStorage.getItem('bim_merchant');
  if (saved) {
    try {
      currentMerchant = JSON.parse(saved);
      showMerchantDashboard();
      return;
    } catch (e) {}
  }
  document.getElementById('merchant-overlay').style.display = 'flex';
  showPanel('choice');
}

function closeMerchantOverlay() {
  document.getElementById('merchant-overlay').style.display = 'none';
}

function getPin(prefix) {
  return [1, 2, 3, 4].map(i => (document.getElementById(prefix + i)?.value || '')).join('');
}

function doRegister() {
  const name = document.getElementById('reg-name')?.value.trim();
  const siret = document.getElementById('reg-siret')?.value.trim();
  const cat = document.getElementById('reg-cat')?.value;
  const pin = getPin('reg-pin-');
  const errEl = document.getElementById('reg-error');

  if (!name) { if (errEl) { errEl.textContent = 'Entrez le nom de votre commerce'; errEl.style.display = 'block'; } return; }
  if (!siret || siret.length !== 14) { if (errEl) { errEl.textContent = 'SIRET invalide (14 chiffres)'; errEl.style.display = 'block'; } return; }
  if (pin.length !== 4) { if (errEl) { errEl.textContent = 'Code PIN de 4 chiffres requis'; errEl.style.display = 'block'; } return; }

  const existing = localStorage.getItem('bim_account_' + siret);
  if (existing) { if (errEl) { errEl.textContent = 'SIRET déjà enregistré'; errEl.style.display = 'block'; } return; }

  if (errEl) errEl.style.display = 'none';

  const account = { name, siret, cat, pin, joinDate: new Date().toLocaleDateString('fr-FR') };
  localStorage.setItem('bim_account_' + siret, JSON.stringify(account));

  currentMerchant = account;
  localStorage.setItem('bim_merchant', JSON.stringify(account));
  closeMerchantOverlay();
  showToast('Compte créé ! Bienvenue ' + name);
  showMerchantDashboard();
}

function doSignIn() {
  const siret = document.getElementById('si-siret')?.value.trim();
  const pin = getPin('si-pin-');
  const errEl = document.getElementById('si-error');

  if (!siret || siret.length !== 14) { if (errEl) { errEl.textContent = 'SIRET invalide'; errEl.style.display = 'block'; } return; }
  if (pin.length !== 4) { if (errEl) { errEl.textContent = 'Code PIN requis'; errEl.style.display = 'block'; } return; }

  const saved = localStorage.getItem('bim_account_' + siret);
  if (!saved) { if (errEl) { errEl.textContent = 'Compte introuvable'; errEl.style.display = 'block'; } return; }

  const account = JSON.parse(saved);
  if (account.pin !== pin) { if (errEl) { errEl.textContent = 'Code PIN incorrect'; errEl.style.display = 'block'; } return; }

  if (errEl) errEl.style.display = 'none';
  currentMerchant = account;
  localStorage.setItem('bim_merchant', JSON.stringify(account));
  closeMerchantOverlay();
  showToast('Bienvenue ' + account.name + ' !');
  showMerchantDashboard();
}

function doMerchantLogin() { doSignIn(); }

function logoutMerchant() {
  localStorage.removeItem('bim_merchant');
  currentMerchant = null;
  const dash = document.getElementById('merchant-dashboard');
  if (dash) dash.style.display = 'none';
}

// ============================================
// PREFERENCES
// ============================================

function updateRadius(val) {
  clientRadius = parseInt(val);
  const display = document.getElementById('radius-display');
  if (display) display.textContent = clientRadius + ' km';
  saveClientPrefs();
}

function setRadius(val) {
  clientRadius = val;
  const slider = document.getElementById('radius-slider');
  const display = document.getElementById('radius-display');
  if (slider) slider.value = val;
  if (display) display.textContent = val + ' km';
  saveClientPrefs();
}

function toggleFavCat(btn, cat) {
  const idx = favCategories.indexOf(cat);
  if (idx === -1) {
    favCategories.push(cat);
    btn.style.boxShadow = '0 0 0 2px #f97316';
    btn.style.opacity = '1';
  } else {
    favCategories.splice(idx, 1);
    btn.style.boxShadow = 'none';
    btn.style.opacity = '0.6';
  }
  saveClientPrefs();
}

function renderFavCategories() {
  document.querySelectorAll('.fav-cat-btn').forEach(btn => {
    const cat = btn.getAttribute('data-cat');
    if (favCategories.includes(cat)) {
      btn.style.boxShadow = '0 0 0 2px #f97316';
      btn.style.opacity = '1';
    } else {
      btn.style.boxShadow = 'none';
      btn.style.opacity = '0.6';
    }
  });
}

function saveClientPrefs() {
  if (!currentClient) return;
  currentClient.radius = clientRadius;
  currentClient.favCats = favCategories;
  currentClient.favProducts = favProducts;
  localStorage.setItem('bim_client_' + currentClient.email, JSON.stringify(currentClient));
}

// Aliases for HTML onclick handlers
function doClientRegister() { registerClient(); }
function doClientLogin() { loginClient(); }
