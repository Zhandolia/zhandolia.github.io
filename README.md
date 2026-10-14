# Zhandos Brown — Portfolio

A three-panel portfolio at https://zhandolia.github.io/ with About, Work, and Projects. Built with plain HTML, CSS, and JavaScript; no packages or build step.

## Editing

- `index.html`: all personal content — three roles (BU Research, Fidelity, Spark!), three featured projects (Ring Dynamics, Zeta Engine, Kinetic Robotics Studio), seven more project cards, education, skills, and contact links. Résumé wording takes precedence.
- `panels.css`: panel geometry and theme. Colors are tokens on `:root`, with a dark palette under `prefers-color-scheme: dark`; each panel has its own accent dot.
- `panels.js`: panel navigation, direct hashes, legacy links, keyboard controls, and Dallas local time.
- `logos/ring-dynamics.svg`: copy of the Ring Dynamics mark (source lives in the ring-dynamics repo at `frontend/src/app/icon.svg`).
- `photos/`: four personal outdoor photographs (metadata-free WebP) shown in About.
- `previews/`: 1280×720 screenshots of public project demos; remaining projects use their logos.
- `fonts/`: locally hosted Space Grotesk, DM Sans, and IBM Plex Mono with their SIL Open Font Licenses.
- `Zhandos-Brown-resume.pdf`: downloadable résumé.

## Behavior

On desktop the open panel fills the width and the other two collapse into slim vertical tabs; on phones the tabs stack as rows above the open panel. Each open panel scrolls on its own. #about, #work, and #projects links and browser history work, and old #top, #experience, and #contact URLs still resolve. The page follows the system light/dark setting, and reduced-motion preferences disable panel transitions. Without JavaScript the three sections remain readable in document order.

## Local preview and deployment

Run `python -m http.server 8000` from this directory, then visit http://localhost:8000.

GitHub Pages deploys **main / (root)** automatically. `.nojekyll` preserves static serving. The `drivmi/` demo is independent and unchanged by the portfolio layout.

## Sources

Personal content, project assets, and photography are Zhandos’s portfolio content. Résumé content takes precedence for recent roles and education. Fonts come from Google Fonts and are served locally with their licenses. No analytics, tracking services, external font requests, or API keys are needed.
