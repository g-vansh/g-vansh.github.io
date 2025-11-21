/**
 * Three.js Particle Background Effect
 * Creates an interactive 3D particle system for enhanced visual appeal
 * Features: Connection lines (Signals), idea generation (lightbulbs), and explosion effects
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

    // Mobile detection - must be early for use in texture creation and canvas setup
    const isMobile = window.innerWidth < 768;

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
    // Mobile gets higher opacity for better visibility
    const canvasOpacity = isMobile ? '0.85' : '0.6';
    canvas.style.opacity = canvasOpacity;
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
    const baseParticleCount = isMobile ? 300 : 800; 
    let particleCount = baseParticleCount;
    
    const particlesGeometry = new ThreeLib.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const particleTypes = new Uint8Array(particleCount); // 0: normal, 1: scientist, 2: entrepreneur, 3: coder
    
    // Accent colors
    const accentColor = new ThreeLib.Color(0x9bff1f);
    const cyanColor = new ThreeLib.Color(0x63ff9d);
    const amberColor = new ThreeLib.Color(0xffd86b);

    function initParticles() {
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;

        // Velocity
        velocities[i3] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;

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
        
        // Assign particle types: equal distribution of scientist, entrepreneur, and coder (~1.67% each), rest normal
        const typeRoll = Math.random();
        if (typeRoll < 0.0167) {
          particleTypes[i] = 1; // scientist
        } else if (typeRoll < 0.0334) {
          particleTypes[i] = 2; // entrepreneur
        } else if (typeRoll < 0.05) {
          particleTypes[i] = 3; // coder
        } else {
          particleTypes[i] = 0; // normal
        }
      }

      particlesGeometry.setAttribute('position', new ThreeLib.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new ThreeLib.BufferAttribute(colors, 3));
    }
    
    initParticles();
    
    const normalMaterial = new ThreeLib.PointsMaterial({
      size: isMobile ? 1.2 : 1.5, // Slightly larger particles on mobile
      vertexColors: true,
      map: createSquareTexture(),
      transparent: true,
      opacity: isMobile ? 1.0 : 0.8, // Full opacity on mobile
      blending: ThreeLib.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });
    
    // Helpers for textures MUST be defined before materials
    function createSquareTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, 8, 16, 16); // Square
      const texture = new ThreeLib.CanvasTexture(canvas);
      return texture;
    }

    function createEmojiTexture(emoji, glowColor = 'rgba(255, 216, 107, 0.9)') {
      const canvas = document.createElement('canvas');
      // Larger texture size for mobile to improve emoji quality
      const textureSize = isMobile ? 256 : 128;
      canvas.width = textureSize;
      canvas.height = textureSize;
      const ctx = canvas.getContext('2d');
      
      const center = textureSize / 2;
      const radius = textureSize / 2;
      
      // Draw glowing background - stronger glow on mobile
      const gradient = ctx.createRadialGradient(center, center, 10, center, center, radius);
      const glowIntensity = isMobile ? '1.0' : '0.9';
      gradient.addColorStop(0, glowColor.replace('0.9)', glowIntensity + ')'));
      gradient.addColorStop(0.5, glowColor.replace('0.9)', isMobile ? '0.6)' : '0.5)'));
      gradient.addColorStop(1, glowColor.replace('0.9)', '0)'));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, textureSize, textureSize);
      
      // Draw emoji with high quality settings - larger font on mobile
      const fontSize = isMobile ? 200 : 100;
      ctx.font = `bold ${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, center, center);
      
      const texture = new ThreeLib.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    
    function createLightbulbTexture() {
      return createEmojiTexture('💡', 'rgba(255, 216, 107, 0.9)');
    }
    
    function createScientistTexture() {
      return createEmojiTexture('👩‍🔬', 'rgba(99, 255, 157, 0.9)');
    }
    
    function createEntrepreneurTexture() {
      return createEmojiTexture('👨‍💼', 'rgba(155, 255, 31, 0.9)');
    }
    
    function createPaperTexture() {
      return createEmojiTexture('📝', 'rgba(255, 216, 107, 0.9)'); // Same yellow halo as lightbulb
    }
    
    function createBusinessTexture() {
      return createEmojiTexture('📈', 'rgba(255, 216, 107, 0.9)'); // Same yellow halo as lightbulb
    }
    
    function createCoderTexture() {
      return createEmojiTexture('👩‍💻', 'rgba(155, 255, 31, 0.9)'); // Same green halo as entrepreneur
    }
    
    function createCodeTexture() {
      return createEmojiTexture('👾', 'rgba(255, 216, 107, 0.9)'); // Same yellow halo as lightbulb
    }
    
    function createConversationTexture() {
      return createEmojiTexture('💬', 'rgba(99, 255, 157, 0.9)'); // Cyan halo for conversations
    }
    
    const ideaMaterial = new ThreeLib.PointsMaterial({
      size: isMobile ? 20.0 : 20.0, // Same size on mobile for better visibility
      color: 0xffffff, // Bright white to stand out
      map: createLightbulbTexture(),
      transparent: true,
      opacity: 1.0,
      blending: ThreeLib.AdditiveBlending, // Changed to AdditiveBlending for glow
      sizeAttenuation: false, // Size doesn't change with distance
      depthWrite: false,
      depthTest: false // Always render on top
    });

    const particleSystem = new ThreeLib.Points(particlesGeometry, normalMaterial);
    scene.add(particleSystem);
    
    // PARTICLE TYPE OVERLAYS - Scientist, Entrepreneur, and Coder emojis
    const scientistTexture = createScientistTexture();
    const entrepreneurTexture = createEntrepreneurTexture();
    const coderTexture = createCoderTexture();
    
    const typeOverlays = { scientists: [], entrepreneurs: [], coders: [] };
    
    for (let i = 0; i < particleCount; i++) {
      if (particleTypes[i] === 1) { // scientist
        const sprite = new ThreeLib.Sprite(new ThreeLib.SpriteMaterial({
          map: scientistTexture,
          transparent: true,
          opacity: 1.0,
          blending: ThreeLib.NormalBlending,
          depthTest: false,
          sizeAttenuation: false
        }));
        sprite.scale.set(isMobile ? 0.12 : 0.1, isMobile ? 0.12 : 0.1, 1); // Larger on mobile
        sprite.renderOrder = 999;
        scene.add(sprite);
        typeOverlays.scientists.push({ sprite, particleIdx: i });
      } else if (particleTypes[i] === 2) { // entrepreneur
        const sprite = new ThreeLib.Sprite(new ThreeLib.SpriteMaterial({
          map: entrepreneurTexture,
          transparent: true,
          opacity: 1.0,
          blending: ThreeLib.NormalBlending,
          depthTest: false,
          sizeAttenuation: false
        }));
        sprite.scale.set(isMobile ? 0.12 : 0.1, isMobile ? 0.12 : 0.1, 1); // Larger on mobile
        sprite.renderOrder = 999;
        scene.add(sprite);
        typeOverlays.entrepreneurs.push({ sprite, particleIdx: i });
      } else if (particleTypes[i] === 3) { // coder
        const sprite = new ThreeLib.Sprite(new ThreeLib.SpriteMaterial({
          map: coderTexture,
          transparent: true,
          opacity: 1.0,
          blending: ThreeLib.NormalBlending,
          depthTest: false,
          sizeAttenuation: false
        }));
        sprite.scale.set(isMobile ? 0.12 : 0.1, isMobile ? 0.12 : 0.1, 1); // Larger on mobile
        sprite.renderOrder = 999;
        scene.add(sprite);
        typeOverlays.coders.push({ sprite, particleIdx: i });
      }
    }
    
    // Story mode particle visibility control - REMOVED as requested
    // No longer responding to story section changes
    
    // IDEA SYSTEM - Using Sprites for reliable rendering
    const maxIdeas = 50;
    const lightbulbTexture = createLightbulbTexture();
    const paperTexture = createPaperTexture();
    const businessTexture = createBusinessTexture();
    const codeTexture = createCodeTexture();
    
    const ideaSpritePool = {
      lightbulbs: [],
      papers: [],
      businesses: [],
      codes: []
    };
    
    const activeIdeas = [];
    
    // Create sprite pools for each idea type
    for (let i = 0; i < maxIdeas; i++) {
      // Lightbulb sprites
      const bulbSprite = new ThreeLib.Sprite(new ThreeLib.SpriteMaterial({
        map: lightbulbTexture,
        transparent: true,
        opacity: 1.0,
        blending: ThreeLib.NormalBlending,
        depthTest: false,
        depthWrite: false,
        sizeAttenuation: false
      }));
      bulbSprite.scale.set(isMobile ? 0.12 : 0.1, isMobile ? 0.12 : 0.1, 1); // Larger on mobile
      bulbSprite.visible = false;
      bulbSprite.renderOrder = 1000;
      scene.add(bulbSprite);
      ideaSpritePool.lightbulbs.push(bulbSprite);
      
      // Paper sprites (for scientists) - same size as lightbulb
      const paperSprite = new ThreeLib.Sprite(new ThreeLib.SpriteMaterial({
        map: paperTexture,
        transparent: true,
        opacity: 1.0,
        blending: ThreeLib.NormalBlending,
        depthTest: false,
        depthWrite: false,
        sizeAttenuation: false
      }));
      paperSprite.scale.set(isMobile ? 0.12 : 0.1, isMobile ? 0.12 : 0.1, 1); // Larger on mobile
      paperSprite.visible = false;
      paperSprite.renderOrder = 1000;
      scene.add(paperSprite);
      ideaSpritePool.papers.push(paperSprite);
      
      // Business sprites (for entrepreneurs) - same size as lightbulb
      const bizSprite = new ThreeLib.Sprite(new ThreeLib.SpriteMaterial({
        map: businessTexture,
        transparent: true,
        opacity: 1.0,
        blending: ThreeLib.NormalBlending,
        depthTest: false,
        depthWrite: false,
        sizeAttenuation: false
      }));
      bizSprite.scale.set(isMobile ? 0.12 : 0.1, isMobile ? 0.12 : 0.1, 1); // Larger on mobile
      bizSprite.visible = false;
      bizSprite.renderOrder = 1000;
      scene.add(bizSprite);
      ideaSpritePool.businesses.push(bizSprite);
      
      // Code sprites (for coders) - same size as lightbulb
      const codeSprite = new ThreeLib.Sprite(new ThreeLib.SpriteMaterial({
        map: codeTexture,
        transparent: true,
        opacity: 1.0,
        blending: ThreeLib.NormalBlending,
        depthTest: false,
        depthWrite: false,
        sizeAttenuation: false
      }));
      codeSprite.scale.set(isMobile ? 0.12 : 0.1, isMobile ? 0.12 : 0.1, 1); // Larger on mobile
      codeSprite.visible = false;
      codeSprite.renderOrder = 1000;
      scene.add(codeSprite);
      ideaSpritePool.codes.push(codeSprite);
    }
    
    // Connection lines rendered as animated cylinders for better visibility
    const maxSignals = isMobile ? 15 : 35;
    const signalRadius = isMobile ? 0.18 : 0.12; // Thicker lines on mobile
    const signalGeometry = new ThreeLib.CylinderGeometry(signalRadius, signalRadius, 1, 8, 1, true);
    signalGeometry.translate(0, 0.5, 0);
    
    const signalMaterial = new ThreeLib.MeshBasicMaterial({
      color: 0x9bff1f,
      transparent: true,
      opacity: isMobile ? 0.9 : 0.7, // More visible on mobile
      blending: ThreeLib.AdditiveBlending,
      depthWrite: false
    });
    
    const signalsGroup = new ThreeLib.Group();
    scene.add(signalsGroup);
    
    const SIGNAL_TRAIL = 0.25;
    const IDEA_DURATION = 2600;
    const signalPool = [];
    const activeSignals = []; // { mesh, sourceIdx, targetIdx, progress, speed }
    const ideaEvents = []; // { targetIdx, expiresAt }
    for (let i = 0; i < maxSignals; i++) {
      const mesh = new ThreeLib.Mesh(signalGeometry, signalMaterial);
      mesh.visible = false;
      signalsGroup.add(mesh);
      signalPool.push(mesh);
    }
    
    // CONVERSATION SYSTEM - Emojis that appear when special nodes cross paths
    const CONVERSATION_DURATION = 2000; // 2 seconds
    const CONVERSATION_DISTANCE = 8; // Distance threshold for collision detection
    const conversationTexture = createConversationTexture();
    const maxConversations = 20;
    const conversationSpritePool = [];
    const activeConversations = []; // { sprite, position, expiresAt, baseSize }
    const collisionPairs = new Set(); // Track pairs that are currently in conversation to avoid duplicates
    
    // Create conversation sprite pool
    for (let i = 0; i < maxConversations; i++) {
      const convSprite = new ThreeLib.Sprite(new ThreeLib.SpriteMaterial({
        map: conversationTexture,
        transparent: true,
        opacity: 1.0,
        blending: ThreeLib.NormalBlending,
        depthTest: false,
        depthWrite: false,
        sizeAttenuation: false
      }));
      convSprite.scale.set(isMobile ? 0.12 : 0.1, isMobile ? 0.12 : 0.1, 1); // Same size as other halos
      convSprite.visible = false;
      convSprite.renderOrder = 1001; // Above other sprites
      scene.add(convSprite);
      conversationSpritePool.push(convSprite);
    }

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
    
    window.addEventListener('hero:explosion', (e) => {
      const multiplier = e.detail && e.detail.count ? (e.detail.count / 50) : 1.5;
      const burstVelocity = e.detail && e.detail.velocity ? e.detail.velocity : 2.0;
      
      const currentPositions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        if (Math.random() > 0.3) continue; 
        
        const i3 = i * 3;
        const x = currentPositions[i3];
        const y = currentPositions[i3+1];
        const z = currentPositions[i3+2];
        
        const dist = Math.sqrt(x*x + y*y + z*z) || 1;
        velocities[i3] += (x / dist) * burstVelocity * 0.05 * multiplier;
        velocities[i3+1] += (y / dist) * burstVelocity * 0.05 * multiplier;
        velocities[i3+2] += (z / dist) * burstVelocity * 0.05 * multiplier;
      }
    });

    // Animation loop
    const dummyVec3A = new ThreeLib.Vector3();
    const dummyVec3B = new ThreeLib.Vector3();
    const dummyDirection = new ThreeLib.Vector3();
    const dummyMidpoint = new ThreeLib.Vector3();
    const tempStartVec = new ThreeLib.Vector3();
    const tempEndVec = new ThreeLib.Vector3();
    const cylinderUp = new ThreeLib.Vector3(0, 1, 0);
    
    function registerIdea(targetIdx) {
      const now = performance.now();
      const particleType = particleTypes[targetIdx];
      
      // Different spawn probabilities based on type
      let shouldSpawn = false;
      if (particleType === 1 || particleType === 2 || particleType === 3) {
        // Scientist, Entrepreneur, or Coder: 100% chance
        shouldSpawn = true;
      } else {
        // Normal: 30% chance (already rolled before calling this function)
        shouldSpawn = true;
      }
      
      if (!shouldSpawn) return;
      
      // Determine which sprite pool to use
      let pool, baseSize;
      if (particleType === 1) { // scientist -> paper
        pool = ideaSpritePool.papers;
        baseSize = isMobile ? 0.12 : 0.1; // Larger on mobile
      } else if (particleType === 2) { // entrepreneur -> business
        pool = ideaSpritePool.businesses;
        baseSize = isMobile ? 0.12 : 0.1; // Larger on mobile
      } else if (particleType === 3) { // coder -> code
        pool = ideaSpritePool.codes;
        baseSize = isMobile ? 0.12 : 0.1; // Larger on mobile
      } else { // normal -> lightbulb
        pool = ideaSpritePool.lightbulbs;
        baseSize = isMobile ? 0.12 : 0.1; // Larger on mobile
      }
      
      if (pool.length === 0) return;
      
      // Check if this particle already has an idea
      for (let i = 0; i < activeIdeas.length; i++) {
        if (activeIdeas[i].targetIdx === targetIdx) {
          // Refresh the duration
          activeIdeas[i].expiresAt = now + IDEA_DURATION;
          return;
        }
      }
      
      // Spawn new idea
      const sprite = pool.pop();
      sprite.visible = true;
      activeIdeas.push({
        sprite,
        pool,
        targetIdx,
        baseSize,
        expiresAt: now + IDEA_DURATION
      });
    }

    function animate() {
      requestAnimationFrame(animate);

      const currentPositions = particlesGeometry.attributes.position.array;
      
      // Update Particles
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        currentPositions[i3] += velocities[i3];
        currentPositions[i3 + 1] += velocities[i3 + 1];
        currentPositions[i3 + 2] += velocities[i3 + 2];

        if (Math.abs(currentPositions[i3]) > 50) velocities[i3] *= -1;
        if (Math.abs(currentPositions[i3 + 1]) > 50) velocities[i3 + 1] *= -1;
        if (Math.abs(currentPositions[i3 + 2]) > 25) velocities[i3 + 2] *= -1;
        
        velocities[i3] *= 0.995;
        velocities[i3+1] *= 0.995;
        velocities[i3+2] *= 0.995;
        
        if (Math.abs(velocities[i3]) < 0.01) velocities[i3] += (Math.random()-0.5)*0.002;
      }
      particlesGeometry.attributes.position.needsUpdate = true;
      
      // Update Type Overlays (Scientists, Entrepreneurs, and Coders)
      for (let i = 0; i < typeOverlays.scientists.length; i++) {
        const overlay = typeOverlays.scientists[i];
        const pIdx = overlay.particleIdx * 3;
        overlay.sprite.position.set(
          currentPositions[pIdx],
          currentPositions[pIdx + 1],
          currentPositions[pIdx + 2]
        );
      }
      for (let i = 0; i < typeOverlays.entrepreneurs.length; i++) {
        const overlay = typeOverlays.entrepreneurs[i];
        const pIdx = overlay.particleIdx * 3;
        overlay.sprite.position.set(
          currentPositions[pIdx],
          currentPositions[pIdx + 1],
          currentPositions[pIdx + 2]
        );
      }
      for (let i = 0; i < typeOverlays.coders.length; i++) {
        const overlay = typeOverlays.coders[i];
        const pIdx = overlay.particleIdx * 3;
        overlay.sprite.position.set(
          currentPositions[pIdx],
          currentPositions[pIdx + 1],
          currentPositions[pIdx + 2]
        );
      }
      
      // Update Idea Sprites (Lightbulbs, Papers, Business Charts)
      const nowMs = performance.now();
      for (let i = activeIdeas.length - 1; i >= 0; i--) {
        const idea = activeIdeas[i];
        
        // Check if expired
        if (nowMs > idea.expiresAt) {
          idea.sprite.visible = false;
          idea.pool.push(idea.sprite);
          activeIdeas.splice(i, 1);
          continue;
        }
        
        // Update position to follow particle
        const pIdx = idea.targetIdx * 3;
        idea.sprite.position.set(
          currentPositions[pIdx],
          currentPositions[pIdx + 1],
          currentPositions[pIdx + 2]
        );
        
        // Pulse effect
        const age = nowMs - (idea.expiresAt - IDEA_DURATION);
        const pulse = 1 + Math.sin(age * 0.005) * 0.2;
        idea.sprite.scale.set(
          idea.baseSize * pulse,
          idea.baseSize * pulse,
          1
        );
      }
      
      // --- COLLISION DETECTION & CONVERSATIONS ---
      // Check for collisions between scientists, entrepreneurs, and coders
      const specialParticles = [];
      for (let i = 0; i < particleCount; i++) {
        if (particleTypes[i] === 1 || particleTypes[i] === 2 || particleTypes[i] === 3) {
          specialParticles.push(i);
        }
      }
      
      // Check each pair of special particles for collisions
      for (let i = 0; i < specialParticles.length; i++) {
        for (let j = i + 1; j < specialParticles.length; j++) {
          const idx1 = specialParticles[i];
          const idx2 = specialParticles[j];
          
          // Create a unique pair key (smaller index first)
          const pairKey = idx1 < idx2 ? `${idx1}-${idx2}` : `${idx2}-${idx1}`;
          
          // Check if already in conversation
          let alreadyInConversation = false;
          for (let k = 0; k < activeConversations.length; k++) {
            if (activeConversations[k].pairKey === pairKey) {
              alreadyInConversation = true;
              break;
            }
          }
          
          if (alreadyInConversation) continue;
          
          // Calculate distance
          const dx = currentPositions[idx1 * 3] - currentPositions[idx2 * 3];
          const dy = currentPositions[idx1 * 3 + 1] - currentPositions[idx2 * 3 + 1];
          const dz = currentPositions[idx1 * 3 + 2] - currentPositions[idx2 * 3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          // If particles are close enough, spawn conversation emoji
          if (distance < CONVERSATION_DISTANCE && conversationSpritePool.length > 0) {
            const sprite = conversationSpritePool.pop();
            const midpointX = (currentPositions[idx1 * 3] + currentPositions[idx2 * 3]) / 2;
            const midpointY = (currentPositions[idx1 * 3 + 1] + currentPositions[idx2 * 3 + 1]) / 2;
            const midpointZ = (currentPositions[idx1 * 3 + 2] + currentPositions[idx2 * 3 + 2]) / 2;
            
            sprite.position.set(midpointX, midpointY, midpointZ);
            sprite.visible = true;
            const baseSize = isMobile ? 0.12 : 0.1;
            sprite.scale.set(baseSize, baseSize, 1);
            
            // Apply repulsion force to push particles apart
            const REPULSION_STRENGTH = 0.15; // Strength of the push
            const safeDistance = Math.max(distance, 0.1); // Avoid division by zero
            const repulsionFactor = REPULSION_STRENGTH / safeDistance;
            
            // Normalize direction vector
            const dirX = dx / safeDistance;
            const dirY = dy / safeDistance;
            const dirZ = dz / safeDistance;
            
            // Apply repulsion to both particles (push them away from each other)
            velocities[idx1 * 3] += dirX * repulsionFactor;
            velocities[idx1 * 3 + 1] += dirY * repulsionFactor;
            velocities[idx1 * 3 + 2] += dirZ * repulsionFactor;
            
            velocities[idx2 * 3] -= dirX * repulsionFactor;
            velocities[idx2 * 3 + 1] -= dirY * repulsionFactor;
            velocities[idx2 * 3 + 2] -= dirZ * repulsionFactor;
            
            activeConversations.push({
              sprite,
              pairKey,
              idx1,
              idx2,
              expiresAt: nowMs + CONVERSATION_DURATION,
              baseSize
            });
          }
        }
      }
      
      // Update and cleanup active conversations
      for (let i = activeConversations.length - 1; i >= 0; i--) {
        const conv = activeConversations[i];
        
        // Check if expired or particles moved too far apart
        const dx = currentPositions[conv.idx1 * 3] - currentPositions[conv.idx2 * 3];
        const dy = currentPositions[conv.idx1 * 3 + 1] - currentPositions[conv.idx2 * 3 + 1];
        const dz = currentPositions[conv.idx1 * 3 + 2] - currentPositions[conv.idx2 * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (nowMs > conv.expiresAt || distance > CONVERSATION_DISTANCE * 1.5) {
          conv.sprite.visible = false;
          conversationSpritePool.push(conv.sprite);
          activeConversations.splice(i, 1);
          continue;
        }
        
        // Update position to follow midpoint between particles
        const midpointX = (currentPositions[conv.idx1 * 3] + currentPositions[conv.idx2 * 3]) / 2;
        const midpointY = (currentPositions[conv.idx1 * 3 + 1] + currentPositions[conv.idx2 * 3 + 1]) / 2;
        const midpointZ = (currentPositions[conv.idx1 * 3 + 2] + currentPositions[conv.idx2 * 3 + 2]) / 2;
        conv.sprite.position.set(midpointX, midpointY, midpointZ);
        
        // Apply continuous gentle repulsion to maintain separation
        const ONGOING_REPULSION = 0.03; // Weaker ongoing repulsion
        const safeDistance = Math.max(distance, 0.1);
        const repulsionFactor = ONGOING_REPULSION / safeDistance;
        
        // Normalize direction vector
        const dirX = dx / safeDistance;
        const dirY = dy / safeDistance;
        const dirZ = dz / safeDistance;
        
        // Apply gentle ongoing repulsion
        velocities[conv.idx1 * 3] += dirX * repulsionFactor;
        velocities[conv.idx1 * 3 + 1] += dirY * repulsionFactor;
        velocities[conv.idx1 * 3 + 2] += dirZ * repulsionFactor;
        
        velocities[conv.idx2 * 3] -= dirX * repulsionFactor;
        velocities[conv.idx2 * 3 + 1] -= dirY * repulsionFactor;
        velocities[conv.idx2 * 3 + 2] -= dirZ * repulsionFactor;
        
        // Pulse effect for conversation emoji
        const age = nowMs - (conv.expiresAt - CONVERSATION_DURATION);
        const pulse = 1 + Math.sin(age * 0.008) * 0.15;
        conv.sprite.scale.set(
          conv.baseSize * pulse,
          conv.baseSize * pulse,
          1
        );
      }
      
      // --- SIGNALS (Slow moving lines) ---
      
      // Spawn new signals
      if (signalPool.length > 0 && Math.random() < 0.05) {
        const sourceIdx = Math.floor(Math.random() * particleCount);
        
        // Find neighbor
        let targetIdx = -1;
        let minDist = 25;
        
        // Quick search for neighbor
        for(let k=0; k<20; k++) {
          const candidate = Math.floor(Math.random() * particleCount);
          if (candidate === sourceIdx) continue;
          
          const dx = currentPositions[sourceIdx*3] - currentPositions[candidate*3];
          const dy = currentPositions[sourceIdx*3+1] - currentPositions[candidate*3+1];
          const dz = currentPositions[sourceIdx*3+2] - currentPositions[candidate*3+2];
          const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
          
          if (d < minDist) {
            minDist = d;
            targetIdx = candidate;
          }
        }
        
        if (targetIdx !== -1) {
           const mesh = signalPool.pop();
           mesh.visible = true;
           activeSignals.push({
             mesh,
             sourceIdx,
             targetIdx,
             progress: 0,
             speed: 0.006 + Math.random() * 0.006
           });
        }
      }
      
      // Update active signals
      for (let i = activeSignals.length - 1; i >= 0; i--) {
        const sig = activeSignals[i];
        sig.progress += sig.speed;
        
        if (sig.progress >= 1) {
          const targetType = particleTypes[sig.targetIdx];
          // Normal particles: 30% chance, Scientists/Entrepreneurs/Coders: always spawn ideas (100%)
          if (targetType === 0) {
            // Normal particle: 30% chance
            if (Math.random() < 0.3) {
              registerIdea(sig.targetIdx);
            }
          } else if (targetType === 1 || targetType === 2 || targetType === 3) {
            // Scientist, Entrepreneur, or Coder: always call registerIdea (100% chance)
            registerIdea(sig.targetIdx);
          }
          sig.mesh.visible = false;
          signalPool.push(sig.mesh);
          activeSignals.splice(i, 1);
          continue;
        }
        
        const p1Idx = sig.sourceIdx * 3;
        const p2Idx = sig.targetIdx * 3;
        
        dummyVec3A.set(currentPositions[p1Idx], currentPositions[p1Idx+1], currentPositions[p1Idx+2]);
        dummyVec3B.set(currentPositions[p2Idx], currentPositions[p2Idx+1], currentPositions[p2Idx+2]);
        
        // Interpolate current head position
        const currentHead = dummyVec3A.clone().lerp(dummyVec3B, sig.progress);
        
        dummyDirection.copy(dummyVec3B).sub(dummyVec3A);
        const segmentLength = dummyDirection.length();
        if (segmentLength < 0.001) {
          sig.mesh.visible = false;
          continue;
        }
        dummyDirection.normalize();
        
        const headProgress = Math.min(sig.progress, 1);
        const dynamicTrail = Math.min(SIGNAL_TRAIL, headProgress, Math.max(0, 1 - headProgress));
        const clampedTail = headProgress - dynamicTrail;
        const visiblePortion = headProgress - clampedTail;
        
        if (visiblePortion <= 0) {
          sig.mesh.visible = false;
          continue;
        }
        
        tempStartVec.copy(dummyVec3A).addScaledVector(dummyDirection, segmentLength * clampedTail);
        tempEndVec.copy(dummyVec3A).addScaledVector(dummyDirection, segmentLength * headProgress);
        const partialLength = tempEndVec.distanceTo(tempStartVec);
        
        if (partialLength < 0.001) {
          sig.mesh.visible = false;
          continue;
        }
        
        dummyMidpoint.copy(tempStartVec).add(tempEndVec).multiplyScalar(0.5);
        
        sig.mesh.visible = true;
        sig.mesh.position.copy(dummyMidpoint);
        sig.mesh.scale.set(1, partialLength, 1);
        sig.mesh.quaternion.setFromUnitVectors(cylinderUp, dummyDirection);
      }

      // Rotation (sprites automatically face camera, no need to rotate them)
      particleSystem.rotation.x += (targetRotationX - particleSystem.rotation.x) * 0.05;
      particleSystem.rotation.y += (targetRotationY - particleSystem.rotation.y) * 0.05;
      
      signalsGroup.rotation.copy(particleSystem.rotation);

      particleSystem.rotation.z += 0.0002;
      signalsGroup.rotation.z += 0.0002;

      renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    window.addEventListener('beforeunload', () => {
      renderer.dispose();
      particlesGeometry.dispose();
      normalMaterial.dispose();
      signalMaterial.dispose();
      lightbulbTexture.dispose();
      scientistTexture.dispose();
      entrepreneurTexture.dispose();
      coderTexture.dispose();
      paperTexture.dispose();
      businessTexture.dispose();
      codeTexture.dispose();
      conversationTexture.dispose();
    });

    console.log('Three.js particle background initialized with LineSegments & ideas (fixed)');
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
