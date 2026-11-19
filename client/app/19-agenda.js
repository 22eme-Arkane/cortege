  // ---- Agenda : manifs, blocus, rassemblements, AG ----
  const EVT = Object.fromEntries((cfg.eventTypes || []).map(t => [t.id, t]));
  const evLayer = L.layerGroup().addTo(map);
  const evMarkers = new Map();
  let selectedEv = null;
  const fmtWhen = x => new Date(x).toLocaleString(I18N.locale, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const fmtHour = x => new Date(x).toLocaleTimeString(I18N.locale, { hour: '2-digit', minute: '2-digit' });
  // Sur la carte : les événements du moment (de 12 h avant à 10 h après le départ), plus celui choisi dans l'agenda
  // Masqués par le filtre « Agenda » sauf celui que la personne vient d'ouvrir dans l'agenda
  // Refonte : visibles dès 7 jours avant le départ (et jusqu'à 6 h après), à partir du zoom région
  const EV_AHEAD = 7 * 24 * 60 * MIN, EV_ZOOM = 6;
  const evOnMap = e => e.id === selectedEv || (!evHidden && map.getZoom() >= EV_ZOOM && e.start - EV_AHEAD < Date.now() && e.start + 6 * 60 * MIN > Date.now());
  map.on('zoomend', () => { const z = map.getZoom() >= EV_ZOOM; if (z !== evOnMap.z) { evOnMap.z = z; renderEvents(); } });
  function evPopup(e) {
    const ty = EVT[e.type] || { glyph: '📍', label: '' };
    const root = el('div');
    root.append(el('div', { class: 'pop-title' }, ty.glyph + ' ', e.title));
    root.append(el('div', { class: 'pop-meta' }, `${ty.label} · ${fmtWhen(e.start)}`));
    root.append(el('div', { class: 'pop-meta' }, '📍 ' + e.place + (me ? ' · ' + fmtDist(dist(me, [e.lat, e.lng])) : '')));
    if (e.note) root.append(el('p', { class: 'pop-note' }, e.note));
    // Arrêté qui interdit la manif ou un périmètre qu'elle traverse : dit clairement, avec le texte officiel
    const ban = ordBan?.(e);
    // La zone connue est la commune ou le département entier : le texte dit seulement qu'un arrêté s'applique ici, à lire pour savoir ce qu'il couvre
    if (ban) root.append(el('div', { class: 'pop-calm-warn' }, (ban.items.some(x => x.k === 'manif') ? '🚫 ' + t('Arrêté d’interdiction de manifester en vigueur ici') : '⛔ ' + t('Arrêté avec un périmètre interdit en vigueur ici')) + ' (' + ban.name + '). ' + t('Lis-le pour savoir exactement ce qu’il couvre.'),
      ban.src ? el('div', {}, el('a', { href: ban.src, target: '_blank', rel: 'noopener noreferrer' }, t('Lire l’arrêté') + ' →')) : ''));
    root.append(el('div', { class: 'pop-meta' }, t('Publié par {who}', { who: e.by })));
    if (e.link) root.append(el('a', { class: 'ann-link', href: e.link, target: '_blank', rel: 'noopener noreferrer' }, 'Voir la carte d’origine →'));
    if (orga && (orga.admin || (!!e.ob && e.ob === orga.ob))) {
      const rm = el('button', { class: 'danger' }, 'Retirer cet événement');
      rm.onclick = async () => {
        if (!rm.dataset.armed) { rm.dataset.armed = '1'; rm.textContent = t('Confirmer le retrait'); return; }
        try { await orgaFetch('/api/events/' + e.id, { method: 'DELETE' }); toast('Événement retiré'); map.closePopup(); sync(); } catch (err) { toast(err.message); }
      };
      root.append(el('div', { class: 'pop-actions orga', style: 'grid-template-columns:1fr' }, rm));
    }
    return root;
  }
  function renderEvents() {
    evLayer.clearLayers(); evMarkers.clear();
    for (const e of evCache.e.filter(evOnMap)) {
      const ty = EVT[e.type] || { glyph: '📍' };
      if (e.route) {
        L.polyline(e.route, { color: themeCol('--route', '#f6a29c'), weight: 5, opacity: .9, dashArray: '10 8', interactive: false }).addTo(evLayer);
        if (e.end) L.marker(e.route[e.route.length - 1], { icon: L.divIcon({ className: '', iconSize: [30, 30], html: '<div class="ev-end">🏁</div>' }), title: t('Dispersion prévue'), keyboard: false })
          .bindPopup(() => el('div', {}, t('Dispersion prévue : {title}', { title: e.title }))).addTo(evLayer);
      }
      const m = L.marker([e.lat, e.lng], { icon: L.divIcon({ className: '', iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -18], html: `<div class="ev-pin">${ty.glyph}${e.start - Date.now() > 12 * 60 * MIN ? `<span class="ev-date">${new Date(e.start).toLocaleDateString(I18N.locale, { day: 'numeric', month: 'short' })}</span>` : ''}</div>` }),
        title: e.title, zIndexOffset: 500 }).bindPopup(() => evPopup(e)).addTo(evLayer);
      evMarkers.set(e.id, m);
    }
    if (!$('#sheetAgenda').hidden) renderAgenda();
    try { drawFlow(); } catch {}
    renderFilters();
  }
  // Thème changé (réglage, système ou mode manif) : les parcours prennent la couleur du nouveau thème
  window.addEventListener('cortege-theme', () => { try { renderEvents(); drawFlow(); } catch {} });
  function renderAgenda() {
    const scope = document.querySelector('input[name="agScope"]:checked').value;
    const c = map.getCenter(), ref = me || [c.lat, c.lng], now = Date.now();
    let list = evCache.e.filter(e => e.start + 3 * 60 * MIN > now);
    renderCal(list);
    if (agSel) list = list.filter(e => dayKey(e.start) === agSel);
    if (scope === 'near') list = list.filter(e => dist(ref, [e.lat, e.lng]) <= 50_000);
    list.sort((a, b) => a.start - b.start);
    const ol = $('#agList'); ol.textContent = '';
    $('#agEmpty').hidden = list.length > 0;
    $('#agEmpty').textContent = agSel ? t('Rien d’annoncé ce jour-là.') : t(scope === 'all' ? 'Aucune mobilisation annoncée pour l’instant.'
      : me ? t('Rien d’annoncé à moins de 50 km de toi. Regarde « Toute la France ».') : t('Rien d’annoncé à moins de 50 km du centre de la carte. Active ta position ou regarde « Toute la France ».'));
    let day = '';
    if (list.length > 200) ol.append(el('li', { class: 'ag-day' }, t('{n} événements : les 200 premiers', { n: list.length })));
    for (const e of list.slice(0, 200)) {
      const d = agDay(e, now);
      if (d !== day) { day = d; ol.append(el('li', { class: 'ag-day' }, d)); }
      ol.append(agRow(e, ref));
    }
  }
  // ---- Calendrier du mois (repris d'Armana) : une pastille par jour qui a un événement, un appui filtre la liste ----
  const dayKey = x => { const d = new Date(x); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  let agSel = null, agMonth = (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); })();
  function renderCal(list) {
    const box = $('#agCal'); if (!box) return; box.textContent = '';
    const days = new Map(); for (const e of list) { const k = dayKey(Math.max(e.start, Date.now())); days.set(k, (days.get(k) || 0) + 1); }
    const now = new Date(), first = new Date(now.getFullYear(), now.getMonth(), 1);
    const y = agMonth.getFullYear(), m = agMonth.getMonth();
    const prev = el('button', { class: 'cal-nav', 'aria-label': t('Mois précédent') }, '‹'), next = el('button', { class: 'cal-nav', 'aria-label': t('Mois suivant') }, '›');
    prev.disabled = agMonth <= first;
    prev.onclick = () => { agMonth = new Date(y, m - 1, 1); agSel = null; renderAgenda(); };
    next.onclick = () => { agMonth = new Date(y, m + 1, 1); agSel = null; renderAgenda(); };
    box.append(el('div', { class: 'cal-head' }, prev, el('b', {}, agMonth.toLocaleDateString(I18N.locale, { month: 'long', year: 'numeric' })), next));
    const grid = el('div', { class: 'cal-grid' });
    for (let i = 0; i < 7; i++) grid.append(el('span', { class: 'cal-wd' }, new Date(2024, 0, 1 + i).toLocaleDateString(I18N.locale, { weekday: 'narrow' })));
    const pad = (new Date(y, m, 1).getDay() + 6) % 7; for (let i = 0; i < pad; i++) grid.append(el('span'));
    const today = dayKey(now), nDays = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= nDays; d++) {
      const k = y + '-' + (m + 1) + '-' + d, past = new Date(y, m, d + 1) <= now, n = days.get(k) || 0;
      const b = el('button', { class: 'cal-day' + (k === today ? ' today' : '') + (k === agSel ? ' sel' : '') + (n ? ' has' : ''), 'aria-pressed': String(k === agSel) }, String(d), n ? el('i', { 'aria-hidden': 'true' }) : '');
      b.disabled = past;
      b.onclick = () => { agSel = agSel === k ? null : k; renderAgenda(); };
      grid.append(b);
    }
    box.append(grid);
    if (agSel) { const c = el('button', { class: 'link-btn cal-all' }, t('Voir tout l’agenda')); c.onclick = () => { agSel = null; renderAgenda(); }; box.append(c); }
  }
  const agDay = (e, now) => e.start < now ? t('En cours') : new Date(e.start).toLocaleDateString(I18N.locale, { weekday: 'long', day: 'numeric', month: 'long' });
  function agRow(e, ref) {
    const ty = EVT[e.type] || { glyph: '📍' };
    const btn = el('button', { 'aria-label': e.title },
      el('span', { class: 'g', style: '--c:var(--accent)' }, ty.glyph),
      el('span', { class: 't' }, el('div', { class: 'l' }, e.title), el('div', { class: 's' }, `${fmtHour(e.start)} · ${e.place} · ${e.by}`),
        ordBan?.(e) ? el('div', { class: 's ag-ban' }, '🚫 ' + t('Arrêté en vigueur dans la zone')) : ''),
      el('span', { class: 'd' }, fmtDist(dist(ref, [e.lat, e.lng]))));
    btn.onclick = () => showEvent(e);
    return el('li', {}, btn);
  }
  // Infos : les 4 prochains événements à moins de 50 km
  function feedAgenda(ref) {
    const now = Date.now(), ol = $('#feedAg'); ol.textContent = '';
    const list = evCache.e.filter(e => e.start + 3 * 60 * MIN > now && dist(ref, [e.lat, e.lng]) <= 50_000).sort((a, b) => a.start - b.start).slice(0, 4);
    $('#feedAgEmpty').hidden = list.length > 0;
    let day = '';
    for (const e of list) { const d = agDay(e, now); if (d !== day) { day = d; ol.append(el('li', { class: 'ag-day' }, d)); } ol.append(agRow(e, ref)); }
  }
  function showEvent(e) {
    closeSheets(); setFollow(false);
    selectedEv = e.id; renderEvents();
    if (e.route) map.fitBounds(L.latLngBounds(e.route.concat([[e.lat, e.lng]])), { padding: [40, 40], maxZoom: 16 });
    else map.setView([e.lat, e.lng], 16);
    setTimeout(() => evMarkers.get(e.id)?.openPopup(), 350);
  }

