import { useEffect, useRef, useState } from 'react';

/**
 * Delays a boolean `pending` signal by the specified duration.
 * - When pending becomes true, waits `delay` ms before returning true.
 * - When pending becomes false, immediately returns false.
 * This prevents overlay flash for fast transitions.
 */
export function useDelayedPending(pending: boolean, delay: number): boolean {
  const [delayedPending, setDelayedPending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (delay <= 0 || !pending) return;

    timerRef.current = setTimeout(() => {
      setDelayedPending(true);
    }, delay);

    return () => {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      setDelayedPending(false);
    };
  }, [pending, delay]);

  if (delay <= 0) return pending;
  return delayedPending;
}
