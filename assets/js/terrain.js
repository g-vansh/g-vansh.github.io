/* terrain.js — the hero relief. The hand-drawn 2D contour sheet rises
   into a 3D topographic survey. Progressive enhancement: if WebGL, ES
   modules, or motion are unavailable, the inline SVG contours remain.

   The terrain follows the survey pattern: one heightfield — erosion-
   weighted fBm with ridged, domain-warped crests — is computed on the
   CPU at load and baked into a small texture (R: height, G: relief tone
   from a ray-marched NW sun). That single bake drives the mesh
   displacement, the contour linework, and the hillshade, so the three
   can never disagree. The noise core is kept in lockstep with its twin
   in network.js (the same survey, a different sheet). */
import * as THREE from '/assets/vendor/three.module.min.js';

(async () => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (e) { return; }

  const small = innerWidth < 700;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2));
  renderer.setSize(hero.clientWidth, hero.clientHeight, false);
  const canvas = renderer.domElement;
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  /* ---- the bake ------------------------------------------------------ */
  const SHEET_W = 240, SHEET_H = 150;     /* sheet extent in survey units */
  const GW = 384, GH = 240;               /* bake grid */
  const tick = () => new Promise((r) => setTimeout(r, 0));

  /* deterministic integer hash — the sheet prints the same every visit */
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
  /* erosion-weighted fBm: each octave is damped where accumulated slope
     is already steep — valleys stay calm, ridgelines keep their bite */
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
  /* the country: four placed massifs carry the composition (the NE
     summit still holds the benchmark); erosion and ridging make them
     mountains rather than domes */
  const height = (x, y) => {
    const macro = 16 * gauss(x, y, 65, 27, 28)      /* NE summit */
                + 20 * gauss(x, y, -48, -42, 38)    /* SW massif */
                + 11 * gauss(x, y, -101, 13, 26)    /* W ridge */
                + 9 * gauss(x, y, -24, 59, 22);     /* N rise */
    /* low-frequency domain warp: ridgelines wander instead of ringing */
    const wx = x + 32 * (noised(x * 0.016 + 9.2, y * 0.016 + 1.3)[0] - 0.5);
    const wy = y + 32 * (noised(x * 0.016 + 3.7, y * 0.016 + 7.1)[0] - 0.5);
    const crest = sstep(3.5, 13, macro);            /* ridges live on high ground */
    return macro
      + fbmE(wx * 0.05, wy * 0.05, 5) * (1.1 + 2.1 * crest)
      + ridged(wx * 0.03, wy * 0.03, 3) * 5.0 * crest
      + 1.2 * Math.sin(x * 0.045 + 1.7) * Math.cos(y * 0.05 + 0.6);
  };

  /* pass 1 — heights */
  const hgt = new Float32Array(GW * GH);
  let hMax = 0;
  for (let j = 0; j < GH; j++) {
    const y = (j / (GH - 1) - 0.5) * SHEET_H;
    for (let i = 0; i < GW; i++) {
      const x = (i / (GW - 1) - 0.5) * SHEET_W;
      const h = height(x, y);
      hgt[j * GW + i] = h;
      if (h > hMax) hMax = h;
    }
    if ((j & 31) === 31) await tick();   /* keep the main thread breathing */
  }
  const sampleH = (x, y) => {            /* sheet coords → baked height */
    let u = (x / SHEET_W + 0.5) * (GW - 1);
    let v = (y / SHEET_H + 0.5) * (GH - 1);
    u = Math.min(Math.max(u, 0), GW - 1.001);
    v = Math.min(Math.max(v, 0), GH - 1.001);
    const i = u | 0, j = v | 0, fu = u - i, fv = v - j;
    const r0 = hgt[j * GW + i] * (1 - fu) + hgt[j * GW + i + 1] * fu;
    const r1 = hgt[(j + 1) * GW + i] * (1 - fu) + hgt[(j + 1) * GW + i + 1] * fu;
    return r0 * (1 - fv) + r1 * fv;
  };

  /* pass 2 — relief tone: Lambert from a NW survey sun 30° up, times a
     soft ray-marched shadow over the same heightfield. The sun on a
     printed sheet never moves, so all of this is paid once, at load.
     Flat unshadowed ground reads exactly 0.5 (the neutral tone). */
  const LX = -0.6124, LY = 0.6124, LZ = 0.5;   /* normalize(-1, 1, tan30·√2) */
  const cellX = SHEET_W / (GW - 1), cellY = SHEET_H / (GH - 1);
  const tone = new Float32Array(GW * GH);
  for (let j = 0; j < GH; j++) {
    const y = (j / (GH - 1) - 0.5) * SHEET_H;
    for (let i = 0; i < GW; i++) {
      const x = (i / (GW - 1) - 0.5) * SHEET_W;
      const il = Math.max(i - 1, 0), ir = Math.min(i + 1, GW - 1);
      const jd = Math.max(j - 1, 0), ju = Math.min(j + 1, GH - 1);
      const gx = (hgt[j * GW + ir] - hgt[j * GW + il]) / ((ir - il) * cellX);
      const gy = (hgt[ju * GW + i] - hgt[jd * GW + i]) / ((ju - jd) * cellY);
      const inv = 1 / Math.sqrt(gx * gx + gy * gy + 1);
      let lamb = (-gx * LX - gy * LY + LZ) * inv;
      if (lamb < 0) lamb = 0;
      /* march toward the sun; penumbra widens with distance (soft edges) */
      const h0 = hgt[j * GW + i];
      let vis = 1, t = 1.8;
      while (t < 170) {
        const rayH = h0 + t * 0.5774;            /* tan 30° */
        if (rayH > hMax) break;
        const p = 0.5 + (rayH - sampleH(x - 0.7071 * t, y + 0.7071 * t)) / (t * 0.08);
        if (p < vis) vis = p < 0 ? 0 : p;
        if (vis < 0.03) break;
        t *= 1.22;
      }
      tone[j * GW + i] = lamb * (0.35 + 0.65 * vis);
    }
    if ((j & 15) === 15) await tick();
  }

  /* pack: R = height, G = tone, half-float so contours stay smooth */
  const toHalf = THREE.DataUtils.toHalfFloat;
  const packed = new Uint16Array(GW * GH * 2);
  for (let k = 0; k < GW * GH; k++) {
    packed[k * 2] = toHalf(hgt[k]);
    packed[k * 2 + 1] = toHalf(tone[k]);
  }
  const relief = new THREE.DataTexture(packed, GW, GH, THREE.RGFormat, THREE.HalfFloatType);
  relief.magFilter = relief.minFilter = THREE.LinearFilter;
  relief.needsUpdate = true;

  /* ---- the sheet: one plane, all drawing in the shader ---- */
  hero.insertBefore(canvas, hero.querySelector('.hero-inner'));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x191c24);
  const camera = new THREE.PerspectiveCamera(38, hero.clientWidth / hero.clientHeight, 1, 600);

  const uniforms = {
    uMorph:  { value: 0 },   /* 0 = flat 2D map, 1 = full relief */
    uTime:   { value: 0 },
    uPulse:  { value: 0 },
    uRelief: { value: relief },
  };

  const SEG_X = small ? 160 : 240;
  const SEG_Y = small ? 100 : 150;
  const geo = new THREE.PlaneGeometry(240, 150, SEG_X, SEG_Y);

  const vert = /* glsl */`
    varying vec2  vP;
    varying float vDist;
    uniform float uMorph;
    uniform sampler2D uRelief;
    void main() {
      vP = position.xy;
      float h = texture2D(uRelief, uv).r;
      vec3 displaced = vec3(position.x, position.y, h * uMorph);
      vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
      vDist = -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `;

  const frag = /* glsl */`
    precision highp float;
    varying vec2  vP;
    varying float vDist;
    uniform float uTime;
    uniform float uPulse;
    uniform float uMorph;
    uniform sampler2D uRelief;

    const vec3 INK   = vec3(0.098, 0.110, 0.141);  /* #191c24 */
    const vec3 LINE  = vec3(0.196, 0.224, 0.302);  /* minor contour */
    const vec3 MAJOR = vec3(0.310, 0.345, 0.447);  /* index contour */
    const vec3 GRAT  = vec3(0.137, 0.153, 0.196);  /* graticule */
    const vec3 VERM  = vec3(0.847, 0.149, 0.059);  /* #d8260f */

    /* anti-aliased iso line at integer values of e.
       Width is clamped to never go sub-derivative, then faded by the
       coverage ratio (Golus) so dense lines converge to a flat tint
       instead of moiréing at grazing angles. */
    float iso(float e, float wPx, float fadeA, float fadeB) {
      float dh = fwidth(e);
      float w  = wPx * dh;
      float dw = clamp(w, dh, 0.5);
      float f  = abs(fract(e - 0.5) - 0.5);
      float line = (1.0 - smoothstep(dw - dh, dw + dh, f)) * clamp(w / dw, 0.0, 1.0);
      return line * (1.0 - smoothstep(fadeA, fadeB, dh));
    }

    void main() {
      vec2 hs = texture2D(uRelief, vP / vec2(240.0, 150.0) + 0.5).rg;
      vec3 col = INK;
      float fade = 1.0 - smoothstep(70.0, 240.0, vDist);   /* depth haze */
      float edge = (1.0 - smoothstep(100.0, 118.0, abs(vP.x)))
                 * (1.0 - smoothstep(60.0, 73.0, abs(vP.y)));

      /* relief shading: the baked NW hillshade, laid under the linework
         (Imhof's convention). The flat sheet is unshaded — depth arrives
         with the relief. 0.5 is the tone of flat, unshadowed ground. */
      col *= 1.0 + (hs.g - 0.5) * 0.75 * uMorph * edge * fade;

      /* graticule: survey grid every 24 units */
      float gr = max(iso(vP.x / 24.0, 0.6, 0.3, 0.6), iso(vP.y / 24.0, 0.6, 0.3, 0.6));
      col = mix(col, GRAT, gr * 0.85 * edge * fade);

      /* contours: one line per 1.8 elevation units, index every 5th
         (cartographic 1:5 convention, index lines ~1.5x wider) */
      float e = hs.r * 0.5556;
      float minor = iso(e, 0.9, 0.25, 0.5);
      float major = iso(e / 5.0, 1.35, 0.45, 0.9);
      col = mix(col, LINE,  minor * 0.85 * edge * fade);
      col = mix(col, MAJOR, major * 0.95 * edge * fade);

      /* the benchmark: vermillion survey mark on the NE summit */
      vec2 bp = vP - vec2(65.0, 27.0);
      float d  = length(bp);
      float ring  = 1.0 - smoothstep(0.45, 0.85, abs(d - 2.6));
      float dot_  = 1.0 - smoothstep(0.5, 1.0, d);
      float cross = (1.0 - smoothstep(0.18, 0.5, min(abs(bp.x), abs(bp.y))))
                  * (1.0 - smoothstep(4.2, 5.4, d)) * step(3.4, d);
      float mark = max(max(ring, dot_), cross) * (0.55 + 0.45 * uPulse);
      col = mix(col, VERM, mark * fade);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;            /* lay the sheet flat, +y local = north */
  scene.add(mesh);

  /* ---- choreography ---- */
  const TARGET = new THREE.Vector3(0, 4, -4);
  let cx = 0, cy = 0, tcx = 0, tcy = 0;      /* cursor steer, -1..1 */
  let start = null;
  let running = false, visible = true, raf = null;

  const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function frame(now) {
    if (!start) start = now + 400;           /* hold the flat sheet briefly */
    const t = now / 1000;
    /* sequenced reveal: relief rises first, camera tilt overlaps from 30% */
    const p = Math.min(Math.max((now - start) / 2600, 0), 1);
    const morph = easeInOut(Math.min(p / 0.62, 1));
    const tilt  = easeInOut(Math.min(Math.max((p - 0.30) / 0.70, 0), 1));

    uniforms.uMorph.value = morph;
    uniforms.uTime.value = t;
    uniforms.uPulse.value = 0.5 + 0.5 * Math.sin(t * 2.1);

    cx += (tcx - cx) * 0.06;
    cy += (tcy - cy) * 0.06;

    const scroll = Math.min(scrollY / Math.max(hero.clientHeight, 1), 1);
    const polar = 0.06 + 0.92 * tilt + cy * 0.06 + scroll * 0.2;   /* rest ≈ 56° */
    const az    = Math.sin(t * 0.05) * 0.05 + cx * 0.16;
    const R     = 150 + 18 * tilt;

    camera.position.set(
      TARGET.x + R * Math.sin(polar) * Math.sin(az),
      TARGET.y + R * Math.cos(polar),
      TARGET.z + R * Math.sin(polar) * Math.cos(az)
    );
    camera.lookAt(TARGET);
    renderer.render(scene, camera);
    raf = running ? requestAnimationFrame(frame) : null;
  }
  function play()  { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } }
  function pause() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

  new IntersectionObserver((en) => {
    visible = en[0].isIntersecting;
    visible ? play() : pause();
  }, { threshold: 0.02 }).observe(hero);
  document.addEventListener('visibilitychange', () => { document.hidden ? pause() : play(); });

  if (matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      tcx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tcy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    hero.addEventListener('pointerleave', () => { tcx = 0; tcy = 0; });
  }

  new ResizeObserver(() => {
    renderer.setSize(hero.clientWidth, hero.clientHeight, false);
    camera.aspect = hero.clientWidth / hero.clientHeight;
    camera.updateProjectionMatrix();
  }).observe(hero);

  /* hand over from the hand-drawn sheet to the live one */
  hero.classList.add('hero--3d');
  play();
})();
