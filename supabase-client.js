// ============================================
// BIM App — Main Application
// ============================================

let DEALS = [];
let currentDeal = null;
let currentCat = 'all';
let dismissed = [];
let userLocation = null;
let deferredInstallPrompt = null;

// ---- INIT ----

function initApp() {
  // 1. Charger les deals
  if (CONFIG.DEMO_MODE) {
    DEALS = [...DEMO_DEALS];
  }
  loadDealsFromStorage();

  // 2. Restaurer la session utilisateur
  loadClientSession();

  // 3. Afficher le feed
  renderDeal();

  // 4. Supabase (async, non bloquant)
  setTimeout(initSupabase, 500);

  // 5. Service Worker (PWA)
  registerServiceWorker();

  // 6. Écouter l'événement d'installation
  listenInstallPrompt();

  // 7. Géolocalisation (silencieux)
  requestGeolocation();

  // 8. Splash screen
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => splash.style.display = 'none', 600);
    }
    // Bandeau d'installation après le splash
    setTimeout(showInstallBanner, 2000);
  }, 2500);
}

// ---- SERVICE WORKER ----

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch(err => console.log('SW error:', err));
  }
}

// ---- INSTALL PROMPT (PWA) ----

function listenInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
}

function showInstallBanner() {
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (sessionStorage.getItem('bim_install_dismissed')) return;

  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.style.cssText = 'position:fixed;bottom:70px;left:12px;right:12px;background:linear-gradient(135deg,#1e293b,#0f172a);border:1px solid #f97316;border-radius:18px;padding:16px;z-index:400;display:flex;align-items:center;gap:14px;box-shadow:0 8px 32px rgba(0,0,0,0.6);animation:bounce 0.3s ease';
  banner.innerHTML = '<img src="logo.png" style="width:48px;height:48px;border-radius:12px;flex-shrink:0" />'
    + '<div style="flex:1"><p style="font-weight:900;font-size:14px;color:white;margin:0 0 2px">Installer BIM</p>'
    + '<p style="font-size:12px;color:#94a3b8;margin:0">Accès rapide depuis votre écran d\'accueil</p></div>'
    + '<button id="install-btn" style="background:#f97316;color:white;border:none;border-radius:12px;padding:10px 16px;font-weight:900;font-size:13px;cursor:pointer;font-family:Montserrat,sans-serif;white-space:nowrap">Installer</button>'
    + '<button id="install-dismiss" style="background:none;border:none;color:#475569;font-size:18px;cursor:pointer;padding:4px">✕</button>';

  document.body.appendChild(banner);

  document.getElementById('install-btn').addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      if (result.outcome === 'accepted') showToast('✅ BIM installé !');
      deferredInstallPrompt = null;
    } else {
      showToast('📱 Partager → Ajouter à l\'écran d\'accueil');
    }
    banner.remove();
  });

  document.getElementById('install-dismiss').addEventListener('click', () => {
    banner.remove();
    sessionStorage.setItem('bim_install_dismissed', '1');
  });
}

// ---- GÉOLOCALISATION ----

function requestGeolocation() {
  if (!('geolocation' in navigator)) return;
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      console.log('📍 Position:', userLocation.lat.toFixed(4), userLocation.lng.toFixed(4));
      if (!CONFIG.DEMO_MODE && supabaseClient) loadNearbyDeals();
    },
    () => {
      userLocation = { lat: CONFIG.DEFAULT_LAT, lng: CONFIG.DEFAULT_LNG };
    },
    { enableHighAccuracy: false, timeout: 8000 }
  );
}

async function loadNearbyDeals() {
  if (!supabaseClient || !userLocation) return;
  try {
    const { data, error } = await supabaseClient.rpc('nearby_deals', {
      user_lat: userLocation.lat,
      user_lng: userLocation.lng,
      radius_km: clientRadius || CONFIG.DEFAULT_RADIUS_KM
    });
    if (error) { console.error('Nearby deals error:', error); return; }
    if (data && data.length > 0) {
      data.forEach(row => {
        if (!DEALS.find(d => d.id === row.deal_id)) {
          DEALS.push({
            id: row.deal_id, name: row.deal_name, merchant: row.merchant_name,
            cat: row.category, price: parseFloat(row.flash_price),
            orig: parseFloat(row.original_price), discount: row.discount,
            bg: row.photo || '', photo: '', badge: 'FLASH', badgeColor: '#F97316',
            co2: 0.3, origin: 'Local', expiry: formatExpiry(row.expires),
            timer: formatTimer(row.expires), desc: '', weight: '', ai: null,
          });
        }
      });
      renderDeal();
    }
  } catch (e) { console.error('Nearby deals error:', e); }
}

// ---- DEALS FROM STORAGE ----

function loadDealsFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem('bim_deals')) || [];
    saved.forEach(d => {
      if (!DEALS.find(x => x.id === d.id)) DEALS.unshift(d);
    });
  } catch (e) {}
}

// ---- NAVIGATION ----

function showTab(tab) {
  if (tab === 'merchant') { openMerchantSpace(); return; }

  ['feed', 'live', 'bimride', 'b2b', 'cart', 'profile'].forEach(t => {
    const v = document.getElementById('view-' + t);
    const n = document.getElementById('nav-' + t);
    if (v) v.style.display = 'none';
    if (n) n.classList.remove('active');
  });

  const navMerchant = document.getElementById('nav-merchant');
  if (navMerchant) navMerchant.classList.remove('active');

  const viewEl = document.getElementById('view-' + tab);
  if (viewEl) viewEl.style.display = 'block';
  const navEl = document.getElementById('nav-' + tab);
  if (navEl) navEl.classList.add('active');

  updateCartBadge();

  if (tab === 'cart') renderCart();
  else if (tab === 'profile') renderProfileView();
  else if (tab === 'bimride') setTimeout(() => { initRideMap(); renderRunnersList(); }, 150);
}

// ---- TOAST ----

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1500);
}

// ---- SWIPE ----

let touchStartX = 0;
function touchStart(e) { touchStartX = e.changedTouches[0].screenX; }
function touchEnd(e) {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (diff > 80) addCurrentToCart();
  else if (diff < -80) nextDeal();
}

// ---- LAUNCH (B2B) ----

function launch(btnId) {
  const b = document.getElementById(btnId);
  if (!b) return;
  b.textContent = '✅ Lancé';
  b.style.background = '#10b981';
  showToast('⚡ Offre lancée !');
  setTimeout(() => { b.textContent = '⚡ Lancer'; b.style.background = '#f97316'; }, 2000);
}

// ---- BID (Live) ----

function bid(priceId, bidsId) {
  const p = document.getElementById(priceId);
  const b = document.getElementById(bidsId);
  if (p) p.textContent = (parseInt(p.textContent) + 5) + '€';
  if (b) b.textContent = (parseInt(b.textContent) + 1) + ' mises';
  showToast('💰 Mise enregistrée !');
}

// ---- START ----

document.addEventListener('DOMContentLoaded', initApp);
