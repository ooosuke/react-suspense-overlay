import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDelayedPending } from './useDelayedPending';

describe('useDelayedPending', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false initially when pending is false', () => {
    const { result } = renderHook(() => useDelayedPending(false, 200));
    expect(result.current).toBe(false);
  });

  it('does not return true immediately when pending becomes true', () => {
    const { result } = renderHook(() => useDelayedPending(true, 200));
    expect(result.current).toBe(false);
  });

  it('returns true after delay when pending is true', () => {
    const { result } = renderHook(() => useDelayedPending(true, 200));

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(true);
  });

  it('returns false immediately when pending becomes false', () => {
    const { result, rerender } = renderHook(
      ({ pending }) => useDelayedPending(pending, 200),
      { initialProps: { pending: true } },
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe(true);

    rerender({ pending: false });
    expect(result.current).toBe(false);
  });

  it('does not show overlay if pending resolves before delay', () => {
    const { result, rerender } = renderHook(
      ({ pending }) => useDelayedPending(pending, 200),
      { initialProps: { pending: true } },
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(false);

    rerender({ pending: false });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe(false);
  });

  it('returns true immediately when delay is 0', () => {
    const { result } = renderHook(() => useDelayedPending(true, 0));
    expect(result.current).toBe(true);
  });
});
