// ============================================
// BIM App — BIM-Ride (Livraison)
// TODO Phase 4 : GPS réel, assignation de courses
// ============================================

const RUNNERS = [
  {
    id:1, name:'Marie T.', initial:'M', color:'#f97316',
    photo:'https://randomuser.me/api/portraits/women/44.jpg',
    lat:0.45, lng:0.48, route:'Fayence → Callian', eta:'12 min', etaMin:12,
    rating:'4.9', reviews:127, courses:312, co2:'48kg',
    status:'En route', delivering:true,
    bio:'Runner depuis 2 ans, je connais tous les chemins de Fayence. Livraison soignee garantie!',
    lastReviews:[
      {name:'Pierre M.', note:5, text:'Super rapide et tres sympa!'},
      {name:'Claire B.', note:5, text:'Impeccable, je recommande!'},
      {name:'Ahmed K.', note:4, text:'Tres professionnel, merci Marie.'}
    ]
  },
  {
    id:2, name:'Jean-Paul R.', initial:'J', color:'#6366f1',
    photo:'https://randomuser.me/api/portraits/men/32.jpg',
    lat:0.65, lng:0.70, route:'Montauroux → Fayence', eta:'8 min', etaMin:8,
    rating:'4.7', reviews:89, courses:198, co2:'31kg',
    status:'Disponible', delivering:false,
    bio:"Retraite actif, je livre avec plaisir. Ponctuel et discret.",
    lastReviews:[
      {name:'Sophie L.', note:5, text:'Parfait comme toujours!'},
      {name:'Marc D.', note:4, text:'Bonne livraison, merci.'}
    ]
  },
  {
    id:3, name:'Sophie M.', initial:'S', color:'#10b981',
    photo:'https://randomuser.me/api/portraits/women/68.jpg',
    lat:0.28, lng:0.72, route:'Fayence → Seillans', eta:'15 min', etaMin:15,
    rating:'5.0', reviews:203, courses:445, co2:'67kg',
    status:'En route', delivering:true,
    bio:"Passionnee de velo et d ecologie. Livraisons 100% propres sur Fayence et alentours.",
    lastReviews:[
      {name:'Julie F.', note:5, text:'Sophie est la meilleure runner!'},
      {name:'Luc T.', note:5, text:'Toujours a l\'heure, toujours souriante.'},
      {name:'Emma R.', note:5, text:'Produits parfaitement conserves.'}
    ]
  },
  {
    id:4, name:'Karim B.', initial:'K', color:'#f59e0b',
    photo:'https://randomuser.me/api/portraits/men/55.jpg',
    lat:0.72, lng:0.35, route:'Callian → Fayence', eta:'6 min', etaMin:6,
    rating:'4.8', reviews:156, courses:267, co2:'41kg',
    status:'Disponible', delivering:false,
    bio:'Toujours disponible le matin et le week-end. Livraisons rapides garanties.',
    lastReviews:[
      {name:'Nadia S.', note:5, text:'Tres rapide, produits frais a l\'arrivee.'},
      {name:'Robert M.', note:5, text:'Super Karim, encore merci!'}
    ]
  },
  {
    id:5, name:'Laura D.', initial:'L', color:'#ef4444',
    photo:'https://randomuser.me/api/portraits/women/22.jpg',
    lat:0.38, lng:0.82, route:'Fayence → Montauroux', eta:'20 min', etaMin:20,
    rating:'4.6', reviews:72, courses:134, co2:'22kg',
    status:'En route', delivering:true,
    bio:'Jeune runner dynamique, je livre vite et bien. Disponible tous les jours.',
    lastReviews:[
      {name:'Paul V.', note:5, text:'Tres agreable et ponctuelle!'},
      {name:'Isabelle D.', note:4, text:'Bonne livraison merci Laura.'}
    ]
  }
];

let mapCanvas = null, mapCtx = null;
let mapAnimFrame = null, pulsePhase = 0;
let selectedRunnerId = null;
let runnerPositions = {};
let trackingRunner = null;
let trackingProgress = 0;
let trackingInterval = null;
let trackCanvas = null, trackCtx = null;
let trackAnimFrame = null, trackPulse = 0;

// Road network (normalized 0-1 coords)
const ROADS = [
  [[0.1,0.5],[0.9,0.5]],
  [[0.5,0.1],[0.5,0.9]],
  [[0.1,0.2],[0.8,0.7]],
  [[0.2,0.8],[0.85,0.25]],
  [[0.3,0.5],[0.3,0.9]],
  [[0.7,0.1],[0.7,0.6]],
  [[0.1,0.5],[0.3,0.2]],
  [[0.9,0.5],[0.7,0.8]],
  [[0.4,0.3],[0.6,0.6]],
  [[0.2,0.6],[0.5,0.5]],
];

