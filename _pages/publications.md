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
      <iframe src="/scripts/citations-static.html" frameborder="0" width="100%" height="360" scrolling="no"></iframe>
    </div>
  {% else %}
    <p class="scholar-link">
      <i class="ai ai-google-scholar-square ai-fw"></i> <u><a href="https://scholar.google.com/citations?user=VLDgDyAAAAAJ">Google Scholar</a></u> 
    </p>
    <div class="scholar-stats">
      <iframe src="/scripts/citations-static.html" frameborder="0" width="100%" height="360" scrolling="no"></iframe>
    </div>
  {% endif %}
</div>

{% include base_path %}

<div class="research-sections">
  <h2 class="section-heading">Research Projects</h2>
  
  <h3 class="subsection-heading under_review">Under Review</h3>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "under_review" and post.index != "No" %}
        {% include archive-single.html %}
      {% endif %}
    {% endfor %}
  </div>
  
  <h3 class="subsection-heading in_progress">Work In Progress</h3>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "in_progress" and post.index != "No" %}
        {% include archive-single.html %}
      {% endif %}
    {% endfor %}
  </div>
  
  <h3 class="subsection-heading inactive">Inactive Projects</h3>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "inactive" and post.index != "No" %}
        {% include archive-single.html %}
      {% endif %}
    {% endfor %}
  </div>

  <h2 class="section-heading">Research Assistance</h2>
  <div class="research-assistance-section">
    {% for post in site.publications reversed %}
      {% if post.type == "assistance" and post.index != "No" %}
        {% include archive-single.html %}
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
    padding: 1.5em;
    background-color: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  .scholar-link {
    margin-top: 1em;
    font-weight: 500;
  }
  
  .scholar-stats {
    margin-top: 1em;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  .section-heading {
    margin-top: 2em;
    margin-bottom: 1em;
    color: #2a76dd;
    border-bottom: 1px solid #f2f3f3;
    padding-bottom: 0.5em;
  }
  
  .subsection-heading {
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    color: #333;
    font-size: 1.3em;
    border-left: 3px solid #2a76dd;
    padding-left: 0.5em;
  }
  
  .research-projects-section h3.subsection-heading[class*="under_review"] {
    border-left-color: #dc3545;
  }
  
  .research-projects-section h3.subsection-heading[class*="in_progress"] {
    border-left-color: #fd7e14;
  }
  
  .research-projects-section h3.subsection-heading[class*="inactive"] {
    border-left-color: #6c757d;
  }
  
  .research-projects-section, .research-assistance-section {
    margin-bottom: 2em;
  }
  
  .archive__item {
    margin-bottom: 1.5em;
    padding-bottom: 1em;
    border-bottom: 1px solid #f2f3f3;
  }
  
  .archive__item p {
    margin-top: 0.3em;
    margin-bottom: 0.3em;
    line-height: 1.4;
  }
  
  .research-projects-section .archive__item-title,
  .research-assistance-section .archive__item-title {
    margin-top: 0.5em;
    font-size: 1.25em;
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
    background-color: #28a745;
    color: white;
  }
  
  .assistance-badge {
    background-color: #007bff;
    color: white;
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
    background-color: #dc3545;
    color: white;
  }
  
  .status-in-progress {
    background-color: #fd7e14;
    color: white;
  }
  
  .status-inactive {
    background-color: #6c757d;
    color: white;
  }
  
  .media-coverage {
    margin-top: 0.75em;
    padding: 0.75em 1em;
    background-color: #f8f9fa;
    border-left: 3px solid #17a2b8;
    border-radius: 3px;
  }
  
  .media-coverage h4 {
    margin-top: 0;
    margin-bottom: 0.5em;
    color: #17a2b8;
    font-size: 0.9em;
    font-weight: 600;
  }
  
  .media-coverage ul {
    margin: 0;
    padding-left: 1.2em;
  }
  
  .media-coverage li {
    margin-bottom: 0.3em;
    font-size: 0.85em;
    line-height: 1.4;
  }
  
  .media-coverage li:last-child {
    margin-bottom: 0;
  }
  
  .media-coverage a {
    font-weight: 600;
    color: #0056b3;
  }
  
  .research-stats-container {
    margin: 2em 0;
  }
  
  .research-stats-visualization {
    display: flex;
    flex-direction: row;
    gap: 2em;
    margin-top: 1em;
  }
  
  .stats-chart-container {
    flex: 1;
    min-width: 0;
    height: 320px;
    position: relative;
  }
  
  .stats-description {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 767px) {
    .research-stats-visualization {
      flex-direction: column;
      gap: 1em;
    }
    
    .stats-chart-container {
      width: 100%;
      height: 300px;
    }
    
    .stats-description {
      width: 100%;
      text-align: center;
    }
    
    .research-stats-container h3 {
      text-align: center;
    }
  }
</style>
