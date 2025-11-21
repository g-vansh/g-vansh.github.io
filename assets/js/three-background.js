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
    canvas.style.opacity = '0.6'; // Increased opacity for better visibility
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
    const isMobile = window.innerWidth < 768;
    const baseParticleCount = isMobile ? 300 : 800; 
    let particleCount = baseParticleCount;
    
    const particlesGeometry = new ThreeLib.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
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
      }

      particlesGeometry.setAttribute('position', new ThreeLib.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new ThreeLib.BufferAttribute(colors, 3));
    }
    
    initParticles();
    
    const normalMaterial = new ThreeLib.PointsMaterial({
      size: isMobile ? 0.8 : 1.5,
      vertexColors: true,
      map: createSquareTexture(),
      transparent: true,
      opacity: 0.8,
      blending: ThreeLib.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });
    
    const ideaMaterial = new ThreeLib.PointsMaterial({
      size: isMobile ? 6.0 : 10.0, // Increased size significantly
      color: 0xffd86b, 
      map: createLightbulbTexture(),
      transparent: true,
      opacity: 1.0,
      blending: ThreeLib.NormalBlending,
      sizeAttenuation: true,
      depthWrite: false
    });

    const particleSystem = new ThreeLib.Points(particlesGeometry, normalMaterial);
    scene.add(particleSystem);
    
    // Idea system - subset of particles that are currently "ideas"
    const ideaGeometry = new ThreeLib.BufferGeometry();
    const maxIdeas = 50;
    const ideaPositions = new Float32Array(maxIdeas * 3);
    
    // Initialize idea positions far away
    for(let i=0; i<maxIdeas*3; i++) ideaPositions[i] = 9999;
    
    ideaGeometry.setAttribute('position', new ThreeLib.BufferAttribute(ideaPositions, 3));
    
    const ideaSystem = new ThreeLib.Points(ideaGeometry, ideaMaterial);
    scene.add(ideaSystem);
    
    // Connection Lines (Using InstancedMesh for Cylinder lines for thickness, or regular lines if performance is key)
    // Since we want thickness, let's use LineSegments but with higher opacity and color brightness to fake thickness
    // or use a small number of Mesh lines. 
    // Given user request for "prominent/thicker", LineBasicMaterial is bad (always 1px).
    // Let's use a TubeGeometry/CylinderGeometry for signals.
    
    // "Signals" are lines that grow from source to target.
    // We'll model them as Cylinders that stretch.
    
    const maxSignals = isMobile ? 15 : 30;
    const signalGeometry = new ThreeLib.CylinderGeometry(0.15, 0.15, 1, 6); // Radius 0.15 = thick line
    signalGeometry.translate(0, 0.5, 0); // Pivot at bottom
    signalGeometry.rotateX(Math.PI / 2); // Point along Z by default or align later
    
    const signalMaterial = new ThreeLib.MeshBasicMaterial({
      color: 0x9bff1f,
      transparent: true,
      opacity: 0.6,
      blending: ThreeLib.AdditiveBlending
    });
    
    const signalMesh = new ThreeLib.InstancedMesh(signalGeometry, signalMaterial, maxSignals);
    signalMesh.instanceMatrix.setUsage(ThreeLib.DynamicDrawUsage);
    scene.add(signalMesh);
    
    const activeSignals = []; // { sourceIdx, targetIdx, progress, speed, instanceId }
    const signalPool = Array.from({length: maxSignals}, (_, i) => i); // Available instance IDs
    
    // Helpers for textures
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

    function createLightbulbTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 128; // Increased resolution
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      
      // Draw glowing background
      const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      gradient.addColorStop(0, 'rgba(255, 216, 107, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 216, 107, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(64, 64, 60, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.font = '90px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff'; // White core for bulb
      ctx.fillText('💡', 64, 68);
      
      const texture = new ThreeLib.CanvasTexture(canvas);
      return texture;
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
    const activeIdeas = []; 
    const tempMatrix = new ThreeLib.Matrix4();
    const dummyVec3A = new ThreeLib.Vector3();
    const dummyVec3B = new ThreeLib.Vector3();
    const dummyVec3Scale = new ThreeLib.Vector3();
    const dummyQuaternion = new ThreeLib.Quaternion();

    function animate() {
      requestAnimationFrame(animate);

      const currentPositions = particlesGeometry.attributes.position.array;
      const ideaPosAttr = ideaSystem.geometry.attributes.position;
      const ideaPosArray = ideaPosAttr.array;
      
      // Reset ideas positions
      for(let k=0; k<maxIdeas*3; k++) ideaPosArray[k] = 9999;

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
      
      // Handle Ideas
      const now = Date.now();
      if (activeIdeas.length < maxIdeas && Math.random() < 0.03) { // Increased spawn rate
        const targetIdx = Math.floor(Math.random() * particleCount);
        activeIdeas.push({
          index: targetIdx,
          startTime: now,
          duration: 2000 + Math.random() * 1500
        });
      }
      
      let activeIdeaCount = 0;
      for (let i = activeIdeas.length - 1; i >= 0; i--) {
        const idea = activeIdeas[i];
        const elapsed = now - idea.startTime;
        
        if (elapsed > idea.duration) {
          activeIdeas.splice(i, 1); 
          continue;
        }
        
        if (activeIdeaCount < maxIdeas) {
          const pIdx = idea.index * 3;
          const iIdx = activeIdeaCount * 3;
          
          ideaPosArray[iIdx] = currentPositions[pIdx];
          ideaPosArray[iIdx+1] = currentPositions[pIdx+1];
          ideaPosArray[iIdx+2] = currentPositions[pIdx+2];
          
          activeIdeaCount++;
        }
      }
      ideaPosAttr.needsUpdate = true;
      
      // --- SIGNALS (Slow moving thicker lines) ---
      
      // Spawn new signals
      if (activeSignals.length < maxSignals && signalPool.length > 0 && Math.random() < 0.05) {
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
           const instanceId = signalPool.pop();
           activeSignals.push({
             sourceIdx,
             targetIdx,
             progress: 0,
             speed: 0.008 + Math.random() * 0.008, // Slower speed
             instanceId
           });
        }
      }
      
      // Reset all instances offscreen
      tempMatrix.setPosition(9999, 9999, 9999);
      for(let i=0; i<maxSignals; i++) {
        signalMesh.setMatrixAt(i, tempMatrix);
      }
      
      // Update active signals
      for (let i = activeSignals.length - 1; i >= 0; i--) {
        const sig = activeSignals[i];
        sig.progress += sig.speed;
        
        if (sig.progress >= 1) {
          // Arrived! Maybe create an idea at target?
          if (Math.random() < 0.4) {
             activeIdeas.push({
              index: sig.targetIdx,
              startTime: now,
              duration: 2000
            });
          }
          
          signalPool.push(sig.instanceId);
          activeSignals.splice(i, 1);
          continue;
        }
        
        const p1Idx = sig.sourceIdx * 3;
        const p2Idx = sig.targetIdx * 3;
        
        dummyVec3A.set(currentPositions[p1Idx], currentPositions[p1Idx+1], currentPositions[p1Idx+2]);
        dummyVec3B.set(currentPositions[p2Idx], currentPositions[p2Idx+1], currentPositions[p2Idx+2]);
        
        // Interpolate current head position
        const currentHead = dummyVec3A.clone().lerp(dummyVec3B, sig.progress);
        
        // We want to draw a line from A to currentHead (or a segment moving)
        // Let's draw from A to currentHead
        const center = dummyVec3A.clone().lerp(currentHead, 0.5);
        const len = dummyVec3A.distanceTo(currentHead);
        
        dummyVec3Scale.set(1, 1, len); // Scale Z to length (since we rotated cylinder)
        tempMatrix.makeScale(1, 1, 1); // Reset scale
        tempMatrix.lookAt(dummyVec3A, dummyVec3B, new ThreeLib.Vector3(0,1,0)); // Orient Z axis from A to B
        
        // Rebuild matrix manually for Cylinder
        // Position is center
        // Rotation is towards B
        // Scale Z is length
        
        // InstancedMesh Matrix helper:
        // 1. Position at A
        // 2. LookAt B
        // 3. Scale Z to current length
        // 4. Move to midpoint (local Z 0.5 * length)
        
        // Simpler way using Object3D dummy
        const dummyObj = new ThreeLib.Object3D();
        dummyObj.position.copy(center);
        dummyObj.lookAt(dummyVec3B); // Point Z towards B
        dummyObj.scale.set(1, 1, len); // Scale length
        dummyObj.rotateX(Math.PI / 2); // Cylinder default is Y-up, we need Z-forward alignment correction if needed
        // Actually, CylinderGeometry(radius, radius, height) aligns with Y axis.
        // So if we lookAt, the Z axis points to target. 
        // We need to rotate the cylinder 90 deg on X so it lies on Z axis?
        // Wait, I already rotated the Geometry in initialization: signalGeometry.rotateX(Math.PI / 2);
        // This means the cylinder ALREADY lies along Z axis.
        // So dummyObj.lookAt(dummyVec3B) will point positive Z to target.
        // And scaling Z will stretch it.
        
        dummyObj.updateMatrix();
        signalMesh.setMatrixAt(sig.instanceId, dummyObj.matrix);
      }
      
      signalMesh.instanceMatrix.needsUpdate = true;

      // Rotation
      particleSystem.rotation.x += (targetRotationX - particleSystem.rotation.x) * 0.05;
      particleSystem.rotation.y += (targetRotationY - particleSystem.rotation.y) * 0.05;
      
      ideaSystem.rotation.copy(particleSystem.rotation);
      signalMesh.rotation.copy(particleSystem.rotation);

      particleSystem.rotation.z += 0.0002;
      ideaSystem.rotation.z += 0.0002;
      signalMesh.rotation.z += 0.0002;

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
      ideaMaterial.dispose();
      signalMaterial.dispose();
    });

    console.log('Three.js particle background initialized with thicker signals & ideas');
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
