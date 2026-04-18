import { Suspense, useRef, type CSSProperties } from 'react';
import type { SuspenseOverlayProps } from './types';
import { Overlay } from './Overlay';
import { SnapshotFallback } from './SnapshotFallback';
import { useDelayedPending } from './useDelayedPending';
import { useSnapshot } from './useSnapshot';

/**
 * Two modes of operation:
 *
 * 1. **Pending mode** (`pending` prop provided):
 *    Uses React's useTransition to keep old UI alive.
 *    Overlay is shown on top of the live UI.
 *
 * 2. **Snapshot mode** (no `pending` prop):
 *    Captures DOM snapshots via MutationObserver.
 *    When children suspend, displays the last snapshot with overlay.
 *    Ideal for root-level usage where suspend can happen anywhere.
 */
export function SuspenseOverlay({
  children,
  overlay,
  fallback,
  pending,
  delay = 200,
  animationDuration = 150,
  overlayClassName,
  overlayStyle,
  wrapperClassName,
  wrapperStyle,
  disableInteraction = true,
}: SuspenseOverlayProps) {
  const isPendingMode = pending !== undefined;

  // Pending mode
  const showOverlay = useDelayedPending(pending ?? false, delay);

  // Snapshot mode
  const contentRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useSnapshot(contentRef);

  const baseWrapperStyle: CSSProperties = {
    position: 'relative',
    ...wrapperStyle,
  };

  if (isPendingMode) {
    const contentStyle: CSSProperties =
      showOverlay && disableInteraction
        ? { pointerEvents: 'none', userSelect: 'none' }
        : {};

    return (
      <div
        className={wrapperClassName}
        style={baseWrapperStyle}
        aria-busy={showOverlay}
      >
        <div style={contentStyle} inert={showOverlay ? true : undefined}>
          <Suspense fallback={fallback ?? null}>{children}</Suspense>
        </div>
        <Overlay
          visible={showOverlay}
          animationDuration={animationDuration}
          className={overlayClassName}
          style={overlayStyle}
        >
          {overlay}
        </Overlay>
      </div>
    );
  }

  // Snapshot mode
  const snapshotFallback = (
    <SnapshotFallback
      html={snapshotRef.current}
      overlay={overlay}
      animationDuration={animationDuration}
      overlayClassName={overlayClassName}
      overlayStyle={overlayStyle}
    >
      {fallback}
    </SnapshotFallback>
  );

  return (
    <div className={wrapperClassName} style={baseWrapperStyle}>
      <Suspense fallback={snapshotFallback}>
        <div ref={contentRef}>{children}</div>
      </Suspense>
    </div>
  );
}
