import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Gift, Sparkles, Clock } from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';
import { formatLocalDateKey } from '../../lib/storage';
import { sound } from '../../lib/audio';
import { auth, syncWeeklyLeagueEntry } from '../../lib/firebase';
import { tr } from '../../lib/i18n';

interface DailyQuestsCardProps {
  stats: UserStats;
  locale: SupportedLocale;
  onReward: (xp: number, gems: number) => void;
  onUpdateStats?: (newStats: UserStats) => void;
}

interface DailyQuest {
  id: string;
  title: string;
  current: number;
  target: number;
  rewardGems: number;
  rewardXp: number;
}

const CLAIMED_STORAGE_KEY = 'gridverse_daily_quests_claimed';

function loadClaimedForDate(dateKey: string): string[] {
  try {
    const raw = localStorage.getItem(CLAIMED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed?.date === dateKey && Array.isArray(parsed.ids)) {
      return parsed.ids;
    }
    return [];
  } catch {
    return [];
  }
}

function saveClaimedForDate(dateKey: string, ids: string[]) {
  try {
    localStorage.setItem(CLAIMED_STORAGE_KEY, JSON.stringify({ date: dateKey, ids }));
  } catch {}
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  stats,
  locale,
  onReward,
  onUpdateStats,
}) => {
  const todayKey = formatLocalDateKey();
  const [localClaimedIds, setLocalClaimedIds] = useState<string[]>(() =>
    loadClaimedForDate(todayKey)
  );

  // Merge Firestore-synced dailyMissions with localStorage fallback
  const claimedIds = useMemo(() => {
    const cloudIds =
      stats.dailyMissions?.date === todayKey ? stats.dailyMissions.claimedIds : [];
    return Array.from(new Set([...localClaimedIds, ...cloudIds]));
  }, [localClaimedIds, stats.dailyMissions, todayKey]);

  const todayActions = stats.activityHistory?.[todayKey] ?? 0;
  const streakSecuredToday = stats.lastStreakDate === todayKey ? 1 : 0;

  const quests: DailyQuest[] = useMemo(
    () => [
      {
        id: 'daily_warmup',
        title: tr(locale, {
          es: 'Calentamiento: Completa 1 actividad hoy',
          en: 'Warmup: Complete 1 activity today',
          de: 'Aufwärmen: 1 Aktivität heute abschließen',
          fr: 'Échauffement : 1 activité aujourd’hui',
          ja: 'ウォームアップ：今日1回クリア',
          pt: 'Aquecimento: Conclua 1 atividade hoje',
        }),
        current: Math.min(1, todayActions),
        target: 1,
        rewardGems: 10,
        rewardXp: 10,
      },
      {
        id: 'daily_streak',
        title: tr(locale, {
          es: 'Defiende tu racha diaria',
          en: 'Protect your daily streak',
          de: 'Tägliche Serie sichern',
          fr: 'Protège ta série quotidienne',
          ja: '連続記録をキープしよう',
          pt: 'Proteja sua sequência diária',
        }),
        current: streakSecuredToday,
        target: 1,
        rewardGems: 15,
        rewardXp: 15,
      },
      {
        id: 'daily_grind',
        title: tr(locale, {
          es: 'Modo Analista: Completa 3 actividades hoy',
          en: 'Analyst Mode: Complete 3 activities today',
          de: 'Analysten-Modus: 3 Aktivitäten heute',
          fr: 'Mode Analyste : 3 activités aujourd’hui',
          ja: 'アナリストモード：今日3回クリア',
          pt: 'Modo Analista: Conclua 3 atividades hoje',
        }),
        current: Math.min(3, todayActions),
        target: 3,
        rewardGems: 25,
        rewardXp: 30,
      },
    ],
    [locale, todayActions, streakSecuredToday]
  );

  const handleClaim = (q: DailyQuest) => {
    if (q.current < q.target || claimedIds.includes(q.id)) return;
    sound.play('coin');
    try {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.75 },
        colors: ['#21C26B', '#4DE1FF', '#FFC53D'],
      });
    } catch {}
    const next = [...claimedIds, q.id];
    setLocalClaimedIds(next);
    saveClaimedForDate(todayKey, next);

    if (onUpdateStats) {
      const updated: UserStats = {
        ...stats,
        xp: stats.xp + q.rewardXp,
        gems: stats.gems + q.rewardGems,
        dailyMissions: {
          date: todayKey,
          claimedIds: next,
        },
      };
      onUpdateStats(updated);
      if (auth.currentUser && q.rewardXp > 0) {
        syncWeeklyLeagueEntry(auth.currentUser.uid, updated, q.rewardXp, auth.currentUser);
      }
    } else {
      onReward(q.rewardXp, q.rewardGems);
    }
  };

  return (
    <div className="rounded-2xl bg-gv-surface border border-gv-border p-4 sm:p-5 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gv-primary/15 border border-gv-primary/30 flex items-center justify-center text-gv-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-gv-text">
              {tr(locale, {
                es: 'Misiones Diarias',
                en: 'Daily Quests',
                de: 'Tägliche Missionen',
                fr: 'Quêtes Quotidiennes',
                ja: 'デイリーミッション',
                pt: 'Missões Diárias',
              })}
            </h2>
            <p className="text-[11px] text-gv-muted font-mono">
              {claimedIds.length}/{quests.length}{' '}
              {tr(locale, {
                es: 'reclamadas hoy',
                en: 'claimed today',
                de: 'heute abgeholt',
                fr: 'réclamées aujourd’hui',
                ja: '本日受取済み',
                pt: 'resgatadas hoje',
              })}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gv-surface-high border border-gv-border text-[10px] font-mono text-gv-muted">
          <Clock className="w-3 h-3 text-gv-warning" />
          <span>24h</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {quests.map((q) => {
          const isDone = q.current >= q.target;
          const isClaimed = claimedIds.includes(q.id);
          const pct = Math.min(100, Math.round((q.current / q.target) * 100));

          return (
            <div
              key={q.id}
              className={`rounded-xl border p-3 flex items-center justify-between gap-3 transition-colors ${
                isClaimed
                  ? 'bg-gv-surface-high/40 border-gv-border/60 opacity-65'
                  : isDone
                    ? 'bg-gv-primary/10 border-gv-primary/40'
                    : 'bg-gv-surface-high border-gv-border'
              }`}
            >
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-gv-text truncate">
                    {q.title}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-gv-muted tabular-nums shrink-0">
                    {q.current}/{q.target}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gv-bg overflow-hidden border border-gv-border/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDone ? 'bg-gv-primary' : 'bg-gv-accent/80'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {isClaimed ? (
                <div className="px-3 py-1.5 rounded-lg bg-gv-surface border border-gv-border text-[11px] font-mono font-bold text-gv-primary flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {tr(locale, {
                      es: 'Listo',
                      en: 'Done',
                      de: 'Fertig',
                      fr: 'Fait',
                      ja: '完了',
                      pt: 'Feito',
                    })}
                  </span>
                </div>
              ) : isDone ? (
                <button
                  type="button"
                  onClick={() => handleClaim(q)}
                  className="px-3 py-1.5 rounded-lg bg-gv-primary hover:bg-gv-accent text-black font-mono font-black text-[11px] flex items-center gap-1 shrink-0 cursor-pointer shadow-md animate-pulse"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>
                    +{q.rewardGems}💎 +{q.rewardXp}XP
                  </span>
                </button>
              ) : (
                <div className="px-2.5 py-1.5 rounded-lg bg-gv-bg border border-gv-border text-[11px] font-mono font-bold text-gv-bytes shrink-0">
                  +{q.rewardGems}💎
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
