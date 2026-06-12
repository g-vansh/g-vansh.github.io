/* network.js — sheet 05, the idea transit map.
   Three instruments, all progressive enhancement:
   1. per-visit seeded variation (the sheet never prints twice the same)
   2. the station rail: hover/focus particulars + line focus mode
   3. the descent: arrive by air, through cloud, onto the sheet (three.js)
   The page is fully functional with this file deleted. */
import * as THREE from '/assets/vendor/three.module.min.js';

/* ---------- 0 · seeded randomness (mulberry32, substreams) ---------- */
const SEED = Date.now() >>> 0;
const mulberry32 = (a) => () => {
  a |= 0; a = a + 0x6D2B79F5 | 0;
  let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const rngSheet = mulberry32(SEED ^ 0x9E3779B9);
const rngCloud = mulberry32(SEED ^ 0x85EBCA6B);
const rngPath  = mulberry32(SEED ^ 0xC2B2AE35);

/* ---------- 1 · the sheet never prints twice the same ---------- */
const plate = document.querySelector('.net-plate');
const svg = document.querySelector('.net-svg');
if (plate && svg) {
  /* the sheet lands on the desk slightly differently each visit */
  plate.style.setProperty('--sheet-rot', ((rngSheet() - 0.5) * 0.8).toFixed(3) + 'deg');
  plate.style.setProperty('--sheet-dx', ((rngSheet() - 0.5) * 6).toFixed(1) + 'px');
  plate.style.setProperty('--sheet-dy', ((rngSheet() - 0.5) * 4).toFixed(1) + 'px');

  /* a fresh impression number on every printing */
  const imp = document.getElementById('impression');
  if (imp) imp.textContent = 'Nº ' + (1000 + Math.floor(rngSheet() * 9000));

  /* the north arrow is hand-placed, never quite true */
  const north = document.getElementById('north');
  if (north) {
    const a = ((rngSheet() - 0.5) * 17).toFixed(2);
    north.setAttribute('transform', 'translate(1244,96) rotate(' + a + ')');
  }

  /* labels pasted on by hand: each a hair off-true */
  svg.querySelectorAll('.nl, .ns, .nt').forEach((t) => {
    t.style.transformBox = 'fill-box';
    t.style.transformOrigin = 'center';
    t.style.transform = 'rotate(' + ((rngPath() - 0.5) * 1.3).toFixed(2) + 'deg)';
  });
}

/* ---------- 2 · the station rail ---------- */
const net = document.getElementById('net');
const infoT = document.getElementById('net-info-t');
const infoM = document.getElementById('net-info-m');
const infoD = document.getElementById('net-info-d');
if (net && infoT) {
  const show = (a) => {
    infoM.textContent = a.dataset.m || '';
    infoT.innerHTML = '<strong></strong>';
    infoT.firstChild.textContent = a.dataset.t || '';
    infoD.textContent = a.dataset.d || '';
  };
  net.querySelectorAll('a.stn').forEach((a) => {
    /* MIT is the grand interchange — every through line calls there;
       the local services (loop + siding) closed before it opened */
    const lines = a.classList.contains('stn-mit')
      ? [...net.querySelectorAll('.ln:not(.ln-minor)')]
      : [a.closest('.ln')].filter(Boolean);
    const on = () => {
      show(a);
      net.classList.add('focus');
      net.querySelectorAll('.ln.lit').forEach((l) => l.classList.remove('lit'));
      lines.forEach((l) => l.classList.add('lit'));
    };
    const off = () => {
      net.classList.remove('focus');
      lines.forEach((l) => l.classList.remove('lit'));
    };
    a.addEventListener('mouseenter', on);
    a.addEventListener('focus', on);
    a.addEventListener('mouseleave', off);
    a.addEventListener('blur', off);
  });
}

/* ---------- 2.5 · rolling stock ---------- */
/* one service per through line, gliding west → east (the direction the
   career runs). Trains ride the very paths that draw the lines, so they
   inherit focus-mode dimming for free. No service on the grey locals
   (closed) or the eastern extensions (still under construction). */
(() => {
  if (!net || !svg) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const NS = 'http://www.w3.org/2000/svg';
  const FADE = 26;                       /* length of the fade at each terminus */
  const services = [];

  net.querySelectorAll('.ln:not(.ln-minor)').forEach((ln) => {
    const rail = ln.querySelector(':scope > .rail');
    if (!rail) return;
    const len = rail.getTotalLength();

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'train');
    g.setAttribute('aria-hidden', 'true');
    const body = document.createElementNS(NS, 'rect');
    body.setAttribute('x', '-9'); body.setAttribute('y', '-4.5');
    body.setAttribute('width', '18'); body.setAttribute('height', '9');
    body.setAttribute('rx', '4.5');
    const lamp = document.createElementNS(NS, 'circle');
    lamp.setAttribute('cx', '4.5'); lamp.setAttribute('cy', '0'); lamp.setAttribute('r', '1.5');
    g.append(body, lamp);
    /* under the station marks + labels, over the rails */
    const firstStn = ln.querySelector('a.stn');
    firstStn ? ln.insertBefore(g, firstStn) : ln.appendChild(g);

    const s = {
      rail, g, len,
      d: -FADE + rngPath() * (len + FADE),     /* staggered out of the depot */
      v: (len < 320 ? 16 : 30) + rngPath() * 10, /* short genes shuttle dawdles */
    };
    services.push(s);
    pose(s);                                    /* on the rails before first paint */
  });
  if (!services.length) return;

  function pose(s) {
    const d = Math.min(Math.max(s.d, 0), s.len);
    const a = s.rail.getPointAtLength(Math.max(0, d - 2));
    const b = s.rail.getPointAtLength(Math.min(s.len, d + 2));
    const p = s.rail.getPointAtLength(d);
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    s.g.setAttribute('transform',
      'translate(' + p.x.toFixed(2) + ',' + p.y.toFixed(2) + ') rotate(' + ang.toFixed(1) + ')');
    /* ease in at the western origin, out at the eastern terminus */
    const op = s.d < 0 ? 1 + s.d / FADE
             : s.d > s.len ? 1 - (s.d - s.len) / FADE : 1;
    s.g.style.opacity = Math.max(0, Math.min(1, op)).toFixed(3);
  }

  let raf = null, last = null, onSheet = true;
  const step = (now) => {
    raf = null;
    if (last === null) last = now;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;

    for (const s of services) {
      s.d += s.v * dt;
      if (s.d > s.len + FADE) s.d -= s.len + FADE * 2;  /* re-enter service */
      pose(s);
    }
    if (onSheet && !document.hidden) raf = requestAnimationFrame(step);
  };
  const run = () => {
    if (raf === null && onSheet && !document.hidden) {
      last = null;
      raf = requestAnimationFrame(step);
    }
  };

  /* the timetable suspends when nobody is looking */
  new IntersectionObserver((es) => {
    onSheet = es[0].isIntersecting;
    onSheet ? run() : (raf && cancelAnimationFrame(raf), raf = null);
  }, { threshold: 0.05 }).observe(svg);
  document.addEventListener('visibilitychange', () =>
    document.hidden ? (raf && cancelAnimationFrame(raf), raf = null) : run());
  run();
})();

