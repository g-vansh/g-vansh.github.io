---
layout: archive
title: "Research Experience"
permalink: /publications/
author_profile: true
---

<div class="research-intro">
  <p>My research interests include innovation, urban, and development economics. I am currently working on projects that explore methods in geneoeconomics and neuroeconomics. Below you can find my research projects and collaborations.</p>
  
  {% include affiliations.html %}
  
  <div class="research-stats-container">
    <h3>Research Focus Areas</h3>
    <div class="research-stats-visualization">
      <div class="stats-chart-container">
        <canvas id="researchFocusChart"></canvas>
      </div>
      <div class="stats-description">
        <p>Over time, I have explored methods in many fields of economics. Presently, I am working to apply this experience to discover insights about how innovation is generated, where we get our ideas from, and how our environment shapes our ideas.</p>
      </div>
    </div>
  </div>
  
  {% if author.googlescholar %}
    <p class="scholar-link">
      <i class="ai ai-google-scholar-square ai-fw"></i> Find my articles on <u><a href="{{author.googlescholar}}">Google Scholar</a></u>
    </p>
    <div class="scholar-stats">
      <iframe src="/scripts/citations-static.html" frameborder="0" width="100%" style="min-height: 360px; height: auto;" scrolling="no"></iframe>
    </div>
  {% else %}
    <p class="scholar-link">
      <i class="ai ai-google-scholar-square ai-fw"></i> <u><a href="https://scholar.google.com/citations?user=VLDgDyAAAAAJ">Google Scholar</a></u> 
    </p>
    <div class="scholar-stats">
      <iframe src="/scripts/citations-static.html" frameborder="0" width="100%" style="min-height: 360px; height: auto;" scrolling="no"></iframe>
    </div>
  {% endif %}
</div>

{% include base_path %}

