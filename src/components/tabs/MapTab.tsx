import React from 'react';
import { MOCK_REGIONS, RegionItem, LevelItem } from '../../data/mapData';
import { SupportedLocale, UserStats } from '../../types';
import { LevelNode } from '../map/LevelNode';
import { OnboardingChecklist } from '../map/OnboardingChecklist';

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
  // Determine status for each level
  const getLevelStatus = (lvlRef: string): 'done' | 'current' | 'locked' => {
    if (stats.completedLevels[lvlRef]) return 'done';
    if (stats.unlockedLevel === lvlRef || (stats.unlockedLevel === 'A1' && lvlRef === 'A1')) {
      return 'current';
    }
    return 'locked';
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center py-6 px-4">
      {/* Onboarding Checklist Banner like mobile app */}
      <OnboardingChecklist
        stats={stats}
        locale={locale}
        onNavigateTab={onNavigateTab}
      />

      {/* 12 Regions in snake path */}
      <div className="w-full flex flex-col gap-12">
        {MOCK_REGIONS.map((region, rIdx) => {
          const title = region.titleByLocale[locale] || region.title;
          const subtitle = region.subtitleByLocale[locale] || region.subtitle;
          const completedInRegion = region.levels.filter(
            (l) => Boolean(stats.completedLevels[l.ref])
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
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-lg text-black shadow-md shrink-0"
                    style={{ backgroundColor: region.color }}
                  >
                    {region.column}
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block"
                      style={{ color: region.color }}
                    >
                      {locale === 'es' ? `Región ${region.column}` : `Region ${region.column}`}
                    </span>
                    <h2 className="text-sm md:text-base font-black text-gv-text leading-tight">
                      {title}
                    </h2>
                    <p className="text-[11px] text-gv-muted mt-0.5 line-clamp-1">{subtitle}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/10"
                    style={{ color: region.color }}
                  >
                    {completedInRegion}/{region.levels.length}
                  </span>
                </div>
              </div>

              {/* Vertical Zig-Zag Snake Nodes */}
              <div className="w-full flex flex-col items-center gap-6 py-2">
                {region.levels.map((lvl, lIdx) => {
                  const status = getLevelStatus(lvl.ref);
                  const stars = stats.completedLevels[lvl.ref]?.stars ?? 0;
                  const xOffset = ZIGZAG_OFFSETS[lIdx % ZIGZAG_OFFSETS.length];
                  const file = `${lvl.ref.toLowerCase()}.json`;

                  return (
                    <div
                      key={lvl.ref}
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
                            const allRefs = MOCK_REGIONS.flatMap((r) => r.levels.map((l) => l.ref));
                            const currIdx = allRefs.indexOf(lvl.ref);
                            const nextRef = currIdx >= 0 && currIdx < allRefs.length - 1 ? allRefs[currIdx + 1] : lvl.ref;
                            onClaimChest(lvl.ref, 50, nextRef);
                          } else {
                            onSelectLevel(lvl.ref, file);
                          }
                        }}
                      />
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
