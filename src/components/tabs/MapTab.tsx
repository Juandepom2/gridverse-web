import React from 'react';
import { Star, Lock, Play, CheckCircle2, Trophy, Zap, ShieldAlert } from 'lucide-react';
import { UserStats, SupportedLocale } from '../../types';
import { sound } from '../../lib/audio';

interface MapTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onSelectLevel: (levelRef: string, file: string) => void;
}

interface StageSection {
  id: string;
  title: Record<SupportedLocale, string>;
  description: Record<SupportedLocale, string>;
  badge: string;
  levels: { ref: string; file: string; title: Record<SupportedLocale, string>; isBoss?: boolean }[];
}

const STAGES: StageSection[] = [
  {
    id: 'stage-1',
    title: {
      es: 'Etapa 1: Celdas y Coordenadas',
      en: 'Stage 1: Cells & Coordinates',
      de: 'Stufe 1: Zellen & Koordinaten',
      fr: 'Étape 1: Cellules et Coordonnées',
      ja: 'ステージ1: セルと座標',
      pt: 'Etapa 1: Células e Coordenadas',
    },
    description: {
      es: 'Aprende a ubicar columnas, filas y seleccionar rangos como un profesional.',
      en: 'Master column letters, row numbers and precise range selections.',
      de: 'Lerne Spalten, Zeilen und Bereichsauswahl wie ein Profi.',
      fr: 'Maîtrisez les colonnes, les lignes et les sélections de plages.',
      ja: '列、行、セル範囲の選択をマスターしましょう。',
      pt: 'Domine colunas, linhas e seleção de intervalos como um profissional.',
    },
    badge: 'Principiante',
    levels: [
      {
        ref: 'A1',
        file: 'a1.json',
        title: {
          es: 'Hola, celda',
          en: 'Hello, Cell',
          de: 'Hallo, Zelle',
          fr: 'Bonjour, cellule',
          ja: 'ハロー、セル',
          pt: 'Olá, célula',
        },
      },
      {
        ref: 'A2',
        file: 'a2.json',
        title: {
          es: 'Filas y Columnas',
          en: 'Rows & Columns',
          de: 'Zeilen & Spalten',
          fr: 'Lignes et Colonnes',
          ja: '行と列',
          pt: 'Linhas e Colunas',
        },
      },
      {
        ref: 'A3',
        file: 'a3.json',
        title: {
          es: 'Rangos Simples',
          en: 'Simple Ranges',
          de: 'Einfache Bereiche',
          fr: 'Plages Simples',
          ja: 'シンプルな範囲',
          pt: 'Intervalos Simples',
        },
      },
      {
        ref: 'A4',
        file: 'a4.json',
        title: {
          es: 'Selección Rápida',
          en: 'Quick Selection',
          de: 'Schnellauswahl',
          fr: 'Sélection Rapide',
          ja: 'クイック選択',
          pt: 'Seleção Rápida',
        },
      },
      {
        ref: 'A5',
        file: 'a5.json',
        title: {
          es: 'Boss: Error de Referencia',
          en: 'Boss: Reference Error',
          de: 'Boss: Bezugsfehler',
          fr: 'Boss: Erreur de Référence',
          ja: 'ボス: 参照エラー',
          pt: 'Boss: Erro de Referência',
        },
        isBoss: true,
      },
    ],
  },
  {
    id: 'stage-2',
    title: {
      es: 'Etapa 2: Aritmética y Operadores',
      en: 'Stage 2: Basic Arithmetic',
      de: 'Stufe 2: Grundrechenarten',
      fr: 'Étape 2: Arithmétique de Base',
      ja: 'ステージ2: 基本演算',
      pt: 'Etapa 2: Aritmética Básica',
    },
    description: {
      es: 'Escribe fórmulas con +, -, *, / y referencias dinámicas entre celdas.',
      en: 'Build formulas with operators and dynamic cell calculations.',
      de: 'Formeln mit +, -, *, / und dynamischen Zellbezügen erstellen.',
      fr: 'Créez des formules dynamiques avec des opérateurs arithmétiques.',
      ja: '演算子とセル参照を使った動的計算をマスター。',
      pt: 'Crie fórmulas com operadores e referências dinâmicas.',
    },
    badge: 'Operador',
    levels: [
      {
        ref: 'B1',
        file: 'b1.json',
        title: {
          es: 'Suma de Dos Celdas',
          en: 'Sum of Two Cells',
          de: 'Zwei Zellen addieren',
          fr: 'Somme de Deux Cellules',
          ja: '2つのセルの足し算',
          pt: 'Soma de Duas Células',
        },
      },
      {
        ref: 'B2',
        file: 'b2.json',
        title: {
          es: 'Resta y Multiplicación',
          en: 'Subtract & Multiply',
          de: 'Subtraktion & Multiplikation',
          fr: 'Soustraction & Multiplication',
          ja: '引き算と掛け算',
          pt: 'Subtração e Multiplicação',
        },
      },
      {
        ref: 'B3',
        file: 'b3.json',
        title: {
          es: 'Orden de Operaciones (PEMDAS)',
          en: 'Order of Operations',
          de: 'Punkt vor Strich',
          fr: 'Priorité des Opérations',
          ja: '計算の優先順位',
          pt: 'Ordem das Operações',
        },
      },
      {
        ref: 'B4',
        file: 'b4.json',
        title: {
          es: 'Boss: División por Cero #DIV/0!',
          en: 'Boss: Division by Zero',
          de: 'Boss: Division durch Null',
          fr: 'Boss: Division par Zéro',
          ja: 'ボス: ゼロ除算エラー',
          pt: 'Boss: Divisão por Zero',
        },
        isBoss: true,
      },
    ],
  },
  {
    id: 'stage-3',
    title: {
      es: 'Etapa 3: Búsquedas Épicas (XLOOKUP & VLOOKUP)',
      en: 'Stage 3: Epic Lookups (XLOOKUP & VLOOKUP)',
      de: 'Stufe 3: Verweise (XVERWEIS & SVERWEIS)',
      fr: 'Étape 3: Recherches (RECHERCHEX & RECHERCHEV)',
      ja: 'ステージ3: 検索関数 (XLOOKUP & VLOOKUP)',
      pt: 'Etapa 3: Buscas Épicas (PROCX & PROCV)',
    },
    description: {
      es: 'Conecta tablas en segundos sin equivocarte jamás de fila o columna.',
      en: 'Connect data tables seamlessly and master exact match lookups.',
      de: 'Tabellen blitzschnell verbinden und genaue Suchen meistern.',
      fr: 'Liez des tableaux en quelques secondes sans erreurs.',
      ja: '異なる表のデータを瞬時に紐付ける強力なテクニック。',
      pt: 'Conecte tabelas em segundos com buscas perfeitas.',
    },
    badge: 'Avanzado',
    levels: [
      {
        ref: 'C1',
        file: 'c1.json',
        title: {
          es: 'Anatomía de BUSCARV',
          en: 'VLOOKUP Anatomy',
          de: 'SVERWEIS Aufbau',
          fr: 'Anatomie RECHERCHEV',
          ja: 'VLOOKUPの仕組み',
          pt: 'Anatomia do PROCV',
        },
      },
      {
        ref: 'C2',
        file: 'c2.json',
        title: {
          es: 'El Poder de BUSCARX',
          en: 'The Power of XLOOKUP',
          de: 'Die Kraft von XVERWEIS',
          fr: 'La Puissance de RECHERCHEX',
          ja: 'XLOOKUPの威力',
          pt: 'O Poder do PROCX',
        },
      },
      {
        ref: 'C3',
        file: 'c3.json',
        title: {
          es: 'Boss Final: Error #N/A Battle',
          en: 'Final Boss: #N/A Error Battle',
          de: 'Endboss: #NV Fehlerkampf',
          fr: 'Boss Final: Combat #N/A',
          ja: '最終ボス: #N/A エラー討伐',
          pt: 'Boss Final: Batalha #N/D',
        },
        isBoss: true,
      },
    ],
  },
];

