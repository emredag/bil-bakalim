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
import { useSettingsStore } from '../../store/settingsStore';

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
    description:
      'Tek mod: İsim girin\nÇoklu mod: Yarışmacı sayısı seçin\nTakım mod: Takımları ve oyuncuları oluşturun',
    note: 'Her yarışmacı farklı 14 kelime alır',
    color: 'emerald',
  },
  {
    id: 4,
    title: 'Harf Açın',
    icon: Lightbulb,
    description: 'Global süre (5 dk) akarken harf açabilirsiniz. Her açılan harf potansiyel puanınızı düşürür.',
    note: '⚠️ DİKKAT: Tahmin moduna geçtikten sonra harf açılamaz!',
    color: 'amber',
    warning: true,
  },
  {
    id: 5,
    title: 'Tahmin Et Butonuna Basın',
    icon: Target,
    description: 'Hazır olduğunuzda "Tahmin Et" butonuna basın.\n30 saniyelik tahmin süresi başlar ve global süre durur.',
    note: 'Bu sürede Doğru veya Yanlış butonlarından birini seçmelisiniz.',
    color: 'red',
  },
  {
    id: 6,
    title: 'Sonuç Belirleme',
    icon: Trophy,
    description: '✓ Doğru: Kalan harf puanı eklenir\n✗ Yanlış: Kalan harf puanı düşülür\n⏱️ 30sn dolarsa: Otomatik yanlış sayılır',
    note: 'Tüm harfler açılırsa puan 0 olur (ne artı ne eksi)',
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
    { key: 'H', action: 'Harf Aç', description: 'Rastgele bir harf açar (normal modda)' },
    { key: 'T', action: 'Tahmin Et', description: 'Tahmin moduna geç (normal modda)' },
    { key: 'D', action: 'Doğru', description: 'Kelimeyi doğru bildiniz (tahmin modunda)' },
    { key: 'Y', action: 'Yanlış', description: 'Kelimeyi yanlış bildiniz (tahmin modunda)' },
    { key: 'Space', action: 'Duraklat', description: 'Oyunu duraklat/devam ettir' },
    { key: 'M', action: 'Ses Aç/Kapat', description: 'Ses efektlerini aç/kapat' },
    { key: 'Esc', action: 'Ana Menü', description: 'Ana menüye dön onayı' },
  ],
  dialog: [
    { key: 'Enter', action: 'Onayla', description: "Tüm onay dialog'larında" },
    { key: 'Esc', action: 'İptal', description: "Tüm dialog'larda" },
  ],
  global: [
    { key: 'F11', action: 'Tam ekran aç/kapat', description: 'Tüm ekranlar' },
    { key: 'M', action: 'Ses Aç/Kapat', description: 'Tüm ekranlarda (input dışında)' },
    { key: 'Ctrl/Cmd + Q', action: 'Uygulamadan Çık', description: 'Tüm ekranlar' },
    { key: 'Ctrl/Cmd + ,', action: 'Ayarlar', description: 'Ayarlar sayfasına git' },
    { key: 'Esc', action: 'Geri / İptal', description: 'Tüm ekranlar' },
  ],
};

/**
 * HowToPlayScreen Component
 */
