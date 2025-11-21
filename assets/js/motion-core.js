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

  // Hero title kinetic animation
  const heroNameElement = document.querySelector('.hero-name');
  if (heroNameElement) {
    const heroText = heroNameElement.textContent.trim();

    if (heroText.length > 0) {
      heroNameElement.setAttribute('aria-label', heroText);

      const fragment = document.createDocumentFragment();

      heroText.split('').forEach((char, index) => {
        if (char === '\n' || char === '\r') {
          const breaker = document.createElement('span');
          breaker.className = 'hero-line-break';
          breaker.setAttribute('aria-hidden', 'true');
          fragment.appendChild(breaker);
          return;
        }

        const span = document.createElement('span');
        span.className = 'hero-char';
        if (char === ' ') {
          span.classList.add('hero-char--space');
          span.textContent = '\u00A0';
        } else {
          span.textContent = char;
        }
        span.dataset.index = index;
        fragment.appendChild(span);
      });

      heroNameElement.textContent = '';
      heroNameElement.appendChild(fragment);

      const heroChars = heroNameElement.querySelectorAll('.hero-char');

      if (heroChars.length > 0) {
        const heroIntro = gsap.timeline({
          defaults: {
            ease: 'expo.out',
          },
        });

        heroIntro.fromTo(
          heroChars,
          {
            yPercent: 60,
            rotateX: -25,
            opacity: 0,
            filter: 'blur(3px)',
          },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: {
              amount: 0.85,
              from: 'start',
            },
          }
        );

        heroIntro.fromTo(
          heroChars,
          {
            scaleY: 0.92,
          },
          {
            scaleY: 1,
            duration: 0.65,
            ease: 'power2.out',
            stagger: {
              amount: 0.35,
              from: 'center',
            },
          },
          0.05
        );

        gsap.to(heroChars, {
          yPercent: 4,
          repeat: -1,
          yoyo: true,
          duration: () => gsap.utils.random(1.8, 2.6),
          ease: 'sine.inOut',
          stagger: {
            each: 0.25,
            from: 'random',
          },
        });

        gsap.to(heroNameElement, {
          textShadow: '0 0 60px rgba(155, 255, 31, 0.55)',
          repeat: -1,
          yoyo: true,
          duration: 3.5,
          ease: 'sine.inOut',
        });
      }
    }
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
  const cardElements = document.querySelectorAll('.bento-card, .echelon-card, .archive__item, .affiliation-card');
  
  if (cardElements.length > 0) {
    cardElements.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(155, 255, 31, 0.35)',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(155, 255, 31, 0.08)',
        });
      });
    });
  }

  // Button hover animations
  const buttons = document.querySelectorAll('.btn, button:not(.navicon)');
  if (buttons.length > 0) {
    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });
  }

  // Stagger animation for list items
  const listItems = document.querySelectorAll('.archive .list__item, .publications .archive__item');
  if (listItems.length > 0) {
    gsap.fromTo(
      listItems,
      {
        opacity: 0,
        x: -30,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: listItems[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Add entrance animation to sidebar
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    gsap.fromTo(
      sidebar,
      {
        opacity: 0,
        x: -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      }
    );
  }

  // Animate footer on scroll
  const footer = document.querySelector('.page__footer');
  if (footer) {
    gsap.fromTo(
      footer,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
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
