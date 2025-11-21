/**
 * Mobile menu overlay inspired by Lando Norris' site
 */

(function() {
  'use strict';

  if (typeof window === 'undefined') return;
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.getElementById('mobile-nav-panel');

  if (!toggle || !overlay) {
    return;
  }

  const focusableSelectors = 'a[href], button:not([disabled])';
  const animatedSelectors = '.mobile-nav-overlay__links li, .mobile-nav-action-btn, .mobile-nav-overlay__social-links a';
  let lastFocusElement = null;

  function animateOverlayIn() {
    // CSS animations handle the entrance now, but we can enhance with GSAP if available
    if (typeof gsap !== 'undefined') {
      const animatedTargets = overlay.querySelectorAll(animatedSelectors);
      if (!animatedTargets.length) return;

      // Reset any previous animations
      gsap.set(animatedTargets, { clearProps: 'all' });

      gsap.fromTo(
        animatedTargets,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: {
            amount: 0.3,
            from: 'start',
          },
        }
      );
    }
  }

  function getFocusableElements() {
    return overlay.querySelectorAll(focusableSelectors);
  }

  function animateIcon(open) {
    const icon = toggle.querySelector('.mobile-menu-toggle__icon');
    if (!icon) return;

    const spans = icon.querySelectorAll('span');
    if (spans.length < 3) return;

    if (open) {
      // Transform to X - hide middle line, rotate top and bottom
      if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      if (spans[1]) {
        spans[1].style.opacity = '0';
        spans[1].style.transform = 'scaleX(0)';
      }
      if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      // Reset to hamburger
      if (spans[0]) spans[0].style.transform = 'rotate(0) translate(0, 0)';
      if (spans[1]) {
        spans[1].style.opacity = '1';
        spans[1].style.transform = 'scaleX(1)';
      }
      if (spans[2]) spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
  }

  function openMenu() {
    if (overlay.classList.contains('is-open')) return;

    lastFocusElement = document.activeElement;
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-nav-open');

    // Animate icon
    animateIcon(true);

    // Focus management - delay to allow animation
    setTimeout(() => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }, 100);

    animateOverlayIn();
  }

  function closeMenu() {
    if (!overlay.classList.contains('is-open')) return;

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-nav-open');
    
    // Restore body scroll
    document.body.style.overflow = '';

    // Animate icon
    animateIcon(false);

    // Return focus after animation
    setTimeout(() => {
      if (lastFocusElement && typeof lastFocusElement.focus === 'function') {
        lastFocusElement.focus();
      } else {
        toggle.focus();
      }
    }, 300);
  }

  toggle.addEventListener('click', () => {
    if (overlay.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking on overlay background (not on links/buttons)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeMenu();
    }
  });
  
  // Close menu when clicking on navigation links (optional - can be removed if you want links to navigate)
  const navLinks = overlay.querySelectorAll('.mobile-nav-overlay__links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small delay to allow navigation
      setTimeout(() => {
        closeMenu();
      }, 100);
    });
  });

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    },
    { passive: true }
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (event.key !== 'Tab' || !overlay.classList.contains('is-open')) {
      return;
    }

    const focusableElements = getFocusableElements();
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
})();

