# Academic Jekyll Website: Comprehensive Technical Documentation

## Overview

This is a sophisticated Jekyll-based academic personal website built on the **Academic Pages** template (forked from Minimal Mistakes Jekyll Theme). It serves as a comprehensive digital portfolio for **Vansh Gupta**, an MIT PhD researcher specializing in innovation economics. The website demonstrates advanced Jekyll architecture patterns, custom component development, and modern web technologies optimized for academic use cases.

## 🏗️ Core Architecture

### Jekyll Foundation
- **Static Site Generator**: Jekyll 3.8.7+ with GitHub Pages compatibility
- **Theme Base**: Minimal Mistakes Jekyll Theme (heavily customized)
- **Ruby Version**: Compatible with GitHub Pages Ruby environment
- **Build System**: GitHub Pages automatic deployment with custom Jekyll plugins

### Technology Stack
```yaml
Core Technologies:
  - Jekyll: Static site generation
  - Liquid: Template engine for dynamic content
  - SCSS/Sass: Advanced CSS preprocessing
  - JavaScript: Interactive components and maps
  - HTML5: Semantic markup with Schema.org integration
  - Ruby: Gem-based dependency management

External Integrations:
  - Google Analytics: User behavior tracking
  - Google Scholar: Academic citation integration
  - ORCID: Academic identity verification
  - GitHub: Code repository hosting and Pages deployment
  - Leaflet.js: Interactive geographic maps
  - Font Awesome: Icon library
  - MathJax: Mathematical notation rendering
```

## 📁 Directory Structure Deep Dive

### Core Jekyll Directories

#### `_config.yml` - Central Configuration Hub
The configuration file contains extensive customization:
- **Site metadata**: Title, description, author information
- **Social media integration**: Twitter, LinkedIn, GitHub, Google Scholar
- **SEO optimization**: Google Analytics, site verification
- **Plugin configuration**: Jekyll plugins and their settings
- **Collection definitions**: Publications, talks, teaching, portfolio, affiliations
- **Navigation structure**: Main menu and sidebar configuration

#### `_data/` - Structured Data Management
```
_data/
├── affiliations.yml      # Institutional affiliations with metadata
├── authors.yml          # Co-author information and links
├── navigation.yml       # Site navigation structure
├── ui-text.yml         # Internationalization and UI strings
└── comments/           # Static comment system data
```

#### `_includes/` - Modular Component System
Critical reusable components:
- **`author-profile.html`**: Dynamic sidebar with social links and bio
- **`affiliations.html`**: Interactive institutional affiliations display
- **`archive-single.html`**: Standardized content card layout
- **`seo.html`**: Advanced SEO meta tags and structured data
- **`head.html`**: Document head with analytics and optimization
- **`scripts.html`**: JavaScript loading and initialization

#### `_layouts/` - Template Hierarchy
- **`default.html`**: Base template with HTML structure
- **`single.html`**: Individual page/post layout with sidebar
- **`archive.html`**: Collection listing pages
- **`talk.html`**: Specialized layout for presentation content
- **`splash.html`**: Landing page without sidebar

#### `_sass/` - Advanced Styling Architecture
```
_sass/
├── _affiliations.scss   # Custom affiliations component styling
├── _variables.scss      # Global SCSS variables and theming
├── _base.scss          # Base styles and typography
├── _navigation.scss    # Navigation and menu styling
├── _sidebar.scss       # Author profile and sidebar styling
├── _page.scss          # Main content area styling
├── _archive.scss       # Collection listing styles
└── vendor/             # Third-party SCSS libraries
```

### Content Collections

#### `_publications/` - Academic Publications Management
Each publication is a Markdown file with YAML front matter:
```yaml
---
title: "Publication Title"
collection: publications
permalink: /publication/unique-slug
excerpt: 'Brief description of the work'
date: 2023-01-01
venue: 'Journal or Conference Name'
paperurl: 'https://doi.org/...'
citation: 'Full citation text'
authors: 'Author list'
type: "paper" # or "dataset", "assistance"
tags: [economics, innovation]
---
```

#### `_talks/` - Speaking Engagements and Presentations
```yaml
---
title: "Talk Title"
collection: talks
type: "Talk" # or "Conference paper", "Tutorial", "Invited talk"
permalink: /talks/unique-slug
venue: "Institution Name"
date: 2023-01-01
location: "City, State/Country"
---
```

#### `_teaching/` - Educational Activities
Teaching entries with course information, syllabi, and materials.

