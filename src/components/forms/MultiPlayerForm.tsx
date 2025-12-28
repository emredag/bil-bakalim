/**
 * MultiPlayerForm Component
 * Task 11: Participant/Team Setup - Multiplayer Mode
 * PRD Reference: Section 4.4 - Multiplayer Mode (2-6 players)
 * Design Reference: ui-ux-design.md#participant-team-setup
 *
 * Form for adding/removing/reordering multiple players
 * Supports 2-6 players with drag & drop reordering
 * Minimum 28-84 words required (players × 14 words)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { MultiPlayerSetup } from '../../types';
import {
  validateMultiPlayerSetup,
  CONSTRAINTS,
  type ValidationResult,
} from '../../utils/participantValidation';

export interface MultiPlayerFormProps {
  /** Initial setup data */
  initialSetup?: MultiPlayerSetup;
  /** Available word count in category */
  availableWords: number;
  /** Callback when setup changes */
  onChange: (setup: MultiPlayerSetup, validation: ValidationResult) => void;
  /** Custom className */
  className?: string;
}

/**
 * SortablePlayerItem - Individual draggable player item
 */
interface SortablePlayerItemProps {
  id: string;
  index: number;
  name: string;
  onNameChange: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const SortablePlayerItem: React.FC<SortablePlayerItemProps> = ({
  id,
  index,
  name,
  onNameChange,
  onRemove,
  canRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get initials from name
  const getInitials = (playerName: string) => {
    if (!playerName.trim()) return `P${index + 1}`;
    const parts = playerName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return playerName.substring(0, 2).toUpperCase();
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`
        group relative flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl
        bg-neutral-800/60 backdrop-blur-sm border-2 border-white/10
        ${isDragging ? 'shadow-2xl z-50 scale-105 border-primary-500/50' : 'hover:border-white/20 hover:bg-neutral-800/80'}
        transition-all duration-200
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-neutral-500 hover:text-neutral-300 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2 transition-colors"
        aria-label="Sürükle"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Avatar with Initials */}
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary-500/20 text-primary-400 rounded-xl font-bold text-base ring-2 ring-primary-500/30 group-hover:ring-primary-500/50 transition-all">
        {getInitials(name)}
      </div>

      {/* Name Input */}
      <div className="flex-1">
        <Input
          placeholder={`Oyuncu ${index + 1} adını girin`}
          value={name}
          onChange={(e) => onNameChange(index, e.target.value)}
          fullWidth
          aria-label={`Oyuncu ${index + 1} adı`}
        />
        {name.trim() && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-success-400 mt-1 flex items-center gap-1"
          >
            <span>✓</span> İsim girildi
          </motion.p>
        )}
      </div>

      {/* Order Badge */}
      <div className="flex-shrink-0 px-3 py-1 bg-neutral-900/60 text-neutral-400 rounded-lg font-semibold text-sm border border-white/10">
        #{index + 1}
      </div>

      {/* Remove Button */}
      <Button
        variant="destructive"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="flex-shrink-0"
        aria-label={`Oyuncu ${index + 1}'i kaldır`}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

/**
 * MultiPlayerForm Component
 *
 * Features:
 * - Add/remove players (2-6)
 * - Drag & drop reordering
 * - Real-time validation
 * - Responsive design
 * - Accessible form
 */
export const MultiPlayerForm: React.FC<MultiPlayerFormProps> = ({
  initialSetup,
  availableWords,
  onChange,
  className = '',
}) => {
  // Initialize with 2 players or from initial setup
  const [players, setPlayers] = useState<string[]>(initialSetup?.players || ['', '']);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Validate and notify parent on change
  useEffect(() => {
    const setup: MultiPlayerSetup = { players };
    const validation = validateMultiPlayerSetup(setup, availableWords);
    onChange(setup, validation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, availableWords]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPlayers((items) => {
        const oldIndex = items.findIndex((_, i) => `player-${i}` === active.id);
        const newIndex = items.findIndex((_, i) => `player-${i}` === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleNameChange = (index: number, name: string) => {
    setPlayers((prev) => {
      const newPlayers = [...prev];
      newPlayers[index] = name;
      return newPlayers;
    });
  };

  const handleAddPlayer = () => {
    if (players.length < CONSTRAINTS.MULTI.MAX_PLAYERS) {
      setPlayers((prev) => [...prev, '']);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > CONSTRAINTS.MULTI.MIN_PLAYERS) {
      setPlayers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const canAddPlayer = players.length < CONSTRAINTS.MULTI.MAX_PLAYERS;
  const canRemovePlayer = players.length > CONSTRAINTS.MULTI.MIN_PLAYERS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card rounded-2xl p-8 md:p-10 space-y-8 ${className}`}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="p-4 bg-secondary-500/20 rounded-2xl ring-2 ring-secondary-500/30">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-secondary-400" />
          </div>
        </motion.div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Çoklu Yarışmacı</h3>
          <p className="text-base md:text-lg text-neutral-300 leading-relaxed">
            2-6 oyuncu ekleyin ve sırasını belirleyin
          </p>
        </div>
      </div>

      {/* Player List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-lg md:text-xl font-semibold text-white">
            Oyuncular <span className="text-neutral-400 text-base">({players.length}/{CONSTRAINTS.MULTI.MAX_PLAYERS})</span>
          </h4>
          <Button
            variant="primary"
            onClick={handleAddPlayer}
            disabled={!canAddPlayer}
            icon={<Plus className="w-5 h-5" />}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <span className="hidden sm:inline">Oyuncu Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={players.map((_, i) => `player-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {players.map((name, index) => (
                  <SortablePlayerItem
                    key={`player-${index}`}
                    id={`player-${index}`}
                    index={index}
                    name={name}
                    onNameChange={handleNameChange}
                    onRemove={handleRemovePlayer}
                    canRemove={canRemovePlayer}
                  />
                ))}
              </div>
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      </div>

      {/* Info text */}
      <div className="space-y-3">
        <div className="text-center bg-neutral-900/40 rounded-xl p-4 border border-white/5">
          <p className="text-sm text-neutral-300 leading-relaxed">
            Her oyuncu sırayla <strong className="text-secondary-400">14 kelime</strong> tahmin edecek
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-neutral-400 flex items-center justify-center gap-2">
            <GripVertical className="w-4 h-4" />
            <span>Oyuncuları sürükleyerek sırasını değiştirebilirsiniz</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
