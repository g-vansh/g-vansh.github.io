# Quick Reference Guide - Website Enhancements

## New CSS Classes & Animations

### Animation Classes

#### Hero Section
```scss
.hero-name {
  // Main hero title
  // Auto-splits into animated characters
  // Background gradient animation
  // Floating animation on individual characters
}

.hero-char {
  // Individual character in hero name
  // Automatically created by JavaScript
  // Has entrance and floating animations
}

.hero-subtitle {
  // Subtitle under hero name
  // Has reveal-on-scroll animation
}
```

#### Navigation
```scss
.masthead {
  // Floating navigation bar
  // Slide-in animation on page load
  // Hover glow effects
  // Responsive sizing
}

.visible-links li a {
  // Navigation links
  // Animated underline on hover
  // Color transition to accent
  // Smooth lift on hover
}
```

#### Utility Classes
```scss
.reveal-on-scroll {
  // Add to any element for fade-in on scroll
  // Automatically animated by GSAP ScrollTrigger
  // Initial state: opacity 0, translateY 50px
}

.kinetic-text {
  // Add for animated gradient text
  // Background color shift animation
  // Works best on hero elements
}

.parallax-image {
  // Add for parallax scroll effect
  // Use data-speed attribute to control speed
  // Example: data-speed="0.3"
}
```

### Map Customization

#### Research Map
```scss
.custom-cluster {
  // Marker cluster styling
  // Size: 48px (desktop), 42px (mobile)
  // Font-weight: 700 for visibility
  // Glow effects per category
}

.custom-cluster.education-cluster {
  // Amber glow for education
}

.custom-cluster.coauthor-cluster {
  // Cyan glow for coauthors
}

.custom-cluster.talk-cluster {
  // Magenta glow for talks
}

.legend-container {
  // Map legend box
  // Responsive sizing
  // Mobile: max-width 140px (768px), 120px (480px)
}
```

#### Community Map
```scss
.marker-cluster {
  // Community map clusters
  // Size: 42px (mobile), 38px (very small)
  // Solid background with high contrast
  // Strong border and shadow
}

.leaflet-popup-content-wrapper {
  // Popup container
  // max-width: 280px (mobile)
  // Rounded corners: 10px
}
```

## JavaScript Functions

### Motion Core (motion-core.js)

```javascript
// Global object for control
window.academicKinetic = {
  lenis: lenis,          // Smooth scroll instance
  destroy: () => {...}   // Stop all animations
}

// Disable all motion
window.academicKinetic.destroy();
```

### Three.js Background (three-background.js)

```javascript
// Automatically initialized on homepage
// Respects prefers-reduced-motion
// No manual control needed

// Particle counts:
// - Desktop: 800 particles
// - Mobile: 300 particles
```

## CSS Variables

```css
:root {
  /* Colors */
  --neo-bg: #020a06;
  --neo-accent: #9bff1f;
  --neo-cyan: #62ffc6;
  --neo-amber: #ffd86b;
  --neo-text: #f2ffe9;
  
  /* Spacing */
  --research-map-height: clamp(360px, 55vh, 600px);
  
  /* Animation */
  --neo-transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
```

## Responsive Breakpoints

```scss
// Small mobile
@media (max-width: 480px) { }

// Mobile
@media (max-width: 600px) { }

// Tablet
@media (max-width: 768px) { }

// Desktop
@media (min-width: 769px) { }

// Large desktop
@media (min-width: 1280px) { }
```

## Animation Keyframes

### Available Animations

```scss
@keyframes pageLoadFade {
  // Fade in on page load (auto-applied to body)
}

@keyframes mastheadSlideIn {
  // Navigation slide-in animation
}

@keyframes heroSpectrum {
  // Hero name gradient shift
}

@keyframes heroSheen {
  // Hero name shine effect
}

@keyframes glow {
  // Pulsing glow effect
  // Applied to hero section border
}

@keyframes pulse {
  // Scale pulse animation
}

@keyframes shimmer {
  // Shimmer effect (background position)
}
```

## GSAP Animations

### Adding Custom Animations

