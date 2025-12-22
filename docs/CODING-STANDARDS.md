# Coding Standards

This document defines the coding conventions and standards for TSiJUKEBOX.

## 📋 Table of Contents

- [TypeScript](#typescript)
- [React](#react)
- [Styling](#styling)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Comments & Documentation](#comments--documentation)
- [Error Handling](#error-handling)
- [Accessibility](#accessibility)
- [Performance](#performance)

---

## TypeScript

### Types vs Interfaces

```typescript
// ✅ Use interfaces for objects/entities
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

// ✅ Use types for unions/intersections/primitives
type PlaybackState = 'playing' | 'paused' | 'stopped';
type TrackWithMetadata = Track & { metadata: Metadata };

// ✅ Use types for function signatures
type OnTrackChange = (track: Track) => void;
```

### Avoid `any`

```typescript
// ❌ Bad
const process = (data: any) => { ... };

// ✅ Good: Use unknown and type guards
const process = (data: unknown) => {
  if (isTrack(data)) {
    return data.title;
  }
  throw new Error('Invalid data');
};

// ✅ Good: Use generics
const process = <T extends Track>(data: T) => data.title;
```

### Type Assertions

```typescript
// ❌ Avoid: Type assertion bypasses type checking
const track = response as Track;

// ✅ Prefer: Runtime validation
const track = parseTrack(response); // Returns Track | null
if (!track) throw new Error('Invalid response');
```

### Enums vs Constants

```typescript
// ✅ Prefer: const objects (tree-shakeable)
const PlaybackState = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
} as const;

type PlaybackState = typeof PlaybackState[keyof typeof PlaybackState];

// ⚠️ Avoid: TypeScript enums (runtime overhead)
enum PlaybackState {
  PLAYING = 'playing',
  PAUSED = 'paused',
}
```

---

## React

### Functional Components

```typescript
// ✅ Good: Typed functional component
interface TrackCardProps {
  track: Track;
  onPlay: () => void;
  isPlaying?: boolean;
}

export function TrackCard({ track, onPlay, isPlaying = false }: TrackCardProps) {
  return (
    <div className="track-card">
      <h3>{track.title}</h3>
      <button onClick={onPlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

// ❌ Bad: Class components
class TrackCard extends React.Component { ... }
```

### Hooks

```typescript
// ✅ Good: Custom hooks start with "use"
export function useTrackProgress(trackId: string) {
  const [progress, setProgress] = useState(0);
  // ...
  return { progress, seek };
}

// ✅ Good: Extract complex logic to hooks
function Player() {
  const { volume, setVolume, mute, unmute } = useVolume();
  const { isPlaying, play, pause } = usePlaybackControls();
  // ...
}

// ❌ Bad: Logic in component
function Player() {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const actualVolume = isMuted ? 0 : volume;
  // 100+ lines of logic...
}
```

### Component Organization

```typescript
// ✅ Good: Clear structure
function TrackCard({ track, onPlay }: TrackCardProps) {
  // 1. Hooks
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  // 2. Derived state
  const formattedDuration = formatDuration(track.duration);

  // 3. Handlers
  const handleClick = () => {
    onPlay();
  };

  // 4. Early returns
  if (!track) return null;

  // 5. Render
  return (
    <Card onMouseEnter={() => setIsHovered(true)}>
      <CardTitle>{track.title}</CardTitle>
      <CardDescription>{formattedDuration}</CardDescription>
      <Button onClick={handleClick}>{t('play')}</Button>
    </Card>
  );
}
```

---

## Styling

### Tailwind CSS

```tsx
// ✅ Good: Semantic design tokens
<div className="bg-background text-foreground border-border">

// ❌ Bad: Hardcoded colors
<div className="bg-[#1a1a1a] text-[#ffffff]">

// ✅ Good: Responsive utilities
<div className="flex flex-col md:flex-row gap-4">

// ❌ Bad: Media query CSS
<div style={{ flexDirection: isMobile ? 'column' : 'row' }}>
```

### cn() Utility

```tsx
// ✅ Good: Use cn() for conditional classes
import { cn } from '@/lib/utils';

<button
  className={cn(
    'px-4 py-2 rounded-md',
    isActive && 'bg-primary text-primary-foreground',
    isDisabled && 'opacity-50 cursor-not-allowed'
  )}
>
  Click
</button>
```

### Component Variants

```tsx
// ✅ Good: Use cva for variants
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border border-input bg-transparent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

---

## File Organization

### Component Files

```
src/components/player/
├── index.ts              # Barrel export
├── Player.tsx            # Main component
├── PlayerControls.tsx    # Sub-component
├── PlayerProgress.tsx    # Sub-component
├── types.ts              # Component types
├── constants.ts          # Component constants
└── __tests__/
    └── Player.test.tsx   # Tests
```

### Hook Files

```
src/hooks/player/
├── index.ts              # Barrel export
├── usePlayer.ts          # Main hook
├── useVolume.ts          # Sub-hook
├── usePlaybackControls.ts
├── types.ts
└── __tests__/
    ├── usePlayer.test.ts
    └── useVolume.test.ts
```

### Barrel Exports

```typescript
// src/components/player/index.ts
export { Player } from './Player';
export { PlayerControls } from './PlayerControls';
export type { PlayerProps, PlayerControlsProps } from './types';
```

---

## Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `TrackCard.tsx` |
| Hook | camelCase + use | `useVolume.ts` |
| Utility | camelCase | `formatDuration.ts` |
| Type | PascalCase | `types.ts` |
| Test | `.test.ts` suffix | `useVolume.test.ts` |
| Integration | `.integration.test.ts` | `useBackup.integration.test.ts` |

### Variables & Functions

```typescript
// ✅ Good
const isPlaying = true;           // Boolean: is/has/should prefix
const trackList = [];             // Arrays: plural or -List suffix
const handleClick = () => {};     // Handlers: handle- prefix
const formatDuration = () => {};  // Pure functions: verb prefix

// ❌ Bad
const playing = true;             // Unclear if boolean
const track = [];                 // Unclear if array
const click = () => {};           // Unclear if handler
```

### Constants

```typescript
// ✅ Good: SCREAMING_SNAKE_CASE for true constants
const MAX_VOLUME = 1;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TRACK: Track = { ... };

// ✅ Good: Object constants
const PlayerConfig = {
  MAX_VOLUME: 1,
  MIN_VOLUME: 0,
  FADE_DURATION_MS: 500,
} as const;
```

---

## Comments & Documentation

### When to Comment

```typescript
// ✅ Good: Explain WHY, not WHAT
// Using a longer timeout because the API is slow to respond
const FETCH_TIMEOUT = 30000;

// ✅ Good: Document non-obvious behavior
// Returns null if track hasn't loaded yet (SSR-safe)
function useCurrentTrack() { ... }

// ❌ Bad: Obvious comments
// Set volume to 0.5
setVolume(0.5);
```

### JSDoc for Public APIs

```typescript
/**
 * Custom hook for managing audio volume.
 *
 * @example
 * const { volume, setVolume, mute } = useVolume();
 * setVolume(0.5);
 *
 * @returns Volume state and controls
 */
export function useVolume() {
  // ...
}
```

### WCAG Exception Comments

```tsx
{/* WCAG Exception: Decorative icon, text provides context */}
<MusicNote aria-hidden="true" />

{/* WCAG: 3.0:1 contrast for large text (36px) */}
<h1 className="text-4xl text-muted-foreground">Title</h1>
```

---

## Error Handling

### Try-Catch Patterns

```typescript
// ✅ Good: Specific error handling
async function fetchTrack(id: string): Promise<Track | null> {
  try {
    const response = await api.get(`/tracks/${id}`);
    return parseTrack(response.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }
    console.error('Failed to fetch track:', error);
    throw new FetchError('Could not load track', { cause: error });
  }
}

// ❌ Bad: Silent failures
async function fetchTrack(id: string) {
  try {
    return await api.get(`/tracks/${id}`);
  } catch {
    return null; // Swallows all errors
  }
}
```

### Error Boundaries

```tsx
// ✅ Good: Granular error boundaries
<ErrorBoundary fallback={<PlayerError />}>
  <Player />
</ErrorBoundary>

<ErrorBoundary fallback={<QueueError />}>
  <Queue />
</ErrorBoundary>
```

---

## Accessibility

### Semantic HTML

```tsx
// ✅ Good: Native elements
<button onClick={play}>Play</button>
<nav><ul><li><a href="/home">Home</a></li></ul></nav>

// ❌ Bad: Div soup
<div onClick={play}>Play</div>
<div><span onClick={navigate}>Home</span></div>
```

### ARIA Labels

```tsx
// ✅ Good: Descriptive labels
<button aria-label="Play current track">
  <PlayIcon />
</button>

<Slider
  aria-label="Volume control"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={volume}
/>
```

### Keyboard Navigation

```tsx
// ✅ Good: Support keyboard users
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Clickable
</div>
```

---

## Performance

### Memoization

```tsx
// ✅ Good: Memoize expensive computations
const filteredTracks = useMemo(
  () => tracks.filter((t) => t.title.includes(query)),
  [tracks, query]
);

// ✅ Good: Memoize callbacks
const handlePlay = useCallback(() => {
  player.play(track.id);
}, [track.id]);

// ❌ Bad: Over-memoization
const name = useMemo(() => user.name, [user.name]); // Unnecessary
```

### Code Splitting

```tsx
// ✅ Good: Lazy load heavy components
const Settings = lazy(() => import('./pages/Settings'));
const BrandGuidelines = lazy(() => import('./pages/BrandGuidelines'));

// ✅ Good: Split by route
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
```

### Image Optimization

```tsx
// ✅ Good: Responsive images
<img
  src={track.cover}
  srcSet={`${track.coverSmall} 300w, ${track.cover} 600w`}
  sizes="(max-width: 600px) 300px, 600px"
  loading="lazy"
  alt={`Album cover for ${track.album}`}
/>
```

---

## Enforcement

### Linting

ESLint enforces many of these standards:

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix where possible
```

### Pre-commit Hooks

Husky runs linting on commit:

```bash
# .husky/pre-commit
npm run lint
npm run test -- --changed
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

<p align="center">
  Consistent code is maintainable code.
</p>
