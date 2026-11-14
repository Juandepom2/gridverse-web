import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  X,
  Sigma,
  GitBranch,
  Type,
  BarChart3,
  Calendar,
  Wallet,
  Command,
  ChevronDown,
  ChevronUp,
  Puzzle,
  Grid,
  CornerDownRight,
  Lightbulb,
  Flame,
  Compass,
  Wand2,
  Clock,
  Zap,
} from 'lucide-react';
import {
  FORMULAS_DATA,
  EXCEL_SHORTCUTS_DATA,
  FormulaDoc,
  ExcelShortcutDoc,
  FormulaCategoryId,
  getScenarioForFormula,
} from '../../data/formulasData';
import { SupportedLocale } from '../../types';
import { sound } from '../../lib/audio';
import { CeldiMascot } from '../CeldiMascot';
import { tr } from '../../lib/i18n';

interface FormulasTabProps {
  locale: SupportedLocale;
}

interface CategoryMeta {
  id: FormulaCategoryId;
  labelByLocale: Record<SupportedLocale, string>;
  color: string;
  Icon: React.FC<{ className?: string }>;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: 'all',
    labelByLocale: { es: 'Todas', en: 'All', de: 'Alle', fr: 'Toutes', ja: 'すべて', pt: 'Todas' },
    color: '#38BDF8',
    Icon: Sparkles,
  },
  {
    id: 'basics',
    labelByLocale: { es: 'Matemáticas', en: 'Math', de: 'Mathematik', fr: 'Maths', ja: '数学', pt: 'Matemática' },
    color: '#21C26B',
    Icon: Sigma,
  },
  {
    id: 'lookup',
    labelByLocale: { es: 'Búsqueda', en: 'Lookup', de: 'Suche', fr: 'Recherche', ja: '検索', pt: 'Pesquisa' },
    color: '#38BDF8',
    Icon: Search,
  },
  {
    id: 'logic',
    labelByLocale: { es: 'Lógicas', en: 'Logical', de: 'Logik', fr: 'Logique', ja: '論理', pt: 'Lógica' },
    color: '#F59E0B',
    Icon: GitBranch,
  },
  {
    id: 'text',
    labelByLocale: { es: 'Texto', en: 'Text', de: 'Text', fr: 'Texte', ja: '文字列', pt: 'Texto' },
    color: '#F43F5E',
    Icon: Type,
  },
  {
    id: 'stats',
    labelByLocale: { es: 'Estadística', en: 'Stats', de: 'Statistik', fr: 'Statistiques', ja: '統計', pt: 'Estatística' },
    color: '#A855F7',
    Icon: BarChart3,
  },
  {
    id: 'date',
    labelByLocale: { es: 'Fecha y Hora', en: 'Date & Time', de: 'Datum & Zeit', fr: 'Date & Heure', ja: '日付と時刻', pt: 'Data e Hora' },
    color: '#06B6D4',
    Icon: Calendar,
  },
  {
    id: 'financial',
    labelByLocale: { es: 'Finanzas', en: 'Financial', de: 'Finanzen', fr: 'Finance', ja: '財務', pt: 'Finanças' },
    color: '#10B981',
    Icon: Wallet,
  },
];

function getCategoryMeta(catId: string): CategoryMeta {
  return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];
}

function parseSyntaxArguments(syntax: string): { name: string; isOptional: boolean }[] {
  const openIdx = syntax.indexOf('(');
  const closeIdx = syntax.lastIndexOf(')');
  if (openIdx === -1 || closeIdx === -1 || closeIdx <= openIdx) return [];
  const inside = syntax.slice(openIdx + 1, closeIdx);
  const parts = inside.split(/,\s*|;\s*/);
  const res: { name: string; isOptional: boolean }[] = [];
  for (const raw of parts) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const isOptional =
      trimmed.startsWith('[') || trimmed.endsWith(']') || trimmed.includes('...');
    const cleanName = trimmed.replace(/\[|\]/g, '').trim();
    if (cleanName) {
      res.push({ name: cleanName, isOptional });
    }
  }
  return res;
}

/**
 * Live Animated Spreadsheet Visualizer matching Flutter's `FormulaActionVisualizer`
 */
