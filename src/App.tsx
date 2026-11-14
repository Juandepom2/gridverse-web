import React, { useState, useEffect, useRef } from 'react';
import { Map, Zap, BookOpen, ShoppingBag, User } from 'lucide-react';
import { UserStats } from './types';
import { loadUserStats, saveUserStats, markLevelCompleted } from './lib/storage';
import { MOCK_REGIONS } from './data/mapData';
import { Header } from './components/Header';
import { MapTab } from './components/tabs/MapTab';
import { PracticeTab } from './components/tabs/PracticeTab';
import { FormulasTab } from './components/tabs/FormulasTab';
import { ShopTab } from './components/tabs/ShopTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { LessonModal } from './components/LessonModal';
import { sound } from './lib/audio';
import {
  auth,
  db,
  parseFirestoreUserToStats,
  syncStatsToFirestore,
  verifyAndSyncProAndLegacyProfile,
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [activeTab, setActiveTab] = useState<'map' | 'practice' | 'formulas' | 'shop' | 'profile'>('map');
  const [activeLesson, setActiveLesson] = useState<{ ref: string; file: string } | null>(null);
  const checkedProForUidRef = useRef<string | null>(null);

  useEffect(() => {
    sound.setSfxEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Real-time Firebase Auth + Firestore `users/{uid}` + RevenueCat PRO synchronization
  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }

      if (!user) {
        checkedProForUidRef.current = null;
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      unsubFirestore = onSnapshot(
        userDocRef,
        async (snapshot) => {
          const docData = snapshot.exists() ? snapshot.data() : undefined;

          if (docData) {
            setStats((prev) => {
              const nextStats = parseFirestoreUserToStats(docData, prev);
              saveUserStats(nextStats);
              return nextStats;
            });
          }

          // Verify RevenueCat entitlement & legacy/duo profile once per signed-in user session
          if (checkedProForUidRef.current !== user.uid) {
            checkedProForUidRef.current = user.uid;
            const proVerification = await verifyAndSyncProAndLegacyProfile(user, docData);
            if (proVerification.isPro || proVerification.mergedData) {
              setStats((prev) => {
                const base = proVerification.mergedData
                  ? parseFirestoreUserToStats(proVerification.mergedData, prev)
                  : prev;
                const updated: UserStats = {
                  ...base,
                  isPro: proVerification.isPro || base.isPro,
                  subscriptionPlan:
                    proVerification.planName || base.subscriptionPlan || (proVerification.isPro ? 'lifetime' : undefined),
                  lives: proVerification.isPro || base.isPro ? 5 : base.lives,
                };
                saveUserStats(updated);
                return updated;
              });
            }
          }
        },
        (error) => {
          console.warn('[Firestore] Error watching user doc:', error);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  // Sync state changes with localStorage and Firestore
  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    saveUserStats(newStats);
    if (auth.currentUser) {
      syncStatsToFirestore(auth.currentUser.uid, newStats, auth.currentUser);
    }
  };

  const handleSelectLevel = (ref: string, file: string) => {
    if (!stats.isPro && stats.lives <= 0) {
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
    const allRefs = MOCK_REGIONS.flatMap((r) => r.levels.map((l) => l.ref));
    const currIdx = allRefs.indexOf(levelRef);
    const nextRef =
      currIdx >= 0 && currIdx < allRefs.length - 1 ? allRefs[currIdx + 1] : undefined;
    const updated = markLevelCompleted(stats, levelRef, stars, earnedXp, nextRef);
    setStats(updated);
    if (auth.currentUser) {
      syncStatsToFirestore(auth.currentUser.uid, updated, auth.currentUser);
    }
  };

  const handleLoseLife = () => {
    setStats((prev) => {
      if (prev.isPro) return prev;
      const nextLives = Math.max(0, prev.lives - 1);
      const updated = { ...prev, lives: nextLives };
      saveUserStats(updated);
      if (auth.currentUser) {
        syncStatsToFirestore(auth.currentUser.uid, updated, auth.currentUser);
      }
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
      if (auth.currentUser) {
        syncStatsToFirestore(auth.currentUser.uid, updated, auth.currentUser);
      }
      return updated;
    });
  };

  const handleClaimChest = (chestRef: string, gems: number, nextRef: string) => {
    sound.play('coin');
    setStats((prev) => {
      const updated = {
        ...prev,
        gems: prev.gems + gems,
        completedLevels: {
          ...prev.completedLevels,
          [chestRef]: { stars: 1, completedAt: new Date().toISOString() },
        },
        unlockedLevel: nextRef,
      };
      saveUserStats(updated);
      if (auth.currentUser) {
        syncStatsToFirestore(auth.currentUser.uid, updated, auth.currentUser);
      }
      return updated;
    });
    alert(
      stats.locale === 'es'
        ? `¡Has abierto el cofre ${chestRef} y ganado +${gems} Gemas 💎!`
        : `You opened chest ${chestRef} and gained +${gems} Gems 💎!`
    );
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
            onNavigateTab={(t) => setActiveTab(t as any)}
            onClaimChest={handleClaimChest}
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
