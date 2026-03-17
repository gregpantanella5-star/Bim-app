/* BIM App — Styles */


    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: 'Montserrat', sans-serif; color: white; max-width: 430px; margin: 0 auto; min-height: 100vh; position: relative; }

    /* HEADER */
    .header { display: flex; align-items: center; justify-content: space-between; padding: 16px; }
    .logo-area { display: flex; align-items: center; gap: 10px; }
    .logo { width: 48px; height: 48px; border-radius: 50%; }
    .logo-text h1 { font-size: 20px; font-weight: 900; }
    .logo-text p { font-size: 9px; color: #64748b; font-weight: 700; letter-spacing: 2px; }
    .header-icons { display: flex; gap: 8px; }
    .icon-btn { width: 36px; height: 36px; background: #1e293b; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; font-size: 16px; }

    /* TABS */
    .tabs { display: flex; gap: 12px; padding: 8px 16px; overflow-x: auto; }
    .tab { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; }
    .tab-circle { width: 56px; height: 56px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; transition: all 0.2s; }
    .tab.active .tab-circle { background: rgba(249,115,22,0.2); box-shadow: 0 0 0 2px #f97316; transform: scale(1.1); }
    .tab span { font-size: 10px; font-weight: 700; color: #64748b; }
    .tab.active span { color: #f97316; }

    /* DEAL CARD NEW */
    .deal-card-new {
      margin: 0 16px;
      border-radius: 20px;
      overflow: hidden;
      background: #1e293b;
      border: 1px solid #334155;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }

    /* DEAL CARD (legacy) */
    .deal-card { margin: 0 16px; border-radius: 24px; overflow: hidden; position: relative; height: 62vh; min-height: 420px; }
    .deal-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .deal-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%); }
    .deal-top { position: absolute; top: 16px; left: 16px; right: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .deal-badge { font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 999px; color: white; }
    .deal-origin { font-size: 10px; font-weight: 700; background: rgba(0,0,0,0.5); color: #34d399; padding: 3px 8px; border-radius: 999px; margin-top: 6px; display: inline-block; }
    .deal-discount { font-size: 40px; font-weight: 900; color: #fb923c; line-height: 1; }
    .deal-timer { font-size: 11px; font-weight: 700; background: rgba(0,0,0,0.5); color: #fcd34d; padding: 3px 8px; border-radius: 999px; margin-top: 6px; }
    .deal-bottom { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; }
    .deal-ai { background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 8px 12px; margin-bottom: 12px; font-size: 11px; color: #6ee7b7; font-weight: 600; }
    .deal-merchant { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .deal-photo { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; border: 2px solid rgba(255,255,255,0.2); flex-shrink: 0; }
    .deal-name { font-size: 20px; font-weight: 900; line-height: 1.2; }
    .deal-merchant-name { font-size: 13px; font-weight: 700; color: #cbd5e1; }
    .deal-desc { font-size: 12px; color: #94a3b8; margin-bottom: 12px; }
    .deal-prices { display: flex; align-items: flex-end; justify-content: space-between; }
    .deal-price { font-size: 40px; font-weight: 900; color: #34d399; line-height: 1; }
    .deal-original { font-size: 14px; color: #64748b; text-decoration: line-through; }
    .deal-eco { font-size: 11px; color: #6ee7b7; font-weight: 700; }
    .deal-co2 { font-size: 11px; color: #94a3b8; text-align: right; margin-bottom: 8px; }
    .btn-cart { background: #f97316; color: white; border: none; border-radius: 16px; padding: 12px 20px; font-weight: 900; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: 'Montserrat', sans-serif; }
    .btn-cart:active { transform: scale(0.95); }

    /* ACTION BUTTONS */
    .actions { display: flex; gap: 12px; padding: 12px 16px 0; }
    .btn-pass { flex: 1; background: #1e293b; color: #cbd5e1; border: none; border-radius: 16px; padding: 16px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: 'Montserrat', sans-serif; }
    .btn-add { flex: 1; background: #f97316; color: white; border: none; border-radius: 16px; padding: 16px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: 'Montserrat', sans-serif; box-shadow: 0 8px 24px rgba(249,115,22,0.3); }

    /* SWIPE HINTS */
    .swipe-hints { display: flex; justify-content: space-between; padding: 8px 24px; font-size: 10px; color: #475569; }

    /* BOTTOM NAV */
    .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: rgba(15,23,42,0.95); backdrop-filter: blur(20px); border-top: 1px solid #1e293b; padding: 8px 4px; display: flex; justify-content: space-around; z-index: 100; }
    .nav-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 12px; position: relative; }
    .nav-btn.active { background: rgba(249,115,22,0.15); }
    .nav-icon { font-size: 18px; }
    .nav-label { font-size: 9px; font-weight: 700; color: #64748b; font-family: 'Montserrat', sans-serif; }
    .nav-btn.active .nav-label { color: #f97316; }
    .nav-dot { position: absolute; top: 2px; right: 4px; width: 6px; height: 6px; background: #ef4444; border-radius: 50%; }
    .cart-badge { position: absolute; top: -4px; right: -4px; background: #f97316; color: white; font-size: 9px; font-weight: 900; min-width: 16px; height: 16px; border-radius: 999px; display: flex; align-items: center; justify-content: center; padding: 0 2px; }

    /* CONTENT PADDING */
    .content { padding-bottom: 80px; }

    /* TOAST */
    .toast { position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: #334155; color: white; padding: 10px 24px; border-radius: 999px; font-weight: 700; font-size: 14px; z-index: 200; display: none; }
    .toast.show { display: block; animation: bounce 0.3s ease; }
    @keyframes bounce { 0% { transform: translateX(-50%) translateY(-10px); opacity: 0; } 100% { transform: translateX(-50%) translateY(0); opacity: 1; } }

    /* CART */
    .cart-view { padding: 16px; }
    .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .cart-title { font-size: 20px; font-weight: 900; }
    .cart-subtitle { font-size: 12px; color: #64748b; }
    .btn-clear { background: #1e293b; color: #64748b; border: none; border-radius: 12px; padding: 8px 12px; font-size: 12px; cursor: pointer; font-family: 'Montserrat', sans-serif; }
    .savings-banner { background: linear-gradient(to right, rgba(6,78,59,0.5), rgba(19,78,74,0.3)); border: 1px solid rgba(52,211,153,0.3); border-radius: 16px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .savings-label { font-size: 14px; font-weight: 700; color: #6ee7b7; }
    .savings-amount { font-size: 22px; font-weight: 900; color: #34d399; }
    .cart-item { background: rgba(30,41,59,0.8); border: 1px solid #334155; border-radius: 16px; overflow: hidden; display: flex; margin-bottom: 12px; }
    .cart-img { width: 96px; height: 96px; object-fit: cover; flex-shrink: 0; }
    .cart-info { flex: 1; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; }
    .cart-name { font-size: 14px; font-weight: 700; }
    .cart-meta { font-size: 11px; color: #64748b; }
    .cart-row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
    .qty-controls { display: flex; align-items: center; gap: 8px; }
    .qty-btn { width: 28px; height: 28px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; }
    .qty-minus { background: #334155; color: white; }
    .qty-plus { background: #f97316; color: white; }
    .qty-num { font-size: 14px; font-weight: 900; width: 20px; text-align: center; }
    .cart-price { font-size: 18px; font-weight: 900; color: #34d399; }
    .cart-orig { font-size: 10px; color: #475569; text-decoration: line-through; }
    .cart-total-box { background: rgba(30,41,59,0.6); border: 1px solid #334155; border-radius: 16px; padding: 16px; margin-top: 8px; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #94a3b8; }
    .total-row.main { border-top: 1px solid #334155; padding-top: 8px; margin-top: 4px; color: white; font-weight: 900; font-size: 16px; }
    .total-row.main span:last-child { color: #fb923c; font-size: 20px; }
    .btn-order { width: 100%; padding: 18px; background: #f97316; color: white; border: none; border-radius: 16px; font-size: 18px; font-weight: 900; cursor: pointer; margin-top: 16px; box-shadow: 0 8px 24px rgba(249,115,22,0.3); font-family: 'Montserrat', sans-serif; }
    .btn-order.done { background: #10b981; }
    .cart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 32px; text-align: center; gap: 16px; }
    .cart-empty-icon { width: 80px; height: 80px; background: #1e293b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; }
    .cart-empty h3 { font-size: 18px; font-weight: 900; }
    .cart-empty p { font-size: 13px; color: #64748b; }

    /* LIVE VIEW */
    .live-view { padding: 16px; }
    .live-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .live-dot { width: 8px; height: 8px; background: #ef4444; border-radius: 50%; animation: pulse 1s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .live-label { font-size: 12px; font-weight: 900; color: #f87171; letter-spacing: 3px; }
    .lot-card { background: rgba(30,41,59,0.8); border: 1px solid #334155; border-radius: 24px; padding: 20px; margin-bottom: 16px; }
    .lot-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .lot-label { font-size: 11px; color: #64748b; margin-bottom: 4px; }
    .lot-name { font-size: 20px; font-weight: 900; }
    .lot-bid-row { display: flex; justify-content: space-between; align-items: center; }
    .lot-price { font-size: 32px; font-weight: 900; color: #fb923c; }
    .lot-count { font-size: 12px; color: #64748b; }
    .btn-bid { background: #f97316; color: white; border: none; border-radius: 16px; padding: 14px 20px; font-weight: 900; font-size: 14px; cursor: pointer; font-family: 'Montserrat', sans-serif; box-shadow: 0 4px 16px rgba(249,115,22,0.4); }

    /* MERCHANT VIEW */
    .merchant-view { padding: 16px; }
    .section-card { background: rgba(30,41,59,0.8); border: 1px solid #334155; border-radius: 24px; padding: 20px; margin-bottom: 16px; }
    .section-title { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 16px; }
    .mic-btn { width: 96px; height: 96px; border-radius: 50%; background: #f97316; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto; box-shadow: 0 8px 24px rgba(249,115,22,0.4); transition: all 0.3s; }
    .mic-btn.recording { background: #ef4444; box-shadow: 0 0 0 8px rgba(239,68,68,0.3); animation: pulse-ring 1s infinite; }
    @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 100% { box-shadow: 0 0 0 20px rgba(239,68,68,0); } }
    .mic-hint { text-align: center; font-size: 12px; color: #64748b; margin-top: 12px; }
    .transcript-box { background: rgba(15,23,42,0.5); border-radius: 16px; padding: 16px; margin-top: 16px; }
    .transcript-label { font-size: 11px; color: #64748b; font-weight: 700; margin-bottom: 8px; }
    .transcript-text { font-size: 14px; color: #e2e8f0; font-style: italic; }
    .parsed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
    .parsed-item { background: rgba(30,41,59,0.5); border-radius: 12px; padding: 10px; }
    .parsed-key { font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
    .parsed-val { font-size: 14px; font-weight: 700; }
    .btn-publish { width: 100%; padding: 18px; background: #f97316; color: white; border: none; border-radius: 16px; font-size: 18px; font-weight: 900; cursor: pointer; margin-top: 8px; font-family: 'Montserrat', sans-serif; box-shadow: 0 8px 24px rgba(249,115,22,0.3); }
    .btn-publish.done { background: #10b981; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* B2B VIEW */
    .b2b-view { padding: 16px; }
    .impact-card { background: linear-gradient(135deg, rgba(6,78,59,0.5), rgba(19,78,74,0.3)); border: 1px solid rgba(52,211,153,0.3); border-radius: 24px; padding: 20px; margin-bottom: 16px; }
    .impact-title { font-size: 13px; font-weight: 700; color: #6ee7b7; margin-bottom: 16px; }
    .impact-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; text-align: center; }
    .impact-val { font-size: 22px; font-weight: 900; }
    .impact-label { font-size: 10px; color: #34d399; font-weight: 700; }
    .alert-item { background: rgba(30,41,59,0.8); border: 1px solid #334155; border-radius: 16px; padding: 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .alert-info { flex: 1; }
    .alert-name { font-size: 14px; font-weight: 700; }
    .alert-meta { font-size: 12px; color: #64748b; }
    .alert-days { color: #fb923c; font-weight: 700; }
    .alert-revenue { font-size: 14px; font-weight: 700; color: #34d399; text-align: right; }
    .alert-rev-label { font-size: 10px; color: #64748b; }
    .btn-launch { background: #f97316; color: white; border: none; border-radius: 12px; padding: 10px 16px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; white-space: nowrap; }
    .btn-launch.done { background: #10b981; }
    /* BIM-RIDE MAP */
  #bimride-map { background: #0f172a; }
  .runner-marker { position: relative; }
  .runner-dot { width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); cursor: pointer; }
  .runner-pulse { position: absolute; top: -4px; left: -4px; width: 26px; height: 26px; border-radius: 50%; opacity: 0.6; animation: ripple 1.5s infinite; }
  @keyframes ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
  .leaflet-popup-content-wrapper { background: #1e293b !important; border: 1px solid #334155 !important; border-radius: 14px !important; color: white !important; }
  .leaflet-popup-tip { background: #1e293b !important; }
  .leaflet-popup-content { margin: 12px 14px !important; }
  .leaflet-container { background: #1a2744 !important; font-family: Montserrat,sans-serif; }


  .leaflet-container { font-family: Montserrat, sans-serif !important; }
  .runner-leaflet-icon { border-radius: 50%; }
  @keyframes ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }
  .leaflet-tile-pane { filter: none; }


    @keyframes splashLogo {
      to { opacity:1; transform:scale(1); }
    }
    @keyframes splashFade {
      to { opacity:1; }
    }
    @keyframes splashRing {
      0% { transform:scale(0.8); opacity:0.6; }
      100% { transform:scale(1.4); opacity:0; }
    }
    @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(0);    opacity: 1; }
    to   { transform: translateY(-20px); opacity: 0; }
  }
  @keyframes dot {
      0%,100% { transform:scale(1); opacity:0.5; }
      50% { transform:scale(1.5); opacity:1; }
    }
  