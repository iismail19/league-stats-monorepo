import { useEffect, useState } from 'react';
import { ChampionImage } from './ChampionImage';
import { getApiBaseUrl } from '../utils/api';

interface PlayerStats {
  matchesAnalyzed: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  topChampions: Array<{
    championName: string;
    games: number;
    wins: number;
    winRate: number;
    kills: number;
    deaths: number;
    assists: number;
  }>;
}

interface PlayerStatsPanelProps {
  puuid: string;
  numMatches?: number;
}

const API_BASE_URL = getApiBaseUrl();

export const PlayerStatsPanel = ({ puuid, numMatches = 20 }: PlayerStatsPanelProps) => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/player/${puuid}/stats?numMatches=${numMatches}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch player stats:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (puuid) {
      fetchStats();
    }
  }, [puuid, numMatches]);

  if (isLoading) {
    return (
      <div className="w-80 space-y-4">
        <div className="bg-[#1e2328] rounded-lg p-4 border border-[#2d3748]">
          <div className="animate-pulse">
            <div className="h-4 bg-[#2d3748] rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-[#2d3748] rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const avgKDA = stats.avgDeaths > 0 
    ? (stats.avgKills + stats.avgAssists) / stats.avgDeaths 
    : stats.avgKills + stats.avgAssists;

  return (
    <div className="w-80 space-y-4">
      {/* Overall Stats Card */}
      <div className="bg-[#1e2328] rounded-lg p-4 border border-[#2d3748]">
        <h3 className="text-sm font-semibold text-white mb-4">Last {stats.matchesAnalyzed} Games</h3>
        
        {/* Win Rate Circle */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#2d3748"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={stats.winRate >= 0.5 ? '#10b981' : '#ef4444'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.winRate)}`}
                className="transition-all"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {Math.round(stats.winRate * 100)}%
                </div>
                <div className="text-xs text-[#a0a0a0]">WR</div>
              </div>
            </div>
          </div>
        </div>

        {/* Win/Loss Stats */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{stats.wins}W</div>
            <div className="text-xs text-[#6b7280]">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-400">{stats.losses}L</div>
            <div className="text-xs text-[#6b7280]">Losses</div>
          </div>
        </div>

        {/* Average KDA */}
        <div className="border-t border-[#2d3748] pt-4">
          <div className="text-center mb-2">
            <div className="text-sm text-[#a0a0a0] mb-1">Average KDA</div>
            <div className="text-xl font-bold text-white">
              {stats.avgKills.toFixed(1)} / {stats.avgDeaths.toFixed(1)} / {stats.avgAssists.toFixed(1)}
            </div>
            <div className="text-sm text-[#6b7280] mt-1">
              {avgKDA.toFixed(2)}:1 KDA
            </div>
          </div>
        </div>
      </div>

      {/* Top Champions Card */}
      {stats.topChampions && stats.topChampions.length > 0 && (
        <div className="bg-[#1e2328] rounded-lg p-4 border border-[#2d3748]">
          <h3 className="text-sm font-semibold text-white mb-4">Most Played Champions</h3>
          <div className="space-y-3">
            {stats.topChampions.slice(0, 3).map((champ) => {
              const champKDA = champ.deaths > 0 
                ? (champ.kills + champ.assists) / champ.deaths 
                : champ.kills + champ.assists;
              
              return (
                <div
                  key={champ.championName}
                  className="flex items-center gap-3 p-2 rounded bg-[#0f1419] hover:bg-[#252a32] transition-colors"
                >
                  <ChampionImage championName={champ.championName} size="md" className="rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-white truncate">
                        {champ.championName}
                      </div>
                      <div className={`text-xs font-semibold ${
                        champ.winRate >= 0.6 ? 'text-green-400' : 
                        champ.winRate >= 0.5 ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>
                        {Math.round(champ.winRate * 100)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#6b7280]">
                      <span>{champ.games}G {champ.wins}W {champ.games - champ.wins}L</span>
                      <span>{champKDA.toFixed(2)} KDA</span>
                    </div>
                    {/* Win Rate Bar */}
                    <div className="mt-1.5 h-1 bg-[#2d3748] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          champ.winRate >= 0.6 ? 'bg-green-500' : 
                          champ.winRate >= 0.5 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${champ.winRate * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