#### `_portfolio/` - Project Showcases
Portfolio items demonstrating research projects and technical work.

#### `_affiliations/` - Institutional Relationships
Dynamic affiliations system with logos, descriptions, and metadata.

### Static Assets

#### `assets/` - Compiled Assets
- **CSS**: Processed SCSS output
- **JS**: Minified JavaScript bundles
- **Images**: Optimized graphics and photos

#### `images/` - Media Resources
- Profile photos and headshots
- Institutional logos
- Publication figures and diagrams
- Background images and graphics

#### `files/` - Document Repository
- PDFs of papers and presentations
- CV and resume documents
- Supplementary materials
- Data files and datasets

## 🔧 Advanced Features Implementation

### 1. Interactive Research Network Map
Located in the about page (`_pages/about.md`):
```html
<div class="research-map-container">
  <h2>Research Network</h2>
  <div id="research-map" class="responsive-map"></div>
</div>
```
- Uses Leaflet.js for interactive mapping
- Displays research collaborations geographically
- Responsive design with mobile optimization

### 2. Dynamic Affiliations System
Custom component (`_includes/affiliations.html`) features:
- **Toggle functionality**: Show/hide affiliations section
- **Modal popups**: Detailed institutional information
- **Hover effects**: Interactive visual feedback
- **Accessibility**: Screen reader support and keyboard navigation
- **Responsive design**: Mobile-first approach

Technical implementation:
```scss
// _sass/_affiliations.scss
.affiliations-container {
  .affiliation-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
  }
}
```

### 3. Publication Schema Integration
Structured data for academic content:
```html
<!-- _includes/publication-schema.html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "name": "{{ page.title }}",
  "author": "{{ site.author.name }}",
  "datePublished": "{{ page.date | date: '%Y-%m-%d' }}"
}
</script>
```

### 4. Advanced Navigation System
Multi-level navigation with:
- **Main navigation**: Primary site sections
- **Breadcrumbs**: Hierarchical page location
- **Sidebar navigation**: Contextual links
- **Social media integration**: Direct profile links

### 5. SEO and Performance Optimization
- **Meta tags**: Comprehensive SEO metadata
- **Open Graph**: Social media sharing optimization
- **JSON-LD**: Structured data for search engines
- **Sitemap**: Automated XML sitemap generation
- **Canonical URLs**: Duplicate content prevention

## 🛠️ Development Tools and Utilities

### Markdown Generation Scripts
Located in `markdown_generator/`:
- **Jupyter notebooks**: Convert TSV data to Markdown files
- **Python scripts**: Batch processing of academic content
- **Data transformation**: Structured data to Jekyll collections

### TalkMap Generation
`talkmap.py` and `talkmap.ipynb`:
- **Geolocation**: Convert venue names to coordinates
- **Clustering**: Group nearby talks for better visualization
- **Interactive maps**: Leaflet.js integration
- **Data export**: JSON and HTML output for web integration

### Image Optimization
`image-optimization-guide.md` provides:
- **Compression techniques**: Reduce file sizes
- **Responsive images**: Multiple resolution support
- **Format recommendations**: WebP, JPEG, PNG usage
- **Performance optimization**: Lazy loading implementation

## 🎨 Styling and Design System

### SCSS Architecture
Modular SCSS organization following SMACSS methodology:
- **Base**: Typography, normalize, global styles
- **Layout**: Grid systems, page structure
- **Modules**: Reusable components
- **State**: Interactive states and variations
- **Theme**: Color schemes and customization

### Responsive Design
Mobile-first approach with breakpoints:
```scss
$small: 600px;
$medium: 768px;
$medium-wide: 900px;
$large: 1024px;
$x-large: 1280px;
```

### Color Palette and Typography
- **Primary colors**: Professional academic palette
- **Typography**: System font stack with web font fallbacks
- **Accessibility**: WCAG 2.1 AA compliance
- **Dark mode**: Automatic system preference detection

## 🔌 Plugin Ecosystem

### Jekyll Plugins
```ruby
# Gemfile
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-include-cache"
  gem "jemoji"
end
```

### Custom Liquid Filters
Site-specific filters for:
- **Date formatting**: Academic date standards
- **Citation formatting**: Multiple citation styles
- **URL manipulation**: Academic link processing
- **Content excerpts**: Smart truncation

## 📊 Analytics and Tracking