export function HowToPlayScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Get timer settings from store
  const gameDuration = useSettingsStore((state) => state.gameDuration);
  const guessTimerDuration = useSettingsStore((state) => state.guessTimerDuration);

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
      content: <RulesTab gameDuration={gameDuration} guessTimerDuration={guessTimerDuration} />,
    },
    {
      id: 'tutorial',
      label: 'İnteraktif Rehber',
      icon: <PlayCircle className="w-4 h-4" />,
      content: <TutorialTab currentStep={currentStep} nextStep={nextStep} prevStep={prevStep} gameDuration={gameDuration} guessTimerDuration={guessTimerDuration} />,
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
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b bg-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Button 
            variant="secondary" 
            onClick={() => navigate(ROUTES.HOME)} 
            icon={<ArrowLeft className="w-4 h-4" />}
            aria-label="Ana menüye dön"
          />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Nasıl Oynanır?</h1>
          <div className="w-32" /> {/* Spacer for alignment */}
        </div>

        {/* Main Content - Tabs */}
        <Tabs tabs={tabs} defaultTab="rules" />

        {/* Footer */}
        <div className="mt-8 text-center">
          <Button size="lg" onClick={() => navigate(ROUTES.CATEGORY_SELECT)} icon={<PlayCircle className="w-5 h-5" />}>
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
          ? 'bg-error-500/10 border border-error-500/20'
          : highlight
            ? 'bg-accent-500/10 border border-accent-500/20'
            : 'bg-neutral-700/30'
      }`}
    >
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <span
        className={`text-base md:text-lg ${
          warning ? 'text-error-300 font-semibold' : 'text-neutral-200'
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
interface RulesTabProps {
  gameDuration: number;
  guessTimerDuration: number;
}

function RulesTab({ gameDuration, guessTimerDuration }: RulesTabProps) {
  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} dakika (${seconds} saniye)`;
    }
    return `${minutes} dakika ${remainingSeconds} saniye (${seconds} saniye)`;
  };

  return (
    <div>
      <Card className="p-6 md:p-8">
        <div className="space-y-6">
          {/* Temel Bilgiler */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-info-400" />
              Temel Bilgiler
            </h2>
            <div className="grid gap-3">
              <RuleItem icon="📝" text="Her yarışmacıya 14 kelime verilir" />
              <RuleItem icon="⏱️" text={`Global Süre: ${formatDuration(gameDuration)} - tüm oyun için geri sayar`} />
              <RuleItem icon="🎯" text={`Tahmin Süresi: ${guessTimerDuration} saniye - 'Tahmin Et' butonuna basınca başlar`} highlight />
              <RuleItem icon="⏸️" text={`Tahmin modunda global süre DURUR, ${guessTimerDuration}sn tahmin süresi akar`} />
              <RuleItem icon="⌨️" text="Kontrol: Ekrandaki butonlar veya klavye kısayolları ile" />
              <RuleItem icon="⚠️" text="Tahmin modunda harf açılamaz!" warning />
            </div>
          </div>

          {/* Kelime Dağılımı */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Grid3x3 className="w-6 h-6 text-secondary-400" />
              Kelime Dağılımı (Her Yarışmacı İçin)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={num} className="bg-neutral-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-accent-400 mb-1">2</div>
                  <div className="text-sm text-neutral-300">{num} harfli kelime</div>
                </div>
              ))}
            </div>
          </div>

          {/* Çoklu Yarışmacı ve Takım Modu */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-success-400" />
              Çoklu Yarışmacı ve Takım Modu
            </h2>
            <div className="grid gap-3">
              <RuleItem icon="🔄" text="Her yarışmacı/takım farklı 14 kelime alır" />
              <RuleItem icon="📚" text="Kategori yeterli kelime içermelidir:" />
              <div className="ml-8 grid gap-2">
                <div className="text-neutral-300">• 2 kişi → 28 kelime</div>
                <div className="text-neutral-300">• 3 kişi → 42 kelime</div>
                <div className="text-neutral-300">• 4 kişi → 56 kelime</div>
              </div>
              <RuleItem icon="👥" text="Takım modunda her takımın oyuncuları belirlenir" />
            </div>
          </div>

          {/* Kazanma Kuralları */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-warning-400" />
              Kazanma Kuralları
            </h2>
            <div className="grid gap-3">
              <RuleItem icon="🥇" text="En yüksek puanlı kazanır" highlight />
              <div className="ml-6 space-y-2">
                <div className="text-neutral-300">
                  <strong className="text-accent-400">Eşitlik durumunda:</strong>
                </div>
                <div className="ml-4 space-y-1 text-neutral-300">
                  <div>1. Daha az harf açan kazanır</div>
                  <div>2. Daha hızlı bitiren kazanır</div>
                  <div>3. Berabere ilan edilir</div>
                </div>
              </div>
            </div>
          </div>

          {/* Oyun Akışı */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-primary-400" />
              Oyun Akışı
            </h2>
            <div className="space-y-4">
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-info-400 mb-2">1. Soru Modu (Normal)</h3>
                <ul className="space-y-1 text-neutral-300 text-sm">
                  <li>• Global süre ({Math.floor(gameDuration / 60)} dk) akar</li>
                  <li>• "Harf Ver" ve "Tahmin Et" butonları aktif</li>
                  <li>• İstediğiniz kadar harf açabilirsiniz</li>
                  <li>• Klavye: H (harf aç), T (tahmin et)</li>
                </ul>
              </div>
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-warning-400 mb-2">2. Tahmin Modu</h3>
                <ul className="space-y-1 text-neutral-300 text-sm">
                  <li>• "Tahmin Et" butonuna (veya T tuşuna) basınca aktif olur</li>
                  <li>• Global süre DURUR</li>
                  <li>• {guessTimerDuration} saniyelik geri sayım başlar</li>
                  <li>• "Doğru" ve "Yanlış" butonları görünür</li>
                  <li>• Harf açma devre dışı kalır</li>
                  <li>• Klavye: D (doğru), Y (yanlış)</li>
                </ul>
              </div>
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-success-400 mb-2">3. Sonuç & Geçiş</h3>
                <ul className="space-y-1 text-neutral-300 text-sm">
                  <li>• Doğru/Yanlış butonuna basılır veya {guessTimerDuration}sn dolar</li>
                  <li>• Puan hesaplanır ve eklenir/çıkarılır</li>
                  <li>• Otomatik olarak sonraki soruya geçilir</li>
                  <li>• Global süre kaldığı yerden devam eder</li>
                </ul>
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
  gameDuration: number;
  guessTimerDuration: number;
}

function TutorialTab({ currentStep, nextStep, prevStep, gameDuration, guessTimerDuration }: TutorialTabProps) {
  // Generate dynamic tutorial steps with actual timer values
  const dynamicSteps = TUTORIAL_STEPS.map((step) => {
    if (step.id === 4) {
      return {
        ...step,
        description: `Global süre (${Math.floor(gameDuration / 60)} dk) akarken harf açabilirsiniz. Her açılan harf potansiyel puanınızı düşürür.`,
      };
    }
    if (step.id === 5) {
      return {
        ...step,
        description: `Hazır olduğunuzda "Tahmin Et" butonuna (veya T tuşuna) basın.\n${guessTimerDuration} saniyelik tahmin süresi başlar ve global süre durur.`,
        note: `Bu sürede Doğru (D tuşu) veya Yanlış (Y tuşu) seçimi yapmalısınız.`,
      };
    }
    if (step.id === 6) {
      return {
        ...step,
        description: `✓ Doğru: Kalan harf puanı eklenir\n✗ Yanlış: Kalan harf puanı düşülür\n⏱️ ${guessTimerDuration}sn dolarsa: Otomatik yanlış sayılır`,
      };
    }
    return step;
  });

  return (
    <div>
      <Card className="p-6 md:p-8">
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {dynamicSteps.map((step, index) => (
            <button
              key={step.id}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-primary-500 w-8'
                  : index < currentStep
                    ? 'bg-success-500'
                    : 'bg-neutral-600'
              }`}
              aria-label={`Adım ${step.id}`}
            />
          ))}
        </div>

        {/* Current Step */}
        <TutorialStep step={dynamicSteps[currentStep]} />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-700">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Önceki
          </Button>

          <div className="text-neutral-400 text-sm">
            Adım {currentStep + 1} / {dynamicSteps.length}
          </div>

          <Button
            onClick={nextStep}
            disabled={currentStep === dynamicSteps.length - 1}
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
  step: (typeof TUTORIAL_STEPS)[0];
}

