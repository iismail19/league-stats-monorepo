import { useState, useEffect, useRef } from 'react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
  matchesLoaded: number;
  retryAfter?: number;
}

export const LoadMoreButton = ({
  onClick,
  isLoading,
  hasMore,
  matchesLoaded,
  retryAfter
}: LoadMoreButtonProps) => {
  const [countdown, setCountdown] = useState(0);
  const lastClickRef = useRef(0);

  // Handle retryAfter countdown
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      setCountdown(retryAfter);
    }
  }, [retryAfter]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if within 3-second debounce window
  const isDebounced = () => Date.now() - lastClickRef.current < 3000;

  const isDisabled = isLoading || !hasMore || countdown > 0 || isDebounced();

  const handleClick = () => {
    if (isLoading || countdown > 0 || isDebounced()) return;
    lastClickRef.current = Date.now();
    onClick();
  };

  if (!hasMore) {
    return (
      <div className="text-center py-6 text-[#6b7280] text-sm">
        All matches loaded ({matchesLoaded} total)
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-[#2d3748]
                   disabled:cursor-not-allowed text-white font-medium rounded-lg
                   transition-colors inline-flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
            Loading...
          </>
        ) : countdown > 0 ? (
          `Please wait ${countdown}s`
        ) : (
          'Load More Matches'
        )}
      </button>
      <p className="mt-2 text-xs text-[#6b7280]">
        Showing {matchesLoaded} matches
      </p>
    </div>
  );
};
