# Sea of Ascension
<img width="1913" height="958" alt="Screenshot 2026-03-10 at 16 40 42" src="https://github.com/user-attachments/assets/947992ef-75f0-4d44-96c0-f58c3377da2d" />

## Features

- **Idle progression** - your ship sails and earns gold automatically
- **Ship upgrades** - upgrade sails (speed), engine (speed multiplier), nets (gold/meter), refinery (gold multiplier), and the Luck Bucket (spawn rate)
- **Collectibles** - click fish and gems that appear in the water for bonus rewards
- **Island encounters** - every once in a while you will encounter islands hosting different treasures, enemies or opportunities to further accelelrate your journey
- **Sea progression** - advance through 6 seas as you earn lifetime gold
- **Save system** - auto-saves locally, with import/export support

## Development

### Prerequisites

- Node.js 22+ (use `nvm use` to pick up the `.nvmrc`)

### Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests with Vitest |

### Project Structure

```
src/
├── actions/        # Game actions and reducer
├── constants/      # Game balance, sea definitions, upgrade configs
├── defaults/       # Initial state factories
├── economy/        # Economy stat derivation and modifiers
├── engine/         # Game loop, tick, persistence
├── events/         # Event system (spawn events)
├── helpers/        # Formatting utilities
├── hitTest/        # Point-in-rect, entity picking
├── sprites/        # Spritesheet drawing
├── types/          # TypeScript type definitions
└── ui/
    ├── canvas/     # Canvas renderer, entities, input handling
    └── tooltip/    # Tooltip component
public/             # Sprite assets and images
```

## Deployment

This is a static site. Run `npm run build` and serve the `dist/` directory.

For Vercel: connect the GitHub repo and it auto-detects Vite. Zero config needed.

## License

MIT
