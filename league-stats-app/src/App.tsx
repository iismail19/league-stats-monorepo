import { useState, useEffect } from 'react';
import { HeroHeader } from './components/HeroHeader';
import { MatchCard } from './components/MatchCard';
import { PlayerStatsPanel } from './components/PlayerStatsPanel';
import { RankCard } from './components/RankCard';
import { LoadMoreButton } from './components/LoadMoreButton';
import { searchSummoner, getSummonerByPuuid } from './utils/api';
import type { MatchListResponse, SummonerData } from './utils/api';
import {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
} from './utils/recentSearches';
import { initializeDataDragonVersion } from './utils/dataDragon';

function App() {
  const [matches, setMatches] = useState<MatchListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedName, setSearchedName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('NA1');
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);

  // Pagination state
  const [hasMoreMatches, setHasMoreMatches] = useState(true);
  const [nextStartIndex, setNextStartIndex] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | undefined>();

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Initialize Data Dragon version fetch on app startup
  useEffect(() => {
    initializeDataDragonVersion();
  }, []);

  const handleSearch = async (gameName: string, taglineInput: string) => {
    setIsLoading(true);
    setError(null);
    setSearchedName(`${gameName} #${taglineInput}`);
    setTagline(taglineInput.toUpperCase());
    setSummonerData(null);

    // Reset pagination state for new search
    setHasMoreMatches(true);
    setNextStartIndex(20);
    setRetryAfter(undefined);

    try {
      const data = await searchSummoner(gameName, taglineInput, 0, 20);
      setMatches(data);

      // Update pagination state from response
      setHasMoreMatches(data.hasMore ?? data.matchDataList?.length === 20);
      setNextStartIndex(data.nextStartIndex ?? 20);
      setRetryAfter(data.retryAfter);

      // Save to recent searches
      addRecentSearch(gameName, taglineInput);
      setRecentSearches(getRecentSearches());

      // Fetch summoner data for rank card
      if (data.summonerId) {
        setSummonerData({ id: data.summonerId, puuid: data.puuid, name: '', summonerLevel: 0 });
      } else if (data.puuid) {
        getSummonerByPuuid(data.puuid, taglineInput)
          .then((summoner) => {
            if (summoner) {
              setSummonerData(summoner);
            }
          })
          .catch(() => {
            // Silently handle non-critical errors
          });
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Search error:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch match data');
      setMatches(null);
      setSummonerData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!matches?.puuid || isLoadingMore) return;

    // Parse the searched name to get gameName and tagline
    const searchParts = searchedName.split(' #');
    if (searchParts.length !== 2) return;

    const gameName = searchParts[0];
    const tag = searchParts[1];

    setIsLoadingMore(true);
    try {
      const data = await searchSummoner(gameName, tag, nextStartIndex, 20);

      // Append new matches to existing list
      setMatches(prev => prev ? {
        ...prev,
        matchDataList: [...prev.matchDataList, ...data.matchDataList],
        failedMatches: [...(prev.failedMatches || []), ...(data.failedMatches || [])],
      } : null);

      // Update pagination state
      setHasMoreMatches(data.hasMore ?? data.matchDataList?.length === 20);
      setNextStartIndex(data.nextStartIndex ?? nextStartIndex + 20);
      setRetryAfter(data.retryAfter);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to load more matches:', err);
      }
      // Don't set main error - silently fail
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const hasResults = matches !== null && matches.matchDataList.length > 0;

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Hero Header */}
      <HeroHeader
        onSearch={handleSearch}
        isLoading={isLoading}
        hasResults={hasResults}
        recentSearches={recentSearches}
        onClearRecent={handleClearRecent}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-[#a0a0a0]">Loading match data...</p>
          </div>
        )}

        {/* Results */}
        {matches && !isLoading && (
          <div className="flex gap-6">
            {/* Left Sidebar */}
            <aside className="flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                {matches?.puuid && (
                  <RankCard
                    encryptedSummonerId={summonerData?.id || matches.summonerId || 'placeholder'}
                    tagline={tagline}
                    puuid={matches.puuid}
                  />
                )}
                <PlayerStatsPanel puuid={matches.puuid} />
              </div>
            </aside>

            {/* Main Content - Match History */}
            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Match History for {searchedName}
                </h2>
                <p className="text-[#a0a0a0]">
                  {matches.matchDataList?.length || 0} matches found
                </p>
              </div>
              {matches.matchDataList && matches.matchDataList.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {matches.matchDataList
                      .map((match) => (
                        <MatchCard
                          key={match.metadata.matchId}
                          match={match}
                          playerPuuid={matches.puuid}
                        />
                      ))
                      .filter(Boolean)}
                  </div>
                  {/* Show message if no cards rendered */}
                  {matches.matchDataList.length > 0 &&
                   matches.matchDataList.filter((match) => {
                     const player = match.info.participants.find((p: any) => p.puuid === matches.puuid);
                     return !!player;
                   }).length === 0 && (
                    <div className="text-center py-8 text-yellow-400">
                      <p>Matches found but player data not available. Check console for details.</p>
                    </div>
                  )}

                  {/* Load More Button */}
                  <LoadMoreButton
                    onClick={handleLoadMore}
                    isLoading={isLoadingMore}
                    hasMore={hasMoreMatches}
                    matchesLoaded={matches.matchDataList.length}
                    retryAfter={retryAfter}
                  />

                  {/* Debug info - remove in production */}
                  {import.meta.env.DEV && (
                    <details className="mt-6 p-4 bg-[#1a1f2e] rounded-lg text-xs">
                      <summary className="cursor-pointer text-[#a0a0a0] mb-2">Debug Info</summary>
                      <pre className="text-[#6b7280] overflow-auto">
                        {JSON.stringify({
                          puuid: matches.puuid,
                          matchCount: matches.matchDataList.length,
                          hasMore: hasMoreMatches,
                          nextStartIndex: nextStartIndex,
                          firstMatchParticipants: matches.matchDataList[0]?.info?.participants?.map((p: any) => p.puuid).slice(0, 3)
                        }, null, 2)}
                      </pre>
                    </details>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#a0a0a0]">No matches found for this summoner.</p>
                </div>
              )}
              {matches.failedMatches && matches.failedMatches.length > 0 && (
                <div className="mt-4 text-sm text-yellow-400">
                  Note: {matches.failedMatches.length} match(es) failed to load
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State - only show when no results and not loading */}
        {!matches && !isLoading && !error && !hasResults && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚔️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Search for a Summoner</h2>
            <p className="text-[#a0a0a0]">
              Enter a summoner name and tagline to view their match history
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
