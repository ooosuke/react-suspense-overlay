# react-suspense-overlay

A small React component that displays a loading overlay on top of existing UI during Suspense transitions. Supports two modes: **pending mode** (with `useTransition`) and **snapshot mode** (automatic DOM snapshot on suspend). Encapsulates best practices: delayed display, fade animation, and accessibility.

## Install

```bash
npm install react-suspense-overlay
```

## Usage

### Pending Mode (with `useTransition`)

Pass a `pending` prop to keep the live UI while showing an overlay. Ideal for component-level transitions where you control the state update.

```tsx
import { useTransition, useState } from 'react';
import { SuspenseOverlay } from 'react-suspense-overlay';
import 'react-suspense-overlay/styles.css'; // optional default styles

function App() {
  const [tab, setTab] = useState('a');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button onClick={() => startTransition(() => setTab('b'))}>
        Tab B
      </button>

      <SuspenseOverlay
        pending={isPending}
        overlay={<Spinner />}
        overlayClassName="react-suspense-overlay"
        fallback={<Skeleton />}
      >
        <TabContent tab={tab} />
      </SuspenseOverlay>
    </>
  );
}
```

### Snapshot Mode (automatic)

Omit the `pending` prop. The component captures DOM snapshots via `MutationObserver` and displays the last snapshot with an overlay when children suspend. Ideal for root-level usage.

```tsx
import { SuspenseOverlay } from 'react-suspense-overlay';
import 'react-suspense-overlay/styles.css';

function Root() {
  return (
    <SuspenseOverlay
      overlay={<Spinner />}
      overlayClassName="react-suspense-overlay"
      fallback={<Skeleton />}
    >
      <App />
    </SuspenseOverlay>
  );
}
```

> **Note:** In snapshot mode, the preserved UI is static HTML — event handlers and form state are not retained. The snapshot is rendered with `inert` to prevent interaction.

### How it works

```
Pending mode:
  User clicks → startTransition(() => setState(...))
    → React keeps old UI (useTransition), isPending = true
    → SuspenseOverlay waits `delay` ms
    → Shows overlay on top of live UI
    → New UI ready → isPending = false → Overlay removed

Snapshot mode:
  Children render → MutationObserver captures DOM snapshot
    → Children suspend → Suspense fallback activates
    → SnapshotFallback renders last captured HTML + overlay
    → Children resolve → Normal render resumes
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content that may suspend |
| `overlay` | `ReactNode` | — | Overlay content (e.g. spinner) |
| `fallback` | `ReactNode` | `null` | Fallback for initial load (no snapshot available yet) |
| `pending` | `boolean` | — | Pending state. When provided → pending mode. When omitted → snapshot mode |
| `delay` | `number` | `200` | ms to wait before showing overlay (pending mode only) |
| `animationDuration` | `number` | `150` | Fade-in animation duration in ms |
| `overlayClassName` | `string` | — | CSS class for overlay |
| `overlayStyle` | `CSSProperties` | — | Inline styles for overlay |
| `wrapperClassName` | `string` | — | CSS class for wrapper |
| `wrapperStyle` | `CSSProperties` | — | Inline styles for wrapper |
| `disableInteraction` | `boolean` | `true` | Disable pointer events while pending (pending mode only) |

## Exports

```ts
// Component
import { SuspenseOverlay } from 'react-suspense-overlay';

// Hooks (use independently if needed)
import { useDelayedPending } from 'react-suspense-overlay';
import { useSnapshot } from 'react-suspense-overlay';

// Default styles (optional)
import 'react-suspense-overlay/styles.css';
```

### `useDelayedPending(pending: boolean, delay: number): boolean`

A standalone hook that delays a boolean signal. Returns `true` only after `pending` has been `true` for at least `delay` ms. Resets immediately when `pending` becomes `false`.

### `useSnapshot(contentRef: RefObject<HTMLDivElement | null>): MutableRefObject<string>`

A hook that captures DOM snapshots via `MutationObserver`. Returns a ref containing the latest `innerHTML` string. Only updates when the DOM actually changes.

## Features

- **Two modes** — Pending mode (live UI + overlay) and snapshot mode (static DOM + overlay)
- **Delayed display** — No flash for fast transitions (configurable, default 200ms)
- **Fade animation** — Smooth fade-in via CSS animation
- **Accessibility** — `aria-busy`, `aria-live="polite"`, `role="status"`, `inert` attribute
- **Interaction blocking** — `pointer-events: none` + `inert` during loading
- **Efficient snapshots** — `MutationObserver` + `requestAnimationFrame` debounce: multiple DOM mutations within a frame result in only one `innerHTML` read
- **Zero dependencies** — Only React 18+ as peer dependency
- **Tree-shakeable** — ESM + CJS dual output

## Demo

**[Live Demo](https://ooosuke.github.io/react-suspense-overlay/)**

Or run locally:

```bash
cd demo
npm install
npm run dev
```

Open http://localhost:5173 to see both **Pending Mode** and **Snapshot Mode** in action.

## License

MIT