const VILLAGES = [
  {name:'Fayence',    x:0.5,  y:0.5,  size:9},
  {name:'Callian',    x:0.82, y:0.3,  size:6},
  {name:'Montauroux', x:0.68, y:0.72, size:6},
  {name:'Seillans',   x:0.2,  y:0.28, size:6},
  {name:'Mons',       x:0.28, y:0.65, size:5},
  {name:'Tourrettes', x:0.62, y:0.42, size:5},
];

let leafletMap = null;
let leafletMarkers = {};
let leafletTrackingMap = null;
let trackingMarker = null;
let trackingLine = null;
let pulseInterval = null;

// Runner positions in real GPS coords (Fayence area)
const RUNNER_COORDS = {
  1: [43.6180, 6.6920],
  2: [43.6050, 6.7200],
  3: [43.6320, 6.7050],
  4: [43.5980, 6.6800],
  5: [43.6250, 6.6650],
};

function initRideMap() {
  if (typeof L === 'undefined') {
    console.log('Leaflet not loaded yet');
    setTimeout(initRideMap, 500);
    return;
  }

  const mapEl = document.getElementById('leaflet-map');
  if (!mapEl) return;

  if (leafletMap) {
    leafletMap.invalidateSize();
    return;
  }

  leafletMap = L.map('leaflet-map', {
    center: [43.612, 6.700],
    zoom: 13,
    zoomControl: true,
    attributionControl: false
  });

  // CartoDB dark tiles - works well on mobile
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(leafletMap);

  // Add runner markers
  RUNNERS.forEach(function(runner) {
    addLeafletMarker(runner);
  });

  // Animate marker pulses
  if (pulseInterval) clearInterval(pulseInterval);
  pulseInterval = setInterval(function() {
    animateLeafletMarkers();
  }, 2000);
}

function addLeafletMarker(runner) {
  const coords = RUNNER_COORDS[runner.id] || [43.612, 6.700];
  const isDelivering = runner.delivering;

  const iconHtml = '<div style="width:42px;height:42px;border-radius:50%;background:' + runner.color + ';'
    + 'border:3px solid white;display:flex;align-items:center;justify-content:center;'
    + 'font-weight:900;font-size:15px;color:white;cursor:pointer;'
    + 'box-shadow:0 4px 14px rgba(0,0,0,0.35);position:relative">'
    + runner.initial
    + '<div style="position:absolute;inset:-6px;border-radius:50%;border:3px solid ' + runner.color + ';opacity:0.5;animation:ripple 1.5s infinite ' + (runner.id*0.3) + 's"></div>'
    + '</div>'
    + '<div style="background:' + runner.color + ';color:white;font-size:10px;font-weight:900;'
    + 'padding:3px 8px;border-radius:8px;text-align:center;margin-top:4px;white-space:nowrap;'
    + 'box-shadow:0 2px 8px rgba(0,0,0,0.3)">' + runner.eta + '</div>';

  const icon = L.divIcon({
    html: iconHtml,
    className: '',
    iconSize: [42, 62],
    iconAnchor: [21, 31],
    popupAnchor: [0, -35]
  });

  const marker = L.marker(coords, { icon: icon }).addTo(leafletMap);
  marker.on('click', function() {
    selectedRunnerId = runner.id;
    openRunnerSheet(runner);
  });

  leafletMarkers[runner.id] = { marker, coords: [...coords], runner };
}

function animateLeafletMarkers() {
  Object.values(leafletMarkers).forEach(function(m) {
    if (m.runner.delivering) {
      const dlat = (Math.random() - 0.5) * 0.001;
      const dlng = (Math.random() - 0.5) * 0.001;
      m.coords[0] += dlat;
      m.coords[1] += dlng;
      m.marker.setLatLng(m.coords);
    }
  });
}

