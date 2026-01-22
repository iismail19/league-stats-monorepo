import { getLatestDataDragonVersion } from './dataDragon';

/**
 * Get rank emblem image URL from Riot CDN
 */
export const getRankImageUrl = (tier: string, rank: string): string => {
  // Normalize tier and rank for URL
  const normalizedTier = tier.toLowerCase();
  const normalizedRank = rank ? rank.toLowerCase() : '';
  
  // Riot CDN for rank emblems
  // Format varies by tier - some use tier_rank, some just tier
  const version = getLatestDataDragonVersion();
  
  // For tiers without ranks (Master, Grandmaster, Challenger)
  if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier.toUpperCase())) {
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/ranked-emblems/${normalizedTier}.png`;
  }
  
  // For tiers with ranks (Iron through Emerald)
  // Rank format: I, II, III, IV
  if (normalizedRank) {
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/ranked-emblems/${normalizedTier}_${normalizedRank}.png`;
  }
  
  // Fallback to just tier
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/ranked-emblems/${normalizedTier}.png`;
};

/**
 * Get rank tier name for display
 */
export const getRankDisplayName = (tier: string, rank: string): string => {
  if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier.toUpperCase())) {
    return tier;
  }
  return `${tier} ${rank}`;
};

