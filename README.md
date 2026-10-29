# 🚗 CarFuntastic

A browser-based 2D **draw-the-road physics puzzle game**. Draw a road, press Play, and watch physics decide whether your car makes it to the flag.

Built with **React + Vite + HTML5 Canvas + Matter.js**.

> **Status:** Planning / early development. The full design and technical specification lives in the Game Design & Technical Blueprint (v1.0).

## Gameplay

1. Inspect the level: start point, finish flag, terrain, and hazards.
2. Draw one or more road strokes (some levels limit how much road you can draw).
3. Press **Play** and the car drives automatically.
4. Reach the flag to unlock the next level. If you fail, retry and tweak your drawing.

## Features (v1.0 scope)

- 10 handcrafted puzzle levels
- Mouse, pen, and touch drawing via Pointer Events
- Undo, Clear, Retry, and Pause controls
- Drawing budgets, spike hazards, and a moving platform
- Level select with progress saved in `localStorage`
- Fully client-side, no server or accounts required

## Tech Stack

| Layer | Tech |
| --- | --- |
| UI | React, CSS |
| Build tool | Vite |
| Rendering | HTML5 Canvas |
| Physics | Matter.js |
| Persistence | localStorage |

## Getting Started

```bash
git clone https://github.com/<your-username>/CarFuntastic.git
cd CarFuntastic
npm install
npm run dev
```

Other commands:

```bash
npm run build     # production build
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
├── app/          # App shell and routing
├── components/   # Reusable UI components
├── screens/      # Title, Level Select, Game, Settings
├── game/         # Controller, physics, renderer, drawing, input
├── levels/       # Level data (level01.js ... level10.js)
├── hooks/        # React hooks
├── services/     # Progress and settings stores
├── utils/        # Math, geometry, validation helpers
└── styles/       # CSS tokens and stylesheets
tests/            # Unit and integration tests
```

## Adding a Level

Levels are plain data objects in `src/levels/`, kept separate from engine code. Copy an existing level file, adjust the spawn, goal, terrain, hazards, and constraints, then register it in `src/levels/index.js`.

## Roadmap

- [ ] Project foundation (Vite + React)
- [ ] Canvas sandbox
- [ ] Vehicle physics
- [ ] Drawing mechanic
- [ ] Game state and rules
- [ ] Levels 1-10
- [ ] Progress and polish
- [ ] QA and release

## License

TBD
