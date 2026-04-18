import { useEffect, useRef } from 'react';

/**
 * Captures a snapshot of the DOM content via MutationObserver.
 * Only updates the snapshot when the DOM actually changes, avoiding
 * unnecessary innerHTML reads on every render.
 */
export function useSnapshot(contentRef: React.RefObject<HTMLDivElement | null>) {
  const snapshotRef = useRef('');

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Initial capture
    snapshotRef.current = el.innerHTML;

    const observer = new MutationObserver(() => {
      snapshotRef.current = el.innerHTML;
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [contentRef]);

  return snapshotRef;
}
