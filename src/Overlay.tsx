import type { CSSProperties, ReactNode } from 'react';

interface OverlayProps {
  visible: boolean;
  animationDuration: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Overlay({
  visible,
  animationDuration,
  className,
  style,
  children,
}: OverlayProps) {
  if (!visible) return null;

  const baseStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    animation: `react-suspense-overlay-fade-in ${animationDuration}ms ease-in`,
    ...style,
  };

  return (
    <div
      className={className}
      style={baseStyle}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {children}
    </div>
  );
}
