import React, { useState, useEffect } from 'react';
import { Map, Zap, BookOpen, ShoppingBag, User } from 'lucide-react';
import { UserStats, SupportedLocale } from './types';
import { loadUserStats, saveUserStats, markLevelCompleted } from './lib/storage';
import { Header } from './components/Header';
import { MapTab } from './components/tabs/MapTab';
import { PracticeTab } from './components/tabs/PracticeTab';
import { FormulasTab } from './components/tabs/FormulasTab';
import { ShopTab } from './components/tabs/ShopTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { LessonModal } from './components/LessonModal';
import { sound } from './lib/audio';

export const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [activeTab, setActiveTab] = useState<'map' | 'practice' | 'formulas' | 'shop' | 'profile'>('map');
  const [activeLesson, setActiveLesson] = useState<{ ref: string; file: string } | null>(null);

  // Sync state changes with localStorage
  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleSelectLevel = (ref: string, file: string) => {
    if (stats.lives <= 0) {
      alert(
        stats.locale === 'es'
          ? '¡Te has quedado sin vidas! Visita la tienda para recargar o espera a que se regeneren.'
          : 'You are out of lives! Visit the shop to refill or wait for them to regenerate.'
      );
      setActiveTab('shop');
      return;
    }
    setActiveLesson({ ref, file });
  };

  const handleCompleteLevel = (levelRef: string, stars: number, earnedXp: number) => {
    // Determine next level reference
    const nextRefMap: Record<string, string> = {
      A1: 'A2',
      A2: 'A3',
      A3: 'A4',
      A4: 'A5',
      A5: 'B1',
      B1: 'B2',
      B2: 'B3',
      B3: 'B4',
      B4: 'C1',
      C1: 'C2',
      C2: 'C3',
    };
    const nextRef = nextRefMap[levelRef];
    const updated = markLevelCompleted(stats, levelRef, stars, earnedXp, nextRef);
    setStats(updated);
  };

  const handleLoseLife = () => {
    setStats((prev) => {
      const nextLives = Math.max(0, prev.lives - 1);
      const updated = { ...prev, lives: nextLives };
      saveUserStats(updated);
      return updated;
    });
  };

  const handleReward = (xp: number, gems: number) => {
    setStats((prev) => {
      const updated = {
        ...prev,
        xp: prev.xp + xp,
        gems: prev.gems + gems,
      };
      saveUserStats(updated);
      return updated;
    });
  };

  const navItems = [
    { id: 'map', label: stats.locale === 'es' ? 'Ruta' : 'Map', icon: Map },
    { id: 'practice', label: stats.locale === 'es' ? 'Práctica' : 'Practice', icon: Zap },
    { id: 'formulas', label: stats.locale === 'es' ? 'Fórmulas' : 'Formulas', icon: BookOpen },
    { id: 'shop', label: stats.locale === 'es' ? 'Tienda' : 'Shop', icon: ShoppingBag },
    { id: 'profile', label: stats.locale === 'es' ? 'Perfil' : 'Profile', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-gv-bg text-gv-text flex flex-col spreadsheet-grid-bg">
      {/* Top Header */}
      <Header
        stats={stats}
        onUpdateStats={handleUpdateStats}
        activeTab={activeTab}
        onChangeTab={(t) => setActiveTab(t as any)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-20 md:pb-8">
        {activeTab === 'map' && (
          <MapTab
            stats={stats}
            locale={stats.locale}
            onSelectLevel={handleSelectLevel}
          />
        )}
        {activeTab === 'practice' && (
          <PracticeTab
            stats={stats}
            locale={stats.locale}
            onReward={handleReward}
          />
        )}
        {activeTab === 'formulas' && (
          <FormulasTab locale={stats.locale} />
        )}
        {activeTab === 'shop' && (
          <ShopTab
            stats={stats}
            locale={stats.locale}
            onUpdateStats={handleUpdateStats}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileTab
            stats={stats}
            locale={stats.locale}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile / Centered Bar for Desktop */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gv-surface/95 backdrop-blur-md border-t border-gv-border px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.play('tap');
                  setActiveTab(item.id);
                }}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-gv-accent scale-105 font-bold'
                    : 'text-gv-muted hover:text-gv-text'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <LessonModal
          levelFile={activeLesson.file}
          levelRef={activeLesson.ref}
          stats={stats}
          locale={stats.locale}
          onClose={() => setActiveLesson(null)}
          onCompleteLevel={handleCompleteLevel}
          onLoseLife={handleLoseLife}
        />
      )}
    </div>
  );
};