/* ---------- 3 · the descent ---------- */
(async () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (sessionStorage.getItem('netFlown')) return;   /* once per session */
  if (document.hidden) return;                      /* no flights from background tabs */

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (e) { return; }
  sessionStorage.setItem('netFlown', '1');

  const small = innerWidth < 700;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight, false);
  const canvas = renderer.domElement;
  canvas.className = 'descent';
  canvas.setAttribute('aria-hidden', 'true');

  /* -- the bake: one CPU heightfield drives the mesh, the contours, the
     relief shading, and the benchmark's ground height — so the GPU and
     the JS can never disagree about where the country is. The noise
     core is kept in lockstep with its twin in terrain.js. -- */
  const EXT = 4200, GW = 256, GH = 256;     /* country extent, bake grid */
  const tick = () => new Promise((r) => setTimeout(r, 0));
  const hash2 = (i, j) => {
    let n = (i * 374761393 + j * 668265263) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  };
  /* value noise with analytic derivatives (quintic fade) */
  const noised = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    const du = 30 * xf * xf * (xf * (xf - 2) + 1);
    const dv = 30 * yf * yf * (yf * (yf - 2) + 1);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    const k1 = b - a, k2 = c - a, k3 = a - b - c + d;
    return [a + k1 * u + k2 * v + k3 * u * v,
            du * (k1 + k3 * v), dv * (k2 + k3 * u)];
  };
  /* erosion-weighted fBm: octaves damped where accumulated slope is
     already steep — valleys stay calm, ridgelines keep their bite */
  const fbmE = (x, y, oct) => {
    let a = 0, w = 0.5, f = 1, dx = 0, dy = 0;
    for (let i = 0; i < oct; i++) {
      const n = noised(x * f + i * 19.19, y * f + i * 47.31);
      dx += n[1] * w * f; dy += n[2] * w * f;
      a += w * (n[0] * 2 - 1) / (1 + 0.7 * (dx * dx + dy * dy));
      w *= 0.5; f *= 2.03;
    }
    return a;
  };
  /* ridged multifractal, each octave gated by the last → connected crests */
  const ridged = (x, y, oct) => {
    let a = 0, w = 0.5, f = 1, prev = 1;
    for (let i = 0; i < oct; i++) {
      let r = 1 - Math.abs(noised(x * f + i * 7.7, y * f + i * 3.1)[0] * 2 - 1);
      r *= r;
      a += r * w * prev;
      prev = r; w *= 0.5; f *= 2.1;
    }
    return a;
  };
  const sstep = (a, b, x) => {
    x = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return x * x * (3 - 2 * x);
  };
  const gauss = (x, y, cx, cy, s) => {
    const dx = x - cx, dy = y - cy;
    return Math.exp(-(dx * dx + dy * dy) / (2 * s * s));
  };
  /* the country: the four placed massifs carry the composition; erosion
     and ridging make them mountains. The landing plain (the benchmark
     lands within ±150 of the origin) is kept calm — detail fades in
     beyond 250 units so the final approach stays a settled valley. */
  const valH = (x, y) => {
    const macro = 95 * gauss(x, y, 700, 420, 540)
                + 130 * gauss(x, y, -820, -520, 700)
                + 70 * gauss(x, y, -1400, 300, 460)
                + 55 * gauss(x, y, -260, 1050, 420);
    const wx = x + 560 * (noised(x * 0.0009 + 5.1, y * 0.0009 + 2.7)[0] - 0.5);
    const wy = y + 560 * (noised(x * 0.0009 + 8.3, y * 0.0009 + 4.9)[0] - 0.5);
    const crest = sstep(28, 95, macro);
    const plain = sstep(250, 700, Math.hypot(x, y));
    return macro
      + (fbmE(wx * 0.00285, wy * 0.00285, 4) * (9 + 16 * crest)
       + ridged(wx * 0.0017, wy * 0.0017, 3) * 32 * crest) * plain
      + 8 * Math.sin(x * 0.004 + 1.7) * Math.cos(y * 0.0045 + 0.6);
  };

  /* heights, then tone. No shadow march here: at this scale no slope
     outpaces a 45° sun, so cast shadows cannot exist — the tone is pure
     Lambert hillshade with the cartographer's vertical exaggeration. */
  const hgt = new Float32Array(GW * GH);
  for (let j = 0; j < GH; j++) {
    const y = (j / (GH - 1) - 0.5) * EXT;
    for (let i = 0; i < GW; i++) {
      hgt[j * GW + i] = valH((i / (GW - 1) - 0.5) * EXT, y);
    }
    if ((j & 31) === 31) await tick();
  }
  const cell = EXT / (GW - 1);
  const LX = -0.5, LY = 0.5, LZ = 0.7071;   /* NW sun, 45° up */
  const XAG = 2.5;                           /* vertical exaggeration */
  const tone = new Float32Array(GW * GH);
  for (let j = 0; j < GH; j++) {
    for (let i = 0; i < GW; i++) {
      const il = Math.max(i - 1, 0), ir = Math.min(i + 1, GW - 1);
      const jd = Math.max(j - 1, 0), ju = Math.min(j + 1, GH - 1);
      const gx = XAG * (hgt[j * GW + ir] - hgt[j * GW + il]) / ((ir - il) * cell);
      const gy = XAG * (hgt[ju * GW + i] - hgt[jd * GW + i]) / ((ju - jd) * cell);
      const inv = 1 / Math.sqrt(gx * gx + gy * gy + 1);
      const lamb = (-gx * LX - gy * LY + LZ) * inv;
      tone[j * GW + i] = lamb < 0 ? 0 : lamb;
    }
  }
  const toHalf = THREE.DataUtils.toHalfFloat;
  const packed = new Uint16Array(GW * GH * 2);
  for (let k = 0; k < GW * GH; k++) {
    packed[k * 2] = toHalf(hgt[k]);
    packed[k * 2 + 1] = toHalf(tone[k]);
  }
  const relief = new THREE.DataTexture(packed, GW, GH, THREE.RGFormat, THREE.HalfFloatType);
  relief.magFilter = relief.minFilter = THREE.LinearFilter;
  relief.needsUpdate = true;

  if (document.hidden) { renderer.dispose(); return; }   /* hid during the bake */
  document.body.appendChild(canvas);

  const PAPER = 0xf4f3ef;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAPER);
  scene.fog = new THREE.Fog(PAPER, 700, 2600);   /* the country must read from altitude */
  const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 1, 4000);

  /* -- the country below: paper relief, graphite contours, all read
        from the baked heightfield -- */
  const terra = new THREE.Mesh(
    new THREE.PlaneGeometry(4200, 4200, small ? 130 : 190, small ? 130 : 190),
    new THREE.ShaderMaterial({
      uniforms: { uFog: { value: new THREE.Color(PAPER) }, uRelief: { value: relief } },
      vertexShader: /* glsl */`
        varying vec2 vP; varying float vDist;
        uniform sampler2D uRelief;
        void main(){
          vP = position.xy;
          float h = texture2D(uRelief, uv).r;
          vec4 mv = modelViewMatrix * vec4(position.x, position.y, h, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        precision highp float;
        varying vec2 vP; varying float vDist;
        uniform vec3 uFog;
        uniform sampler2D uRelief;
        const vec3 PAPER = vec3(0.957, 0.953, 0.937);
        const vec3 GRAPH = vec3(0.357, 0.369, 0.400);
        const vec3 INK   = vec3(0.098, 0.110, 0.141);
        float iso(float e, float wPx, float fadeA, float fadeB){
          float dh = fwidth(e);
          float w  = wPx * dh;
          float dw = clamp(w, dh, 0.5);
          float f  = abs(fract(e - 0.5) - 0.5);
          float line = (1.0 - smoothstep(dw - dh, dw + dh, f)) * clamp(w / dw, 0.0, 1.0);
          return line * (1.0 - smoothstep(fadeA, fadeB, dh));
        }
        void main(){
          vec2 hs = texture2D(uRelief, vP / 4200.0 + 0.5).rg;
          vec3 col = PAPER;
          /* printed shaded relief: a faint graphite wash on slopes turned
             away from the NW sun — darkening only, the paper is the light.
             0.707 is the tone of flat ground. */
          col = mix(col, GRAPH, max(0.707 - hs.g, 0.0) * 0.55);
          float gr = max(iso(vP.x / 240.0, 0.6, 0.3, 0.6), iso(vP.y / 240.0, 0.6, 0.3, 0.6));
          col = mix(col, GRAPH, gr * 0.18);
          float e = hs.r * 0.085;
          col = mix(col, GRAPH, iso(e, 0.9, 0.25, 0.5) * 0.45);
          col = mix(col, INK,   iso(e / 5.0, 1.3, 0.45, 0.9) * 0.5);
          col = mix(col, uFog, smoothstep(900.0, 2600.0, vDist));
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
  );
  terra.rotation.x = -Math.PI / 2;
  scene.add(terra);

  /* -- the cloud deck: instanced billboards, paper-toned -- */
  const cloudTex = (() => {
    const S = 256, c = document.createElement('canvas');
    c.width = c.height = S;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(S, S);
    /* tiny seeded value-noise FBM */
    const P = new Uint8Array(512);
    for (let i = 0; i < 256; i++) P[i] = P[i + 256] = (rngCloud() * 256) | 0;
    const vn = (x, y) => {
      const xi = x | 0, yi = y | 0, xf = x - xi, yf = y - yi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const h = (a, b) => P[(P[a & 255] + (b & 255)) & 511] / 255;
      return h(xi, yi) * (1 - u) * (1 - v) + h(xi + 1, yi) * u * (1 - v)
           + h(xi, yi + 1) * (1 - u) * v + h(xi + 1, yi + 1) * u * v;
    };
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const nx = x / S - 0.5, ny = y / S - 0.5;
      const r = Math.sqrt(nx * nx + ny * ny) * 2;
      let n = 0, a = 0.5, f = 3;
      for (let o = 0; o < 4; o++) { n += a * vn(x * f / S * 4, y * f / S * 4); a *= 0.5; f *= 2; }
      const alpha = Math.max(0, 1 - r * r) * Math.min(1, Math.max(0, n * 1.7 - 0.32));
      const i = (y * S + x) * 4;
      /* graphite rim, bright core: clouds must read as drawn forms on paper */
      const m = Math.min(1, alpha * 2.2);
      img.data[i]     = (208 + 44 * m) | 0;
      img.data[i + 1] = (208 + 43 * m) | 0;
      img.data[i + 2] = (203 + 44 * m) | 0;
      img.data[i + 3] = (alpha * 255) | 0;
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  /* clustered cumulus in a thin deck (520–840 up), drifting on a light
     wind, with a clear corridor kept over the landing benchmark so the
     ground — and the vermillion ⊕ — stay legible the whole way down */
  const cl = [];
  const CLUSTERS = small ? 7 : 11;
  for (let k = 0; k < CLUSTERS; k++) {
    let cx = (rngCloud() - 0.5) * 2600, cz = (rngCloud() - 0.5) * 2600;
    const r0 = Math.hypot(cx, cz);
    if (r0 < 640) { const f = (640 + rngCloud() * 500) / (r0 || 1); cx *= f; cz *= f; }
    const cy = 520 + rngCloud() * 320;
    const puffs = 5 + (rngCloud() * 4 | 0);
    for (let i = 0; i < puffs; i++) {
      cl.push({
        x: cx + (rngCloud() - 0.5) * 460,
        y: cy + (rngCloud() - 0.5) * 130,
        z: cz + (rngCloud() - 0.5) * 460,
        s: 300 + rngCloud() * 380,
        r: rngCloud() * Math.PI * 2,
        vx: (rngCloud() - 0.5) * 16,
        vz: (rngCloud() - 0.5) * 16,
      });
    }
  }
  cl.sort((a, b) => a.y - b.y);   /* low→high: far ones draw first under the descending camera */
  const N = cl.length;
  const clouds = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: cloudTex, transparent: true, depthWrite: false, fog: true,
      opacity: 0.85,
    }),
    N
  );
  clouds.renderOrder = 1;
  scene.add(clouds);

  const dummy = new THREE.Object3D();
  const q = new THREE.Quaternion();
  const zAxis = new THREE.Vector3(0, 0, 1);
  const placeClouds = (dt) => {
    for (let i = 0; i < N; i++) {
      const c = cl[i];
      c.x += c.vx * dt; c.z += c.vz * dt;
      dummy.position.set(c.x, c.y, c.z);
      dummy.quaternion.copy(camera.quaternion);
      dummy.quaternion.multiply(q.setFromAxisAngle(zAxis, c.r));
      /* fade-by-shrink as the camera punches through a billboard */
      const near = Math.abs(c.y - camera.position.y);
      dummy.scale.setScalar(c.s * Math.min(1, near / 130 + 0.05));
      dummy.updateMatrix();
      clouds.setMatrixAt(i, dummy.matrix);
    }
    clouds.instanceMatrix.needsUpdate = true;
  };

  /* -- the benchmark: a vermillion ⊕ at the landing point, the eye's anchor -- */
  const TARGET = new THREE.Vector3((rngPath() - 0.5) * 300, 0, (rngPath() - 0.5) * 300);
  /* ground height: the same baked grid the GPU reads (plane y = −world z) */
  const groundH = (X, Z) => {
    let u = (X / EXT + 0.5) * (GW - 1);
    let v = (-Z / EXT + 0.5) * (GH - 1);
    u = Math.min(Math.max(u, 0), GW - 1.001);
    v = Math.min(Math.max(v, 0), GH - 1.001);
    const i = u | 0, j = v | 0, fu = u - i, fv = v - j;
    const r0 = hgt[j * GW + i] * (1 - fu) + hgt[j * GW + i + 1] * fu;
    const r1 = hgt[(j + 1) * GW + i] * (1 - fu) + hgt[(j + 1) * GW + i + 1] * fu;
    return r0 * (1 - fv) + r1 * fv;
  };
  const mkMat = new THREE.MeshBasicMaterial({
    color: 0xd8260f, transparent: true, opacity: 0.8,
    side: THREE.DoubleSide, depthWrite: false, fog: false,
  });
  const mark = new THREE.Group();
  const armGeo = new THREE.PlaneGeometry(116, 4.5);
  const arm2 = new THREE.Mesh(armGeo, mkMat);
  arm2.rotation.z = Math.PI / 2;
  mark.add(new THREE.Mesh(new THREE.RingGeometry(34, 39, 48), mkMat),
           new THREE.Mesh(armGeo, mkMat), arm2);
  mark.rotation.x = -Math.PI / 2;
  mark.position.set(TARGET.x, groundH(TARGET.x, TARGET.z) + 3, TARGET.z);
  mark.renderOrder = 2;
  scene.add(mark);

  /* -- the instruments narrate the approach -- */
  const hud = document.createElement('p');
  hud.className = 'descent-hud m';
  hud.setAttribute('aria-hidden', 'true');
  document.body.appendChild(hud);

  /* -- choreography: arrive by air -- */
  const DUR = 3400;
  const bearing0 = rngPath() * Math.PI * 2;       /* a different approach every visit */
  const H0 = 1500, H1 = 120;
  let t0 = null, done = false, raf = null, prevNow = null;

  /* cubic-in into the cloud deck, quint-out onto the sheet */
  const ease = (t) => t < 0.3
    ? 0.3 * Math.pow(t / 0.3, 3)
    : 0.3 + 0.7 * (1 - Math.pow(1 - (t - 0.3) / 0.7, 5));

  const land = () => {
    if (done) return;
    done = true;
    canvas.classList.add('gone');
    hud.style.opacity = '0';
    setTimeout(() => {
      if (raf) cancelAnimationFrame(raf);
      canvas.remove();
      hud.remove();
      renderer.dispose();
      cloudTex.dispose();
      relief.dispose();
    }, 620);
  };

  const frame = (now) => {
    if (t0 === null) t0 = now + 250;
    const dt = prevNow === null ? 0 : Math.min((now - prevNow) / 1000, 0.1);
    prevNow = now;
    const t = Math.min(Math.max((now - t0) / DUR, 0), 1);
    const p = ease(t);

    const alt = H0 + (H1 - H0) * p;
    const pitch = 0.42 * (1 - Math.min(p / 0.7, 1));   /* off-vertical → straight down by 70% */
    const az = bearing0 + p * 0.55;
    const r = alt * Math.tan(pitch) + 0.001;

    camera.position.set(TARGET.x + r * Math.sin(az), alt, TARGET.z + r * Math.cos(az));
    camera.lookAt(TARGET);
    if (pitch < 0.02) camera.rotation.z = az;          /* keep north drifting, not snapping */
    /* the benchmark holds a constant apparent size on approach,
       breathes, then yields to the real sheet on final */
    mark.scale.setScalar(Math.max(alt / H0, 0.12));
    const yield_ = p < 0.78 ? 1 : Math.max(0, 1 - (p - 0.78) / 0.17);
    mkMat.opacity = (0.62 + 0.25 * Math.sin(now * 0.005)) * yield_;
    placeClouds(dt);
    renderer.render(scene, camera);

    /* the readout: phase, altitude, bearing */
    const brg = Math.round(((az * 180 / Math.PI) % 360 + 360) % 360);
    const phase = p < 0.32 ? 'ON APPROACH' : p < 0.7 ? 'THROUGH THE CLOUD DECK' : 'ON FINAL';
    hud.textContent = 'DESCENT · ' + phase
      + ' · ALT ' + String(Math.max(0, Math.round(alt - 110))).padStart(4, '0')
      + ' M · BRG ' + String(brg).padStart(3, '0') + '° · ESC TO SKIP';

    if (t >= 0.93 && !done) land();
    if (!done || t < 1) raf = requestAnimationFrame(frame);
  };
  /* paint the opening frame in this same task — an alpha:false canvas
     starts as a black buffer, and the compositor must never show it */
  {
    const r0 = H0 * Math.tan(0.42);
    camera.position.set(TARGET.x + r0 * Math.sin(bearing0), H0, TARGET.z + r0 * Math.cos(bearing0));
    camera.lookAt(TARGET);
    placeClouds(0);
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  /* the impatient may step off early */
  const skip = () => land();
  addEventListener('keydown', (e) => { if (e.key === 'Escape') skip(); }, { once: false });
  addEventListener('wheel', skip, { passive: true, once: true });
  addEventListener('touchstart', skip, { passive: true, once: true });

  addEventListener('resize', () => {
    if (done) return;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) land(); });
})();
