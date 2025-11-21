# 🧪 Epic Hero Animation - Testing Guide

## Quick Start Testing

### 1. Local Development Server
```bash
# Install dependencies (if not already done)
bundle install
npm install

# Start Jekyll server
bundle exec jekyll serve --livereload --config _config.yml,_config.dev.yml

# Open browser to http://localhost:4000
```

### 2. What You Should See

#### Desktop Experience (>768px)
**Animation Sequence:**
1. **0-0.5s**: Corner brackets fade in from corners
2. **0.3-1.5s**: Grid lines converge to center with neon glow
3. **0.5-1.5s**: Telemetry bars sweep from edges
4. **1.8-2.5s**: "VANSH GUPTA" explodes onto screen with:
   - 3D perspective entrance
   - Glitch bursts (3 times)
   - Metallic gradient shimmer
   - Pulsing neon glow
5. **2.0-3.0s**: Holographic scanner sweeps down
6. **2.5s+**: Continuous effects:
   - Name floating animation
   - Pulsing glow
   - Mouse 3D parallax (move mouse around name)
7. **3.0s**: Data points fade in with floating animation
8. **3.0s**: Scroll indicator appears at bottom

**Interactive Features:**
- **Mouse Move**: Hero name tilts in 3D (±15° rotation)
- **Hover Data Points**: Lift and glow effects
- **Scroll**: Parallax fade and scale effects

#### Mobile Experience (<768px)
**Animation Sequence:**
1. **0-0.5s**: Simplified corner brackets
2. **0.5-1.5s**: Reduced grid (15 lines instead of 30)
3. **1.8-2.5s**: "VANSH GUPTA" appears with:
   - Simpler entrance (no 3D perspective)
   - Gradient shimmer
   - Optimized glow
4. **3.0s**: Data points in 2-column layout
5. **3.0s**: Scroll indicator

**Interactive Features:**
- **Touch & Drag**: Name scales slightly on touch-drag
- **Tap Data Points**: Tap to see hover effects
- **Scroll**: Smooth parallax

## Visual Checklist

### ✅ Hero Name
- [ ] Visible immediately (even before animations)
- [ ] Metallic gradient (lime → cyan → lime → amber)
- [ ] Shimmer animation moving across text
- [ ] Neon glow pulsing
- [ ] Large and centered
- [ ] Readable at all screen sizes

