# 🚗 CarFuntastic

A browser-based 2D **draw-the-road physics puzzle game**. Draw a road, press Play, and watch physics decide whether your car makes it to the flag.

Built with **React + Vite + HTML5 Canvas + Matter.js**.

> **Status:** v1.1 implementation complete — 20 handcrafted levels, car garage / catalog selector, full drawing-to-physics pipeline, progress persistence, and automated headless level tests.

## Gameplay

1. Inspect the level: start point, finish flag, terrain, and hazards.
2. Draw one or more road strokes (levels limit how much road and how many strokes you can draw).
3. Press **Play** (`Space`) and the car drives automatically.
4. Reach the flag to earn up to 3 ★ and unlock the next level. If you fail, press **Retry** (`R`) to reset the car while keeping your roads so you can tweak one piece at a time.

## Features

- **20 handcrafted puzzle levels** spanning beginner fundamentals up to master-tier spatial challenges (needle leaps, pendulum alleys, multi-lift timing, parabolic dives, and the grand gauntlet)
- **Car Garage & Catalog**: Choose between 5 bespoke vehicles (Polestar 2 EV, Mustang Widebody, BMW M4 GT, BMW M6 GT3, and Altezza Widebody) with custom vector silhouettes and specs
- **Mouse, pen, and touch drawing** via Pointer Events with live preview, endpoint snapping onto ledges, and Ramer–Douglas–Peucker path simplification
- **Zero visual/physics drift** — the exact processed polyline rendered to Canvas is used to generate capsule-chain collision bodies (rotated segments + vertex circles so wheels never snag on joints)
- **Undo (`Ctrl+Z`), Clear, Retry (`R`), and Pause (`Esc`)** controls with an explicit state machine (`loading`, `ready`, `drawing`, `running`, `paused`, `won`, `failed`)
- **3-star rating system** & sequential level unlocking persisted in `localStorage` (`carfuntastic:progress:v1`, `carfuntastic:settings:v1`) with an automatic in-memory fallback
- **Web Audio synth cues** (draw ticks, commit, engine hum, win fanfare, fail tone) with a mute toggle and reduced-motion support

## Tech Stack

| Layer       | Tech                   |
| ----------- | ---------------------- |
| UI          | React 19, CSS          |
| Build tool  | Vite 8                 |
| Rendering   | HTML5 Canvas (2D)      |
| Physics     | Matter.js              |
| Persistence | `localStorage` adapter |
| Testing     | Vitest                 |

## Getting Started

```bash
git clone https://github.com/Bochikoyy/CarFuntastic.git
cd CarFuntastic
npm install
npm run dev
```

Other commands:

```bash
npm run build        # production bundle in dist/
npm run preview      # preview the production build locally
npm test             # run unit + headless 10-level playtest suite
npm run coverage     # run tests with V8 coverage
npm run lint         # ESLint check
npm run format:check # Prettier check
```

## Project Structure

```
src/
├── app/          # App shell, hash router, and root styles
├── components/   # Button, Modal, LevelTile, ProgressStars, Toggle
├── screens/      # Title, Level Select, Game, Settings, NotFound
├── game/         # Controller, state machine, physics, renderer, drawing, input, audio
├── levels/       # Level definitions (level01.js ... level10.js) + helpers
├── hooks/        # useGameController and useProgress hooks
├── services/     # Versioned progressStore and settingsStore
├── utils/        # Math, geometry, clamp, and level schema validator
└── styles/       # Design tokens, global, screen, and playfield stylesheets
tests/            # Unit, validation, persistence, and headless solvability tests
```

## Adding a Level

Levels are plain data objects in `src/levels/`, kept separate from engine code:

1. Copy an existing level file (e.g. `src/levels/level01.js`), adjust `number`, `id`, `spawn`, `goal`, `terrain`, `hazards`, `movingPlatforms`, and `constraints`.
2. Register the new level in `src/levels/index.js`.
3. `validateLevel` automatically checks coordinates, unique entity IDs, and budget limits on load.

## Roadmap

- [x] Project foundation (Vite + React + ESLint + Prettier + EditorConfig)
- [x] Canvas sandbox & responsive letterboxed camera
- [x] Vehicle physics (chassis, wheels, suspension axles, speed caps)
- [x] Drawing mechanic (Pointer Events, RDP simplification, capsule-chain bodies, undo/clear)
- [x] Game state machine and win/fail rules
- [x] Levels 1–10 designed, tuned, and verified by headless simulation
- [x] Levels 11–20 enhanced brain-teaser levels with moving hazards and synchronized platforms
- [x] 5-vehicle garage selector with custom silhouettes and handling specs
- [x] Progress, stars, audio cues, and settings persistence
- [x] QA test suite and production build

## License

MIT
