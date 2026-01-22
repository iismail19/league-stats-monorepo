import { getLatestDataDragonVersion } from './dataDragon';

/**
 * Normalize champion name for URL
 * Handles various champion name formats from the API
 */
const normalizeChampionName = (championName: string): string => {
  if (!championName) return '';

  // Handle special cases where champion names might differ between API and CDN
  const nameMap: Record<string, string> = {
    'MonkeyKing': 'Wukong',
    'FiddleSticks': 'Fiddlesticks',
    'KogMaw': 'KogMaw',
    'RekSai': 'RekSai',
    'Khazix': 'Khazix',
    'ChoGath': 'Chogath',
    'LeBlanc': 'Leblanc',
    'VelKoz': 'Velkoz',
  };

  let normalizedName = nameMap[championName] || championName;
  
  // Normalize the name for URL - remove spaces, apostrophes, periods
  normalizedName = normalizedName
    .replace(/\s+/g, '') // Remove spaces
    .replace(/'/g, '') // Remove apostrophes
    .replace(/\./g, ''); // Remove periods

  return normalizedName;
};

/**
 * Get champion square image URL from official Riot CDN (primary - uses latest version)
 */
export const getChampionImageUrl = (championName: string): string => {
  const normalizedName = normalizeChampionName(championName);
  const version = getLatestDataDragonVersion();
  // Primary: Riot CDN with latest version (more reliable than Community Dragon)
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${normalizedName}.png`;
};

/**
 * Get fallback champion image URL from Community Dragon (no version needed)
 */
export const getChampionImageUrlFallback = (championName: string): string => {
  const normalizedName = normalizeChampionName(championName);
  // Fallback: Community Dragon - no version required
  return `https://ddragon.canisback.com/img/champion/${normalizedName}.png`;
};

/**
 * Get champion loading screen image URL (splash art)
 */
export const getChampionSplashUrl = (championName: string, skinNum: number = 0): string => {
  const normalizedName = championName
    .replace(/\s+/g, '')
    .replace(/'/g, '')
    .replace(/\./g, '');

  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${normalizedName}_${skinNum}.jpg`;
};

