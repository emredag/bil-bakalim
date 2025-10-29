import React, { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Modal,
  LetterBoxRow,
  ToastContainer,
  useToast,
  Tooltip,
  Badge,
  StatusBadge,
  Tabs,
  Table,
  ProgressBar,
  ProgressRing,
  CountUp,
  Timer,
  TeamChipList,
  TEAM_COLORS,
  TEAM_EMOJIS,
} from './ui';
import { Play, HelpCircle } from 'lucide-react';

/**
 * Design System Demo - Task 05 Testing
 *
 * This component demonstrates all UI components from the design system.
 * Used for visual testing across multiple viewport sizes.
 */
export const DesignSystemDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, showToast } = useToast();

  const demoTabs = [
    {
      id: 'components',
      label: 'Components',
      icon: <Play className="w-4 h-4" />,
      content: <ComponentsDemo showToast={showToast} />,
    },
    {
      id: 'game',
      label: 'Game UI',
      icon: <Play className="w-4 h-4" />,
      content: <GameUIDemo />,
    },
    {
      id: 'colors',
      label: 'Colors',
      content: <ColorsDemo />,
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary safe-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Design System Demo</h1>
          <p className="text-text-secondary">
            Task 05 - UI Design System | TV Show Quality Components
          </p>
        </div>

        {/* Tabs */}
        <Tabs tabs={demoTabs} variant="segmented" />

        {/* Modal Demo */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          showCloseButton
        >
          <p className="text-text-secondary mb-4">
            This is a modal with blur backdrop. Press ESC or click outside to close.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Close Modal
          </Button>
        </Modal>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} position="top-right" />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-text-tertiary text-sm">
          <p>Test at different viewport sizes: 768px, 1366px, 1920px</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Components Demo Tab
 */
const ComponentsDemo: React.FC<{ showToast: (msg: string, type?: any) => void }> = ({
  showToast,
}) => {
  return (
    <div className="space-y-8">
      {/* Buttons */}
      <Card>
        <h3 className="mb-4">Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" icon={<Play className="w-5 h-5" />}>
            Primary Button
          </Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="primary" loading>
            Loading...
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Card>

      {/* Inputs */}
      <Card>
        <h3 className="mb-4">Inputs</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" placeholder="Enter your name" fullWidth />
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            icon={<HelpCircle className="w-5 h-5" />}
            fullWidth
          />
          <Input label="With Error" error="This field is required" fullWidth />
          <Input label="With Helper" helperText="This is a helper text" fullWidth />
        </div>
      </Card>

      {/* Badges */}
      <Card>
        <h3 className="mb-4">Badges</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <StatusBadge status="active" />
          <StatusBadge status="pending" />
        </div>
      </Card>

      {/* Toasts */}
      <Card>
        <h3 className="mb-4">Toasts</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => showToast('Success message!', 'success')}>
            Show Success
          </Button>
          <Button variant="secondary" onClick={() => showToast('Error message!', 'error')}>
            Show Error
          </Button>
          <Button variant="secondary" onClick={() => showToast('Warning message!', 'warning')}>
            Show Warning
          </Button>
        </div>
      </Card>

      {/* Tooltips */}
      <Card>
        <h3 className="mb-4">Tooltips</h3>
        <div className="flex gap-3">
          <Tooltip content="This is a tooltip on top" position="top">
            <Button variant="secondary">Hover Me (Top)</Button>
          </Tooltip>
          <Tooltip content="This is a tooltip on bottom" position="bottom">
            <Button variant="secondary">Hover Me (Bottom)</Button>
          </Tooltip>
        </div>
      </Card>

      {/* Progress */}
      <Card>
        <h3 className="mb-4">Progress</h3>
        <div className="space-y-4">
          <ProgressBar value={75} showLabel label="Loading" />
          <ProgressBar value={50} variant="warning" />
          <div className="flex gap-4">
            <ProgressRing value={75} size={100}>
              <CountUp value={75} suffix="%" />
            </ProgressRing>
            <Timer seconds={180} totalSeconds={300} size={120} />
          </div>
        </div>
      </Card>
    </div>
  );
};

/**
 * Game UI Demo Tab
 */
const GameUIDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Letter Boxes */}
      <Card>
        <h3 className="mb-4">Letter Boxes (Word Display)</h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-text-tertiary mb-3">Closed State:</p>
            <LetterBoxRow word="KELIME" revealedIndices={[]} />
          </div>
          <div>
            <p className="text-sm text-text-tertiary mb-3">Partially Revealed:</p>
            <LetterBoxRow word="KELIME" revealedIndices={[0, 2, 4]} />
          </div>
          <div>
            <p className="text-sm text-text-tertiary mb-3">All Revealed (Correct):</p>
            <LetterBoxRow word="KELIME" revealedIndices={[0, 1, 2, 3, 4, 5]} status="correct" />
          </div>
          <div>
            <p className="text-sm text-text-tertiary mb-3">Different Sizes:</p>
            <div className="space-y-3">
              <LetterBoxRow word="KÜÇÜK" revealedIndices={[0, 1, 2, 3, 4]} size="sm" />
              <LetterBoxRow word="ORTA" revealedIndices={[0, 1, 2, 3]} size="md" />
              <LetterBoxRow word="BÜYÜK" revealedIndices={[0, 1, 2, 3, 4]} size="lg" />
            </div>
          </div>
        </div>
      </Card>

      {/* Team Chips */}
      <Card>
        <h3 className="mb-4">Team Chips</h3>
        <div className="space-y-4">
          <TeamChipList
            teams={[
              {
                id: '1',
                name: 'Mavi Takım',
                color: TEAM_COLORS[0],
                emoji: TEAM_EMOJIS[0],
                score: 1500,
              },
              {
                id: '2',
                name: 'Mor Takım',
                color: TEAM_COLORS[1],
                emoji: TEAM_EMOJIS[1],
                score: 1200,
              },
              {
                id: '3',
                name: 'Yeşil Takım',
                color: TEAM_COLORS[2],
                emoji: TEAM_EMOJIS[2],
                score: 1800,
              },
            ]}
            activeTeamId="1"
            showScores
            size="md"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <h3 className="mb-4">Game History Table</h3>
        <Table
          data={[
            { date: '2025-01-15', category: 'Hayvanlar', mode: 'Tek', score: 1500 },
            { date: '2025-01-14', category: 'Ülkeler', mode: 'Çoklu', score: 2100 },
            { date: '2025-01-13', category: 'Filmler', mode: 'Takım', score: 1800 },
          ]}
          columns={[
            { key: 'date', header: 'Tarih', accessor: (row) => row.date },
            { key: 'category', header: 'Kategori', accessor: (row) => row.category },
            { key: 'mode', header: 'Mod', accessor: (row) => row.mode },
            { key: 'score', header: 'Puan', accessor: (row) => <CountUp value={row.score} /> },
          ]}
          keyExtractor={(row, i) => `${row.date}-${i}`}
          zebra
          stickyHeader
        />
      </Card>
    </div>
  );
};

