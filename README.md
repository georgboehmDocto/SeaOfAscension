# Sea of Ascension

A pixel-art idle browser game where you sail through increasingly treacherous seas, collecting gold and gems to upgrade your ship.

## Play

Visit [sea-of-ascension.com](https://sea-of-ascension.com) to play in your browser.

## Features

- **Idle progression** - your ship sails and earns gold automatically
- **Ship upgrades** - upgrade sails (speed), engine (speed multiplier), nets (gold/meter), refinery (gold multiplier), and the Luck Bucket (spawn rate)
- **Collectibles** - click fish and gems that appear in the water for bonus rewards
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
