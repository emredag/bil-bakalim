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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center gap-3 p-3 md:p-4 rounded-xl
        bg-slate-800 border-2 border-slate-700
        ${isDragging ? 'shadow-2xl z-50' : 'hover:border-slate-600'}
        transition-colors
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
        aria-label="Sürükle"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Order Number */}
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500/20 text-blue-400 rounded-lg font-bold text-sm">
        {index + 1}
      </div>

      {/* Name Input */}
      <div className="flex-1">
        <Input
          placeholder={`Oyuncu ${index + 1}`}
          value={name}
          onChange={(e) => onNameChange(index, e.target.value)}
          fullWidth
          aria-label={`Oyuncu ${index + 1} adı`}
        />
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
  const [players, setPlayers] = useState<string[]>(
    initialSetup?.players || ['', '']
  );

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
      transition={{ duration: 0.3 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-violet-500/20 rounded-full">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-violet-400" />
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white">
          Çoklu Yarışmacı
        </h3>
        <p className="text-sm md:text-base text-slate-400">
          2-6 oyuncu ekleyin ve sırasını belirleyin
        </p>
      </div>

      {/* Player List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base md:text-lg font-semibold text-white">
            Oyuncular ({players.length}/{CONSTRAINTS.MULTI.MAX_PLAYERS})
          </h4>
          <Button
            variant="primary"
            onClick={handleAddPlayer}
            disabled={!canAddPlayer}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Oyuncu Ekle</span>
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
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
      <div className="text-center space-y-2">
        <p className="text-sm text-slate-400">
          Her oyuncu sırayla 14 kelime tahmin edecek
        </p>
        <p className="text-xs text-slate-500">
          💡 İpucu: Oyuncuları sürükleyerek sırasını değiştirebilirsiniz
        </p>
      </div>
    </motion.div>
  );
};
