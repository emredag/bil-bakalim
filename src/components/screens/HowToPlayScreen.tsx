/**
 * How to Play Screen
 * PRD Reference: Section 7 - NASIL OYNANIR? EKRANI
 * Design Reference: docs/ui-ux-design.md#howto-shortcuts
 * Task: 32
 * 
 * Interactive tutorial explaining game rules, modes, scoring, keyboard shortcuts, and tiebreaker rules
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lightbulb, 
  Trophy, 
  Users, 
  Grid3x3,
  AlertCircle,
  Keyboard,
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  Target,
  Award,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Tabs, type Tab } from '../ui/Tabs';
import { ROUTES } from '../../routes/constants';
import { useKeyboardShortcuts } from '../../hooks';

/**
 * Tutorial Steps Data
 */
const TUTORIAL_STEPS = [
  {
    id: 1,
    title: 'Kategori Seçin',
    icon: Grid3x3,
    description: 'En az 14 kelime içeren kategoriyi seçin',
    note: 'Çoklu mod için daha fazla kelime gerekir',
    color: 'blue',
  },
  {
    id: 2,
    title: 'Mod Seçin',
    icon: Users,
    description: 'Tek, çoklu veya takım modu - kategori kelime sayısına göre',
    note: 'Her modun farklı kelime gereksinimleri vardır',
    color: 'violet',
  },
  {
    id: 3,
    title: 'Yarışmacıları/Takımları Ayarlayın',
    icon: Users,
    description: 'Tek mod: İsim girin\nÇoklu mod: Yarışmacı sayısı seçin\nTakım mod: Takımları ve oyuncuları oluşturun',
    note: 'Her yarışmacı farklı 14 kelime alır',
    color: 'emerald',
  },
  {
    id: 4,
    title: 'Kelimeyi Tahmin Edin',
    icon: Target,
    description: 'İpucunu kullanarak kelimeyi bulmaya çalışın',
    note: 'Kapalı harflerden kelimeyi tahmin edin',
    color: 'amber',
  },
  {
    id: 5,
    title: 'Harf Açın veya Tahmin Edin',
    icon: Lightbulb,
    description: 'Harf açarak yardım alın (-100 puan) veya tahmin edin',
    note: '⚠️ DİKKAT: Tahmin yaptıktan sonra harf alamazsınız!',
    color: 'red',
    warning: true,
  },
  {
    id: 6,
    title: 'Puan Kazanın',
    icon: Trophy,
    description: 'Daha az harf açarak daha çok puan kazanın',
    note: 'Her harf açma -100 puan ceza getirir',
    color: 'yellow',
  },
];

/**
 * Scoring Table Data
 */
const SCORING_TABLE = [
  { letters: 4, base: 400, opened: [400, 300, 200, 100, 0] },
  { letters: 5, base: 500, opened: [500, 400, 300, 200, 100] },
  { letters: 6, base: 600, opened: [600, 500, 400, 300, 200] },
  { letters: 7, base: 700, opened: [700, 600, 500, 400, 300] },
  { letters: 8, base: 800, opened: [800, 700, 600, 500, 400] },
  { letters: 9, base: 900, opened: [900, 800, 700, 600, 500] },
  { letters: 10, base: 1000, opened: [1000, 900, 800, 700, 600] },
];

/**
 * Keyboard Shortcuts Data
 */
