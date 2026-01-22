import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LoadMoreButton } from '../LoadMoreButton';

describe('LoadMoreButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders load more button when hasMore is true', () => {
    render(
      <LoadMoreButton
        onClick={vi.fn()}
        isLoading={false}
        hasMore={true}
        matchesLoaded={20}
      />
    );
    expect(screen.getByText('Load More Matches')).toBeInTheDocument();
    expect(screen.getByText('Showing 20 matches')).toBeInTheDocument();
  });

  it('shows "All matches loaded" when hasMore is false', () => {
    render(
      <LoadMoreButton
        onClick={vi.fn()}
        isLoading={false}
        hasMore={false}
        matchesLoaded={45}
      />
    );
    expect(screen.getByText('All matches loaded (45 total)')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <LoadMoreButton
        onClick={vi.fn()}
        isLoading={true}
        hasMore={true}
        matchesLoaded={20}
      />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const onClick = vi.fn();
    render(
      <LoadMoreButton
        onClick={onClick}
        isLoading={false}
        hasMore={true}
        matchesLoaded={20}
      />
    );
    fireEvent.click(screen.getByText('Load More Matches'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('enforces 3-second debounce between clicks', () => {
    const onClick = vi.fn();
    render(
      <LoadMoreButton
        onClick={onClick}
        isLoading={false}
        hasMore={true}
        matchesLoaded={20}
      />
    );

    const button = screen.getByRole('button');

    // First click should work
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    // Second click immediately should be ignored (debounced)
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    // After 3 seconds, should work again
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('shows countdown when retryAfter is provided', () => {
    render(
      <LoadMoreButton
        onClick={vi.fn()}
        isLoading={false}
        hasMore={true}
        matchesLoaded={20}
        retryAfter={5}
      />
    );
    expect(screen.getByText('Please wait 5s')).toBeInTheDocument();

    // Advance timer and check countdown
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Please wait 4s')).toBeInTheDocument();
  });

  it('disables button during countdown', () => {
    const onClick = vi.fn();
    render(
      <LoadMoreButton
        onClick={onClick}
        isLoading={false}
        hasMore={true}
        matchesLoaded={20}
        retryAfter={5}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('button becomes enabled after countdown reaches 0', () => {
    const onClick = vi.fn();
    render(
      <LoadMoreButton
        onClick={onClick}
        isLoading={false}
        hasMore={true}
        matchesLoaded={20}
        retryAfter={2}
      />
    );

    // Initially shows countdown
    expect(screen.getByText('Please wait 2s')).toBeInTheDocument();

    // Advance through countdown (2 -> 1)
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Please wait 1s')).toBeInTheDocument();

    // Advance through countdown (1 -> 0)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should now show Load More
    expect(screen.getByText('Load More Matches')).toBeInTheDocument();

    // Click should work now
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
