const STORAGE_KEY = 'league-stats-recent-searches';
const MAX_RECENT = 5;

export const getRecentSearches = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (gameName: string, tagline: string): void => {
  const search = `${gameName}#${tagline}`;
  const recent = getRecentSearches().filter(s => s !== search);
  recent.unshift(search);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
};

export const clearRecentSearches = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const parseRecentSearch = (search: string): { gameName: string; tagline: string } | null => {
  const match = search.match(/^(.+)#(.+)$/);
  if (!match) return null;
  return { gameName: match[1], tagline: match[2] };
};
