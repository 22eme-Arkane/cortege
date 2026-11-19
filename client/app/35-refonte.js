  // ---- Refonte de l'interface (proposition) ----
  // Réorganise les écrans existants sans toucher à leur code : on DÉPLACE les éléments (leurs écouteurs suivent),
  // pour que chaque chose soit là où on s'en sert. Une version définitive déplacerait plutôt le HTML lui-même.
  const moveTo = (box, ...nodes) => nodes.forEach(n => { if (n) box.append(n); });

  // -- Actions rapides (bouton ⚡ sur la carte) : ce qui sert dans l'urgence, à un appui --
  const quick = $('#quickList');
  moveTo(quick,
    $('#btnList'),                                   // signalements dans la zone
    $('#violenceLink'),                              // signaler une violence policière
    document.querySelector('#sheetRights [data-wipe]')); // tout effacer de ce téléphone
  // « Enregistrer le son » : aussi dans les actions, visible seulement quand le téléphone sait enregistrer (comme le bouton 🎙️ de la carte)
  const sonMap = $('#btnSonMap');
  const sonQuick = el('button', { type: 'button', class: 'tile wide', id: 'btnSonQuick' }, el('span', { class: 'ico', 'aria-hidden': 'true' }, '🎙️'),
    el('span', {}, el('b', {}, t('Enregistrer le son')), el('small', {}, t('Contrôle, interpellation : une trace sur ton téléphone'))));
  sonQuick.onclick = () => { closeSheets(); sonMap.click(); };
  sonQuick.hidden = sonMap.hidden;
  new MutationObserver(() => { sonQuick.hidden = sonMap.hidden; }).observe(sonMap, { attributes: true, attributeFilter: ['hidden'] });
  quick.prepend(sonQuick);
  // « Passer en mode manif » : aussi sur la carte (🚩) et en tête des actions ; le bouton d'origine reste dans Réglages › Pendant la manif
  const manifQuick = el('button', { type: 'button', class: 'tile wide tile-manif', id: 'btnManifQuick' }, el('span', { class: 'ico', 'aria-hidden': 'true' }, '🚩'),
    el('span', {}, el('b', {}, t('Passer en mode manif')), el('small', {}, t('Carte, Signaler, SOS et legal team. Rien d’autre.'))));
  manifQuick.onclick = () => { closeSheets(); $('#btnManif').click(); };
  quick.prepend(manifQuick);
  $('#btnManifMap').onclick = () => { closeReport(); closeSheets(); $('#btnManif').click(); };
  $('#tabActions').onclick = () => $('#btnQuick').onclick();
  $('#btnQuick').onclick = () => { closeReport(); map.closePopup(); const was = !$('#sheetQuick').hidden; closeSheets(); if (!was) $('#sheetQuick').hidden = false; };
  $('#qkClose').onclick = () => closeSheets();
  // « Je suis interpellé·e » reste dans SOS ; « Enregistrer le son » reste sur la carte (🎙️)
  for (const id of ['#btnSosRights', '#btnSon', '#btnSonMore']) { const b = $(id); if (b) { b.hidden = true; b.dataset.refonte = 'off'; } }

  // -- Agenda : calendrier et liste d'abord (comme Armana), puis les annonces des orgas et les arrêtés en cours --
  const now = $('#agNow');
  now.append(el('h3', { class: 'menu-group' }, t('Annonces des orgas')));
  moveTo(now, $('#feedAnn'));
  now.append(el('h3', { class: 'menu-group' }, t('Arrêtés et restrictions')));
  moveTo(now, $('#feedOrd'), $('#btnOrders'));
  $('#agEmpty').after(now);

  // -- Réglages : des thèmes d'abord, leur contenu ensuite (comme le Profil d'Armana) --
  const info = $('#sheetInfo'), q = s => info.querySelector(s);
  const SECTIONS = [
    { k: 'manif', ico: '🚩', title: 'Pendant la manif', sub: 'Mode manif, alertes, batterie',
      nodes: () => [$('#btnManif'), $('#btnNotif'), $('#btnNotifInfo'), $('#optEco')?.closest('label')] },
    { k: 'avant', ico: '🎒', title: 'Avant de partir', sub: 'Checklist, hors ligne, installer, flouter',
      nodes: () => [$('#btnPrep')?.closest('.tiles'), $('#prefetchState'), $('#installBox'), q('a[href="/flouter"]'), $('#btnPrepInfo'), $('#testCard'), $('#playCard')] },
    { k: 'droits', ico: '⚖️', title: 'Mes droits', sub: 'Legal team, sommations, garde à vue…',
      nodes: () => [...$('#sheetRights').children].filter(n => !n.classList.contains('sheet-head')) },
    { k: 'grandir', ico: '📣', title: 'Faire grandir Cortège', sub: 'Partager, affiche, idées, accès orga',
      nodes: () => [$('#btnShare')?.closest('.tiles'), $('#orgaRequestCard')] },
    { k: 'apparence', ico: '🎨', title: 'Apparence et langue', sub: 'Thème, texte, contraste, langue',
      nodes: () => [q('.lang-row'), $('#themeLabel'), $('#themeSeg'), $('#optBig')?.closest('label'), $('#optContrast')?.closest('label')] },
    { k: 'securite', ico: '🛡️', title: 'Sécurité', sub: 'Tor, accès perdu, tout effacer',
      nodes: () => [$('#onionTip'), $('#btnRecover'), q('[data-wipe]'), q('[data-wipe]')?.nextElementSibling] },
    { k: 'soutenir', ico: '❤️', title: 'Soutenir Cortège', sub: 'Don, suivre le projet',
      nodes: () => [$('#kofiLink'), $('#igLink')] },
    { k: 'apropos', ico: 'ℹ️', title: 'À propos', sub: 'Comment ça marche, nouveautés, mentions légales',
      nodes: () => [q('ul.tips'), $('#btnNews')?.closest('.tiles'), $('#btnWelcome')?.closest('p'), q('.menu-foot'), q('.credit'), $('#poweredBy')] },
  ];
  // Le conseil Tor vit dans la liste « Comment ça marche » : on le sort avant de déplacer cette liste
  const head = info.querySelector('.sheet-head');
  const menu = el('nav', { class: 'rg-menu', 'aria-label': t('Réglages') });
  const subs = {};
  for (const s of SECTIONS) {
    const page = el('div', { class: 'rg-sub', hidden: '' });
    const back = el('button', { type: 'button', class: 'rg-back' }, '‹ ' + t('Réglages'));
    back.onclick = () => openRg(null);
    page.append(back, el('h3', { class: 'rg-title' }, s.ico + ' ' + t(s.title)));
    const wrap = s.k === 'securite' ? el('ul', { class: 'tips' }) : null;
    for (const n of s.nodes()) {
      if (!n) continue;
      if (n.tagName === 'LI') { wrap.append(n); continue; }
      page.append(n);
    }
    if (wrap && wrap.children.length) page.insertBefore(wrap, page.children[2] || null);
    subs[s.k] = page;
    const row = el('button', { type: 'button', class: 'rg-row' }, el('span', { class: 'rg-ico', 'aria-hidden': 'true' }, s.ico),
      el('span', { class: 'rg-txt' }, el('b', {}, t(s.title)), el('small', {}, t(s.sub))), el('span', { class: 'rg-go', 'aria-hidden': 'true' }, '›'));
    row.onclick = () => openRg(s.k);
    menu.append(row);
  }
  // Ce qui reste dans l'ancien « Plus » (titres de groupes vides, « Organiser une manif » en doublon de l'Agenda) est masqué
  for (const n of [...info.children]) if (n !== head) { n.hidden = true; n.dataset.refonte = 'off'; }
  head.after(menu);
  menu.after(...Object.values(subs));
  function openRg(k) {
    menu.hidden = !!k;
    for (const [key, page] of Object.entries(subs)) page.hidden = key !== k;
    $('#siTitle').textContent = t('Réglages');
    if (k === 'droits') renderLegal();
    info.scrollTop = 0;
  }
  // Ouvrir l'onglet Réglages revient toujours au menu ; « Droits » (mode manif, préparation) ouvre directement Mes droits
  const sheetInfoWatch = new MutationObserver(() => { if (info.hidden) openRg(null); });
  sheetInfoWatch.observe(info, { attributes: true, attributeFilter: ['hidden'] });
  const openRights = () => { closeReport(); closeSheets(); info.hidden = false; openRg('droits'); };
  $('#mbLegal').onclick = openRights;
  if ($('#prepRights')) $('#prepRights').onclick = openRights;
