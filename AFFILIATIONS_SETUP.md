# Affiliations Component Setup Guide

This guide will help you set up and customize the affiliations display component on your academic website.

## Overview

The affiliations component is a sophisticated, interactive display that showcases your institutional affiliations with:
- Elegant card-based layout with hover effects
- Toggle functionality to show/hide affiliations
- Modal popups with detailed information
- Responsive design that works on all devices
- Accessibility features for screen readers
- Support for logos and fallback displays

## Files Created

### Core Component Files
- `_includes/affiliations.html` - Main component template
- `_sass/_affiliations.scss` - Styling and animations
- `_data/affiliations.yml` - Configuration data
- `_affiliations/*.md` - Individual affiliation descriptions

### Content Files
- `_affiliations/mit-sloan.md` - MIT Sloan description
- `_affiliations/igl-research-network.md` - IGL Research Network description
- `_affiliations/cornell-university.md` - Cornell University description
- `_affiliations/charles-river-associates.md` - Charles River Associates description

## Logo Setup

### Logo Requirements
- **Format**: PNG, JPG, or SVG
- **Size**: Maximum 200px width/height (will be scaled appropriately)
- **Quality**: High resolution for crisp display
- **Background**: Transparent preferred for PNG files

### Logo Locations
Place logos in the `images/affiliations/` directory with these filenames:
- `mit-sloan-logo.png` - MIT Sloan logo
- `igl-logo.png` - Innovation Growth Lab logo  
- `cornell-logo.png` - Cornell University logo
- `cra-logo.png` - Charles River Associates logo

### Obtaining Official Logos

#### MIT Sloan School of Management
- Visit: https://mitsloan.mit.edu/brand-guidelines/downloads
- Requires MIT Touchstone login for access
- Use the horizontal logo for best display
- Follow MIT brand guidelines for proper usage

#### Cornell University
- Visit: https://brand.cornell.edu/downloads/
- Download appropriate logo size
- Consider using the simplified version for web display
- Follow Cornell brand guidelines

#### Innovation Growth Lab
- Contact: https://www.innovationgrowthlab.org/
- Request logo usage permission
- Use official branding materials

#### Charles River Associates
- Contact their marketing department for logo usage
- Ensure compliance with their brand guidelines

### Logo Fallbacks
If logos are not available, the component automatically displays:
- University icon (Font Awesome)
- Institution short name
- Styled fallback appearance

## Customization Options

### Adding New Affiliations

1. **Update `_data/affiliations.yml`**:
```yaml
- id: "new-institution"
  name: "Full Institution Name"
  short_name: "Short Name"
  type: "current" # or "past"
  logo: "/images/affiliations/new-logo.png"
  logo_alt: "Institution Logo"
  website: "https://institution.edu/"
  description_file: "new-institution"
  order: 5
```

2. **Create description file `_affiliations/new-institution.md`**:
```markdown
---
title: "Full Institution Name"
short_name: "Short Name"
type: "current"
website: "https://institution.edu/"
---

## Institution Name

Your detailed description here...
```

### Styling Customization

The component uses CSS custom properties for easy customization:

```scss
:root {
  --primary-color: #0056b3;     // Main theme color
  --secondary-color: #28a745;   // Current affiliation accent
  --text-light: #6c757d;       // Past affiliation accent
}
```

### Responsive Behavior
- **Desktop**: 2-4 column grid layout
- **Tablet**: 1-2 column layout
- **Mobile**: Single column layout
- **Print**: Expanded view, no interactive elements

## Integration

### Homepage Integration
The component is already integrated into `_pages/about.md` right after your introduction.

### Research Page Integration  
Also integrated into `_pages/publications.md` in the research introduction section.

### Custom Integration
To add to other pages:
```liquid
{% include affiliations.html %}
```

## Accessibility Features

- **Keyboard Navigation**: Tab through elements, Enter/Space to activate
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators and modal focus trapping
- **Reduced Motion**: Respects user preference for reduced animations
- **High Contrast**: Supports high contrast display modes

## Performance Considerations

- **Lazy Loading**: Logo images load only when needed
- **Efficient Animations**: Hardware-accelerated CSS transitions
- **Minimal JavaScript**: Lightweight, vanilla JS implementation
- **Print Optimized**: Clean print styles without animations

## Browser Support

- **Modern Browsers**: Full functionality in Chrome, Firefox, Safari, Edge
- **Older Browsers**: Graceful degradation with fallbacks
- **Mobile Browsers**: Optimized touch interactions

## Troubleshooting

### Logos Not Displaying
1. Check file paths in `_data/affiliations.yml`
2. Ensure logos exist in `images/affiliations/` directory
3. Verify image file formats (PNG, JPG, SVG)
4. Check file permissions

### Styling Issues
1. Ensure `_sass/_affiliations.scss` is imported in `assets/css/main.scss`
2. Clear browser cache
3. Check for CSS conflicts with existing styles

### Modal Not Opening
1. Verify JavaScript is enabled
2. Check browser console for errors
3. Ensure Jekyll collections are properly configured

## Customization Ideas

### Color Themes
- Modify CSS custom properties for different color schemes
- Add institution-specific color coding
- Create dark mode variations

### Layout Options
- Adjust grid columns for different screen sizes
- Modify card spacing and sizing
- Create alternative list or timeline layouts

### Animation Effects
- Customize hover transitions
- Add entrance animations
- Modify modal transitions

### Content Enhancement
- Add date ranges for affiliations
- Include role or position information
- Add links to specific projects or publications

## Maintenance

### Regular Updates
- Update affiliation descriptions as needed
- Add new affiliations as they occur
- Refresh logos if institutions rebrand
- Review and update content annually

### Content Guidelines
- Keep descriptions concise but informative
- Focus on research relevance and impact
- Maintain consistent tone and style
- Include specific details that add value

This affiliations component provides a sophisticated and professional way to showcase your institutional connections while maintaining excellent user experience and accessibility standards.