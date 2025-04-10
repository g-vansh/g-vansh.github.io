---
layout: archive
title: "Research Experience"
permalink: /publications/
author_profile: true
---

<div class="research-intro">
  <p>My research interests include innovation economics, organizational strategy, and data science applications. Below you can find my research projects and collaborations.</p>
  
  {% if author.googlescholar %}
    <p class="scholar-link">
      <i class="ai ai-google-scholar-square ai-fw"></i> Find my articles on <u><a href="{{author.googlescholar}}">Google Scholar</a></u>
    </p>
  {% else %}
    <p class="scholar-link">
      <i class="ai ai-google-scholar-square ai-fw"></i> <u><a href="https://scholar.google.com/citations?user=YOUR_ID">Google Scholar</a></u> (Add your profile link in _config.yml)
    </p>
  {% endif %}
</div>

{% include base_path %}

<div class="research-sections">
  <h2 class="section-heading">Research Projects</h2>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% unless post.type == "assistance" %}
        {% include archive-single.html %}
      {% endunless %}
    {% endfor %}
  </div>

  <h2 class="section-heading">Research Assistance</h2>
  <div class="research-assistance-section">
    {% for post in site.publications reversed %}
      {% if post.type == "assistance" %}
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
  
  .section-heading {
    margin-top: 2em;
    margin-bottom: 1em;
    color: #2a76dd;
    border-bottom: 1px solid #f2f3f3;
    padding-bottom: 0.5em;
  }
  
  .research-projects-section, .research-assistance-section {
    margin-bottom: 3em;
  }
  
  .research-projects-section .archive__item-title,
  .research-assistance-section .archive__item-title {
    margin-top: 0.5em;
    font-size: 1.25em;
  }
  
  .research-sections {
    margin-top: 2em;
  }
  
  .project-badge, .assistance-badge {
    display: inline-block;
    font-size: 0.7em;
    padding: 0.3em 0.5em;
    margin-left: 0.5em;
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
</style>
