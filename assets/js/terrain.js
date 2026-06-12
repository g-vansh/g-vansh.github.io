/* terrain.js — the hero relief. The hand-drawn 2D contour sheet rises
   into a 3D topographic survey. Progressive enhancement: if WebGL, ES
   modules, or motion are unavailable, the inline SVG contours remain. */
import * as THREE from '/assets/vendor/three.module.min.js';

(() => {
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
  hero.insertBefore(canvas, hero.querySelector('.hero-inner'));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x191c24);
  const camera = new THREE.PerspectiveCamera(38, hero.clientWidth / hero.clientHeight, 1, 600);

  /* ---- the sheet: one plane, all drawing in the shader ---- */
  const uniforms = {
    uMorph:  { value: 0 },   /* 0 = flat 2D map, 1 = full relief */
    uTime:   { value: 0 },
    uPulse:  { value: 0 },
  };

  const SEG_X = small ? 160 : 240;
  const SEG_Y = small ? 100 : 150;
  const geo = new THREE.PlaneGeometry(240, 150, SEG_X, SEG_Y);

  const vert = /* glsl */`
    varying float vH;
    varying vec2  vP;
    varying float vDist;
    uniform float uMorph;
    float g(vec2 p, vec2 c, float s) {
      vec2 d = p - c;
      return exp(-dot(d, d) / (2.0 * s * s));
    }
    float height(vec2 p) {
      float h = 0.0;
      h += 16.0 * g(p, vec2(  65.0,  27.0), 28.0);   /* NE summit (the benchmark) */
      h += 20.0 * g(p, vec2( -48.0, -42.0), 38.0);   /* SW massif */
      h += 11.0 * g(p, vec2(-101.0,  13.0), 26.0);   /* W ridge */
      h +=  9.0 * g(p, vec2( -24.0,  59.0), 22.0);   /* N rise */
      h += 1.2 * sin(p.x * 0.045 + 1.7) * cos(p.y * 0.05 + 0.6);
      return h;
    }
    void main() {
      vP = position.xy;
      float h = height(position.xy);
      vH = h;
      vec3 displaced = vec3(position.x, position.y, h * uMorph);
      vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
      vDist = -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `;

  const frag = /* glsl */`
    precision highp float;
    varying float vH;
    varying vec2  vP;
    varying float vDist;
    uniform float uTime;
    uniform float uPulse;

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
      vec3 col = INK;
      float fade = 1.0 - smoothstep(70.0, 240.0, vDist);   /* depth haze */
      float edge = (1.0 - smoothstep(100.0, 118.0, abs(vP.x)))
                 * (1.0 - smoothstep(60.0, 73.0, abs(vP.y)));

      /* graticule: survey grid every 24 units */
      float gr = max(iso(vP.x / 24.0, 0.6, 0.3, 0.6), iso(vP.y / 24.0, 0.6, 0.3, 0.6));
      col = mix(col, GRAT, gr * 0.85 * edge * fade);

      /* contours: one line per 1.8 elevation units, index every 5th
         (cartographic 1:5 convention, index lines ~1.5x wider) */
      float e = vH * 0.5556;
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
