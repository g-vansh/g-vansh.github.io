---
title: "Image Optimization Guide"
permalink: /docs/image-optimization/
---

# Image Optimization Guide for g-vansh.github.io

This guide explains how to optimize images for SEO and performance on this website.

## Using the Optimized Image Include

1. Instead of using standard Markdown or HTML image tags, use the optimized include:

```liquid
{% include image.html 
    src="/images/your-image.jpg" 
    alt="Descriptive alt text with keywords" 
    caption="Optional caption text" 
    width="800" 
    height="600" 
%}
```

## Image Preparation Best Practices

1. **Compress images** before uploading:
   - Use tools like [TinyPNG](https://tinypng.com/) or [ImageOptim](https://imageoptim.com/)
   - Aim for file sizes under 200KB for most images

2. **Use descriptive filenames**:
   - Example: `mit-innovation-research-lab.jpg` instead of `IMG_0123.jpg`
   - Include relevant keywords separated by hyphens

3. **Proper dimensions**:
   - Profile photos: 500x500px (square)
   - Header images: 1200x630px (optimal for social sharing)
   - Blog post images: 800-1200px width

## SEO Best Practices

1. **Always include descriptive ALT text**:
   - Include relevant keywords naturally
   - Accurately describe what's in the image
   - For profile photos: `alt="Vansh Gupta, MIT PhD Researcher specializing in innovation economics"`

2. **Consider image context**:
   - Place images near relevant text
   - Use captions when appropriate

## Technical Implementation

The website now has:
- Lazy loading for all images
- Responsive image sizing
- Schema.org structured data for key images
- Proper alt attributes

To check if your images are properly optimized, use tools like:
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Google's Rich Results Test](https://search.google.com/test/rich-results) 