  // ---- Icônes de l'interface (refonte) : une seule famille, traits arrondis sur une grille de 24, redessinées d'après la planche validée ----
  // Blanc par défaut (currentColor, suit le thème) ; une couleur d'accent seulement là où la planche en met une.
  const ICO_COL = { pink: '#f03c8c', yellow: '#ffcf4a', red: '#cf3036', orange: '#ff9f1c', blue: '#5b8cff', green: '#30a46c' };
  const ICO = {
    signaler: '<path d="M5 10.5v4h2.6L14 18.5V6.5L7.6 10.5z"/><path d="M7.6 14.5l1.2 4.5h2.4l-1-4"/><path d="M17 9.5a3.6 3.6 0 0 1 0 5.6M19.3 7.4a6.6 6.6 0 0 1 0 9.8"/>',
    carte: '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    agenda: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><rect x="7" y="13" width="2.2" height="2" rx=".4"/><rect x="11" y="13" width="2.2" height="2" rx=".4"/><rect x="15" y="13" width="2.2" height="2" rx=".4"/><rect x="7" y="16.6" width="2.2" height="2" rx=".4"/><rect x="11" y="16.6" width="2.2" height="2" rx=".4"/>',
    actions: '<path d="M13.5 2.5L5 13.5h6.2L10 21.5l8.5-11.2h-6.2z"/>',
    reglages: '<path d="M4 6h3.2M10.8 6H20M4 12h9.2M16.8 12H20M4 18h5.2M12.8 18H20"/><circle cx="9" cy="6" r="1.8"/><circle cx="15" cy="12" r="1.8"/><circle cx="11" cy="18" r="1.8"/>',
    position: '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.6"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
    chercher: '<circle cx="14" cy="10" r="6"/><path d="M9.8 14.2L4 20"/>',
    calques: '<path d="M12 3.5l8.5 4.7-8.5 4.7-8.5-4.7z"/><path d="M3.5 12.5l8.5 4.7 8.5-4.7"/>',
    micro: '<rect x="8.5" y="3" width="6" height="11" rx="3"/><path d="M5 11a6.5 6.5 0 0 0 13 0M11.5 17.5V21M8 21h7"/><circle cx="19.5" cy="4.5" r="2" fill="#cf3036" stroke="none"/>',
    drapeau: '<path d="M6 21.5V5"/><circle cx="6" cy="3.6" r="1.1"/><path d="M6 5.5h12.5l-2.6 4 2.6 4H6"/>',
    zone: '<path d="M7.5 20s-4.8-4.8-4.8-8.6a4.8 4.8 0 0 1 9.6 0C12.3 15.2 7.5 20 7.5 20z"/><circle cx="7.5" cy="11.4" r="1.6"/><path d="M15 8h6M15 12.5h6M15 17h6"/>',
    violence: '<path d="M12 3a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.8-1.2A8.5 8.5 0 1 0 12 3z"/><path d="M12 7.5v5.2M12 16.2v.01"/>',
    effacer: '<path d="M14.5 4.5l5 5-9 9H6.2l-2.7-2.7a1.4 1.4 0 0 1 0-2z"/><path d="M9.6 9.4l5 5M14 20.5h7"/>',
    annoncer: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 12.8v5.4M9.3 15.5h5.4"/>',
    arretes: '<path d="M13.5 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h5"/><path d="M13.5 3L19 8.5V12M13.5 3v5.5H19"/><path d="M8 12h6M8 15.5h3"/><circle cx="17" cy="17.5" r="3.5"/><path d="M15.6 17.5l1 1 1.8-1.9"/>',
    partager: '<rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5M20.5 14.5v.01M14.5 20.5h.01M17.5 20.5h3v-3"/>',
    manif: '<circle cx="7" cy="10" r="2"/><circle cx="12.5" cy="8.5" r="2"/><path d="M3.5 20a3.5 3.5 0 0 1 7 0M9 18.5a3.5 3.5 0 0 1 7 0"/><path d="M18 15V3.5h3.5l-1 1.6 1 1.6H18"/>',
    blocus: '<path d="M3 9.5h18v5H3z"/><path d="M7.5 9.5l-3 5M12 9.5l-3 5M16.5 9.5l-3 5M21 9.5l-3 5"/><path d="M5.5 14.5V20M18.5 14.5V20M5.5 9.5V6M18.5 9.5V6"/><circle cx="5.5" cy="4.8" r="1.1"/><circle cx="18.5" cy="4.8" r="1.1"/>',
    rassemblement: '<path d="M12 21.5s-7-6.6-7-12a7 7 0 0 1 14 0c0 5.4-7 12-7 12z"/><circle cx="12" cy="7.6" r="1.4"/><circle cx="8.9" cy="8.8" r="1.1"/><circle cx="15.1" cy="8.8" r="1.1"/><path d="M9.3 12.8a2.7 2.7 0 0 1 5.4 0"/>',
    ag: '<path d="M12 3.5a4 4 0 0 1 3.5 6l.6 2-2-.6A4 4 0 1 1 12 3.5z"/><path d="M7 11.5a4 4 0 0 1 3.6 5.8l.5 2-2-.5A4 4 0 1 1 7 11.5z"/><path d="M17 11.5a4 4 0 0 0-3.6 5.8l-.5 2 2-.5A4 4 0 1 0 17 11.5z"/>',
    sac: '<path d="M6 9.5a6 6 0 0 1 12 0v10a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z"/><path d="M9 5V3h6v2M9 14h6v4H9z"/>',
    droits: '<path d="M12 3.5V20M7.5 21h9M5 7h14"/><path d="M5 7l-3 6.5h6zM19 7l-3 6.5h6z"/><path d="M2 13.5a3 3 0 0 0 6 0M16 13.5a3 3 0 0 0 6 0"/><circle cx="12" cy="3.5" r=".6"/>',
    grandir: '<path d="M3.5 10v4h3l7 4V6l-7 4z"/><path d="M6.5 14l1 4.5H10l-.6-3.5"/><path d="M19 9v6M16 12h6"/>',
    apparence: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.8 0-1.3-1.3-1.6-1.3-2.7 0-.9.8-1.5 1.7-1.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    securite: '<path d="M12 3l7.5 3v5.5c0 4.7-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.8-7.5-9.5V6z"/><circle cx="12" cy="10.5" r="1.8"/><path d="M12 12.3v3.2"/>',
    soutenir: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    apropos: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.01"/>',
  };
  // Couleur d'accent de chaque type d'événement (cartes de l'agenda, épingles, filtres)
  const TYPE_ICO = { manif: ['manif', 'pink'], blocus: ['blocus', 'orange'], rassemblement: ['rassemblement', 'blue'], ag: ['ag', 'green'] };
  // Icônes de la planche générée (public/icons-ui/*.png, fond transparent). Les colorées s'affichent telles quelles ;
  // les blanches servent de MASQUE, peintes dans la couleur du texte : elles suivent le thème clair ou sombre.
  // Une couleur passée en paramètre repeint n'importe quelle icône (masque). Sans image (apparence, à propos) : le dessin SVG ci-dessus.
  const ICO_PNG = new Set(['signaler', 'carte', 'agenda', 'actions', 'reglages', 'position', 'chercher', 'calques', 'micro', 'sos', 'drapeau-manif', 'zone',
    'violence', 'effacer', 'annoncer', 'arretes', 'legal', 'partager', 'manif', 'blocus', 'rassemblement', 'ag', 'zone-calme', 'medic',
    'drapeau', 'sac', 'droits', 'grandir', 'securite', 'soutenir']);
  const ICO_COLORED = new Set(['signaler', 'actions', 'micro', 'sos', 'drapeau-manif', 'violence', 'manif', 'blocus', 'rassemblement', 'ag', 'zone-calme']);
  const icoHtml = (name, size = 22, color = null) => {
    if (!ICO_PNG.has(name)) return icoSvg(name, size, color);
    if (!color && ICO_COLORED.has(name)) return `<img class="ico-png" src="/icons-ui/${name}.png" width="${size}" height="${size}" alt="" aria-hidden="true">`;
    return `<span class="ico-png ico-mask" aria-hidden="true" style="--m:url(/icons-ui/${name}.png);width:${size}px;height:${size}px;background:${color ? (ICO_COL[color] || color) : 'currentColor'}"></span>`;
  };
  const icoSvg = (name, size = 22, color = null) => `<svg class="ico-svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color ? (ICO_COL[color] || color) : 'currentColor'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[name] || ''}</svg>`;
  // Catégories de signalement qui ont leur icône sur la planche : en blanc sur la pastille colorée de la carte
  const CAT_ICO = { medic: 'medic', legal: 'legal', calme: 'zone-calme' };
  const catIco = (c, size = 20) => (c && CAT_ICO[c.id] ? icoHtml(CAT_ICO[c.id], size, '#fff') : c ? c.glyph : '');
  const icoEl = (name, size, color) => { const t = document.createElement('template'); t.innerHTML = icoHtml(name, size, color); return t.content.firstChild; };
