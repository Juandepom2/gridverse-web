import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, AlertCircle, Sparkles, Award } from 'lucide-react';
import { MissionData } from '../../data/coursesData';
import { SupportedLocale } from '../../types';
import { CeldiMascot, CeldiMood } from '../CeldiMascot';
import { SpreadsheetGrid } from '../SpreadsheetGrid';
import { sound } from '../../lib/audio';

interface MissionModalProps {
  mission: MissionData;
  locale: SupportedLocale;
  onClose: () => void;
  onSuccess: (xp: number, gems: number) => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  mission,
  locale,
  onClose,
  onSuccess,
}) => {
  const [sheetData, setSheetData] = useState(mission.initialSheetData);
  const [userFormula, setUserFormula] = useState(mission.targetFormula.split('(')[0] + '(');
  const [selectedCell, setSelectedCell] = useState('B5');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [celdiMood, setCeldiMood] = useState<CeldiMood>('thinking');

  const handleVerify = () => {
    const cleanUser = userFormula.replace(/\s+/g, '').toUpperCase();
    const cleanTarget = mission.correctAnswer.replace(/\s+/g, '').toUpperCase();
    const won = cleanUser === cleanTarget;

    setIsAnswered(true);
    setIsCorrect(won);

    if (won) {
      sound.play('correct');
      sound.play('level_win');
      setCeldiMood('celebrating');
      confetti({ particleCount: 80, spread: 60 });
      onSuccess(mission.earnedXp, mission.earnedBytes);
    } else {
      sound.play('wrong');
      setCeldiMood('sad');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gv-surface border border-gv-border rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gv-border bg-gv-surface-high">
          <div className="flex items-center gap-2">
            <span className="text-xl">{mission.emoji}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gv-primary">
                {mission.client}
              </span>
              <h3 className="text-sm md:text-base font-bold text-gv-text">
                {mission.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 flex flex-col gap-5">
          {/* Client Story & Mascot */}
          <div className="flex items-start gap-4 bg-gv-surface-high/60 border border-gv-border rounded-xl p-4">
            <CeldiMascot mood={celdiMood} size={64} />
            <div className="flex-1">
              <p className="text-xs text-gv-muted leading-relaxed">
                {mission.description}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs">
                <span className="font-bold text-gv-accent">Habilidades: {mission.skills}</span>
                <span className="text-gv-bytes font-mono font-bold">+{mission.earnedXp} XP</span>
              </div>
            </div>
          </div>

          {/* Interactive Sheet Grid */}
          <div>
            <div className="text-xs font-bold text-gv-text mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gv-primary" />
              <span>{mission.instruction}</span>
            </div>
            <SpreadsheetGrid
              data={sheetData}
              selectedCell={selectedCell}
              onSelectCell={setSelectedCell}
              targetFormula={userFormula}
            />
          </div>

          {/* Formula Input Bar */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono text-gv-muted font-bold">
              Escribe o completa la fórmula requerida:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={userFormula}
                  onChange={(e) => setUserFormula(e.target.value)}
                  disabled={isCorrect}
                  className="w-full px-3 py-2.5 rounded-xl bg-gv-bg border border-gv-border font-mono text-sm text-gv-accent font-bold focus:outline-none focus:border-gv-primary"
                  placeholder="=SUM(B2:B4)"
                />
              </div>
              <button
                onClick={handleVerify}
                disabled={isCorrect}
                className="px-5 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shrink-0"
              >
                {isCorrect ? '¡Completada!' : 'Verificar'}
              </button>
            </div>
          </div>

          {/* Answer Feedback */}
          {isAnswered && (
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                isCorrect
                  ? 'bg-gv-primary-soft/60 border-gv-primary text-gv-accent'
                  : 'bg-gv-error/15 border-gv-error text-gv-error'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-gv-accent" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gv-error" />
                )}
                <span className="font-bold">
                  {isCorrect
                    ? '¡Misión resuelta con éxito! Datos calculados correctamente.'
                    : 'Fórmula incorrecta. Revisa el rango o sintaxis.'}
                </span>
              </div>
              {isCorrect && (
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-gv-primary text-black font-bold cursor-pointer"
                >
                  Finalizar Misión
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
