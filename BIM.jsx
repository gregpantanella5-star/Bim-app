import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Camera, Heart, X, Check, ChevronRight, Zap, Flame, TrendingUp, Truck, Leaf, BarChart2, Bell, ShoppingBag, MapPin, Star, Users, Clock, Package, Navigation, MessageCircle, Award, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "Tout", emoji: "⚡" },
  { id: "viande", label: "Viande", emoji: "🥩" },
  { id: "cave", label: "Cave", emoji: "🍷" },
  { id: "primeur", label: "Primeur", emoji: "🥦" },
  { id: "laitier", label: "Laitier", emoji: "🧀" },
  { id: "pret", label: "Prêt à manger", emoji: "🍱" },
];

const DEALS = [
  {
    id: 1, category: "viande",
    name: "Côte de Bœuf Angus",
    merchant: "Boucherie Fabre",
    verified: true, origin: "VAR",
    discount: 60, price: 18.90, originalPrice: 47.20,
    weight: "1.2 kg",
    expiry: "Aujourd'hui 20h00",
    timeLeft: 4 * 3600 + 23 * 60,
    ai_analysis: "Persillage excellent · Couleur optimale · Fraîcheur ✓",
    impact: { saved: 28.30, co2: 1.4 },
    gradient: "from-red-900 via-red-800 to-orange-900",
    badge: "BIM TERROIR",
    badgeColor: "#10B981",
    bg: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
    photo: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80",
    description: "Race Angus élevée en plein air, alimentation 100% naturelle. Stock limité.",
  },
  {
    id: 2, category: "cave",
    name: "Lot 12 Rosé Provence",
    merchant: "Cave Coopérative",
    verified: true, origin: "AOP",
    discount: 45, price: 54, originalPrice: 98,
    weight: "12 × 75cl",
    expiry: "Demain 18h00",
    timeLeft: 22 * 3600,
    ai_analysis: null,
    impact: { saved: 44, co2: 0.8 },
    gradient: "from-pink-900 via-pink-800 to-rose-900",
    badge: "ENCHÈRE",
    badgeColor: "#F97316",
    bg: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
    photo: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80",
    description: "Cuvée Tradition, récoltée à la main. Parfait pour l'été.",
    isAuction: true, currentBid: 54, bids: 7,
  },
  {
    id: 3, category: "primeur",
    name: "Tomates Cœur de Bœuf",
    merchant: "Maraîcher Bonnet",
    verified: true, origin: "VAR",
    discount: 50, price: 2.40, originalPrice: 4.80,
    weight: "2 kg",
    expiry: "Aujourd'hui 22h00",
    timeLeft: 2 * 3600 + 10 * 60,
    ai_analysis: "Maturité optimale · Arôme intense · Calibre A",
    impact: { saved: 2.40, co2: 0.3 },
    gradient: "from-green-900 via-emerald-800 to-teal-900",
    badge: "BIM TERROIR",
    badgeColor: "#10B981",
    bg: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80",
    photo: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",
    description: "Variété ancienne, sans traitement chimique.",
  },
  {
    id: 4, category: "laitier",
    name: "Comté AOP 24 mois",
    merchant: "Fromagerie Martin",
    verified: true, origin: "Jura",
    discount: 35, price: 12.50, originalPrice: 19.20,
    weight: "500g",
    expiry: "Dans 3 jours",
    timeLeft: 3 * 24 * 3600,
    ai_analysis: "Affinage parfait · Notes noisette · Texture idéale",
    impact: { saved: 6.70, co2: 0.5 },
    gradient: "from-yellow-900 via-amber-800 to-orange-900",
    badge: "PRIX CHOC",
    badgeColor: "#F97316",
    bg: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80",
    photo: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80",
    description: "Sélectionné par notre affineur. Quantités très limitées.",
  },
  {
    id: 5, category: "pret",
    name: "Plateau Sushi Premium",
    merchant: "Sushi Zen",
    verified: true, origin: "Local",
    discount: 40, price: 14.90, originalPrice: 24.90,
    weight: "32 pièces",
    expiry: "Ce soir 21h00",
    timeLeft: 3 * 3600,
    ai_analysis: "Fraîcheur garantie · Poisson du jour · Qualité restaurant",
    impact: { saved: 10, co2: 0.2 },
    gradient: "from-slate-900 via-slate-800 to-indigo-900",
    badge: "FLASH",
    badgeColor: "#6366F1",
    bg: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
    photo: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80",
    description: "Saumon, thon, crevettes. Disponible jusqu'à épuisement.",
  },
  {
    id: 6, category: "viande",
    name: "Poulet Fermier Label Rouge",
    merchant: "Ferme des Collines",
    verified: true, origin: "VAR",
    discount: 30, price: 8.90, originalPrice: 12.70,
    weight: "1.8 kg",
    expiry: "Demain 12h00",
    timeLeft: 18 * 3600,
    ai_analysis: "Peau dorée · Odeur fraîche · Bonne conformation",
    impact: { saved: 3.80, co2: 0.6 },
    gradient: "from-amber-900 via-orange-800 to-red-900",
    badge: "BIM TERROIR",
    badgeColor: "#10B981",
    bg: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80",
    photo: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80",
    description: "Élevé en plein air, nourri sans OGM. Anti-gaspillage.",
  },
];

