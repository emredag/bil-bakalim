/**
 * Main Menu Screen
 * PRD Reference: Section 4.1 - Başlangıç Ekranı (Ana Menü)
 * 
 * Main navigation hub with 5 action cards
 */

import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, History, Settings, HelpCircle } from 'lucide-react';
import { ROUTES } from '../../routes/constants';
import { Card } from '../ui/Card';

export function MainMenuScreen() {
  const navigate = useNavigate();

  const actionCards = [
    {
      icon: Play,
      title: '🏁 Yarışma Başlat',
      description: 'Yeni bir kelime yarışması başlat',
      onClick: () => navigate(ROUTES.CATEGORY_SELECT),
      variant: 'primary' as const,
    },
    {
      icon: BookOpen,
      title: '📚 Kategori Yönetimi',
      description: 'Kategorileri ve kelimeleri düzenle',
      onClick: () => navigate(ROUTES.CATEGORY_MANAGEMENT),
      variant: 'secondary' as const,
    },
    {
      icon: History,
      title: '📊 Geçmiş Yarışmalar',
      description: 'Önceki yarışmaları görüntüle',
      onClick: () => navigate(ROUTES.HISTORY),
      variant: 'secondary' as const,
    },
    {
      icon: Settings,
      title: '⚙️ Ayarlar',
      description: 'Uygulama ayarlarını düzenle',
      onClick: () => navigate(ROUTES.SETTINGS),
      variant: 'secondary' as const,
    },
    {
      icon: HelpCircle,
      title: 'ℹ️ Nasıl Oynanır?',
      description: 'Oyun kurallarını öğren',
      onClick: () => navigate(ROUTES.HOW_TO_PLAY),
      variant: 'secondary' as const,
    },
    {
      icon: Play,
      title: '🎬 Animation Demo',
      description: 'Test all Task 06 animations',
      onClick: () => navigate('/animation-demo'),
      variant: 'secondary' as const,
    },
    {
      icon: Play,
      title: '🎵 Sound Demo',
      description: 'Test all Task 07 sounds',
      onClick: () => navigate('/sound-demo'),
      variant: 'secondary' as const,
    },
    {
      icon: Play,
      title: '🚨 Error Demo',
      description: 'Test all Task 39 error handling',
      onClick: () => navigate('/error-demo'),
      variant: 'secondary' as const,
    },
    {
      icon: Play,
      title: '♿ A11y Demo',
      description: 'Test all Task 34 accessibility features',
      onClick: () => navigate('/a11y-demo'),
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🎯 Kelime Oyunu
          </h1>
          <p className="text-xl text-slate-300">
            Eğlenceli Kelime Tahmin Yarışması
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {actionCards.map((card, index) => (
            <Card
              key={index}
              onClick={card.onClick}
              className="p-6 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <card.icon className="w-12 h-12 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">
                  {card.title}
                </h2>
                <p className="text-slate-400">{card.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>v0.1.0 • Open Source • MIT License</p>
        </div>
      </div>
    </div>
  );
}
