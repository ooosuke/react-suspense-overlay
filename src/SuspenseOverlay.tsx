import { Suspense, type CSSProperties } from 'react';
import type { SuspenseOverlayProps } from './types';
import { Overlay } from './Overlay';
import { useDelayedPending } from './useDelayedPending';

export function SuspenseOverlay({
  children,
  overlay,
  fallback,
  pending = false,
  delay = 200,
  animationDuration = 150,
  overlayClassName,
  overlayStyle,
  wrapperClassName,
  wrapperStyle,
  disableInteraction = true,
}: SuspenseOverlayProps) {
  const showOverlay = useDelayedPending(pending, delay);

  const baseWrapperStyle: CSSProperties = {
    position: 'relative',
    ...wrapperStyle,
  };

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
