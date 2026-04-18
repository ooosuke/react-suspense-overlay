import type { CSSProperties, ReactNode } from 'react';

export interface SuspenseOverlayProps {
  /** Content that may suspend */
  children: ReactNode;
  /** Overlay content shown during pending state (e.g. spinner) */
  overlay?: ReactNode;
  /** Fallback for the initial Suspense load (before any UI exists) */
  fallback?: ReactNode;
  /** External pending state from useTransition */
  pending?: boolean;
  /**
   * Delay in ms before showing the overlay.
   * Prevents flash for fast transitions.
   * @default 200
   */
  delay?: number;
  /**
   * Duration in ms for the fade-in/fade-out animation.
   * @default 150
   */
  animationDuration?: number;
  /** CSS class for the overlay container */
  overlayClassName?: string;
  /** Inline styles for the overlay container */
  overlayStyle?: CSSProperties;
  /** CSS class for the wrapper element */
  wrapperClassName?: string;
  /** Inline styles for the wrapper element */
  wrapperStyle?: CSSProperties;
  /**
   * Prevents pointer events on the content while pending.
   * @default true
   */
  disableInteraction?: boolean;
}
