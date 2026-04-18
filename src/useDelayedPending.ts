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
    if (pending) {
      if (delay <= 0) {
        setDelayedPending(true);
        return;
      }
      timerRef.current = setTimeout(() => {
        setDelayedPending(true);
      }, delay);
    } else {
      setDelayedPending(false);
    }

    return () => {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [pending, delay]);

  return delayedPending;
}
