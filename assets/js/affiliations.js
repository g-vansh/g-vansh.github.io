document.addEventListener('DOMContentLoaded', () => {
  const affiliationsSection = document.querySelector('[data-affiliations]');
  if (!affiliationsSection) return;

  const prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const cards = Array.from(affiliationsSection.querySelectorAll('.affiliation-card'));
  const stats = Array.from(affiliationsSection.querySelectorAll('[data-count-up] .value'));

  const animateStats = () => {
    if (!window.gsap || !stats.length) return;
    stats.forEach((valueEl) => {
      const targetValue = Number(valueEl.textContent);
      if (Number.isNaN(targetValue)) return;

      valueEl.dataset.target = targetValue;
      valueEl.textContent = '0';

      gsap.fromTo(valueEl, { innerText: 0 }, {
        innerText: targetValue,
        duration: 1.4,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: affiliationsSection,
          start: 'top 80%',
          once: true
        }
      });
    });
  };

  const animateCards = () => {
    if (!window.gsap || !window.ScrollTrigger || !cards.length) return;

    gsap.set(cards, { opacity: 0, y: 24 });
    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.08,
          overwrite: true
        });
      }
    });

    if (!prefersReducedMotion) {
      cards.forEach((card) => {
        const onPointerMove = (event) => {
          const bounds = card.getBoundingClientRect();
          const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
          const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

          gsap.to(card, {
            rotationY: relativeX * 6,
            rotationX: relativeY * -6,
            transformPerspective: 900,
            transformOrigin: 'center',
            duration: 0.6,
            ease: 'power3.out'
          });
        };

        const resetTilt = () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: 'power3.out'
          });
        };

        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerleave', resetTilt);
        card.addEventListener('blur', resetTilt);
      });
    }
  };

  const initNebula = () => {
    const canvas = document.getElementById('affiliations-lattice');
    if (!canvas || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1.5, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 5;

    const resizeRenderer = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x9bff1f,
      size: 0.035,
      transparent: true,
      opacity: 0.55
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const gridGeometry = new THREE.BufferGeometry();
    const gridVertices = [];
    const size = 6;
    const divisions = 12;

    for (let i = 0; i <= divisions; i += 1) {
      const offset = (i / divisions - 0.5) * size;
      gridVertices.push(-size, offset, -2, size, offset, -2);
      gridVertices.push(offset, -size, -2, offset, size, -2);
    }

    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));

    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x62ffc6,
      transparent: true,
      opacity: 0.18
    });

    const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    scene.add(gridLines);

    let animationFrame = null;
    const animate = () => {
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;
      gridLines.rotation.z += 0.0004;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
      } else {
        animate();
      }
    });
  };

  animateCards();
  animateStats();
  if (!prefersReducedMotion) {
    initNebula();
  }
});
