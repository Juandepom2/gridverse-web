import confetti from 'canvas-confetti';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Map, Zap, BookOpen, ShoppingBag, User, Crown, X } from 'lucide-react';
import { UserStats, LevelData } from './types';
import { loadUserStats, saveUserStats, markLevelCompleted } from './lib/storage';
import { MOCK_REGIONS, RegionItem } from './data/mapData';
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
  syncWeeklyLeagueEntry,
  fetchDynamicFirestoreLevels,
  verifyAndSyncProAndLegacyProfile,
} from './lib/firebase';
import { tr, UI_STRINGS } from './lib/i18n';
import { applyTheme, getInitialTheme } from './lib/theme';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

const LIFE_REGEN_MS = 20 * 60 * 1000; // 20 minutes per life

export const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [activeTab, setActiveTab] = useState<'map' | 'practice' | 'formulas' | 'shop' | 'profile'>(
    () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (
          tabParam === 'shop' ||
          tabParam === 'profile' ||
          tabParam === 'practice' ||
          tabParam === 'formulas' ||
          tabParam === 'map'
        ) {
          return tabParam;
        }
        if (params.get('category') || params.get('tier')) {
          return 'shop';
        }
      }
      return 'map';
    }
  );
  const [activeLesson, setActiveLesson] = useState<{ ref: string; file: string } | null>(null);
  const [showLivesModal, setShowLivesModal] = useState(false);
  const [proPaywallLevel, setProPaywallLevel] = useState<string | null>(null);
  const [nextLifeFormatted, setNextLifeFormatted] = useState<string | null>(null);
  const [dynamicLevels, setDynamicLevels] = useState<LevelData[]>([]);
  const checkedProForUidRef = useRef<string | null>(null);

  useEffect(() => {
    fetchDynamicFirestoreLevels().then((levels) => {
      if (levels.length > 0) setDynamicLevels(levels);
    });
  }, []);

  const mergedRegions: RegionItem[] = useMemo(() => {
    if (dynamicLevels.length === 0) return MOCK_REGIONS;
    const existingRefs = new Set(
      MOCK_REGIONS.flatMap((r) => r.levels.map((l) => l.ref.toUpperCase()))
    );
    const extra = dynamicLevels.filter((d) => !existingRefs.has(d.ref.toUpperCase()));
    if (extra.length === 0) return MOCK_REGIONS;

    const cloned: RegionItem[] = MOCK_REGIONS.map((r) => ({
      ...r,
      levels: [...r.levels],
    }));

    for (const dyn of extra) {
      const colPrefix = dyn.ref.charAt(0).toUpperCase();
      const targetRegion =
        cloned.find((r) => r.column.toUpperCase() === colPrefix) || cloned[cloned.length - 1];
      const isProLevel =
        Boolean(targetRegion.isProOnly) || dyn.title.toUpperCase().includes('PRO');
      targetRegion.levels.push({
        ref: dyn.ref,
        title: dyn.title,
        titleByLocale: dyn.titleByLocale || {
          es: dyn.title,
          en: dyn.title,
          de: dyn.title,
          fr: dyn.title,
          ja: dyn.title,
          pt: dyn.title,
        },
        isProOnly: isProLevel,
      });
    }
    return cloned;
  }, [dynamicLevels]);

  useEffect(() => {
    sound.setSfxEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  useEffect(() => {
    applyTheme(stats.theme || getInitialTheme());
  }, [stats.theme]);

  useEffect(() => {
    document.documentElement.lang = stats.locale || 'es';
  }, [stats.locale]);

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
    const levelMeta = mergedRegions.flatMap((r) => r.levels).find(
      (l) => l.ref.toUpperCase() === ref.toUpperCase()
    );
    if (levelMeta?.isProOnly && !stats.isPro) {
      sound.play('hint');
      setActiveLesson(null);
      setProPaywallLevel(levelMeta.titleByLocale?.[stats.locale] ?? levelMeta.title);
      return;
    }
    if (!stats.isPro && stats.lives <= 0) {
      sound.play('wrong');
      setShowLivesModal(true);
      return;
    }
    setActiveLesson({ ref, file });
  };

  const handleCompleteLevel = (levelRef: string, stars: number, earnedXp: number) => {
    const allRefs = mergedRegions.flatMap((r) => r.levels.map((l) => l.ref));
    const currIdx = allRefs.indexOf(levelRef);
    const nextRef =
      currIdx >= 0 && currIdx < allRefs.length - 1 ? allRefs[currIdx + 1] : undefined;
    const updated = markLevelCompleted(stats, levelRef, stars, earnedXp, nextRef);
    setStats(updated);
    if (auth.currentUser) {
      syncStatsToFirestore(auth.currentUser.uid, updated, auth.currentUser);
      syncWeeklyLeagueEntry(auth.currentUser.uid, updated, earnedXp, auth.currentUser);
    }
  };

  const handleClaimBonus = (bonusGems: number, bonusXp: number) => {
    setStats((prev) => {
      const updated = {
        ...prev,
        gems: prev.gems + bonusGems,
        xp: prev.xp + bonusXp,
      };
      saveUserStats(updated);
      if (auth.currentUser) {
        syncStatsToFirestore(auth.currentUser.uid, updated, auth.currentUser);
        if (bonusXp > 0) {
          syncWeeklyLeagueEntry(auth.currentUser.uid, updated, bonusXp, auth.currentUser);
        }
      }
      return updated;
    });
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
        if (xp > 0) {
          syncWeeklyLeagueEntry(auth.currentUser.uid, updated, xp, auth.currentUser);
        }
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
      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'map' && (
          <MapTab
            stats={stats}
            locale={stats.locale}
            regions={mergedRegions}
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
            onUpdateStats={handleUpdateStats}
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gv-surface/95 backdrop-blur-md border-t border-gv-border px-2 sm:px-4 pt-2 pb-safe">
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
                className={`flex flex-col items-center gap-1 py-1 px-2 sm:px-3 min-w-0 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-gv-accent scale-105 font-bold'
                    : 'text-gv-muted hover:text-gv-text'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] tracking-tight truncate max-w-[64px] sm:max-w-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Interactive Lesson Modal */}
      {activeLesson && (() => {
        const allLevels = mergedRegions.flatMap((r) => r.levels);
        const currIdx = allLevels.findIndex(
          (l) => l.ref.toUpperCase() === activeLesson.ref.toUpperCase()
        );
        const nextPlayable =
          currIdx >= 0
            ? allLevels.slice(currIdx + 1).find((l) => l.type !== 'chest')
            : undefined;

        return (
          <LessonModal
            key={activeLesson.ref}
            levelFile={activeLesson.file}
            levelRef={activeLesson.ref}
            stats={stats}
            locale={stats.locale}
            onClose={() => setActiveLesson(null)}
            onCompleteLevel={handleCompleteLevel}
            onLoseLife={handleLoseLife}
            onClaimBonus={handleClaimBonus}
            nextLevelFile={nextPlayable ? `${nextPlayable.ref.toLowerCase()}.json` : undefined}
            onNextLevel={
              nextPlayable
                ? () =>
                    handleSelectLevel(
                      nextPlayable.ref,
                      `${nextPlayable.ref.toLowerCase()}.json`
                    )
                : undefined
            }
          />
        );
      })()}

      {/* PRO Exclusive Content Paywall Modal */}
      {proPaywallLevel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gv-surface border-2 border-gv-warning/60 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setProPaywallLevel(null)}
              className="absolute top-4 right-4 text-gv-muted hover:text-gv-text cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gv-warning/15 border border-gv-warning/40 flex items-center justify-center text-gv-warning">
              <Crown className="w-7 h-7 fill-gv-warning" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-gv-warning">
                {tr(stats.locale, {
                  es: 'Contenido Exclusivo PRO',
                  en: 'PRO Exclusive Content',
                  de: 'Exklusiver PRO-Inhalt',
                  fr: 'Contenu Exclusif PRO',
                  ja: 'PRO限定コンテンツ',
                  pt: 'Conteúdo Exclusivo PRO',
                })}
              </span>
              <h3 className="text-lg font-black text-gv-text">{proPaywallLevel}</h3>
              <p className="text-xs text-gv-muted leading-relaxed">
                {tr(stats.locale, {
                  es: 'Desbloquea el Jefe Final (L6), todo el Mundo M (Power Query, VBA, Python en Excel), cursos ejecutivos, vidas infinitas y certificado oficial.',
                  en: 'Unlock Final Boss (L6), the entire World M (Power Query, VBA, Python in Excel), executive courses, unlimited lives, and your official certificate.',
                  de: 'Schalte den Endboss (L6), Welt M (Power Query, VBA, Python), Executive-Kurse, unbegrenzte Leben und dein Zertifikat frei.',
                  fr: 'Débloque le Boss Final (L6), le Monde M (Power Query, VBA, Python), les cours exécutifs, les vies infinies et le certificat officiel.',
                  ja: '最終ボス(L6)、ワールドM（Power Query・VBA・Python）、上級コース、ライフ無限、公式認定証をすべてアンロック。',
                  pt: 'Desbloqueie o Chefe Final (L6), todo o Mundo M (Power Query, VBA, Python), cursos executivos, vidas infinitas e certificado oficial.',
                })}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setProPaywallLevel(null);
                  setActiveTab('shop');
                }}
                className="w-full py-3 rounded-xl bg-gv-warning hover:brightness-110 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                {tr(stats.locale, {
                  es: 'Desbloquear con Gridverse PRO →',
                  en: 'Unlock with Gridverse PRO →',
                  de: 'Mit Gridverse PRO freischalten →',
                  fr: 'Débloquer avec Gridverse PRO →',
                  ja: 'Gridverse PROでアンロック →',
                  pt: 'Desbloquear com Gridverse PRO →',
                })}
              </button>
              <button
                type="button"
                onClick={() => setProPaywallLevel(null)}
                className="w-full py-2 text-xs font-bold text-gv-muted hover:text-gv-text cursor-pointer"
              >
                {tr(stats.locale, {
                  es: 'Ahora no',
                  en: 'Not now',
                  de: 'Nicht jetzt',
                  fr: 'Pas maintenant',
                  ja: '今はしない',
                  pt: 'Agora não',
                })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
