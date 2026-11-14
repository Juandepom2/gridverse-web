import confetti from 'canvas-confetti';
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
import { tr, UI_STRINGS } from './lib/i18n';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

const LIFE_REGEN_MS = 20 * 60 * 1000; // 20 minutes per life

export const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [activeTab, setActiveTab] = useState<'map' | 'practice' | 'formulas' | 'shop' | 'profile'>(
    'map'
  );
  const [activeLesson, setActiveLesson] = useState<{ ref: string; file: string } | null>(null);
  const [showLivesModal, setShowLivesModal] = useState(false);
  const [nextLifeFormatted, setNextLifeFormatted] = useState<string | null>(null);
  const checkedProForUidRef = useRef<string | null>(null);

  useEffect(() => {
    sound.setSfxEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Handle Stripe Checkout return (?checkout_success=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout_success') === 'true') {
      const sessionId = params.get('session_id') || '';
      const pendingPlan = localStorage.getItem('gridverse_pending_checkout_plan') || 'annual';

      sound.play('coin');
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
      });

      setStats((prev) => {
        const updated: UserStats = {
          ...prev,
          isPro: true,
          subscriptionPlan: pendingPlan,
          lives: 5,
        };
        saveUserStats(updated);
        return updated;
      });

      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        setDoc(
          userDocRef,
          {
            isPro: true,
            subscriptionPlan: pendingPlan,
            stripeSessionId: sessionId,
            integrity: 5,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        ).catch((err) => console.warn('[StripeReturn] Error saving PRO to Firestore:', err));
      }

      window.history.replaceState({}, '', window.location.pathname);
      setActiveTab('shop');
    }
  }, []);

  // Automatic 20-minute life regeneration timer (matching Flutter LivesService)
  useEffect(() => {
    if (stats.isPro || stats.lives >= 5) {
      localStorage.removeItem('gridverse_next_life_at');
      setNextLifeFormatted(null);
      return;
    }

    let nextAt = Number(localStorage.getItem('gridverse_next_life_at') || '0');
    if (!nextAt || nextAt <= Date.now() - LIFE_REGEN_MS * 5) {
      nextAt = Date.now() + LIFE_REGEN_MS;
      localStorage.setItem('gridverse_next_life_at', String(nextAt));
    }

    const tick = () => {
      const target = Number(localStorage.getItem('gridverse_next_life_at') || '0');
      if (!target) return;
      const diff = target - Date.now();
      if (diff <= 0) {
        setStats((prev) => {
          if (prev.isPro || prev.lives >= 5) return prev;
          const nextLives = Math.min(5, prev.lives + 1);
          if (nextLives < 5) {
            localStorage.setItem('gridverse_next_life_at', String(Date.now() + LIFE_REGEN_MS));
          } else {
            localStorage.removeItem('gridverse_next_life_at');
          }
          const updated = { ...prev, lives: nextLives };
          saveUserStats(updated);
          if (auth.currentUser) {
            syncStatsToFirestore(auth.currentUser.uid, updated, auth.currentUser);
          }
          return updated;
        });
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setNextLifeFormatted(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [stats.isPro, stats.lives]);

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
                    proVerification.planName ||
                    base.subscriptionPlan ||
                    (proVerification.isPro ? 'lifetime' : undefined),
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
      sound.play('wrong');
      setShowLivesModal(true);
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
      if (prev.lives === 5 && nextLives < 5) {
        localStorage.setItem('gridverse_next_life_at', String(Date.now() + LIFE_REGEN_MS));
      }
      const updated = { ...prev, lives: nextLives };
      saveUserStats(updated);
      if (auth.currentUser) {
        syncStatsToFirestore(auth.currentUser.uid, updated, auth.currentUser);
      }
      return updated;
    });
  };

  const handleReward = (xp: number, gems: number, completedRef?: string) => {
    setStats((prev) => {
      const updatedCompleted = completedRef
        ? {
            ...prev.completedLevels,
            [completedRef]: { stars: 3, completedAt: new Date().toISOString() },
          }
        : prev.completedLevels;

      const updated: UserStats = {
        ...prev,
        xp: prev.xp + xp,
        gems: prev.gems + gems,
        completedLevels: updatedCompleted,
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
  };

  const navItems = [
    { id: 'map', label: tr(stats.locale, UI_STRINGS.nav.map), icon: Map },
    { id: 'practice', label: tr(stats.locale, UI_STRINGS.nav.practice), icon: Zap },
    { id: 'formulas', label: tr(stats.locale, UI_STRINGS.nav.formulas), icon: BookOpen },
    { id: 'shop', label: tr(stats.locale, UI_STRINGS.nav.shop), icon: ShoppingBag },
    { id: 'profile', label: tr(stats.locale, UI_STRINGS.nav.profile), icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-gv-bg text-gv-text flex flex-col spreadsheet-grid-bg">
      {/* Top Header */}
      <Header
        stats={stats}
        onUpdateStats={handleUpdateStats}
        activeTab={activeTab}
        onChangeTab={(t) => setActiveTab(t as any)}
        nextLifeFormatted={nextLifeFormatted}
        showLivesModal={showLivesModal}
        onToggleLivesModal={setShowLivesModal}
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
            onLoseLife={handleLoseLife}
            onNavigateTab={(t) => setActiveTab(t as any)}
          />
        )}
        {activeTab === 'formulas' && <FormulasTab locale={stats.locale} />}
        {activeTab === 'shop' && (
          <ShopTab
            stats={stats}
            locale={stats.locale}
            onUpdateStats={handleUpdateStats}
            onNavigateTab={(t) => setActiveTab(t as any)}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileTab
            stats={stats}
            locale={stats.locale}
            onUpdateStats={handleUpdateStats}
            onNavigateTab={(t) => setActiveTab(t as any)}
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
