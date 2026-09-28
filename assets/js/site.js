/* Vishwas Enterprises — site behaviour. No dependencies. */
(function () {
  'use strict';

  var CONTACT = {
    phones: [
      { label: 'Primary', display: '+91 87886 73503', digits: '918788673503' },
      { label: 'Alternate', display: '+91 80108 89605', digits: '918010889605' }
    ],
    emails: [
      { label: 'Primary', address: 'vishwasentpune1@gmail.com' },
      { label: 'Alternate', address: 'vishwasmahapure8@gmail.com' }
    ],
    waNumber: '918788673503',
    waGreeting: 'Hello Vishwas Enterprises, I would like to discuss a requirement.'
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Dialog helpers (native <dialog>, focus returns to opener) ---------- */
  var lastOpener = null;
  function openDialog(dlg, opener) {
    lastOpener = opener || document.activeElement;
    if (typeof dlg.showModal === 'function') { dlg.showModal(); } else { dlg.setAttribute('open', ''); }
    document.documentElement.style.overflow = 'hidden';
  }
  function closeDialog(dlg) {
    if (typeof dlg.close === 'function') { dlg.close(); } else { dlg.removeAttribute('open'); }
  }
  $$('dialog').forEach(function (dlg) {
    dlg.addEventListener('close', function () {
      document.documentElement.style.overflow = '';
      if (lastOpener && typeof lastOpener.focus === 'function') { lastOpener.focus(); }
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]')) { closeDialog(dlg); }
    });
  });

  /* ---------- Header: shadow on scroll, mobile menu, current section ---------- */
  var header = $('#siteHeader');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var nav = $('#siteNav');
  var toggle = $('#navToggle');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });

  if ('IntersectionObserver' in window) {
    var links = $$('.site-nav a[href^="#"]');
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = byId[en.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    // Sections without a menu link (hero, industries, contact) clear the highlight.
    $$('main > section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Contact picker: two numbers, two emails ---------- */
  var cDlg = $('#contactDialog');
  function openContact(type, opener) {
    var title = $('#contactDialogTitle'), text = $('#contactDialogText'), box = $('#contactOptions');
    var html = '';
    if (type === 'email') {
      title.textContent = 'Choose an email address';
      text.textContent = 'Your mail app will open with this address filled in.';
      CONTACT.emails.forEach(function (e) {
        html += '<a class="picker-option" href="mailto:' + e.address + '?subject=' + encodeURIComponent('Enquiry from website') + '"><span><b>' + e.label + '</b><small>' + e.address + '</small></span><svg aria-hidden="true"><use href="#i-mail"/></svg></a>';
      });
    } else {
      var wa = type === 'wa';
      title.textContent = wa ? 'Chat on WhatsApp' : 'Call Vishwas Enterprises';
      text.textContent = wa ? 'Pick a number to start a WhatsApp chat.' : 'Pick the number you would like to call.';
      CONTACT.phones.forEach(function (p) {
        var href = wa ? 'https://wa.me/' + p.digits + '?text=' + encodeURIComponent(CONTACT.waGreeting) : 'tel:+' + p.digits;
        html += '<a class="picker-option' + (wa ? ' is-wa' : '') + '" href="' + href + '"' + (wa ? ' target="_blank" rel="noopener"' : '') + '><span><b>' + p.label + '</b><small>' + p.display + '</small></span><svg aria-hidden="true"><use href="#' + (wa ? 'i-wa' : 'i-phone') + '"/></svg></a>';
      });
    }
    box.innerHTML = html;
    openDialog(cDlg, opener);
    var first = $('.picker-option', box);
    if (first) first.focus();
  }
  $$('[data-contact]').forEach(function (btn) {
    btn.addEventListener('click', function () { openContact(btn.getAttribute('data-contact'), btn); });
  });
  $('#contactOptions').addEventListener('click', function (e) { if (e.target.closest('a')) closeDialog(cDlg); });

  /* ---------- Air system flow (tabs) ---------- */
  var FLOW = window.VE_FLOW || [];
  var flowTabs = $$('.flow-btn');
  var flowIndex = 0;
  function showStage(i, focus) {
    flowIndex = Math.max(0, Math.min(FLOW.length - 1, i));
    var s = FLOW[flowIndex];
    flowTabs.forEach(function (t, n) {
      var on = n === flowIndex;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    $('#flowPanel').setAttribute('aria-labelledby', 'stage-' + (flowIndex + 1));
    $('#flowCount').textContent = 'Stage ' + (flowIndex + 1) + ' of ' + FLOW.length;
    $('#flowTitle').textContent = s.name;
    $('#flowText').textContent = s.text;
    var img = $('#flowImg');
    img.src = s.img; img.alt = s.alt; img.width = s.w; img.height = s.h;
    $('#flowPrev').disabled = flowIndex === 0;
    $('#flowNext').disabled = flowIndex === FLOW.length - 1;
    if (focus) flowTabs[flowIndex].focus();
  }
  if (FLOW.length) {
    flowTabs.forEach(function (t, n) {
      t.addEventListener('click', function () { showStage(n); });
      t.addEventListener('keydown', function (e) {
        var k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); showStage((flowIndex + 1) % FLOW.length, true); }
        else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); showStage((flowIndex - 1 + FLOW.length) % FLOW.length, true); }
        else if (k === 'Home') { e.preventDefault(); showStage(0, true); }
        else if (k === 'End') { e.preventDefault(); showStage(FLOW.length - 1, true); }
      });
    });
    $('#flowPrev').addEventListener('click', function () { showStage(flowIndex - 1); });
    $('#flowNext').addEventListener('click', function () { showStage(flowIndex + 1); });
    showStage(0);

    // One orchestrated moment: the air line fills and each stage lights up in order.
    var track = $('#flowTrack');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      track.classList.add('is-live');
    } else {
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { track.classList.add('is-live'); fio.disconnect(); }
        });
      }, { threshold: 0.45 });
      fio.observe(track);
    }
  }

  /* ---------- Project gallery: filter, show more, lightbox ---------- */
  var shots = $$('.shot');
  var moreBtn = $('#galleryMore');
  var showAll = false;
  var filter = 'all';
  function visibleShots() { return shots.filter(function (s) { return !s.hidden && (showAll || !s.classList.contains('is-extra') || s.classList.contains('is-shown')); }); }
  function applyGallery() {
    var shown = 0;
    shots.forEach(function (s) {
      var match = filter === 'all' || s.getAttribute('data-cat') === filter;
      s.hidden = !match;
    });
    if (filter === 'all') {
      shots.forEach(function (s) { s.classList.toggle('is-shown', showAll); });
      moreBtn.parentElement.hidden = showAll;
      if (!showAll) moreBtn.textContent = 'Show all ' + shots.length + ' photos';
    } else {
      // a single category is short enough to show in full
      shots.forEach(function (s) { s.classList.add('is-shown'); });
      moreBtn.parentElement.hidden = true;
    }
    shown = visibleShots().length;
    return shown;
  }
  $$('.filter-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.getAttribute('data-filter');
      $$('.filter-btn').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      applyGallery();
    });
  });
  moreBtn.addEventListener('click', function () {
    var firstExtra = shots.filter(function (s) { return s.classList.contains('is-extra'); })[0];
    showAll = true; applyGallery();
    if (firstExtra) { var b = $('.shot-btn', firstExtra); if (b) b.focus({ preventScroll: true }); }
  });
  applyGallery();

  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCaption'), lbCount = $('#lbCount');
  var lbList = [], lbIndex = 0;
  function lbShow(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    var fig = lbList[lbIndex];
    var btn = $('.shot-btn', fig);
    var img = $('img', fig);
    lbImg.src = btn.getAttribute('data-full');
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lbCount.textContent = (lbIndex + 1) + ' / ' + lbList.length;
  }
  shots.forEach(function (fig) {
    $('.shot-btn', fig).addEventListener('click', function (e) {
      lbList = visibleShots();
      lbShow(lbList.indexOf(fig));
      openDialog(lb, e.currentTarget);
    });
  });
  $('#lbPrev').addEventListener('click', function () { lbShow(lbIndex - 1); });
  $('#lbNext').addEventListener('click', function () { lbShow(lbIndex + 1); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); lbShow(lbIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); lbShow(lbIndex + 1); }
  });
  var touchX = null;
  $('#lbStage').addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  $('#lbStage').addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  lb.addEventListener('close', function () { lbImg.removeAttribute('src'); });

  /* ---------- Videos: nothing loads until a tile is clicked ---------- */
  var vDlg = $('#videoDialog'), player = $('#videoPlayer');
  $$('.video-tile').forEach(function (tile) {
    tile.addEventListener('click', function () {
      player.src = tile.getAttribute('data-video');
      $('#videoTitle').textContent = tile.getAttribute('data-title');
      openDialog(vDlg, tile);
      var p = player.play();
      if (p && p.catch) p.catch(function () {});
    });
  });
  vDlg.addEventListener('close', function () { player.pause(); player.removeAttribute('src'); player.load(); });

  /* ---------- Coverage diagram ---------- */
  var CITIES = window.VE_CITIES || [];
  var link = $('#covLink');
  function selectCity(name) {
    var c = CITIES.filter(function (x) { return x.name === name; })[0];
    if (!c) return;
    $$('.cov-city').forEach(function (g) { g.classList.toggle('is-active', g.getAttribute('data-city') === name); });
    $$('.city-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-city') === name)); });
    link.setAttribute('x2', c.x); link.setAttribute('y2', c.y);
    var d = $('#cityDetail');
    d.innerHTML = '';
    var b = document.createElement('b');
    b.textContent = c.name === 'Pune' ? 'Pune (our base)' : c.name + ', about ' + c.dist + ' km from Pune';
    var p = document.createElement('p'); p.textContent = c.detail;
    d.appendChild(b); d.appendChild(p);
  }
  $$('.city-btn').forEach(function (b) { b.addEventListener('click', function () { selectCity(b.getAttribute('data-city')); }); });
  $$('.cov-city').forEach(function (g) {
    g.addEventListener('click', function () { selectCity(g.getAttribute('data-city')); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCity(g.getAttribute('data-city')); } });
  });

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = $('#enquiryForm');
  function fieldError(input, msg) {
    var err = document.getElementById(input.id + '-err');
    if (err) err.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  function cleanPhone(v) {
    var d = String(v).replace(/\D/g, '');
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return d;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#f-name'), phone = $('#f-phone');
    var ok = true;
    if (!name.value.trim()) { fieldError(name, 'Please enter your name.'); ok = false; } else fieldError(name);
    var digits = cleanPhone(phone.value);
    if (!/^[6-9]\d{9}$/.test(digits)) { fieldError(phone, 'Enter a 10-digit mobile number, for example 98765 43210.'); ok = false; } else fieldError(phone);
    if (!ok) { (name.value.trim() ? phone : name).focus(); return; }

    var lines = [
      'Hello Vishwas Enterprises,',
      '',
      'Name: ' + name.value.trim(),
      'Phone: +91 ' + digits,
    ];
    var company = $('#f-company').value.trim();
    var city = $('#f-city').value.trim();
    var msg = $('#f-message').value.trim();
    if (company) lines.push('Company: ' + company);
    if (city) lines.push('Location: ' + city);
    lines.push('Requirement: ' + $('#f-service').value);
    if (msg) lines.push('Details: ' + msg);
    window.open('https://wa.me/' + CONTACT.waNumber + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
  ['#f-name', '#f-phone'].forEach(function (id) {
    $(id).addEventListener('input', function () { if (this.getAttribute('aria-invalid')) fieldError(this); });
  });

  /* ---------- Footer year ---------- */
  var y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
