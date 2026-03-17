// ============================================
// BIM App — Configuration
// ============================================

const CONFIG = {
  // Supabase
  SUPABASE_URL: 'https://mhouosnednmlrlmwjhfg.supabase.co',
  SUPABASE_KEY: 'sb_publishable_PZD6BwwPv4Jm_CNpjnNm8Q_niI9AxO4',

  // App
  APP_NAME: 'BIM',
  APP_URL: 'https://bim-app-nu.vercel.app',
  DEFAULT_RADIUS_KM: 10,
  DEMO_MODE: true, // true = charger les deals de démo, false = Supabase uniquement

  // Catégories
  CATEGORIES: {
    viande:  { label: 'Viande',          emoji: '🥩', color: '#ef4444' },
    poisson: { label: 'Poisson',         emoji: '🐟', color: '#0891b2' },
    cave:    { label: 'Cave',            emoji: '🍷', color: '#8b5cf6' },
    primeur: { label: 'Primeur',         emoji: '🥦', color: '#10b981' },
    laitier: { label: 'Laitier',         emoji: '🧀', color: '#eab308' },
    pret:    { label: 'Prêt à manger',   emoji: '🍱', color: '#3b82f6' },
  },

  // Géolocalisation par défaut (Fayence, Var)
  DEFAULT_LAT: 43.6264,
  DEFAULT_LNG: 6.6931,

  // Notifications
  NTFY_CHANNEL: 'bim-app-vertueux-2026',
};

// Données de démo (désactivé quand DEMO_MODE = false)
const DEMO_DEALS = [
  { id:1, cat:'viande', name:'Cote de Boeuf Angus', merchant:'Boucherie Fabre', origin:'VAR', discount:60, price:18.90, orig:47.20, weight:'1.2 kg', expiry:'Aujourd\'hui 20h00', timer:'4h 23m', ai:'Persillage excellent - Couleur optimale - Fraicheur OK', badge:'BIM TERROIR', badgeColor:'#10B981', co2:1.4, bg:'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80', photo:'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80', desc:'Race Angus elevee en plein air, alimentation 100% naturelle.' },
  { id:2, cat:'cave', name:'Lot 12 Rose Provence', merchant:'Cave Cooperative', origin:'AOP', discount:45, price:54, orig:98, weight:'12 x 75cl', expiry:'Demain 18h00', timer:'22h 00m', ai:null, badge:'ENCHERE', badgeColor:'#F97316', co2:0.8, bg:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80', photo:'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=200&q=80', desc:'Cuvee Tradition, recoltee a la main. Parfait pour l\'ete.' },
  { id:3, cat:'primeur', name:'Tomates Coeur de Boeuf', merchant:'Maraicher Bonnet', origin:'VAR', discount:50, price:2.40, orig:4.80, weight:'2 kg', expiry:'Aujourd\'hui 22h00', timer:'2h 10m', ai:'Maturite optimale - Arome intense - Calibre A', badge:'BIM TERROIR', badgeColor:'#10B981', co2:0.3, bg:'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80', photo:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&q=80', desc:'Variete ancienne, sans traitement chimique.' },
  { id:4, cat:'laitier', name:'Comte AOP 24 mois', merchant:'Fromagerie Martin', origin:'Jura', discount:35, price:12.50, orig:19.20, weight:'500g', expiry:'Dans 3 jours', timer:'72h 00m', ai:'Affinage parfait - Notes noisette - Texture ideale', badge:'PRIX CHOC', badgeColor:'#F97316', co2:0.5, bg:'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80', photo:'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=200&q=80', desc:'Selectionne par notre affineur. Quantites tres limitees.' },
  { id:5, cat:'pret', name:'Plateau Sushi Premium', merchant:'Sushi Zen', origin:'Local', discount:40, price:14.90, orig:24.90, weight:'32 pieces', expiry:'Ce soir 21h00', timer:'3h 00m', ai:'Fraicheur garantie - Poisson du jour - Qualite restaurant', badge:'FLASH', badgeColor:'#6366F1', co2:0.2, bg:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80', photo:'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=200&q=80', desc:'Saumon, thon, crevettes. Stock limite.' },
  { id:6, cat:'poisson', name:'Daurade royale entiere', merchant:'Poissonnier du Var', origin:'Local', discount:45, price:8.25, orig:15.00, weight:'1.2 kg', expiry:'Aujourd\'hui 19h00', timer:'6h 00m', ai:'Peche ce matin - Fraicheur garantie - Yeux brillants', badge:'FLASH', badgeColor:'#0891b2', co2:0.2, bg:'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80', photo:'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=200&q=80', desc:'Daurade royale peche ce matin en Mediterranee, fraicheur exceptionnelle.' },
  { id:7, cat:'poisson', name:'Filets de saumon frais', merchant:'Maree du Var', origin:'Local', discount:40, price:11.90, orig:19.90, weight:'800 g', expiry:'Ce soir 20h00', timer:'4h 30m', ai:'Saumon atlantique durable - Calibre premium - DLC aujourd\'hui', badge:'PECHE DU JOUR', badgeColor:'#0e7490', co2:0.2, bg:'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80', photo:'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80', desc:'Filets de saumon atlantique, peche durable, parfaits pour ce soir.' },
];