function initTrackingMap(runner) {
  const mapEl = document.getElementById('leaflet-tracking');
  if (!mapEl || typeof L === 'undefined') return;

  if (leafletTrackingMap) {
    leafletTrackingMap.remove();
    leafletTrackingMap = null;
  }

  const startCoords = RUNNER_COORDS[runner.id] || [43.612, 6.700];
  const destCoords = [43.612, 6.700]; // Fayence center

  leafletTrackingMap = L.map('leaflet-tracking', {
    center: startCoords,
    zoom: 14,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd'
  }).addTo(leafletTrackingMap);

  // Route line
  trackingLine = L.polyline([startCoords, destCoords], {
    color: runner.color, weight: 4, dashArray: '8 6', opacity: 0.9
  }).addTo(leafletTrackingMap);

  // Runner marker
  const runnerIcon = L.divIcon({
    html: '<div style="width:46px;height:46px;border-radius:50%;background:' + runner.color + ';border:4px solid white;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;color:white;box-shadow:0 6px 20px rgba(0,0,0,0.4)">' + runner.initial + '</div>',
    className: '', iconSize: [46, 46], iconAnchor: [23, 23]
  });
  trackingMarker = L.marker(startCoords, { icon: runnerIcon }).addTo(leafletTrackingMap);

  // Destination marker
  const destIcon = L.divIcon({
    html: '<div style="font-size:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">📍</div>',
    className: '', iconSize: [32, 40], iconAnchor: [16, 40]
  });
  L.marker(destCoords, { icon: destIcon }).addTo(leafletTrackingMap);

  // Animate runner toward destination
  let step = 0;
  const steps = 60;
  const animInterval = setInterval(function() {
    step++;
    const t = step / steps;
    const lat = startCoords[0] + (destCoords[0] - startCoords[0]) * t;
    const lng = startCoords[1] + (destCoords[1] - startCoords[1]) * t;
    if (trackingMarker) {
      trackingMarker.setLatLng([lat + (Math.random()-0.5)*0.0005, lng + (Math.random()-0.5)*0.0005]);
      leafletTrackingMap.panTo([lat, lng], { animate: true, duration: 0.5 });
    }
    if (step >= steps) clearInterval(animInterval);
  }, (runner.etaMin * 60000) / steps);
}

function handleMapClick(event) {
  // Leaflet handles clicks via marker.on('click')
}

function openRunnerSheet(r) {
  const sheet = document.getElementById('runner-sheet');
  sheet.style.display = 'flex';

  document.getElementById('sheet-photo').src = r.photo;
  document.getElementById('sheet-photo').onerror = function() { this.src=''; this.style.background=r.color; this.style.display='flex'; };
  document.getElementById('sheet-name').textContent = r.name;
  document.getElementById('sheet-rating').textContent = r.rating;
  document.getElementById('sheet-reviews').textContent = '(' + r.reviews + ' avis)';
  document.getElementById('sheet-courses').textContent = r.courses;
  document.getElementById('sheet-co2').textContent = r.co2;
  document.getElementById('sheet-eta-big').textContent = r.eta;
  document.getElementById('sheet-route').textContent = r.route;
  document.getElementById('sheet-bio').textContent = r.bio;

  const statusBadge = document.getElementById('sheet-status-badge');
  statusBadge.textContent = r.delivering ? '🚗 En livraison' : '✅ Disponible';
  statusBadge.style.background = r.delivering ? 'rgba(249,115,22,0.2)' : 'rgba(16,185,129,0.2)';
  statusBadge.style.color = r.delivering ? '#fb923c' : '#34d399';

  const dot = document.getElementById('sheet-status-dot');
  dot.style.background = r.delivering ? '#f97316' : '#34d399';

  const reviewsEl = document.getElementById('sheet-reviews-list');
  reviewsEl.innerHTML = r.lastReviews.map(function(rv) {
    const stars = Array(rv.note).fill('⭐').join('');
    return '<div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:12px;margin-bottom:8px">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'
      + '<span style="font-size:13px;font-weight:700">' + rv.name + '</span>'
      + '<span style="font-size:12px">' + stars + '</span>'
      + '</div>'
      + '<p style="font-size:12px;color:#94a3b8;font-style:italic">"' + rv.text + '"</p>'
      + '</div>';
  }).join('');
}

function closeRunnerSheet() {
  document.getElementById('runner-sheet').style.display = 'none';
}

function confirmRunner() {
  const runner = RUNNERS.find(function(r) { return r.id === selectedRunnerId; });
  if (!runner) return;
  closeRunnerSheet();
  trackingRunner = runner;
  trackingProgress = 0;
  startTracking(runner);
}

function startTracking(runner) {
  const tv = document.getElementById('tracking-view');
  tv.style.display = 'flex';

  document.getElementById('tracking-photo').src = runner.photo;
  document.getElementById('tracking-name').textContent = runner.name;
  document.getElementById('tracking-route').textContent = runner.route;
  document.getElementById('tracking-rating').textContent = runner.rating;

  let remaining = runner.etaMin;
  document.getElementById('tracking-eta').textContent = remaining + ' min';

  // Init tracking map
  setTimeout(function() {
    initTrackingMap(runner);
  }, 100);

  // Progress simulation
  if (trackingInterval) clearInterval(trackingInterval);
  const totalSeconds = runner.etaMin * 60;
  let elapsed = 0;

  trackingInterval = setInterval(function() {
    elapsed += 3;
    trackingProgress = Math.min(100, (elapsed / totalSeconds) * 100);

    document.getElementById('tracking-bar').style.width = trackingProgress + '%';
    document.getElementById('tracking-pct').textContent = Math.round(trackingProgress) + '%';

    remaining = Math.max(0, Math.round((totalSeconds - elapsed) / 60));
    document.getElementById('tracking-eta').textContent = remaining === 0 ? 'Arrive!' : remaining + ' min';

    // Step 2 active
    if (trackingProgress > 20) {
      document.getElementById('step2-dot').style.background = '#f97316';
      document.getElementById('step2-label').style.color = '#f97316';
    }
    // Step 3 done
    if (trackingProgress >= 100) {
      document.getElementById('step3-dot').style.background = '#10b981';
      document.getElementById('step3-label').style.color = '#10b981';
      document.getElementById('tracking-eta').textContent = 'Livre! 🎉';
      clearInterval(trackingInterval);
      showToast('Livraison effectuee par ' + runner.name + '!');
    }
  }, 3000);
}

