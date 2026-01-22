import { useEffect, useState } from 'react';
import { getRankImageUrl, getRankDisplayName } from '../utils/rankImages';
import { getApiBaseUrl } from '../utils/api';

interface RankEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

interface RankCardProps {
  encryptedSummonerId: string;
  tagline?: string;
  puuid?: string; // Optional: use puuid endpoint if available (better API key access)
}

const API_BASE_URL = getApiBaseUrl();

const getTierColor = (tier: string): string => {
  const tierMap: Record<string, string> = {
    'IRON': 'text-gray-400',
    'BRONZE': 'text-orange-600',
    'SILVER': 'text-gray-300',
    'GOLD': 'text-yellow-400',
    'PLATINUM': 'text-cyan-400',
    'EMERALD': 'text-green-400',
    'DIAMOND': 'text-blue-400',
    'MASTER': 'text-purple-400',
    'GRANDMASTER': 'text-red-400',
    'CHALLENGER': 'text-yellow-300',
  };
  return tierMap[tier] || 'text-white';
};

const getTierBgColor = (tier: string): string => {
  const tierMap: Record<string, string> = {
    'IRON': 'bg-gray-600/20',
    'BRONZE': 'bg-orange-600/20',
    'SILVER': 'bg-gray-400/20',
    'GOLD': 'bg-yellow-400/20',
    'PLATINUM': 'bg-cyan-400/20',
    'EMERALD': 'bg-green-400/20',
    'DIAMOND': 'bg-blue-400/20',
    'MASTER': 'bg-purple-400/20',
    'GRANDMASTER': 'bg-red-400/20',
    'CHALLENGER': 'bg-yellow-300/20',
  };
  return tierMap[tier] || 'bg-white/20';
};

export const RankCard = ({ encryptedSummonerId, tagline = 'NA1', puuid }: RankCardProps) => {
  const [rankData, setRankData] = useState<RankEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRank = async () => {
      setIsLoading(true);
      
      // PUUID is required for league entries (API limitation)
      if (!puuid) {
        if (import.meta.env.DEV) {
          console.warn('[RANK CARD] PUUID is required for rank data');
        }
        setRankData([]);
        setIsLoading(false);
        return;
      }
      
      try {
        // Use by-puuid endpoint (required for API key access)
        const url = `${API_BASE_URL}/summoner/${encryptedSummonerId}/league?tagline=${encodeURIComponent(tagline)}&puuid=${encodeURIComponent(puuid)}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (response.ok) {
          const data = await response.json();
          const finalData = Array.isArray(data) ? data : [];
          setRankData(finalData);
        } else {
          // Only log errors in development
          if (import.meta.env.DEV) {
            const errorText = await response.text();
            console.error('[RANK CARD] Failed to fetch rank data:', response.status);
            try {
              const errorData = JSON.parse(errorText);
              if (errorData.status === 403) {
                console.error('[RANK CARD] API authentication issue');
              }
            } catch (e) {
              // Ignore parsing errors in production
            }
          } else {
            // In production, still consume the response body to avoid memory leaks
            await response.text();
          }
          setRankData([]);
        }
      } catch (err) {
        // Only log errors in development
        if (import.meta.env.DEV) {
          console.error('[RANK CARD] Error fetching rank data:', err);
        }
        setRankData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (encryptedSummonerId) {
      if (puuid) {
        fetchRank();
      } else {
        setRankData([]);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [encryptedSummonerId, tagline, puuid]);

  if (isLoading) {
    return (
      <div className="bg-[#1e2328] rounded-lg p-4 border border-[#2d3748]">
        <div className="animate-pulse">
          <div className="h-4 bg-[#2d3748] rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-[#2d3748] rounded"></div>
        </div>
      </div>
    );
  }

  // Find Ranked Solo/Duo entry
  const soloDuo = rankData && rankData.length > 0 
    ? rankData.find((entry) => entry.queueType === 'RANKED_SOLO_5x5')
    : null;
  
  if (!soloDuo) {
    // Show what queue types are available
    const availableQueues = rankData && rankData.length > 0 
      ? rankData.map((entry) => entry.queueType).join(', ')
      : 'none';
    
    return (
      <div className="bg-[#1e2328] rounded-lg p-4 border border-[#2d3748]">
        <h3 className="text-sm font-semibold text-white mb-2">Ranked Solo/Duo</h3>
        <div className="text-sm text-[#6b7280]">
          {!puuid 
            ? 'PUUID required for rank data'
            : rankData && rankData.length > 0 
              ? `No Solo/Duo rank (Available: ${availableQueues})`
              : 'No ranked data available'}
        </div>
      </div>
    );
  }

  const winRate = soloDuo.wins + soloDuo.losses > 0
    ? soloDuo.wins / (soloDuo.wins + soloDuo.losses)
    : 0;

  return (
    <div className="bg-[#1e2328] rounded-lg p-4 border border-[#2d3748]">
      <h3 className="text-sm font-semibold text-white mb-4 text-center">Ranked Solo/Duo</h3>
      
      {/* Rank Display */}
      <div className={`${getTierBgColor(soloDuo.tier)} rounded-lg p-4`}>
        {/* Rank Image - Centered at Top */}
        <div className="flex justify-center mb-4">
          <img
            src={getRankImageUrl(soloDuo.tier, soloDuo.rank)}
            alt={`${soloDuo.tier} ${soloDuo.rank}`}
            className="w-24 h-24 object-contain"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>

        {/* Rank Text */}
        <div className="text-center mb-3">
          <div className={`text-xl font-bold ${getTierColor(soloDuo.tier)} mb-1`}>
            {getRankDisplayName(soloDuo.tier, soloDuo.rank)}
          </div>
          <div className="text-sm text-[#a0a0a0]">
            {soloDuo.leaguePoints} LP
          </div>
        </div>

        {/* Win/Loss Stats */}
        <div className="border-t border-[#2d3748] pt-3">
          <div className="mb-3">
            <div className="text-xs text-[#a0a0a0] mb-1 text-center">Win Rate</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[#2d3748] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    winRate >= 0.5 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${winRate * 100}%` }}
                />
              </div>
              <div className="text-xs font-semibold text-white w-10 text-right">
                {Math.round(winRate * 100)}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="text-green-400 font-semibold">{soloDuo.wins}W</div>
            <div className="text-[#6b7280]">•</div>
            <div className="text-red-400 font-semibold">{soloDuo.losses}L</div>
            <div className="text-[#6b7280]">•</div>
            <div className="text-[#a0a0a0]">
              {soloDuo.wins + soloDuo.losses} Games
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