function TutorialStep({ step }: TutorialStepProps) {
  const Icon = step.icon;
  const colorClasses = {
    blue: 'bg-info-500/20 text-info-400 border-info-500/30',
    violet: 'bg-secondary-500/20 text-secondary-400 border-secondary-500/30',
    emerald: 'bg-success-500/20 text-success-400 border-success-500/30',
    amber: 'bg-accent-500/20 text-accent-400 border-accent-500/30',
    red: 'bg-error-500/20 text-error-400 border-error-500/30',
    yellow: 'bg-warning-500/20 text-warning-400 border-warning-500/30',
  };

  return (
    <div key={step.id} className="space-y-6">
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
          <div className="text-sm text-neutral-400 mb-1">Adım {step.id}</div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
        </div>
      </div>

      {/* Description */}
      <div className="bg-neutral-700/30 rounded-lg p-6">
        <p className="text-lg md:text-xl text-neutral-200 whitespace-pre-line leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Note */}
      {step.note && (
        <div
          className={`rounded-lg p-4 ${
            step.warning
              ? 'bg-error-500/10 border border-error-500/20'
              : 'bg-info-500/10 border border-info-500/20'
          }`}
        >
          <div className="flex items-start gap-3">
            {step.warning ? (
              <AlertCircle className="w-5 h-5 text-error-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Lightbulb className="w-5 h-5 text-info-400 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-base ${
                step.warning ? 'text-error-300 font-semibold' : 'text-info-300'
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
              <Trophy className="w-6 h-6 text-accent-400" />
              Puan Hesaplama Formülü
            </h2>
            <div className="bg-neutral-700/50 rounded-lg p-4 font-mono text-sm md:text-base space-y-2">
              <div className="text-info-400">harf_puani = 100</div>
              <div className="text-success-400">mevcut_deger = (toplam_harf - acilan_harf) × 100</div>
            </div>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-3 p-3 bg-success-500/10 rounded-lg">
                <span className="text-xl">✓</span>
                <span className="text-success-300"><strong>Doğru:</strong> Toplam Puan += Mevcut Değer</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-error-500/10 rounded-lg">
                <span className="text-xl">✗</span>
                <span className="text-error-300"><strong>Yanlış:</strong> Toplam Puan -= Mevcut Değer</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-warning-500/10 rounded-lg">
                <span className="text-xl">⏱️</span>
                <span className="text-warning-300"><strong>Süre Doldu:</strong> Toplam Puan -= Mevcut Değer (otomatik yanlış)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-700/50 rounded-lg">
                <span className="text-xl">📖</span>
                <span className="text-neutral-300"><strong>Tüm Harfler Açık:</strong> Puan değişmez (0 değer)</span>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="bg-info-500/10 border border-info-500/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Örnek:</h3>
            <div className="space-y-1 text-neutral-300">
              <div>
                • 8 harfli kelime, 2 harf açıldı → Mevcut değer: <span className="text-accent-400 font-bold">(8-2) × 100 = 600</span>
              </div>
              <div>
                • Doğru bilirse: <span className="text-success-400">+600 puan</span>
              </div>
              <div>
                • Yanlış bilirse: <span className="text-error-400">-600 puan</span>
              </div>
            </div>
          </div>

          {/* Scoring Table */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Puan Tablosu</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-neutral-700">
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
                      className={index % 2 === 0 ? 'bg-neutral-800/50' : 'bg-neutral-800/30'}
                    >
                      <td className="px-3 py-2 text-white font-semibold">{row.letters}</td>
                      <td className="px-3 py-2 text-center text-neutral-400">{row.base}</td>
                      {row.opened.map((points, i) => (
                        <td
                          key={i}
                          className={`px-3 py-2 text-center font-semibold ${
                            points === row.base
                              ? 'text-success-400'
                              : points === 0
                                ? 'text-error-400'
                                : 'text-accent-400'
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
          <div className="bg-info-500/10 border border-info-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">⌨️</span>
              <div>
                <p className="text-info-300 font-semibold">Çoklu Kontrol Desteği</p>
                <p className="text-neutral-400 text-sm">Bu oyun hem dokunmatik/mouse hem de klavye ile kontrol edilebilir. Akıllı tahta veya bilgisayar ortamında kullanabilirsiniz.</p>
              </div>
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-info-400" />
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
            <AlertCircle className="w-6 h-6 text-accent-400" />
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
            <Keyboard className="w-6 h-6 text-secondary-400" />
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
    <div className="flex items-center justify-between gap-4 p-3 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <kbd className="px-3 py-1.5 bg-neutral-900 text-neutral-100 border border-neutral-600 rounded-lg font-mono text-sm font-semibold shadow-md min-w-[80px] text-center">
          {keyName}
        </kbd>
        <div className="flex-1">
          <div className="text-white font-semibold">{action}</div>
          <div className="text-neutral-400 text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
}
