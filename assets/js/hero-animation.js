/**
 * VANSH GUPTA - Epic Hero Landing Animation
 * Inspired by F1 telemetry and Lando Norris's website
 * Features: Grid convergence, particle explosions, glitch effects, holographic overlays
 */

(function() {
  'use strict';

  // Check dependencies and motion preferences
  if (typeof gsap === 'undefined') {
    console.warn('Hero Animation: GSAP not loaded');
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    console.log('Hero Animation: Reduced motion enabled');
    return;
  }

  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const body = document.body;
  if (body && !body.classList.contains('hero-sequence-pending')) {
    body.classList.add('hero-sequence-pending');
  }

  const heroNameRevealController = {
    unlocked: false,
    timeoutId: null,
    scrollHandler: null,
  };

  function revealHeroName(trigger = 'direct') {
    if (heroNameRevealController.unlocked) {
      return;
    }
    heroNameRevealController.unlocked = true;
    if (heroNameRevealController.timeoutId) {
      clearTimeout(heroNameRevealController.timeoutId);
      heroNameRevealController.timeoutId = null;
    }
    if (heroNameRevealController.scrollHandler) {
      window.removeEventListener('scroll', heroNameRevealController.scrollHandler);
      heroNameRevealController.scrollHandler = null;
    }
    document.body.classList.add('hero-name-revealed');
  }

  function armHeroNameReveal() {
    if (!heroNameRevealController.timeoutId) {
      heroNameRevealController.timeoutId = window.setTimeout(() => revealHeroName('timer'), 2600);
    }
    const handler = () => revealHeroName('scroll');
    heroNameRevealController.scrollHandler = handler;
    window.addEventListener('scroll', handler, { passive: true, once: true });
  }

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  // ============================================================================
  // PARTICLE FIELD EXPLOSION SYSTEM
  // ============================================================================
  
  class ParticleExplosion {
    constructor(container) {
      this.container = container;
      this.particles = [];
       this.signals = [];
      this.animating = false;
       this.maxSignals = isMobile ? 10 : 18;
       this.lightbulbIcon = '💡';
      this.init();
    }

    init() {
      const canvas = document.createElement('canvas');
      canvas.id = 'particle-explosion-canvas';
      Object.assign(canvas.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '2',
      });
      this.container.appendChild(canvas);

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.resize();

      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const rect = this.container.getBoundingClientRect();
      this.canvas.width = rect.width * window.devicePixelRatio;
      this.canvas.height = rect.height * window.devicePixelRatio;
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.centerX = rect.width / 2;
      this.centerY = rect.height / 2;
    }

    createParticles(options = {}) {
      const {
        count = isMobile ? 50 : 110,
        velocity = isMobile ? 1.8 : 3.2,
        colorSet = ['#9bff1f', '#63ff9d', '#ffd86b'],
      } = options;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const spreadVelocity = velocity + Math.random() * 0.8;
        const baseRadius = Math.random() * 2.6 + 1;

        this.particles.push({
          x: this.centerX,
          y: this.centerY,
          vx: Math.cos(angle) * spreadVelocity,
          vy: Math.sin(angle) * spreadVelocity,
          radius: baseRadius,
          baseRadius,
          color: colorSet[Math.floor(Math.random() * colorSet.length)],
          life: 1,
          decay: 0.012 + Math.random() * 0.015,
          isIdea: false,
          ideaLife: 0,
        });
      }
    }

    detonate(options = {}) {
      this.createParticles(options);
      if (!this.animating) {
        this.animating = true;
        this.animate();
      }
    }

    drawStandardParticle(particle) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.life;
      this.ctx.fill();
      this.ctx.restore();
    }

    drawIdeaParticle(particle) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0.4, particle.life);
      const glowRadius = particle.baseRadius * 2.4;
      const gradient = this.ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        glowRadius
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'rgba(155, 255, 31, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.font = `${isMobile ? 15 : 18}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = '#fdf5a6';
      this.ctx.fillText(this.lightbulbIcon, particle.x, particle.y + (isMobile ? 1 : 2));
      this.ctx.restore();
    }

    promoteParticleToIdea(particle) {
      if (!particle || particle.isIdea) {
        return;
      }
      particle.isIdea = true;
      particle.ideaLife = 0.9 + Math.random() * 0.6;
    }

    spawnSignal() {
      if (this.particles.length < 2) {
        return;
      }

      const source = this.particles[Math.floor(Math.random() * this.particles.length)];
      if (!source) return;

      let target = null;
      for (let attempt = 0; attempt < 8; attempt++) {
        const candidate = this.particles[Math.floor(Math.random() * this.particles.length)];
        if (!candidate || candidate === source) continue;
        const dx = candidate.x - source.x;
        const dy = candidate.y - source.y;
        const distance = Math.hypot(dx, dy);
        if (distance <= (isMobile ? 22 : 32)) {
          target = candidate;
          break;
        }
      }

      if (target) {
        this.signals.push({
          source,
          target,
          progress: 0,
          speed: 0.018 + Math.random() * 0.03,
        });
        if (this.signals.length > this.maxSignals) {
          this.signals.shift();
        }
      }
    }

    drawSignals() {
      if (!this.signals.length) {
        return;
      }

      this.signals = this.signals.filter((signal) => {
        const { source, target } = signal;
        if (!source || !target || source.life <= 0 || target.life <= 0) {
          return false;
        }

        signal.progress += signal.speed;
        const completion = Math.min(signal.progress, 1);
        const sx = source.x;
        const sy = source.y;
        const tx = target.x;
        const ty = target.y;
        const cx = sx + (tx - sx) * completion;
        const cy = sy + (ty - sy) * completion;

        this.ctx.save();
        const gradient = this.ctx.createLinearGradient(sx, sy, tx, ty);
        gradient.addColorStop(0, source.color);
        gradient.addColorStop(1, target.color);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = isMobile ? 0.6 : 0.9;
        this.ctx.globalAlpha = 0.25 + 0.4 * (1 - Math.abs(completion - 0.5));
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(cx, cy);
        this.ctx.stroke();
        this.ctx.restore();

        if (signal.progress >= 1) {
          if (Math.random() < 0.45) {
            this.promoteParticleToIdea(target);
          }
          return false;
        }
        return true;
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles = this.particles.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;

        if (particle.life <= 0) {
          return false;
        }

        if (particle.isIdea) {
          particle.ideaLife -= 0.01;
          if (particle.ideaLife <= 0) {
            particle.isIdea = false;
            particle.ideaLife = 0;
          }
        }

        if (particle.isIdea) {
          this.drawIdeaParticle(particle);
        } else {
          this.drawStandardParticle(particle);
        }

        return true;
      });

      if (this.particles.length > 1 && Math.random() < 0.08) {
        this.spawnSignal();
      }

      this.drawSignals();
      this.ctx.globalAlpha = 1;

      if (this.particles.length > 0) {
        requestAnimationFrame(() => this.animate());
      } else {
        this.animating = false;
      }
    }
  }

  // ============================================================================
  // GRID CONVERGENCE SYSTEM
  // ============================================================================
  
  class GridConvergence {
    constructor(container) {
      this.container = container;
      this.verticalLines = [];
      this.horizontalLines = [];
      this.init();
    }

    init() {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'grid-convergence';
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.pointerEvents = 'none';
      svg.style.zIndex = '0';
      svg.style.opacity = '0';
      
      this.container.appendChild(svg);
      this.svg = svg;
      
      this.createGrid();
      this.animateGrid();
    }

    createGrid() {
      const width = this.container.offsetWidth;
      const height = this.container.offsetHeight;
      this.width = width;
      this.height = height;
      this.centerX = width / 2;
      this.centerY = height / 2;
      const lines = isMobile ? 15 : 30;
      
      // Vertical lines
      for (let i = 0; i < lines; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const x = (width / lines) * i;
        line.setAttribute('x1', x);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', x);
        line.setAttribute('y2', height);
        line.setAttribute('stroke', '#9bff1f');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0.3');
        line.classList.add('grid-line', 'grid-vertical');
        this.svg.appendChild(line);
        this.verticalLines.push(line);
      }
      
      // Horizontal lines
      for (let i = 0; i < lines; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const y = (height / lines) * i;
        line.setAttribute('x1', 0);
        line.setAttribute('y1', y);
        line.setAttribute('x2', width);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#9bff1f');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0.3');
        line.classList.add('grid-line', 'grid-horizontal');
        this.svg.appendChild(line);
        this.horizontalLines.push(line);
      }
    }

    animateGrid() {
      const tl = gsap.timeline();
      const verticalLines = this.verticalLines.length ? this.verticalLines : this.svg.querySelectorAll('.grid-vertical');
      const horizontalLines = this.horizontalLines.length ? this.horizontalLines : this.svg.querySelectorAll('.grid-horizontal');
      const centerX = typeof this.centerX === 'number' ? this.centerX : this.container.offsetWidth / 2;
      const centerY = typeof this.centerY === 'number' ? this.centerY : this.container.offsetHeight / 2;
      
      tl.to(this.svg, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut'
      });

      // Converge vertical lines
      tl.to(verticalLines, {
        attr: { x1: centerX, x2: centerX },
        duration: 1.2,
        stagger: 0.02,
        ease: 'power3.inOut',
        opacity: 0.6
      }, 0.3);

      // Converge horizontal lines
      tl.to(horizontalLines, {
        attr: { y1: centerY, y2: centerY },
        duration: 1.2,
        stagger: 0.02,
        ease: 'power3.inOut',
        opacity: 0.6
      }, 0.3);

      // Fade out grid
      tl.to(this.svg, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      }, '+=0.2');
    }
  }

  // ============================================================================
  // TELEMETRY DATA BARS
  // ============================================================================
  
  class TelemetryBars {
    constructor(container) {
      this.container = container;
      this.init();
    }

    init() {
      const barsContainer = document.createElement('div');
      barsContainer.id = 'telemetry-bars';
      barsContainer.style.position = 'absolute';
      barsContainer.style.top = '0';
      barsContainer.style.left = '0';
      barsContainer.style.width = '100%';
      barsContainer.style.height = '100%';
      barsContainer.style.pointerEvents = 'none';
      barsContainer.style.zIndex = '1';
      barsContainer.style.opacity = '0';
      
      this.container.appendChild(barsContainer);
      this.barsContainer = barsContainer;
      
      this.createBars();
      this.animate();
    }

    createBars() {
      const count = isMobile ? 8 : 16;
      const colors = ['#9bff1f', '#63ff9d', '#ffd86b'];
      
      for (let i = 0; i < count; i++) {
        const bar = document.createElement('div');
        bar.className = 'telemetry-bar';
        bar.style.position = 'absolute';
        bar.style.height = '2px';
        bar.style.background = colors[Math.floor(Math.random() * colors.length)];
        bar.style.boxShadow = `0 0 10px ${colors[i % colors.length]}`;
        bar.style.transformOrigin = 'center center';
        bar.style.opacity = '0.7';
        
        // Randomize position
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { // top
          bar.style.top = Math.random() * 30 + '%';
          bar.style.left = '0';
          bar.style.width = '100%';
        } else if (side === 1) { // right
          bar.style.top = '0';
          bar.style.right = Math.random() * 30 + '%';
          bar.style.height = '100%';
          bar.style.width = '2px';
        } else if (side === 2) { // bottom
          bar.style.bottom = Math.random() * 30 + '%';
          bar.style.left = '0';
          bar.style.width = '100%';
        } else { // left
          bar.style.top = '0';
          bar.style.left = Math.random() * 30 + '%';
          bar.style.height = '100%';
          bar.style.width = '2px';
        }
        bar.style.transform = 'translate3d(0, 0, 0)';
        bar.style.willChange = 'transform, opacity';
        bar.style.opacity = '0.85';
        this.barsContainer.appendChild(bar);
      }
    }

    animate() {
      const tl = gsap.timeline({ delay: 0.5 });
      const bars = Array.from(this.barsContainer.querySelectorAll('.telemetry-bar'));
      const containerRect = this.container.getBoundingClientRect();
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const containerCenterY = containerRect.top + containerRect.height / 2;
      
      tl.to(this.barsContainer, {
        opacity: 1,
        duration: 0.3
      });

      tl.add(() => {
        bars.forEach((bar, index) => {
          const barRect = bar.getBoundingClientRect();
          const barCenterX = barRect.left + barRect.width / 2;
          const barCenterY = barRect.top + barRect.height / 2;
          const deltaX = containerCenterX - barCenterX;
          const deltaY = containerCenterY - barCenterY;

          gsap.to(bar, {
            x: deltaX,
            y: deltaY,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 1.1,
            ease: 'power3.inOut',
            delay: index * 0.02
          });

          gsap.to(bar, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            delay: 1.2 + index * 0.015
          });
        });
      }, 0.3);

      tl.to(this.barsContainer, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        delay: 1.6,
        onComplete: () => this.barsContainer.remove()
      });
    }
  }

  // ============================================================================
  // GLITCH EFFECT
  // ============================================================================
  
  class GlitchEffect {
    constructor(element) {
      this.element = element;
      this.init();
    }

    init() {
      const glitchTimeline = gsap.timeline({ delay: 1.5 });
      
      // Quick glitch bursts
      for (let i = 0; i < 3; i++) {
        glitchTimeline.to(this.element, {
          x: () => gsap.utils.random(-10, 10),
          duration: 0.05,
          repeat: 5,
          yoyo: true,
          ease: 'power4.inOut'
        }, i * 0.3);

        glitchTimeline.to(this.element, {
          textShadow: `
            ${gsap.utils.random(-5, 5)}px ${gsap.utils.random(-5, 5)}px 0 #ff0000,
            ${gsap.utils.random(-5, 5)}px ${gsap.utils.random(-5, 5)}px 0 #00ffff,
            ${gsap.utils.random(-5, 5)}px ${gsap.utils.random(-5, 5)}px 0 #9bff1f
          `,
          duration: 0.05,
          repeat: 3,
          yoyo: true
        }, i * 0.3);
      }

      glitchTimeline.to(this.element, {
        x: 0,
        textShadow: '0 0 60px rgba(155, 255, 31, 0.55)',
        duration: 0.3
      });
    }
  }

  // ============================================================================
  // HOLOGRAPHIC SCANNER
  // ============================================================================
  
  class HolographicScanner {
    constructor(container) {
      this.container = container;
      this.init();
    }

    init() {
      const scanner = document.createElement('div');
      scanner.id = 'holographic-scanner';
      scanner.style.position = 'absolute';
      scanner.style.top = '0';
      scanner.style.left = '0';
      scanner.style.width = '100%';
      scanner.style.height = '4px';
      scanner.style.background = 'linear-gradient(90deg, transparent, #9bff1f, transparent)';
      scanner.style.boxShadow = '0 0 20px #9bff1f, 0 0 40px #9bff1f';
      scanner.style.opacity = '0';
      scanner.style.zIndex = '3';
      scanner.style.pointerEvents = 'none';
      
      this.container.appendChild(scanner);
      this.scanner = scanner;
      
      this.animate();
    }

    animate() {
      const tl = gsap.timeline({ delay: 2 });
      
      tl.to(this.scanner, {
        opacity: 0.8,
        duration: 0.3
      });

      tl.to(this.scanner, {
        y: this.container.offsetHeight,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: 1,
        yoyo: false
      });

      tl.to(this.scanner, {
        opacity: 0,
        duration: 0.3
      });
    }
  }

  // ============================================================================
  // ENHANCED HERO NAME ANIMATION
  // ============================================================================
  
  class ShockwavePulse {
    constructor(container) {
      this.container = container;
    }

    trigger(delay = 0) {
      setTimeout(() => {
        const ring = document.createElement('div');
        ring.className = 'hero-shockwave';
        this.container.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());
      }, delay * 1000);
    }
  }

  function animateCorners() {
    const corners = gsap.utils.toArray('.hero-corner');
    if (!corners.length) return;

    gsap.set(corners, {
      autoAlpha: 0,
      scale: 0.8,
      filter: 'blur(6px)',
    });

    gsap.to(corners, {
      autoAlpha: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.4,
    });

    gsap.to(corners, {
      y: '+=8',
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: 'sine.inOut',
      stagger: {
        each: 0.2,
        yoyo: true,
      },
    });
  }

  function enhancedHeroAnimation() {
    const heroName = document.querySelector('.hero-name');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const scanlinesOverlay = document.querySelector('.scanlines');
    const datapoints = document.querySelectorAll('.hero-datapoints .datapoint');
    
    if (!heroName) return;
    armHeroNameReveal();

    if (scanlinesOverlay) {
      gsap.set(scanlinesOverlay, { opacity: 0 });
      gsap.to(scanlinesOverlay, {
        opacity: 0.28,
        duration: 0.6,
        delay: 0.1,
        ease: 'power2.out'
      });
      gsap.to(scanlinesOverlay, {
        opacity: 0.12,
        duration: 1,
        delay: 2.6,
        ease: 'power2.out'
      });
    }

    // Create container for effects
    const effectsContainer = document.createElement('div');
    effectsContainer.id = 'hero-effects-container';
    effectsContainer.style.position = 'absolute';
    effectsContainer.style.top = '0';
    effectsContainer.style.left = '0';
    effectsContainer.style.width = '100%';
    effectsContainer.style.height = '100%';
    effectsContainer.style.pointerEvents = 'none';
    effectsContainer.style.overflow = 'hidden';
    effectsContainer.style.zIndex = '2';
    heroSection.insertBefore(effectsContainer, heroSection.firstChild);

    // Initialize all effects
    const gridConvergence = new GridConvergence(effectsContainer);
    const telemetryBars = new TelemetryBars(effectsContainer);
    const particleExplosion = new ParticleExplosion(effectsContainer);
    const glitchEffect = new GlitchEffect(heroName);
    const holographicScanner = new HolographicScanner(effectsContainer);
    const shockwavePulse = new ShockwavePulse(effectsContainer);

    // Enhanced text entrance
    const masterTimeline = gsap.timeline();
    masterTimeline.eventCallback('onComplete', () => {
      if (body) {
        body.classList.remove('hero-sequence-pending');
        body.classList.add('hero-sequence-complete');
      }
    });
    
    // Start with everything hidden
    gsap.set([heroName, heroSubtitle], { opacity: 0 });
    
    // Dramatic entrance after grid convergence
    masterTimeline.to(heroName, {
      opacity: 1,
      scale: 1.1,
      duration: 0.8,
      ease: 'power3.out',
      delay: 1.2
    });

    masterTimeline.to(heroName, {
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });

    masterTimeline.add(() => {
      particleExplosion.detonate();
      shockwavePulse.trigger();
    }, '-=0.2');
    
    masterTimeline.call(() => revealHeroName('timeline'));

    // Subtitle entrance
    masterTimeline.fromTo(heroSubtitle, {
      opacity: 0,
      y: 30,
      scale: 0.9
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.3');

    // Add pulsing glow effect
    gsap.to(heroName, {
      textShadow: '0 0 80px rgba(155, 255, 31, 0.8), 0 0 40px rgba(155, 255, 31, 0.6)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 3
    });

    if (datapoints.length) {
      gsap.from(datapoints, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 1.9
      });
    }

    animateCorners();

    heroSection.addEventListener('click', () => {
      particleExplosion.detonate({
        count: isMobile ? 35 : 90,
        velocity: isMobile ? 1.5 : 3.5,
      });
      shockwavePulse.trigger();
    });

    // Perspective shift on mouse move
    if (!isMobile) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(heroName, {
          rotateY: x * 15,
          rotateX: -y * 15,
          duration: 0.5,
          ease: 'power2.out'
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        gsap.to(heroName, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    }
  }

  // ============================================================================
  // SCROLL-TRIGGERED EFFECTS
  // ============================================================================
  
  function setupScrollEffects() {
    if (isMobile) return;

    // Parallax scroll for hero section
    gsap.to('.hero-section', {
      opacity: 0.6,
      scale: 0.97,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Scale hero name on scroll
    gsap.to('.hero-name', {
      scale: 0.8,
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // ============================================================================
  // MOBILE OPTIMIZATIONS
  // ============================================================================
  
  function setupMobileOptimizations() {
    if (isMobile) {
      // Reduce complexity for mobile
      document.body.classList.add('mobile-hero');
      
      // Touch interaction
      let touchStartY = 0;
      heroSection.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      });

      heroSection.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const heroName = document.querySelector('.hero-name');
        
        gsap.to(heroName, {
          scale: 1 + (deltaY * 0.0002),
          duration: 0.1
        });
      });

      heroSection.addEventListener('touchend', () => {
        const heroName = document.querySelector('.hero-name');
        gsap.to(heroName, {
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    }
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  function init() {
    // Add hero loaded class
    document.body.classList.add('hero-animation-ready');
    
    // Wait for fonts and images to load
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();

    fontsReady.then(() => {
      enhancedHeroAnimation();
      setupScrollEffects();
      setupMobileOptimizations();
      
      console.log('🏎️ Epic Hero Animation Initialized');
    }).catch(() => {
      enhancedHeroAnimation();
      setupScrollEffects();
      setupMobileOptimizations();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for debugging
  window.heroAnimation = {
    version: '2.0.0',
    mobile: isMobile,
    tablet: isTablet
  };

})();
