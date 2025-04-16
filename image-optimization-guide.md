# Image Optimization Guide for SEO

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