// Cache for the latest Data Dragon version
let cachedVersion: string | null = null;
let versionFetchPromise: Promise<string> | null = null;
const DEFAULT_VERSION = '16.1.1'; // Current default (will be updated by fetch)

/**
 * Fetch the latest Data Dragon version from Riot's API (async)
 */
const fetchLatestVersion = async (): Promise<string> => {
  if (cachedVersion) {
    return cachedVersion;
  }

  if (versionFetchPromise) {
    return versionFetchPromise;
  }

  versionFetchPromise = (async () => {
    try {
      const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      if (!response.ok) {
        throw new Error('Failed to fetch versions');
      }
      const versions: string[] = await response.json();
      cachedVersion = versions[0]; // First entry is the latest version
      return cachedVersion;
    } catch (error) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.warn('Failed to fetch latest Data Dragon version, using fallback:', error);
      }
      // Fallback to default version
      cachedVersion = DEFAULT_VERSION;
      return cachedVersion;
    } finally {
      versionFetchPromise = null;
    }
  })();

  return versionFetchPromise;
};

/**
 * Get the latest Data Dragon version (cached, sync for immediate use)
 */
export const getLatestDataDragonVersion = (): string => {
  // Return cached version if available, otherwise return default
  // Version will be updated in background on first async fetch
  return cachedVersion || DEFAULT_VERSION;
};

/**
 * Initialize version fetch (call this on app startup)
 */
export const initializeDataDragonVersion = (): void => {
  // Start fetching the latest version in the background
  if (!cachedVersion && !versionFetchPromise) {
    fetchLatestVersion().catch(() => {
      // Error already handled in fetchLatestVersion
    });
  }
};

