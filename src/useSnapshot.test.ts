import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSnapshot } from './useSnapshot';
import { useRef } from 'react';

describe('useSnapshot', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('captures innerHTML on mount', () => {
    const div = document.createElement('div');
    div.innerHTML = '<p>Hello</p>';

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      return useSnapshot(ref);
    });

    expect(result.current.current).toBe('<p>Hello</p>');
  });

  it('returns empty string when ref is null', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useSnapshot(ref);
    });

    expect(result.current.current).toBe('');
  });
});
