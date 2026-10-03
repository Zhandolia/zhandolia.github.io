# Zhandos Brown — Portfolio

A fast, accessible, single-page portfolio built with plain HTML, CSS, and a small JavaScript enhancement. There are no packages to install or build steps.

## Edit

- `index.html`: introduction, projects, experience, education, skills, and contact details.
- `styles.css`: layout, typography, colors, and responsive styles.
- `book.css`: full-viewport cover, paper chapters, responsive book layout.
- `book.js`: page turns, chapter links, browser history, keyboard and swipe navigation.
- `script.js`: original procedural pixel-art planets, moons, and animated star field.
- `Zhandos-Brown-resume.pdf`: downloadable résumé; replace this file to update it.

The portfolio opens as a five-chapter book: cover, experience, projects, about, and contact. Turn pages with the bottom arrows, left/right keys, or a horizontal swipe; chapter links support direct URLs and browser history. Longer chapters scroll within the page, and all nine roles and nine projects remain available without disclosure controls. Inactive pages are hidden and inert for keyboard and assistive-technology navigation.

The full-page solar-system cover is original canvas artwork, with a ringed world, a blue world, a rust-colored planet, moons, drifting stars, and an occasional shooting star. It uses cached low-resolution planet textures, caps drawing at 24 FPS, pauses outside the cover or a foreground tab, and supports a manual pause button. Reduced-motion preferences disable automatic animation and page-turn effects. Without JavaScript, the site remains a readable document with ordinary anchor links. No external graphics libraries, models, services, or API keys are required.

## Local preview

Open `index.html` directly, or run `python -m http.server 8000` from this directory and visit `http://localhost:8000`.

## GitHub Pages

This repository serves the portfolio at https://zhandolia.github.io/.

Pages uses **Deploy from a branch**, **main**, **/ (root)**. Changes pushed to `main` publish automatically. `.nojekyll` tells Pages to serve these files as static assets.

## Content

Content is adapted from the supplied September 2026 résumé and the previous portfolio at https://zhandosbrown.vercel.app/. The latest résumé takes precedence for recent roles, education, and location. Earlier work from the previous website is retained. There are no analytics, trackers, cookies, remote fonts, or contact-form services.
