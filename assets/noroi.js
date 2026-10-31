/* NOROI theme: vanilla JS, no dependencies */
(() => {
  const cfg = window.noroi || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Toast ---------- */
  let toastEl;
  const toast = (msg) => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
  };

  /* ---------- Cart drawer ---------- */
  class CartDrawer extends HTMLElement {
    connectedCallback() {
      this.panel = $('.drawer__panel', this);
      this.addEventListener('click', (e) => {
        if (e.target.closest('[data-drawer-close]')) this.close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.classList.contains('is-open')) this.close();
        if (e.key === 'Tab' && this.classList.contains('is-open')) this.trap(e);
      });
    }
    open() {
      this.lastFocus = document.activeElement;
      this.classList.add('is-open', 'is-entering');
      clearTimeout(this.enterT);
      this.enterT = setTimeout(() => this.classList.remove('is-entering'), 900);
      this.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      requestAnimationFrame(() => this.panel.focus());
    }
    close() {
      this.classList.remove('is-open');
      this.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (this.lastFocus) this.lastFocus.focus();
    }
    trap(e) {
      const f = $$('a[href], button:not([disabled]), input, select', this.panel).filter((el) => el.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  customElements.define('cart-drawer', CartDrawer);
  const drawer = () => $('cart-drawer');

  /* Replace cart markup using the Section Rendering API payload */
  const renderCart = (sections) => {
    const html = sections && sections['cart-drawer'];
    if (!html) return;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fresh = $('.drawer__body', doc);
    const freshTitle = $('#CartDrawerTitle', doc);
    if (fresh) $('cart-drawer .drawer__body').innerHTML = fresh.innerHTML;
    if (freshTitle) $('#CartDrawerTitle').innerHTML = freshTitle.innerHTML;
    // The cart page has its own layout: refresh it from the server
    const page = $('[data-cart-page]');
    if (page) {
      fetch(window.location.pathname).then((r) => r.text()).then((text) => {
        const pdoc = new DOMParser().parseFromString(text, 'text/html');
        const freshPage = $('[data-cart-page]', pdoc);
        const freshHead = $('.cart-page__title', pdoc);
        if (freshPage) { page.innerHTML = freshPage.innerHTML; page.className = freshPage.className; }
        const head = $('.cart-page__title');
        if (head && freshHead) head.innerHTML = freshHead.innerHTML;
      }).catch(() => {});
    }
  };

  const updateCount = (count) => {
    $$('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('is-empty', count === 0);
      const bag = el.closest('.bag-btn');
      if (bag) bag.classList.toggle('has-items', count > 0);
      el.classList.remove('is-bump');
      void el.offsetWidth;
      el.classList.add('is-bump');
    });
  };

  const fetchCount = () =>
    fetch(`${cfg.routes.cart}.js`).then((r) => r.json()).then((c) => updateCount(c.item_count));

  const addToCart = async (body) => {
    body.sections = ['cart-drawer'];
    body.sections_url = window.location.pathname;
    const res = await fetch(cfg.routes.cartAdd, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok || data.status) throw new Error(data.description || data.message || cfg.strings.error);
    if (cfg.cartType === 'page') { window.location = cfg.routes.cart; return; }
    renderCart(data.sections);
    fetchCount();
    drawer().open();
  };

  const changeLine = async (line, quantity) => {
    const res = await fetch(cfg.routes.cartChange, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line, quantity, sections: ['cart-drawer'], sections_url: window.location.pathname })
    });
    const data = await res.json();
    if (!res.ok || data.status) { toast(data.description || cfg.strings.error); }
    else { renderCart(data.sections); updateCount(data.item_count); }
  };

  document.addEventListener('click', async (e) => {
    // Open drawer from header icon
    const opener = e.target.closest('[data-cart-open]');
    if (opener && cfg.cartType === 'drawer' && drawer()) {
      e.preventDefault();
      drawer().open();
      return;
    }

    // Quantity +/- and remove in cart
    const qtyBtn = e.target.closest('[data-qty-change]');
    if (qtyBtn) {
      const line = qtyBtn.closest('[data-line]');
      line.classList.add('is-loading');
      await changeLine(Number(line.dataset.line), Number(qtyBtn.dataset.qtyChange));
      return;
    }

    // Quick add from cards and upsell
    const quick = e.target.closest('[data-quick-add]');
    if (quick) {
      e.preventDefault();
      quick.classList.add('is-loading');
      const label = quick.textContent;
      try {
        await addToCart({ items: [{ id: Number(quick.dataset.quickAdd), quantity: 1 }] });
        quick.classList.add('is-added');
        quick.textContent = `✓ ${cfg.strings.added}`;
        setTimeout(() => { quick.classList.remove('is-added'); quick.textContent = label; }, 2200);
      } catch (err) { toast(err.message); }
      quick.classList.remove('is-loading');
    }
  });

  /* ---------- Product form ---------- */
  $$('[data-product-section]').forEach((section) => {
    const form = $('form[action*="/cart/add"]', section);
    if (!form) return;
    const idInput = $('[data-variant-id]', form);
    const addBtns = $$('[data-add-btn]', section);
    const errorEl = $('[data-form-error]', section);
    const jsonEl = $('[data-product-json]', section);
    const data = jsonEl ? JSON.parse(jsonEl.textContent) : { variants: [] };
    const qtyInput = $('.qty__input', form);

    // Quantity stepper
    $$('[data-qty-step]', form).forEach((btn) =>
      btn.addEventListener('click', () => {
        const max = Number(qtyInput.max) || 99;
        qtyInput.value = Math.min(max, Math.max(1, Number(qtyInput.value) + Number(btn.dataset.qtyStep)));
      })
    );

    // Variant selection
    const selects = $$('[data-option-index]', form);
    const onVariantChange = () => {
      const opts = selects.map((s) => s.value);
      const v = data.variants.find((x) => x.options.every((o, i) => o === opts[i]));
      addBtns.forEach((b) => {
        b.disabled = !v || !v.available;
        const label = $('[data-add-label]', b) || b;
        label.textContent = v && v.available ? cfg.strings.addToCart : cfg.strings.soldOut;
      });
      if (!v) return;
      idInput.value = v.id;
      $('[data-price]', section).textContent = v.price;
      const sticky = $('[data-price-sticky]', section);
      if (sticky) sticky.textContent = v.price;
      const cmp = $('[data-compare]', section);
      if (cmp) { cmp.hidden = !v.compare; cmp.textContent = v.compare || ''; }
      const url = new URL(window.location);
      url.searchParams.set('variant', v.id);
      history.replaceState({}, '', url);
      if (v.media) {
        const slide = $(`#Media-${v.media}`, section);
        if (slide) slide.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
      }
    };
    selects.forEach((s) => s.addEventListener('change', onVariantChange));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.hidden = true;
      addBtns.forEach((b) => b.classList.add('is-loading'));
      try {
        await addToCart({ items: [{ id: Number(idInput.value), quantity: Number(qtyInput.value) || 1 }] });
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.hidden = false;
      }
      addBtns.forEach((b) => b.classList.remove('is-loading'));
    });

    // Sticky mobile bar: visible once the main buy button leaves the viewport
    const sticky = $('[data-sticky-buy]', section);
    const mainBuy = $('.pdp__buy', section);
    if (sticky && mainBuy && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        sticky.classList.toggle('is-visible', show);
        sticky.setAttribute('aria-hidden', String(!show));
        $$('button', sticky).forEach((b) => (b.tabIndex = show ? 0 : -1));
      }).observe(mainBuy);
    }

    // Gallery thumbnails (mobile carousel)
    const track = $('[data-gallery-track]', section);
    const thumbs = $$('[data-thumb]', section);
    thumbs.forEach((t) =>
      t.addEventListener('click', () => {
        const slide = $(`#Media-${t.dataset.thumb}`, section);
        if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
      })
    );
    if (track && thumbs.length) {
      track.addEventListener('scroll', () => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        thumbs.forEach((t, n) => t.classList.toggle('is-active', n === i));
      }, { passive: true });
    }
  });

  /* ---------- Header: transparent on hero, mobile menu ---------- */
  const header = $('[data-header]');
  if (header) {
    const announce = $('.announce');
    if (header.classList.contains('header--transparent')) {
      const onScroll = () => {
        const h = announce ? announce.offsetHeight : 0;
        header.style.top = `${Math.max(0, h - window.scrollY)}px`;
        header.classList.toggle('is-scrolled', window.scrollY > 40);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    const burger = $('[data-menu-open]', header);
    const menu = $('#MobileMenu');
    if (burger && menu) {
      burger.addEventListener('click', () => {
        const open = menu.hidden;
        menu.hidden = !open;
        burger.setAttribute('aria-expanded', String(open));
        header.classList.toggle('is-scrolled', open || window.scrollY > 40);
      });
    }
  }

  /* ---------- Announcement rotator ---------- */
  $$('[data-rotator]').forEach((r) => {
    const items = $$('.announce__item', r);
    if (items.length < 2 || reducedMotion) return;
    let i = 0;
    setInterval(() => {
      const out = items[i];
      out.classList.remove('is-active');
      out.classList.add('is-leaving');
      setTimeout(() => out.classList.remove('is-leaving'), 700);
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    }, 4500);
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* Re-init when sections are edited in the theme editor */
  document.addEventListener('shopify:section:load', (e) => {
    $$('.reveal', e.target).forEach((el) => el.classList.add('is-in'));
  });
})();

/* ==========================================================================
   Experience layer: unboxing simulator, collection tracker, countdown,
   holographic tilt, hero particles. All respect prefers-reduced-motion.
   ========================================================================== */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const fill = (str, map) => Object.keys(map).reduce((s, k) => s.split(`{${k}}`).join(map[k]), str || '');

  /* ---------- Unboxing simulator ---------- */
  class UnboxSim extends HTMLElement {
    connectedCallback() {
      this.figures = JSON.parse($('[data-sim-figures]', this).textContent);
      this.t = JSON.parse($('[data-sim-strings]', this).textContent);
      this.odds = Number(this.dataset.secretOdds) || 72;
      this.box = $('[data-sim-box]', this);
      this.result = $('[data-sim-result]', this);
      this.arena = $('[data-sim-open]', this);
      this.status = $('[data-sim-status]', this);
      this.cta = $('[data-sim-cta]', this);
      this.statsEl = $('[data-sim-stats]', this);
      this.stats = store.get('noroi-sim', { opened: 0, secrets: 0 });
      this.hint = $('[data-sim-hint]', this);
      const go = () => this.open();
      this.arena.addEventListener('click', go);
      this.arena.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      this.result.addEventListener('click', go);
      this.renderStats();
    }
    pick() {
      const secrets = this.figures.filter((f) => f.secret);
      const standard = this.figures.filter((f) => !f.secret);
      if (secrets.length && Math.random() < 1 / this.odds) return secrets[Math.floor(Math.random() * secrets.length)];
      return standard[Math.floor(Math.random() * standard.length)];
    }
    renderStats() {
      if (!this.stats.opened) return;
      this.statsEl.hidden = false;
      this.statsEl.textContent = fill(this.t.stats, { opened: this.stats.opened, secrets: this.stats.secrets });
    }
    burst(secret) {
      const host = $('[data-sim-burst]', this);
      host.innerHTML = '';
      const n = secret ? 46 : 30;
      for (let i = 0; i < n; i++) {
        const p = document.createElement('i');
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
        const dist = 140 + Math.random() * (secret ? 260 : 180);
        p.style.setProperty('--x', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--y', `${Math.sin(angle) * dist}px`);
        p.style.setProperty('--s', (0.4 + Math.random() * 1.1).toFixed(2));
        p.style.setProperty('--t', `${600 + Math.random() * 500}ms`);
        if (Math.random() < 0.18) p.className = 'is-glyph';
        host.appendChild(p);
      }
    }
    open() {
      if (this.busy || !this.figures.length) return;
      this.busy = true;
      const fig = this.pick();
      const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
      this.cta.hidden = true;
      if (this.hint) this.hint.hidden = true;
      this.result.hidden = true;
      this.classList.remove('is-revealed', 'is-secret', 'is-split', 'is-charging', 'is-flash');
      this.status.textContent = this.t.opening;
      if (fig.secret) this.classList.add('is-secret');

      // fill the card while it is hidden
      $('[data-sim-media]', this).innerHTML = fig.image
        ? `<img src="${fig.image}" alt="" width="700" height="875">`
        : '<span class="sim__q" aria-hidden="true">?</span>';
      $('[data-sim-name]', this).textContent = fig.name;
      $('[data-sim-rarity]', this).textContent = fig.secret ? this.t.secret : this.t.standard;

      (async () => {
        void this.offsetWidth;
        this.classList.add('is-charging');           // 1. charge: shake builds, seam glows
        await wait(1300);
        this.burst(fig.secret);
        this.classList.add('is-flash', 'is-split');  // 2. flash + split + sparks
        await wait(260);
        this.result.hidden = false;
        this.classList.add('is-revealed');           // 3. card flips in, 4. shine sweeps
        this.classList.remove('is-charging');
        await wait(900);
        this.classList.remove('is-flash');
        this.status.textContent = fill(fig.secret ? this.t.gotSecret : this.t.got, { name: fig.name });
        this.stats.opened += 1;
        if (fig.secret) this.stats.secrets += 1;
        store.set('noroi-sim', this.stats);
        this.renderStats();
        this.cta.hidden = false;
        if (this.hint) { this.hint.textContent = this.t.again; this.hint.hidden = false; }
        this.busy = false;
      })();
    }
  }
  customElements.define('unbox-sim', UnboxSim);

  /* ---------- Collection tracker ---------- */
  class CollectionTracker extends HTMLElement {
    connectedCallback() {
      this.key = this.dataset.storageKey;
      this.t = JSON.parse($('[data-tracker-strings]', this).textContent);
      this.items = $$('[data-figure]', this);
      this.owned = new Set(store.get(this.key, []));
      this.items.forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.figure;
          this.owned.has(id) ? this.owned.delete(id) : this.owned.add(id);
          store.set(this.key, [...this.owned]);
          this.render();
        });
      });
      this.render();
    }
    render() {
      const standard = this.items.filter((b) => b.dataset.secret !== 'true');
      let ownedStd = 0;
      let secretOwned = false;
      this.items.forEach((b) => {
        const on = this.owned.has(b.dataset.figure);
        b.setAttribute('aria-pressed', String(on));
        if (on && b.dataset.secret === 'true') secretOwned = true;
        if (on && b.dataset.secret !== 'true') ownedStd += 1;
      });
      const total = standard.length;
      const missing = total - ownedStd;
      $('[data-tracker-owned]', this).textContent = ownedStd;
      $('[data-tracker-total]', this).textContent = total;
      $('[data-tracker-bar]', this).style.width = `${total ? (ownedStd / total) * 100 : 0}%`;

      let advice = this.t.start;
      if (secretOwned) advice = this.t.secretOnly;
      else if (this.owned.size && missing === 0) advice = this.t.complete;
      else if (this.owned.size) advice = fill(this.t.missing, { n: missing });
      $('[data-tracker-advice]', this).textContent = advice;

      // Suggest the smallest format that covers what's missing (capped at the biggest)
      const offers = $$('[data-tracker-offer]', this);
      const sizes = offers.map((o) => Number(o.dataset.trackerOffer)).sort((a, b) => a - b);
      const want = missing <= 0 ? sizes[0] : sizes.find((n) => n >= missing) || sizes[sizes.length - 1];
      offers.forEach((o) => o.classList.toggle('is-active', this.owned.size > 0 && Number(o.dataset.trackerOffer) === want));
    }
  }
  customElements.define('collection-tracker', CollectionTracker);

  /* ---------- Countdown ---------- */
  class DropCountdown extends HTMLElement {
    connectedCallback() {
      this.target = Number(this.dataset.target);
      this.tick();
      this.timer = setInterval(() => this.tick(), 1000);
    }
    disconnectedCallback() { clearInterval(this.timer); }
    tick() {
      let diff = Math.max(0, this.target - Date.now());
      if (diff === 0) { clearInterval(this.timer); this.closest('section').hidden = true; return; }
      const parts = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
      Object.entries(parts).forEach(([k, ms]) => {
        const v = Math.floor(diff / ms);
        diff -= v * ms;
        const el = $(`[data-cd="${k}"]`, this);
        if (el) el.textContent = String(v).padStart(2, '0');
      });
    }
  }
  customElements.define('drop-countdown', DropCountdown);

  /* ---------- Holographic tilt ---------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest('.tilt');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
      el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`);
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      el.classList.add('is-tilting');
    }, { passive: true });
    document.addEventListener('pointerout', (e) => {
      const el = e.target.closest('.tilt');
      if (el && !el.contains(e.relatedTarget)) {
        el.classList.remove('is-tilting');
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
      }
    });
  }

  /* ---------- Hero parallax (desktop, mouse) ---------- */
  if (!reduced && window.matchMedia('(hover: hover) and (min-width: 1100px)').matches) {
    $$('[data-hero]').forEach((hero) => {
      hero.classList.add('is-parallax');
      let raf = 0;
      hero.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = hero.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          hero.style.setProperty('--px', `${(-x * 22).toFixed(1)}px`);
          hero.style.setProperty('--py', `${(-y * 14).toFixed(1)}px`);
        });
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { hero.style.setProperty('--px', '0px'); hero.style.setProperty('--py', '0px'); });
    });
  }

  /* ---------- Key numbers count up when they enter the screen ---------- */
  const countUp = (el) => {
    const src = el.textContent;
    const nums = src.match(/\d+/g);
    if (!nums) return;
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const k = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      let i = 0;
      el.textContent = src.replace(/\d+/g, () => String(Math.round(Number(nums[i++]) * e)));
      if (k < 1) requestAnimationFrame(step); else el.textContent = src;
    };
    requestAnimationFrame(step);
  };
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); }
    }), { threshold: 0.6 });
    $$('.stats__value').forEach((el) => io.observe(el));
  }

  /* ---------- Reading progress bar ---------- */
  if (!reduced) {
    const bar = document.createElement('div');
    bar.className = 'progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Hero particles: rising embers and a few kanji ---------- */
  $$('[data-particles]').forEach((canvas) => {
    if (reduced) return;
    const ctx = canvas.getContext('2d');
    const glyphs = ['呪', '怨', '術', '廻'];
    let w, h, dpr, parts = [], running = false, raf = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (initial) => {
      const kanji = Math.random() < 0.08;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 20,
        r: kanji ? 14 + Math.random() * 14 : 0.6 + Math.random() * 1.8,
        vy: 0.2 + Math.random() * 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        a: 0.15 + Math.random() * 0.5,
        blue: Math.random() < 0.25,
        glyph: kanji ? glyphs[Math.floor(Math.random() * glyphs.length)] : null
      };
    };
    resize();
    const count = w < 750 ? 28 : 55;
    for (let i = 0; i < count; i++) parts.push(spawn(true));
    window.addEventListener('resize', resize, { passive: true });
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running && !raf) raf = requestAnimationFrame(loop); }).observe(canvas);
    function loop() {
      raf = 0;
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p, i) => {
        p.y -= p.vy; p.x += p.vx;
        if (p.y < -30) parts[i] = spawn(false);
        const color = p.blue ? '120,170,255' : '215,60,80';
        if (p.glyph) {
          ctx.font = `${p.r}px serif`;
          ctx.fillStyle = `rgba(${color},${p.a * 0.35})`;
          ctx.fillText(p.glyph, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},${p.a})`;
          ctx.shadowColor = `rgba(${color},.9)`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      raf = requestAnimationFrame(loop);
    }
  });
})();
