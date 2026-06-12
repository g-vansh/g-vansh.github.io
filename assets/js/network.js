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

/* ---------- 3 · the descent ---------- */
(() => {
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
  document.body.appendChild(canvas);

  const PAPER = 0xf4f3ef;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAPER);
  scene.fog = new THREE.Fog(PAPER, 240, 1500);
  const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 1, 4000);

  /* -- the country below: paper relief, graphite contours -- */
  const terra = new THREE.Mesh(
    new THREE.PlaneGeometry(4200, 4200, small ? 130 : 190, small ? 130 : 190),
    new THREE.ShaderMaterial({
      uniforms: { uFog: { value: new THREE.Color(PAPER) } },
      vertexShader: /* glsl */`
        varying float vH; varying vec2 vP; varying float vDist;
        float g(vec2 p, vec2 c, float s){ vec2 d=p-c; return exp(-dot(d,d)/(2.0*s*s)); }
        float height(vec2 p){
          float h = 0.0;
          h += 95.0 * g(p, vec2( 700.0,  420.0), 540.0);
          h += 130.0* g(p, vec2(-820.0, -520.0), 700.0);
          h += 70.0 * g(p, vec2(-1400.0, 300.0), 460.0);
          h += 55.0 * g(p, vec2( -260.0, 1050.0), 420.0);
          h += 8.0 * sin(p.x*0.004+1.7) * cos(p.y*0.0045+0.6);
          return h;
        }
        void main(){
          vP = position.xy;
          float h = height(position.xy);
          vH = h;
          vec4 mv = modelViewMatrix * vec4(position.x, position.y, h, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        precision highp float;
        varying float vH; varying vec2 vP; varying float vDist;
        uniform vec3 uFog;
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
          vec3 col = PAPER;
          float gr = max(iso(vP.x / 240.0, 0.6, 0.3, 0.6), iso(vP.y / 240.0, 0.6, 0.3, 0.6));
          col = mix(col, GRAPH, gr * 0.18);
          float e = vH * 0.085;
          col = mix(col, GRAPH, iso(e, 0.9, 0.25, 0.5) * 0.45);
          col = mix(col, INK,   iso(e / 5.0, 1.3, 0.45, 0.9) * 0.5);
          col = mix(col, uFog, smoothstep(500.0, 1700.0, vDist));
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
      img.data[i] = 251; img.data[i + 1] = 250; img.data[i + 2] = 246;
      img.data[i + 3] = (alpha * 255) | 0;
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  const N = small ? 110 : 200;
  const clouds = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: cloudTex, transparent: true, depthWrite: false, fog: true,
      opacity: 0.82,
    }),
    N
  );
  clouds.renderOrder = 1;
  /* one slab of cloud between 350 and 1150 up; sorted low→high so the
     far (low) ones draw first under the descending camera */
  const cl = [];
  for (let i = 0; i < N; i++) {
    cl.push({
      x: (rngCloud() - 0.5) * 2600,
      y: 350 + rngCloud() * 800,
      z: (rngCloud() - 0.5) * 2600,
      s: 260 + rngCloud() * 520,
      r: rngCloud() * Math.PI * 2,
    });
  }
  cl.sort((a, b) => a.y - b.y);
  scene.add(clouds);

  const dummy = new THREE.Object3D();
  const q = new THREE.Quaternion();
  const zAxis = new THREE.Vector3(0, 0, 1);
  const placeClouds = () => {
    for (let i = 0; i < N; i++) {
      const c = cl[i];
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

  /* -- choreography: arrive by air -- */
  const DUR = 3400;
  const bearing0 = rngPath() * Math.PI * 2;       /* a different approach every visit */
  const H0 = 1500, H1 = 120;
  const TARGET = new THREE.Vector3((rngPath() - 0.5) * 300, 0, (rngPath() - 0.5) * 300);
  let t0 = null, done = false, raf = null;

  /* cubic-in into the cloud deck, quint-out onto the sheet */
  const ease = (t) => t < 0.3
    ? 0.3 * Math.pow(t / 0.3, 3)
    : 0.3 + 0.7 * (1 - Math.pow(1 - (t - 0.3) / 0.7, 5));

  const land = () => {
    if (done) return;
    done = true;
    canvas.classList.add('gone');
    setTimeout(() => {
      if (raf) cancelAnimationFrame(raf);
      canvas.remove();
      renderer.dispose();
      cloudTex.dispose();
    }, 620);
  };

  const frame = (now) => {
    if (t0 === null) t0 = now + 250;
    const t = Math.min(Math.max((now - t0) / DUR, 0), 1);
    const p = ease(t);

    const alt = H0 + (H1 - H0) * p;
    const pitch = 0.42 * (1 - Math.min(p / 0.7, 1));   /* off-vertical → straight down by 70% */
    const az = bearing0 + p * 0.55;
    const r = alt * Math.tan(pitch) + 0.001;

    camera.position.set(TARGET.x + r * Math.sin(az), alt, TARGET.z + r * Math.cos(az));
    camera.lookAt(TARGET);
    if (pitch < 0.02) camera.rotation.z = az;          /* keep north drifting, not snapping */
    placeClouds();
    renderer.render(scene, camera);

    if (t >= 0.93 && !done) land();
    if (!done || t < 1) raf = requestAnimationFrame(frame);
  };
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
