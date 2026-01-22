import type { MatchListResponse } from '../types/match';

/**
 * Get the API base URL based on environment.
 * - If VITE_API_URL is explicitly set, use it (allows override in Render/production)
 * - If running in development (npm run dev), use localhost:5005
 * - Otherwise (production build), use the Render backend URL
 */
export const getApiBaseUrl = (): string => {
  // If VITE_API_URL is explicitly set, use it (takes precedence)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Use localhost in development (npm run dev), Render URL in production
  return import.meta.env.DEV
    ? 'http://localhost:5005'
    : 'https://league-backend-ot61.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

export interface SearchRequest {
  gameName: string;
  tagline: string;
  start?: number;
  count?: number;
}

export interface SummonerData {
  id: string;
  puuid: string;
  name: string;
  summonerLevel: number;
}

/**
 * Search for a summoner and get their match history.
 * Supports pagination via optional start and count parameters.
 */
export const searchSummoner = async (
  gameName: string,
  tagline: string,
  start: number = 0,
  count: number = 20
): Promise<MatchListResponse> => {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameName, tagline, start, count }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch summoner data');
  }

  return response.json();
};

export const getSummonerByPuuid = async (puuid: string, tagline: string = 'NA1'): Promise<SummonerData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/summoner/puuid/${puuid}?tagline=${encodeURIComponent(tagline)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Only log in development
      if (import.meta.env.DEV) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Failed to fetch summoner (${response.status}):`, errorData);
        if (response.status === 0 || response.type === 'opaque') {
          console.error('CORS error detected');
        }
      } else {
        // Consume response body in production
        await response.text().catch(() => {});
      }
      return null;
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Failed to fetch summoner:', err);
    }
    return null;
  }
};

export const parseSummonerInput = (input: string): { gameName: string; tagline: string } | null => {
  const trimmed = input.trim();
  const match = trimmed.match(/^(.+?)\s*#(.+)$/);

  if (!match) {
    return null;
  }

  return {
    gameName: match[1].trim(),
    tagline: match[2].trim().toUpperCase(),
  };
};

// Re-export the MatchListResponse type for convenience
export type { MatchListResponse };
