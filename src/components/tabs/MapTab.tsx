import React, { useMemo, useEffect, useRef } from 'react';
import { MOCK_REGIONS } from '../../data/mapData';
import { SupportedLocale, UserStats } from '../../types';
import { LevelNode } from '../map/LevelNode';
import { OnboardingChecklist } from '../map/OnboardingChecklist';
import { CeldiMascot } from '../CeldiMascot';

interface MapTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onSelectLevel: (levelRef: string, file: string) => void;
  onNavigateTab: (tab: string) => void;
  onClaimChest: (chestRef: string, gems: number, nextRef: string) => void;
}

// Zig-zag horizontal offsets replicating Flutter app _zigzag = [0.0, 0.55, 0.85, 0.55, 0.0, -0.55, -0.85, -0.55]
const ZIGZAG_OFFSETS = [0, 48, 80, 48, 0, -48, -80, -48];

export const MapTab: React.FC<MapTabProps> = ({
  stats,
  locale,
  onSelectLevel,
  onNavigateTab,
  onClaimChest,
}) => {
  const activeNodeRef = useRef<HTMLDivElement | null>(null);
  const lastScrolledRef = useRef<string | null>(null);

  const allRefs = useMemo(
    () => MOCK_REGIONS.flatMap((r) => r.levels.map((l) => l.ref.toUpperCase())),
    []
  );

  // Normalize completedLevels keys to uppercase
  const normCompleted = useMemo(() => {
    const map: Record<string, number> = {};
    for (const [k, v] of Object.entries(stats.completedLevels)) {
      const stars = typeof v === 'number' ? v : (v?.stars ?? 3);
      map[k.toUpperCase()] = stars;
    }
    return map;
  }, [stats.completedLevels]);

  // Compute effectiveCurrent matching Flutter's `buildRegionsWithProgress`
  const { effectiveCurrent, currentIndex } = useMemo(() => {
    const normCurrent = (stats.unlockedLevel || 'A1').toUpperCase();
    const normCurrentIdx = allRefs.indexOf(normCurrent);

    let highestCompletedIdx = -1;
    for (let i = 0; i < allRefs.length; i++) {
      if (normCompleted[allRefs[i]] !== undefined) {
        highestCompletedIdx = i;
      }
    }

    let nextPendingAfterProgress: string | undefined;
    const searchStart = Math.max(normCurrentIdx, highestCompletedIdx) + 1;
    for (let i = Math.max(0, searchStart); i < allRefs.length; i++) {
      if (normCompleted[allRefs[i]] === undefined) {
        nextPendingAfterProgress = allRefs[i];
        break;
      }
    }

    let firstPendingRef: string | undefined;
    for (const r of allRefs) {
      if (normCompleted[r] === undefined) {
        firstPendingRef = r;
        break;
      }
    }

    const eff =
      normCurrent && normCompleted[normCurrent] === undefined
        ? normCurrent
        : nextPendingAfterProgress || firstPendingRef || allRefs[allRefs.length - 1] || 'A1';

    return {
      effectiveCurrent: eff,
      currentIndex: allRefs.indexOf(eff),
    };
  }, [allRefs, normCompleted, stats.unlockedLevel]);

  // Auto-scroll to current active level when user is past A2 (e.g. synced at E2 / Level 30+)
  useEffect(() => {
    if (
      effectiveCurrent &&
      effectiveCurrent !== 'A1' &&
      lastScrolledRef.current !== effectiveCurrent &&
      activeNodeRef.current
    ) {
      lastScrolledRef.current = effectiveCurrent;
      const timer = setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [effectiveCurrent]);

  const getLevelStatusAndStars = (
    lvlRef: string,
    lvlType?: string
  ): { status: 'done' | 'current' | 'locked'; stars: number } => {
    const normRef = lvlRef.toUpperCase();
    const lvlIndex = allRefs.indexOf(normRef);
    const isExplicitlyDone = normCompleted[normRef] !== undefined;
    const isPastLevel = currentIndex >= 0 && lvlIndex >= 0 && lvlIndex < currentIndex;
    const isDone = isExplicitlyDone || isPastLevel;

    const prevRef = lvlIndex > 0 ? allRefs[lvlIndex - 1] : null;
    const isPrevDone =
      prevRef !== null &&
      (normCompleted[prevRef] !== undefined ||
        (currentIndex >= 0 && lvlIndex - 1 < currentIndex));

    const isUnlocked =
      isDone || lvlIndex === 0 || isPrevDone || normRef === effectiveCurrent;
    const isCurrent = normRef === effectiveCurrent;

    let status: 'done' | 'current' | 'locked' = 'locked';
    if (isCurrent && !isDone) {
      status = 'current';
    } else if (isDone) {
      status = 'done';
    } else if (isUnlocked) {
      status = 'current';
    }

    const stars = isExplicitlyDone
      ? normCompleted[normRef]
      : isPastLevel
      ? lvlType === 'chest'
        ? 1
        : 3
      : 0;

    return { status, stars };
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center py-6 px-4">
      {/* Onboarding Checklist Banner like mobile app (auto-hides once completed) */}
      <OnboardingChecklist
        stats={stats}
        locale={locale}
        onNavigateTab={onNavigateTab}
      />

      {/* 12 Regions in snake path */}
      <div className="w-full flex flex-col gap-12">
        {MOCK_REGIONS.map((region) => {
          const title = region.titleByLocale[locale] || region.title;
          const subtitle = region.subtitleByLocale[locale] || region.subtitle;
          const completedInRegion = region.levels.filter(
            (l) => getLevelStatusAndStars(l.ref, l.type).status === 'done'
          ).length;

          return (
            <div key={region.column} className="flex flex-col items-center w-full">
              {/* Region Pinned Header Card */}
              <div
                className="w-full sticky top-14 z-20 rounded-2xl p-4 shadow-xl border flex items-center justify-between gap-3 mb-8 backdrop-blur-md transition-all"
                style={{
                  backgroundColor: `${region.color}18`,
                  borderColor: `${region.color}50`,
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-mono font-black text-xl text-white shadow-md shrink-0"
                    style={{ backgroundColor: region.color }}
                  >
                    {region.column}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block"
                      style={{ color: region.color }}
                    >
                      {locale === 'es' ? `Columna ${region.column}` : `Column ${region.column}`}
                    </span>
                    <h2 className="text-sm md:text-base font-black text-gv-text leading-tight truncate">
                      {title}
                    </h2>
                    <p className="text-[11px] text-gv-muted mt-0.5 line-clamp-1">{subtitle}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/40 border border-white/10"
                    style={{ color: region.color }}
                  >
                    {completedInRegion}/{region.levels.length}
                  </span>
                </div>
              </div>

              {/* Vertical Zig-Zag Snake Nodes */}
              <div className="w-full flex flex-col items-center gap-6 py-2">
                {region.levels.map((lvl, lIdx) => {
                  const { status, stars } = getLevelStatusAndStars(lvl.ref, lvl.type);
                  const isCurrent = lvl.ref.toUpperCase() === effectiveCurrent;
                  const xOffset = ZIGZAG_OFFSETS[lIdx % ZIGZAG_OFFSETS.length];
                  const celdiOffset = xOffset >= 0 ? xOffset - 82 : xOffset + 82;
                  const file = `${lvl.ref.toLowerCase()}.json`;

                  return (
                    <div
                      key={lvl.ref}
                      ref={isCurrent ? activeNodeRef : undefined}
                      className="relative flex items-center justify-center w-full"
                    >
                      <div
                        style={{
                          transform: `translateX(${xOffset}px)`,
                        }}
                        className="transition-transform duration-300"
                      >
                        <LevelNode
                          level={lvl}
                          color={region.color}
                          status={status}
                          stars={stars}
                          locale={locale}
                          onTap={() => {
                            if (lvl.type === 'chest') {
                              const currIdx = allRefs.indexOf(lvl.ref.toUpperCase());
                              const nextRef =
                                currIdx >= 0 && currIdx < allRefs.length - 1
                                  ? allRefs[currIdx + 1]
                                  : lvl.ref;
                              onClaimChest(lvl.ref, 50, nextRef);
                            } else {
                              onSelectLevel(lvl.ref, file);
                            }
                          }}
                        />
                      </div>

                      {/* Celdi companion standing next to active node (matching Flutter map_screen.dart) */}
                      {isCurrent && (
                        <div
                          style={{
                            transform: `translateX(${celdiOffset}px)`,
                          }}
                          className="absolute pointer-events-auto cursor-pointer transition-transform duration-300"
                          onClick={() => onSelectLevel(lvl.ref, file)}
                        >
                          <CeldiMascot mood="happy" size={64} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
