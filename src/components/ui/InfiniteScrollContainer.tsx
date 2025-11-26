import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface InfiniteScrollContainerProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number; // Distance from bottom (in pixels) to trigger load
  className?: string;
}

/**
 * InfiniteScrollContainer Component
 *
 * Wrapper component that enables infinite scrolling.
 * Part of Design System v2.0 - GameHistoryScreen migration.
 *
 * Features:
 * - Automatic load more on scroll
 * - Configurable threshold
 * - Loading indicator
 * - Smooth scroll experience
 *
 * @example
 * <InfiniteScrollContainer
 *   onLoadMore={loadMoreGames}
 *   hasMore={hasMoreGames}
 *   isLoading={loading}
 *   threshold={300}
 * >
 *   {games.map(game => <GameCard key={game.id} game={game} />)}
 * </InfiniteScrollContainer>
 */
export const InfiniteScrollContainer: React.FC<InfiniteScrollContainerProps> = ({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 300,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || isLoadingRef.current) {
      return;
    }

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < threshold) {
      isLoadingRef.current = true;
      onLoadMore();
    }
  }, [hasMore, threshold, onLoadMore]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Also check on mount and when children change (in case content is shorter than viewport)
  useEffect(() => {
    handleScroll();
  }, [children, handleScroll]);

  return (
    <div ref={containerRef} className={`overflow-y-auto ${className}`}>
      {children}

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center py-8"
        >
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          <span className="ml-3 text-sm text-neutral-400">Daha fazla oyun yükleniyor...</span>
        </motion.div>
      )}

      {/* End of List Message */}
      {!hasMore && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-sm text-neutral-500">Tüm oyunlar yüklendi</p>
        </motion.div>
      )}
    </div>
  );
};
