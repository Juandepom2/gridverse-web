import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Star,
  Award,
  Flame,
  Share2,
  Check,
  Sparkles,
  Target,
  Download,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { LevelData, SupportedLocale, UserStats } from '../types';
import { CeldiMascot } from './CeldiMascot';
import { sound } from '../lib/audio';
import { tr } from '../lib/i18n';

interface VictoryCeremonyProps {
  level: LevelData;
  locale: SupportedLocale;
  mistakes: number;
  totalExercises: number;
  stats: UserStats;
  onClose: () => void;
  onClaimBonus?: (bonusGems: number, bonusXp: number) => void;
  onNextLevel?: () => void;
}

interface ChestOption {
  gems: number;
  xp: number;
  tier: 'common' | 'rare' | 'epic';
}

function generateShuffledChests(): ChestOption[] {
  const pool: ChestOption[] = [
    { gems: 5, xp: 0, tier: 'common' },
    { gems: 15, xp: 10, tier: 'rare' },
    { gems: 25, xp: 25, tier: 'epic' },
  ];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

type CeremonyPhase = 'anticipation' | 'ceremony' | 'afterglow';

export const VictoryCeremony: React.FC<VictoryCeremonyProps> = ({
  level,
  locale,
  mistakes,
  totalExercises,
  stats,
  onClose,
  onClaimBonus,
  onNextLevel,
}) => {
  const [phase, setPhase] = useState<CeremonyPhase>('anticipation');
  const [anticipationProgress, setAnticipationProgress] = useState(0);
  const [revealedStars, setRevealedStars] = useState(0);
  const [displayedXp, setDisplayedXp] = useState(0);
  const [displayedGems, setDisplayedGems] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  // Variable-ratio Skinner chest state
  const chests = useMemo(() => generateShuffledChests(), []);
  const [shakingChestIdx, setShakingChestIdx] = useState<number | null>(null);
  const [openedChestIdx, setOpenedChestIdx] = useState<number | null>(null);

  const earnedStars = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
  const earnedXp = level.rewardXp ?? 20;
  const earnedGems = 5;
  const accuracy =
    totalExercises > 0
      ? Math.max(0, Math.round((totalExercises / (totalExercises + mistakes)) * 100))
      : 100;

  const levelTitle = level.titleByLocale?.[locale] ?? level.title;
  const hasPlayedRevealRef = useRef(false);
  const celdiContainerRef = useRef<HTMLDivElement | null>(null);

  // Stage 1: Anticipation Window (2.1s deliberate friction)
  useEffect(() => {
    if (phase !== 'anticipation') return;

    const durationMs = 2100;
    const startTime = performance.now();
    let lastTickStep = -1;
    let rafId: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setAnticipationProgress(pct);

      const tickStep = Math.floor(pct / 25);
      if (tickStep > lastTickStep && tickStep < 4) {
        lastTickStep = tickStep;
        sound.play('tap');
      }

      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(step);
      } else {
        setPhase('ceremony');
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  // Stage 2: Ceremony Layer (Confetti + Sequential Stars + XP/Gems Odometer)
  useEffect(() => {
    if (phase !== 'ceremony' || hasPlayedRevealRef.current) return;
    hasPlayedRevealRef.current = true;

    sound.play('level_win');
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#21C26B', '#7CFFB2', '#3B82F6', '#F59E0B'],
      });
    } catch (_) {}

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Sequential Star Reveal (1 -> 2 -> 3)
    for (let s = 1; s <= earnedStars; s++) {
      timers.push(
        setTimeout(() => {
          setRevealedStars(s);
          sound.play('coin');
        }, s * 320)
      );
    }

    // XP & Gems Odometer Roll-up
    const odometerStart = earnedStars * 320 + 180;
    timers.push(
      setTimeout(() => {
        const rollDuration = 650;
        const start = performance.now();
        const roll = (now: number) => {
          const t = Math.min(1, (now - start) / rollDuration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplayedXp(Math.round(earnedXp * eased));
          setDisplayedGems(Math.round(earnedGems * eased));
          if (t < 1) {
            requestAnimationFrame(roll);
          } else {
            setPhase('afterglow');
          }
        };
        requestAnimationFrame(roll);
      }, odometerStart)
    );

    return () => timers.forEach(clearTimeout);
  }, [phase, earnedStars, earnedXp, earnedGems]);

  const handleSkipAnticipation = () => {
    if (phase === 'anticipation') {
      setPhase('ceremony');
    }
  };

  const handleOpenChest = (idx: number) => {
    if (openedChestIdx !== null || shakingChestIdx !== null) return;
    sound.play('tap');
    setShakingChestIdx(idx);
    setTimeout(() => {
      setShakingChestIdx(null);
      setOpenedChestIdx(idx);
      const reward = chests[idx];
      if (reward.tier === 'epic') {
        sound.play('streak');
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#FFC53D', '#21C26B', '#4DE1FF'],
          });
        } catch (_) {}
      } else {
        sound.play('coin');
      }
      onClaimBonus?.(reward.gems, reward.xp);
    }, 450);
  };

  const streakUnitText = tr(locale, {
    es: stats.streak === 1 ? '1 día' : `${stats.streak} días`,
    en: stats.streak === 1 ? '1-day' : `${stats.streak}-day`,
    de: stats.streak === 1 ? '1 Tag' : `${stats.streak} Tage`,
    fr: stats.streak === 1 ? '1 jour' : `${stats.streak} jours`,
    ja: `${stats.streak}日`,
    pt: stats.streak === 1 ? '1 dia' : `${stats.streak} dias`,
  });

  const shareText = tr(locale, {
    es: `🚀 ¡Completé "${levelTitle}" en Gridverse con ${accuracy}% de precisión (${earnedStars}/3 ⭐) y racha de ${streakUnitText}! Dominando Excel paso a paso. #Excel #Gridverse`,
    en: `🚀 Just completed "${levelTitle}" on Gridverse with ${accuracy}% accuracy (${earnedStars}/3 ⭐) and a ${streakUnitText} streak! Mastering Excel step by step. #Excel #Gridverse`,
    de: `🚀 Ich habe "${levelTitle}" in Gridverse mit ${accuracy}% Genauigkeit (${earnedStars}/3 ⭐) und einer Serie von ${streakUnitText} abgeschlossen! #Excel #Gridverse`,
    fr: `🚀 Je viens de terminer "${levelTitle}" sur Gridverse avec ${accuracy}% de précision (${earnedStars}/3 ⭐) et une série de ${streakUnitText} ! #Excel #Gridverse`,
    ja: `🚀 Gridverseで「${levelTitle}」を正答率${accuracy}%（⭐${earnedStars}/3）・${streakUnitText}連続でクリアしました！ #Excel #Gridverse`,
    pt: `🚀 Acabei de concluir "${levelTitle}" no Gridverse com ${accuracy}% de precisão (${earnedStars}/3 ⭐) e sequência de ${streakUnitText}! #Excel #Gridverse`,
  });

  const generateAchievementCardBlob = async (): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background
    ctx.fillStyle = '#0A0F0C';
    ctx.fillRect(0, 0, 800, 440);

    // Subtle spreadsheet grid lines
    ctx.strokeStyle = 'rgba(33, 194, 107, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 440);
      ctx.stroke();
    }
    for (let y = 0; y <= 440; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // Border frame
    ctx.strokeStyle = '#21C26B';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 752, 392);

    // Mascot Glow & Celdi SVG on right side
    ctx.save();
    const grad = ctx.createRadialGradient(648, 128, 10, 648, 128, 95);
    grad.addColorStop(0, 'rgba(33, 194, 107, 0.35)');
    grad.addColorStop(1, 'rgba(33, 194, 107, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(648, 128, 95, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const svgEl = celdiContainerRef.current?.querySelector('svg');
    if (svgEl) {
      try {
        const clone = svgEl.cloneNode(true) as SVGElement;
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const svgStr = new XMLSerializer().serializeToString(clone);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 570, 50, 156, 156);
            URL.revokeObjectURL(url);
            resolve();
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          img.src = url;
        });
      } catch (_) {}
    }

    // Localized Labels
    const badgeLabel = tr(locale, {
      es: 'GRIDVERSE · LOGRO DESBLOQUEADO',
      en: 'GRIDVERSE · ACHIEVEMENT UNLOCKED',
      de: 'GRIDVERSE · ERFOLG FREIGESCHALTET',
      fr: 'GRIDVERSE · SUCCÈS DÉBLOQUÉ',
      ja: 'GRIDVERSE · 実績解除',
      pt: 'GRIDVERSE · CONQUISTA DESBLOQUEADA',
    });
    const accuracyLabel = tr(locale, {
      es: 'PRECISIÓN',
      en: 'ACCURACY',
      de: 'GENAUIGKEIT',
      fr: 'PRÉCISION',
      ja: '正答率',
      pt: 'PRECISÃO',
    });
    const xpLabel = tr(locale, {
      es: 'EXPERIENCIA',
      en: 'EXPERIENCE',
      de: 'ERFAHRUNG',
      fr: 'EXPÉRIENCE',
      ja: '獲得XP',
      pt: 'EXPERIÊNCIA',
    });
    const streakLabel = tr(locale, {
      es: 'RACHA ACTIVA',
      en: 'ACTIVE STREAK',
      de: 'AKTIVE SERIE',
      fr: 'SÉRIE ACTIVE',
      ja: '連続記録',
      pt: 'SEQUÊNCIA ATIVA',
    });
    const footerLabel = tr(locale, {
      es: 'gridverse.app · Domina Excel jugando',
      en: 'gridverse.app · Master Excel by playing',
      de: 'gridverse.app · Excel spielend meistern',
      fr: 'gridverse.app · Maîtrise Excel en jouant',
      ja: 'gridverse.app · 遊びながらExcelを極めよう',
      pt: 'gridverse.app · Domine o Excel jogando',
    });

    // Brand tag
    ctx.fillStyle = '#7CFFB2';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(badgeLabel, 56, 76);

    // Level Title
    ctx.fillStyle = '#E6EFE9';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(levelTitle.slice(0, 26), 56, 134);

    // Stars
    ctx.fillStyle = '#FFC53D';
    ctx.font = 'bold 42px sans-serif';
    const starsStr = '★'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
    ctx.fillText(starsStr, 56, 198);

    // Metrics boxes
    ctx.fillStyle = '#18221D';
    ctx.fillRect(56, 236, 210, 110);
    ctx.fillRect(290, 236, 210, 110);
    ctx.fillRect(524, 236, 210, 110);

    ctx.fillStyle = '#8B9C92';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(accuracyLabel, 76, 268);
    ctx.fillText(xpLabel, 310, 268);
    ctx.fillText(streakLabel, 544, 268);

    ctx.fillStyle = '#21C26B';
    ctx.font = 'bold 34px monospace';
    ctx.fillText(`${accuracy}%`, 76, 318);

    ctx.fillStyle = '#7CFFB2';
    ctx.fillText(`+${earnedXp} XP`, 310, 318);

    ctx.fillStyle = '#FF8A3D';
    ctx.fillText(`${stats.streak}d`, 544, 318);

    // Footer
    ctx.fillStyle = '#55655B';
    ctx.font = '14px monospace';
    ctx.fillText(footerLabel, 56, 390);

    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
  };

  const handleShare = async () => {
    sound.play('tap');
    const blob = await generateAchievementCardBlob();
    if (blob && typeof navigator.share === 'function') {
      const file = new File([blob], `gridverse-${level.ref}.png`, { type: 'image/png' });
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Gridverse Achievement',
            text: shareText,
          });
          return;
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }

      try {
        await navigator.share({
          title: 'Gridverse Achievement',
          text: shareText,
        });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    // Fallback: copy text + download image so user has both
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch (_) {}

    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `gridverse-${level.ref}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadCard = async () => {
    sound.play('tap');
    const blob = await generateAchievementCardBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `gridverse-${level.ref}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── STAGE 1: ANTICIPATION WINDOW ───────────────────────────────────────────
  if (phase === 'anticipation') {
    const statusText =
      anticipationProgress < 45
        ? tr(locale, {
            es: 'Analizando precisión y dominio...',
            en: 'Analyzing accuracy and mastery...',
            de: 'Genauigkeit wird analysiert...',
            fr: 'Analyse de la précision...',
            ja: '精度と習熟度を分析中...',
            pt: 'Analisando precisão e domínio...',
          })
        : anticipationProgress < 85
          ? tr(locale, {
              es: 'Evaluando velocidad en fórmulas...',
              en: 'Evaluating formula speed...',
              de: 'Formelgeschwindigkeit wird bewertet...',
              fr: 'Évaluation de la rapidité...',
              ja: '数式スピードを評価中...',
              pt: 'Avaliando velocidade nas fórmulas...',
            })
          : tr(locale, {
              es: '¡Preparando tu recompensa!',
              en: 'Preparing your reward!',
              de: 'Deine Belohnung wird vorbereitet!',
              fr: 'Préparation de ta récompense !',
              ja: '報酬を準備しています！',
              pt: 'Preparando sua recompensa!',
            });

    return (
      <div
        onClick={handleSkipAnticipation}
        className="p-6 sm:p-10 text-center flex flex-col items-center justify-center gap-6 my-auto min-h-[360px] cursor-pointer select-none spreadsheet-grid-bg"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-gv-primary/20 blur-xl animate-pulse" />
          <CeldiMascot mood="thinking" size={104} showBubble={false} />
        </div>

        <div className="w-full max-w-xs space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-gv-accent">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{statusText}</span>
          </div>

          <div className="w-full h-3 rounded-full bg-gv-surface-higher border border-gv-border overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gv-primary to-gv-accent transition-all duration-75"
              style={{ width: `${anticipationProgress}%` }}
            />
          </div>

          <p className="text-[11px] font-mono text-gv-muted tabular-nums">
            {Math.round(anticipationProgress)}%
          </p>
        </div>
      </div>
    );
  }

  // ── STAGES 2 & 3: CEREMONY LAYER + AFTERGLOW ───────────────────────────────
  return (
    <div className="p-6 sm:p-8 text-center flex flex-col items-center gap-4 my-auto animate-fade-in">
      <div ref={celdiContainerRef} className="relative flex items-center justify-center">
        <div className="absolute w-28 h-28 rounded-full bg-gv-primary/20 blur-xl" />
        <CeldiMascot
          mood={mistakes === 0 ? 'onFire' : 'celebrating'}
          size={88}
          showBubble={false}
        />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gv-primary font-mono">
          {tr(locale, {
            es: '¡Nivel Completado!',
            en: 'Level Completed!',
            de: 'Level abgeschlossen!',
            fr: 'Niveau terminé !',
            ja: 'レベルクリア！',
            pt: 'Nível Concluído!',
          })}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-gv-text mt-1">{levelTitle}</h2>
      </div>

      {/* Sequential Stars Reveal */}
      <div className="flex items-center gap-2.5 my-1">
        {[1, 2, 3].map((star) => {
          const isEarned = earnedStars >= star;
          const isRevealed = revealedStars >= star;
          return (
            <div
              key={star}
              className={`transition-all duration-300 ${
                isRevealed && isEarned
                  ? 'scale-110 opacity-100'
                  : isEarned
                    ? 'scale-75 opacity-30'
                    : 'scale-95 opacity-40'
              }`}
            >
              <Star
                className={`w-9 h-9 transition-all ${
                  isRevealed && isEarned
                    ? 'fill-gv-warning text-gv-warning drop-shadow-[0_0_10px_rgba(255,197,61,0.5)]'
                    : 'text-gv-border fill-gv-surface-high'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* XP & Gems Odometer */}
      <div className="flex items-center gap-4 bg-gv-surface-high border border-gv-border rounded-xl px-5 py-2.5 text-xs sm:text-sm tabular-nums shadow-inner">
        <div className="flex items-center gap-1.5 font-bold text-gv-accent font-mono">
          <Award className="w-4 h-4" />
          <span>+{displayedXp} XP</span>
        </div>
        <div className="w-px h-4 bg-gv-border" />
        <div className="flex items-center gap-1.5 font-bold text-gv-bytes font-mono">
          <span>
            +{displayedGems}{' '}
            {tr(locale, {
              es: 'Gemas 💎',
              en: 'Gems 💎',
              de: 'Edelsteine 💎',
              fr: 'Gemmes 💎',
              ja: 'ジェム 💎',
              pt: 'Gemas 💎',
            })}
          </span>
        </div>
      </div>

      {/* Stage 3: Afterglow Identity, Variable Chest & Social Card */}
      <div
        className={`w-full max-w-xs space-y-3 transition-all duration-500 ${
          phase === 'afterglow'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {/* Variable-Ratio Mystery Chest (La Máquina del Deseo) */}
        <div className="bg-gv-surface-high border border-gv-warning/40 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider">
            <span className="text-gv-warning flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5" />
              {openedChestIdx === null
                ? tr(locale, {
                    es: 'Cofre Sorpresa · Elige 1',
                    en: 'Mystery Chest · Pick 1',
                    de: 'Überraschungstruhe · Wähle 1',
                    fr: 'Coffre Mystère · Choisis 1',
                    ja: 'ミステリー宝箱 · 1つ選択',
                    pt: 'Baú Misterioso · Escolha 1',
                  })
                : tr(locale, {
                    es: '¡Botín Desbloqueado!',
                    en: 'Bonus Unlocked!',
                    de: 'Bonus freigeschaltet!',
                    fr: 'Bonus débloqué !',
                    ja: 'ボーナス獲得！',
                    pt: 'Bônus Desbloqueado!',
                  })}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {chests.map((chest, idx) => {
              const isSelected = openedChestIdx === idx;
              const isRevealedOther = openedChestIdx !== null && openedChestIdx !== idx;
              const isShaking = shakingChestIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={openedChestIdx !== null || shakingChestIdx !== null}
                  onClick={() => handleOpenChest(idx)}
                  className={`py-2.5 px-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? chest.tier === 'epic'
                        ? 'bg-gv-warning/20 border-gv-warning text-gv-warning scale-105 shadow-md'
                        : 'bg-gv-primary/20 border-gv-primary text-gv-accent scale-105'
                      : isRevealedOther
                        ? 'bg-gv-surface/60 border-gv-border/60 text-gv-muted opacity-55'
                        : `bg-gv-surface hover:bg-gv-surface-higher border-gv-border hover:border-gv-warning cursor-pointer active:scale-95 ${
                            isShaking ? 'animate-bounce border-gv-warning' : ''
                          }`
                  }`}
                >
                  {openedChestIdx === null ? (
                    <>
                      <Gift className="w-5 h-5 text-gv-warning" />
                      <span className="text-[10px] font-mono font-bold text-gv-muted">
                        #{idx + 1}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-black font-mono">+{chest.gems}💎</span>
                      {chest.xp > 0 && (
                        <span className="text-[10px] font-bold font-mono text-gv-accent">
                          +{chest.xp} XP
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-left bg-gv-surface border border-gv-border rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gv-primary/15 border border-gv-primary/30 flex items-center justify-center text-gv-primary shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-gv-muted">
                {tr(locale, {
                  es: 'Precisión',
                  en: 'Accuracy',
                  de: 'Genauigkeit',
                  fr: 'Précision',
                  ja: '正答率',
                  pt: 'Precisão',
                })}
              </div>
              <div className="text-sm font-black font-mono text-gv-text tabular-nums">
                {accuracy}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gv-streak/15 border border-gv-streak/30 flex items-center justify-center text-gv-streak shrink-0">
              <Flame className="w-4 h-4 fill-gv-streak" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-gv-muted">
                {tr(locale, {
                  es: 'Racha',
                  en: 'Streak',
                  de: 'Serie',
                  fr: 'Série',
                  ja: '連続日数',
                  pt: 'Sequência',
                })}
              </div>
              <div className="text-sm font-black font-mono text-gv-streak tabular-nums">
                {stats.streak}d
              </div>
            </div>
          </div>
        </div>

        {/* Share & Export Afterglow Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-gv-primary" />
                <span className="text-gv-primary">
                  {tr(locale, {
                    es: '¡Copiado!',
                    en: 'Copied!',
                    de: 'Kopiert!',
                    fr: 'Copié !',
                    ja: 'コピー済み！',
                    pt: 'Copiado!',
                  })}
                </span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-gv-accent" />
                <span>
                  {tr(locale, {
                    es: 'Compartir logro',
                    en: 'Share milestone',
                    de: 'Erfolg teilen',
                    fr: 'Partager',
                    ja: '実績をシェア',
                    pt: 'Compartilhar',
                  })}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadCard}
            title={tr(locale, {
              es: 'Descargar tarjeta PNG',
              en: 'Download PNG card',
              de: 'PNG-Karte herunterladen',
              fr: 'Télécharger la carte PNG',
              ja: 'PNGカードを保存',
              pt: 'Baixar cartão PNG',
            })}
            className="py-2.5 px-3 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-muted hover:text-gv-text transition-all cursor-pointer active:scale-98"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {onNextLevel && (
          <button
            type="button"
            onClick={() => {
              sound.play('tap');
              onNextLevel();
            }}
            className="w-full py-3 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-gv-primary/20 border-b-4 border-b-gv-primary-dark active:scale-98 flex items-center justify-center gap-2"
          >
            <span>
              {tr(locale, {
                es: 'Seguir al siguiente nivel',
                en: 'Continue to next level',
                de: 'Weiter zum nächsten Level',
                fr: 'Continuer au niveau suivant',
                ja: '次のレベルへ進む',
                pt: 'Seguir para o próximo nível',
              })}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-98 ${
            onNextLevel
              ? 'bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-muted hover:text-gv-text'
              : 'py-3 bg-gv-primary hover:bg-gv-accent text-black font-black sm:text-sm shadow-lg shadow-gv-primary/20 border-b-4 border-b-gv-primary-dark'
          }`}
        >
          {tr(locale, {
            es: 'Volver al Mapa',
            en: 'Back to Map',
            de: 'Zurück zur Karte',
            fr: 'Retour à la carte',
            ja: 'マップに戻る',
            pt: 'Voltar ao Mapa',
          })}
        </button>
      </div>
    </div>
  );
};
