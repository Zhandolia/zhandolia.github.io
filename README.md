# Zhandos Brown — Portfolio

A static three-panel portfolio at https://zhandolia.github.io/ with About, Work, and Projects. Built with plain HTML, CSS, and JavaScript; no packages or build step.

## Editing

- `index.html`: all personal content, nine roles, nine projects, and contact links.
- `panels.css`: approved accordion geometry with a custom midnight, periwinkle, and apricot visual identity.
- `panels.js`: panel navigation, direct hashes, legacy links, keyboard controls, and Dallas local time.
- `script.js`: original animated point-rendered spiral galaxy, with pause and reduced-motion support.
- `previews/`: screenshots of six public project demos; remaining projects use their existing branding.
- `fonts/`: locally hosted Space Grotesk, DM Sans, and IBM Plex Mono with their SIL Open Font Licenses.
- `Zhandos-Brown-resume.pdf`: downloadable résumé.

## Behavior

Desktop panels expand horizontally, with vertical labels on collapsed panels. On phones they stack vertically. All three panel controls remain visible, and each open panel scrolls independently. Browser history and #about, #work, and #projects links work; old #top, #experience, and #contact URLs remain supported. Inactive content is hidden and inert. Without JavaScript the three sections remain readable in document order.

The galaxy consists of 7,300 seeded particles in three spiral arms and a central bulge, with a static star field and subtle twinkling. Rendering is capped at 24 FPS. The canvas artwork uses no external images or graphics libraries. Animation pauses outside the active About panel, when the canvas leaves view, or in a background tab. Reduced-motion preferences disable automatic animation and panel transitions. A manual animation control remains available.

## Local preview and deployment

Run `python -m http.server 8000` from this directory, then visit http://localhost:8000.

GitHub Pages deploys **main / (root)** automatically. `.nojekyll` preserves static serving. The `drivmi/` demo is independent and unchanged by the portfolio layout.

## Sources

The three-panel interaction follows the user-approved reference at https://www.rajdeepgill.me/. Colors, typography, decorative details, experience styling, and project cards have their own visual identity. Personal content, project assets, and the procedural space illustration are Zhandos’s portfolio content. Résumé content takes precedence for recent roles and education. Fonts come from Google Fonts and are served locally with their licenses. No analytics, tracking services, external font requests, or API keys are needed.
