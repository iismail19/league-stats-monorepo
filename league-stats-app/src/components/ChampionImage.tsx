import { useState } from 'react';
import { getChampionImageUrl, getChampionImageUrlFallback } from '../utils/championImages';

interface ChampionImageProps {
  championName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export const ChampionImage = ({ championName, size = 'md', className = '' }: ChampionImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [retryRiot, setRetryRiot] = useState(false);

  if (imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded bg-[#0f1419] flex items-center justify-center text-xs font-bold ${className}`}
      >
        {championName.substring(0, 3).toUpperCase()}
      </div>
    );
  }

  // Strategy: Try Riot CDN first, then Community Dragon, then retry Riot CDN (in case version loaded)
  let imageUrl: string;
  if (retryRiot) {
    // Retry Riot CDN after version might have loaded
    imageUrl = getChampionImageUrl(championName);
  } else if (useFallback) {
    // Use Community Dragon fallback
    imageUrl = getChampionImageUrlFallback(championName);
  } else {
    // Primary: Riot CDN
    imageUrl = getChampionImageUrl(championName);
  }

  // Use imageUrl as key to force re-render when URL changes
  return (
    <img
      key={imageUrl}
      src={imageUrl}
      alt={championName}
      className={`${sizeClasses[size]} ${className || 'rounded'} object-cover`}
      onError={() => {
        if (!useFallback && !retryRiot) {
          // First failure: try Community Dragon fallback
          setUseFallback(true);
        } else if (useFallback && !retryRiot) {
          // Community Dragon failed: retry Riot CDN (version might be loaded now)
          setRetryRiot(true);
        } else {
          // All attempts failed, show placeholder
          if (import.meta.env.DEV) {
            console.warn(`Failed to load champion image for: ${championName}`);
          }
          setImageError(true);
        }
      }}
      loading="lazy"
    />
  );
};

