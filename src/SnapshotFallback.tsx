import type { CSSProperties, ReactNode } from 'react';
import { Overlay } from './Overlay';

interface SnapshotFallbackProps {
  html: string;
  overlay?: ReactNode;
  animationDuration: number;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
}

/**
 * Suspense fallback that renders the last captured DOM snapshot
 * with an overlay on top. Used in snapshot mode.
 */
export function SnapshotFallback({
  html,
  overlay,
  animationDuration,
  overlayClassName,
  overlayStyle,
  children,
}: SnapshotFallbackProps & { children?: ReactNode }) {
  if (!html) {
    // No snapshot yet (initial load) — render fallback children instead
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative' }} aria-busy="true">
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        inert
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      />
      <Overlay
        visible
        animationDuration={animationDuration}
        className={overlayClassName}
        style={overlayStyle}
      >
        {overlay}
      </Overlay>
    </div>
  );
}
