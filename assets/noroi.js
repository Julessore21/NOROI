/* NOROI theme — vanilla JS, no dependencies */
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
      this.classList.add('is-open');
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
    // The cart page reuses the same markup
    const page = $('[data-cart-page]');
    if (page && fresh) page.innerHTML = fresh.innerHTML;
  };

  const updateCount = (count) => {
    $$('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('is-empty', count === 0);
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
      try { await addToCart({ items: [{ id: Number(quick.dataset.quickAdd), quantity: 1 }] }); }
      catch (err) { toast(err.message); }
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
      items[i].classList.remove('is-active');
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
