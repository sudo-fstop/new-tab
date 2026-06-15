# new-tab

A new tab dashboard built with Vite + TypeScript. Features a dynamic wallpaper powered by Unsplash, inspiring person quotes, and a DVD-style screensaver.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime installed

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

## Other Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `bun run build`    | Production build (`tsc && vite build`) |
| `bun run preview`  | Preview the production build       |
| `bun run check`    | TypeScript type checking           |
| `bun run test`     | Run tests with Vitest              |

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
```

| Variable                     | Description                                                                 |
| ---------------------------- | --------------------------------------------------------------------------- |
| `VITE_UNSPLASH_ACCESS_KEY`   | Required for the wallpaper feature. Obtain from the [Unsplash Developer portal](https://unsplash.com/developers). |
