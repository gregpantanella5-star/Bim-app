// ============================================
// BIM App — Deals (Feed)
// ============================================

function getDeals() {
  return DEALS.filter(d => (currentCat === 'all' || d.cat === currentCat) && !dismissed.includes(d.id));
}

function renderDeal() {
  const deals = getDeals();
  const container = document.getElementById('deal-container');
  if (!container) return;

  if (!deals.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#64748b">
        <div style="font-size:48px;margin-bottom:16px">⚡</div>
        <p style="font-size:16px;font-weight:700">Plus de deals</p>
        <button onclick="dismissed=[];renderDeal()" style="color:#f97316;background:none;border:none;font-size:14px;margin-top:8px;cursor:pointer;text-decoration:underline;font-family:Montserrat,sans-serif">Tout revoir</button>
      </div>`;
    currentDeal = null;
    return;
  }

  const d = deals[0];
  currentDeal = d;

  container.innerHTML = `
    <div class="deal-card-new" ontouchstart="touchStart(event)" ontouchend="touchEnd(event)">
      <!-- PHOTO -->
      <div style="width:100%;height:200px;overflow:hidden;border-radius:20px 20px 0 0;position:relative;background:#1e293b">
        <img src="${d.bg}" alt="${d.name}" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy" />
        <div style="position:absolute;top:12px;right:12px;background:#f97316;color:white;font-size:22px;font-weight:900;padding:8px 14px;border-radius:14px;line-height:1;box-shadow:0 4px 12px rgba(249,115,22,0.5)">
          -${d.discount}%
        </div>
        <div style="position:absolute;top:12px;left:12px;background:${d.badgeColor};color:white;font-size:10px;font-weight:900;padding:5px 10px;border-radius:8px;letter-spacing:1px">
          ${d.badge}
        </div>
      </div>

      <!-- INFOS -->
      <div style="background:#1e293b;border-radius:0 0 20px 20px;padding:14px 16px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="display:flex;align-items:center;gap:6px">
            <div style="width:28px;height:28px;border-radius:8px;overflow:hidden;flex-shrink:0">
              <img src="${d.photo}" style="width:100%;height:100%;object-fit:cover" />
            </div>
            <span style="font-size:12px;font-weight:700;color:#94a3b8">${d.merchant}</span>
            <span style="font-size:11px;color:#34d399;font-weight:700">📍${d.origin}</span>
          </div>
          <span style="font-size:11px;font-weight:700;color:#fcd34d;background:rgba(0,0,0,0.3);padding:3px 8px;border-radius:6px">⏱ ${d.timer}</span>
        </div>

        <h2 style="font-size:19px;font-weight:900;color:white;margin-bottom:4px;line-height:1.2">${d.name}</h2>
        <p style="font-size:12px;color:#64748b;margin-bottom:10px">${d.desc || ''} ${d.weight ? '· ' + d.weight : ''}</p>

        ${d.ai ? `<div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:8px 12px;margin-bottom:10px;font-size:11px;color:#6ee7b7;font-weight:600">🤖 ${d.ai}</div>` : ''}

        <div style="display:flex;align-items:flex-end;justify-content:space-between">
          <div>
            <span style="font-size:13px;color:#64748b;text-decoration:line-through">${d.orig.toFixed(2)}€</span>
            <div style="font-size:32px;font-weight:900;color:#34d399;line-height:1">${d.price.toFixed(2)}€</div>
            <span style="font-size:11px;color:#6ee7b7;font-weight:700">Économisez ${(d.orig - d.price).toFixed(2)}€</span>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">🌿 -${d.co2}kg CO₂</div>
            <button onclick="addCurrentToCart()" style="background:#f97316;color:white;border:none;border-radius:14px;padding:12px 18px;font-weight:900;font-size:13px;cursor:pointer;font-family:Montserrat,sans-serif;box-shadow:0 4px 16px rgba(249,115,22,0.4)">🛒 Ajouter</button>
          </div>
        </div>
      </div>
    </div>`;
}

function nextDeal() {
  if (currentDeal) dismissed.push(currentDeal.id);
  renderDeal();
}

function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  dismissed = [];
  renderDeal();
}

// Détection catégorie depuis texte (pour la création d'offre vocale)
function detectCategory(text) {
  const t = text.toLowerCase();
  const cats = {
    viande: ['boeuf','veau','agneau','porc','poulet','dinde','canard','steak','cote','filet','saucisse','jambon','viande'],
    cave: ['vin','rouge','blanc','rose','champagne','biere','cidre','alcool','cave','bouteille'],
    primeur: ['tomate','salade','carotte','courgette','aubergine','concombre','fruit','legume','primeur','pomme','poire','fraise','melon'],
    laitier: ['fromage','beurre','creme','yaourt','lait','camembert','comte','mozzarella','laitier'],
    poisson: ['poisson','saumon','thon','daurade','sole','crevette','moule','sardine','maquereau'],
    pret: ['sushi','pizza','plat','sandwich','repas','cuisine','traiteur','bento','wrap','burger']
  };
  for (const [cat, keywords] of Object.entries(cats)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return cat;
    }
  }
  return 'pret';
}
