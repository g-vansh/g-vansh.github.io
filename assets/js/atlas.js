/* atlas.js — field instruments. Progressive enhancement only:
   the site must remain fully functional if this file never loads. */
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ----- survey line: scroll progress fallback ------------------
     Browsers with CSS scroll-driven animations handle this in pure
     CSS; everyone else gets the same line via rAF. */
  const line = document.querySelector('.survey-line');
  if (line && !CSS.supports('animation-timeline', 'scroll()')) {
    let queued = false;
    const draw = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      line.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ')';
      queued = false;
    };
    addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(draw); }
    }, { passive: true });
    draw();
  }

  /* ----- surfacing entries: IntersectionObserver fallback ------- */
  if (!CSS.supports('animation-timeline', 'view()') && 'IntersectionObserver' in window) {
    const els = document.querySelectorAll('.section-rule, .paper, .tl-row, .legend-row');
    if (els.length) {
      document.documentElement.classList.add('io-reveal');
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
        }
      }, { rootMargin: '0px 0px -8% 0px' });
      els.forEach((el) => { el.classList.add('rv'); io.observe(el); });
    }
  }

  /* ----- masthead coordinates decode once on load --------------- */
  const coords = document.querySelector('.site-head .coords');
  if (coords) {
    const fin = coords.textContent;
    const glyphs = '0123456789NWSE./-';
    const frames = 26;
    let f = 0;
    const tick = () => {
      f++;
      const reveal = Math.floor((f / frames) * fin.length);
      let out = '';
      for (let i = 0; i < fin.length; i++) {
        const c = fin[i];
        out += (i < reveal || c === ' ' || c === '—' || c === ',')
          ? c : glyphs[(Math.random() * glyphs.length) | 0];
      }
      coords.textContent = out;
      if (reveal < fin.length) requestAnimationFrame(tick);
      else coords.textContent = fin;
    };
    requestAnimationFrame(tick);
  }

  /* ----- pointer instruments (fine pointers only) ---------------- */
  if (!matchMedia('(pointer: fine)').matches) return;

  /* site-wide coordinate readout: ticks with the cursor and drifts
     south as you scroll down the sheet, like a real map cursor */
  const ro = document.createElement('span');
  ro.className = 'cursor-readout';
  ro.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ro);

  let px = -1, py = -1, rx = 0, ry = 0;

  const setText = () => {
    const lat = 42.3608 - (scrollY + py - innerHeight / 2) * 0.000011;
    const lon = 71.0843 - (px - innerWidth / 2) * 0.000014;
    ro.textContent = '⊕ ' + lat.toFixed(4) + ' N / ' + lon.toFixed(4) + ' W';
  };

  /* hero contour parallax — SVG fallback only; stands down once
     terrain.js promotes the hero to the WebGL relief (.hero--3d) */
  const hero = document.querySelector('.hero');
  const svg = hero ? hero.querySelector('.contours') : null;
  const paths = svg ? svg.querySelectorAll('g:first-of-type path') : [];
  const depth = [2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 2, 3, 2, 3];
  const mark = svg ? svg.querySelector('g[stroke="#d8260f"]') : null;
  let tx = 0, ty = 0, hx = 0, hy = 0;
  const heroIs3d = () => hero && hero.classList.contains('hero--3d');

  let raf = null;
  const step = () => {
    rx += (px + 18 - rx) * 0.22;
    ry += (py + 24 - ry) * 0.22;
    ro.style.transform = 'translate(' + Math.min(rx, innerWidth - 175) + 'px,' + Math.min(ry, innerHeight - 28) + 'px)';

    let settled = Math.abs(px + 18 - rx) < 0.5 && Math.abs(py + 24 - ry) < 0.5;

    if (paths.length && !heroIs3d()) {
      hx += (tx - hx) * 0.07;
      hy += (ty - hy) * 0.07;
      paths.forEach((p, i) => {
        const d = depth[i] || 3;
        p.style.transform = 'translate(' + (hx * d) + 'px,' + (hy * d) + 'px)';
      });
      if (mark) mark.style.transform = 'translate(' + (hx * -4) + 'px,' + (hy * -4) + 'px)';
      settled = settled && Math.abs(tx - hx) < 0.002 && Math.abs(ty - hy) < 0.002;
    }
    raf = settled ? null : requestAnimationFrame(step);
  };
  const kick = () => { if (raf === null) raf = requestAnimationFrame(step); };

  addEventListener('pointermove', (e) => {
    px = e.clientX; py = e.clientY;
    setText();
    ro.classList.add('on');
    if (hero && !heroIs3d()) {
      const r = hero.getBoundingClientRect();
      if (e.clientY >= r.top && e.clientY <= r.bottom) {
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      } else { tx = 0; ty = 0; }
    }
    kick();
  }, { passive: true });

  addEventListener('scroll', () => { if (px >= 0) setText(); }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    ro.classList.remove('on');
    tx = 0; ty = 0;
    kick();
  });
})();
