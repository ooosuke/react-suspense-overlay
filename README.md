# react-suspense-overlay

A small React component that displays a loading overlay on top of existing UI during Suspense transitions. Encapsulates best practices: delayed display, fade animation, and accessibility.

## Install

```bash
npm install react-suspense-overlay
```

## Usage

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

### How it works

```
User clicks → startTransition(() => setState(...))
                    ↓
          React keeps old UI (useTransition)
          isPending = true
                    ↓
          SuspenseOverlay waits `delay` ms
                    ↓
          Shows overlay on top of old UI
          (pointer-events disabled, aria-busy, fade-in)
                    ↓
          New UI ready → isPending = false
          Overlay removed
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content that may suspend |
| `overlay` | `ReactNode` | — | Overlay content (e.g. spinner) |
| `fallback` | `ReactNode` | `null` | Initial Suspense fallback |
| `pending` | `boolean` | `false` | Pending state from `useTransition` |
| `delay` | `number` | `200` | ms to wait before showing overlay |
| `animationDuration` | `number` | `150` | Fade-in animation duration in ms |
| `overlayClassName` | `string` | — | CSS class for overlay |
| `overlayStyle` | `CSSProperties` | — | Inline styles for overlay |
| `wrapperClassName` | `string` | — | CSS class for wrapper |
| `wrapperStyle` | `CSSProperties` | — | Inline styles for wrapper |
| `disableInteraction` | `boolean` | `true` | Disable pointer events while pending |

## Exports

```ts
// Component
import { SuspenseOverlay } from 'react-suspense-overlay';

// Hook (use independently if needed)
import { useDelayedPending } from 'react-suspense-overlay';

// Default styles (optional)
import 'react-suspense-overlay/styles.css';
```

### `useDelayedPending(pending: boolean, delay: number): boolean`

A standalone hook that delays a boolean signal. Returns `true` only after `pending` has been `true` for at least `delay` ms. Resets immediately when `pending` becomes `false`.

## Features

- **Delayed display** — No flash for fast transitions (configurable, default 200ms)
- **Fade animation** — Smooth fade-in via CSS animation
- **Accessibility** — `aria-busy`, `aria-live="polite"`, `role="status"`, `inert` attribute
- **Interaction blocking** — `pointer-events: none` + `inert` during loading
- **Zero dependencies** — Only React 18+ as peer dependency
- **Tree-shakeable** — ESM + CJS dual output

## License

MIT
