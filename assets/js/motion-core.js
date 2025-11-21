/**
 * Academic Kinetic Motion Engine
 * Smooth scrolling with Lenis + GSAP ScrollTrigger animations
 */

(function() {
  'use strict';

  const root = document.documentElement;
  const body = document.body;

  const ensureVisible = () => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((element) => {
      element.style.opacity = 1;
      element.style.transform = 'none';
    });
  };

  const disableMotion = (reason, level = 'warn') => {
    if (body) {
      body.classList.add('motion-disabled');
      body.classList.remove('motion-ready');
    }
    if (root) {
      root.classList.remove('lenis-active');
    }
    ensureVisible();
    if (reason && console[level]) {
      console[level](reason);
    }
  };

  if (!body || !root) {
    disableMotion('Academic Kinetic: document not ready. Motion disabled.');
    return;
  }

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  if (prefersReducedMotion && prefersReducedMotion.matches) {
    disableMotion('Academic Kinetic: prefers-reduced-motion detected. Motion disabled.');
    return;
  }

  // Wait for DOM and dependencies
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') {
    disableMotion('Academic Kinetic: Lenis or GSAP not loaded. Motion disabled.');
    return;
  }

  body.classList.add('motion-ready');
  body.classList.remove('motion-disabled');
  root.classList.add('lenis-active');

  // Initialize Lenis smooth scroll with Apple-like inertia
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease out exponential
    lerp: 0.1, // Heavy inertia feel (Apple-like)
    smooth: true,
    smoothTouch: false, // Disable on touch devices for better performance
    touchMultiplier: 2,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Reveal on scroll animation
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length > 0) {
    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  // Kinetic Typography: Horizontal scroll-based movement
  const kineticTextElements = document.querySelectorAll('.kinetic-text');
  
  if (kineticTextElements.length > 0) {
    kineticTextElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5;
      
      gsap.to(element, {
        x: () => window.innerWidth * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // Parallax effect for images
  const parallaxElements = document.querySelectorAll('.parallax-image');
  
  if (parallaxElements.length > 0) {
    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.3;
      
      gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // Card hover lift effect (GSAP-powered)
  const cardElements = document.querySelectorAll('.bento-card, .echelon-card');
  
  if (cardElements.length > 0) {
    cardElements.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });
  }

  // Make lenis available globally for manual control if needed
  window.academicKinetic = {
    lenis: lenis,
    destroy: () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      disableMotion('Academic Kinetic: Motion engine destroyed.', 'info');
    },
  };

  if (prefersReducedMotion) {
    const handleMotionPreference = (event) => {
      if (event.matches && window.academicKinetic && window.academicKinetic.lenis) {
        window.academicKinetic.destroy();
      }
    };

    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', handleMotionPreference);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
      prefersReducedMotion.addListener(handleMotionPreference);
    }
  }

  console.log('Academic Kinetic Motion Engine initialized');
})();
