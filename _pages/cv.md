---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<style>
  @media screen and (max-width: 767px) {
    .pdf-container {
      height: 500px !important;
    }
    .mobile-message {
      display: block !important;
    }
  }
  
  .download-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 28px;
    background-color: #2a7ae2;
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(42, 122, 226, 0.25);
    overflow: hidden;
    z-index: 1;
    border: 2px solid transparent;
  }
  
  .download-btn:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2a7ae2, #2045a0);
    z-index: -1;
    transition: all 0.4s ease;
  }
  
  .download-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(42, 122, 226, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .download-btn:hover:before {
    transform: scale(1.05);
    opacity: 0.9;
  }
  
  .download-btn:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(42, 122, 226, 0.4);
  }
  
  .download-btn i {
    margin-right: 10px;
    transition: transform 0.3s ease;
  }
  
  .download-btn:hover i {
    transform: translateY(-2px);
  }
  
  .cv-header {
    text-align: center;
    margin-bottom: 25px;
    width: 100%;
    max-width: 800px;
  }
</style>

<div class="cv-container" style="display: flex; flex-direction: column; align-items: center; margin-bottom: 30px;">
  <div class="cv-header">
    <a href="/files/CV___Vansh_Gupta.pdf" class="download-btn" download>
      <i class="fas fa-download"></i> Download CV
    </a>
    
    <p class="mobile-message" style="display: none; text-align: center; margin-top: 15px; color: #666; max-width: 600px;">
      Having trouble viewing? The download button above provides the best experience on mobile devices.
    </p>
  </div>

  <div class="pdf-container" style="width: 100%; max-width: 800px; height: 800px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
    <iframe src="/files/CV___Vansh_Gupta.pdf#view=FitH" style="width: 100%; height: 100%; border: none;"></iframe>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {    
    // Check if mobile and adjust PDF view if needed
    function isMobile() {
      return window.innerWidth <= 767;
    }
    
    // Adjust iframe for mobile
    function adjustForMobile() {
      const iframe = document.querySelector('.pdf-container iframe');
      if (iframe && isMobile()) {
        // Try to set PDF to fit width for better mobile viewing
        if (iframe.src.indexOf('#') === -1) {
          iframe.src = iframe.src + '#view=FitH';
        }
      }
    }
    
    // Run on load
    adjustForMobile();
    
    // Run on resize
    window.addEventListener('resize', adjustForMobile);
  });
</script>
