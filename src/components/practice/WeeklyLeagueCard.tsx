import React, { useMemo, useState, useEffect } from 'react';
import {
  Trophy,
  ArrowUp,
  ArrowDown,
  Flame,
  Clock,
  Crown,
  AlertTriangle,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';
import {
  auth,
  fetchWeeklyLeagueStandings,
  syncWeeklyLeagueEntry,
  FirestoreLeagueEntry,
} from '../../lib/firebase';
import { tr } from '../../lib/i18n';

interface WeeklyLeagueCardProps {
  stats: UserStats;
  locale: SupportedLocale;
  onQuickTrain?: () => void;
}

interface LeagueTier {
  id: string;
  name: Record<SupportedLocale, string>;
  minXp: number;
  accentClass: string;
  badgeBgClass: string;
}

const LEAGUE_TIERS: LeagueTier[] = [
  {
    id: 'bronze',
    name: {
      es: 'Liga Bronce',
      en: 'Bronze League',
      de: 'Bronze-Liga',
      fr: 'Ligue Bronze',
      ja: 'ブロンズリーグ',
      pt: 'Liga Bronze',
    },
    minXp: 0,
    accentClass: 'text-gv-streak',
    badgeBgClass: 'bg-gv-streak/15 border-gv-streak/40',
  },
  {
    id: 'silver',
    name: {
      es: 'Liga Plata',
      en: 'Silver League',
      de: 'Silber-Liga',
      fr: 'Ligue Argent',
      ja: 'シルバーリーグ',
      pt: 'Liga Prata',
    },
    minXp: 150,
    accentClass: 'text-gv-info',
    badgeBgClass: 'bg-gv-info/15 border-gv-info/40',
  },
  {
    id: 'gold',
    name: {
      es: 'Liga Oro',
      en: 'Gold League',
      de: 'Gold-Liga',
      fr: 'Ligue Or',
      ja: 'ゴールドリーグ',
      pt: 'Liga Ouro',
    },
    minXp: 400,
    accentClass: 'text-gv-warning',
    badgeBgClass: 'bg-gv-warning/15 border-gv-warning/40',
  },
  {
    id: 'diamond',
    name: {
      es: 'Liga Diamante',
      en: 'Diamond League',
      de: 'Diamant-Liga',
      fr: 'Ligue Diamant',
      ja: 'ダイヤモンドリーグ',
      pt: 'Liga Diamante',
    },
    minXp: 900,
    accentClass: 'text-gv-bytes',
    badgeBgClass: 'bg-gv-bytes/15 border-gv-bytes/40',
  },
  {
    id: 'master',
    name: {
      es: 'Maestro Grid',
      en: 'Grid Master',
      de: 'Grid-Meister',
      fr: 'Maître Grid',
      ja: 'グリッドマスター',
      pt: 'Mestre Grid',
    },
    minXp: 1800,
    accentClass: 'text-gv-boss',
    badgeBgClass: 'bg-gv-boss/15 border-gv-boss/40',
  },
];

const PEER_PROFILES = [
  { name: 'Valeria M.', avatar: '👩‍💻', streak: 14, offset: 85, trend: 1 },
  { name: 'Mateo R.', avatar: '📊', streak: 9, offset: 45, trend: 2 },
  { name: 'Sofía K.', avatar: '⚡', streak: 19, offset: 20, trend: 0 },
  { name: 'Lucas D.', avatar: '🧮', streak: 5, offset: -15, trend: -1 },
  { name: 'Elena V.', avatar: '📈', streak: 11, offset: -45, trend: 1 },
  { name: 'Diego P.', avatar: '🔢', streak: 3, offset: -75, trend: -2 },
  { name: 'Camila S.', avatar: '💡', streak: 2, offset: -110, trend: -1 },
];

function getDaysUntilSundayReset(): number {
  const day = new Date().getDay();
  return day === 0 ? 1 : 7 - day;
}

export const WeeklyLeagueCard: React.FC<WeeklyLeagueCardProps> = ({
  stats,
  locale,
  onQuickTrain,
}) => {
  const { currentTier, nextTier } = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < LEAGUE_TIERS.length; i++) {
      if (stats.xp >= LEAGUE_TIERS[i].minXp) idx = i;
    }
    return {
      currentTier: LEAGUE_TIERS[idx],
      nextTier: idx < LEAGUE_TIERS.length - 1 ? LEAGUE_TIERS[idx + 1] : null,
    };
  }, [stats.xp]);

  const userName =
    stats.displayName?.trim() ||
    tr(locale, {
      es: 'Tú',
      en: 'You',
      de: 'Du',
      fr: 'Toi',
      ja: 'あなた',
      pt: 'Você',
    });

  const [cloudEntries, setCloudEntries] = useState<FirestoreLeagueEntry[] | null>(null);
  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    let active = true;
    async function loadLeague() {
      const user = auth.currentUser;
      if (!user) {
        setCloudEntries(null);
        return;
      }
      await syncWeeklyLeagueEntry(user.uid, stats, 0, user);
      const list = await fetchWeeklyLeagueStandings();
      if (active && list.length > 0) {
        setCloudEntries(list);
      }
    }
    loadLeague();
    return () => {
      active = false;
    };
  }, [currentUid, stats.xp, stats.streak]);

  const standings = useMemo(() => {
    if (cloudEntries && cloudEntries.length > 0 && currentUid) {
      const realRows = cloudEntries.map((entry) => ({
        id: entry.uid,
        name: entry.uid === currentUid ? userName : entry.displayName,
        avatar: entry.uid === currentUid ? '🦖' : '📊',
        streak: entry.streakDays,
        xp: entry.weeklyXp,
        trend: 0,
        isUser: entry.uid === currentUid,
      }));

      // Pad up to 8 rows if fewer than 8 real players have joined this week
      const myRow = realRows.find((r) => r.isUser);
      const anchorXp = myRow ? myRow.xp : 0;
      const neededPeers = Math.max(0, 8 - realRows.length);
      const paddedPeers = PEER_PROFILES.slice(0, neededPeers).map((p, i) => ({
        id: `peer_${i}`,
        name: p.name,
        avatar: p.avatar,
        streak: p.streak,
        xp: Math.max(5, anchorXp + p.offset),
        trend: p.trend,
        isUser: false,
      }));

      return [...realRows, ...paddedPeers].sort((a, b) => b.xp - a.xp).slice(0, 12);
    }

    const baseXp = Math.max(40, Math.floor(stats.xp / 25) * 25);
    const peers = PEER_PROFILES.map((p, i) => ({
      id: `peer_${i}`,
      name: p.name,
      avatar: p.avatar,
      streak: p.streak,
      xp: Math.max(10, baseXp + p.offset),
      trend: p.trend,
      isUser: false,
    }));

    const selfEntry = {
      id: 'user_self',
      name: userName,
      avatar: '🦖',
      streak: stats.streak,
      xp: stats.xp,
      trend: stats.xp > baseXp ? 2 : stats.xp < baseXp - 50 ? -1 : 0,
      isUser: true,
    };

    return [...peers, selfEntry].sort((a, b) => b.xp - a.xp);
  }, [cloudEntries, currentUid, stats.xp, stats.streak, userName]);

  const userRank = standings.findIndex((s) => s.isUser) + 1;
  const userScoreXp = standings.find((s) => s.isUser)?.xp ?? stats.xp;
  const leaderXp = Math.max(1, standings[0]?.xp ?? 100);
  const secondPlaceXp = standings[1]?.xp ?? 0;
  const thirdPlaceXp = standings[2]?.xp ?? 0;
  const fourthPlaceXp = standings[3]?.xp ?? 0;
  const sixthPlaceXp = standings[5]?.xp ?? 0;

  const isLeader = userRank === 1;
  const isPromoting = userRank <= 3;
  const isDemoting = userRank >= standings.length - 1;
  const daysLeft = getDaysUntilSundayReset();

  const lastSafeXp = standings[Math.max(0, standings.length - 3)]?.xp ?? sixthPlaceXp;

  // Compute exact competitive status banner
  const statusBanner = useMemo(() => {
    if (isLeader) {
      const leadMargin = Math.max(0, userScoreXp - secondPlaceXp);
      return {
        tone: 'leader' as const,
        icon: Crown,
        bgClass: 'bg-gv-warning/15 border-gv-warning/50 text-gv-warning',
        title: tr(locale, {
          es: '¡VAS GANANDO! Líder de división',
          en: 'YOU ARE WINNING! Division Leader',
          de: 'DU FÜHRST! Divisions-Spitzenreiter',
          fr: 'TU GAGNES ! Leader de division',
          ja: '首位独走中！ディビジョン1位',
          pt: 'VOCÊ ESTÁ VENCENDO! Líder da divisão',
        }),
        subtitle: tr(locale, {
          es: `Tienes +${leadMargin} XP de ventaja sobre el #2`,
          en: `You lead #2 by +${leadMargin} XP`,
          de: `+${leadMargin} XP Vorsprung auf Platz 2`,
          fr: `+${leadMargin} XP d'avance sur le #2`,
          ja: `2位に+${leadMargin} XP差でリード中`,
          pt: `Você tem +${leadMargin} XP de vantagem sobre o #2`,
        }),
      };
    }

    if (isPromoting) {
      const safeMargin = Math.max(0, userScoreXp - fourthPlaceXp);
      const toFirst = Math.max(1, leaderXp - userScoreXp + 1);
      return {
        tone: 'promo' as const,
        icon: TrendingUp,
        bgClass: 'bg-gv-primary/15 border-gv-primary/50 text-gv-accent',
        title: tr(locale, {
          es: `¡EN ZONA DE ASCENSO! (#${userRank})`,
          en: `PROMOTION ZONE! (#${userRank})`,
          de: `AUFSTIEGSZONE! (#${userRank})`,
          fr: `ZONE DE PROMOTION ! (#${userRank})`,
          ja: `昇格圏内！(#${userRank})`,
          pt: `ZONA DE PROMOÇÃO! (#${userRank})`,
        }),
        subtitle: tr(locale, {
          es: `+${safeMargin} XP sobre el #4 · A ${toFirst} XP del #1`,
          en: `+${safeMargin} XP above #4 · ${toFirst} XP behind #1`,
          de: `+${safeMargin} XP vor #4 · ${toFirst} XP bis #1`,
          fr: `+${safeMargin} XP sur #4 · À ${toFirst} XP du #1`,
          ja: `4位と+${safeMargin} XP差 · 1位まであと${toFirst} XP`,
          pt: `+${safeMargin} XP acima do #4 · A ${toFirst} XP do #1`,
        }),
      };
    }

    if (isDemoting) {
      const xpToSave = Math.max(1, lastSafeXp - userScoreXp + 1);
      return {
        tone: 'danger' as const,
        icon: AlertTriangle,
        bgClass: 'bg-gv-error/15 border-gv-error/60 text-gv-error',
        title: tr(locale, {
          es: '¡VAS PERDIENDO! Peligro de descenso',
          en: 'FALLING BEHIND! Demotion Danger',
          de: 'ABSTIEGSGEFAHR! Du fällst zurück',
          fr: 'EN DANGER ! Zone de relégation',
          ja: `降格ピンチ！現在${userRank}位`,
          pt: 'EM PERIGO! Zona de rebaixamento',
        }),
        subtitle: tr(locale, {
          es: `Gana ${xpToSave} XP para salir de la zona roja`,
          en: `Earn ${xpToSave} XP to escape the red zone`,
          de: `Hol ${xpToSave} XP, um die rote Zone zu verlassen`,
          fr: `Gagne ${xpToSave} XP pour sortir de la zone rouge`,
          ja: `あと${xpToSave} XP獲得で降格圏を脱出`,
          pt: `Ganhe ${xpToSave} XP para sair da zona vermelha`,
        }),
      };
    }

    // Safe middle zone (#4-#6)
    const xpToPromo = Math.max(1, thirdPlaceXp - userScoreXp + 1);
    return {
      tone: 'safe' as const,
      icon: Zap,
      bgClass: 'bg-gv-info/10 border-gv-info/40 text-gv-info',
      title: tr(locale, {
        es: `ZONA SEGURA (#${userRank})`,
        en: `SAFE ZONE (#${userRank})`,
        de: `SICHERE ZONE (#${userRank})`,
        fr: `ZONE SÛRE (#${userRank})`,
        ja: `残留圏内 (#${userRank})`,
        pt: `ZONA SEGURA (#${userRank})`,
      }),
      subtitle: tr(locale, {
        es: `Estás a solo ${xpToPromo} XP de entrar al Top 3`,
        en: `Only ${xpToPromo} XP away from Top 3 promotion`,
        de: `Nur noch ${xpToPromo} XP bis zu den Top 3`,
        fr: `À seulement ${xpToPromo} XP du Top 3`,
        ja: `トップ3昇格まであと${xpToPromo} XP`,
        pt: `Apenas ${xpToPromo} XP para entrar no Top 3`,
      }),
    };
  }, [
    isLeader,
    isPromoting,
    isDemoting,
    userRank,
    userScoreXp,
    secondPlaceXp,
    thirdPlaceXp,
    fourthPlaceXp,
    lastSafeXp,
    leaderXp,
    locale,
  ]);

  const StatusIcon = statusBanner.icon;

  return (
    <div className="rounded-2xl bg-gv-surface border border-gv-border p-4 sm:p-5 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center ${currentTier.badgeBgClass} ${currentTier.accentClass}`}
          >
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-gv-text">
                {currentTier.name[locale]}
              </h2>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded-full bg-gv-primary/15 text-gv-primary border border-gv-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-gv-primary animate-ping" />
                <span>
                  {tr(locale, {
                    es: 'En vivo',
                    en: 'Live',
                    de: 'Live',
                    fr: 'En direct',
                    ja: 'ライブ',
                    pt: 'Ao vivo',
                  })}
                </span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-gv-muted">
              {tr(locale, {
                es: `Puesto #${userRank} de ${standings.length}`,
                en: `Rank #${userRank} of ${standings.length}`,
                de: `Platz #${userRank} von ${standings.length}`,
                fr: `Rang #${userRank} sur ${standings.length}`,
                ja: `${standings.length}人中 ${userRank}位`,
                pt: `Posição #${userRank} de ${standings.length}`,
              })}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gv-surface-high border border-gv-border text-[10px] font-mono text-gv-muted">
          <Clock className="w-3 h-3 text-gv-warning" />
          <span>
            {tr(locale, {
              es: daysLeft === 1 ? 'Cierra en 1 día' : `Cierra en ${daysLeft} días`,
              en: daysLeft === 1 ? '1 day left' : `${daysLeft} days left`,
              de: daysLeft === 1 ? 'Noch 1 Tag' : `Noch ${daysLeft} Tage`,
              fr: daysLeft === 1 ? '1 jour restant' : `${daysLeft} jours restants`,
              ja: `残り${daysLeft}日`,
              pt: daysLeft === 1 ? 'Fecha em 1 dia' : `Fecha em ${daysLeft} dias`,
            })}
          </span>
        </span>
      </div>

      {/* Live Win / Danger Status Banner */}
      <div
        className={`rounded-xl border p-3 flex items-center justify-between gap-3 ${statusBanner.bgClass} ${
          isDemoting ? 'animate-pulse' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <StatusIcon className="w-5 h-5 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-black tracking-tight truncate">
              {statusBanner.title}
            </div>
            <div className="text-[11px] opacity-90 truncate">{statusBanner.subtitle}</div>
          </div>
        </div>

        {onQuickTrain && !isLeader && (
          <button
            type="button"
            onClick={onQuickTrain}
            className={`px-2.5 py-1.5 rounded-lg font-mono font-black text-[10px] uppercase shrink-0 cursor-pointer transition-transform active:scale-95 ${
              isDemoting
                ? 'bg-gv-error text-white shadow-md'
                : 'bg-gv-primary text-black shadow-sm'
            }`}
          >
            {tr(locale, {
              es: '+XP ahora',
              en: '+XP now',
              de: '+XP jetzt',
              fr: '+XP',
              ja: 'XP獲得',
              pt: '+XP agora',
            })}
          </button>
        )}
      </div>

      {/* Leaderboard List with Visual Zone Cutoffs & XP Progress Bars */}
      <div className="space-y-1.5">
        {standings.map((entry, idx) => {
          const rank = idx + 1;
          const isPromo = rank <= 3;
          const isDemote = rank >= standings.length - 1;
          const barPct = Math.max(8, Math.min(100, Math.round((entry.xp / leaderXp) * 100)));

          return (
            <React.Fragment key={entry.id}>
              {/* Cutoff Divider after #3 */}
              {rank === 4 && (
                <div className="flex items-center gap-2 py-0.5 text-[9px] font-mono font-bold text-gv-primary uppercase tracking-wider">
                  <div className="flex-1 border-t border-dashed border-gv-primary/40" />
                  <span>
                    ▲{' '}
                    {tr(locale, {
                      es: 'Zona de Ascenso',
                      en: 'Promotion Zone',
                      de: 'Aufstiegszone',
                      fr: 'Zone de Promotion',
                      ja: '昇格ライン',
                      pt: 'Zona de Promoção',
                    })}{' '}
                    ▲
                  </span>
                  <div className="flex-1 border-t border-dashed border-gv-primary/40" />
                </div>
              )}

              {/* Cutoff Divider before #7 */}
              {rank === standings.length - 1 && (
                <div className="flex items-center gap-2 py-0.5 text-[9px] font-mono font-bold text-gv-error uppercase tracking-wider">
                  <div className="flex-1 border-t border-dashed border-gv-error/40" />
                  <span>
                    ▼{' '}
                    {tr(locale, {
                      es: 'Zona de Descenso',
                      en: 'Demotion Zone',
                      de: 'Abstiegszone',
                      fr: 'Zone de Relégation',
                      ja: '降格ライン',
                      pt: 'Zona de Rebaixamento',
                    })}{' '}
                    ▼
                  </span>
                  <div className="flex-1 border-t border-dashed border-gv-error/40" />
                </div>
              )}

              <div
                className={`relative overflow-hidden flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${
                  entry.isUser
                    ? isDemote
                      ? 'bg-gv-error/15 border-gv-error/70 font-bold shadow-sm'
                      : 'bg-gv-primary/15 border-gv-primary/70 font-bold shadow-sm'
                    : 'bg-gv-surface-high/60 border-gv-border/70'
                }`}
              >
                {/* Subtle XP Progress Bar background */}
                <div
                  className={`absolute inset-y-0 left-0 pointer-events-none transition-all duration-500 ${
                    entry.isUser
                      ? isDemote
                        ? 'bg-gv-error/10'
                        : 'bg-gv-primary/15'
                      : 'bg-white/[0.02]'
                  }`}
                  style={{ width: `${barPct}%` }}
                />

                <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 text-center font-mono font-black tabular-nums ${
                      rank === 1
                        ? 'text-gv-warning'
                        : isPromo
                          ? 'text-gv-primary'
                          : isDemote
                            ? 'text-gv-error'
                            : 'text-gv-muted'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </span>
                  <span className="text-base leading-none">{entry.avatar}</span>
                  <span
                    className={`truncate ${
                      entry.isUser
                        ? isDemote
                          ? 'text-gv-error font-black'
                          : 'text-gv-accent font-black'
                        : 'text-gv-text'
                    }`}
                  >
                    {entry.name}
                  </span>
                  {entry.trend > 0 && (
                    <ArrowUp className="w-3 h-3 text-gv-primary shrink-0" />
                  )}
                  {entry.trend < 0 && (
                    <ArrowDown className="w-3 h-3 text-gv-error shrink-0" />
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-3 shrink-0 font-mono">
                  <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-gv-streak">
                    <Flame className="w-3 h-3 fill-gv-streak" />
                    {entry.streak}d
                  </span>
                  <span className="font-bold text-gv-text tabular-nums">{entry.xp} XP</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Promotion / Demotion Legend */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gv-border/60 text-[10px] font-mono text-gv-muted flex-wrap">
        <span className="inline-flex items-center gap-1 text-gv-primary font-bold">
          <ArrowUp className="w-3 h-3" />
          {nextTier
            ? tr(locale, {
                es: `Top 3: Asciende a ${nextTier.name[locale]}`,
                en: `Top 3: Promote to ${nextTier.name[locale]}`,
                de: `Top 3: Aufstieg in ${nextTier.name[locale]}`,
                fr: `Top 3 : Promotion en ${nextTier.name[locale]}`,
                ja: `上位3名：${nextTier.name[locale]}へ昇格`,
                pt: `Top 3: Sobe para ${nextTier.name[locale]}`,
              })
            : tr(locale, {
                es: 'Top 3: Corona de Maestro',
                en: 'Top 3: Master Crown',
                de: 'Top 3: Meister-Krone',
                fr: 'Top 3 : Couronne de Maître',
                ja: '上位3名：マスタークラウン',
                pt: 'Top 3: Coroa de Mestre',
              })}
        </span>
        <span className="inline-flex items-center gap-1 text-gv-error">
          <ArrowDown className="w-3 h-3" />
          {tr(locale, {
            es: 'Últimos 2: Descienden',
            en: 'Bottom 2: Demote',
            de: 'Letzte 2: Abstieg',
            fr: '2 derniers : Relégation',
            ja: '下位2名：降格',
            pt: 'Últimos 2: Rebaixam',
          })}
        </span>
      </div>
    </div>
  );
};
