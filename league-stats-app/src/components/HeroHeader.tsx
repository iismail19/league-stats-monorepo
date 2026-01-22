import { SearchBar } from './SearchBar';
import { RecentSearches } from './RecentSearches';

interface HeroHeaderProps {
  onSearch: (gameName: string, tagline: string) => void;
  isLoading: boolean;
  hasResults: boolean;
  recentSearches: string[];
  onClearRecent: () => void;
}

export const HeroHeader = ({
  onSearch,
  isLoading,
  hasResults,
  recentSearches,
  onClearRecent
}: HeroHeaderProps) => {
  return (
    <header
      className={`
        transition-all duration-500 ease-out
        ${hasResults
          ? 'py-4 sticky top-0 z-50 bg-[#1a1f2e] border-b border-[#2d3748] shadow-lg'
          : 'py-20 min-h-[50vh] flex items-center justify-center hero-gradient hero-pattern'
        }
      `}
    >
      <div
        className={`
          max-w-7xl mx-auto px-6 w-full
          ${hasResults ? 'flex items-center justify-between' : 'text-center'}
        `}
      >
        {/* Logo/Title */}
        <div className={hasResults ? '' : 'mb-8'}>
          <h1 className={`font-bold text-white ${hasResults ? 'text-xl' : 'text-4xl mb-2'}`}>
            League Stats
          </h1>
          {!hasResults && (
            <p className="text-[#a0a0a0] text-lg">
              Search Summoner Match History
            </p>
          )}
        </div>

        {/* Search */}
        <div className={hasResults ? 'flex-1 max-w-md mx-8' : 'max-w-xl mx-auto'}>
          <SearchBar
            onSearch={onSearch}
            isLoading={isLoading}
            size={hasResults ? 'compact' : 'hero'}
          />
          {!hasResults && recentSearches.length > 0 && (
            <RecentSearches
              searches={recentSearches}
              onSelect={onSearch}
              onClear={onClearRecent}
            />
          )}
        </div>

        {/* Spacer for collapsed state */}
        {hasResults && <div className="w-20" />}
      </div>
    </header>
  );
};
