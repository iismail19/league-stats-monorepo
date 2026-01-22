import { describe, it, expect, beforeEach } from 'vitest';
import {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  parseRecentSearch,
} from '../recentSearches';

describe('recentSearches', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getRecentSearches', () => {
    it('returns empty array when no searches stored', () => {
      expect(getRecentSearches()).toEqual([]);
    });

    it('returns stored searches', () => {
      localStorage.setItem(
        'league-stats-recent-searches',
        JSON.stringify(['Player1#NA1', 'Player2#EUW'])
      );
      expect(getRecentSearches()).toEqual(['Player1#NA1', 'Player2#EUW']);
    });

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('league-stats-recent-searches', 'invalid json');
      expect(getRecentSearches()).toEqual([]);
    });
  });

  describe('addRecentSearch', () => {
    it('adds new search to front of list', () => {
      addRecentSearch('Player1', 'NA1');
      expect(getRecentSearches()).toEqual(['Player1#NA1']);
    });

    it('moves existing search to front (no duplicates)', () => {
      addRecentSearch('Player1', 'NA1');
      addRecentSearch('Player2', 'EUW');
      addRecentSearch('Player1', 'NA1'); // Re-add
      expect(getRecentSearches()).toEqual(['Player1#NA1', 'Player2#EUW']);
    });

    it('limits to 5 recent searches', () => {
      for (let i = 1; i <= 7; i++) {
        addRecentSearch(`Player${i}`, 'NA1');
      }
      const searches = getRecentSearches();
      expect(searches).toHaveLength(5);
      expect(searches[0]).toBe('Player7#NA1');
      expect(searches[4]).toBe('Player3#NA1');
    });
  });

  describe('clearRecentSearches', () => {
    it('removes all stored searches', () => {
      addRecentSearch('Player1', 'NA1');
      clearRecentSearches();
      expect(getRecentSearches()).toEqual([]);
    });
  });

  describe('parseRecentSearch', () => {
    it('parses valid search string', () => {
      expect(parseRecentSearch('Player1#NA1')).toEqual({
        gameName: 'Player1',
        tagline: 'NA1',
      });
    });

    it('handles names with spaces', () => {
      expect(parseRecentSearch('God of Wind#NA1')).toEqual({
        gameName: 'God of Wind',
        tagline: 'NA1',
      });
    });

    it('returns null for invalid format', () => {
      expect(parseRecentSearch('InvalidSearch')).toBeNull();
      expect(parseRecentSearch('')).toBeNull();
    });
  });
});
