import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { SuspenseOverlay } from './SuspenseOverlay';

describe('SuspenseOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders children normally when not pending', () => {
    render(
      <SuspenseOverlay overlay={<div>Loading...</div>}>
        <div>Content</div>
      </SuspenseOverlay>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('does not show overlay immediately when pending (default delay)', () => {
    render(
      <SuspenseOverlay pending overlay={<div>Loading...</div>}>
        <div>Content</div>
      </SuspenseOverlay>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('shows overlay after delay when pending', async () => {
    render(
      <SuspenseOverlay pending delay={200} overlay={<div>Loading...</div>}>
        <div>Content</div>
      </SuspenseOverlay>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('sets aria-busy on wrapper when overlay is visible', async () => {
    render(
      <SuspenseOverlay pending delay={0} overlay={<div>Loading...</div>}>
        <div>Content</div>
      </SuspenseOverlay>,
    );

    // delay=0 still requires useEffect to fire
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    const wrapper = screen.getByText('Content').closest('[aria-busy]');
    expect(wrapper).toHaveAttribute('aria-busy', 'true');
  });

  it('sets role="status" on overlay', async () => {
    render(
      <SuspenseOverlay pending delay={0} overlay={<div>Loading...</div>}>
        <div>Content</div>
      </SuspenseOverlay>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies custom className and style to overlay', async () => {
    render(
      <SuspenseOverlay
        pending
        delay={0}
        overlay={<div>Loading...</div>}
        overlayClassName="my-overlay"
        overlayStyle={{ backgroundColor: 'red' }}
      >
        <div>Content</div>
      </SuspenseOverlay>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    const overlay = screen.getByRole('status');
    expect(overlay).toHaveClass('my-overlay');
    expect(overlay.style.backgroundColor).toBe('red');
  });

  it('disables pointer events on content when pending', async () => {
    render(
      <SuspenseOverlay pending delay={0} overlay={<div>Loading...</div>}>
        <div>Content</div>
      </SuspenseOverlay>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    const contentWrapper = screen.getByText('Content').parentElement!;
    expect(contentWrapper.style.pointerEvents).toBe('none');
  });

  it('does not disable pointer events when disableInteraction is false', async () => {
    render(
      <SuspenseOverlay
        pending
        delay={0}
        overlay={<div>Loading...</div>}
        disableInteraction={false}
      >
        <div>Content</div>
      </SuspenseOverlay>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    const contentWrapper = screen.getByText('Content').parentElement!;
    expect(contentWrapper.style.pointerEvents).not.toBe('none');
  });

  it('renders Suspense fallback for initial load', () => {
    const LazyComponent = () => {
      throw new Promise(() => {});
    };

    render(
      <SuspenseOverlay fallback={<div>Initial loading...</div>}>
        <LazyComponent />
      </SuspenseOverlay>,
    );

    expect(screen.getByText('Initial loading...')).toBeInTheDocument();
  });
});
