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
</style>

<div class="cv-container" style="display: flex; flex-direction: column; align-items: center; margin-bottom: 30px;">
  <div class="pdf-container" style="width: 100%; max-width: 800px; height: 800px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <iframe src="/files/CV___Vansh_Gupta.pdf#view=FitH" style="width: 100%; height: 100%; border: none;"></iframe>
  </div>
  
  <p class="mobile-message" style="display: none; text-align: center; margin-bottom: 15px; color: #666; max-width: 600px;">
    Having trouble viewing? For the best experience on mobile devices, you can download the PDF using the button below.
  </p>
  
  <a href="/files/CV___Vansh_Gupta.pdf" class="btn btn--primary" download style="display: inline-block; padding: 12px 24px; background-color: #2a7ae2; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
    <i class="fas fa-download" style="margin-right: 8px;"></i> Download PDF
  </a>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to download button
    const downloadBtn = document.querySelector('.btn.btn--primary');
    if (downloadBtn) {
      downloadBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#1c5aa0';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
      });
      downloadBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#2a7ae2';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      });
    }
    
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
