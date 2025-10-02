<h1 align="center">
  <span style="display:inline-block;padding:0.45em 0.9em;border-radius:16px;background:linear-gradient(135deg,#ff8c00,#ff4f70,#7b5cff);color:#ffffff;font-size:2.1rem;letter-spacing:0.05em;">Project IDX • Neon Base</span>
</h1>

<p align="center" style="color:#ff8c00;font-weight:600;">
  3D neon-orange landing page powered by WebGL + GSAP with a modular component stack.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/three.js-orbit%20controls-ff8c00?logo=three.js&logoColor=white&labelColor=000&style=for-the-badge" alt="three.js badge" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-14b25f?logo=greensock&logoColor=ffffff&style=for-the-badge" alt="gsap badge" />
  <img src="https://img.shields.io/badge/Responsive%20Design-Ready-008cff?style=for-the-badge&labelColor=000" alt="responsive badge" />
  <img src="https://img.shields.io/badge/Dockerized-yes-d84bff?logo=docker&logoColor=ffffff&labelColor=000&style=for-the-badge" alt="docker badge" />
</p>

---

## ⚡ Quick Overview
- Neon cyberpunk aesthetic: primary color `#ff8c00`, Orbitron typeface, cosmic lighting layers.
- Futuristic preloader with progress bar, scanning lines, and animated dots to sell the "system boot" vibe.
- WebGL scene with a glowing Earth, starfield particles, neon wireframe grid, plus parallax via OrbitControls.
- Component loader (`data-component-src`) keeps hero, whois, service, and skill sections lightweight and reusable.
- Adaptive performance tiers (low/medium/high) that react to hardware concurrency, save-data, and reduced motion prefs.

## 🌌 Standout Features
- **Interactive preloader** – `initPreloader()` updates user messaging and dismisses itself once the 3D scene is ready.
- **Digital HUD** – live camera coordinates and timestamp rendered from `assets/components/digital-numbers.html`.
- **Whois panel** – personal profile block with neon styling in `assets/components/whois.html` and `assets/styles/whois.css`.
- **Dedicated animations** – GSAP modules per section (`assets/js/features/`) keep logic tidy and testable.
- **Flexible navigation** – `registerNavigationHandlers()` wires smooth scrolling, sticky header behavior, and mobile toggles.

## 🧱 Folder Structure
```text
/
├── index.html                 # Entry point that loads components and boots the Three.js scene
├── Dockerfile / nginx.conf    # Nginx:alpine setup for static delivery
├── assets/
│   ├── components/            # Header, hero, whois, sections split into partials
│   ├── imgs/                  # Logo, favicon, profile imagery
│   ├── styles/                # base.css, sections.css, responsive.css, whois.css
│   └── js/
│       ├── core/              # componentLoader, scene, performance config, hologram tooling
│       └── features/          # preloader, navigation, skills/services/profile animations
```

## 🛠️ Run It
- **Local preview**: clone the repo and serve `index.html` with Live Server (VS Code) or any static HTTP server.
- **Dockerized**:
  ```bash
  docker build -t project-idx-base .
  docker run --rm -p 8080:80 project-idx-base
  ```
  Visit `http://localhost:8080` once the container is up.

## 🎨 Customize Colors & Effects
- Tweak the global palette inside `assets/styles/base.css:3` (`--primary-color`, `--background-color`).
- Adjust performance behavior by editing `tierOverrides` in `assets/js/core/performanceConfig.js`.
- Toggle hologram and particle features per tier in the same config (`hologram.enabled`, particle counts, etc.).
- Add a new section by creating an HTML partial in `assets/components/sections/` and referencing it within `index.html`.

## 🔎 Deployment Notes
- The Earth texture currently loads from the `threejs.org` CDN; swap to a local asset for offline or locked-down environments.
- Preserve the `prefers-reduced-motion` logic to keep accessibility intact for motion-sensitive users.
- `componentLoader` relies on `fetch`, so serve over HTTP/HTTPS rather than hitting `file://` in browsers that block cross-origin fetches.

---

<p align="center" style="color:#ff8c00;">
  Ready to launch Project IDX into production? Tune the palette, refresh content, and ship it! 🚀
</p>