const FormulaActionVisualizer: React.FC<{
  formula: FormulaDoc;
  preferEnglish: boolean;
  accentColor: string;
  langCode: string;
}> = ({ formula, preferEnglish, accentColor, langCode }) => {
  const scenario = useMemo(
    () => getScenarioForFormula(formula, preferEnglish, langCode),
    [formula, preferEnglish, langCode]
  );

  const loc = (langCode as SupportedLocale) || 'es';
  const fullFormula = preferEnglish
    ? scenario.formulaEn
    : langCode === 'es'
    ? scenario.formulaEs
    : scenario.formulaEn;

  const targetLabel =
    scenario.targetLabelByLocale[langCode] ||
    scenario.targetLabelByLocale.es ||
    scenario.targetLabelByLocale.en ||
    '';

  // Progress 0..100 over a 4-second loop
  const [stepTick, setStepTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStepTick((prev) => (prev + 1) % 40);
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  const t = stepTick / 40; // 0.0 .. 0.975
  const isTyping = t < 0.46;
  const isEnter = t >= 0.46 && t < 0.56;
  const isResult = t >= 0.56;

  const typingProgress = Math.max(0, Math.min(1, t / 0.42));
  const typedLength = Math.round(fullFormula.length * typingProgress);
  const typedText = fullFormula.slice(0, typedLength);
  const blinkCursor = stepTick % 5 < 3;

  return (
    <div
      onClick={() => {
        sound.play('tap');
        setStepTick(0);
      }}
      title="Haz clic para reiniciar la animación en vivo"
      className="w-full rounded-xl bg-gv-bg/95 border overflow-hidden shadow-md cursor-pointer select-none"
      style={{ borderColor: `${accentColor}55` }}
    >
      {/* 1. Arcade Excel Formula Bar */}
      <div className="px-2.5 py-1.5 bg-gv-surface-high border-b border-gv-border/70 flex items-center gap-2">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black border"
          style={{
            backgroundColor: `${accentColor}28`,
            borderColor: `${accentColor}88`,
            color: accentColor,
          }}
        >
          {scenario.targetCell}
        </span>
        <span className="text-xs font-mono font-black" style={{ color: accentColor }}>
          fx
        </span>
        <div className="w-[1px] h-3.5 bg-gv-border" />
        <div className="flex-1 min-w-0 font-mono text-[11px] font-extrabold truncate">
          {isTyping ? (
            <span className="text-gv-warning">
              {typedText}
              {blinkCursor ? '|' : ' '}
            </span>
          ) : (
            <span className="text-gv-text">{fullFormula}</span>
          )}
        </div>

        {/* Status Pill */}
        {isTyping ? (
          <span className="px-1.5 py-0.5 rounded bg-gv-warning/15 text-gv-warning text-[9px] font-mono font-black shrink-0">
            {tr(loc, {
              es: 'ESCRIBIENDO',
              en: 'TYPING',
              de: 'EINGABE',
              fr: 'SAISIE',
              ja: '入力中',
              pt: 'DIGITANDO',
            })}
          </span>
        ) : isEnter ? (
          <span className="px-1.5 py-0.5 rounded bg-gv-primary text-black text-[9px] font-mono font-black scale-105 transition-transform shrink-0">
            ↵ ENTER
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded bg-gv-primary/20 border border-gv-primary text-gv-primary text-[9px] font-mono font-black shrink-0">
            ✓{' '}
            {tr(loc, {
              es: 'CALCULADO',
              en: 'CALCULATED',
              de: 'BERECHNET',
              fr: 'CALCULÉ',
              ja: '計算完了',
              pt: 'CALCULADO',
            })}
          </span>
        )}
      </div>

      {/* 2. Mini Spreadsheet Grid */}
      <div className="p-2">
        <div className="rounded-lg overflow-hidden border border-gv-border/60">
          {/* Column Headers */}
          <div className="flex items-center bg-gv-surface-higher border-b border-gv-border/60">
            <div className="w-6 h-5 flex items-center justify-center border-r border-gv-border/60 text-[9px] font-mono text-gv-muted">
              #
            </div>
            {scenario.columns.map((col) => (
              <div
                key={col}
                className="flex-1 h-5 flex items-center justify-center border-r last:border-r-0 border-gv-border/60 text-[10px] font-mono font-black text-gv-muted"
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {scenario.rows.map((row, rIdx) => (
            <div
              key={rIdx}
              className="flex items-center border-b last:border-b-0 border-gv-border/50"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-gv-surface-higher border-r border-gv-border/60 text-[10px] font-mono font-bold text-gv-muted">
                {rIdx + 1}
              </div>
              {scenario.columns.map((col, cIdx) => {
                const coord = `${col}${rIdx + 1}`;
                const rawVal = row[cIdx] || '';
                const isTarget = coord === scenario.targetCell;
                const isSource = scenario.sourceCells.includes(coord);

                if (isTarget) {
                  return (
                    <div
                      key={coord}
                      className="flex-1 h-6 px-1.5 flex items-center font-mono text-[10.5px] font-black transition-all relative"
                      style={{
                        backgroundColor: isResult
                          ? 'rgba(33,194,107,0.22)'
                          : isEnter
                          ? `${accentColor}38`
                          : '#111915',
                        border: `1.5px solid ${isResult ? '#21C26B' : accentColor}`,
                      }}
                    >
                      {isResult ? (
                        <span className="text-gv-accent truncate flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-gv-primary shrink-0" />
                          {scenario.resultValue}
                        </span>
                      ) : (
                        <span className="truncate" style={{ color: accentColor }}>
                          {typedText}
                          {blinkCursor ? '|' : ''}
                        </span>
                      )}
                    </div>
                  );
                }

                if (isSource) {
                  return (
                    <div
                      key={coord}
                      className={`flex-1 h-6 px-1.5 flex items-center border-r last:border-r-0 font-mono text-[10.5px] transition-colors ${
                        isTyping
                          ? 'bg-gv-bytes/20 border-gv-bytes text-gv-bytes font-black'
                          : 'bg-gv-surface border-gv-border/50 text-gv-text font-semibold'
                      }`}
                    >
                      <span className="truncate">{rawVal}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={coord}
                    className="flex-1 h-6 px-1.5 flex items-center border-r last:border-r-0 border-gv-border/50 bg-gv-surface font-mono text-[10.5px] text-gv-muted truncate"
                  >
                    {rawVal}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Scenario Footer */}
      <div
        className="px-3 py-1 border-t flex items-center justify-between text-[10.5px] font-bold"
        style={{
          backgroundColor: `${accentColor}16`,
          borderColor: `${accentColor}35`,
        }}
      >
        <span className={isResult ? 'text-gv-accent' : 'text-gv-muted'}>
          {isTyping
            ? tr(loc, {
                es: `Escribiendo fórmula en celda ${scenario.targetCell}...`,
                en: `Typing formula in cell ${scenario.targetCell}...`,
                de: `Formel wird in Zelle ${scenario.targetCell} eingegeben...`,
                fr: `Saisie de la formule en ${scenario.targetCell}...`,
                ja: `セル ${scenario.targetCell} に数式を入力中...`,
                pt: `Digitando fórmula na célula ${scenario.targetCell}...`,
              })
            : isEnter
            ? tr(loc, {
                es: 'Evaluando referencias...',
                en: 'Evaluating references...',
                de: 'Referenzen werden ausgewertet...',
                fr: 'Évaluation des références...',
                ja: 'セル参照を計算中...',
                pt: 'Avaliando referências...',
              })
            : `${targetLabel}: ${scenario.resultValue}`}
        </span>
        <span className="text-[9px] font-mono text-gv-muted">
          {tr(loc, {
            es: 'Clic para repetir ↻',
            en: 'Click to replay ↻',
            de: 'Klicken zum Wiederholen ↻',
            fr: 'Cliquer pour rejouer ↻',
            ja: 'クリックで再生 ↻',
            pt: 'Clique para repetir ↻',
          })}
        </span>
      </div>
    </div>
  );
};

/**
 * 3D Mechanical Keycap matching Flutter's `AnimatedKeycap`
 */
const AnimatedKeycap: React.FC<{ label: string; color: string }> = ({ label, color }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <span
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        borderColor: `${color}B3`,
        boxShadow: pressed ? `0 1px 0 ${color}88` : `0 4px 0 ${color}66`,
        transform: pressed ? 'translateY(3px)' : 'translateY(0)',
        background: `linear-gradient(180deg, #1E2C25 0%, ${color}26 100%)`,
      }}
      className="inline-flex items-center justify-center px-3 py-1.5 rounded-[10px] border-[1.6px] font-mono text-xs font-black text-white select-none transition-all duration-75"
    >
      {label}
    </span>
  );
};

export const FormulasTab: React.FC<FormulasTabProps> = ({ locale }) => {
  const [activeSubTab, setActiveSubTab] = useState<'formulas' | 'shortcuts'>('formulas');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FormulaCategoryId>('all');
  const [preferEnglish, setPreferEnglish] = useState<boolean>(
    locale === 'en' || locale === 'ja'
  );
  useEffect(() => {
    setPreferEnglish(locale === 'en' || locale === 'ja');
    setSelectedShortcutCategory('all');
  }, [locale]);
  const [preferMac, setPreferMac] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
    }
    return false;
  });
  const [selectedShortcutCategory, setSelectedShortcutCategory] = useState<string>('all');
  const [expandedFormulaIds, setExpandedFormulaIds] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const langCode = locale || 'es';

  const triggerCopy = (text: string, label: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    sound.play('tap');
    setCopiedKey(keyId);
    const msg = tr(locale, {
      es: `Copiado al portapapeles: ${label}`,
      en: `Copied to clipboard: ${label}`,
      de: `In Zwischenablage kopiert: ${label}`,
      fr: `Copié dans le presse-papiers : ${label}`,
      ja: `コピーしました: ${label}`,
      pt: `Copiado para a área de transferência: ${label}`,
    });
    setToastMessage(msg);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === keyId ? null : prev));
    }, 1800);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  const toggleFormulaExpanded = (id: string) => {
    sound.play('tap');
    setExpandedFormulaIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter 107 formulas
  const filteredFormulas = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FORMULAS_DATA.filter((f) => {
      const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;

      const esName = (f.nameByLocale.es || '').toLowerCase();
      const enName = f.nameEn.toLowerCase();
      const esDesc = (f.descriptionByLocale.es || '').toLowerCase();
      const enDesc = (f.descriptionByLocale.en || '').toLowerCase();
      const esSyn = (f.syntaxByLocale.es || '').toLowerCase();
      const enSyn = (f.syntaxByLocale.en || '').toLowerCase();

      return (
        esName.includes(q) ||
        enName.includes(q) ||
        esDesc.includes(q) ||
        enDesc.includes(q) ||
        esSyn.includes(q) ||
        enSyn.includes(q) ||
        f.exampleFormula.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)) ||
        Object.values(f.nameByLocale).some((n) => n.toLowerCase().includes(q))
      );
    });
  }, [search, selectedCategory]);

  // Shortcut categories
  const shortcutCategories = useMemo(() => {
    const set = new Set<string>();
    for (const s of EXCEL_SHORTCUTS_DATA) {
      const c = s.categoryByLocale[langCode] || s.categoryByLocale.es;
      if (c) set.add(c);
    }
    return ['all', ...Array.from(set)];
  }, [langCode]);

  // Filter 32 Windows/Mac shortcuts
  const filteredShortcuts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EXCEL_SHORTCUTS_DATA.filter((s) => {
      const cat = s.categoryByLocale[langCode] || s.categoryByLocale.es || '';
      if (selectedShortcutCategory !== 'all' && cat !== selectedShortcutCategory) {
        return false;
      }
      if (!q) return true;

      const actionEs = (s.actionByLocale.es || '').toLowerCase();
      const actionEn = (s.actionByLocale.en || '').toLowerCase();
      const tipEs = (s.tipByLocale.es || '').toLowerCase();
      const tipEn = (s.tipByLocale.en || '').toLowerCase();
      const winMatch = s.keysWindows.some((k) => k.toLowerCase().includes(q));
      const macMatch = s.keysMac.some((k) => k.toLowerCase().includes(q));

      return (
        actionEs.includes(q) ||
        actionEn.includes(q) ||
        tipEs.includes(q) ||
        tipEn.includes(q) ||
        cat.toLowerCase().includes(q) ||
        winMatch ||
        macMatch
      );
    });
  }, [search, selectedShortcutCategory, langCode]);

  const getShortcutColor = (category: string): string => {
    const lower = category.toLowerCase();
    if (lower.includes('esencial') || lower.includes('essential')) return '#FF9600';
    if (lower.includes('naveg') || lower.includes('navig')) return '#38BDF8';
    if (lower.includes('edic') || lower.includes('edit')) return '#A855F7';
    if (lower.includes('fech') || lower.includes('date')) return '#F59E0B';
    return '#21C26B';
  };

  const getShortcutIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('esencial') || lower.includes('essential')) return Flame;
    if (lower.includes('naveg') || lower.includes('navig')) return Compass;
    if (lower.includes('edic') || lower.includes('edit')) return Wand2;
    if (lower.includes('fech') || lower.includes('date')) return Clock;
    return Zap;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 py-6 px-4 pb-20">
      {/* Floating Copy Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-gv-surface border-2 border-gv-primary shadow-2xl flex items-center gap-2.5 text-xs font-extrabold text-gv-text animate-fade-in">
          <div className="w-5 h-5 rounded-full bg-gv-primary/20 flex items-center justify-center text-gv-primary">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Gamified Header + 3D Language Toggle */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[15px] bg-gradient-to-br from-gv-primary to-gv-primary-dark border-2 border-gv-accent/60 shadow-[0_3px_0_#148047,0_4px_12px_rgba(33,194,107,0.3)] flex items-center justify-center text-black shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gv-text tracking-tight">
              {tr(locale, {
                es: 'Fórmulas y Atajos',
                en: 'Formulas & Shortcuts',
                de: 'Formeln & Tastenkürzel',
                fr: 'Formules & Raccourcis',
                ja: '関数辞典 & ショートカット',
                pt: 'Fórmulas e Atalhos',
              })}
            </h1>
            <p className="text-xs font-semibold text-gv-muted">
              {tr(locale, {
                es: `${FORMULAS_DATA.length} fórmulas interactivas de Excel + ${EXCEL_SHORTCUTS_DATA.length} comandos de Windows y Mac/iOS`,
                en: `${FORMULAS_DATA.length} interactive Excel formulas + ${EXCEL_SHORTCUTS_DATA.length} Windows & Mac/iOS shortcuts`,
                de: `${FORMULAS_DATA.length} interaktive Excel-Formeln + ${EXCEL_SHORTCUTS_DATA.length} Windows & Mac/iOS Kurzbefehle`,
                fr: `${FORMULAS_DATA.length} formules Excel interactives + ${EXCEL_SHORTCUTS_DATA.length} raccourcis Windows & Mac/iOS`,
                ja: `${FORMULAS_DATA.length}個のExcel関数 + ${EXCEL_SHORTCUTS_DATA.length}個のWindows / Macショートカット`,
                pt: `${FORMULAS_DATA.length} fórmulas interativas do Excel + ${EXCEL_SHORTCUTS_DATA.length} atalhos Windows e Mac/iOS`,
              })}
            </p>
          </div>
        </div>

        {/* 3D Toggle Local Language vs International English (EN) */}
        <button
          type="button"
          onClick={() => {
            sound.play('tap');
            setPreferEnglish((prev) => !prev);
          }}
          className="px-3.5 py-2 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border-2 border-gv-primary/60 shadow-[0_3px_0_rgba(33,194,107,0.35)] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="text-xs font-mono font-black text-gv-accent">
            {preferEnglish
              ? '🇺🇸 EN (XLOOKUP)'
              : tr(locale, {
                  es: '🇪🇸 ES (BUSCARX)',
                  en: '🇪🇸 ES (BUSCARX)',
                  de: '🇩🇪 DE (XVERWEIS)',
                  fr: '🇫🇷 FR (RECHERCHEX)',
                  ja: '🇯🇵 JA (XLOOKUP)',
                  pt: '🇵🇹 PT (PROCX)',
                })}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gv-primary/20 text-gv-primary font-bold">
            {tr(locale, {
              es: 'Cambiar',
              en: 'Switch',
              de: 'Wechseln',
              fr: 'Changer',
              ja: '切替',
              pt: 'Alternar',
            })}
          </span>
        </button>
      </div>

      {/* 2. Arcade Search Bar */}
      <div
        className={`relative rounded-[14px] bg-gv-surface border-[1.5px] transition-all ${
          search
            ? 'border-gv-primary shadow-[0_3px_0_rgba(33,194,107,0.28)]'
            : 'border-gv-border shadow-[0_3px_0_rgba(0,0,0,0.3)]'
        }`}
      >
        <Search
          className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            search ? 'text-gv-primary' : 'text-gv-muted'
          }`}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            activeSubTab === 'formulas'
              ? tr(locale, {
                  es: 'Buscar entre las 107 fórmulas (ej. BUSCARX, XLOOKUP, SUMA, SI.ERROR, VA...)',
                  en: 'Search across 107 formulas (e.g. XLOOKUP, VLOOKUP, SUM, IFERROR, PV...)',
                  de: 'Unter 107 Formeln suchen (z. B. XVERWEIS, XLOOKUP, SUMME, WENNFEHLER...)',
                  fr: 'Rechercher parmi 107 formules (ex. RECHERCHEX, XLOOKUP, SOMME, SIERREUR...)',
                  ja: '107個の関数を検索（例: XLOOKUP, VLOOKUP, SUM, IFERROR...）',
                  pt: 'Buscar entre as 107 fórmulas (ex. PROCX, XLOOKUP, SOMA, SEERRO...)',
                })
              : tr(locale, {
                  es: 'Buscar comando o atajo de Windows / Mac (ej. F4, Autosuma, Ctrl+T, Cmd+T...)',
                  en: 'Search Windows / Mac shortcut (e.g. F4, AutoSum, Ctrl+T, Cmd+T...)',
                  de: 'Windows / Mac Tastenkürzel suchen (z. B. F4, AutoSumme, Strg+T, Cmd+T...)',
                  fr: 'Rechercher un raccourci Windows / Mac (ex. F4, Somme auto, Ctrl+T, Cmd+T...)',
                  ja: 'Windows / Mac ショートカットを検索（例: F4, オートSUM, Ctrl+T, Cmd+T...）',
                  pt: 'Buscar comando ou atalho Windows / Mac (ex. F4, AutoSoma, Ctrl+T, Cmd+T...)',
                })
          }
          className="w-full pl-11 pr-10 py-3 bg-transparent text-xs sm:text-sm font-semibold text-gv-text placeholder:text-gv-muted/70 focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gv-muted hover:text-gv-text cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Arcade Capsule Tab Bar (Fórmulas vs Atajos Windows / Mac) */}
      <div className="p-1 rounded-[14px] bg-gv-surface border-[1.5px] border-gv-border grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => {
            sound.play('tap');
            setActiveSubTab('formulas');
          }}
          className={`py-2.5 px-3 rounded-[10px] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'formulas'
              ? 'bg-gradient-to-r from-gv-primary/25 to-gv-bytes/20 border-[1.5px] border-gv-primary text-gv-primary shadow-sm'
              : 'text-gv-muted hover:text-gv-text border-[1.5px] border-transparent'
          }`}
        >
          <Sigma className="w-4 h-4" />
          <span>
            {tr(locale, {
              es: `Fórmulas (${FORMULAS_DATA.length})`,
              en: `Formulas (${FORMULAS_DATA.length})`,
              de: `Formeln (${FORMULAS_DATA.length})`,
              fr: `Formules (${FORMULAS_DATA.length})`,
              ja: `関数 (${FORMULAS_DATA.length})`,
              pt: `Fórmulas (${FORMULAS_DATA.length})`,
            })}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('tap');
            setActiveSubTab('shortcuts');
          }}
          className={`py-2.5 px-3 rounded-[10px] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'shortcuts'
              ? 'bg-gradient-to-r from-gv-primary/25 to-gv-bytes/20 border-[1.5px] border-gv-primary text-gv-primary shadow-sm'
              : 'text-gv-muted hover:text-gv-text border-[1.5px] border-transparent'
          }`}
        >
          <Command className="w-4 h-4" />
          <span>
            {tr(locale, {
              es: `Comandos Windows / Mac (${EXCEL_SHORTCUTS_DATA.length})`,
              en: `Windows / Mac Shortcuts (${EXCEL_SHORTCUTS_DATA.length})`,
              de: `Windows / Mac Kürzel (${EXCEL_SHORTCUTS_DATA.length})`,
              fr: `Raccourcis Windows / Mac (${EXCEL_SHORTCUTS_DATA.length})`,
              ja: `Windows / Mac ショートカット (${EXCEL_SHORTCUTS_DATA.length})`,
              pt: `Atalhos Windows / Mac (${EXCEL_SHORTCUTS_DATA.length})`,
            })}
          </span>
        </button>
      </div>

      {/* ================= TAB 1: 107 FORMULAS ================= */}
      {activeSubTab === 'formulas' && (
        <>
          {/* 3D Category Chip Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? FORMULAS_DATA.length
                  : FORMULAS_DATA.filter((f) => f.category === cat.id).length;
              const Icon = cat.Icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    sound.play('tap');
                    setSelectedCategory(cat.id);
                  }}
                  style={{
                    borderColor: isSelected ? cat.color : '#233229',
                    backgroundColor: isSelected ? `${cat.color}24` : '#111915',
                    boxShadow: isSelected
                      ? `0 3px 0 ${cat.color}66`
                      : '0 2px 0 rgba(0,0,0,0.35)',
                  }}
                  className="px-3 py-2 rounded-xl border-[1.6px] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer hover:brightness-110"
                >
                  <span style={{ color: cat.color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span
                    className="text-xs font-extrabold"
                    style={{ color: isSelected ? cat.color : '#E3F2EA' }}
                  >
                    {tr(locale, cat.labelByLocale)}
                  </span>
                  <span
                    className="px-1.5 py-0.2 rounded-md text-[10px] font-mono font-black"
                    style={{
                      backgroundColor: isSelected ? `${cat.color}33` : '#19241E',
                      color: isSelected ? cat.color : '#8FA89B',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Formula Cards List */}
          {filteredFormulas.length === 0 ? (
            <div className="bg-gv-surface border border-gv-border rounded-2xl p-10 text-center flex flex-col items-center gap-3">
              <CeldiMascot mood="thinking" size={64} />
              <p className="text-sm font-extrabold text-gv-text">
                {tr(locale, {
                  es: `No se encontraron fórmulas con "${search}"`,
                  en: `No formulas found matching "${search}"`,
                  de: `Keine Formeln gefunden für "${search}"`,
                  fr: `Aucune formule trouvée pour "${search}"`,
                  ja: `「${search}」に一致する関数が見つかりません`,
                  pt: `Nenhuma fórmula encontrada para "${search}"`,
                })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-gv-primary text-black text-xs font-black cursor-pointer"
              >
                {tr(locale, {
                  es: `Ver todas las ${FORMULAS_DATA.length} fórmulas`,
                  en: `View all ${FORMULAS_DATA.length} formulas`,
                  de: `Alle ${FORMULAS_DATA.length} Formeln anzeigen`,
                  fr: `Voir les ${FORMULAS_DATA.length} formules`,
                  ja: `全 ${FORMULAS_DATA.length} 個の関数を表示`,
                  pt: `Ver todas as ${FORMULAS_DATA.length} fórmulas`,
                })}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFormulas.map((formula) => {
                const catMeta = getCategoryMeta(formula.category);
                const catColor = catMeta.color;
                const CatIcon = catMeta.Icon;
                const primaryName = preferEnglish
                  ? formula.nameEn
                  : formula.nameByLocale[langCode] ||
                    formula.nameByLocale.es ||
                    formula.nameEn;
                const secondaryName = preferEnglish
                  ? formula.nameByLocale[langCode] ||
                    formula.nameByLocale.es ||
                    formula.nameEn
                  : formula.nameEn;
                const description =
                  formula.descriptionByLocale[langCode] ||
                  formula.descriptionByLocale.es ||
                  formula.descriptionByLocale.en ||
                  '';
                const syntax = preferEnglish
                  ? formula.syntaxByLocale.en || formula.syntaxByLocale.es
                  : formula.syntaxByLocale[langCode] ||
                    formula.syntaxByLocale.es ||
                    formula.syntaxByLocale.en ||
                    '';
                const exampleContext =
                  formula.exampleContextByLocale[langCode] ||
                  formula.exampleContextByLocale.es ||
                  '';
                const exampleResult =
                  formula.exampleResultByLocale[langCode] ||
                  formula.exampleResultByLocale.es ||
                  '';
                const proTip =
                  formula.proTipByLocale[langCode] ||
                  formula.proTipByLocale.es ||
                  '';

                const isExpanded = Boolean(expandedFormulaIds[formula.id]);
                const parsedArgs = parseSyntaxArguments(syntax);
                const isSyntaxCopied = copiedKey === `syn_${formula.id}`;
                const isExCopied = copiedKey === `ex_${formula.id}`;

                return (
                  <div
                    key={formula.id}
                    style={{
                      borderColor: isExpanded ? catColor : `${catColor}88`,
                      boxShadow: isExpanded
                        ? `0 5px 0 ${catColor}66, 0 8px 24px ${catColor}28`
                        : `0 4px 0 ${catColor}55`,
                    }}
                    className="rounded-[20px] bg-gv-surface border-2 overflow-hidden transition-all"
                  >
                    {/* Collectible Card Header */}
                    <div
                      onClick={() => toggleFormulaExpanded(formula.id)}
                      style={{
                        background: `linear-gradient(135deg, ${catColor}2E 0%, ${catColor}08 100%)`,
                      }}
                      className="p-4 flex items-start justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* 3D fx Badge */}
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${catColor} 0%, #0D1712 160%)`,
                            boxShadow: `0 3px 0 rgba(0,0,0,0.45)`,
                          }}
                          className="w-11 h-11 rounded-[14px] border border-white/30 flex items-center justify-center font-mono font-black text-base text-white shrink-0"
                        >
                          fx
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-mono font-black text-gv-text">
                              ={primaryName}
                            </h3>
                            {secondaryName !== primaryName && (
                              <span className="px-2 py-0.5 rounded-md bg-gv-surface-higher border border-gv-border font-mono text-[11px] font-bold text-gv-muted">
                                {preferEnglish ? locale.toUpperCase() : 'EN'}: ={secondaryName}
                              </span>
                            )}
                            <span
                              style={{
                                backgroundColor: `${catColor}26`,
                                borderColor: `${catColor}66`,
                                color: catColor,
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-black uppercase"
                            >
                              <CatIcon className="w-3 h-3" />
                              {tr(locale, catMeta.labelByLocale)}
                            </span>
                          </div>
                          <p className="text-xs sm:text-[13px] text-gv-text/90 mt-1.5 leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg bg-gv-surface-high/80 border border-gv-border text-gv-muted hover:text-gv-text shrink-0"
                        aria-label="Expandir detalles"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Live Animated Spreadsheet Visualizer */}
                    <div className="px-4 pt-1 pb-2.5">
                      <FormulaActionVisualizer
                        formula={formula}
                        preferEnglish={preferEnglish}
                        accentColor={catColor}
                        langCode={langCode}
                      />
                    </div>

                    {/* Console Syntax Bar */}
                    <div className="px-4 pb-3.5">
                      <div
                        style={{ borderColor: `${catColor}55` }}
                        className="px-3 py-2 rounded-xl bg-gv-bg border flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            style={{
                              backgroundColor: `${catColor}28`,
                              color: catColor,
                            }}
                            className="px-2 py-0.5 rounded text-[9.5px] font-mono font-black uppercase shrink-0"
                          >
                            {tr(locale, {
                              es: 'SINTAXIS',
                              en: 'SYNTAX',
                              de: 'SYNTAX',
                              fr: 'SYNTAXE',
                              ja: '構文',
                              pt: 'SINTAXE',
                            })}
                          </span>
                          <code className="text-xs font-mono font-bold text-gv-text overflow-x-auto whitespace-nowrap">
                            {syntax}
                          </code>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(syntax, primaryName, `syn_${formula.id}`)
                          }
                          style={{
                            borderColor: isSyntaxCopied ? '#21C26B' : `${catColor}66`,
                            color: isSyntaxCopied ? '#21C26B' : catColor,
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gv-surface-high border text-[11px] font-mono font-extrabold flex items-center gap-1 shrink-0 hover:brightness-110 cursor-pointer"
                        >
                          {isSyntaxCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>
                                {tr(locale, {
                                  es: 'Copiado',
                                  en: 'Copied',
                                  de: 'Kopiert',
                                  fr: 'Copié',
                                  ja: 'コピー済',
                                  pt: 'Copiado',
                                })}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>
                                {tr(locale, {
                                  es: 'Copiar',
                                  en: 'Copy',
                                  de: 'Kopieren',
                                  fr: 'Copier',
                                  ja: 'コピー',
                                  pt: 'Copiar',
                                })}
                              </span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Toggle Expand Footer Button */}
                      <button
                        type="button"
                        onClick={() => toggleFormulaExpanded(formula.id)}
                        className="mt-2 w-full py-1.5 rounded-lg bg-gv-surface-high/60 hover:bg-gv-surface-high text-[11px] font-bold text-gv-muted hover:text-gv-text flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>
                          {isExpanded
                            ? tr(locale, {
                                es: 'Ocultar asistente de argumentos y ejemplo',
                                en: 'Hide argument helper & example',
                                de: 'Argument-Assistent und Beispiel ausblenden',
                                fr: "Masquer l'assistant d'arguments et l'exemple",
                                ja: '引数ガイドと実践例を閉じる',
                                pt: 'Ocultar assistente de argumentos e exemplo',
                              })
                            : tr(locale, {
                                es: 'Ver asistente de argumentos, ejemplo práctico y Pro Tip',
                                en: 'View argument helper, practical example & Pro Tip',
                                de: 'Argument-Assistent, Praxisbeispiel & Pro-Tipp anzeigen',
                                fr: "Voir l'assistant d'arguments, l'exemple pratique et le Pro Tip",
                                ja: '引数ガイド・実践例・プロのコツを表示',
                                pt: 'Ver assistente de argumentos, exemplo prático e Dica Pro',
                              })}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Expandable Section: 1. Arguments Wizard + 2. Practical Example + 3. Celdi Pro Tip */}
                    {isExpanded && (
                      <div className="border-t border-gv-border/70 p-4 flex flex-col gap-4 bg-gv-surface-high/30">
                        {/* 1. Asistente de Argumentos */}
                        {parsedArgs.length > 0 && (
                          <div>
                            <div
                              className="flex items-center gap-1.5 text-[11px] font-mono font-black uppercase mb-2"
                              style={{ color: catColor }}
                            >
                              <Puzzle className="w-3.5 h-3.5" />
                              <span>
                                {tr(locale, {
                                  es: 'ASISTENTE DE ARGUMENTOS',
                                  en: 'ARGUMENT HELPER',
                                  de: 'ARGUMENT-ASSISTENT',
                                  fr: "ASSISTANT D'ARGUMENTS",
                                  ja: '引数ガイド',
                                  pt: 'ASSISTENTE DE ARGUMENTOS',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {parsedArgs.map((arg, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    borderColor: arg.isOptional
                                      ? '#233229'
                                      : `${catColor}77`,
                                    backgroundColor: arg.isOptional
                                      ? '#111915'
                                      : `${catColor}18`,
                                  }}
                                  className="px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-xs font-mono"
                                >
                                  <span
                                    className="font-bold"
                                    style={{
                                      color: arg.isOptional ? '#8FA89B' : '#E3F2EA',
                                    }}
                                  >
                                    {arg.name}
                                  </span>
                                  <span
                                    className="text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase"
                                    style={{
                                      backgroundColor: arg.isOptional
                                        ? '#19241E'
                                        : `${catColor}33`,
                                      color: arg.isOptional ? '#8FA89B' : catColor,
                                    }}
                                  >
                                    {arg.isOptional
                                      ? tr(locale, {
                                          es: 'Opcional',
                                          en: 'Optional',
                                          de: 'Optional',
                                          fr: 'Optionnel',
                                          ja: '任意',
                                          pt: 'Opcional',
                                        })
                                      : tr(locale, {
                                          es: 'Requerido',
                                          en: 'Required',
                                          de: 'Erforderlich',
                                          fr: 'Requis',
                                          ja: '必須',
                                          pt: 'Obrigatório',
                                        })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. Mini Hoja de Ejemplo Práctico */}
                        <div>
                          <div
                            className="flex items-center gap-1.5 text-[11px] font-mono font-black uppercase mb-2"
                            style={{ color: catColor }}
                          >
                            <Grid className="w-3.5 h-3.5" />
                            <span>
                              {tr(locale, {
                                es: 'EJEMPLO PRÁCTICO EN EXCEL',
                                en: 'PRACTICAL EXCEL EXAMPLE',
                                de: 'PRAXISBEISPIEL IN EXCEL',
                                fr: 'EXEMPLE PRATIQUE EXCEL',
                                ja: 'Excelでの実践例',
                                pt: 'EXEMPLO PRÁTICO NO EXCEL',
                              })}
                            </span>
                          </div>
                          <div className="rounded-xl bg-gv-bg border border-gv-border overflow-hidden">
                            {/* Window Title Bar */}
                            <div className="px-3 py-1.5 bg-gv-surface border-b border-gv-border flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-gv-error inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-gv-warning inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-gv-primary inline-block" />
                              <span className="text-[11px] font-bold text-gv-text ml-1 truncate">
                                {exampleContext}
                              </span>
                            </div>

                            <div className="p-3 flex flex-col gap-2.5">
                              <div className="px-3 py-2 rounded-lg bg-gv-surface border border-gv-warning/50 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="px-1.5 py-0.5 rounded bg-gv-warning/20 text-gv-warning font-mono text-[10px] font-black">
                                    B2
                                  </span>
                                  <code className="font-mono text-xs font-extrabold text-gv-warning truncate">
                                    {formula.exampleFormula}
                                  </code>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    triggerCopy(
                                      formula.exampleFormula,
                                      formula.exampleFormula,
                                      `ex_${formula.id}`
                                    )
                                  }
                                  className="px-2 py-1 rounded bg-gv-warning/15 hover:bg-gv-warning/25 text-gv-warning text-[10px] font-mono font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                                >
                                  {isExCopied ? (
                                    <Check className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  <span>
                                    {isExCopied
                                      ? tr(locale, {
                                          es: 'Copiado',
                                          en: 'Copied',
                                          de: 'Kopiert',
                                          fr: 'Copié',
                                          ja: 'コピー済',
                                          pt: 'Copiado',
                                        })
                                      : tr(locale, {
                                          es: 'Copiar',
                                          en: 'Copy',
                                          de: 'Kopieren',
                                          fr: 'Copier',
                                          ja: 'コピー',
                                          pt: 'Copiar',
                                        })}
                                  </span>
                                </button>
                              </div>

                              <div className="flex items-center gap-2 text-xs">
                                <CornerDownRight className="w-4 h-4 text-gv-primary shrink-0" />
                                <span className="text-gv-muted font-bold">
                                  {tr(locale, {
                                    es: 'Resultado:',
                                    en: 'Result:',
                                    de: 'Ergebnis:',
                                    fr: 'Résultat :',
                                    ja: '結果:',
                                    pt: 'Resultado:',
                                  })}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-gv-primary/20 border border-gv-primary/60 font-mono font-black text-gv-primary">
                                  {exampleResult}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Consejo Ninja de Celdi */}
                        {proTip && (
                          <div className="p-3.5 rounded-xl bg-gradient-to-br from-gv-streak/20 to-gv-streak/5 border border-gv-streak/50 flex items-start gap-3">
                            <CeldiMascot mood="happy" size={38} className="shrink-0" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-[10.5px] font-mono font-black text-gv-streak uppercase">
                                <Lightbulb className="w-3.5 h-3.5" />
                                <span>
                                  {tr(locale, {
                                    es: 'CONSEJO PRO DE CELDI',
                                    en: "CELDI'S PRO TIP",
                                    de: 'CELDIS PRO-TIPP',
                                    fr: 'CONSEIL PRO DE CELDI',
                                    ja: 'CELDIのプロのコツ',
                                    pt: 'DICA PRO DO CELDI',
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-gv-text mt-1 leading-relaxed">
                                {proTip}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: 32 WINDOWS & MAC/iOS SHORTCUTS ================= */}
      {activeSubTab === 'shortcuts' && (
        <>
          {/* OS Switcher Bar (Windows vs Mac / iOS) */}
          <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-gv-text">
                {tr(locale, {
                  es: 'Comandos y Atajos de Teclado Aceleradores',
                  en: 'Accelerator Keyboard Commands & Shortcuts',
                  de: 'Tastenkürzel & Schnellbefehle',
                  fr: 'Commandes et raccourcis clavier accélérateurs',
                  ja: '業務効率を加速するキーボードショートカット',
                  pt: 'Comandos e Atalhos de Teclado Aceleradores',
                })}
              </h2>
              <p className="text-xs text-gv-muted">
                {tr(locale, {
                  es: 'Haz clic en cualquier tarjeta para copiar el comando o alterna entre Windows y Mac/iOS:',
                  en: 'Click any card to copy the shortcut or switch between Windows and Mac/iOS:',
                  de: 'Klicke auf eine Karte zum Kopieren oder wechsle zwischen Windows und Mac/iOS:',
                  fr: 'Clique sur une carte pour copier la commande ou bascule entre Windows et Mac/iOS :',
                  ja: 'カードをクリックしてコピー、またはWindowsとMac/iOSを切り替え:',
                  pt: 'Clique em qualquer cartão para copiar o comando ou alterne entre Windows e Mac/iOS:',
                })}
              </p>
            </div>

            <div className="p-1 rounded-xl bg-gv-bg border border-gv-border flex items-center gap-1 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setPreferMac(false);
                }}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  !preferMac
                    ? 'bg-[#38BDF8]/20 border border-[#38BDF8] text-[#38BDF8]'
                    : 'text-gv-muted hover:text-gv-text border border-transparent'
                }`}
              >
                🪟 Windows / PC
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setPreferMac(true);
                }}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  preferMac
                    ? 'bg-[#A855F7]/20 border border-[#A855F7] text-[#A855F7]'
                    : 'text-gv-muted hover:text-gv-text border border-transparent'
                }`}
              >
                🍎 Mac / iOS
              </button>
            </div>
          </div>

          {/* Shortcut Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {shortcutCategories.map((cat) => {
              const isSelected = selectedShortcutCategory === cat;
              const label =
                cat === 'all'
                  ? tr(locale, {
                      es: 'Todos los comandos',
                      en: 'All shortcuts',
                      de: 'Alle Kurzbefehle',
                      fr: 'Tous les raccourcis',
                      ja: 'すべてのショートカット',
                      pt: 'Todos os atalhos',
                    })
                  : cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    sound.play('tap');
                    setSelectedShortcutCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-gv-primary text-black border-gv-primary'
                      : 'bg-gv-surface border-gv-border text-gv-muted hover:text-gv-text'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* 32 Mechanical Keycap Shortcut Cards */}
          {filteredShortcuts.length === 0 ? (
            <div className="bg-gv-surface border border-gv-border rounded-2xl p-10 text-center flex flex-col items-center gap-3">
              <CeldiMascot mood="thinking" size={64} />
              <p className="text-sm font-extrabold text-gv-text">
                {tr(locale, {
                  es: `No se encontraron comandos con "${search}"`,
                  en: `No shortcuts found matching "${search}"`,
                  de: `Keine Kurzbefehle gefunden für "${search}"`,
                  fr: `Aucun raccourci trouvé pour "${search}"`,
                  ja: `「${search}」に一致するショートカットが見つかりません`,
                  pt: `Nenhum atalho encontrado para "${search}"`,
                })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedShortcutCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-gv-primary text-black text-xs font-black cursor-pointer"
              >
                {tr(locale, {
                  es: 'Ver todos los comandos',
                  en: 'View all shortcuts',
                  de: 'Alle Kurzbefehle anzeigen',
                  fr: 'Voir tous les raccourcis',
                  ja: 'すべて表示',
                  pt: 'Ver todos os atalhos',
                })}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredShortcuts.map((shortcut: ExcelShortcutDoc) => {
                const activeKeys = preferMac ? shortcut.keysMac : shortcut.keysWindows;
                const altKeys = preferMac ? shortcut.keysWindows : shortcut.keysMac;
                const keysJoined = activeKeys.join(' + ');
                const altKeysJoined = altKeys.join(' + ');
                const action =
                  shortcut.actionByLocale[langCode] ||
                  shortcut.actionByLocale.es ||
                  shortcut.actionByLocale.en ||
                  '';
                const category =
                  shortcut.categoryByLocale[langCode] ||
                  shortcut.categoryByLocale.es ||
                  shortcut.categoryByLocale.en ||
                  '';
                const tip =
                  shortcut.tipByLocale[langCode] ||
                  shortcut.tipByLocale.es ||
                  shortcut.tipByLocale.en ||
                  '';
                const catColor = getShortcutColor(category);
                const CatIcon = getShortcutIcon(category);
                const isCopied = copiedKey === `sc_${shortcut.id}`;

                return (
                  <div
                    key={shortcut.id}
                    onClick={() =>
                      triggerCopy(keysJoined, `${keysJoined} (${action})`, `sc_${shortcut.id}`)
                    }
                    style={{
                      borderColor: `${catColor}88`,
                      boxShadow: `0 4px 0 ${catColor}55`,
                      background: `linear-gradient(135deg, ${catColor}1F 0%, #111915 65%)`,
                    }}
                    className="rounded-[18px] border-2 p-4 flex flex-col justify-between gap-3.5 hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Top Row: Category Badge + Alt OS pill + Copy Button */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          style={{
                            backgroundColor: `${catColor}24`,
                            borderColor: `${catColor}66`,
                            color: catColor,
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-mono font-black uppercase"
                        >
                          <CatIcon className="w-3 h-3" />
                          {category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-gv-bg/80 border border-gv-border text-[10px] font-mono text-gv-muted">
                            {preferMac ? `🪟 Win: ${altKeysJoined}` : `🍎 Mac: ${altKeysJoined}`}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerCopy(keysJoined, keysJoined, `sc_${shortcut.id}`);
                            }}
                            style={{
                              borderColor: isCopied ? '#21C26B' : `${catColor}66`,
                              color: isCopied ? '#21C26B' : catColor,
                            }}
                            className="p-1.5 rounded-lg bg-gv-surface-high border hover:brightness-110 cursor-pointer"
                            title={`Copiar ${keysJoined}`}
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 3D Mechanical Keycaps */}
                      <div className="flex items-center gap-1.5 flex-wrap py-1">
                        {activeKeys.map((k, idx) => (
                          <React.Fragment key={idx}>
                            <AnimatedKeycap label={k} color={catColor} />
                            {idx < activeKeys.length - 1 && (
                              <span
                                className="font-mono text-sm font-black px-0.5"
                                style={{ color: catColor }}
                              >
                                +
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Action & Tip */}
                      <div>
                        <h3 className="text-sm font-extrabold text-gv-text">
                          {action}
                        </h3>
                        <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
