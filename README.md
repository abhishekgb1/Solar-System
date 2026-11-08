# AstroVenture

Public website: https://abhishekgb1.github.io/Solar-System/

A responsive astronomy website with a redesigned homepage, searchable guides to eight planets, ten stars and ten galaxies, and an interactive 3D solar system.

## Features
- Searchable catalogs with keyboard-accessible object selection and previous/next controls.
- Corrected individual galaxy reference links.
- Interactive orbit and zoom, pause/resume motion, reset view and label controls.
- Mobile layouts, reduced-motion support and a WebGL fallback message.
- Self-contained CSS artwork and locally bundled Three.js dependencies.

Illustrations and simulation are stylized. Sizes, distances and speeds in the model are not to scale. Reference facts are preserved from the original project and should be treated as approximate; follow the reference links for more detail.

## Development
No installation or build step. Serve this directory with any static HTTP server. Pages: index.html, planets.html, stars.html, galaxies.html and solarsystem.html. Shared styles: site.css. Catalog data and interactions: catalog-data.js and catalog.js. Viewer logic: simulation.js.

Google Fonts is optional and has system fallbacks. The original screenshots, screen recording and PDF remain in the repository.

## Deployment
GitHub Pages publishes main / (root) automatically. Keep the account, repository and Pages enabled to retain this URL. It has no scheduled expiry; perpetual availability cannot be guaranteed.

## Dependencies
Three.js 0.128.0 and OrbitControls are bundled under vendor/. See vendor/THREE-LICENSE.txt for the MIT license.
