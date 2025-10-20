/**
 * TeamForm Component
 * Task 11: Participant/Team Setup - Team Mode
 * PRD Reference: Section 4.4 - Team Mode (2-4 teams)
 * Design Reference: ui-ux-design.md#participant-team-setup
 *
 * Form for managing teams and team members
 * Supports 2-4 teams, each with 2-4 members
 * Minimum 28-56 words required (teams × 14 words)
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
import { Card } from '../ui/Card';
import { TEAM_COLORS } from '../ui/TeamChip';
import { EmojiPicker, EmojiButton, TEAM_EMOJI_OPTIONS } from '../EmojiPicker';
import type { TeamModeSetup, Team, TeamMember } from '../../types';
import {
  validateTeamModeSetup,
  CONSTRAINTS,
  type ValidationResult,
} from '../../utils/participantValidation';

export interface TeamFormProps {
  /** Initial setup data */
  initialSetup?: TeamModeSetup;
  /** Available word count in category */
  availableWords: number;
  /** Callback when setup changes */
  onChange: (setup: TeamModeSetup, validation: ValidationResult) => void;
  /** Custom className */
  className?: string;
}

/**
 * SortableMemberItem - Individual draggable team member
 */
interface SortableMemberItemProps {
  id: string;
  member: TeamMember;
  teamIndex: number;
  memberIndex: number;
  onNameChange: (teamIndex: number, memberIndex: number, name: string) => void;
  onRemove: (teamIndex: number, memberIndex: number) => void;
  canRemove: boolean;
}

const SortableMemberItem: React.FC<SortableMemberItemProps> = ({
  id,
  member,
  teamIndex,
  memberIndex,
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
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center gap-2 p-2 rounded-lg
        bg-slate-900 border border-slate-700
        ${isDragging ? 'shadow-xl z-50' : 'hover:border-slate-600'}
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
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Order */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-slate-700 text-slate-300 rounded text-xs font-bold">
        {member.order}
      </div>

      {/* Name Input */}
      <div className="flex-1">
        <Input
          placeholder={`Oyuncu ${member.order}`}
          value={member.name}
          onChange={(e) => onNameChange(teamIndex, memberIndex, e.target.value)}
          fullWidth
          aria-label={`Takım ${teamIndex + 1} Oyuncu ${member.order}`}
        />
      </div>

      {/* Remove */}
      <Button
        variant="destructive"
        onClick={() => onRemove(teamIndex, memberIndex)}
        disabled={!canRemove}
        className="flex-shrink-0 !p-2"
        aria-label="Kaldır"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </motion.div>
  );
};

/**
 * TeamCard - Individual team configuration
 */
