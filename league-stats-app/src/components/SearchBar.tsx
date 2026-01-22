import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (gameName: string, tagline: string) => void;
  isLoading?: boolean;
  size?: 'hero' | 'compact';
}

export const SearchBar = ({ onSearch, isLoading, size = 'hero' }: SearchBarProps) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = input.trim();
    const match = trimmed.match(/^(.+?)\s*#(.+)$/);

    if (!match) {
      setError('Please enter summoner name in format: Name #Tag (e.g., God of Wind #NA1)');
      return;
    }

    const gameName = match[1].trim();
    const tagline = match[2].trim().toUpperCase();

    onSearch(gameName, tagline);
  };

  const isHero = size === 'hero';

  return (
    <div className={isHero ? 'w-full max-w-xl mx-auto' : 'w-full'}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center ${isHero ? 'gap-3' : 'gap-2'}`}>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder="Search summoner (e.g., God of Wind #NA1)"
              className={`
                w-full bg-[#1e2328] border border-[#2d3748] text-white
                placeholder:text-[#6b7280] focus:outline-none focus:border-transparent
                transition-all
                ${isHero
                  ? 'px-6 py-4 text-lg rounded-lg focus:ring-4 focus:ring-blue-500/30 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'px-4 py-2 text-sm rounded-md focus:ring-2 focus:ring-blue-500'
                }
              `}
              disabled={isLoading}
            />
            {error && (
              <p className={`absolute left-0 text-red-400 text-sm ${isHero ? '-bottom-7' : '-bottom-5 text-xs'}`}>
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`
              bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
              disabled:cursor-not-allowed text-white font-medium
              transition-colors
              ${isHero
                ? 'px-8 py-4 text-lg rounded-lg'
                : 'px-4 py-2 text-sm rounded-md'
              }
            `}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};
