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
  {% else %}
    <p class="scholar-link">
      <i class="ai ai-google-scholar-square ai-fw"></i> <u><a href="https://scholar.google.com/citations?user=VLDgDyAAAAAJ">Google Scholar</a></u> 
    </p>
  {% endif %}
  
  <div class="citation-metrics">
    <div id="scholar-stats">
      <div class="stats-loading">Loading citation metrics...</div>
    </div>
  </div>
</div>

{% include base_path %}

<div class="research-sections">
  <h2 class="section-heading">Research Projects</h2>
  
  <h3 class="subsection-heading">Under Review</h3>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "under_review" %}
        {% include archive-single.html %}
      {% endif %}
    {% endfor %}
  </div>
  
  <h3 class="subsection-heading">Work In Progress</h3>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "in_progress" %}
        {% include archive-single.html %}
      {% endif %}
    {% endfor %}
  </div>
  
  <h3 class="subsection-heading">Inactive Projects</h3>
  <div class="research-projects-section">
    {% for post in site.publications reversed %}
      {% if post.type == "project" and post.project_status == "inactive" %}
        {% include archive-single.html %}
      {% endif %}
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

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Hardcoded citation metrics (since direct scraping from Google Scholar is challenging)
    const scholarData = {
      citations: 7,
      hIndex: 1,
      i10Index: 0,
      citationsByYear: [
        { year: 2023, count: 3 },
        { year: 2022, count: 2 },
        { year: 2021, count: 2 }
      ]
    };
    
    // Try to fetch updated data, but fallback to hardcoded data
    tryFetchScholarData();
    
    // Function to try fetching data with a CORS proxy
    function tryFetchScholarData() {
      // Try to fetch with a CORS proxy (note: some proxies may stop working over time)
      const corsProxy = 'https://corsproxy.io/?';
      const scholarUrl = encodeURIComponent('https://scholar.google.com/citations?user=VLDgDyAAAAAJ&hl=en');
      
      fetch(corsProxy + scholarUrl)
        .then(response => {
          if (response.ok) return response.text();
          throw new Error('Network response was not ok');
        })
        .then(html => {
          try {
            // Try to parse the HTML response
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract citation count
            const citationElement = doc.querySelector('#gsc_rsb_st tbody tr:first-child td:last-child');
            if (citationElement) {
              scholarData.citations = parseInt(citationElement.textContent.trim(), 10) || scholarData.citations;
            }
            
            // Extract h-index
            const hIndexElement = doc.querySelector('#gsc_rsb_st tbody tr:nth-child(2) td:last-child');
            if (hIndexElement) {
              scholarData.hIndex = parseInt(hIndexElement.textContent.trim(), 10) || scholarData.hIndex;
            }
            
            // Extract i10-index
            const i10IndexElement = doc.querySelector('#gsc_rsb_st tbody tr:nth-child(3) td:last-child');
            if (i10IndexElement) {
              scholarData.i10Index = parseInt(i10IndexElement.textContent.trim(), 10) || scholarData.i10Index;
            }
            
            // Extract citation by year data
            const yearContainers = doc.querySelectorAll('.gsc_md_hist_b .gsc_g_t');
            const countContainers = doc.querySelectorAll('.gsc_md_hist_b .gsc_g_al');
            
            if (yearContainers.length > 0 && countContainers.length > 0) {
              scholarData.citationsByYear = [];
              for (let i = 0; i < yearContainers.length; i++) {
                const year = parseInt(yearContainers[i].textContent.trim(), 10);
                const count = parseInt(countContainers[i].textContent.trim(), 10);
                if (!isNaN(year) && !isNaN(count)) {
                  scholarData.citationsByYear.push({ year, count });
                }
              }
            }
            
            console.log('Successfully updated citation data from Google Scholar');
          } catch (e) {
            console.error('Error parsing Google Scholar data:', e);
          }
          
          // Render the stats regardless of whether we updated the data
          renderScholarStats();
        })
        .catch(error => {
          console.error('Unable to fetch from Google Scholar:', error);
          renderScholarStats(); // Render with hardcoded data
        });
    }
    
    // Function to render the scholar stats
    function renderScholarStats() {
      const scholarStats = document.getElementById('scholar-stats');
      scholarStats.innerHTML = `
        <div class="citation-header">
          Citations according to <a href="https://scholar.google.com/citations?user=VLDgDyAAAAAJ" target="_blank">Google Scholar</a>: 
          <span class="citation-count">${scholarData.citations}</span> 
          (h-index: <span class="h-index">${scholarData.hIndex}</span>)
        </div>
        <div class="citation-chart">
          <div class="chart-title">Citations per year</div>
          <div class="chart-container">
            ${generateBarChart(scholarData.citationsByYear)}
          </div>
        </div>
      `;
    }
  });
  
  function generateBarChart(data) {
    // Sort data by year
    data = data.sort((a, b) => a.year - b.year);
    
    // Find the maximum citation count for scaling
    const maxCount = Math.max(...data.map(item => item.count));
    
    // Generate the HTML for bars
    let barsHtml = '';
    
    data.forEach(item => {
      const barHeight = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
      barsHtml += `
        <div class="chart-bar-container">
          <div class="chart-bar" style="height: ${barHeight}%" title="${item.count} citations in ${item.year}"></div>
          <div class="chart-year">${item.year}</div>
          <div class="chart-count">${item.count}</div>
        </div>
      `;
    });
    
    return barsHtml;
  }
</script>

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
  
  .citation-metrics {
    margin-top: 1em;
    padding: 15px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .citation-header {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 15px;
    color: #333;
  }
  
  .citation-count, .h-index {
    font-weight: bold;
    color: #2a76dd;
  }
  
  .stats-loading {
    color: #666;
    font-style: italic;
  }
  
  .citation-chart {
    margin-top: 15px;
  }
  
  .chart-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .chart-container {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 120px;
    padding-top: 10px;
  }
  
  .chart-bar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px;
    width: 30px;
  }
  
  .chart-bar {
    width: 20px;
    background-color: #4285f4;
    border-radius: 2px 2px 0 0;
    transition: height 0.3s ease;
  }
  
  .chart-year {
    margin-top: 5px;
    font-size: 12px;
    color: #666;
  }
  
  .chart-count {
    font-size: 12px;
    color: #333;
    font-weight: 500;
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
  
  .status-badge {
    display: inline-block;
    font-size: 0.65em;
    padding: 0.2em 0.4em;
    margin-left: 0.3em;
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