### ✅ Corner Brackets
- [ ] 4 corners with L-shaped brackets
- [ ] Neon green (#9bff1f) glow
- [ ] Fade in animation
- [ ] Small accent lines on corners

### ✅ Grid Convergence
- [ ] Grid lines appear across screen
- [ ] Lines converge to center
- [ ] Smooth animation (1.2s)
- [ ] Fades out after convergence

### ✅ Particle Explosion
- [ ] Particles burst from center
- [ ] Multiple colors (lime, cyan, amber)
- [ ] Fade out as they move
- [ ] Canvas-based rendering

### ✅ Telemetry Bars
- [ ] Bars appear from screen edges
- [ ] Multiple colors
- [ ] Synchronized animation
- [ ] Fade in and shrink to center

### ✅ Glitch Effects
- [ ] Name glitches 3 times
- [ ] RGB color separation
- [ ] Quick jittery movement
- [ ] Around 1.5-2.0s mark

### ✅ Data Points
- [ ] 3 cards (Research, Innovation, Impact)
- [ ] Glass morphism background
- [ ] Floating animation
- [ ] Hover lift effect
- [ ] Responsive layout

### ✅ Scroll Indicator
- [ ] Appears at bottom center
- [ ] Animated line with moving dot
- [ ] "Scroll to Explore" text
- [ ] Fades on scroll

## Mobile-Specific Tests

### iPhone Testing
```
Devices to test:
- iPhone SE (375×667)
- iPhone 12/13 (390×844)
- iPhone 14 Pro Max (430×932)
```

#### Critical Checks
- [ ] Name shows immediately on load
- [ ] Name is readable (not too small)
- [ ] No horizontal scroll
- [ ] Touch scaling works
- [ ] Data points in 2 columns
- [ ] All text readable
- [ ] No layout breaks

### Android Testing
```
Devices to test:
- Samsung Galaxy S21 (360×800)
- Pixel 5 (393×851)
- Tablet (1280×800)
```

#### Critical Checks
- [ ] Same as iPhone tests
- [ ] Chrome mobile renders correctly
- [ ] Touch interactions smooth
- [ ] No performance issues

## Performance Testing

### Desktop (Chrome DevTools)
1. Open DevTools (F12)
2. Go to Performance tab
3. Record page load
4. Check:
   - [ ] FPS stays above 55fps
   - [ ] No long tasks (>50ms)
   - [ ] Smooth animation curves
   - [ ] Memory stable

### Mobile (Chrome DevTools)
1. Enable mobile emulation
2. Throttle CPU (4x slowdown)
3. Throttle network (Fast 3G)
4. Check:
   - [ ] Animations still smooth
   - [ ] No jank on scroll
   - [ ] Assets load quickly

## Browser Compatibility

### Chrome/Edge (Chromium)
- [ ] All animations work
- [ ] Gradient text renders
- [ ] 3D transforms smooth
- [ ] Canvas particles visible

### Firefox
- [ ] All animations work
- [ ] Gradient may look different (OK)
- [ ] Performance comparable

### Safari
- [ ] Gradient text works with fallback
- [ ] iOS-specific fixes applied
- [ ] No webkit warnings
- [ ] Smooth scrolling

## Accessibility Testing

### Reduced Motion
**How to Test:**
1. System Settings → Accessibility → Reduce Motion
2. Or DevTools → Rendering → Emulate reduced motion

**Expected Behavior:**
- [ ] All animations stop
- [ ] Hero name visible immediately
- [ ] Content readable
- [ ] No motion whatsoever

### Screen Reader
**Test with:**
- VoiceOver (Mac/iOS)
- NVDA (Windows)
- TalkBack (Android)

**Expected:**
- [ ] Hero name announced
- [ ] Subtitle read correctly
- [ ] Data points accessible
- [ ] Navigation works

### Keyboard Navigation
- [ ] Tab through elements
- [ ] Focus indicators visible
- [ ] All interactive elements reachable

## Debug Mode

### Console Messages
Open browser console, you should see:
```
Academic Kinetic Motion Engine initialized
Three.js particle background initialized
🏎️ Epic Hero Animation Initialized
```

### Check for Errors
- [ ] No red errors in console
- [ ] No 404s for assets
- [ ] No CORS issues

### Inspect Elements
```javascript
// Check animation status
window.heroAnimation
// Returns: { version: '2.0.0', mobile: false, tablet: false }

// Check motion engine
window.academicKinetic
// Returns: { lenis: {...}, destroy: f() }
```

## Common Issues & Fixes

### Issue: Hero name not showing
**Cause**: CSS or JS not loaded
**Fix**: Check network tab, clear cache, hard refresh

### Issue: Animations too slow
**Cause**: Low-end device or many tabs open
**Fix**: Normal - animations degrade gracefully

### Issue: Glitch effects not visible
**Cause**: Timing issue
**Fix**: Wait 2-3 seconds, should trigger

### Issue: Mobile horizontal scroll
**Cause**: Element wider than viewport
**Fix**: Check for elements with fixed px widths

### Issue: Particles not showing
**Cause**: Canvas not supported or Three.js not loaded
**Fix**: Check console, update browser

## Manual Test Script

### Desktop Test (5 minutes)
```
1. Load page in Chrome
   ✓ Corner brackets appear
   ✓ Grid converges
   ✓ Name appears dramatically

2. Move mouse around name
   ✓ 3D tilt effect works

3. Scroll down slowly
   ✓ Hero fades and scales
   ✓ Parallax smooth

4. Hover data points
   ✓ Lift and glow

5. Check console
   ✓ No errors

RESULT: PASS / FAIL
```

### Mobile Test (5 minutes)
```
1. Open on iPhone/Android
   ✓ Name visible immediately
   ✓ No horizontal scroll

2. Touch and drag name
   ✓ Slight scale effect

3. Tap data points
   ✓ Visual feedback

4. Scroll page
   ✓ Smooth with no jank

5. Check different orientations
   ✓ Portrait: Good
   ✓ Landscape: Good

RESULT: PASS / FAIL
```

## Performance Benchmarks

### Expected Metrics
- **Desktop FPS**: 55-60fps
- **Mobile FPS**: 50-60fps
- **Load Time**: <2s (depends on network)
- **First Paint**: <0.5s
- **Time to Interactive**: <1.5s

### Tools
- Chrome DevTools Performance
- Lighthouse audit
- WebPageTest
- GTmetrix

## Video Recording for Review

### Desktop Recording
```bash
# Record screen while testing
# Show:
1. Page load sequence
2. All animations
3. Mouse interactions
4. Scroll effects
5. Console (no errors)
```

### Mobile Recording
```bash
# Use built-in screen recorder
# Show:
1. Page load on mobile
2. Name visibility
3. Touch interactions
4. Scroll smoothness
5. Orientation changes
```

## Sign-Off Checklist

### Before Deployment
- [ ] All desktop browsers tested
- [ ] All mobile devices tested
- [ ] Performance acceptable
- [ ] Accessibility features work
- [ ] No console errors
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Git committed

### Stakeholder Review
- [ ] Visual design approved
- [ ] Animation timing approved
- [ ] Mobile experience approved
- [ ] Performance acceptable
- [ ] Ready for production

---

## Contact for Issues

If you encounter any problems:
1. Check this guide first
2. Review console for errors
3. Test with reduced motion disabled
4. Clear cache and hard refresh
5. Try different browser
6. Check mobile vs desktop

**Status**: Ready for Testing ✅