const LIVE_LOTS = [
  { id: 1, name: "Lot 48 cartons Rosé", category: "cave", currentBid: 180, bids: 14, timeLeft: 1200, bidders: ["Marie T.", "Jean P.", "Carrefour Draguignan"] },
  { id: 2, name: "Lot 200kg Tomates", category: "primeur", currentBid: 95, bids: 6, timeLeft: 3600, bidders: ["Rest. Le Terroir", "Maxi Market"] },
];

const ALERTS_B2B = [
  { id: 1, product: "Filet de Sole", qty: "45 kg", daysLeft: 2, revenue: 810 },
  { id: 2, product: "Yaourts Bio", qty: "340 unités", daysLeft: 1, revenue: 272 },
  { id: 3, product: "Pain de mie", qty: "180 unités", daysLeft: 1, revenue: 126 },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Countdown({ seconds }) {
  const [t, setT] = useState(seconds);
  useEffect(() => {
    const i = setInterval(() => setT(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(i);
  }, []);
  const urgent = t < 7200;
  return (
    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${urgent ? "bg-red-500 text-white animate-pulse" : "bg-black/50 text-orange-300"}`}>
      ⏱ {formatTime(t)}
    </span>
  );
}

function CategoryStories({ active, onChange }) {
  return (
    <div className="flex gap-3 px-4 py-2 overflow-x-auto scrollbar-hide">
      {CATEGORIES.map(c => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className="flex flex-col items-center gap-1 flex-shrink-0 group"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${active === c.id ? "ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-900 bg-orange-500/20 scale-110" : "bg-slate-800 group-hover:bg-slate-700"}`}>
            {c.emoji}
          </div>
          <span className={`text-[10px] font-semibold tracking-wide ${active === c.id ? "text-orange-400" : "text-slate-400"}`}>
            {c.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function DealCard({ deal, onSwipe, onDoubleTap, onAddToCart }) {
  const [swipeDir, setSwipeDir] = useState(null);
  const [liked, setLiked] = useState(false);
  const [auctionBid, setAuctionBid] = useState(deal.currentBid || null);
  const [addedAnim, setAddedAnim] = useState(false);
  const touchStart = useRef(null);
  const tapTimeout = useRef(null);
  const taps = useRef(0);

  const handleTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 60) {
      const dir = dx > 0 ? "right" : "left";
      setSwipeDir(dir);
      if (dir === "right") {
        onAddToCart && onAddToCart(deal);
      }
      setTimeout(() => { onSwipe(deal.id, dir); setSwipeDir(null); }, 400);
    }
    touchStart.current = null;
  };

  const handleTap = () => {
    taps.current++;
    if (taps.current === 2) {
      setLiked(true);
      onDoubleTap && onDoubleTap(deal.id);
      clearTimeout(tapTimeout.current);
      taps.current = 0;
    } else {
      tapTimeout.current = setTimeout(() => { taps.current = 0; }, 300);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart(deal);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 800);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-400 select-none
        ${swipeDir === "right" ? "rotate-6 translate-x-20 opacity-0" : ""}
        ${swipeDir === "left" ? "-rotate-6 -translate-x-20 opacity-0" : ""}`}
      style={{ height: "62vh", minHeight: 420 }}
    >
      {/* BG */}
      <img src={deal.bg} alt={deal.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-t ${deal.gradient} opacity-75`} />

      {/* TOP BADGES */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-black px-3 py-1 rounded-full text-white" style={{ backgroundColor: deal.badgeColor }}>
            {deal.badge}
          </span>
          <span className="text-[11px] font-bold bg-black/50 backdrop-blur-sm text-emerald-400 px-2 py-0.5 rounded-full">
            📍 {deal.origin}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-4xl font-black text-orange-400 drop-shadow-lg leading-none">
            -{deal.discount}%
          </span>
          <Countdown seconds={deal.timeLeft} />
        </div>
      </div>

      {/* BOTTOM INFO */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* AI Analysis */}
        {deal.ai_analysis && (
          <div className="mb-3 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl">
            <p className="text-[11px] text-emerald-300 font-semibold">🤖 Analyse IA : {deal.ai_analysis}</p>
          </div>
        )}

        {/* Merchant + photo thumbnail on same row */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
            <img src={deal.photo} alt={deal.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                {deal.merchant[0]}
              </div>
              <span className="text-white font-bold text-sm truncate">{deal.merchant}</span>
              {deal.verified && <Check size={12} className="text-blue-400 flex-shrink-0" />}
            </div>
            <h2 className="text-white text-xl font-black leading-tight truncate">{deal.name}</h2>
          </div>
        </div>

        <p className="text-slate-300 text-xs mb-3">{deal.description} · {deal.weight}</p>

        {/* Price & Auction */}
        {deal.isAuction ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs">Mise actuelle</p>
              <p className="text-3xl font-black text-orange-400">{auctionBid}€</p>
              <p className="text-slate-400 text-xs">{deal.bids} mises · {deal.weight}</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setAuctionBid(a => a + 5); }}
              className="bg-orange-500 hover:bg-orange-400 text-white font-black text-sm px-5 py-3 rounded-2xl flex items-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-500/30"
            >
              <TrendingUp size={16} /> Miser +5€
            </button>
          </div>
        ) : (
          <div className="flex items-end justify-between">
            <div>
              <span className="text-slate-400 line-through text-sm">{deal.originalPrice}€</span>
              <p className="text-4xl font-black text-emerald-400 leading-none">{deal.price}€</p>
              <p className="text-emerald-300 text-xs font-bold">Économie : {(deal.originalPrice - deal.price).toFixed(2)}€</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right text-xs text-slate-400">
                <p>🌿 -{deal.impact.co2}kg CO₂</p>
                <p className="text-slate-500">{deal.expiry}</p>
              </div>
              {/* ADD TO CART BUTTON */}
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-black text-sm transition-all active:scale-90 shadow-lg ${addedAnim ? "bg-emerald-500 text-white scale-110" : "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/40"}`}
              >
                <ShoppingCart size={16} />
                {addedAnim ? "Ajouté ✓" : "Panier"}
              </button>
            </div>
          </div>
        )}

        {/* SWIPE HINTS */}
        <div className="flex justify-between mt-3 text-[10px] text-slate-500">
          <span>← Passer</span>
          <span>→ Ajouter au panier</span>
        </div>
      </div>

      {/* LIKED ANIM */}
      {liked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Heart size={80} className="text-red-500 fill-red-500 animate-ping opacity-80" />
        </div>
      )}

      {/* SWIPE OVERLAYS */}
      {swipeDir === "right" && (
        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
          <div className="border-4 border-emerald-400 rounded-2xl px-8 py-4 rotate-[-15deg]">
            <p className="text-emerald-400 font-black text-3xl">🛒 AU PANIER ✓</p>
          </div>
        </div>
      )}
      {swipeDir === "left" && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
          <div className="border-4 border-red-400 rounded-2xl px-8 py-4 rotate-[15deg]">
            <p className="text-red-400 font-black text-3xl">SUIVANT →</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CART VIEW ────────────────────────────────────────────────────────────────
function CartView({ cart, onUpdateQty, onRemove, onClear }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalSaved = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.qty, 0);
  const [ordered, setOrdered] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-5 px-8 text-center" style={{ minHeight: "60vh" }}>
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
          <ShoppingCart size={40} className="text-slate-600" />
        </div>
        <div>
          <p className="text-lg font-black text-white mb-1">Votre panier est vide</p>
          <p className="text-sm text-slate-500">Swipez à droite sur un deal ou appuyez sur "Panier" pour ajouter des produits</p>
        </div>
        <div className="flex flex-col items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 w-full">
          <p className="text-orange-400 font-bold text-sm">💡 Astuce</p>
          <p className="text-slate-400 text-xs">Swipez → sur une carte pour ajouter instantanément au panier</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-2">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-xl">Mon Panier</h2>
          <p className="text-slate-500 text-xs">{cart.length} article{cart.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={onClear} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors bg-slate-800 px-3 py-1.5 rounded-xl">
          <Trash2 size={12} /> Vider
        </button>
      </div>

      {/* SAVINGS BANNER */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 rounded-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf size={16} className="text-emerald-400" />
          <p className="text-emerald-300 text-sm font-bold">Vous économisez</p>
        </div>
        <p className="text-emerald-400 font-black text-xl">{totalSaved.toFixed(2)}€</p>
      </div>

      {/* CART ITEMS */}
      <div className="space-y-3">
        {cart.map(item => (
          <div key={item.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden flex">
            {/* Product image */}
            <div className="w-24 h-24 flex-shrink-0">
              <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-tight truncate">{item.name}</p>
                  <p className="text-slate-500 text-[10px] truncate">{item.merchant} · {item.weight}</p>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full text-white inline-block mt-0.5" style={{ backgroundColor: item.badgeColor }}>{item.badge}</span>
                </div>
                <button onClick={() => onRemove(item.id)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                    <Minus size={12} className="text-white" />
                  </button>
                  <span className="text-white font-black text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-400 flex items-center justify-center transition-colors">
                    <Plus size={12} className="text-white" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-black text-base">{(item.price * item.qty).toFixed(2)}€</p>
                  <p className="text-slate-600 line-through text-[10px]">{(item.originalPrice * item.qty).toFixed(2)}€</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Sous-total</span>
          <span className="text-white font-bold">{total.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 flex items-center gap-1"><Truck size={12} /> Livraison BIM-Ride</span>
          <span className="text-emerald-400 font-bold">Gratuit 🌿</span>
        </div>
        <div className="border-t border-slate-700 pt-2 flex justify-between">
          <span className="text-white font-black">Total</span>
          <span className="text-orange-400 font-black text-xl">{total.toFixed(2)}€</span>
        </div>
      </div>

      {/* CHECKOUT */}
      <button
        onClick={() => setOrdered(true)}
        className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${ordered ? "bg-emerald-500 text-white" : "bg-orange-500 hover:bg-orange-400 text-white shadow-xl shadow-orange-500/30 active:scale-95"}`}
      >
        {ordered ? "✅ Commande confirmée !" : `⚡ Commander · ${total.toFixed(2)}€`}
      </button>

      {!ordered && (
        <p className="text-slate-600 text-[10px] text-center pb-2">Livraison par BIM-Ride · Zéro émission supplémentaire 🌿</p>
      )}
    </div>
  );
}

// ─── TAB VIEWS ───────────────────────────────────────────────────────────────

function FeedView({ onAddToCart }) {
  const [category, setCategory] = useState("all");
  const [dismissed, setDismissed] = useState([]);
  const [toast, setToast] = useState(null);

  const filtered = DEALS.filter(d => (category === "all" || d.category === category) && !dismissed.includes(d.id));
  const current = filtered[0];

  const handleSwipe = (id, dir) => {
    setDismissed(p => [...p, id]);
    if (dir === "right") {
      setToast("🛒 Ajouté au panier !");
    } else {
      setToast("⏭ Suivant");
    }
    setTimeout(() => setToast(null), 1500);
  };

  const handleAddToCart = (deal) => {
    onAddToCart(deal);
    setToast("🛒 Ajouté au panier !");
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <CategoryStories active={category} onChange={setCategory} />
      <div className="flex-1 px-4 pb-2 overflow-hidden">
        {current ? (
          <DealCard key={current.id} deal={current} onSwipe={handleSwipe} onAddToCart={handleAddToCart} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
            <Zap size={48} className="text-orange-500/30" />
            <p className="text-lg font-bold">Plus de deals dans cette catégorie</p>
            <button onClick={() => setDismissed([])} className="text-orange-400 text-sm underline">Tout revoir</button>
          </div>
        )}
      </div>
      {/* QUICK ACTION BAR */}
      {current && (
        <div className="px-4 pb-4 flex gap-3">
          <button
            onClick={() => handleSwipe(current.id, "left")}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <X size={20} className="text-red-400" /> Passer
          </button>
          <button
            onClick={() => { handleAddToCart(current); handleSwipe(current.id, "right"); }}
            className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-500/30"
          >
            <ShoppingCart size={20} /> Ajouter
          </button>
        </div>
      )}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl z-50 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}

function LiveView() {
  const [bids, setBids] = useState({ 1: 180, 2: 95 });
  const [bidCounts, setBidCounts] = useState({ 1: 14, 2: 6 });
  const [flash, setFlash] = useState({});

  const handleBid = (id) => {
    setBids(p => ({ ...p, [id]: p[id] + 5 }));
    setBidCounts(p => ({ ...p, [id]: p[id] + 1 }));
    setFlash(p => ({ ...p, [id]: true }));
    setTimeout(() => setFlash(p => ({ ...p, [id]: false })), 500);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-red-400 font-black text-sm tracking-widest">LIVE</span>
        <span className="text-slate-500 text-xs ml-auto">{LIVE_LOTS.length} enchères en cours</span>
      </div>

      {LIVE_LOTS.map(lot => (
        <div key={lot.id} className={`bg-slate-800/80 border border-slate-700 rounded-3xl p-5 transition-all duration-300 ${flash[lot.id] ? "border-orange-500 bg-orange-500/10 scale-[1.02]" : ""}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-slate-400 text-xs mb-1">🔥 Lot en enchère</p>
              <h3 className="text-white font-black text-xl">{lot.name}</h3>
            </div>
            <Countdown seconds={lot.timeLeft} />
          </div>

          {/* BID HISTORY */}
          <div className="bg-slate-900/50 rounded-2xl p-3 mb-4 space-y-1.5">
            <p className="text-slate-500 text-xs font-semibold mb-2">Historique des mises</p>
            {lot.bidders.slice(-3).reverse().map((b, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-slate-300 text-xs">{b}</span>
                <span className={`text-xs font-bold ${i === 0 ? "text-orange-400" : "text-slate-500"}`}>
                  {bids[lot.id] - i * 5}€ {i === 0 && "← actuelle"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs">{bidCounts[lot.id]} mises</p>
              <p className="text-3xl font-black text-orange-400">{bids[lot.id]}€</p>
            </div>
            <button
              onClick={() => handleBid(lot.id)}
              className="bg-orange-500 text-white font-black px-6 py-4 rounded-2xl flex items-center gap-2 active:scale-90 transition-all shadow-lg shadow-orange-500/40 hover:bg-orange-400"
            >
              <TrendingUp size={18} /> Miser +5€
            </button>
          </div>
        </div>
      ))}

      <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-3xl p-6 text-center">
        <Flame size={32} className="text-orange-500/40 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">D'autres enchères arrivent bientôt...</p>
      </div>
    </div>
  );
}

function MerchantView() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState(null);
  const [photoAnalysis, setPhotoAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [published, setPublished] = useState(false);

  const DEMO_TRANSCRIPT = "Côte de bœuf Angus 5 kg à moins 40 pourcent";
  const DEMO_PARSED = { Produit: "Côte de bœuf", Variété: "Angus", Quantité: "5 kg", Promo: "40%" };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    setTranscript("");
    setParsed(null);
    let i = 0;
    const iv = setInterval(() => {
      if (i <= DEMO_TRANSCRIPT.length) {
        setTranscript(DEMO_TRANSCRIPT.slice(0, i));
        i++;
      } else {
        clearInterval(iv);
        setIsRecording(false);
        setTimeout(() => setParsed(DEMO_PARSED), 400);
      }
    }, 40);
  };

  const handlePhoto = () => {
    setAnalyzing(true);
    setPhotoAnalysis(null);
    setTimeout(() => {
      setAnalyzing(false);
      setPhotoAnalysis({ status: "✓ Fraîcheur confirmée", details: ["Persillage excellent", "Couleur optimale", "Texture A+"] });
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-xl">Mode Commerçant</h2>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">Zéro Effort ✓</span>
      </div>

      {/* VOICE */}
      <div className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700">
        <p className="text-slate-400 text-sm mb-4 font-semibold">🎙 Dictée vocale</p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleRecord}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? "bg-red-500 shadow-2xl shadow-red-500/50 scale-110" : "bg-orange-500 shadow-xl shadow-orange-500/40 hover:scale-105"}`}
          >
            {isRecording ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
                <MicOff size={36} className="text-white relative z-10" />
              </div>
            ) : (
              <Mic size={36} className="text-white" />
            )}
          </button>
          <p className="text-slate-500 text-xs">{isRecording ? "Parlez maintenant..." : "Appuyez pour dicter votre offre"}</p>
        </div>

        {(transcript || isRecording) && (
          <div className="mt-4 bg-slate-900/50 rounded-2xl p-4">
            <p className="text-slate-400 text-xs mb-2 font-semibold">Transcription en direct :</p>
            <p className="text-slate-200 text-sm font-medium italic">
              "{transcript}"
              {isRecording && <span className="inline-block w-1 h-4 bg-orange-400 ml-1 animate-pulse align-middle" />}
            </p>
          </div>
        )}

        {parsed && (
          <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
            <p className="text-emerald-400 text-xs font-bold mb-3">🤖 Structuré par l'IA :</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(parsed).map(([k, v]) => (
                <div key={k} className="bg-slate-800/50 rounded-xl p-2.5">
                  <p className="text-slate-500 text-[10px] font-semibold uppercase">{k}</p>
                  <p className="text-white font-bold text-sm">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PHOTO ANALYSIS */}
      <div className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700">
        <p className="text-slate-400 text-sm mb-4 font-semibold">📸 Analyse Photo IA</p>
        <button
          onClick={handlePhoto}
          disabled={analyzing}
          className="w-full border-2 border-dashed border-slate-600 rounded-2xl py-8 flex flex-col items-center gap-3 hover:border-orange-500/50 transition-colors"
        >
          {analyzing ? (
            <>
              <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-orange-400 text-sm font-semibold">Analyse en cours...</p>
              <p className="text-slate-500 text-xs">Détection fraîcheur · Calibrage · Couleur</p>
            </>
          ) : photoAnalysis ? (
            <>
              <Check size={32} className="text-emerald-400" />
              <p className="text-emerald-400 font-bold">{photoAnalysis.status}</p>
              <div className="flex gap-2 flex-wrap justify-center">
                {photoAnalysis.details.map(d => (
                  <span key={d} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">{d}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <Camera size={32} className="text-slate-500" />
              <p className="text-slate-400 text-sm">Ajouter une photo produit</p>
              <p className="text-slate-600 text-xs">L'IA analysera la fraîcheur automatiquement</p>
            </>
          )}
        </button>
      </div>

      {/* PUBLISH */}
      {parsed && (
        <button
          onClick={() => setPublished(true)}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${published ? "bg-emerald-500 text-white" : "bg-orange-500 text-white hover:bg-orange-400 shadow-xl shadow-orange-500/30"}`}
        >
          {published ? "✅ Offre publiée !" : "⚡ Lancer l'Offre Flash"}
        </button>
      )}
    </div>
  );
}

function B2BView() {
  const [launched, setLaunched] = useState({});

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-xl">Grande Distribution</h2>
        <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold">B2B PRO</span>
      </div>

      {/* IMPACT GLOBAL */}
      <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 rounded-3xl p-5">
        <p className="text-emerald-300 text-sm font-bold mb-4">🌿 Impact Score — Ce mois</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-black text-white">12 540€</p>
            <p className="text-emerald-400 text-[10px] font-semibold">Anti-inflation</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">8 200€</p>
            <p className="text-emerald-400 text-[10px] font-semibold">Revenus sauvés</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">1.2t</p>
            <p className="text-emerald-400 text-[10px] font-semibold">CO₂ économisé</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-emerald-700/30">
          <p className="text-emerald-500 text-xs">📄 Export Rapport Mairie disponible</p>
        </div>
      </div>

      {/* ALERTES DATES COURTES */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={16} className="text-orange-400" />
          <p className="text-white font-bold text-sm">Alertes Dates Courtes</p>
          <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{ALERTS_B2B.length}</span>
        </div>
        <div className="space-y-3">
          {ALERTS_B2B.map(a => (
            <div key={a.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{a.product}</p>
                <p className="text-slate-400 text-xs">{a.qty} · <span className={`font-bold ${a.daysLeft <= 1 ? "text-red-400" : "text-orange-400"}`}>J-{a.daysLeft}</span></p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold text-sm">+{a.revenue}€</p>
                <p className="text-slate-500 text-[10px]">potentiel</p>
              </div>
              <button
                onClick={() => setLaunched(p => ({ ...p, [a.id]: true }))}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${launched[a.id] ? "bg-emerald-500 text-white" : "bg-orange-500 text-white hover:bg-orange-400 active:scale-95"}`}
              >
                {launched[a.id] ? "✓ Lancé" : "⚡ Lancer"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BIM-ECO */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Truck size={18} className="text-emerald-400" />
          <p className="text-white font-bold">BIM-ECO · Covoiturage Colis</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-slate-300 text-sm">Trajets mutualisés</span>
            <span className="text-white font-bold">48 ce mois</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-slate-300 text-sm">Km économisés</span>
            <span className="text-emerald-400 font-bold">1 240 km 🌿</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-300 text-sm">Points BIM générés</span>
            <span className="text-orange-400 font-bold">3 720 pts</span>
          </div>
        </div>
        <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
          <p className="text-emerald-300 text-xs">🏛️ Rapport Mairie : Commune de Fayence — Réduction CO₂ : <strong>248 kg</strong> grâce au covoiturage BIM</p>
        </div>
      </div>
    </div>
  );
}

// ─── BIM-RIDE DATA ────────────────────────────────────────────────────────────
const BIM_RUNNERS = [
  { id: 1, name: "Marie T.", avatar: "M", points: 2840, rating: 4.9, route: "Fayence → Callian", eta: "12 min", carrying: "Courses de saison", status: "en route", x: 28, y: 42 },
  { id: 2, name: "Jean-Paul R.", avatar: "J", points: 1560, rating: 4.7, route: "Montauroux → Fayence", eta: "8 min", carrying: "Épicerie locale", status: "disponible", x: 65, y: 28 },
  { id: 3, name: "Sophie L.", avatar: "S", points: 3200, rating: 5.0, route: "Seillans → Fayence", eta: "22 min", carrying: "Primeurs Bonnet", status: "en route", x: 18, y: 68 },
  { id: 4, name: "Carlos M.", avatar: "C", points: 980, rating: 4.6, route: "Mons → Callian", eta: "35 min", carrying: "Vide", status: "disponible", x: 72, y: 62 },
  { id: 5, name: "Isabelle D.", avatar: "I", points: 4100, rating: 4.8, route: "Fayence → Tourrettes", eta: "5 min", carrying: "Fromages Martin", status: "en route", x: 45, y: 55 },
];

const VILLAGE_POINTS = [
  { name: "Fayence", x: 42, y: 48, type: "hub" },
  { name: "Callian", x: 68, y: 35, type: "village" },
  { name: "Montauroux", x: 60, y: 20, type: "village" },
  { name: "Seillans", x: 15, y: 60, type: "village" },
  { name: "Tourrettes", x: 38, y: 65, type: "village" },
  { name: "Mons", x: 75, y: 55, type: "village" },
];

function BimRideView() {
  const [runners, setRunners] = useState(BIM_RUNNERS);
  const [selected, setSelected] = useState(null);
  const [contacted, setContacted] = useState({});
  const [requestSent, setRequestSent] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const [trackingRunner, setTrackingRunner] = useState(null);
  const [trackProgress, setTrackProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRunners(prev => prev.map(r => ({
        ...r,
        x: Math.max(5, Math.min(90, r.x + (Math.random() - 0.5) * 1.2)),
        y: Math.max(5, Math.min(90, r.y + (Math.random() - 0.5) * 1.2)),
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showTracking) return;
    setTrackProgress(0);
    const iv = setInterval(() => {
      setTrackProgress(p => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 0.4;
      });
    }, 80);
    return () => clearInterval(iv);
  }, [showTracking]);

  const handleContact = (runner) => { setSelected(runner); };

  const handleSendRequest = () => {
    setRequestSent(selected.id);
    setContacted(p => ({ ...p, [selected.id]: true }));
    setTimeout(() => {
      setSelected(null);
      setShowTracking(true);
      setTrackingRunner(BIM_RUNNERS[0]);
    }, 1800);
  };

  if (showTracking && trackingRunner) {
    const runner = trackingRunner;
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowTracking(false)} className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center">
            <X size={16} className="text-slate-300" />
          </button>
          <div>
            <h2 className="text-white font-black text-lg">Suivi Live BIM-Ride</h2>
            <p className="text-slate-500 text-xs">Votre voisin est en route 🚗</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
          </span>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700" style={{ height: 260 }}>
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#f97316" strokeWidth="2" strokeDasharray="8 4"/>
            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#f97316" strokeWidth="1" strokeDasharray="6 4"/>
            <line x1="10%" y1="30%" x2="90%" y2="70%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4"/>
          </svg>
          <svg className="absolute inset-0 w-full h-full">
            <line x1="10%" y1="75%" x2={`${10 + trackProgress * 0.8}%`} y2={`${75 - trackProgress * 0.35}%`} stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="absolute" style={{ left: "8%", top: "70%" }}>
            <div className="w-4 h-4 rounded-full bg-slate-500 border-2 border-slate-400 -translate-x-1/2 -translate-y-1/2" />
            <span className="absolute text-[9px] text-slate-400 whitespace-nowrap mt-1 left-1/2 -translate-x-1/2 top-3">Départ</span>
          </div>
          <div className="absolute" style={{ left: "88%", top: "20%" }}>
            <div className="w-5 h-5 rounded-full bg-orange-500/30 border-2 border-orange-400 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <span className="absolute text-[9px] text-orange-300 whitespace-nowrap left-1/2 -translate-x-1/2 top-3">Chez vous</span>
          </div>
          <div className="absolute transition-all duration-[500ms]" style={{ left: `${10 + trackProgress * 0.8}%`, top: `${75 - trackProgress * 0.35}%` }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-white -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white font-black text-xs shadow-lg">
              {runner.avatar}
            </div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap">{runner.name}</div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-orange-400" />
              <span className="text-white font-bold text-sm">ETA : {runner.eta}</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold">Zéro émission ↗</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-emerald-400 transition-all duration-500 rounded-full" style={{ width: `${trackProgress}%` }} />
        </div>
        <p className="text-slate-500 text-xs text-center">{Math.round(trackProgress)}% du trajet effectué</p>

        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-black text-xl flex-shrink-0">{runner.avatar}</div>
          <div className="flex-1">
            <p className="text-white font-bold">{runner.name}</p>
            <p className="text-slate-400 text-xs">{runner.route}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-400 text-xs">★ {runner.rating}</span>
              <span className="text-slate-600">·</span>
              <span className="text-orange-400 text-xs font-bold">{runner.points.toLocaleString()} pts BIM</span>
            </div>
          </div>
          <button className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center">
            <MessageCircle size={16} className="text-emerald-400" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Leaf size={24} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-emerald-300 font-bold text-sm">🏅 Zéro Émission Supplémentaire</p>
            <p className="text-slate-400 text-xs">Ce trajet était déjà effectué · Aucun CO₂ additionnel · Impact positif calculé</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 mx-4 mt-2 rounded-3xl overflow-hidden border border-slate-700/50 flex-shrink-0" style={{ height: 300 }}>
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[20, 40, 60, 80].map(v => (
            <g key={v}>
              <line x1={`${v}%`} y1="0" x2={`${v}%`} y2="100%" stroke="#94a3b8" strokeWidth="1" />
              <line x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="#94a3b8" strokeWidth="1" />
            </g>
          ))}
        </svg>
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <line x1="15%" y1="62%" x2="42%" y2="48%" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="42%" y1="48%" x2="68%" y2="35%" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="42%" y1="48%" x2="38%" y2="65%" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="60%" y1="20%" x2="68%" y2="35%" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="42%" y1="48%" x2="75%" y2="55%" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {VILLAGE_POINTS.map(v => (
          <div key={v.name} className="absolute" style={{ left: `${v.x}%`, top: `${v.y}%` }}>
            <div className={`w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 ${v.type === "hub" ? "bg-orange-500 border-2 border-orange-300 w-4 h-4" : "bg-slate-500 border border-slate-400"}`} />
            <span className={`absolute text-[8px] whitespace-nowrap mt-0.5 left-1/2 -translate-x-1/2 top-2.5 ${v.type === "hub" ? "text-orange-300 font-bold" : "text-slate-500"}`}>{v.name}</span>
          </div>
        ))}
        {runners.map(runner => (
          <div key={runner.id} className="absolute transition-all duration-[2000ms] cursor-pointer" style={{ left: `${runner.x}%`, top: `${runner.y}%` }} onClick={() => handleContact(runner)}>
            <div className={`w-9 h-9 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white font-black text-xs shadow-lg transition-transform hover:scale-110 ${contacted[runner.id] ? "bg-emerald-500 border-emerald-300" : runner.status === "disponible" ? "bg-orange-500 border-orange-300" : "bg-slate-700 border-orange-500"}`}>
              {runner.avatar}
              {runner.status === "en route" && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
          <MapPin size={12} className="text-orange-400" />
          <span className="text-white text-xs font-bold">Canton de Fayence</span>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-slate-300 text-[9px]">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-700 border border-orange-500" />
            <span className="text-slate-300 text-[9px]">En route</span>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-[9px] font-bold">{runners.length} BIM-Runners actifs</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-3">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2.5">
          <Leaf size={16} className="text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-300 text-xs font-bold">Zéro Émission Supplémentaire — Le trajet est déjà effectué par votre voisin !</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs font-semibold mb-2 px-1">BIM-Runners à proximité</p>
          <div className="space-y-2.5">
            {runners.map(runner => (
              <div key={runner.id} className={`bg-slate-800/80 border rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.98] ${contacted[runner.id] ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-700 hover:border-slate-600"}`} onClick={() => handleContact(runner)}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 ${contacted[runner.id] ? "bg-emerald-500" : "bg-gradient-to-br from-orange-500 to-red-500"}`}>
                  {runner.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-white font-bold text-sm truncate">{runner.name}</p>
                    <span className="text-yellow-400 text-[10px]">★ {runner.rating}</span>
                  </div>
                  <p className="text-slate-400 text-xs truncate">🗺 {runner.route}</p>
                  <p className="text-slate-500 text-[10px] truncate">🛍 {runner.carrying}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-orange-400 font-bold text-sm">{runner.eta}</p>
                  <p className="text-orange-300 text-[9px] font-bold">{runner.points.toLocaleString()} pts</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${runner.status === "disponible" ? "bg-orange-500/20 text-orange-300" : "bg-slate-700 text-slate-400"}`}>{runner.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-700/30 rounded-3xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-orange-400" />
            <p className="text-white font-bold text-sm">Bénéfices pour le BIM-Runner</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-orange-500/10 rounded-xl p-3 text-center">
              <p className="text-orange-400 text-xl font-black">-5%</p>
              <p className="text-slate-400 text-[10px]">Réduction immédiate</p>
            </div>
            <div className="bg-orange-500/10 rounded-xl p-3 text-center">
              <p className="text-orange-400 text-xl font-black">+250</p>
              <p className="text-slate-400 text-[10px]">Points BIM cumulés</p>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] mt-2 text-center">Points utilisables sur vos prochains achats BIM</p>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-700 rounded-t-3xl p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-black text-2xl">{selected.avatar}</div>
              <div>
                <h3 className="text-white font-black text-xl">{selected.name}</h3>
                <p className="text-slate-400 text-sm">{selected.route}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-400 text-sm">★ {selected.rating}</span>
                  <span className="text-orange-400 text-xs font-bold">{selected.points.toLocaleString()} pts BIM</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Trajet actuel</span>
                <span className="text-white font-bold">{selected.route}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">ETA estimé</span>
                <span className="text-orange-400 font-bold">{selected.eta}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Statut</span>
                <span className={`font-bold ${selected.status === "disponible" ? "text-orange-300" : "text-slate-400"}`}>{selected.status}</span>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-center gap-3">
              <Leaf size={16} className="text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-300 text-xs">🏅 Trajet déjà effectué · Zéro émission supplémentaire · Mission anti-gaspi ✓</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3">
              <p className="text-orange-300 text-xs font-bold mb-1">🎁 Bénéfice pour {selected.name}</p>
              <p className="text-slate-400 text-xs">Réduction immédiate de 5% ou +250 Points BIM cumulés sur ses prochains achats BIM</p>
            </div>
            <button onClick={handleSendRequest} className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${requestSent === selected.id ? "bg-emerald-500 text-white" : "bg-orange-500 text-white hover:bg-orange-400 shadow-xl shadow-orange-500/30 active:scale-95"}`}>
              {requestSent === selected.id ? "✅ Demande envoyée !" : "🚗 Demander un dépannage"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function BIM() {
  const [tab, setTab] = useState("feed");
  const [cart, setCart] = useState([]);

  const addToCart = (deal) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === deal.id);
      if (existing) {
        return prev.map(i => i.id === deal.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...deal, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    }
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const tabs = [
    { id: "feed", label: "Deals", icon: Zap },
    { id: "live", label: "Live", icon: Flame },
    { id: "bimride", label: "BIM-Ride", icon: Navigation },
    { id: "merchant", label: "Pro", icon: Mic },
    { id: "b2b", label: "B2B", icon: BarChart2 },
    { id: "cart", label: "Panier", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col max-w-md mx-auto relative overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3 z-10">
        <div className="flex items-center gap-2">
          <img
            src="data:image/png;base64,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"
            alt="BIM"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-tight">BIM</h1>
            <p className="text-slate-500 text-[9px] font-semibold tracking-widest leading-tight">LE CERCLE VERTUEUX ALIMENTAIRE</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center">
            <MapPin size={16} className="text-orange-400" />
          </button>
          <button className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center relative">
            <Bell size={16} className="text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
          {/* CART HEADER SHORTCUT */}
          <button
            onClick={() => setTab("cart")}
            className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center relative"
          >
            <ShoppingCart size={16} className={cartCount > 0 ? "text-orange-400" : "text-slate-300"} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5 shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto pb-24">
        {tab === "feed" && <FeedView onAddToCart={addToCart} />}
        {tab === "live" && <LiveView />}
        {tab === "bimride" && <BimRideView />}
        {tab === "merchant" && <MerchantView />}
        {tab === "b2b" && <B2BView />}
        {tab === "cart" && <CartView cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} onClear={clearCart} />}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-1 py-1.5 z-20">
        <div className="flex justify-around">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${active ? "bg-orange-500/15" : ""}`}
              >
                <Icon size={18} className={active ? "text-orange-400" : "text-slate-500"} />
                <span className={`text-[9px] font-bold ${active ? "text-orange-400" : "text-slate-500"}`}>{t.label}</span>
                {/* LIVE indicator */}
                {t.id === "live" && (
                  <span className="absolute w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" style={{ top: "2px", right: "6px" }} />
                )}
                {/* BIM-Ride indicator */}
                {t.id === "bimride" && (
                  <span className="absolute w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" style={{ top: "2px", right: "4px" }} />
                )}
                {/* CART BADGE */}
                {t.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