/**
 * Colors Demo Tab
 */
const ColorsDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card>
        <h3 className="mb-4">Color Palette (PRD 8.1)</h3>

        {/* Backgrounds */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-text-secondary mb-3">Background Colors</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="h-20 bg-background-primary rounded-lg border border-slate-700" />
              <p className="text-xs mt-2 text-text-tertiary">Primary</p>
            </div>
            <div>
              <div className="h-20 bg-background-secondary rounded-lg border border-slate-700" />
              <p className="text-xs mt-2 text-text-tertiary">Secondary</p>
            </div>
            <div>
              <div className="h-20 bg-background-tertiary rounded-lg border border-slate-700" />
              <p className="text-xs mt-2 text-text-tertiary">Tertiary</p>
            </div>
          </div>
        </div>

        {/* Accents */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-text-secondary mb-3">Accent Colors</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="h-20 bg-accent-primary rounded-lg" />
              <p className="text-xs mt-2 text-text-tertiary">Primary</p>
            </div>
            <div>
              <div className="h-20 bg-accent-secondary rounded-lg" />
              <p className="text-xs mt-2 text-text-tertiary">Secondary</p>
            </div>
            <div>
              <div className="h-20 bg-accent-gold rounded-lg" />
              <p className="text-xs mt-2 text-text-tertiary">Gold</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm font-semibold text-text-secondary mb-3">Status Colors</p>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <div className="h-20 bg-status-success rounded-lg" />
              <p className="text-xs mt-2 text-text-tertiary">Success</p>
            </div>
            <div>
              <div className="h-20 bg-status-error rounded-lg" />
              <p className="text-xs mt-2 text-text-tertiary">Error</p>
            </div>
            <div>
              <div className="h-20 bg-status-warning rounded-lg" />
              <p className="text-xs mt-2 text-text-tertiary">Warning</p>
            </div>
            <div>
              <div className="h-20 bg-status-info rounded-lg" />
              <p className="text-xs mt-2 text-text-tertiary">Info</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