function cancelTracking() {
  if (trackingInterval) clearInterval(trackingInterval);
  if (trackAnimFrame) { cancelAnimationFrame(trackAnimFrame); trackAnimFrame = null; }
  document.getElementById('tracking-view').style.display = 'none';
  // Reset steps
  document.getElementById('step2-dot').style.background = '#334155';
  document.getElementById('step2-label').style.color = '#64748b';
  document.getElementById('step3-dot').style.background = '#334155';
  document.getElementById('step3-label').style.color = '#64748b';
  document.getElementById('tracking-bar').style.width = '0%';
  trackingProgress = 0;
  showToast('Course annulee');
}

function setRideView(view) {
  const mapView = document.getElementById('ride-map-view');
  const listView = document.getElementById('ride-list-view');
  const btnMap = document.getElementById('ride-btn-map');
  const btnList = document.getElementById('ride-btn-list');
  if (view === 'map') {
    mapView.style.display = 'block'; listView.style.display = 'none';
    btnMap.style.background = '#f97316'; btnMap.style.color = 'white';
    btnList.style.background = '#1e293b'; btnList.style.color = '#94a3b8';
    setTimeout(initRideMap, 100);
  } else {
    mapView.style.display = 'none'; listView.style.display = 'block';
    btnList.style.background = '#f97316'; btnList.style.color = 'white';
    btnMap.style.background = '#1e293b'; btnMap.style.color = '#94a3b8';
    renderRunnersList();
    if (mapAnimFrame) { cancelAnimationFrame(mapAnimFrame); mapAnimFrame = null; }
  }
}

function renderRunnersList() {
  const el = document.getElementById('runners-list');
  if (!el) return;
  el.innerHTML = RUNNERS.map(function(r) {
    return '<div onclick="selectedRunnerId=' + r.id + ';openRunnerSheet(RUNNERS.find(function(x){return x.id===' + r.id + '}))" style="background:#1e293b;border:1px solid #334155;border-radius:18px;padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:10px;cursor:pointer">'
    + '<img src="' + r.photo + '" style="width:52px;height:52px;border-radius:14px;object-fit:cover;border:2px solid ' + r.color + ';flex-shrink:0" onerror="this.style.background=\'' + r.color + '\';this.src=\'\'" />'
    + '<div style="flex:1">'
    + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">'
    + '<span style="font-weight:900;font-size:15px">' + r.name + '</span>'
    + '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:' + (r.delivering?'rgba(249,115,22,0.2)':'rgba(16,185,129,0.2)') + ';color:' + (r.delivering?'#fb923c':'#34d399') + '">' + r.status + '</span>'
    + '</div>'
    + '<p style="font-size:12px;color:#64748b;margin-bottom:3px">' + r.route + '</p>'
    + '<div style="display:flex;align-items:center;gap:10px">'
    + '<span style="font-size:11px;color:#fcd34d">⭐ ' + r.rating + '</span>'
    + '<span style="font-size:11px;color:#64748b">' + r.courses + ' courses</span>'
    + '<span style="font-size:11px;color:#34d399">🌿 ' + r.co2 + '</span>'
    + '</div></div>'
    + '<div style="text-align:right;flex-shrink:0">'
    + '<p style="font-size:20px;font-weight:900;color:#fb923c">' + r.eta + '</p>'
    + '<p style="font-size:10px;color:#64748b;margin-top:2px">ETA</p>'
    + '</div></div>';
  }).join('');
}

function selectRunnerFromList(id) {
  const runner = RUNNERS.find(function(r) { return r.id === id; });
  if (!runner) return;
  setRideView('map');
  setTimeout(function() { initRideMap(); selectedRunnerId = id; openRunnerSheet(runner); }, 200);
}

function becomeRunner() { showToast('Inscription BIM-Runner - bientot disponible!'); }

// BIM-Ride map init is handled inside showTab
