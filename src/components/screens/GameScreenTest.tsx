/**
 * GameScreen Test Page
 * For testing Task 12 - Game Screen Layout
 *
 * This page creates a dummy game session to test the GameScreen component
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { GameConfig, GameWord } from '../../types';

export const GameScreenTest: React.FC = () => {
  const navigate = useNavigate();
  const startGame = useGameStore((state) => state.startGame);

  useEffect(() => {
    // Create a dummy game session for testing
    const config: GameConfig = {
      categoryId: 1,
      mode: 'single',
      setup: {
        playerName: 'Test Oyuncu',
      },
    };

    // Create dummy words (14 words, 2 of each length 4-10)
    const createDummyWord = (word: string, hint: string): GameWord => ({
      id: Math.random(),
      word,
      hint,
      letterCount: word.length,
      letters: word.split('').map((char, index) => ({
        char,
        status: 'hidden',
        index,
      })),
      remainingGuesses: 3,
      lettersRevealed: 0,
      hasMadeGuess: false,
      result: null,
      pointsEarned: 0,
    });

    const dummyWords: GameWord[] = [
      // 4-letter words
      createDummyWord('KEDI', 'Miyavlayan ev hayvanı'),
      createDummyWord('KAPI', 'Odaya girdiğimiz yer'),
      // 5-letter words
      createDummyWord('KALEM', 'Yazı yazmak için kullanılır'),
      createDummyWord('KITAP', 'Okumak için kullanılır'),
      // 6-letter words
      createDummyWord('BILGISAYAR', 'Elektronik hesaplama aygıtı'),
      createDummyWord('TELEVIZYON', 'Yayın izleme cihazı'),
      // 7-letter words
      createDummyWord('FUTBOL', 'Dünyada en popüler spor'),
      createDummyWord('BASKETBOL', 'Potaya top atma oyunu'),
      // 8-letter words
      createDummyWord('COMPUTER', 'İngilizce bilgisayar'),
      createDummyWord('KEYBOARD', 'Tuş takımı'),
      // 9-letter words
      createDummyWord('CHOCOLATE', 'Tatlı kahverengi yiyecek'),
      createDummyWord('BEAUTIFUL', 'Güzel anlamına gelir'),
      // 10-letter words
      createDummyWord('JAVASCRIPT', 'Web programlama dili'),
      createDummyWord('TYPESCRIPT', 'Tip güvenlikli JavaScript'),
    ];

    // Start game with dummy data
    startGame(config, [dummyWords]);

    // Update session with category info
    const updatedSession = useGameStore.getState().session;
    if (updatedSession) {
      updatedSession.categoryName = 'Test Kategorisi';
      updatedSession.categoryEmoji = '🎮';
    }

    // Navigate to game screen after a short delay
    setTimeout(() => {
      navigate('/game');
    }, 100);
  }, [startGame, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-300 text-lg">Oyun yükleniyor...</p>
      </div>
    </div>
  );
};
