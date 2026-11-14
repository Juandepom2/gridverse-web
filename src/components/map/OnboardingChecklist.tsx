import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ListChecks, X, ChevronRight } from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { tr, UI_STRINGS } from '../../lib/i18n';

interface OnboardingChecklistProps {
  stats: UserStats;
  locale: SupportedLocale;
  onNavigateTab: (tab: string) => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  stats,
  locale,
  onNavigateTab,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => Boolean(auth.currentUser));
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('gridverse_checklist_dismissed') === 'true';
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setIsLoggedIn(Boolean(u));
    });
    return () => unsub();
  }, []);

  const completedLevelsCount = Object.keys(stats.completedLevels).length;

  const steps = [
    {
      id: 'calibrate',
      title: tr(locale, {
        es: 'Calibrar tu ruta personalizada',
        en: 'Calibrate your custom learning path',
        de: 'Deinen Lernpfad kalibrieren',
        fr: 'Calibrer ton parcours personnalisé',
        ja: 'カスタム学習ルートを設定する',
        pt: 'Calibrar sua trilha personalizada',
      }),
      done: true,
      onAction: undefined,
    },
    {
      id: 'first_lesson',
      title: tr(locale, {
        es: 'Completar tu primera celda en el mapa',
        en: 'Complete your first cell on the map',
        de: 'Deine erste Zelle auf der Karte abschließen',
        fr: 'Terminer ta première cellule sur la carte',
        ja: 'マップで最初のセルをクリアする',
        pt: 'Completar sua primeira célula no mapa',
      }),
      done: completedLevelsCount > 0,
      onAction: undefined,
    },
    {
      id: 'streak',
      title: tr(locale, {
        es: 'Encender tu 1.er día de racha 🔥',
        en: 'Ignite your 1st day streak 🔥',
        de: 'Deinen 1. Streak-Tag starten 🔥',
        fr: 'Allumer ton 1er jour de série 🔥',
        ja: '1日目の連続記録をスタート 🔥',
        pt: 'Acender seu 1º dia de ofensiva 🔥',
      }),
      done: stats.streak > 0 && completedLevelsCount > 0,
      onAction: undefined,
    },
    {
      id: 'account',
      title: tr(locale, {
        es: 'Guardar tu progreso con una cuenta gratis',
        en: 'Save your progress with a free account',
        de: 'Fortschritt mit kostenlosem Konto speichern',
        fr: 'Sauvegarder ta progression avec un compte gratuit',
        ja: '無料アカウントで進捗を保存する',
        pt: 'Salvar seu progresso com uma conta grátis',
      }),
      done: isLoggedIn,
      onAction: !isLoggedIn ? () => onNavigateTab('profile') : undefined,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allCompleted = completedCount >= steps.length || completedLevelsCount >= 3;

  useEffect(() => {
    if (allCompleted && !dismissed) {
      localStorage.setItem('gridverse_checklist_dismissed', 'true');
    }
  }, [allCompleted, dismissed]);

  // Hide immediately when dismissed or once completed
  if (dismissed || allCompleted) return null;

  const progressRatio = completedCount / steps.length;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('gridverse_checklist_dismissed', 'true');
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-6 bg-gv-surface-high border-[1.5px] border-gv-primary/45 rounded-2xl p-3.5 shadow-xl">
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-2.5 flex-1 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Checklist icon + Counter pill (no star icon, matching Flutter app) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gv-primary text-black font-mono font-extrabold text-xs shrink-0">
            <ListChecks className="w-4 h-4 stroke-[2.5]" />
            <span>
              {completedCount}/{steps.length}
            </span>
          </div>
          <div>
            <h3 className="text-[13.5px] font-extrabold text-gv-text leading-tight">
              {tr(locale, UI_STRINGS.map.onboardingTitle)}
            </h3>
            <p className="text-[11.5px] text-gv-muted">
              {tr(locale, UI_STRINGS.map.onboardingSubtitle)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface transition-colors cursor-pointer"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface transition-colors cursor-pointer"
            title={locale === 'es' ? 'Ocultar lista' : 'Hide checklist'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gv-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gv-primary rounded-full transition-all duration-300"
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>

          {/* Steps List */}
          <div className="flex flex-col gap-1 pt-1">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={step.onAction}
                className={`flex items-center gap-2.5 py-1.5 px-1.5 rounded-lg transition-colors ${
                  step.onAction
                    ? 'hover:bg-gv-surface cursor-pointer'
                    : 'cursor-default'
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="w-[18px] h-[18px] text-gv-primary shrink-0" />
                ) : (
                  <Circle className="w-[18px] h-[18px] text-gv-muted shrink-0" />
                )}
                <span
                  className={`text-[12.5px] flex-1 ${
                    step.done
                      ? 'line-through text-gv-muted font-semibold'
                      : 'text-gv-text font-bold'
                  }`}
                >
                  {step.title}
                </span>
                {step.onAction && (
                  <ChevronRight className="w-4 h-4 text-gv-primary shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