export const MapTab: React.FC<MapTabProps> = ({ stats, locale, onSelectLevel }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 py-6 px-4">
      {/* Banner de Bienvenida Gamificado */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gv-surface-high to-gv-surface border border-gv-border p-6 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gv-primary-soft text-gv-accent text-xs font-bold mb-2 border border-gv-primary/30">
              <Zap className="w-3.5 h-3.5" />
              <span>Ruta de Aprendizaje Interactiva</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gv-text">
              {locale === 'es'
                ? 'Domina Excel Celda por Celda'
                : 'Master Excel Cell by Cell'}
            </h1>
            <p className="text-xs md:text-sm text-gv-muted mt-1 max-w-lg">
              {locale === 'es'
                ? 'Supera micro-lecciones de 3 minutos, esquiva errores mortales y vence a los jefes de hoja de cálculo.'
                : 'Complete 3-minute gamified micro-lessons, defeat spreadsheet error bosses, and boost your productivity.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gv-surface border border-gv-border rounded-xl px-4 py-3 shrink-0">
            <Trophy className="w-6 h-6 text-gv-warning" />
            <div>
              <p className="text-[10px] text-gv-muted uppercase font-bold">Nivel Actual</p>
              <p className="text-sm font-black text-gv-accent">{stats.unlockedLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Etapas del Mapa */}
      {STAGES.map((stage, stageIdx) => (
        <div key={stage.id} className="flex flex-col gap-4">
          {/* Stage Header */}
          <div className="flex items-center justify-between border-b border-gv-border pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gv-surface-higher text-gv-muted uppercase">
                  {stage.badge}
                </span>
                <h2 className="text-base md:text-lg font-bold text-gv-text">
                  {stage.title[locale]}
                </h2>
              </div>
              <p className="text-xs text-gv-muted mt-0.5">{stage.description[locale]}</p>
            </div>
          </div>

          {/* Level Nodes Path */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {stage.levels.map((lvl, lvlIdx) => {
              const isCompleted = Boolean(stats.completedLevels[lvl.ref]);
              const stars = stats.completedLevels[lvl.ref]?.stars ?? 0;
              // A level is unlocked if it's completed or is the unlockedLevel or is A1
              const isUnlocked =
                lvl.ref === 'A1' ||
                isCompleted ||
                stats.unlockedLevel === lvl.ref ||
                stageIdx === 0;

              return (
                <div
                  key={lvl.ref}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.play('tap');
                      onSelectLevel(lvl.ref, lvl.file);
                    }
                  }}
                  className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                    isUnlocked
                      ? lvl.isBoss
                        ? 'bg-gradient-to-br from-gv-boss-soft/40 to-gv-surface border-gv-boss/50 hover:border-gv-boss hover:scale-[1.02] cursor-pointer shadow-lg shadow-gv-boss/10'
                        : isCompleted
                        ? 'bg-gv-surface-high/80 border-gv-primary/40 hover:border-gv-primary hover:scale-[1.02] cursor-pointer'
                        : 'bg-gv-surface border-gv-accent/60 ring-2 ring-gv-accent/30 hover:scale-[1.02] cursor-pointer'
                      : 'bg-gv-surface/40 border-gv-border/50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          lvl.isBoss
                            ? 'bg-gv-boss/20 text-gv-boss border border-gv-boss/40'
                            : isCompleted
                            ? 'bg-gv-primary-soft text-gv-accent border border-gv-primary/30'
                            : isUnlocked
                            ? 'bg-gv-primary text-black'
                            : 'bg-gv-surface-high text-gv-muted'
                        }`}
                      >
                        {lvl.isBoss ? <ShieldAlert className="w-4 h-4" /> : lvl.ref}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gv-muted block">
                          {lvl.isBoss ? 'BOSS BATTLE' : `Lección ${lvl.ref}`}
                        </span>
                        <h4 className="text-xs md:text-sm font-bold text-gv-text line-clamp-1">
                          {lvl.title[locale]}
                        </h4>
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-gv-accent" />
                      ) : isUnlocked ? (
                        <Play className="w-4 h-4 text-gv-primary fill-gv-primary" />
                      ) : (
                        <Lock className="w-4 h-4 text-gv-faint" />
                      )}
                    </div>
                  </div>

                  {/* Stars / Footer */}
                  <div className="mt-3.5 pt-2.5 border-t border-gv-border/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            stars >= s
                              ? 'fill-gv-warning text-gv-warning'
                              : 'text-gv-border fill-gv-surface-high'
                          }`}
                        />
                      ))}
                    </div>

                    <span
                      className={`text-[11px] font-semibold ${
                        isCompleted
                          ? 'text-gv-accent'
                          : isUnlocked
                          ? 'text-gv-primary font-bold'
                          : 'text-gv-faint'
                      }`}
                    >
                      {isCompleted
                        ? locale === 'es' ? 'Completado' : 'Completed'
                        : isUnlocked
                        ? locale === 'es' ? 'Jugar' : 'Play'
                        : locale === 'es' ? 'Bloqueado' : 'Locked'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
