---
layout: archive
title: "Research Experience"
permalink: /publications/
author_profile: true
---

<div class="research-intro">
  <p>My research interests include innovation, urban, and development economics. I am currently working on projects that explore methods in geneoeconomics and neuroeconomics. Below you can find my research projects and collaborations.</p>
  
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
  
  <h3 class="subsection-heading">Under Review</h3>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "under_review" and post.index != "No" %}
        {% include archive-single.html %}
      {% endif %}
    {% endfor %}
  </div>
  
  <h3 class="subsection-heading">Work In Progress</h3>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "in_progress" and post.index != "No" %}
        {% include archive-single.html %}
      {% endif %}
    {% endfor %}
  </div>
  
  <h3 class="subsection-heading">Inactive Projects</h3>
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
  
  .research-projects-section, .research-assistance-section {
    margin-bottom: 2em;
  }
  
  .research-projects-section .archive__item-title,
  .research-assistance-section .archive__item-title {
    margin-top: 0.5em;
    font-size: 1.25em;
    margin-bottom: 0.25em;
  }
  
  .archive__item-badges {
    margin-bottom: 0.75em;
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
    background-color: #007bff;
    color: white;
  }
  
  .assistance-badge {
    background-color: #28a745;
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
</style>
