import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroHeader } from '../HeroHeader';

describe('HeroHeader', () => {
  const defaultProps = {
    onSearch: vi.fn(),
    isLoading: false,
    hasResults: false,
    recentSearches: [],
    onClearRecent: vi.fn(),
  };

  it('renders expanded state when no results', () => {
    render(<HeroHeader {...defaultProps} />);

    expect(screen.getByText('League Stats')).toBeInTheDocument();
    expect(screen.getByText('Search Summoner Match History')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/summoner/i)).toBeInTheDocument();
  });

  it('renders collapsed state when has results', () => {
    render(<HeroHeader {...defaultProps} hasResults={true} />);

    expect(screen.getByText('League Stats')).toBeInTheDocument();
    // Subtitle should not be visible in collapsed state
    expect(screen.queryByText('Search Summoner Match History')).not.toBeInTheDocument();
  });

  it('shows recent searches in expanded state', () => {
    render(
      <HeroHeader
        {...defaultProps}
        recentSearches={['Player1#NA1', 'Player2#EUW']}
      />
    );

    expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    expect(screen.getByText('Player1#NA1')).toBeInTheDocument();
    expect(screen.getByText('Player2#EUW')).toBeInTheDocument();
  });

  it('hides recent searches in collapsed state', () => {
    render(
      <HeroHeader
        {...defaultProps}
        hasResults={true}
        recentSearches={['Player1#NA1']}
      />
    );

    expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument();
  });

  it('applies sticky positioning in collapsed state', () => {
    const { container } = render(<HeroHeader {...defaultProps} hasResults={true} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
  });

  it('applies hero-gradient class in expanded state', () => {
    const { container } = render(<HeroHeader {...defaultProps} hasResults={false} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('hero-gradient');
  });

  it('does not show recent searches when array is empty', () => {
    render(<HeroHeader {...defaultProps} recentSearches={[]} />);

    expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument();
  });
});