interface TeamCardProps {
  team: Team;
  teamIndex: number;
  onTeamNameChange: (index: number, name: string) => void;
  onColorChange: (index: number, color: string) => void;
  onEmojiChange: (index: number, emoji: string) => void;
  onMemberNameChange: (teamIndex: number, memberIndex: number, name: string) => void;
  onMemberReorder: (teamIndex: number, oldIndex: number, newIndex: number) => void;
  onAddMember: (index: number) => void;
  onRemoveMember: (teamIndex: number, memberIndex: number) => void;
  onRemoveTeam: (index: number) => void;
  canRemoveTeam: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  teamIndex,
  onTeamNameChange,
  onColorChange,
  onEmojiChange,
  onMemberNameChange,
  onMemberReorder,
  onAddMember,
  onRemoveMember,
  onRemoveTeam,
  canRemoveTeam,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = team.members.findIndex((_, i) => `member-${teamIndex}-${i}` === active.id);
      const newIndex = team.members.findIndex((_, i) => `member-${teamIndex}-${i}` === over.id);
      onMemberReorder(teamIndex, oldIndex, newIndex);
    }
  };

  const canAddMember = team.members.length < CONSTRAINTS.TEAM.MAX_PLAYERS_PER_TEAM;
  const canRemoveMember = team.members.length > CONSTRAINTS.TEAM.MIN_PLAYERS_PER_TEAM;

  return (
    <Card
      className="p-4 md:p-6 border-2"
      style={{ borderColor: team.color }}
    >
      {/* Team Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Emoji Picker */}
          <div className="relative">
            <EmojiButton
              emoji={team.emoji}
              onClick={() => setShowEmojiPicker(true)}
              size="md"
            />
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <EmojiPicker
                  selectedEmoji={team.emoji}
                  onSelect={(emoji) => {
                    onEmojiChange(teamIndex, emoji);
                    setShowEmojiPicker(false);
                  }}
                  onClose={() => setShowEmojiPicker(false)}
                  variant="modal"
                />
              </div>
            )}
          </div>

          {/* Team Name */}
          <div className="flex-1">
            <Input
              placeholder={`Takım ${teamIndex + 1}`}
              value={team.name}
              onChange={(e) => onTeamNameChange(teamIndex, e.target.value)}
              fullWidth
              aria-label={`Takım ${teamIndex + 1} adı`}
            />
          </div>
        </div>

        {/* Remove Team Button */}
        <Button
          variant="destructive"
          onClick={() => onRemoveTeam(teamIndex)}
          disabled={!canRemoveTeam}
          className="flex-shrink-0"
          aria-label="Takımı kaldır"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Color Picker */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Takım Rengi
        </label>
        <div className="flex flex-wrap gap-2">
          {TEAM_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(teamIndex, color)}
              className={`
                w-8 h-8 rounded-full border-2 transition-transform
                ${team.color === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}
              `}
              style={{
                backgroundColor: color,
                borderColor: team.color === color ? 'white' : color,
              }}
              aria-label={`Renk ${color}`}
              aria-pressed={team.color === color}
            />
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">
            Oyuncular ({team.members.length}/{CONSTRAINTS.TEAM.MAX_PLAYERS_PER_TEAM})
          </h4>
          <Button
            variant="secondary"
            onClick={() => onAddMember(teamIndex)}
            disabled={!canAddMember}
            className="flex items-center gap-1 !py-1 !px-2 text-xs"
          >
            <Plus className="w-3 h-3" />
            Ekle
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={team.members.map((_, i) => `member-${teamIndex}-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              <div className="space-y-2">
                {team.members.map((member, memberIndex) => (
                  <SortableMemberItem
                    key={`member-${teamIndex}-${memberIndex}`}
                    id={`member-${teamIndex}-${memberIndex}`}
                    member={member}
                    teamIndex={teamIndex}
                    memberIndex={memberIndex}
                    onNameChange={onMemberNameChange}
                    onRemove={onRemoveMember}
                    canRemove={canRemoveMember}
                  />
                ))}
              </div>
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      </div>
    </Card>
  );
};

/**
 * TeamForm Component - Main form
 */
export const TeamForm: React.FC<TeamFormProps> = ({
  initialSetup,
  availableWords,
  onChange,
  className = '',
}) => {
  // Initialize with 2 teams or from initial setup
  const [teams, setTeams] = useState<Team[]>(
    initialSetup?.teams || [
      {
        name: '',
        emoji: TEAM_EMOJI_OPTIONS[0],
        color: TEAM_COLORS[0],
        members: [
          { name: '', order: 1 },
          { name: '', order: 2 },
        ],
      },
      {
        name: '',
        emoji: TEAM_EMOJI_OPTIONS[1],
        color: TEAM_COLORS[1],
        members: [
          { name: '', order: 1 },
          { name: '', order: 2 },
        ],
      },
    ]
  );

  // Validate and notify parent on change
  useEffect(() => {
    const setup: TeamModeSetup = { teams };
    const validation = validateTeamModeSetup(setup, availableWords);
    onChange(setup, validation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, availableWords]);

  const handleAddTeam = () => {
    if (teams.length < CONSTRAINTS.TEAM.MAX_TEAMS) {
      const newTeam: Team = {
        name: '',
        emoji: TEAM_EMOJI_OPTIONS[teams.length % TEAM_EMOJI_OPTIONS.length],
        color: TEAM_COLORS[teams.length % TEAM_COLORS.length],
        members: [
          { name: '', order: 1 },
          { name: '', order: 2 },
        ],
      };
      setTeams((prev) => [...prev, newTeam]);
    }
  };

  const handleRemoveTeam = (index: number) => {
    if (teams.length > CONSTRAINTS.TEAM.MIN_TEAMS) {
      setTeams((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleTeamNameChange = (index: number, name: string) => {
    setTeams((prev) => {
      const newTeams = [...prev];
      newTeams[index] = { ...newTeams[index], name };
      return newTeams;
    });
  };

  const handleColorChange = (index: number, color: string) => {
    setTeams((prev) => {
      const newTeams = [...prev];
      newTeams[index] = { ...newTeams[index], color };
      return newTeams;
    });
  };

  const handleEmojiChange = (index: number, emoji: string) => {
    setTeams((prev) => {
      const newTeams = [...prev];
      newTeams[index] = { ...newTeams[index], emoji };
      return newTeams;
    });
  };

  const handleMemberNameChange = (teamIndex: number, memberIndex: number, name: string) => {
    setTeams((prev) => {
      const newTeams = [...prev];
      const newMembers = [...newTeams[teamIndex].members];
      newMembers[memberIndex] = { ...newMembers[memberIndex], name };
      newTeams[teamIndex] = { ...newTeams[teamIndex], members: newMembers };
      return newTeams;
    });
  };

  const handleMemberReorder = (teamIndex: number, oldIndex: number, newIndex: number) => {
    setTeams((prev) => {
      const newTeams = [...prev];
      const reorderedMembers = arrayMove(newTeams[teamIndex].members, oldIndex, newIndex);
      // Update order numbers
      const updatedMembers = reorderedMembers.map((member, i) => ({
        ...member,
        order: i + 1,
      }));
      newTeams[teamIndex] = { ...newTeams[teamIndex], members: updatedMembers };
      return newTeams;
    });
  };

  const handleAddMember = (teamIndex: number) => {
    setTeams((prev) => {
      const newTeams = [...prev];
      const currentMembers = newTeams[teamIndex].members;
      if (currentMembers.length < CONSTRAINTS.TEAM.MAX_PLAYERS_PER_TEAM) {
        const newMember: TeamMember = {
          name: '',
          order: currentMembers.length + 1,
        };
        newTeams[teamIndex] = {
          ...newTeams[teamIndex],
          members: [...currentMembers, newMember],
        };
      }
      return newTeams;
    });
  };

  const handleRemoveMember = (teamIndex: number, memberIndex: number) => {
    setTeams((prev) => {
      const newTeams = [...prev];
      const currentMembers = newTeams[teamIndex].members;
      if (currentMembers.length > CONSTRAINTS.TEAM.MIN_PLAYERS_PER_TEAM) {
        const filteredMembers = currentMembers.filter((_, i) => i !== memberIndex);
        // Update order numbers
        const updatedMembers = filteredMembers.map((member, i) => ({
          ...member,
          order: i + 1,
        }));
        newTeams[teamIndex] = { ...newTeams[teamIndex], members: updatedMembers };
      }
      return newTeams;
    });
  };

  const canAddTeam = teams.length < CONSTRAINTS.TEAM.MAX_TEAMS;
  const canRemoveTeam = teams.length > CONSTRAINTS.TEAM.MIN_TEAMS;

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
          <div className="p-3 bg-amber-500/20 rounded-full">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white">
          Takım Modu
        </h3>
        <p className="text-sm md:text-base text-slate-400">
          2-4 takım oluşturun, her takıma 2-4 oyuncu ekleyin
        </p>
      </div>

      {/* Add Team Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          onClick={handleAddTeam}
          disabled={!canAddTeam}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Takım Ekle ({teams.length}/{CONSTRAINTS.TEAM.MAX_TEAMS})
        </Button>
      </div>

      {/* Team Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {teams.map((team, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TeamCard
                team={team}
                teamIndex={index}
                onTeamNameChange={handleTeamNameChange}
                onColorChange={handleColorChange}
                onEmojiChange={handleEmojiChange}
                onMemberNameChange={handleMemberNameChange}
                onMemberReorder={handleMemberReorder}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onRemoveTeam={handleRemoveTeam}
                canRemoveTeam={canRemoveTeam}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Info text */}
      <div className="text-center space-y-2">
        <p className="text-sm text-slate-400">
          Her takım sırayla 14 kelime tahmin edecek
        </p>
        <p className="text-xs text-slate-500">
          💡 İpucu: Takım içinde oyuncuları sürükleyerek sırasını değiştirebilirsiniz
        </p>
      </div>
    </motion.div>
  );
};