const KEYBOARD_SHORTCUTS = {
  game: [
    { key: 'H', action: 'Harf Aç', description: 'Rastgele harf açar' },
    { key: 'T', action: 'Tahmin Et', description: 'Tahmin popup\'ı açar' },
    { key: 'P', action: 'Pas Geç', description: 'Pas geçme onayı ister' },
    { key: 'Space', action: 'Duraklat/Devam', description: 'Oyunu duraklat' },
    { key: 'M', action: 'Ses Aç/Kapat', description: 'Ses toggle' },
    { key: 'Esc', action: 'Ana Menü', description: 'Onaylı çıkış' },
  ],
  dialog: [
    { key: 'D / Enter', action: 'Doğru', description: 'Tahmin popup\'ında' },
    { key: 'Y / N', action: 'Yanlış', description: 'Tahmin popup\'ında' },
    { key: 'Enter', action: 'Onayla', description: 'Tüm onay dialog\'larında' },
    { key: 'Esc', action: 'İptal', description: 'Tüm dialog\'larda' },
  ],
  global: [
    { key: 'F11', action: 'Tam ekran aç/kapat', description: 'Tüm ekranlar' },
    { key: 'Ctrl/Cmd + Q', action: 'Uygulamadan çık', description: 'Tüm ekranlar' },
    { key: 'Ctrl/Cmd + ,', action: 'Ayarlar', description: 'Tüm ekranlar' },
    { key: 'Esc', action: 'Geri / İptal', description: 'Tüm ekranlar' },
  ],
};

/**
 * HowToPlayScreen Component
 */
export function HowToPlayScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Global keyboard shortcuts (PRD Section 11.1)
  useKeyboardShortcuts();

  /**
   * Navigate to next tutorial step
   */
  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Navigate to previous tutorial step
   */
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Tabs configuration
   */
  const tabs: Tab[] = [
    {
      id: 'rules',
      label: 'Oyun Kuralları',
      icon: <Lightbulb className="w-4 h-4" />,
      content: <RulesTab />,
    },
    {
      id: 'tutorial',
      label: 'İnteraktif Rehber',
      icon: <PlayCircle className="w-4 h-4" />,
      content: (
        <TutorialTab
          currentStep={currentStep}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      ),
    },
    {
      id: 'scoring',
      label: 'Puan Sistemi',
      icon: <Trophy className="w-4 h-4" />,
      content: <ScoringTab />,
    },
    {
      id: 'shortcuts',
      label: 'Klavye Kısayolları',
      icon: <Keyboard className="w-4 h-4" />,
      content: <ShortcutsTab />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.HOME)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Menü
          </Button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Nasıl Oynanır?
          </h1>
          <div className="w-32" /> {/* Spacer for alignment */}
        </div>

        {/* Main Content - Tabs */}
        <Tabs tabs={tabs} defaultTab="rules" />

        {/* Footer */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={() => navigate(ROUTES.CATEGORY_SELECT)}
            className="gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            Hemen Oyna
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * RuleItem Component
 */
interface RuleItemProps {
  icon: string;
  text: string;
  warning?: boolean;
  highlight?: boolean;
}

function RuleItem({ icon, text, warning, highlight }: RuleItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        warning
          ? 'bg-red-500/10 border border-red-500/20'
          : highlight
          ? 'bg-amber-500/10 border border-amber-500/20'
          : 'bg-slate-700/30'
      }`}
    >
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <span
        className={`text-base md:text-lg ${
          warning ? 'text-red-300 font-semibold' : 'text-slate-200'
        }`}
      >
        {text}
      </span>
    </div>
  );
}

/**
 * RulesTab Component
 */
function RulesTab() {
  return (
    <div>
      <Card className="p-6 md:p-8">
        <div className="space-y-6">
          {/* Temel Bilgiler */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-400" />
              Temel Bilgiler
            </h2>
            <div className="grid gap-3">
              <RuleItem icon="📝" text="Her yarışmacıya 14 kelime verilir" />
              <RuleItem icon="⏱️" text="Toplam süre: 5 dakika (300 saniye) - tüm kelimeler için" />
              <RuleItem icon="🎯" text="Her kelime için maksimum 3 tahmin hakkı" />
              <RuleItem icon="💯" text="Her harf açma -100 puan ceza" />
              <RuleItem
                icon="⚠️"
                text="Tahmin yaptıktan sonra harf alınamaz"
                warning
              />
            </div>
          </div>

          {/* Kelime Dağılımı */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Grid3x3 className="w-6 h-6 text-violet-400" />
              Kelime Dağılımı (Her Yarışmacı İçin)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div
                  key={num}
                  className="bg-slate-700/50 rounded-lg p-3 text-center"
                >
                  <div className="text-2xl font-bold text-amber-400 mb-1">2</div>
                  <div className="text-sm text-slate-300">{num} harfli kelime</div>
                </div>
              ))}
            </div>
          </div>

          {/* Çoklu Yarışmacı ve Takım Modu */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" />
              Çoklu Yarışmacı ve Takım Modu
            </h2>
            <div className="grid gap-3">
              <RuleItem icon="🔄" text="Her yarışmacı/takım farklı 14 kelime alır" />
              <RuleItem icon="📚" text="Kategori yeterli kelime içermelidir:" />
              <div className="ml-8 grid gap-2">
                <div className="text-slate-300">• 2 kişi → 28 kelime</div>
                <div className="text-slate-300">• 3 kişi → 42 kelime</div>
                <div className="text-slate-300">• 4 kişi → 56 kelime</div>
              </div>
              <RuleItem icon="👥" text="Takım modunda her takımın oyuncuları belirlenir" />
            </div>
          </div>

          {/* Kazanma Kuralları */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              Kazanma Kuralları
            </h2>
            <div className="grid gap-3">
              <RuleItem icon="🥇" text="En yüksek puanlı kazanır" highlight />
              <div className="ml-6 space-y-2">
                <div className="text-slate-300">
                  <strong className="text-amber-400">Eşitlik durumunda:</strong>
                </div>
                <div className="ml-4 space-y-1 text-slate-300">
                  <div>1. Daha az harf açan kazanır</div>
                  <div>2. Daha hızlı bitiren kazanır</div>
                  <div>3. Berabere ilan edilir</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * TutorialTab Component
 */
interface TutorialTabProps {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
}

function TutorialTab({ currentStep, nextStep, prevStep }: TutorialTabProps) {
  return (
    <div>
      <Card className="p-6 md:p-8">
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {TUTORIAL_STEPS.map((step, index) => (
            <button
              key={step.id}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-blue-500 w-8'
                  : index < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-600'
              }`}
              aria-label={`Adım ${step.id}`}
            />
          ))}
        </div>

        {/* Current Step */}
        <TutorialStep step={TUTORIAL_STEPS[currentStep]} />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Önceki
          </Button>

          <div className="text-slate-400 text-sm">
            Adım {currentStep + 1} / {TUTORIAL_STEPS.length}
          </div>

          <Button
            onClick={nextStep}
            disabled={currentStep === TUTORIAL_STEPS.length - 1}
            className="gap-2"
          >
            Sonraki
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

