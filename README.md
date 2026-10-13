# Zhandos Brown — Portfolio

A static three-panel portfolio at https://zhandolia.github.io/ with About, Work, and Projects. Built with plain HTML, CSS, and JavaScript; no packages or build step.

## Editing

- `index.html`: all personal content, three roles (BU Research, Fidelity, and Spark), nine projects, and contact links.
- `panels.css`: approved accordion geometry with a custom midnight, periwinkle, and apricot visual identity.
- `panels.js`: panel navigation, direct hashes, legacy links, keyboard controls, and Dallas local time.
- `photos/`: four personal outdoor photographs, exported as metadata-free WebP images for the responsive About collage.
- `previews/`: screenshots of six public project demos; remaining projects use their existing branding.
- `fonts/`: locally hosted Space Grotesk, DM Sans, and IBM Plex Mono with their SIL Open Font Licenses.
- `Zhandos-Brown-resume.pdf`: downloadable résumé.

## Behavior

Desktop panels expand horizontally, with vertical labels on collapsed panels. On phones they stack vertically. All three panel controls remain visible, and each open panel scrolls independently. Browser history and #about, #work, and #projects links work; old #top, #experience, and #contact URLs remain supported. Inactive content is hidden and inert. Without JavaScript the three sections remain readable in document order.

The About collage uses a three-column mosaic on desktop and a two-column mosaic on mobile, with the mountain photograph kept vertical. Reduced-motion preferences disable panel transitions.

## Local preview and deployment

Run `python -m http.server 8000` from this directory, then visit http://localhost:8000.

GitHub Pages deploys **main / (root)** automatically. `.nojekyll` preserves static serving. The `drivmi/` demo is independent and unchanged by the portfolio layout.

## Sources

The three-panel interaction follows the user-approved reference at https://www.rajdeepgill.me/. Colors, typography, decorative details, experience styling, and project cards have their own visual identity. Personal content, project assets, and photography are Zhandos’s portfolio content. Résumé content takes precedence for recent roles and education. Fonts come from Google Fonts and are served locally with their licenses. No analytics, tracking services, external font requests, or API keys are needed.