```javascript
// Fade in on scroll
gsap.fromTo('.your-element',
  { opacity: 0, y: 50 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.your-element',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  }
);

// Stagger animation
gsap.fromTo('.your-items',
  { opacity: 0, x: -30 },
  {
    opacity: 1,
    x: 0,
    stagger: 0.1,  // 0.1s delay between items
    duration: 0.6
  }
);

// Hover animation
element.addEventListener('mouseenter', () => {
  gsap.to(element, {
    y: -8,
    scale: 1.02,
    duration: 0.4,
    ease: 'power2.out'
  });
});
```

## Performance Tips

### Optimizing Animations

```scss
// Use for animated elements
.your-animated-element {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0); // GPU acceleration
}

// Remove will-change after animation
.your-animated-element.animated {
  will-change: auto;
}
```

### Mobile Optimizations

```scss
@media (max-width: 768px) {
  // Reduce particle counts
  // Disable complex animations
  // Use simpler transitions
  
  .complex-animation {
    animation: none; // Disable on mobile if needed
  }
}
```

## Common Customizations

### Change Accent Color

```scss
// In _sass/_variables.scss
$accent-color: #9bff1f;  // Change this
$accent-color-strong: #63ff9d;  // And this
```

### Adjust Animation Speed

```scss
// In _sass/_kinetic-theme.scss
$global-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
// Change duration from 0.3s to your preference
```

### Modify Particle Count

```javascript
// In assets/js/three-background.js
const particleCount = window.innerWidth < 768 ? 300 : 800;
// Change 300 and 800 to your preference
```

### Change Smooth Scroll Settings

```javascript
// In assets/js/motion-core.js
const lenis = new Lenis({
  duration: 1.2,    // Scroll duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  lerp: 0.1,        // Smoothness (lower = smoother, slower)
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});
```

## Debugging

### Check if Motion is Active

```javascript
// In browser console
console.log(window.academicKinetic);
// Should show: { lenis: {...}, destroy: function }

// Check if motion is ready
console.log(document.body.classList.contains('motion-ready'));
// Should be true
```

### Disable Motion Temporarily

```javascript
// In browser console
window.academicKinetic.destroy();

// Or reload page with reduced motion
// DevTools > Rendering > Emulate CSS prefers-reduced-motion: reduce
```

### Check Animation Status

```javascript
// Get all ScrollTrigger instances
console.log(ScrollTrigger.getAll());

// Get GSAP version
console.log(gsap.version);

// Get Three.js version
console.log(THREE.REVISION);
```

## Browser DevTools Tips

### Inspect Animations

1. **Chrome DevTools**:
   - Open DevTools (F12)
   - More tools > Animations
   - Record page load to see animation timeline

2. **Firefox DevTools**:
   - Inspector > Animations panel
   - Shows CSS and JS animations

3. **Performance Profiling**:
   - Performance tab > Record
   - Check for 60fps during animations
   - Look for long tasks (should be < 50ms)

### Test Responsive

```
Cmd/Ctrl + Shift + M (Chrome/Firefox)
- Test different device sizes
- Rotate device orientation
- Throttle network speed
```

## Common Issues & Fixes

### Hero Name Not Showing

```scss
// Add to _sass/_kinetic-theme.scss
.hero-name {
  opacity: 1 !important;
}

.hero-name .hero-char {
  opacity: 1 !important;
  color: #9bff1f !important;
}
```

### Animations Not Working

1. Check console for errors
2. Verify GSAP and Lenis are loaded
3. Check `motion-ready` class on body
4. Disable browser extensions
5. Clear cache and reload

### Map Not Responsive

```scss
// Add to custom.css
@media (max-width: 768px) {
  #research-map,
  .map-container {
    height: min(520px, 70vh) !important;
  }
}
```

### Particles Not Showing

1. Check if Three.js loaded: `console.log(typeof THREE)`
2. Check hero section exists: `document.querySelector('.hero-section')`
3. Check console for WebGL errors
4. Verify GPU acceleration enabled

## Support & Resources

### Documentation
- GSAP: https://greensock.com/docs/
- Three.js: https://threejs.org/docs/
- Lenis: https://github.com/studio-freight/lenis
- Leaflet: https://leafletjs.com/reference.html

### Community
- GSAP Forums: https://greensock.com/forums/
- Three.js Discord: https://discord.gg/threejs
- Stack Overflow: Use tags `gsap`, `three.js`, `leaflet`

---

**Last Updated:** November 2025
**Version:** 1.0
**Maintained by:** Website Enhancement Team
