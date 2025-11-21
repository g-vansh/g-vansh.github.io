/**
 * Story Mode - Apple-Style Scrollable Narrative
 * Controls the scrollable story experience and particle background interactions
 */

(function() {
  'use strict';

  // Check dependencies
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('Story Mode: GSAP or ScrollTrigger not loaded');
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    console.log('Story Mode: Reduced motion enabled');
    // Still show story but without animations
    document.body.classList.add('story-complete');
    return;
  }

  const storyMode = document.getElementById('story-mode');
  if (!storyMode) return;

  const storySections = document.querySelectorAll('.story-section');
  const totalSections = storySections.length;
  let currentSection = 0;
  let isScrolling = false;
  let scrollTimeout = null;

  // Create progress indicator with clickable dots
  function createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'story-progress';
    
    for (let i = 0; i < totalSections; i++) {
      const dot = document.createElement('div');
      dot.className = 'story-progress-dot';
      dot.setAttribute('data-section', i);
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Go to story section ${i + 1}`);
      dot.style.cursor = 'pointer';
      if (i === 0) dot.classList.add('active');
      
      // Add click handler to navigate to section
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetSection = parseInt(dot.getAttribute('data-section'));
        if (targetSection >= 0 && targetSection < totalSections) {
          resetAutoAdvance(); // Reset auto-advance timer
          showSection(targetSection);
        }
      });
      
      progressContainer.appendChild(dot);
    }
    
    storyMode.appendChild(progressContainer);
    return progressContainer;
  }

  const progressContainer = createProgressIndicator();
  const progressDots = progressContainer.querySelectorAll('.story-progress-dot');

  // Update progress indicator
  function updateProgress(sectionIndex) {
    progressDots.forEach((dot, index) => {
      if (index === sectionIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Show section with smooth snap animation
  function showSection(index) {
    if (index < 0 || index >= totalSections) return;
    
    // Reset auto-advance timer when section changes
    resetAutoAdvance();
    
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      storySections.forEach((section, i) => {
        section.classList.remove('active', 'past');
        
        if (i === index) {
          section.classList.add('active');
        } else if (i < index) {
          section.classList.add('past');
        }
      });
      
      currentSection = index;
      updateProgress(index);
      checkLastSection();
    });
  }

  // Control Three.js particle visibility - REMOVED as requested
  function controlParticleVisibility(sectionIndex) {
    // Function removed - no longer controlling particle visibility
  }

  // Prevent body scroll during story mode
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  // Stop Lenis smooth scroll during story mode to prevent interference
  const lenis = window.academicKinetic?.lenis;
  if (lenis && typeof lenis.stop === 'function') {
    lenis.stop();
  }
  
  // Initialize first section - ensure it's visible
  setTimeout(() => {
    showSection(0);
    // Force first section to be visible
    if (storySections[0]) {
      storySections[0].classList.add('active');
      storySections[0].style.opacity = '1';
      storySections[0].style.visibility = 'visible';
    }
    // Start auto-advance timer
    startAutoAdvance();
  }, 100);

  // Scroll handler with improved snapping
  let scrollAccumulator = 0; // Track accumulated scroll for resistance
  let lastScrollTime = 0; // Track when last scroll happened for decay
  let decayAnimationFrame = null; // Animation frame for decay
  const SCROLL_THRESHOLD = 30; // Lower threshold for snappier feel (was 50)
  const LAST_SECTION_RESISTANCE = 350; // Much higher threshold for last sections (3rd and 4th) - requires significant scroll effort
  const SCROLL_DECAY_RATE = 0.92; // Decay multiplier per frame when not scrolling (makes it harder)
  const SCROLL_DECAY_DELAY = 150; // ms to wait before starting decay
  
  // Helper function to check if current section requires resistance
  function requiresResistance(sectionIndex) {
    // Both 3rd section (index 2) and 4th section (index 3) require resistance
    return sectionIndex === 2 || sectionIndex === totalSections - 1;
  }
  
  // Decay function that reduces accumulator when user stops scrolling
  function startDecay() {
    if (decayAnimationFrame) {
      cancelAnimationFrame(decayAnimationFrame);
    }
    
    const decay = () => {
      if (requiresResistance(currentSection) && scrollAccumulator > 0) {
        const timeSinceScroll = Date.now() - lastScrollTime;
        if (timeSinceScroll > SCROLL_DECAY_DELAY) {
          scrollAccumulator *= SCROLL_DECAY_RATE;
          if (scrollAccumulator < 1) {
            scrollAccumulator = 0;
          }
        }
        decayAnimationFrame = requestAnimationFrame(decay);
      } else {
        decayAnimationFrame = null;
      }
    };
    
    decayAnimationFrame = requestAnimationFrame(decay);
  }
  
  function handleScroll(event) {
    // Reset auto-advance on any scroll interaction
    resetAutoAdvance();
    
    const deltaY = event.deltaY || event.detail || -event.wheelDelta;
    const scrollDirection = deltaY > 0 ? 'down' : 'up';
    
    // If on 3rd section (index 2) or 4th section (index 3) and scrolling down, add resistance
    // BUT ensure the section is visible first before applying resistance
    if (requiresResistance(currentSection) && scrollDirection === 'down') {
      // Make sure current section is fully visible first
      const currentSectionEl = storySections[currentSection];
      if (currentSectionEl) {
        currentSectionEl.style.opacity = '1';
        currentSectionEl.style.visibility = 'visible';
        currentSectionEl.style.display = 'flex';
        currentSectionEl.style.zIndex = currentSection === totalSections - 1 ? '3' : '2';
        currentSectionEl.classList.add('active');
      }
      
      // Update scroll time for decay tracking
      lastScrollTime = Date.now();
      
      // Stop decay when actively scrolling
      if (decayAnimationFrame) {
        cancelAnimationFrame(decayAnimationFrame);
        decayAnimationFrame = null;
      }
      
      // Accumulate scroll with a slight multiplier to make it feel more resistant
      scrollAccumulator += Math.abs(deltaY) * 0.8; // Slight reduction to require more scroll
      
      // Require more scroll effort to exit section
      if (scrollAccumulator >= LAST_SECTION_RESISTANCE) {
        event.preventDefault();
        scrollAccumulator = 0; // Reset accumulator
        
        // If on last section, complete story; otherwise move to next section
        if (currentSection === totalSections - 1) {
          completeStory();
        } else {
          // Move to next section (from 3rd to 4th)
          isScrolling = true;
          showSection(currentSection + 1);
        }
        return;
      } else {
        // Prevent scroll but don't complete yet - creates resistance
        // But keep section visible
        // Start decay when scroll stops
        startDecay();
        event.preventDefault();
        return;
      }
    }
    
    // Reset accumulator when not on sections that require resistance
    if (!requiresResistance(currentSection)) {
      scrollAccumulator = 0;
      lastScrollTime = 0;
    } else if (requiresResistance(currentSection) && scrollDirection === 'up') {
      // If scrolling up on a section with resistance, decay the accumulator
      scrollAccumulator = Math.max(0, scrollAccumulator * 0.9);
    }
    
    if (isScrolling) {
      // Still accumulating scroll during transition
      scrollAccumulator += Math.abs(deltaY);
      event.preventDefault();
      return;
    }
    
    // Accumulate scroll delta
    scrollAccumulator += Math.abs(deltaY);
    
    // Only trigger section change if threshold is met
    if (scrollAccumulator < SCROLL_THRESHOLD) {
      event.preventDefault();
      return;
    }
    
    // Reset accumulator and proceed with section change
    scrollAccumulator = 0;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      scrollAccumulator = 0;
    }, 400); // Even shorter timeout for snappier feel
    
    if (scrollDirection === 'down' && currentSection < totalSections - 1) {
      isScrolling = true;
      event.preventDefault();
      const nextSection = currentSection + 1;
      console.log(`Scrolling to section ${nextSection + 1} of ${totalSections}`);
      
      // Special handling for 4th section (index 3)
      if (nextSection === totalSections - 1) {
        console.log('Reaching last section (4th) - ensuring visibility');
        // Pre-show the section to ensure it's visible
        const lastSection = storySections[nextSection];
        if (lastSection) {
          lastSection.style.opacity = '1';
          lastSection.style.visibility = 'visible';
          lastSection.style.display = 'flex';
          lastSection.style.zIndex = '3';
        }
      }
      
      showSection(nextSection);
    } else if (scrollDirection === 'up' && currentSection > 0) {
      isScrolling = true;
      event.preventDefault();
      showSection(currentSection - 1);
    }
  }

  // Touch handler for mobile with improved snapping
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  const TOUCH_THRESHOLD = 80; // Increased threshold for better snapping
  const TOUCH_VELOCITY_THRESHOLD = 0.3; // Velocity threshold for quick swipes

  function handleTouchStart(event) {
    // Reset auto-advance on touch interaction
    resetAutoAdvance();
    
    touchStartY = event.touches[0].clientY;
    touchStartTime = Date.now();
  }

  function handleTouchEnd(event) {
    touchEndY = event.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    const deltaTime = Date.now() - touchStartTime;
    const velocity = Math.abs(deltaY) / deltaTime; // pixels per ms
    
    // Check if it's a quick swipe (high velocity) or long drag (distance)
    const isQuickSwipe = velocity > TOUCH_VELOCITY_THRESHOLD && Math.abs(deltaY) > 30;
    const isLongDrag = Math.abs(deltaY) > TOUCH_THRESHOLD;
    
    if (isQuickSwipe || isLongDrag) {
      // Resistance for 3rd and 4th sections on touch - require much more effort
      if (requiresResistance(currentSection) && deltaY > 0) {
        // Scrolling down on section with resistance - require significantly more effort
        // Use a higher multiplier for touch since touch gestures are typically larger
        if (Math.abs(deltaY) > LAST_SECTION_RESISTANCE * 1.2) {
          // If on last section, complete story; otherwise move to next section
          if (currentSection === totalSections - 1) {
            completeStory();
          } else {
            showSection(currentSection + 1);
          }
        }
        return;
      }
      
      if (deltaY > 0 && currentSection < totalSections - 1) {
        // Swipe up - next section
        showSection(currentSection + 1);
      } else if (deltaY < 0 && currentSection > 0) {
        // Swipe down - previous section
        showSection(currentSection - 1);
      }
    }
  }

  // Keyboard navigation
  function handleKeyDown(event) {
    // Reset auto-advance on keyboard interaction
    resetAutoAdvance();
    
    if (event.key === 'ArrowDown' && currentSection < totalSections - 1) {
      event.preventDefault();
      showSection(currentSection + 1);
    } else if (event.key === 'ArrowUp' && currentSection > 0) {
      event.preventDefault();
      showSection(currentSection - 1);
    } else if (event.key === 'Escape') {
      // Skip story
      completeStory();
    }
  }

  // Complete story and show main content
  function completeStory() {
    // Stop auto-advance timer
    stopAutoAdvance();
    
    // Get Lenis instance if available
    const lenis = window.academicKinetic?.lenis;
    
    // Remove scroll prevention first
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // Mark story as complete
    storyMode.classList.add('story-complete');
    document.body.classList.add('story-complete');
    
    // Remove wheel event listener immediately to prevent interference
    window.removeEventListener('wheel', handleScroll);
    
    // Function to scroll to top using multiple methods
    const scrollToTop = (useLenis = true) => {
      // Method 1: Use Lenis scrollTo if available (preferred method)
      if (useLenis && lenis && typeof lenis.scrollTo === 'function') {
        try {
          // Start Lenis if it's stopped
          if (typeof lenis.start === 'function') {
            lenis.start();
          }
          // Use Lenis's scrollTo method for smooth scroll
          lenis.scrollTo(0, {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            immediate: false
          });
        } catch (e) {
          console.warn('Lenis scrollTo failed, using fallback:', e);
        }
      }
      
      // Method 2: Direct scrollTop assignment (immediate, fallback)
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 3: window.scrollTo (browser native)
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Method 4: Force scroll using window.pageYOffset
      if (typeof window.pageYOffset !== 'undefined') {
        window.scrollTo(0, 0);
      }
    };
    
    // First, ensure page is at top immediately (before Lenis starts)
    scrollToTop(false);
    
    // Wait a frame for DOM to update
    requestAnimationFrame(() => {
      // Now use Lenis for smooth scroll if available
      scrollToTop(true);
      
      // Wait for story mode to fade out, then ensure we're at top
      setTimeout(() => {
        // Ensure Lenis is started if available
        if (lenis) {
          try {
            if (typeof lenis.start === 'function') {
              lenis.start();
            }
            // Use Lenis to scroll to top again (in case it wasn't ready before)
            if (typeof lenis.scrollTo === 'function') {
              lenis.scrollTo(0, {
                duration: 0.8,
                immediate: false
              });
            }
          } catch (e) {
            console.warn('Lenis scrollTo failed in timeout:', e);
          }
        }
        
        // Force scroll to top again as backup
        scrollToTop(false);
        
        // Final check and force scroll if needed
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          if (currentScroll > 0) {
            // Force immediate scroll to top
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            // If Lenis is available, use it one more time with immediate flag
            if (lenis && typeof lenis.scrollTo === 'function') {
              try {
                lenis.scrollTo(0, { immediate: true });
              } catch (e) {
                // Ignore errors, we've already scrolled
              }
            }
          }
        });
      }, 200); // Wait 200ms for story mode to fade out
    });
  }

  // Auto-advance functionality - move to next section every 8 seconds if idle
  let autoAdvanceTimer = null;
  const AUTO_ADVANCE_DELAY = 8000; // 8 seconds
  
  function startAutoAdvance() {
    stopAutoAdvance(); // Clear any existing timer
    
    // Don't auto-advance if on last section
    if (currentSection >= totalSections - 1) {
      return;
    }
    
    autoAdvanceTimer = setTimeout(() => {
      if (currentSection < totalSections - 1) {
        showSection(currentSection + 1);
      }
    }, AUTO_ADVANCE_DELAY);
  }
  
  function resetAutoAdvance() {
    stopAutoAdvance();
    startAutoAdvance();
  }
  
  function stopAutoAdvance() {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }
  
  // Auto-advance on last section after delay (for CTA animation)
  let lastSectionTimeout = null;
  
  function checkLastSection() {
    if (currentSection === totalSections - 1) {
      // Stop auto-advance on last section
      stopAutoAdvance();
      
      clearTimeout(lastSectionTimeout);
      lastSectionTimeout = setTimeout(() => {
        // Show CTA animation
        const cta = document.querySelector('.story-cta');
        if (cta) {
          cta.style.animation = 'pulse 2s ease-in-out infinite';
        }
      }, 2000);
    }
  }

  // Event listeners
  window.addEventListener('wheel', handleScroll, { passive: false });
  window.addEventListener('keydown', handleKeyDown);
  
  // Reset auto-advance on any click interaction (except on dots which handle it themselves)
  document.addEventListener('click', (e) => {
    // Don't reset if clicking on progress dots (they handle navigation themselves)
    if (!e.target.closest('.story-progress-dot')) {
      resetAutoAdvance();
    }
  }, true);
  
  // Make navigation links escape story mode
  const navLinks = document.querySelectorAll('.masthead a, .greedy-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Complete story when navigation is clicked
      if (!document.body.classList.contains('story-complete')) {
        completeStory();
        // Allow navigation to proceed after a brief delay
        setTimeout(() => {
          // Link will navigate normally
        }, 100);
      }
    });
  });
  
  // Touch events
  storyMode.addEventListener('touchstart', handleTouchStart, { passive: true });
  storyMode.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Watch for scroll to last section
  const observer = new MutationObserver(() => {
    checkLastSection();
  });
  
  storySections.forEach(section => {
    observer.observe(section, { attributes: true, attributeFilter: ['class'] });
  });

  // Allow clicking CTA to complete story
  const storyCTA = document.querySelector('.story-cta');
  if (storyCTA) {
    storyCTA.addEventListener('click', completeStory);
    storyCTA.style.cursor = 'pointer';
  }

  // GSAP ScrollTrigger for smooth transitions (alternative approach)
  // This provides more control and smoother animations
  gsap.registerPlugin(ScrollTrigger);

  // Create a timeline for each section - but make it optional/fallback
  // Use class-based approach as primary, GSAP as enhancement
  storySections.forEach((section, index) => {
    const content = section.querySelector('.story-content');
    if (!content) {
      console.warn(`Story section ${index + 1} has no content`);
      return;
    }

    // Set initial state with GSAP (but CSS will handle it too)
    gsap.set(section, {
      opacity: 0,
      y: 50,
      immediateRender: false // Don't apply immediately, let CSS handle it
    });

    // Animate in when active
    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        section.classList.add('active');
        // Force visibility immediately
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        section.style.display = 'flex';
        section.style.transform = 'translateY(0)';
        section.style.zIndex = index === totalSections - 1 ? '3' : '2';
        
        // Special handling for last section (4th section)
        if (index === totalSections - 1) {
          console.log('Last section (4th) activated - ensuring visibility');
          section.style.opacity = '1';
          section.style.visibility = 'visible';
          section.style.zIndex = '3';
        }
      },
      onComplete: () => {
        // Ensure section stays visible after animation
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        section.style.display = 'flex';
        section.style.transform = 'translateY(0)';
        
        if (index === totalSections - 1) {
          console.log('Last section animation complete');
          // Last section - allow completion
          setTimeout(() => {
            const cta = section.querySelector('.story-cta');
            if (cta) {
              gsap.to(cta, {
                scale: 1.05,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: 'power2.inOut'
              });
            }
          }, 2000);
        }
      }
    });

    tl.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.6, // Match CSS transition duration
      ease: 'power3.out'
    });

    // Store timeline on section
    section._storyTimeline = tl;
  });

  // Enhanced showSection with GSAP support - but ensure all sections work
  const enhancedShowSection = function(index) {
    if (index < 0 || index >= totalSections) {
      console.warn(`Invalid section index: ${index} (total: ${totalSections})`);
      return;
    }
    
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      // Hide all sections first
      storySections.forEach((section, i) => {
        section.classList.remove('active', 'past');
        if (i !== index) {
          // Hide non-active sections
          if (section._storyTimeline) {
            section._storyTimeline.reverse();
          }
          section.style.opacity = '0';
          section.style.visibility = 'hidden';
          if (i < index) {
            section.classList.add('past');
          }
        }
      });
      
      // Show active section - use class-based approach as primary (more reliable)
      const activeSection = storySections[index];
      if (!activeSection) {
        console.error(`Section ${index} not found!`);
        return;
      }
      
      // Force visibility for active section
      activeSection.classList.add('active');
      activeSection.style.opacity = '1';
      activeSection.style.visibility = 'visible';
      activeSection.style.display = 'flex';
      activeSection.style.transform = 'translateY(0)';
      activeSection.style.zIndex = index === totalSections - 1 ? '3' : '2';
      
      // Also play GSAP timeline if available (as enhancement)
      if (activeSection._storyTimeline) {
        activeSection._storyTimeline.play();
      }
      
      currentSection = index;
      updateProgress(index);
      checkLastSection();
      
      // Debug: Log current section and verify visibility
      console.log(`Story section ${index + 1} of ${totalSections} active`);
      const computed = window.getComputedStyle(activeSection);
      console.log(`Section ${index + 1} visibility:`, {
        opacity: computed.opacity,
        visibility: computed.visibility,
        display: computed.display,
        zIndex: computed.zIndex,
        transform: computed.transform
      });
    });
  };

  // Replace the original showSection
  showSection = enhancedShowSection;

  // Initialize
  showSection(0);

  // Export for debugging
  window.storyMode = {
    currentSection: () => currentSection,
    totalSections: totalSections,
    showSection: (index) => {
      if (typeof index === 'number') {
        console.log(`Manually showing section ${index + 1}`);
        showSection(index);
      }
    },
    complete: completeStory,
    version: '1.0.0',
    // Debug function to test 4th section
    testSection4: () => {
      console.log('Testing section 4 visibility');
      const section4 = storySections[3];
      if (section4) {
        section4.classList.add('active');
        section4.style.opacity = '1';
        section4.style.visibility = 'visible';
        section4.style.display = 'flex';
        section4.style.zIndex = '3';
        section4.style.transform = 'translateY(0)';
        currentSection = 3;
        updateProgress(3);
        console.log('Section 4 forced visible');
      } else {
        console.error('Section 4 not found!');
      }
    }
  };

  console.log('📖 Story Mode initialized');

})();

