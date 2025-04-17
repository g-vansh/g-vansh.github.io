#!/bin/bash

# This script checks for broken links on your website
# Requires: wget

echo "Checking for broken links..."

if [ -z "$1" ]; then
  SITE_URL="https://www.vansh-gupta.com"
else
  SITE_URL="$1"
fi

# Create a directory for the results
mkdir -p tmp/broken-links-check

# Run wget to check for broken links
wget \
  --spider \
  --recursive \
  --level=5 \
  --no-directories \
  --no-verbose \
  --output-file=tmp/broken-links-check/wget-log.txt \
  $SITE_URL

# Extract broken links from the log
grep -B 2 "broken link!" tmp/broken-links-check/wget-log.txt > tmp/broken-links-check/broken-links.txt

# Count the number of broken links
BROKEN_LINKS=$(grep -c "broken link!" tmp/broken-links-check/wget-log.txt)

echo "Found $BROKEN_LINKS broken links."
echo "Check tmp/broken-links-check/broken-links.txt for details."

if [ $BROKEN_LINKS -gt 0 ]; then
  echo "Here are the broken links:"
  cat tmp/broken-links-check/broken-links.txt
fi

exit 0 