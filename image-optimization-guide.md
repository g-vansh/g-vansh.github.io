# Image Optimization Guide for SEO

Images play a critical role in SEO and user experience. This guide will help you optimize your images for better search rankings and faster page loads.

## Image Optimization Best Practices

1. **Use descriptive, keyword-rich filenames**
   - Bad: `IMG_12345.jpg`
   - Good: `vansh-gupta-mit-economics-research.jpg`

2. **Always add alt text**
   - Alt text should be descriptive and include relevant keywords
   - Format: `<img src="image.jpg" alt="Descriptive text about the image including keywords">`
   - Example: `<img src="research-graph.jpg" alt="Graph showing correlation between proximity and innovation in economics research">`

3. **Optimize image dimensions**
   - Resize images to the exact dimensions needed for your website
   - Don't use CSS to resize large images as this doesn't reduce file size

4. **Compress images before uploading**
   - Use the image optimization script in the `scripts` folder
   - Run: `bash scripts/optimize-images.sh`
   - This will create optimized versions in the `images/optimized` folder

5. **Use responsive images**
   - The optimization script creates multiple sizes (480px, 768px, 1200px)
   - Use the responsive image syntax:

   ```html
   <img srcset="image-480.jpg 480w, image-768.jpg 768w, image-1200.jpg 1200w"
        sizes="(max-width: 600px) 480px, (max-width: 1200px) 768px, 1200px"
        src="image.jpg" alt="Description of image">
   ```

6. **Use modern image formats**
   - The optimization script creates WebP versions
   - Use the picture element to provide WebP with fallback:

   ```html
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="Description of image">
   </picture>
   ```

7. **Add structured data for images**
   - For important images, add ImageObject schema
   - This is especially important for research diagrams and graphs

## How to use the optimization script

1. Place your original images in the `images` folder
2. Run `bash scripts/optimize-images.sh`
3. Use the optimized images from `images/optimized` in your content
4. Add proper alt text to all images

## Checking your image optimization

Use Google's PageSpeed Insights to verify your images are properly optimized:
https://pagespeed.web.dev/

## Adding alt text in Markdown

```markdown
![Descriptive alt text for the image](path/to/image.jpg)
```

## Adding alt text in HTML

```html
<img src="path/to/image.jpg" alt="Descriptive alt text for the image">
```

## Image Optimization Checklist

For all images on your website:

1. **Compress images** before uploading
   - Use tools like [TinyPNG](https://tinypng.com/) or [ImageOptim](https://imageoptim.com/)
   - Aim for file sizes under 200KB for most images

2. **Use descriptive filenames**
   - Example: `mit-innovation-research-lab.jpg` instead of `IMG_0123.jpg`
   - Include relevant keywords in the filename separated by hyphens

3. **Add proper ALT text to all images**
   - In Markdown: `![Description of the image](image.jpg "Optional title")`
   - In HTML: `<img src="image.jpg" alt="Description of the image" title="Optional title">`
   - Include your target keywords naturally, but prioritize describing the image accurately

4. **Use responsive images**
   - Ensure images resize appropriately on mobile devices
   - Consider using the `srcset` attribute for different screen sizes

5. **Add structured data for important images**
   - Use the ImageObject schema for significant images: 
     ```html
     <script type="application/ld+json">
     {
       "@context": "https://schema.org",
       "@type": "ImageObject",
       "contentUrl": "https://g-vansh.github.io/images/profile.png",
       "name": "Vansh Gupta profile photo",
       "description": "Profile photo of Vansh Gupta, MIT innovation economics researcher"
     }
     </script>
     ```

6. **Lazy-load images** for better page speed
   - Add `loading="lazy"` attribute to image tags
   - Or use a JavaScript library for lazy loading

## Examples of Good ALT Text

- Profile photo: `alt="Vansh Gupta, MIT PhD Researcher specializing in innovation economics"`
- Research diagram: `alt="Diagram showing relationship between proximity and innovation rates in urban settings"`
- Project screenshot: `alt="Screenshot of GitHub Sponsors Analysis dashboard showing funding patterns"`

## Image Dimensions Best Practices

- **Profile Photos**: 500x500px minimum, square format
- **Header Images**: 1200x630px (optimal for social sharing)
- **Blog Post Images**: 800-1200px width, consistent height
- **Thumbnails**: 250-400px width

Remember that properly optimized images improve page load speed, which is a ranking factor for SEO. 