<div class="research-sections">
  <h2 class="section-heading reveal-on-scroll" style="text-align: center; margin: 4rem 0 3rem; font-size: clamp(2rem, 5vw, 3.5rem);">Research Projects</h2>
  
  <h3 class="subsection-heading under_review reveal-on-scroll">Under Review</h3>
  <div class="bento-grid research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "under_review" and post.index != "No" %}
        <div class="bento-item">
          {% include archive-single.html %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
  
  <h3 class="subsection-heading in_progress reveal-on-scroll">Work In Progress</h3>
  <div class="bento-grid research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "in_progress" and post.index != "No" %}
        <div class="bento-item">
          {% include archive-single.html %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
  
  <h3 class="subsection-heading inactive reveal-on-scroll">Inactive Projects</h3>
  <div class="bento-grid research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "inactive" and post.index != "No" %}
        <div class="bento-item">
          {% include archive-single.html %}
        </div>
      {% endif %}
    {% endfor %}
  </div>

  <h2 class="section-heading reveal-on-scroll" style="text-align: center; margin: 4rem 0 3rem; font-size: clamp(2rem, 5vw, 3.5rem);">Research Assistance</h2>
  <div class="bento-grid research-assistance-section">
    {% for post in site.publications reversed %}
      {% if post.type == "assistance" and post.index != "No" %}
        <div class="bento-item">
          {% include archive-single.html %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Collect tags from all publications
  const tagCounts = {};
  
  {% for post in site.publications %}
    {% if post.tags %}
      {% for tag in post.tags %}
        if (!tagCounts["{{ tag }}"]) {
          tagCounts["{{ tag }}"] = 0;
        }
        tagCounts["{{ tag }}"]++;
      {% endfor %}
    {% endif %}
  {% endfor %}
  
  // Convert to arrays for Chart.js
  const labels = Object.keys(tagCounts);
  const data = Object.values(tagCounts);
  
  // Make data available globally for research-stats.js
  window.publicationTagsData = {
    labels: labels,
    counts: data
  };
});
</script>

<script src="/assets/js/research-stats.js"></script>

<style>
  .research-intro {
    margin-bottom: 2em;
    padding: clamp(1.25rem, 3vw, 2rem);
    background-color: rgba(6, 19, 12, 0.75);
    border: 1px solid rgba(155, 255, 31, 0.25);
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    color: #f1ffe9;
  }
  
  .research-intro p {
    color: rgba(241, 255, 233, 0.85);
    line-height: 1.7;
    margin-bottom: 1em;
  }
  
  .research-intro h3 {
    color: #9bff1f;
    font-family: 'Azeret Mono', 'JetBrains Mono', monospace;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    font-size: clamp(1rem, 2.5vw, 1.25rem);
  }
  
  .scholar-link {
    margin-top: 1.5em;
    font-weight: 500;
    color: rgba(241, 255, 233, 0.85);
  }
  
  .scholar-link a {
    color: #9bff1f;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  
  .scholar-link a:hover {
    color: #b3ff47;
    text-decoration: underline;
  }
  
  .scholar-stats {
    margin-top: 1em;
    background-color: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
    width: 100%;
  }
  
  .scholar-stats iframe {
    width: 100%;
    height: auto;
    min-height: 360px;
    border: none;
    background: transparent;
  }
  
  .section-heading {
    margin-top: 2em;
    margin-bottom: 1em;
    color: #9bff1f;
    border-bottom: 1px solid rgba(155, 255, 31, 0.25);
    padding-bottom: 0.5em;
    font-family: 'Azeret Mono', 'JetBrains Mono', monospace;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  .subsection-heading {
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    color: #f1ffe9;
    font-size: clamp(1.125rem, 2.5vw, 1.3rem);
    border-left: 2px solid #9bff1f;
    padding-left: 0.75em;
    font-family: 'Azeret Mono', 'JetBrains Mono', monospace;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  
  .research-projects-section h3.subsection-heading[class*="under_review"] {
    border-left-color: #dc3545;
  }
  
  .research-projects-section h3.subsection-heading[class*="in_progress"] {
    border-left-color: #fd7e14;
  }
  
  .research-projects-section h3.subsection-heading[class*="inactive"] {
    border-left-color: rgba(241, 255, 233, 0.4);
  }
  
  .research-projects-section, .research-assistance-section {
    margin-bottom: 2em;
  }
  
  .archive__item {
    margin-bottom: 1.5em;
    padding-bottom: 1em;
    border-bottom: 1px solid rgba(155, 255, 31, 0.15);
  }
  
  .archive__item p {
    margin-top: 0.3em;
    margin-bottom: 0.3em;
    line-height: 1.6;
    color: rgba(241, 255, 233, 0.8);
  }
  
  .research-projects-section .archive__item-title,
  .research-assistance-section .archive__item-title {
    margin-top: 0.5em;
    font-size: clamp(1.125rem, 2.5vw, 1.25rem);
    margin-bottom: 0.15em;
  }
  
  .archive__item-badges {
    margin-top: 0;
    margin-bottom: 0.4em;
  }
  
  .research-sections {
    margin-top: 2em;
  }
  
  .project-badge, .assistance-badge {
    display: inline-block;
    font-size: 0.7em;
    padding: 0.3em 0.5em;
    margin-right: 0.5em;
    border-radius: 3px;
    vertical-align: middle;
    font-weight: normal;
  }
  
  .project-badge {
    background-color: rgba(155, 255, 31, 0.2);
    color: #9bff1f;
    border: 1px solid rgba(155, 255, 31, 0.4);
  }
  
  .assistance-badge {
    background-color: rgba(98, 255, 198, 0.2);
    color: #62ffc6;
    border: 1px solid rgba(98, 255, 198, 0.4);
  }
  
  .status-badge {
    display: inline-block;
    font-size: 0.65em;
    padding: 0.2em 0.4em;
    margin-right: 0.5em;
    border-radius: 3px;
    vertical-align: middle;
    font-weight: normal;
  }
  
  .status-under-review {
    background-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border: 1px solid rgba(220, 53, 69, 0.4);
  }
  
  .status-in-progress {
    background-color: rgba(253, 126, 20, 0.2);
    color: #fd7e14;
    border: 1px solid rgba(253, 126, 20, 0.4);
  }
  
  .status-inactive {
    background-color: rgba(241, 255, 233, 0.1);
    color: rgba(241, 255, 233, 0.6);
    border: 1px solid rgba(241, 255, 233, 0.2);
  }
  
  .media-coverage {
    margin-top: 0.75em;
    padding: 1em 1.25em;
    background-color: rgba(6, 19, 12, 0.6);
    border-left: 3px solid #62ffc6;
    border-radius: 0;
    border: 1px solid rgba(98, 255, 198, 0.25);
  }
  
  .media-coverage h4 {
    margin-top: 0;
    margin-bottom: 0.5em;
    color: #62ffc6;
    font-size: 0.9em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'Azeret Mono', 'JetBrains Mono', monospace;
  }
  
  .media-coverage ul {
    margin: 0;
    padding-left: 1.2em;
  }
  
  .media-coverage li {
    margin-bottom: 0.3em;
    font-size: 0.85em;
    line-height: 1.5;
    color: rgba(241, 255, 233, 0.8);
  }
  
  .media-coverage li:last-child {
    margin-bottom: 0;
  }
  
  .media-coverage a {
    font-weight: 600;
    color: #9bff1f;
    transition: color 0.3s ease;
  }
  
  .media-coverage a:hover {
    color: #b3ff47;
  }
  
  .research-stats-container {
    margin: 2em 0;
  }
  
  .research-stats-visualization {
    display: flex;
    flex-direction: row;
    gap: clamp(1.5rem, 4vw, 2.5rem);
    margin-top: 1em;
    align-items: center;
  }
  
  .stats-chart-container {
    flex: 1;
    min-width: 0;
    height: clamp(280px, 40vh, 360px);
    position: relative;
    max-width: 100%;
  }
  
  .stats-description {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }
  
  .stats-description p {
    color: rgba(241, 255, 233, 0.8);
    line-height: 1.7;
    margin: 0;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 767px) {
    .research-intro {
      padding: 1.25rem;
      margin-bottom: 1.5em;
    }
    
    .research-stats-visualization {
      flex-direction: column;
      gap: 1.5em;
    }
    
    .stats-chart-container {
      width: 100%;
      height: clamp(250px, 50vh, 320px);
      max-width: 100%;
    }
    
    .stats-description {
      width: 100%;
      text-align: left;
    }
    
    .stats-description p {
      text-align: left;
    }
    
    .research-stats-container h3 {
      text-align: left;
      font-size: 1.125rem;
    }
    
    .scholar-stats iframe {
      min-height: clamp(300px, 50vh, 400px);
    }
    
    .section-heading {
      font-size: clamp(1.5rem, 6vw, 2rem);
      margin-top: 1.5em;
    }
    
    .subsection-heading {
      font-size: 1.125rem;
      margin-top: 1.25em;
    }
    
    .research-projects-section, .research-assistance-section {
      margin-bottom: 1.5em;
    }
  }
  
  /* Desktop optimizations */
  @media (min-width: 768px) {
    .research-intro {
      padding: 2rem;
    }
    
    .stats-chart-container {
      height: 360px;
    }
    
    .scholar-stats iframe {
      min-height: 400px;
    }
    
    .research-stats-visualization {
      gap: 2.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    .stats-chart-container {
      height: 400px;
    }
    
    .scholar-stats iframe {
      min-height: 450px;
    }
  }
</style>
