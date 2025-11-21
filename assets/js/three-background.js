/**
 * Three.js Particle Background Effect
 * Creates an interactive 3D particle system for enhanced visual appeal
 */

(function() {
  'use strict';

  function initThreeBackground(ThreeLib) {
    if (!ThreeLib) {
      console.warn('Three.js not available. Skipping 3D background effects.');
      return;
    }

    // Preserve global for any legacy scripts
    window.THREE = ThreeLib;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      console.log('User prefers reduced motion. Skipping Three.js effects.');
      return;
    }

    // Only run on homepage with hero section
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) {
      return;
    }

    // Create canvas container
    const canvas = document.createElement('canvas');
    canvas.id = 'three-bg-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.5';
    document.body.insertBefore(canvas, document.body.firstChild);

    // Scene setup
    const scene = new ThreeLib.Scene();
    const camera = new ThreeLib.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new ThreeLib.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle system
    const particleCount = window.innerWidth < 768 ? 300 : 800;
    const particles = new ThreeLib.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Accent colors
    const accentColor = new ThreeLib.Color(0x9bff1f);
    const cyanColor = new ThreeLib.Color(0x63ff9d);
    const amberColor = new ThreeLib.Color(0xffd86b);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Position
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      // Velocity
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      // Color variation
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.6) {
        color = accentColor;
      } else if (colorChoice < 0.85) {
        color = cyanColor;
      } else {
        color = amberColor;
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particles.setAttribute('position', new ThreeLib.BufferAttribute(positions, 3));
    particles.setAttribute('color', new ThreeLib.BufferAttribute(colors, 3));

    const particleMaterial = new ThreeLib.PointsMaterial({
      size: window.innerWidth < 768 ? 0.8 : 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: ThreeLib.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particleSystem = new ThreeLib.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotationX = mouseY * 0.2;
      targetRotationY = mouseX * 0.2;
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Update particle positions
      const currentPositions = particles.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        currentPositions[i3] += velocities[i3];
        currentPositions[i3 + 1] += velocities[i3 + 1];
        currentPositions[i3 + 2] += velocities[i3 + 2];

        // Boundary check and wrap
        if (Math.abs(currentPositions[i3]) > 50) velocities[i3] *= -1;
        if (Math.abs(currentPositions[i3 + 1]) > 50) velocities[i3 + 1] *= -1;
        if (Math.abs(currentPositions[i3 + 2]) > 25) velocities[i3 + 2] *= -1;
      }
      particles.attributes.position.needsUpdate = true;

      // Smooth rotation based on mouse
      particleSystem.rotation.x += (targetRotationX - particleSystem.rotation.x) * 0.05;
      particleSystem.rotation.y += (targetRotationY - particleSystem.rotation.y) * 0.05;

      // Slow continuous rotation
      particleSystem.rotation.z += 0.0002;

      renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      renderer.dispose();
      particles.dispose();
      particleMaterial.dispose();
    });

    console.log('Three.js particle background initialized');
  }

  function bootstrapThreeBackground() {
    if (typeof THREE !== 'undefined') {
      initThreeBackground(THREE);
    } else if (window.__threeReady && typeof window.__threeReady.then === 'function') {
      window.__threeReady
        .then((ThreeLib) => initThreeBackground(ThreeLib || window.THREE))
        .catch((error) => {
          console.warn('Three.js promise rejected. Skipping 3D background effects.', error);
        });
    } else {
      console.warn('Three.js not loaded. Skipping 3D background effects.');
    }
  }

  bootstrapThreeBackground();
})();
