// ============================================
// BIM App — Cart (Panier)
// ============================================

let cart = [];

function addToCart(id) {
  const deal = DEALS.find(d => d.id === id);
  if (!deal) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...deal, qty: 1 });
  updateCartBadge();
  showToast('🛒 Ajouté au panier !');
}

function addCurrentToCart() {
  if (!currentDeal) return;
  addToCart(currentDeal.id);
  dismissed.push(currentDeal.id);
  renderDeal();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
  updateCheckoutBar();
  showToast('Produit retiré du panier');
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
  updateCheckoutBar();
}

function updateCartBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  ['cart-badge', 'nav-cart-badge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = count; el.style.display = count > 0 ? 'flex' : 'none'; }
  });
}

function goToDeals() { showTab('feed'); }

function renderCart() {
  const el = document.getElementById('cart-content');
  if (!el) return;

  if (!cart.length) {
    el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;padding:60px 24px;text-align:center">
      <div style="font-size:72px;margin-bottom:16px">🛒</div>
      <h3 style="font-size:20px;font-weight:900;margin-bottom:8px">Panier vide</h3>
      <p style="color:#64748b;font-size:14px;margin-bottom:28px">Swipez les deals pour ajouter</p>
      <button onclick="goToDeals()" style="padding:14px 28px;background:#f97316;color:white;border:none;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer;font-family:Montserrat,sans-serif">⚡ Voir les deals</button>
    </div>`;
    updateCheckoutBar();
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalOrig = cart.reduce((s, i) => s + (i.orig || i.price) * i.qty, 0);
  const saved = Math.max(0, totalOrig - total);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  let html = '<div style="padding:16px 16px 140px">';

  // Header
  html += `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
    <div><h2 style="font-size:20px;font-weight:900;margin:0">Mon Panier</h2>
    <p style="font-size:12px;color:#64748b;margin:3px 0 0">${itemCount} article${itemCount > 1 ? 's' : ''} · ${cart.length} produit${cart.length > 1 ? 's' : ''}</p></div>
    <button onclick="cart=[];updateCartBadge();renderCart();" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:8px 12px;color:#ef4444;font-size:12px;font-weight:700;cursor:pointer;font-family:Montserrat,sans-serif">🗑 Vider</button>
  </div>`;

  // Savings
  if (saved > 0) {
    html += `<div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:16px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div><p style="font-size:10px;color:#6ee7b7;font-weight:700;margin:0 0 3px">ÉCONOMIES FLASH</p><p style="font-size:22px;font-weight:900;color:#34d399;margin:0">-${saved.toFixed(2)}€</p></div>
      <div style="text-align:right"><p style="font-size:10px;color:#6ee7b7;font-weight:700;margin:0 0 3px">CO₂ ÉCONOMISÉ</p><p style="font-size:16px;font-weight:900;color:#34d399;margin:0">🌿 ${(cart.length * 0.3).toFixed(1)}kg</p></div>
    </div>`;
  }

  // Items
  cart.forEach(item => {
    const lineTotal = (item.price * item.qty).toFixed(2);
    const lineOrig = ((item.orig || item.price) * item.qty).toFixed(2);
    const photo = item.bg || item.photo || '';
    const disc = item.discount || 0;

    html += `<div style="background:#1e293b;border:1px solid #334155;border-radius:20px;overflow:hidden;margin-bottom:12px">
      <div style="position:relative;height:150px;overflow:hidden;background:#0f172a">
        ${photo ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover" />` : ''}
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.97) 0%,rgba(15,23,42,0.1) 60%)"></div>
        ${disc > 0 ? `<div style="position:absolute;top:10px;left:12px;background:#f97316;color:white;font-size:12px;font-weight:900;padding:4px 10px;border-radius:8px">-${disc}%</div>` : ''}
        <div style="position:absolute;bottom:10px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:flex-end">
          <div style="flex:1;padding-right:8px"><p style="font-size:16px;font-weight:900;color:white;margin:0;line-height:1.3">${item.name}</p>
          <p style="font-size:11px;color:#94a3b8;margin:3px 0 0">${item.merchant || ''} ${item.weight ? '· ' + item.weight : ''}</p></div>
          <div style="text-align:right;flex-shrink:0">
            ${disc > 0 ? `<p style="font-size:12px;color:#64748b;text-decoration:line-through;margin:0">${lineOrig}€</p>` : ''}
            <p style="font-size:22px;font-weight:900;color:#34d399;margin:0;line-height:1.2">${lineTotal}€</p>
          </div>
        </div>
      </div>
      <div style="padding:12px 14px;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:#64748b;font-weight:600">Qté :</span>
          <button onclick="updateQty('${item.id}',-1)" style="width:36px;height:36px;border-radius:50%;background:#0f172a;border:1px solid #475569;color:white;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
          <span style="font-size:18px;font-weight:900;min-width:28px;text-align:center">${item.qty}</span>
          <button onclick="updateQty('${item.id}',1)" style="width:36px;height:36px;border-radius:50%;background:#f97316;border:none;color:white;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
        </div>
        <button onclick="removeFromCart('${item.id}')" style="padding:8px 14px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;color:#ef4444;font-size:12px;font-weight:700;cursor:pointer;font-family:Montserrat,sans-serif">🗑 Supprimer</button>
      </div>
    </div>`;
  });

  // Summary
  html += `<div style="background:#1e293b;border:1px solid #334155;border-radius:20px;padding:18px;margin-top:4px">
    <p style="font-size:11px;color:#64748b;font-weight:700;letter-spacing:0.5px;margin:0 0 14px">RÉCAPITULATIF</p>
    <div style="display:flex;justify-content:space-between;margin-bottom:10px"><span style="color:#94a3b8;font-size:14px">Sous-total</span><span style="font-weight:700">${totalOrig.toFixed(2)}€</span></div>
    ${saved > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:10px"><span style="color:#34d399;font-size:14px">Remises flash</span><span style="font-weight:700;color:#34d399">-${saved.toFixed(2)}€</span></div>` : ''}
    <div style="display:flex;justify-content:space-between;margin-bottom:14px"><span style="color:#94a3b8;font-size:14px">🚗 Livraison BIM-Ride</span><span style="font-weight:700;color:#34d399">Gratuit 🌿</span></div>
    <div style="height:1px;background:#334155;margin-bottom:14px"></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:17px;font-weight:900">Total</span><span style="font-size:28px;font-weight:900;color:#34d399">${total.toFixed(2)}€</span></div>
  </div></div>`;

  el.innerHTML = html;
  updateCheckoutBar();
}

function updateCheckoutBar() {
  const bar = document.getElementById('cart-checkout-bar');
  const totalEl = document.getElementById('checkout-total');
  if (!bar) return;
  if (cart.length > 0) {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    bar.style.display = 'block';
    if (totalEl) totalEl.textContent = total.toFixed(2) + '€';
  } else {
    bar.style.display = 'none';
  }
}

function order() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  showPaymentModal(total, itemCount);
}

// ---- PAYMENT MODAL ----
// TODO: Remplacer par Stripe Checkout en Phase 2

function showPaymentModal(total, itemCount) {
  const existing = document.getElementById('payment-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'payment-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:600;display:flex;align-items:flex-end;justify-content:center';

  const s = itemCount + ' article' + (itemCount > 1 ? 's' : '');

  modal.innerHTML = `
    <div style="background:#0f172a;border-radius:28px 28px 0 0;padding:28px 20px 40px;width:100%;max-width:480px">
      <div style="width:40px;height:4px;background:#334155;border-radius:2px;margin:0 auto 24px"></div>
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:48px;margin-bottom:12px">💳</div>
        <h2 style="font-size:22px;font-weight:900;margin-bottom:6px">Paiement sécurisé</h2>
        <p style="color:#64748b;font-size:13px">${s} · <strong style="color:white">${total.toFixed(2)}€</strong></p>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
        <button id="pay-card" style="padding:16px;background:#1e293b;border:2px solid #334155;border-radius:16px;color:white;font-size:15px;font-weight:700;cursor:pointer;font-family:Montserrat,sans-serif;display:flex;align-items:center;gap:14px"><span style="font-size:24px">💳</span><span>Carte bancaire</span></button>
        <button id="pay-apple" style="padding:16px;background:#1e293b;border:2px solid #334155;border-radius:16px;color:white;font-size:15px;font-weight:700;cursor:pointer;font-family:Montserrat,sans-serif;display:flex;align-items:center;gap:14px"><span style="font-size:24px">🍎</span><span>Apple Pay</span></button>
      </div>
      <button id="pay-cancel" style="width:100%;padding:14px;background:none;border:1px solid #334155;border-radius:14px;color:#64748b;font-size:14px;cursor:pointer;font-family:Montserrat,sans-serif">Annuler</button>
    </div>`;

  document.body.appendChild(modal);
  document.getElementById('pay-cancel').onclick = () => modal.remove();
  document.getElementById('pay-card').onclick = () => doPayment(modal, 'Carte bancaire', total);
  document.getElementById('pay-apple').onclick = () => doPayment(modal, 'Apple Pay', total);
}

function doPayment(modal, method, total) {
  const orderNum = '#BIM-' + Math.floor(Math.random() * 90000 + 10000);

  modal.querySelector('div').innerHTML = `
    <div style="width:40px;height:4px;background:#334155;border-radius:2px;margin:0 auto 28px"></div>
    <div style="text-align:center;padding:0 10px 20px">
      <div style="width:80px;height:80px;background:rgba(16,185,129,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px">✅</div>
      <h2 style="font-size:22px;font-weight:900;margin-bottom:8px">Commande confirmée !</h2>
      <p style="color:#64748b;font-size:13px;margin-bottom:20px">Paiement par ${method} accepté</p>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:16px;margin-bottom:16px;text-align:left">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px"><span style="color:#64748b;font-size:13px">Commande</span><span style="font-weight:900;color:#f97316">${orderNum}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:10px"><span style="color:#64748b;font-size:13px">Montant</span><span style="font-weight:900;color:#34d399">${total.toFixed(2)}€</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:#64748b;font-size:13px">Livraison</span><span style="font-weight:900;color:#34d399">BIM-Ride 🌿</span></div>
      </div>
      <button id="track-btn" style="width:100%;padding:16px;background:linear-gradient(135deg,#f97316,#ea580c);color:white;border:none;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer;font-family:Montserrat,sans-serif;box-shadow:0 6px 20px rgba(249,115,22,0.35)">🚗 Suivre ma livraison</button>
    </div>`;

  document.getElementById('track-btn').onclick = () => {
    modal.remove();
    cart = [];
    updateCartBadge();
    renderCart();
    showTab('bimride');
    showToast('BIM-Runner en route !');
  };
}