/**
 * TutorialStep Component
 */
interface TutorialStepProps {
  step: typeof TUTORIAL_STEPS[0];
}

function TutorialStep({ step }: TutorialStepProps) {
  const Icon = step.icon;
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <div
      key={step.id}
      className="space-y-6"
    >
      {/* Icon & Title */}
      <div className="flex items-center gap-4">
        <div
          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex items-center justify-center ${
            colorClasses[step.color as keyof typeof colorClasses]
          }`}
        >
          <Icon className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <div>
          <div className="text-sm text-slate-400 mb-1">Adım {step.id}</div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-700/30 rounded-lg p-6">
        <p className="text-lg md:text-xl text-slate-200 whitespace-pre-line leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Note */}
      {step.note && (
        <div
          className={`rounded-lg p-4 ${
            step.warning
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-blue-500/10 border border-blue-500/20'
          }`}
        >
          <div className="flex items-start gap-3">
            {step.warning ? (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-base ${
                step.warning ? 'text-red-300 font-semibold' : 'text-blue-300'
              }`}
            >
              {step.note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ScoringTab Component
 */
function ScoringTab() {
  return (
    <div>
      <Card className="p-6 md:p-8">
        <div className="space-y-6">
          {/* Formula */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              Puan Hesaplama Formülü
            </h2>
            <div className="bg-slate-700/50 rounded-lg p-4 font-mono text-sm md:text-base space-y-2">
              <div className="text-emerald-400">basePuan = harfSayisi × 100</div>
              <div className="text-red-400">toplamCeza = alinanHarfSayisi × 100</div>
              <div className="text-amber-400">netPuan = max(0, basePuan - toplamCeza)</div>
            </div>
          </div>

          {/* Example */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Örnek:</h3>
            <div className="space-y-1 text-slate-300">
              <div>
                • 8 harfli kelime: <span className="text-emerald-400">800 puan</span>
              </div>
              <div>
                • 2 harf açıldı: <span className="text-red-400">-200 puan</span>
              </div>
              <div>
                • Net puan: <span className="text-amber-400 font-bold">600</span>
              </div>
            </div>
          </div>

          {/* Scoring Table */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Puan Tablosu</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="px-3 py-2 text-left text-white font-semibold rounded-tl-lg">
                      Harf
                    </th>
                    <th className="px-3 py-2 text-center text-white font-semibold">Temel</th>
                    <th className="px-3 py-2 text-center text-white font-semibold">0 Harf</th>
                    <th className="px-3 py-2 text-center text-white font-semibold">1 Harf</th>
                    <th className="px-3 py-2 text-center text-white font-semibold">2 Harf</th>
                    <th className="px-3 py-2 text-center text-white font-semibold">3 Harf</th>
                    <th className="px-3 py-2 text-center text-white font-semibold rounded-tr-lg">
                      4 Harf
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SCORING_TABLE.map((row, index) => (
                    <tr
                      key={row.letters}
                      className={index % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-800/30'}
                    >
                      <td className="px-3 py-2 text-white font-semibold">{row.letters}</td>
                      <td className="px-3 py-2 text-center text-slate-400">{row.base}</td>
                      {row.opened.map((points, i) => (
                        <td
                          key={i}
                          className={`px-3 py-2 text-center font-semibold ${
                            points === row.base
                              ? 'text-emerald-400'
                              : points === 0
                              ? 'text-red-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {points}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * ShortcutsTab Component
 */
function ShortcutsTab() {
  return (
    <div>
      <div className="grid gap-6">
        {/* Game Shortcuts */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-blue-400" />
            Oyun Ekranı Kısayolları
          </h2>
          <div className="grid gap-3">
            {KEYBOARD_SHORTCUTS.game.map((shortcut, index) => (
              <ShortcutItem
                key={index}
                keyName={shortcut.key}
                action={shortcut.action}
                description={shortcut.description}
              />
            ))}
          </div>
        </Card>

        {/* Dialog Shortcuts */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            Popup/Dialog Kısayolları
          </h2>
          <div className="grid gap-3">
            {KEYBOARD_SHORTCUTS.dialog.map((shortcut, index) => (
              <ShortcutItem
                key={index}
                keyName={shortcut.key}
                action={shortcut.action}
                description={shortcut.description}
              />
            ))}
          </div>
        </Card>

        {/* Global Shortcuts */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Keyboard className="w-6 h-6 text-violet-400" />
            Global Kısayollar
          </h2>
          <div className="grid gap-3">
            {KEYBOARD_SHORTCUTS.global.map((shortcut, index) => (
              <ShortcutItem
                key={index}
                keyName={shortcut.key}
                action={shortcut.action}
                description={shortcut.description}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * ShortcutItem Component
 */
interface ShortcutItemProps {
  keyName: string;
  action: string;
  description: string;
}

function ShortcutItem({ keyName, action, description }: ShortcutItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <kbd className="px-3 py-1.5 bg-slate-900 text-slate-100 border border-slate-600 rounded-lg font-mono text-sm font-semibold shadow-md min-w-[80px] text-center">
          {keyName}
        </kbd>
        <div className="flex-1">
          <div className="text-white font-semibold">{action}</div>
          <div className="text-slate-400 text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
}
