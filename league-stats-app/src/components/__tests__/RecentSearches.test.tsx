import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecentSearches } from '../RecentSearches';

describe('RecentSearches', () => {
  it('renders nothing when searches array is empty', () => {
    const { container } = render(
      <RecentSearches searches={[]} onSelect={vi.fn()} onClear={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders search pills for each search', () => {
    render(
      <RecentSearches
        searches={['Player1#NA1', 'Player2#EUW']}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );

    expect(screen.getByText('Player1#NA1')).toBeInTheDocument();
    expect(screen.getByText('Player2#EUW')).toBeInTheDocument();
  });

  it('calls onSelect with parsed values when pill is clicked', () => {
    const onSelect = vi.fn();
    render(
      <RecentSearches
        searches={['Player1#NA1']}
        onSelect={onSelect}
        onClear={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Player1#NA1'));
    expect(onSelect).toHaveBeenCalledWith('Player1', 'NA1');
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();
    render(
      <RecentSearches
        searches={['Player1#NA1']}
        onSelect={vi.fn()}
        onClear={onClear}
      />
    );

    fireEvent.click(screen.getByText('Clear history'));
    expect(onClear).toHaveBeenCalled();
  });

  it('renders Recent Searches label', () => {
    render(
      <RecentSearches
        searches={['Player1#NA1']}
        onSelect={vi.fn()}
        onClear={vi.fn()}
      />
    );

    expect(screen.getByText('Recent Searches')).toBeInTheDocument();
  });
});
