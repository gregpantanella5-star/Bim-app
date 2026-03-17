// ============================================
// BIM App — Notifications
// ============================================

// TODO Phase 3 : Remplacer ntfy.sh par Firebase Cloud Messaging

function toggleNotifications() {
  if (!('Notification' in window)) {
    showToast('Notifications non supportées');
    return;
  }

  if (Notification.permission === 'granted') {
    notifEnabled = !notifEnabled;
    updateNotifUI();
    if (notifEnabled) startDealMonitor();
    saveClientPrefs();
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      notifEnabled = true;
      updateNotifUI();
      startDealMonitor();
      saveClientPrefs();
      showToast('🔔 Notifications activées !');
    } else {
      showToast('Notifications refusées');
    }
  });
}

function updateNotifUI() {
  const btn = document.getElementById('notif-toggle-btn');
  const bar = document.getElementById('notif-status-bar');
  if (btn) {
    btn.textContent = notifEnabled ? 'Désactiver' : 'Activer';
    btn.style.background = notifEnabled ? '#1e293b' : '#f97316';
  }
  if (bar) {
    bar.style.display = notifEnabled ? 'flex' : 'none';
  }
}

function sendBimNotif(title, body, url) {
  if (!notifEnabled || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon: 'logo.png',
      badge: 'logo.png',
      tag: 'bim-deal-' + Date.now(),
      data: { url }
    });
  } catch (e) {
    console.log('Notif error:', e);
  }
}

function startDealMonitor() {
  // Simuler des notifications de démo
  if (!CONFIG.DEMO_MODE) return;

  const demoNotifs = [
    { title: '🥩 Entrecôte -60% à Fayence !', body: 'Boucherie Martin: 2.5kg · Flash 24h · 18€', cat: 'viande' },
    { title: '🥦 Tomates Bio -50% près de chez vous', body: 'Primeurs du Var: 5kg · Seulement 8€', cat: 'primeur' },
    { title: '🍷 Rosé Provence -40% ce soir', body: 'Cave de Fayence: 6 bouteilles · 24€', cat: 'cave' },
  ];

  // Envoyer une notif de démo après 30s
  setTimeout(() => {
    if (!notifEnabled) return;
    const notif = demoNotifs[Math.floor(Math.random() * demoNotifs.length)];
    if (favCategories.length === 0 || favCategories.includes(notif.cat)) {
      sendBimNotif(notif.title, notif.body, CONFIG.APP_URL);
    }
  }, 30000);
}

// In-app alert quand un deal arrive en temps réel
function showInAppAlert(deal) {
  const existing = document.getElementById('in-app-alert');
  if (existing) existing.remove();

  const catEmoji = CONFIG.CATEGORIES[deal.cat]?.emoji || '⚡';
  const alert = document.createElement('div');
  alert.id = 'in-app-alert';
  alert.style.cssText = 'position:fixed;top:16px;left:16px;right:16px;background:#1e293b;border:1px solid #f97316;border-radius:16px;padding:14px 16px;z-index:500;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);animation:slideDown 0.3s ease';
  alert.innerHTML = `
    <span style="font-size:28px">${catEmoji}</span>
    <div style="flex:1">
      <p style="font-size:13px;font-weight:900;color:white;margin:0">${deal.name}</p>
      <p style="font-size:12px;color:#94a3b8;margin:2px 0 0">${deal.merchant} · -${deal.discount}% · ${deal.price.toFixed(2)}€</p>
    </div>
    <button onclick="this.parentElement.remove();showTab('feed')" style="background:#f97316;color:white;border:none;border-radius:10px;padding:8px 14px;font-weight:700;font-size:12px;cursor:pointer;font-family:Montserrat,sans-serif">Voir</button>`;

  document.body.appendChild(alert);
  setTimeout(() => { if (alert.parentElement) alert.remove(); }, 5000);
}
