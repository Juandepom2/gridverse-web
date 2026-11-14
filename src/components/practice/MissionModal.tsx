import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  KeyRound,
  Delete,
  Heart,
  Infinity as InfinityIcon,
  Star,
  Zap,
  Gem,
  ArrowRight,
  Table2,
} from 'lucide-react';
import {
  StepByStepExerciseData,
  checkStepFormula,
  shuffleStepSuggestions,
} from '../../data/coursesData';
import { SupportedLocale, UserStats } from '../../types';
import { CeldiMascot, CeldiMood } from '../CeldiMascot';
import { SpreadsheetGrid, highlightsForFormula } from '../SpreadsheetGrid';
import { sound } from '../../lib/audio';

interface MissionModalProps {
  exercise: StepByStepExerciseData;
  stats: UserStats;
  locale: SupportedLocale;
  onClose: () => void;
  onSuccess: (ref: string, xp: number, gems: number) => void;
  onLoseLife?: () => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  exercise,
  stats,
  locale,
  onClose,
  onSuccess,
  onLoseLife,
}) => {
  // Prepare steps with shuffled suggestion tokens on open
  const steps = useMemo(
    () =>
      exercise.steps.map((s) => ({
        ...s,
        suggestions: shuffleStepSuggestions(s.suggestions),
      })),
    [exercise]
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  // Separate data & display values per sheet tab in the workbook
  const [sheetsData, setSheetsData] = useState<Record<string, Record<string, string>>>(() => {
    const map: Record<string, Record<string, string>> = {};
    for (const s of exercise.sheets) {
      map[s.id] = { ...s.initialData };
    }
    return map;
  });

  const [sheetsDisplayValues, setSheetsDisplayValues] = useState<
    Record<string, Record<string, string>>
  >(() => {
    const map: Record<string, Record<string, string>> = {};
    for (const s of exercise.sheets) {
      map[s.id] = { ...(s.initialDisplayValues || {}) };
    }
    return map;
  });

  // Currently viewed sheet tab (defaults to currentStep.sheetId, auto-switches on step change)
  const [viewingSheetId, setViewingSheetId] = useState<string>(currentStep.sheetId);

  const [userFormula, setUserFormula] = useState<string>(currentStep.formulaBarInitial || '');
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [celdiMood, setCeldiMood] = useState<CeldiMood>('thinking');
  const [emergencyRevealsLeft, setEmergencyRevealsLeft] = useState(1);
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);
  const [isWorkbookFinished, setIsWorkbookFinished] = useState(false);

  const activeSheet =
    exercise.sheets.find((s) => s.id === viewingSheetId) ||
    exercise.sheets.find((s) => s.id === currentStep.sheetId) ||
    exercise.sheets[0];

  const handleSuggestionTap = (token: string) => {
    if (isStepCompleted) return;
    sound.play('tap');
    setUserFormula((prev) => prev + token);
    if (showError) setShowError(false);
  };

  const handleBackspace = () => {
    if (isStepCompleted) return;
    sound.play('tap');
    setUserFormula((prev) => prev.slice(0, -1));
    if (showError) setShowError(false);
  };

  const handleCheckStep = () => {
    if (isStepCompleted) {
      handleNextStep();
      return;
    }

    const input = userFormula.trim();
    if (!input) return;

    // Make sure user is viewing the step's target sheet
    if (viewingSheetId !== currentStep.sheetId) {
      setViewingSheetId(currentStep.sheetId);
    }

    const isOk = checkStepFormula(input, currentStep.acceptedFormulas);

    if (isOk) {
      sound.play('correct');
      setIsStepCompleted(true);
      setShowError(false);
      setCeldiMood('celebrating');

      setSheetsData((prev) => ({
        ...prev,
        [currentStep.sheetId]: {
          ...prev[currentStep.sheetId],
          [currentStep.targetCell]: input,
        },
      }));
      setSheetsDisplayValues((prev) => ({
        ...prev,
        [currentStep.sheetId]: {
          ...prev[currentStep.sheetId],
          [currentStep.targetCell]: currentStep.resultValue,
        },
      }));
    } else {
      sound.play('wrong');
      setShowError(true);
      setCeldiMood('sad');
      if (onLoseLife) onLoseLife();
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      const nextStep = steps[nextIdx];
      sound.play('tap');
      setCurrentStepIndex(nextIdx);
      setViewingSheetId(nextStep.sheetId);
      setIsStepCompleted(false);
      setShowError(false);
      setShowHint(false);
      setCeldiMood('thinking');
      setUserFormula(nextStep.formulaBarInitial || '');
    } else {
      sound.play('level_win');
      confetti({ particleCount: 95, spread: 70, origin: { y: 0.6 } });
      setIsWorkbookFinished(true);
      onSuccess(exercise.id, exercise.earnedXp, exercise.earnedBytes);
    }
  };

  const confirmEmergencyReveal = () => {
    if (emergencyRevealsLeft <= 0) return;
    sound.play('hint');
    setEmergencyRevealsLeft((prev) => prev - 1);
    setUserFormula(currentStep.emergencySolution);
    setShowRevealConfirm(false);
    setShowError(false);
  };

  // Merge raw data with evaluated display values for the active sheet
  const mergedSheetData = useMemo(() => {
    const raw = sheetsData[activeSheet.id] || {};
    const disp = sheetsDisplayValues[activeSheet.id] || {};
    return { ...raw, ...disp };
  }, [sheetsData, sheetsDisplayValues, activeSheet.id]);

  const formulaHighlights = useMemo(
    () => highlightsForFormula(userFormula),
    [userFormula]
  );

  const progressPct = ((currentStepIndex + (isStepCompleted ? 1 : 0)) / steps.length) * 100;

  if (isWorkbookFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gv-surface-high border border-gv-primary/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center text-center animate-fade-in">
          <CeldiMascot mood="celebrating" size={96} />
          <h2 className="text-xl md:text-2xl font-black text-gv-text mt-4">
            {locale === 'es' ? '¡Misión Completada!' : 'Mission Completed!'}
          </h2>
          <p className="text-xs md:text-sm text-gv-muted mt-1.5 leading-relaxed">
            {locale === 'es'
              ? `Has resuelto los ${steps.length} pasos en ${exercise.sheets.length} hojas de cálculo con éxito.`
              : `You solved all ${steps.length} steps across ${exercise.sheets.length} sheets!`}
          </p>

          <div className="flex items-center justify-center gap-2 my-4">
            {[0, 1, 2].map((i) => (
              <Star key={i} className="w-8 h-8 text-gv-warning fill-gv-warning drop-shadow" />
            ))}
          </div>

          <div className="w-full bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-1.5 font-mono font-extrabold text-sm text-gv-warning">
              <Zap className="w-4 h-4 fill-gv-warning" />
              <span>+{exercise.earnedXp} XP</span>
            </div>
            <div className="w-px h-5 bg-gv-border" />
            <div className="flex items-center gap-1.5 font-mono font-extrabold text-sm text-gv-bytes">
              <Gem className="w-4 h-4 fill-gv-bytes/30" />
              <span>+{exercise.earnedBytes} Gemas</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-gv-primary/25 transition-all"
          >
            {locale === 'es' ? 'CONTINUAR' : 'CONTINUE'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 md:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gv-surface border border-gv-border rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-fade-in">
        {/* Top Bar: Close + Progress + Step Counter + Lives */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gv-border bg-gv-surface-high">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-gv-text truncate">
                {exercise.badgeEmoji} {exercise.title}
              </span>
              <span className="font-mono text-gv-primary">
                {locale === 'es'
                  ? `Paso ${currentStepIndex + 1} de ${steps.length}`
                  : `Step ${currentStepIndex + 1} of ${steps.length}`}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gv-bg overflow-hidden border border-gv-border/60">
              <div
                className="h-full bg-gradient-to-r from-gv-primary to-gv-accent transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Lives pill */}
          {stats.isPro ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gv-primary-soft border border-gv-primary/40 text-xs font-mono font-extrabold text-gv-accent">
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>PRO</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gv-integrity/10 border border-gv-integrity/30 text-xs font-mono font-bold text-gv-integrity">
              <Heart className="w-3.5 h-3.5 fill-gv-integrity" />
              <span>{stats.lives}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto">
          {/* Step Instruction + Celdi + Hint & Emergency Key */}
          <div className="bg-gv-surface-high/90 border border-gv-border rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <CeldiMascot mood={celdiMood} size={46} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-gv-primary">
                    {currentStep.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gv-primary/15 text-gv-accent border border-gv-primary/30">
                    Celda {currentStep.targetCell}
                  </span>
                </div>
                <p className="text-xs md:text-[13px] font-semibold text-gv-text mt-1 leading-snug">
                  {currentStep.instruction}
                </p>
              </div>
            </div>

            {/* Action Pills: Pedagogical Hint + 1 Emergency Key */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-gv-border/50 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  sound.play('hint');
                  setShowHint((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                  showHint
                    ? 'bg-gv-warning/20 border-gv-warning text-gv-warning'
                    : 'bg-gv-surface border-gv-border text-gv-muted hover:text-gv-text'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-gv-warning" />
                <span>{showHint ? 'Ocultar pista' : 'Ver pista pedagógica'}</span>
              </button>

              {emergencyRevealsLeft > 0 && !isStepCompleted && (
                <button
                  type="button"
                  onClick={() => setShowRevealConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gv-warning/15 hover:bg-gv-warning/25 border border-gv-warning/40 text-gv-warning transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Revelar fórmula ({emergencyRevealsLeft} restante)</span>
                </button>
              )}
            </div>

            {showHint && (
              <div className="px-3 py-2 rounded-xl bg-gv-warning/10 border border-gv-warning/30 text-xs text-gv-warning flex items-start gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{currentStep.pedagogicalHint}</span>
              </div>
            )}
          </div>

          {/* Multi-Sheet Workbook Tabs (Ventas | Costos e Ingresos | Reporte Ejecutivo) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {exercise.sheets.map((sheet) => {
                const isSelected = sheet.id === activeSheet.id;
                const isTargetSheet = sheet.id === currentStep.sheetId;
                return (
                  <button
                    key={sheet.id}
                    type="button"
                    onClick={() => {
                      sound.play('tap');
                      setViewingSheetId(sheet.id);
                    }}
                    className={`px-3 py-1.5 rounded-t-xl font-mono text-xs font-bold flex items-center gap-1.5 border-t border-x transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-gv-surface-high border-gv-primary text-gv-accent shadow-sm'
                        : 'bg-gv-bg/70 border-gv-border text-gv-muted hover:text-gv-text'
                    }`}
                  >
                    <Table2 className="w-3.5 h-3.5" />
                    <span>{sheet.name}</span>
                    {isTargetSheet && (
                      <span
                        className="w-2 h-2 rounded-full bg-gv-primary"
                        title="Hoja activa de este paso"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Interactive Spreadsheet Grid */}
            <SpreadsheetGrid
              columns={activeSheet.columns}
              rows={activeSheet.rows}
              data={mergedSheetData}
              selectedCell={
                activeSheet.id === currentStep.sheetId ? currentStep.targetCell : undefined
              }
              highlights={activeSheet.id === currentStep.sheetId ? formulaHighlights : {}}
              targetFormula={!isStepCompleted ? userFormula : undefined}
              compact
            />
          </div>

          {/* Formula Input Bar + Shuffled Suggestion Tokens */}
          <div className="bg-gv-surface-high border border-gv-border rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-gv-primary/15 border border-gv-primary/30 font-mono text-xs font-extrabold text-gv-accent">
                {currentStep.targetCell}
              </span>
              <span className="font-mono italic font-bold text-gv-primary text-sm">fx</span>
              <input
                type="text"
                value={userFormula}
                onChange={(e) => {
                  if (!isStepCompleted) {
                    setUserFormula(e.target.value);
                    if (showError) setShowError(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckStep();
                }}
                disabled={isStepCompleted}
                placeholder="=SUMA(B2:F2)"
                className="flex-1 px-3 py-2 rounded-xl bg-gv-bg border border-gv-border font-mono text-sm font-bold text-gv-accent focus:outline-none focus:border-gv-primary"
              />
              {!isStepCompleted && (
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="p-2 rounded-xl bg-gv-surface hover:bg-gv-bg border border-gv-border text-gv-muted hover:text-gv-text cursor-pointer"
                  title="Borrar último carácter"
                >
                  <Delete className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Shuffled Suggestion Tokens */}
            {!isStepCompleted && currentStep.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentStep.suggestions.map((token, idx) => (
                  <button
                    key={`${token}-${idx}`}
                    type="button"
                    onClick={() => handleSuggestionTap(token)}
                    className="px-2.5 py-1.5 rounded-xl bg-gv-bg hover:bg-gv-primary/20 border border-gv-border hover:border-gv-primary font-mono text-xs font-bold text-gv-text hover:text-gv-accent transition-all cursor-pointer active:translate-y-0.5 shadow-sm"
                  >
                    {token}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Banner */}
          {showError && (
            <div className="p-3 rounded-xl bg-gv-error/15 border border-gv-error text-xs font-bold text-gv-error flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {locale === 'es'
                  ? 'La fórmula aún no es exacta. Revisa el rango de celdas o consulta la pista.'
                  : 'Formula is not exact yet. Check the cell range or view the hint.'}
              </span>
            </div>
          )}

          {isStepCompleted && (
            <div className="p-3 rounded-xl bg-gv-primary-soft/80 border border-gv-primary text-xs font-bold text-gv-accent flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-gv-accent" />
                <span>
                  {locale === 'es'
                    ? `¡Correcto! ${currentStep.targetCell} = ${currentStep.resultValue}`
                    : `Correct! ${currentStep.targetCell} = ${currentStep.resultValue}`}
                </span>
              </div>
            </div>
          )}

          {/* Verify / Next Step CTA */}
          <button
            type="button"
            onClick={handleCheckStep}
            className="w-full py-3 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-gv-primary/20 flex items-center justify-center gap-2"
          >
            <span>
              {isStepCompleted
                ? currentStepIndex < steps.length - 1
                  ? locale === 'es'
                    ? 'SIGUIENTE PASO'
                    : 'NEXT STEP'
                  : locale === 'es'
                  ? 'FINALIZAR MISIÓN'
                  : 'FINISH MISSION'
                : locale === 'es'
                ? 'COMPROBAR FÓRMULA'
                : 'CHECK FORMULA'}
            </span>
            {isStepCompleted && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Emergency Reveal Confirmation Dialog */}
        {showRevealConfirm && (
          <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-gv-surface-high border border-gv-warning/50 rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gv-warning font-black text-sm">
                <KeyRound className="w-5 h-5" />
                <span>¿Usar llave de emergencia?</span>
              </div>
              <p className="text-xs text-gv-muted leading-relaxed">
                Solo tienes <strong>1 llave de solución</strong> para toda esta misión de{' '}
                {steps.length} pasos. Insertará automáticamente la fórmula correcta{' '}
                <code className="text-gv-accent font-mono">{currentStep.emergencySolution}</code>.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRevealConfirm(false)}
                  className="px-3.5 py-2 rounded-xl bg-gv-surface border border-gv-border text-xs font-bold text-gv-muted hover:text-gv-text cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmEmergencyReveal}
                  className="px-4 py-2 rounded-xl bg-gv-warning text-black text-xs font-black cursor-pointer"
                >
                  Revelar fórmula
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
