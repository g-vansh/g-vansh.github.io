# vansh-gupta.com

Source for [www.vansh-gupta.com](https://www.vansh-gupta.com), the personal site of Vansh Gupta
(PhD student, MIT Sloan). It is plain HTML, one stylesheet and a little JavaScript. There is no
framework and no build step; GitHub Pages serves the files as they are (`.nojekyll`).

Because every file in this repository is published, keep notes, drafts and anything private
out of it. A `private/` folder is git-ignored for local notes.

## Layout

```
index.html        home page
research.html     papers
software.html     research software
cv.html           CV summary (the full CV is files/CV___Vansh_Gupta.pdf)
map.html          education and work drawn as a transit map
404.html          not-found page
assets/           stylesheet, fonts, favicon, JavaScript, three.js
files/            CV and paper PDFs
images/           portrait
publication/, publications/, talks/, affiliations/, portfolio/, cv/, teaching/, community-map/
                  redirects from old URLs (the CV PDF still links some of them)
llms.txt, robots.txt, sitemap.xml
```

`/STE/` is not in this repository. It is the documentation site of the
[STE package](https://github.com/g-vansh/STE), served from that repository's GitHub Pages.
Don't create an `STE/` folder here or it will hide the package documentation.

## Editing

Preview locally with `python3 -m http.server 8741` and open http://localhost:8741.

- To add a paper, copy an `article.paper` block in `research.html` (and in `index.html` if it
  should be on the home page). Update the JSON-LD at the top of the page and `llms.txt` too.
- To update the CV, replace `files/CV___Vansh_Gupta.pdf` and the summary in `cv.html`.
- Change the "Updated" stamp in the footer of each page when you make real changes, and the
  dates in `sitemap.xml`.
- The JavaScript is optional. Every page should still work with it turned off.
