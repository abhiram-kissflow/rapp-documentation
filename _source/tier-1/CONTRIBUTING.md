# Contributing Guide

This guide walks you through setting up your development environment and contributing to RAPP Design. Every step is explained — no prior knowledge assumed.

---

## Development Environment Setup

### Step 1: Install Node.js

RAPP requires **Node.js 20 or higher**. Download from [nodejs.org](https://nodejs.org).

Verify your installation:
```bash
node --version   # Should show v20.x.x or higher
```

### Step 2: Install pnpm

**What is pnpm?** It's a package manager (like npm) that installs your project's dependencies. pnpm is faster and uses less disk space because it stores packages in a global store and creates hard links instead of copies.

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

Verify:
```bash
pnpm --version   # Should show 9.15.0 or higher
```

> **Why not npm?** RAPP's `package.json` enforces pnpm. Running `npm install` will fail because the project uses pnpm workspace features.

### Step 3: Clone and Set Up

```bash
# Clone the repository
git clone https://github.com/OrangeScape/rapp-design.git
cd rapp-design

# Initialize the design system submodule
git submodule update --init --recursive

# Install all dependencies
pnpm install
```

### Step 4: Understanding Symlinks

**What is a symlink?** A symbolic link (symlink) is like a shortcut on your desktop — it points to files in another location. When you open the shortcut, it acts as if the files are right there.

RAPP uses the kf-design-system as a **git submodule** at the repo root. The `vite.config.ts` aliases (`@kfds-web`, `@kfds-mobile`) handle the linking automatically during development — **you don't need to create symlinks manually** for the current setup.

The old README mentions manual symlinks, but the Vite alias configuration now handles this:
```typescript
// vite.config.ts — these aliases replace manual symlinks
'@kfds-web': path.resolve(KF_DESIGN_SYSTEM_PATH, 'packages/web/src/components'),
'@kfds-mobile': path.resolve(KF_DESIGN_SYSTEM_PATH, 'packages/mobile/src/components'),
```

### Step 5: Environment Variables

Create a `.env` file in the project root:

```bash
# Required for AI features (optional for UI-only development)
VITE_OPENAI_API_KEY=sk-your-key-here
```

Without this key, the builder uses a static demo app (Leave Management) and the website's AI features won't work.

### Step 6: Start Development

```bash
pnpm dev
```

Open `https://localhost:3000` in your browser. You'll see the website app. Navigate to `https://localhost:3000/builder` for the builder.

> **HTTPS Note:** The dev server uses a self-signed SSL certificate (via `@vitejs/plugin-basic-ssl`). Your browser will warn you — click "Advanced" → "Proceed" to continue.

---

## Project Organization

### Where Things Live

| What | Where | When To Touch |
|------|-------|--------------|
| Website pages/routes | `website/web/src/routes/` | Adding website pages |
| Website components | `website/web/src/components/` | UI changes to website |
| Builder pages/routes | `builder/web/src/routes/` | Adding builder pages |
| Builder components | `builder/web/src/components/` | UI changes to builder |
| Shared utilities | `utils/shared-web/` | Cross-app features |
| Design system | `kf-design-system/` | Updating UI primitives |
| Vite configuration | `vite.config.ts` | Build/dev server changes |
| Multi-app routing | `utils/multi-app-plugin.ts` | Adding new apps |

### Component Organization

Each app organizes components by **feature domain**:

```
builder/web/src/components/
├── admin/           # Admin panel (account, users, roles)
├── auth/            # Login, signup, social auth
├── blueprint/       # Blueprint/spec editor (the main feature)
├── builder/         # Chat interface, preview panel
├── layout/          # App shell, navigation rail
└── ui/              # Generic UI components, theme
```

### Naming Conventions

- **Components:** PascalCase files (`ChatMessage.tsx`, `SpecPreview.tsx`)
- **Hooks:** camelCase with `use` prefix (`useVoicePipe.ts`, `useConversationFlow.ts`)
- **Stores:** camelCase with `Store` suffix (`appStore.ts`, `adminStore.ts`)
- **Types:** camelCase files in `types/` directory (`app.ts`, `spec.ts`)
- **Utilities:** camelCase files (`fileParsers.ts`, `bpmnTransformer.ts`)

---

## Adding New Components

### 1. Decide Which App

First, figure out where your component belongs:
- **Website app** → `website/web/src/components/`
- **Builder app** → `builder/web/src/components/`
- **Shared** → If used by both, consider `utils/shared-web/`

### 2. Create the Component

```tsx
// builder/web/src/components/blueprint/MyNewComponent.tsx

interface MyNewComponentProps {
  title: string
  onAction: () => void
}

export default function MyNewComponent({ title, onAction }: MyNewComponentProps) {
  return (
    <div className="p-4 bg-surface-50 rounded-lg">
      <h3 className="text-sm font-medium text-content-primary">{title}</h3>
      <button
        onClick={onAction}
        className="mt-2 px-3 py-1.5 bg-primary-500 text-white rounded-md text-sm"
      >
        Do Something
      </button>
    </div>
  )
}
```

**Patterns to follow:**
- Export as default (matches lazy loading pattern)
- Use TypeScript interfaces for props
- Use Tailwind CSS for styling
- Use design token classes (`text-content-primary`, `bg-surface-50`) over raw colors

### 3. Use Design System Components

When available, prefer kf-design-system components:

```tsx
import { Spinner, SPINNER_SIZE } from '@kfds-web/spinner'
import { Dialog } from '@kfds-web/dialog'
```

---

## Adding New Routes

### Builder App Routes

Routes are defined in `builder/web/src/routes/index.tsx`:

```tsx
// 1. Lazy-load your page component
const MyNewPage = lazy(() => import('./MyNewPage'))

// 2. Add to the router array
{
  path: '/my-new-page',
  element: (
    <LazyRoute>
      <MyNewPage />
    </LazyRoute>
  ),
},
```

The builder uses `basename: '/builder'`, so your route is accessed at `/builder/my-new-page`.

### Website App Routes

Website routes follow the same pattern in `website/web/src/routes/index.tsx`.

---

## Code Style

### TypeScript

- **Strict mode enabled** — All strict checks are on (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`)
- **Target:** ES2022 — Modern JavaScript features available
- **No `any`** — Use proper types. If you truly don't know the type, use `unknown` and narrow it

### ESLint

RAPP uses ESLint 9 for code quality:

```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix what's possible
```

### Tailwind CSS

- Use **Tailwind utility classes** directly in JSX
- Use **design tokens** from the theme (e.g., `text-content-primary` not `text-gray-900`)
- Use `clsx` or `tailwind-merge` for conditional classes:

```tsx
import { clsx } from 'clsx'

<div className={clsx('p-4 rounded-lg', isActive && 'bg-primary-50 ring-1 ring-primary-500')} />
```

---

## Testing

RAPP uses **Playwright** for end-to-end testing. Playwright automates a real browser to test your app the way a user would interact with it.

```bash
# Install browser binaries (first time only)
npx playwright install

# Run tests
npx playwright test

# Run with UI mode (visual debugging)
npx playwright test --ui
```

---

## Branch Conventions

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to Cloudflare Pages |
| `docs` | Documentation work |
| `feature/*` | New features |
| `fix/*` | Bug fixes |

### Workflow

1. Create a branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/my-feature
   ```

2. Make your changes and commit:
   ```bash
   git add <files>
   git commit -m "feat: add new blueprint component"
   ```

3. Push and create a PR:
   ```bash
   git push origin feature/my-feature
   ```

4. PR merges to `main` → auto-deploys

### Commit Message Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add voice toggle to conversation input
fix: prevent double-submit on chat input
style: use sentence case across admin UI
refactor: move spec components to blueprint/
docs: add architecture documentation
a11y: improve keyboard navigation in builder
```

---

## Keeping Submodules Updated

The kf-design-system submodule may receive updates. To pull the latest:

```bash
# From repo root
git submodule update --remote kf-design-system
```

This updates the submodule pointer to the latest commit on its `main` branch. Commit this change if you want to persist the update.

---

## Troubleshooting

### "Module not found: @kfds-web/..."

The git submodule isn't initialized:
```bash
git submodule update --init --recursive
```

### Multiple React instances error

Vite found multiple copies of React. The config handles this via `resolve.dedupe`, but if it still happens:
```bash
pnpm install   # Reinstall to fix resolution
```

### Port 3000 already in use

Another process is using port 3000. Kill it or change the port:
```bash
lsof -i :3000   # Find the process
kill <PID>       # Kill it
```

### HTTPS certificate warning

Expected — the dev server uses a self-signed certificate. Click through the browser warning.

### Voice features not working

Make sure the voice proxy is running:
```bash
cd openai-voice-proxy && pnpm dev
```