### Google Analytics Integration
- **Universal Analytics**: Comprehensive user tracking
- **Custom events**: Publication downloads, external links
- **Goal tracking**: Contact form submissions, CV downloads
- **Audience insights**: Academic visitor demographics

### Performance Monitoring
- **Page load times**: Core Web Vitals tracking
- **Resource optimization**: Asset loading analysis
- **Mobile performance**: Device-specific metrics

## 🔐 Security and Privacy

### Content Security Policy
Implemented headers for:
- **Script sources**: Trusted JavaScript origins
- **Style sources**: CSS and font loading
- **Image sources**: Media content security
- **Frame ancestors**: Embedding restrictions

### Privacy Considerations
- **GDPR compliance**: European privacy regulations
- **Cookie management**: Minimal tracking cookies
- **Data collection**: Transparent analytics policies

## 🚀 Deployment and Hosting

### GitHub Pages Configuration
Automated deployment pipeline:
1. **Source control**: Git-based version control
2. **Build process**: Jekyll compilation on GitHub servers
3. **CDN distribution**: Global content delivery network
4. **SSL/TLS**: Automatic HTTPS certificate management
5. **Custom domain**: DNS configuration for vansh-gupta.com

### Performance Optimization
- **Asset minification**: CSS and JavaScript compression
- **Image optimization**: Automatic format conversion
- **Caching strategies**: Browser and CDN caching
- **Lazy loading**: Progressive content loading

## 🧪 Testing and Quality Assurance

### Automated Testing
- **HTML validation**: W3C markup validation
- **Link checking**: Broken link detection
- **Accessibility testing**: WAVE and axe integration
- **Performance auditing**: Lighthouse CI integration

### Browser Compatibility
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Legacy support**: IE11 graceful degradation
- **Mobile browsers**: iOS Safari, Chrome Mobile
- **Progressive enhancement**: Core functionality without JavaScript

## 📝 Content Management Workflow

### Academic Content Pipeline
1. **Research publication**: Add to `_publications/`
2. **Speaking engagement**: Create in `_talks/`
3. **Teaching activity**: Document in `_teaching/`
4. **Media assets**: Optimize and store in `images/`
5. **Site deployment**: Automatic GitHub Pages build

### Content Standards
- **Markdown formatting**: Consistent style guide
- **YAML front matter**: Standardized metadata
- **File naming**: Semantic URL structure
- **Image optimization**: Performance-focused media

## 🤖 LLM Agent Integration Considerations

### Code Organization for AI Understanding
- **Modular architecture**: Clear separation of concerns
- **Semantic naming**: Descriptive file and variable names
- **Comprehensive comments**: Inline documentation
- **Consistent patterns**: Predictable code structure

### Data Accessibility
- **Structured data**: YAML and JSON formats
- **API endpoints**: Jekyll's built-in JSON feeds
- **Search optimization**: Content indexing strategies
- **Metadata richness**: Comprehensive front matter

### Customization Points
Key areas for LLM-driven modifications:
- **Content generation**: Automated publication entries
- **Style customization**: SCSS variable manipulation
- **Component enhancement**: Liquid template modification
- **Feature addition**: Plugin development and integration

## 🔄 Maintenance and Updates

### Regular Maintenance Tasks
- **Dependency updates**: Gem and plugin versions
- **Content auditing**: Link validation and accuracy
- **Performance monitoring**: Speed and accessibility checks
- **Security updates**: Vulnerability patching

### Version Control Strategy
- **Feature branches**: New functionality development
- **Release tags**: Version milestone tracking
- **Commit conventions**: Semantic commit messages
- **Change documentation**: Comprehensive changelog

## 📚 Additional Resources

### Documentation References
- **Jekyll Documentation**: https://jekyllrb.com/docs/
- **Minimal Mistakes Guide**: https://mmistakes.github.io/minimal-mistakes/
- **GitHub Pages Help**: https://docs.github.com/en/pages
- **Academic Pages Community**: https://github.com/academicpages/academicpages.github.io

### Development Tools
- **Local development**: `bundle exec jekyll serve`
- **Production build**: `JEKYLL_ENV=production bundle exec jekyll build`
- **Dependency management**: `bundle install` and `bundle update`
- **Asset compilation**: Automatic SCSS processing

This documentation provides a comprehensive technical overview for LLM agents to understand, modify, and extend this academic Jekyll website. The modular architecture, extensive customization options, and well-documented codebase make it an ideal platform for academic researchers seeking a professional web presence with advanced features and modern web standards compliance.
