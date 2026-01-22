import { parseRecentSearch } from '../utils/recentSearches';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (gameName: string, tagline: string) => void;
  onClear: () => void;
}

export const RecentSearches = ({ searches, onSelect, onClear }: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <div className="mt-4 text-center">
      <div className="text-sm text-[#a0a0a0] mb-2">Recent Searches</div>
      <div className="flex flex-wrap justify-center gap-2">
        {searches.map((search) => (
          <button
            key={search}
            onClick={() => {
              const parsed = parseRecentSearch(search);
              if (parsed) onSelect(parsed.gameName, parsed.tagline);
            }}
            className="px-3 py-1 bg-[#1e2328] hover:bg-[#2a2f38] rounded-full text-sm
                       text-[#a0a0a0] hover:text-white transition-colors"
          >
            {search}
          </button>
        ))}
      </div>
      <button
        onClick={onClear}
        className="mt-2 text-xs text-[#6b7280] hover:text-[#a0a0a0] transition-colors"
      >
        Clear history
      </button>
    </div>
  );
};
