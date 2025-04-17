#!/bin/bash

# This script optimizes all images in the images directory
# Requires: ImageMagick, optipng, jpegoptim

echo "Starting image optimization..."

# Create directories for optimized images
mkdir -p images/optimized

# Optimize PNG files
find images -type f -name "*.png" -not -path "*/optimized/*" | while read -r file; do
  echo "Optimizing PNG: $file"
  base_filename=$(basename "$file")
  convert "$file" -strip -resize "1200x1200>" "images/optimized/$base_filename"
  optipng -quiet -o5 "images/optimized/$base_filename"
done

# Optimize JPG files
find images -type f \( -name "*.jpg" -o -name "*.jpeg" \) -not -path "*/optimized/*" | while read -r file; do
  echo "Optimizing JPG: $file"
  base_filename=$(basename "$file")
  convert "$file" -strip -resize "1200x1200>" -quality 85 "images/optimized/$base_filename"
  jpegoptim --strip-all --max=85 "images/optimized/$base_filename"
done

# Create WebP versions
find images/optimized -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r file; do
  echo "Creating WebP version: $file"
  base_filename=$(basename "$file" | sed 's/\.[^.]*$//')
  cwebp -quiet -q 85 "$file" -o "images/optimized/${base_filename}.webp"
done

# Create responsive images
find images/optimized -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r file; do
  base_filename=$(basename "$file" | sed 's/\.[^.]*$//')
  ext="${file##*.}"
  
  # Create 480px width version
  echo "Creating 480px version: $file"
  convert "$file" -strip -resize "480x" "images/optimized/${base_filename}-480.$ext"
  
  # Create 768px width version
  echo "Creating 768px version: $file"
  convert "$file" -strip -resize "768x" "images/optimized/${base_filename}-768.$ext"
  
  # Create 1200px width version
  echo "Creating 1200px version: $file"
  convert "$file" -strip -resize "1200x" "images/optimized/${base_filename}-1200.$ext"
done

echo "Image optimization complete!" 