/**
 * Results Screen Wrapper
 * Renders the appropriate results screen based on game mode
 */

import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useCategoryStore } from '../../store/categoryStore';
import { ResultsSinglePlayer } from './ResultsSinglePlayer';
import { ResultsMultiplayer } from './ResultsMultiplayer';
import { ResultsTeamMode } from './ResultsTeamMode';
import { ROUTES } from '../../routes/constants';
import type { TeamModeSetup } from '../../types';

/**
 * ResultsScreen - Wrapper component that renders the correct results screen
 * based on game mode (single, multi, team)
 */
export function ResultsScreen() {
  const session = useGameStore((state) => state.session);
  const resetGame = useGameStore((state) => state.resetGame);
  const gameSetup = useCategoryStore((state) => state.gameSetup);
  const navigate = useNavigate();

  // If there's an active session that's finished, show results
  if (session && session.state === 'finished') {
    // Single player mode
    if (session.mode === 'single') {
      const handlePlayAgain = () => {
        // Navigate first, then reset game after navigation starts
        // This prevents re-render from redirecting to home
        navigate(ROUTES.CATEGORY_SELECT);
        // Reset after a small delay to ensure navigation happens first
        setTimeout(() => resetGame(), 100);
      };

      return <ResultsSinglePlayer session={session} onPlayAgain={handlePlayAgain} />;
    }

    // Multiplayer mode
    if (session.mode === 'multi') {
      const handlePlayAgain = () => {
        navigate(ROUTES.CATEGORY_SELECT);
        setTimeout(() => resetGame(), 100);
      };

      return <ResultsMultiplayer session={session} onPlayAgain={handlePlayAgain} />;
    }

    // Team mode
    if (session.mode === 'team') {
      const handlePlayAgain = () => {
        navigate(ROUTES.CATEGORY_SELECT);
        setTimeout(() => resetGame(), 100);
      };

      // Get team info from gameSetup
      const teams = (gameSetup as TeamModeSetup)?.teams || [];

      return <ResultsTeamMode session={session} teams={teams} onPlayAgain={handlePlayAgain} />;
    }
  }

  // No session or invalid state - redirect to home
  if (typeof window !== 'undefined') {
    navigate(ROUTES.HOME);
  }
  return null;
}
