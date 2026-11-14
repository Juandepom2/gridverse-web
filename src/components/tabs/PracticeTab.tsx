import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Lock,
  Calculator,
  Search,
  Wrench,
  Trophy,
  Target,
  Keyboard,
  Flame,
  Star,
  Gem,
  X,
  Table2,
  ListChecks,
  RotateCcw,
} from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';
import { sound } from '../../lib/audio';
import { tr } from '../../lib/i18n';
import { CeldiMascot, CeldiMood } from '../CeldiMascot';
import {
  getPracticeCourses,
  PracticeCourseData,
  MissionData,
  StepByStepExerciseData,
  getStepByStepExercise,
} from '../../data/coursesData';
import { MissionModal } from '../practice/MissionModal';

interface PracticeTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onReward: (xp: number, gems: number, completedRef?: string) => void;
  onLoseLife?: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface SpeedQuestion {
  prompt: string;
  options: string[];
  correct: string;
}

function getStaticSpeedQuestions(locale: SupportedLocale): SpeedQuestion[] {
  const avgFn = tr(locale, {
    es: 'PROMEDIO',
    en: 'AVERAGE',
    de: 'MITTELWERT',
    fr: 'MOYENNE',
    ja: 'AVERAGE',
    pt: 'MÉDIA',
  });
  const sumFn = tr(locale, {
    es: 'SUMA',
    en: 'SUM',
    de: 'SUMME',
    fr: 'SOMME',
    ja: 'SUM',
    pt: 'SOMA',
  });
  const countFn = tr(locale, {
    es: 'CONTAR',
    en: 'COUNT',
    de: 'ANZAHL',
    fr: 'NB',
    ja: 'COUNT',
    pt: 'CONT.NÚM',
  });

  return [
    {
      prompt: tr(locale, {
        es: '¿Qué celda está en Columna B, Fila 4?',
        en: 'Which cell is in Column B, Row 4?',
        de: 'Welche Zelle liegt in Spalte B, Zeile 4?',
        fr: 'Quelle cellule se trouve en Colonne B, Ligne 4 ?',
        ja: 'B列・4行目にあるセルはどれ？',
        pt: 'Qual célula está na Coluna B, Linha 4?',
      }),
      options: ['B4', '4B', 'A4', 'B5'],
      correct: 'B4',
    },
    {
      prompt: tr(locale, {
        es: '¿Cuánto resulta la fórmula =5*4+2?',
        en: 'What is the result of =5*4+2?',
        de: 'Was ergibt die Formel =5*4+2?',
        fr: 'Quel est le résultat de =5*4+2 ?',
        ja: '数式 =5*4+2 の計算結果は？',
        pt: 'Qual é o resultado da fórmula =5*4+2?',
      }),
      options: ['22', '30', '20', '28'],
      correct: '22',
    },
    {
      prompt: tr(locale, {
        es: '¿Qué símbolo inicia obligatoriamente toda fórmula?',
        en: 'Which symbol must start every spreadsheet formula?',
        de: 'Welches Symbol leitet jede Formel ein?',
        fr: 'Quel symbole commence obligatoirement toute formule ?',
        ja: 'すべての数式の先頭に必要な記号は？',
        pt: 'Qual símbolo inicia obrigatoriamente toda fórmula?',
      }),
      options: ['=', '+', '@', '#'],
      correct: '=',
    },
    {
      prompt: tr(locale, {
        es: '¿Qué función obtiene el promedio de varias celdas?',
        en: 'Which function calculates the average of several cells?',
        de: 'Welche Funktion berechnet den Durchschnitt mehrerer Zellen?',
        fr: 'Quelle fonction calcule la moyenne de plusieurs cellules ?',
        ja: '複数セルの平均を求める関数は？',
        pt: 'Qual função calcula a média de várias células?',
      }),
      options: [avgFn, 'MEDIAN', sumFn, countFn],
      correct: avgFn,
    },
    {
      prompt: tr(locale, {
        es: '¿Qué tecla fija una referencia absoluta ($A$1)?',
        en: 'Which key locks an absolute reference ($A$1)?',
        de: 'Welche Taste fixiert einen absoluten Bezug ($A$1)?',
        fr: 'Quelle touche fige une référence absolue ($A$1) ?',
        ja: '絶対参照 ($A$1) に切り替えるキーは？',
        pt: 'Qual tecla fixa uma referência absoluta ($A$1)?',
      }),
      options: ['F4', 'F2', 'F9', 'Ctrl'],
      correct: 'F4',
    },
    {
      prompt: tr(locale, {
        es: `¿Cuál es el resultado de =${sumFn}(10, 15, 5)?`,
        en: `What is the result of =${sumFn}(10, 15, 5)?`,
        de: `Was ist das Ergebnis von =${sumFn}(10, 15, 5)?`,
        fr: `Quel est le résultat de =${sumFn}(10, 15, 5) ?`,
        ja: `=${sumFn}(10, 15, 5) の結果は？`,
        pt: `Qual é o resultado de =${sumFn}(10, 15, 5)?`,
      }),
      options: ['30', '25', '35', '10155'],
      correct: '30',
    },
    {
      prompt: tr(locale, {
        es: '¿Qué símbolo representa división en Excel?',
        en: 'Which symbol represents division in Excel?',
        de: 'Welches Symbol steht in Excel für Division?',
        fr: 'Quel symbole représente la division dans Excel ?',
        ja: 'Excelで割り算を表す記号は？',
        pt: 'Qual símbolo representa divisão no Excel?',
      }),
      options: ['/', '÷', '\\', ':'],
      correct: '/',
    },
    {
      prompt: tr(locale, {
        es: '¿Qué error aparece al dividir un número entre cero?',
        en: 'Which error appears when dividing a number by zero?',
        de: 'Welcher Fehler erscheint bei einer Division durch Null?',
        fr: 'Quelle erreur apparaît lors d’une division par zéro ?',
        ja: '0で割ったときに表示されるエラーは？',
        pt: 'Qual erro aparece ao dividir um número por zero?',
      }),
      options: ['#DIV/0!', '#REF!', '#VALUE!', '#N/A'],
      correct: '#DIV/0!',
    },
    {
      prompt: tr(locale, {
        es: '¿Qué celda está 2 filas abajo de C2?',
        en: 'Which cell is 2 rows below C2?',
        de: 'Welche Zelle liegt 2 Zeilen unter C2?',
        fr: 'Quelle cellule est 2 lignes en dessous de C2 ?',
        ja: 'C2の2行下にあるセルは？',
        pt: 'Qual célula está 2 linhas abaixo de C2?',
      }),
      options: ['C4', 'C3', 'E2', 'B2'],
      correct: 'C4',
    },
    {
      prompt: tr(locale, {
        es: '¿Cuál es el resultado de =MAX(12, 45, 8)?',
        en: 'What is the result of =MAX(12, 45, 8)?',
        de: 'Was ergibt =MAX(12, 45, 8)?',
        fr: 'Quel est le résultat de =MAX(12, 45, 8) ?',
        ja: '=MAX(12, 45, 8) の結果は？',
        pt: 'Qual é o resultado de =MAX(12, 45, 8)?',
      }),
      options: ['45', '12', '8', '65'],
      correct: '45',
    },
    {
      prompt: tr(locale, {
        es: '¿Qué atajo inserta una Autosuma rápidamente?',
        en: 'Which shortcut quickly inserts AutoSum?',
        de: 'Welche Tastenkombination fügt AutoSumme ein?',
        fr: 'Quel raccourci insère rapidement Somme automatique ?',
        ja: 'オートSUMをすばやく挿入するショートカットは？',
        pt: 'Qual atalho insere uma AutoSoma rapidamente?',
      }),
      options: ['Alt + =', 'Ctrl + S', 'Shift + A', 'Ctrl + +'],
      correct: 'Alt + =',
    },
    {
      prompt: tr(locale, {
        es: '¿Cuál es el resultado de =MIN(100, 25, 75)?',
        en: 'What is the result of =MIN(100, 25, 75)?',
        de: 'Was ergibt =MIN(100, 25, 75)?',
        fr: 'Quel est le résultat de =MIN(100, 25, 75) ?',
        ja: '=MIN(100, 25, 75) の結果は？',
        pt: 'Qual é o resultado de =MIN(100, 25, 75)?',
      }),
      options: ['25', '100', '75', '0'],
      correct: '25',
    },
    {
      prompt: tr(locale, {
        es: '¿Qué celda está a la derecha de A1?',
        en: 'Which cell is immediately to the right of A1?',
        de: 'Welche Zelle liegt rechts neben A1?',
        fr: 'Quelle cellule est à droite de A1 ?',
        ja: 'A1の右隣にあるセルは？',
        pt: 'Qual célula está à direita de A1?',
      }),
      options: ['B1', 'A2', 'B2', 'AA1'],
      correct: 'B1',
    },
    {
      prompt: tr(locale, {
        es: '¿Qué atajo activa o quita los Filtros?',
        en: 'Which shortcut toggles Filters on or off?',
        de: 'Welche Tastenkombination aktiviert Filter?',
        fr: 'Quel raccourci active ou désactive les Filtres ?',
        ja: 'フィルターをオン/オフするショートカットは？',
        pt: 'Qual atalho ativa ou remove os Filtros?',
      }),
      options: ['Ctrl + Shift + L', 'Ctrl + F', 'Alt + F', 'Ctrl + T'],
      correct: 'Ctrl + Shift + L',
    },
    {
      prompt: tr(locale, {
        es: '¿Cuánto resulta =2^3 (potencia de 2 al cubo)?',
        en: 'What is the result of =2^3 (2 cubed)?',
        de: 'Was ergibt =2^3 (2 hoch 3)?',
        fr: 'Quel est le résultat de =2^3 (2 au cube) ?',
        ja: '=2^3（2の3乗）の結果は？',
        pt: 'Quanto resulta =2^3 (2 elevado ao cubo)?',
      }),
      options: ['8', '6', '9', '5'],
      correct: '8',
    },
    {
      prompt: tr(locale, {
        es: '¿Cuál es el resultado de =10-2*3?',
        en: 'What is the result of =10-2*3?',
        de: 'Was ergibt =10-2*3?',
        fr: 'Quel est le résultat de =10-2*3 ?',
        ja: '=10-2*3 の計算結果は？',
        pt: 'Qual é o resultado de =10-2*3?',
      }),
      options: ['4', '24', '16', '6'],
      correct: '4',
    },
  ];
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Exact port of Flutter's `_generateProceduralQuestion` from `time_attack_screen.dart`
 */
function generateProceduralQuestion(locale: SupportedLocale): SpeedQuestion {
  const sumFn = tr(locale, {
    es: 'SUMA',
    en: 'SUM',
    de: 'SUMME',
    fr: 'SOMME',
    ja: 'SUM',
    pt: 'SOMA',
  });
  const type = Math.floor(Math.random() * 5);
  if (type === 0) {
    const a = Math.floor(Math.random() * 7) + 2;
    const b = Math.floor(Math.random() * 5) + 2;
    const c = Math.floor(Math.random() * 8) + 1;
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const result = a + b * c;
      const set = new Set<string>([
        String(result),
        String((a + b) * c),
        String(a * b + c),
        String(result + 3),
      ]);
      let step = 2;
      while (set.size < 4) {
        set.add(String(result + step));
        step += 3;
      }
      return {
        prompt: tr(locale, {
          es: `¿Cuánto resulta la fórmula =${a}+${b}*${c}?`,
          en: `What is the result of =${a}+${b}*${c}?`,
          de: `Was ergibt die Formel =${a}+${b}*${c}?`,
          fr: `Quel est le résultat de =${a}+${b}*${c} ?`,
          ja: `数式 =${a}+${b}*${c} の結果は？`,
          pt: `Quanto resulta a fórmula =${a}+${b}*${c}?`,
        }),
        options: shuffleArray(Array.from(set).slice(0, 4)),
        correct: String(result),
      };
    } else {
      const result = a * b - c;
      const set = new Set<string>([
        String(result),
        String(a * (b - c)),
        String(result + 4),
        String(result - 2),
      ]);
      let step = 3;
      while (set.size < 4) {
        set.add(String(result + step));
        step += 2;
      }
      return {
        prompt: tr(locale, {
          es: `¿Cuánto resulta la fórmula =${a}*${b}-${c}?`,
          en: `What is the result of =${a}*${b}-${c}?`,
          de: `Was ergibt die Formel =${a}*${b}-${c}?`,
          fr: `Quel est le résultat de =${a}*${b}-${c} ?`,
          ja: `数式 =${a}*${b}-${c} の結果は？`,
          pt: `Quanto resulta a fórmula =${a}*${b}-${c}?`,
        }),
        options: shuffleArray(Array.from(set).slice(0, 4)),
        correct: String(result),
      };
    }
  } else if (type === 1) {
    const n1 = (Math.floor(Math.random() * 6) + 1) * 10;
    const n2 = (Math.floor(Math.random() * 5) + 1) * 5;
    const n3 = (Math.floor(Math.random() * 4) + 1) * 10;
    const sum = n1 + n2 + n3;
    const set = new Set<string>([
      String(sum),
      String(sum - 10),
      String(sum + 15),
      `${n1}${n2}`,
    ]);
    return {
      prompt: tr(locale, {
        es: `¿Cuál es el resultado de =${sumFn}(${n1}, ${n2}, ${n3})?`,
        en: `What is the result of =${sumFn}(${n1}, ${n2}, ${n3})?`,
        de: `Was ergibt =${sumFn}(${n1}, ${n2}, ${n3})?`,
        fr: `Quel est le résultat de =${sumFn}(${n1}, ${n2}, ${n3}) ?`,
        ja: `=${sumFn}(${n1}, ${n2}, ${n3}) の結果は？`,
        pt: `Qual é o resultado de =${sumFn}(${n1}, ${n2}, ${n3})?`,
      }),
      options: shuffleArray(Array.from(set).slice(0, 4)),
      correct: String(sum),
    };
  } else if (type === 2) {
    const isMax = Math.random() > 0.5;
    const nA = (Math.floor(Math.random() * 8) + 1) * 12;
    const nB = (Math.floor(Math.random() * 8) + 1) * 15;
    const nC = (Math.floor(Math.random() * 8) + 1) * 9;
    const nums = [nA, nB, nC];
    const target = isMax ? Math.max(...nums) : Math.min(...nums);
    const set = new Set<string>([
      String(target),
      String(nA),
      String(nB),
      String(nC),
      String(target + 10),
      String(target + 25),
    ]);
    return {
      prompt: tr(locale, {
        es: `¿Cuál es el resultado de =${isMax ? 'MAX' : 'MIN'}(${nA}, ${nB}, ${nC})?`,
        en: `What is the result of =${isMax ? 'MAX' : 'MIN'}(${nA}, ${nB}, ${nC})?`,
        de: `Was ergibt =${isMax ? 'MAX' : 'MIN'}(${nA}, ${nB}, ${nC})?`,
        fr: `Quel est le résultat de =${isMax ? 'MAX' : 'MIN'}(${nA}, ${nB}, ${nC}) ?`,
        ja: `=${isMax ? 'MAX' : 'MIN'}(${nA}, ${nB}, ${nC}) の結果は？`,
        pt: `Qual é o resultado de =${isMax ? 'MAX' : 'MIN'}(${nA}, ${nB}, ${nC})?`,
      }),
      options: shuffleArray(Array.from(set).slice(0, 4)),
      correct: String(target),
    };
  } else if (type === 3) {
    const cols = ['A', 'B', 'C', 'D', 'E'];
    const colIdx = Math.floor(Math.random() * 3);
    const row = Math.floor(Math.random() * 6) + 1;
    const offset = Math.floor(Math.random() * 2) + 1;
    const target = `${cols[colIdx]}${row + offset}`;
    const opts = shuffleArray([
      target,
      `${cols[colIdx]}${row + offset + 1}`,
      `${cols[colIdx + 1]}${row}`,
      `${cols[colIdx]}${row > 1 ? row - 1 : row + 3}`,
    ]);
    return {
      prompt: tr(locale, {
        es: `¿Qué celda está ${offset} ${offset === 1 ? 'fila' : 'filas'} abajo de ${cols[colIdx]}${row}?`,
        en: `Which cell is ${offset} ${offset === 1 ? 'row' : 'rows'} below ${cols[colIdx]}${row}?`,
        de: `Welche Zelle liegt ${offset} ${offset === 1 ? 'Zeile' : 'Zeilen'} unter ${cols[colIdx]}${row}?`,
        fr: `Quelle cellule est ${offset} ${offset === 1 ? 'ligne' : 'lignes'} sous ${cols[colIdx]}${row} ?`,
        ja: `${cols[colIdx]}${row} の ${offset}行下にあるセルは？`,
        pt: `Qual célula está ${offset} ${offset === 1 ? 'linha' : 'linhas'} abaixo de ${cols[colIdx]}${row}?`,
      }),
      options: opts,
      correct: target,
    };
  } else {
    const base = (Math.floor(Math.random() * 6) + 1) * 100;
    const pct = (Math.floor(Math.random() * 4) + 1) * 10;
    const res = Math.round((base * pct) / 100);
    const opts = shuffleArray([
      String(res),
      String(res + 10),
      String(Math.floor(res / 2) + 5),
      String(base - res),
    ]);
    return {
      prompt: tr(locale, {
        es: `¿Cuánto es el ${pct}% de ${base}?`,
        en: `What is ${pct}% of ${base}?`,
        de: `Was sind ${pct}% von ${base}?`,
        fr: `Combien font ${pct}% de ${base} ?`,
        ja: `${base} の ${pct}% はいくら？`,
        pt: `Quanto é ${pct}% de ${base}?`,
      }),
      options: opts,
      correct: String(res),
    };
  }
}

function buildTimeAttackDeck(locale: SupportedLocale): SpeedQuestion[] {
  const staticPool = shuffleArray(getStaticSpeedQuestions(locale)).map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
  const procedural = Array.from({ length: 14 }, () => generateProceduralQuestion(locale));
  return shuffleArray([...staticPool, ...procedural]);
}

function getShortcutDrillQuestions(locale: SupportedLocale) {
  return [
    {
      q: tr(locale, {
        es: '¿Qué atajo convierte una celda relativa (A1) en absoluta ($A$1)?',
        en: 'Which shortcut converts a relative cell (A1) into an absolute reference ($A$1)?',
        de: 'Welche Taste wandelt einen relativen Bezug (A1) in einen absoluten ($A$1) um?',
        fr: 'Quel raccourci convertit une référence relative (A1) en absolue ($A$1) ?',
        ja: '相対参照 (A1) を絶対参照 ($A$1) に切り替えるショートカットは？',
        pt: 'Qual atalho converte uma célula relativa (A1) em absoluta ($A$1)?',
      }),
      win: 'F4',
      mac: 'Cmd + T / F4',
      opts: ['F4', 'F2', 'Ctrl + A', 'Alt + F4'],
      ans: 'F4',
    },
    {
      q: tr(locale, {
        es: '¿Qué combinación inserta automáticamente la función Autosuma?',
        en: 'Which shortcut automatically inserts the AutoSum function?',
        de: 'Welche Tastenkombination fügt automatisch AutoSumme ein?',
        fr: 'Quelle combinaison insère automatiquement la fonction Somme automatique ?',
        ja: 'オートSUM関数を自動挿入するショートカットは？',
        pt: 'Qual combinação insere automaticamente a função AutoSoma?',
      }),
      win: 'Alt + =',
      mac: 'Cmd + Shift + T',
      opts: ['Alt + =', 'Ctrl + S', 'Ctrl + +', 'Shift + ='],
      ans: 'Alt + =',
    },
    {
      q: tr(locale, {
        es: '¿Qué atajo activa o desactiva los Filtros de una tabla?',
        en: 'Which shortcut turns table Filters on or off?',
        de: 'Welche Tastenkombination schaltet Tabellenfilter ein oder aus?',
        fr: 'Quel raccourci active ou désactive les Filtres d’un tableau ?',
        ja: 'テーブルのフィルターをオン/オフするショートカットは？',
        pt: 'Qual atalho ativa ou desativa os Filtros de uma tabela?',
      }),
      win: 'Ctrl + Shift + L',
      mac: 'Cmd + Shift + F',
      opts: ['Ctrl + Shift + L', 'Ctrl + F', 'Alt + L', 'Ctrl + T'],
      ans: 'Ctrl + Shift + L',
    },
    {
      q: tr(locale, {
        es: '¿Qué tecla permite editar directamente el contenido de la celda activa?',
        en: 'Which key lets you directly edit the active cell content?',
        de: 'Welche Taste ermöglicht das direkte Bearbeiten der aktiven Zelle?',
        fr: 'Quelle touche permet de modifier directement le contenu de la cellule active ?',
        ja: 'アクティブセルの内容を直接編集できるキーは？',
        pt: 'Qual tecla permite editar diretamente o conteúdo da célula ativa?',
      }),
      win: 'F2',
      mac: 'F2 / Ctrl + U',
      opts: ['F2', 'F5', 'Esc', 'Tab'],
      ans: 'F2',
    },
    {
      q: tr(locale, {
        es: '¿Qué atajo selecciona toda la fila actual en la hoja de cálculo?',
        en: 'Which shortcut selects the entire current row in the spreadsheet?',
        de: 'Welche Kombination markiert die gesamte aktuelle Zeile?',
        fr: 'Quel raccourci sélectionne toute la ligne actuelle ?',
        ja: '現在の行全体を選択するショートカットは？',
        pt: 'Qual atalho seleciona toda a linha atual na planilha?',
      }),
      win: 'Shift + Space',
      mac: 'Shift + Space',
      opts: ['Shift + Space', 'Ctrl + Space', 'Alt + Space', 'Ctrl + R'],
      ans: 'Shift + Space',
    },
    {
      q: tr(locale, {
        es: '¿Qué atajo selecciona toda la columna actual en la hoja de cálculo?',
        en: 'Which shortcut selects the entire current column in the spreadsheet?',
        de: 'Welche Kombination markiert die gesamte aktuelle Spalte?',
        fr: 'Quel raccourci sélectionne toute la colonne actuelle ?',
        ja: '現在の列全体を選択するショートカットは？',
        pt: 'Qual atalho seleciona toda a coluna atual na planilha?',
      }),
      win: 'Ctrl + Space',
      mac: 'Ctrl + Space',
      opts: ['Ctrl + Space', 'Shift + Space', 'Ctrl + C', 'Alt + C'],
      ans: 'Ctrl + Space',
    },
    {
      q: tr(locale, {
        es: '¿Qué combinación convierte un rango de datos en una Tabla Oficial de Excel?',
        en: 'Which shortcut converts a data range into an Official Excel Table?',
        de: 'Welche Kombination wandelt einen Datenbereich in eine Excel-Tabelle um?',
        fr: 'Quelle combinaison convertit une plage en Tableau Excel officiel ?',
        ja: 'データ範囲をExcelのテーブルに変換するショートカットは？',
        pt: 'Qual combinação converte um intervalo em uma Tabela Oficial do Excel?',
      }),
      win: 'Ctrl + T',
      mac: 'Cmd + T',
      opts: ['Ctrl + T', 'Ctrl + B', 'Alt + T', 'Shift + T'],
      ans: 'Ctrl + T',
    },
    {
      q: tr(locale, {
        es: '¿Qué combinación deshace la última acción realizada?',
        en: 'Which shortcut undoes the last action?',
        de: 'Welche Kombination macht die letzte Aktion rückgängig?',
        fr: 'Quelle combinaison annule la dernière action effectuée ?',
        ja: '直前の操作を元に戻す（Undo）ショートカットは？',
        pt: 'Qual combinação desfaz a última ação realizada?',
      }),
      win: 'Ctrl + Z',
      mac: 'Cmd + Z',
      opts: ['Ctrl + Z', 'Ctrl + Y', 'Ctrl + X', 'Alt + Z'],
      ans: 'Ctrl + Z',
    },
  ];
}

/**
 * Port of `CourseCeldiMascot` from `course_celdi_mascot.dart`
 */
const CourseCeldiMascot: React.FC<{
  courseOrder: number;
  color: string;
  isLocked: boolean;
  isCompleted: boolean;
  locale: SupportedLocale;
}> = ({ courseOrder, color, isLocked, isCompleted, locale }) => {
  const [showBubble, setShowBubble] = useState(false);

  const mood: CeldiMood = isCompleted
    ? 'celebrating'
    : isLocked
    ? 'sad'
    : courseOrder === 1
    ? 'happy'
    : courseOrder === 2
    ? 'thinking'
    : 'onFire';

  const getPhrase = () => {
    if (isLocked)
      return tr(locale, {
        es: '¡Completa el curso anterior o hazte PRO para desbloquearme!',
        en: 'Complete the previous course or go PRO to unlock me!',
        de: 'Schließe den vorherigen Kurs ab oder werde PRO!',
        fr: 'Termine le cours précédent ou passe PRO pour me débloquer !',
        ja: '前のコースをクリアするか、PROでアンロックしよう！',
        pt: 'Conclua o curso anterior ou seja PRO para me desbloquear!',
      });
    if (isCompleted)
      return tr(locale, {
        es: '¡Curso dominado al 100%! 🏆',
        en: 'Course 100% mastered! 🏆',
        de: 'Kurs zu 100 % gemeistert! 🏆',
        fr: 'Cours maîtrisé à 100 % ! 🏆',
        ja: 'コース100%マスター！ 🏆',
        pt: 'Curso dominado 100%! 🏆',
      });
    if (courseOrder === 1)
      return tr(locale, {
        es: '¡Vamos a cuadrar las cuentas del negocio!',
        en: 'Let’s balance the business books!',
        de: 'Bringen wir die Geschäftszahlen in Ordnung!',
        fr: 'Équilibrons les comptes de l’entreprise !',
        ja: 'ビジネスの帳簿を自動化しよう！',
        pt: 'Vamos fechar as contas do negócio!',
      });
    if (courseOrder === 2)
      return tr(locale, {
        es: '¡Activando modo detective de fórmulas!',
        en: 'Formula detective mode activated!',
        de: 'Formel-Detektivmodus aktiviert!',
        fr: 'Mode détective de formules activé !',
        ja: '数式探偵モード起動！',
        pt: 'Ativando modo detetive de fórmulas!',
      });
    return tr(locale, {
      es: '¡Hora de reparar esas bases de datos!',
      en: 'Time to repair those databases!',
      de: 'Zeit, diese Datenbanken zu reparieren!',
      fr: 'Il est temps de réparer ces bases de données !',
      ja: 'データベースのエラーを修復しよう！',
      pt: 'Hora de reparar essas bases de dados!',
    });
  };

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer select-none"
      onClick={(e) => {
        e.stopPropagation();
        sound.play('tap');
        setShowBubble((prev) => !prev);
      }}
    >
      {showBubble && (
        <div
          className="absolute -top-11 right-0 z-20 whitespace-nowrap px-2.5 py-1 rounded-xl bg-gv-surface-high border text-[10px] font-bold text-gv-text shadow-xl animate-fade-in"
          style={{ borderColor: color }}
        >
          {getPhrase()}
        </div>
      )}

      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Glow */}
        <div
          className="absolute inset-1 rounded-full blur-md opacity-25"
          style={{ backgroundColor: isLocked ? '#64748B' : color }}
        />

        <div className={isLocked ? 'opacity-65 grayscale-[35%]' : ''}>
          <CeldiMascot mood={mood} size={52} />
        </div>

        {/* Floating Themed Accessory Badge */}
        <div
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gv-surface-high border-2 flex items-center justify-center shadow-md"
          style={{ borderColor: isLocked ? '#475569' : color }}
        >
          {isLocked ? (
            <span className="text-[8px] font-mono font-black text-gv-muted">Zzz</span>
          ) : isCompleted ? (
            <Trophy className="w-3.5 h-3.5 text-gv-warning" />
          ) : courseOrder === 1 ? (
            <Calculator className="w-3.5 h-3.5" style={{ color }} />
          ) : courseOrder === 2 ? (
            <Search className="w-3.5 h-3.5" style={{ color }} />
          ) : (
            <Wrench className="w-3.5 h-3.5" style={{ color }} />
          )}
        </div>
      </div>
    </div>
  );
};

export const PracticeTab: React.FC<PracticeTabProps> = ({
  stats,
  locale,
  onReward,
  onLoseLife,
  onNavigateTab,
}) => {
  // Preview modal before launching a mission (MissionDetailSheet)
  const [previewMission, setPreviewMission] = useState<MissionData | null>(null);
  // Active multi-step workbook exercise
  const [activeExercise, setActiveExercise] = useState<StepByStepExerciseData | null>(null);

  // Daily Challenge completion state for today
  const todayKey = useMemo(() => {
    const now = new Date();
    return `daily_challenge_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
  }, []);

  const [dailyCompleted, setDailyCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(todayKey) === 'true';
    } catch {
      return false;
    }
  });
  const [remainingTime, setRemainingTime] = useState({ hours: 7, minutes: 25 });

  // Time Attack 60s state
  const [isTimeAttackOpen, setIsTimeAttackOpen] = useState(false);
  const [taQuestions, setTaQuestions] = useState<SpeedQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selectedTaAnswer, setSelectedTaAnswer] = useState<string | null>(null);
  const [lastTaCorrect, setLastTaCorrect] = useState<boolean | null>(null);
  const [isTaFinished, setIsTaFinished] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [personalRecord, setPersonalRecord] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('time_attack_record') || '0');
    } catch {
      return 0;
    }
  });

  // Keyboard Shortcuts Drill state
  const [isShortcutsDrillOpen, setIsShortcutsDrillOpen] = useState(false);
  const [shortcutIndex, setShortcutIndex] = useState(0);
  const [shortcutScore, setShortcutScore] = useState(0);
  const [shortcutSelected, setShortcutSelected] = useState<string | null>(null);
  const [shortcutDone, setShortcutDone] = useState(false);

  const practiceCourses = useMemo(() => getPracticeCourses(locale), [locale]);
  const shortcutDrillQuestions = useMemo(() => getShortcutDrillQuestions(locale), [locale]);

  // Check if a mission is completed (either in stats.completedLevels or localStorage)
  const isMissionDone = (ref: string): boolean => {
    const upper = ref.toUpperCase();
    for (const [k, v] of Object.entries(stats.completedLevels || {})) {
      if (k.toUpperCase() === upper && v && v.stars > 0) return true;
    }
    try {
      const local = JSON.parse(localStorage.getItem('gridverse_completed_missions') || '{}');
      return Boolean(local[upper]);
    } catch {
      return false;
    }
  };

  const isCourseDone = (course: PracticeCourseData): boolean => {
    return course.missions.every((m) => isMissionDone(m.ref));
  };

  const isCourseUnlocked = (course: PracticeCourseData): boolean => {
    if (stats.isPro) return true;
    if (!course.prerequisiteCourseId) return true;
    const prereq = practiceCourses.find((c) => c.id === course.prerequisiteCourseId);
    if (!prereq) return true;
    return isCourseDone(prereq);
  };

  const isMissionUnlocked = (mission: MissionData, course: PracticeCourseData): boolean => {
    if (!isCourseUnlocked(course)) return false;
    if (!mission.prerequisiteRef) return true;
    return isMissionDone(mission.prerequisiteRef);
  };

  // Countdown timer for daily challenge
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      setRemainingTime({ hours, minutes });
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Time Attack 60s Timer
  useEffect(() => {
    if (!isTimeAttackOpen || isTaFinished) return;
    if (timeLeft <= 0) {
      setIsTaFinished(true);
      sound.play('level_win');
      confetti({ particleCount: 70, spread: 60 });
      const prevBest = Number(localStorage.getItem('time_attack_record') || '0');
      if (score > prevBest) {
        setIsNewRecord(true);
        setPersonalRecord(score);
        localStorage.setItem('time_attack_record', String(score));
      }
      if (score > 0) {
        onReward(score * 3, Math.max(5, Math.floor(score * 1.5)));
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isTimeAttackOpen, timeLeft, isTaFinished, score, onReward]);

  const handleOpenTimeAttack = () => {
    sound.play('tap');
    setTaQuestions(buildTimeAttackDeck(locale));
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setQIndex(0);
    setSelectedTaAnswer(null);
    setLastTaCorrect(null);
    setIsTaFinished(false);
    setIsNewRecord(false);
    setIsTimeAttackOpen(true);
  };

  const handleAnswerTimeAttack = (option: string) => {
    if (selectedTaAnswer !== null || isTaFinished) return;
    const currentQ = taQuestions[qIndex % taQuestions.length];
    const correct = option === currentQ.correct;
    setSelectedTaAnswer(option);
    setLastTaCorrect(correct);

    if (correct) {
      sound.play('correct');
      const nextCombo = combo + 1;
      const multiplier = nextCombo >= 8 ? 4 : nextCombo >= 5 ? 3 : nextCombo >= 3 ? 2 : 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);
      setScore((s) => s + 10 * multiplier);
    } else {
      sound.play('wrong');
      setCombo(0);
    }

    setTimeout(() => {
      setSelectedTaAnswer(null);
      setLastTaCorrect(null);
      setQIndex((i) => i + 1);
    }, 260);
  };

  const handleCompleteExercise = (ref: string, xp: number, gems: number) => {
    try {
      const saved = JSON.parse(localStorage.getItem('gridverse_completed_missions') || '{}');
      saved[ref.toUpperCase()] = true;
      localStorage.setItem('gridverse_completed_missions', JSON.stringify(saved));
      if (ref.toUpperCase() === 'DAILY') {
        localStorage.setItem(todayKey, 'true');
        setDailyCompleted(true);
      }
    } catch {
      // ignore storage errors
    }
    onReward(xp, gems, ref.toUpperCase());
  };

  const totalMissionsCount = practiceCourses.reduce((acc, c) => acc + c.missions.length, 0);
  const completedMissionsCount = practiceCourses.reduce(
    (acc, c) => acc + c.missions.filter((m) => isMissionDone(m.ref)).length,
    0
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-7 py-6 px-4">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gv-text tracking-tight">
            {tr(locale, {
              es: 'Centro de Práctica',
              en: 'Practice Center',
              de: 'Übungszentrum',
              fr: "Centre d'Entraînement",
              ja: '練習センター',
              pt: 'Centro de Prática',
            })}
          </h1>
          <p className="text-xs text-gv-muted mt-0.5">
            {tr(locale, {
              es: 'Resuelve libros contables multipaso de negocios reales y entrena tu velocidad.',
              en: 'Solve multi-sheet business workbooks and train your formula speed.',
              de: 'Löse mehrseitige Arbeitsmappen aus der Praxis und trainiere deine Geschwindigkeit.',
              fr: 'Résous des classeurs multi-feuilles réels et entraîne ta vitesse de calcul.',
              ja: '実務の複数シートブックを解き、数式スピードを鍛えよう。',
              pt: 'Resolva pastas de trabalho reais de múltiplas abas e treine sua velocidade.',
            })}
          </p>
        </div>
      </div>

      {/* 1. Daily Challenge Banner (matching mobile _DailyChallengeCard) */}
      <div
        onClick={() => {
          sound.play('tap');
          setActiveExercise(getStepByStepExercise('DAILY', locale));
        }}
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-7 shadow-2xl cursor-pointer transition-all hover:scale-[1.005] ${
          dailyCompleted
            ? 'bg-gradient-to-br from-gv-surface-high via-gv-surface to-gv-primary/15 border-gv-primary/50'
            : 'bg-gradient-to-br from-gv-surface-high via-gv-surface to-gv-boss/15 border-gv-boss/50'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                  dailyCompleted
                    ? 'bg-gv-primary/20 text-gv-accent border-gv-primary/40'
                    : 'bg-gv-boss/20 text-gv-boss border-gv-boss/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {dailyCompleted
                    ? tr(locale, {
                        es: '¡COMPLETADO HOY!',
                        en: 'COMPLETED TODAY!',
                        de: 'HEUTE ERLEDIGT!',
                        fr: 'TERMINÉ AUJOURD’HUI !',
                        ja: '本日クリア済み！',
                        pt: 'CONCLUÍDO HOJE!',
                      })
                    : tr(locale, {
                        es: 'DESAFÍO DIARIO · 3 HOJAS',
                        en: 'DAILY CHALLENGE · 3 SHEETS',
                        de: 'TAGESCHALLENGE · 3 BLÄTTER',
                        fr: 'DÉFI QUOTIDIEN · 3 FEUILLES',
                        ja: 'デイリーチャレンジ · 3シート',
                        pt: 'DESAFIO DIÁRIO · 3 ABAS',
                      })}
                </span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gv-bg/80 border border-gv-border font-mono text-[11px] font-bold text-gv-muted">
                <Clock className="w-3 h-3 text-gv-warning" />
                <span>
                  {remainingTime.hours}h {remainingTime.minutes}m
                </span>
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gv-text">
              {tr(locale, {
                es: 'La Hoja Rota: Facturación y BUSCARV',
                en: 'The Broken Sheet: Billing & VLOOKUP',
                de: 'Das kaputte Blatt: Abrechnung & SVERWEIS',
                fr: 'La Feuille Cassée : Facturation & RECHERCHEV',
                ja: '壊れたシート：請求管理とVLOOKUP',
                pt: 'A Planilha Quebrada: Faturamento e PROCV',
              })}
            </h2>
            <p className="text-xs md:text-sm text-gv-muted mt-1 max-w-lg leading-relaxed">
              {tr(locale, {
                es: 'Audita y repara 10 pasos en 3 hojas de cálculo empresariales con errores #N/A, SI.ERROR y referencias absolutas $B$5.',
                en: 'Audit and repair 10 steps across 3 business sheets with #N/A errors, IFERROR, and $B$5 references.',
                de: 'Prüfe und repariere 10 Schritte in 3 Blättern mit #NV-Fehlern, WENNFEHLER und $B$5-Bezügen.',
                fr: 'Audite et répare 10 étapes sur 3 feuilles avec erreurs #N/A, SIERREUR et références $B$5.',
                ja: '3つのシートにわたる10ステップで#N/Aエラー、IFERROR、絶対参照$B$5を監査・修復します。',
                pt: 'Audite e repare 10 passos em 3 planilhas empresariais com erros #N/D, SEERRO e referências $B$5.',
              })}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-gv-warning/15 border border-gv-warning/30 font-mono text-xs font-extrabold text-gv-warning">
                ⚡ +60 XP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gv-bytes/15 border border-gv-bytes/30 font-mono text-xs font-extrabold text-gv-bytes">
                💎 +50{' '}
                {tr(locale, {
                  es: 'Gemas',
                  en: 'Gems',
                  de: 'Juwelen',
                  fr: 'Gemmes',
                  ja: 'ジェム',
                  pt: 'Gemas',
                })}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gv-surface border border-gv-border font-mono text-xs font-bold text-gv-muted">
                📊{' '}
                {tr(locale, {
                  es: '10 pasos · 3 hojas',
                  en: '10 steps · 3 sheets',
                  de: '10 Schritte · 3 Blätter',
                  fr: '10 étapes · 3 feuilles',
                  ja: '10ステップ · 3シート',
                  pt: '10 passos · 3 abas',
                })}
              </span>
            </div>

            <div className="mt-5 flex justify-center sm:justify-start">
              <button
                type="button"
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-2 ${
                  dailyCompleted
                    ? 'bg-gv-surface-higher border border-gv-primary text-gv-accent hover:bg-gv-primary hover:text-black'
                    : 'bg-gv-primary hover:bg-gv-accent text-black shadow-gv-primary/25'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {dailyCompleted
                    ? tr(locale, {
                        es: 'Practicar de nuevo',
                        en: 'Practice Again',
                        de: 'Erneut üben',
                        fr: 'Pratiquer à nouveau',
                        ja: 'もう一度練習する',
                        pt: 'Praticar novamente',
                      })
                    : tr(locale, {
                        es: 'Resolver Desafío Diario',
                        en: 'Solve Daily Challenge',
                        de: 'Tageschallenge lösen',
                        fr: 'Résoudre le Défi Quotidien',
                        ja: 'デイリーチャレンジに挑戦',
                        pt: 'Resolver Desafio Diário',
                      })}
                </span>
              </button>
            </div>
          </div>

          <div className="shrink-0">
            <CeldiMascot mood={dailyCompleted ? 'celebrating' : 'onFire'} size={108} />
          </div>
        </div>
      </div>

      {/* 2. Specialization Path (Courses with CourseCeldiMascot & Progressive Unlocking) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-lg md:text-xl font-black text-gv-text">
              {tr(locale, {
                es: 'Ruta de Especialización Práctica',
                en: 'Practical Specialization Path',
                de: 'Praxis-Spezialisierungspfad',
                fr: 'Parcours de Spécialisation Pratique',
                ja: '実践スペシャリストコース',
                pt: 'Trilha de Especialização Prática',
              })}
            </h2>
            <p className="text-xs text-gv-muted mt-0.5">
              {tr(locale, {
                es: 'Libros de trabajo reales de múltiples hojas con clientes y casos de negocio.',
                en: 'Real multi-sheet workbooks with clients and hands-on business cases.',
                de: 'Mehrseitige Arbeitsmappen mit Kunden und realen Geschäftsfällen.',
                fr: 'Classeurs multi-feuilles réels avec clients et cas pratiques.',
                ja: 'クライアントの実際のビジネスケースを複数シートで解決。',
                pt: 'Pastas de trabalho reais de múltiplas abas com clientes e casos de negócios.',
              })}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-gv-primary/15 border border-gv-primary/35 font-mono text-xs font-extrabold text-gv-accent">
            {completedMissionsCount}/{totalMissionsCount}{' '}
            {tr(locale, {
              es: 'casos resueltos',
              en: 'cases solved',
              de: 'Fälle gelöst',
              fr: 'cas résolus',
              ja: 'ケース解決済み',
              pt: 'casos resolvidos',
            })}
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {practiceCourses.map((course) => {
            const courseUnlocked = isCourseUnlocked(course);
            const courseDone = isCourseDone(course);
            const doneCount = course.missions.filter((m) => isMissionDone(m.ref)).length;
            const totalCount = course.missions.length;
            const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
            const isFreeCourse = course.order === 1;

            return (
              <div
                key={course.id}
                className="bg-gv-surface border-[1.5px] rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-4 transition-all"
                style={{
                  borderColor: !courseUnlocked
                    ? '#233229'
                    : courseDone
                    ? '#21C26B'
                    : `${course.color}66`,
                }}
              >
                {/* Course Header with CourseCeldiMascot */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black uppercase tracking-wider"
                        style={{
                          backgroundColor: `${course.color}22`,
                          color: courseUnlocked ? course.color : '#94A3B8',
                        }}
                      >
                        {tr(locale, {
                          es: 'CURSO',
                          en: 'COURSE',
                          de: 'KURS',
                          fr: 'COURS',
                          ja: 'コース',
                          pt: 'CURSO',
                        })}{' '}
                        {course.order}
                      </span>

                      {isFreeCourse ? (
                        <span className="px-2 py-0.5 rounded-md bg-gv-primary/20 border border-gv-primary/40 font-mono text-[10px] font-black text-gv-accent">
                          {tr(locale, {
                            es: 'GRATIS',
                            en: 'FREE',
                            de: 'GRATIS',
                            fr: 'GRATUIT',
                            ja: '無料',
                            pt: 'GRÁTIS',
                          })}
                        </span>
                      ) : !stats.isPro ? (
                        <span className="px-2 py-0.5 rounded-md bg-gv-warning/20 border border-gv-warning/40 font-mono text-[10px] font-black text-gv-warning flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> PRO
                        </span>
                      ) : null}

                      {courseDone && (
                        <span className="px-2 py-0.5 rounded-md bg-gv-primary text-black font-mono text-[10px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />{' '}
                          {tr(locale, {
                            es: 'COMPLETADO',
                            en: 'COMPLETED',
                            de: 'ABGESCHLOSSEN',
                            fr: 'TERMINÉ',
                            ja: '完了',
                            pt: 'CONCLUÍDO',
                          })}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base md:text-lg font-extrabold text-gv-text">
                      {course.title.includes('·')
                        ? course.title.split('·')[1].trim()
                        : course.title}
                    </h3>
                    <p className="text-xs text-gv-muted mt-0.5">{course.subtitle}</p>
                  </div>

                  <CourseCeldiMascot
                    courseOrder={course.order}
                    color={course.color}
                    isLocked={!courseUnlocked}
                    isCompleted={courseDone}
                    locale={locale}
                  />
                </div>

                {/* Course Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gv-surface-high overflow-hidden border border-gv-border/60">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: courseUnlocked ? course.color : '#475569',
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-xs font-extrabold"
                    style={{ color: courseUnlocked ? course.color : '#64748B' }}
                  >
                    {doneCount}/{totalCount} ({progressPct}%)
                  </span>
                </div>

                {/* Locked Course Notice */}
                {!courseUnlocked && course.prerequisiteCourseTitle && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-gv-warning/10 border border-gv-warning/30 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-gv-warning font-semibold">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>
                        {tr(locale, {
                          es: `Completa ${course.prerequisiteCourseTitle} o desbloquea Gridverse PRO para acceder inmediatamente.`,
                          en: `Complete ${course.prerequisiteCourseTitle} or unlock Gridverse PRO for instant access.`,
                          de: `Schließe ${course.prerequisiteCourseTitle} ab oder schalte Gridverse PRO frei.`,
                          fr: `Complète ${course.prerequisiteCourseTitle} ou débloque Gridverse PRO pour un accès immédiat.`,
                          ja: `${course.prerequisiteCourseTitle}をクリアするか、Gridverse PROで今すぐアンロック。`,
                          pt: `Conclua ${course.prerequisiteCourseTitle} ou desbloqueie o Gridverse PRO para acesso imediato.`,
                        })}
                      </span>
                    </div>
                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab('shop')}
                        className="px-3 py-1 rounded-lg bg-gv-warning text-black font-black text-[11px] cursor-pointer"
                      >
                        {tr(locale, {
                          es: 'Ver PRO',
                          en: 'View PRO',
                          de: 'PRO ansehen',
                          fr: 'Voir PRO',
                          ja: 'PROを見る',
                          pt: 'Ver PRO',
                        })}
                      </button>
                    )}
                  </div>
                )}

                {/* Course Missions List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {course.missions.map((mission) => {
                    const isDone = isMissionDone(mission.ref);
                    const unlocked = isMissionUnlocked(mission, course);
                    const exData = getStepByStepExercise(mission.ref, locale);

                    return (
                      <div
                        key={mission.ref}
                        onClick={() => {
                          sound.play('tap');
                          setPreviewMission(mission);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          !unlocked
                            ? 'bg-gv-bg/60 border-gv-border/60 opacity-75 hover:border-gv-border'
                            : isDone
                            ? 'bg-gv-surface-high/70 border-gv-primary/50 hover:border-gv-primary'
                            : 'bg-gv-surface-high border-gv-border hover:border-gv-accent hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
                            style={{
                              backgroundColor: `${mission.color}18`,
                              borderColor: `${mission.color}40`,
                            }}
                          >
                            {mission.emoji}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gv-muted">
                                {mission.client}
                              </span>
                              <span className="text-[10px] font-mono text-gv-primary font-bold">
                                · {exData.steps.length}{' '}
                                {tr(locale, {
                                  es: 'pasos',
                                  en: 'steps',
                                  de: 'Schritte',
                                  fr: 'étapes',
                                  ja: 'ステップ',
                                  pt: 'passos',
                                })}{' '}
                                · {exData.sheets.length}{' '}
                                {tr(locale, {
                                  es: 'hojas',
                                  en: 'sheets',
                                  de: 'Blätter',
                                  fr: 'feuilles',
                                  ja: 'シート',
                                  pt: 'abas',
                                })}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-gv-text mt-0.5 truncate">
                              {mission.title}
                            </h4>
                            <p className="text-[11px] text-gv-muted mt-1 line-clamp-2 leading-relaxed">
                              {mission.description}
                            </p>

                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-gv-accent border border-gv-primary/20">
                                {mission.skills}
                              </span>
                              {isDone && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-gv-warning">
                                  <Star className="w-3 h-3 fill-gv-warning" />
                                  <Star className="w-3 h-3 fill-gv-warning" />
                                  <Star className="w-3 h-3 fill-gv-warning" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 pt-1">
                          {!unlocked ? (
                            <Lock className="w-4 h-4 text-gv-muted" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-gv-accent" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gv-muted" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. All 3 Quick Training Modes (Entrenamiento Rápido) */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-gv-text">
            {tr(locale, {
              es: 'Entrenamiento Rápido',
              en: 'Quick Training',
              de: 'Schnelltraining',
              fr: 'Entraînement Rapide',
              ja: 'クイックトレーニング',
              pt: 'Treinamento Rápido',
            })}
          </h2>
          <p className="text-xs text-gv-muted mt-0.5">
            {tr(locale, {
              es: 'Sesiones intensivas para reforzar puntos débiles, agilidad mental y atajos.',
              en: 'Focused drills to reinforce weak spots, mental speed, and keyboard shortcuts.',
              de: 'Gezielte Übungen für Schwachstellen, Kopfrechnen und Tastenkombinationen.',
              fr: 'Sessions intensives pour renforcer tes points faibles, ta vitesse et tes raccourcis.',
              ja: '弱点補強、暗算スピード、ショートカットを集中トレーニング。',
              pt: 'Sessões intensivas para reforçar pontos fracos, agilidade mental e atalhos.',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode 1: Repasar Puntos Débiles (WEAK_POINTS) */}
          <div
            onClick={() => {
              sound.play('tap');
              setActiveExercise(getStepByStepExercise('WEAK_POINTS', locale));
            }}
            className="p-5 rounded-2xl bg-gv-surface border border-gv-border hover:border-gv-info/60 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-md group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gv-info/15 border border-gv-info/30 flex items-center justify-center text-gv-info group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-gv-info/15 text-gv-info border border-gv-info/30">
                +45 XP
              </span>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-gv-text">
                {tr(locale, {
                  es: 'Repasar puntos débiles',
                  en: 'Review Weak Points',
                  de: 'Schwachstellen üben',
                  fr: 'Réviser les points faibles',
                  ja: '弱点を復習する',
                  pt: 'Revisar pontos fracos',
                })}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {tr(locale, {
                  es: 'Practica referencias fijas ($B$5), jerarquía de paréntesis y potencias en 2 hojas.',
                  en: 'Practice absolute references ($B$5), parentheses priority, and powers across 2 sheets.',
                  de: 'Übe absolute Bezüge ($B$5), Klammer-Rangfolge und Potenzen auf 2 Blättern.',
                  fr: 'Pratique les références absolues ($B$5), la priorité des parenthèses et les puissances.',
                  ja: '2つのシートで絶対参照($B$5)、カッコの優先順位、べき乗を練習します。',
                  pt: 'Pratique referências fixas ($B$5), prioridade de parênteses e potências em 2 abas.',
                })}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gv-info pt-1 border-t border-gv-border/60">
              <span>
                {tr(locale, {
                  es: '10 pasos · 2 hojas',
                  en: '10 steps · 2 sheets',
                  de: '10 Schritte · 2 Blätter',
                  fr: '10 étapes · 2 feuilles',
                  ja: '10ステップ · 2シート',
                  pt: '10 passos · 2 abas',
                })}
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Mode 2: Contrarreloj de 60s (TimeAttackScreen) */}
          <div
            onClick={handleOpenTimeAttack}
            className="p-5 rounded-2xl bg-gv-surface border border-gv-border hover:border-gv-warning/60 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-md group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gv-warning/15 border border-gv-warning/30 flex items-center justify-center text-gv-warning group-hover:scale-105 transition-transform">
                <Timer className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-gv-warning/15 text-gv-warning border border-gv-warning/30">
                {personalRecord > 0
                  ? `${tr(locale, {
                      es: 'Récord',
                      en: 'Best',
                      de: 'Rekord',
                      fr: 'Record',
                      ja: '自己ベスト',
                      pt: 'Recorde',
                    })}: ${personalRecord} pts`
                  : '60s'}
              </span>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-gv-text">
                {tr(locale, {
                  es: 'Contrarreloj de 60s',
                  en: '60s Time Attack',
                  de: '60s Zeitangriff',
                  fr: 'Contre-la-montre 60s',
                  ja: '60秒タイムアタック',
                  pt: 'Contra o relógio 60s',
                })}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {tr(locale, {
                  es: '¿Cuántas fórmulas y cálculos mentales puedes resolver antes de que acabe el reloj?',
                  en: 'How many formulas and mental calculations can you solve before time runs out?',
                  de: 'Wie viele Formeln und Kopfrechnungen schaffst du vor Ablauf der Zeit?',
                  fr: 'Combien de formules et calculs mentaux peux-tu résoudre avant la fin du chrono ?',
                  ja: '制限時間内にいくつの数式と暗算を解けるか挑戦しよう！',
                  pt: 'Quantas fórmulas e cálculos mentais você consegue resolver antes do tempo acabar?',
                })}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gv-warning pt-1 border-t border-gv-border/60">
              <span>Combos x2 · x3 · x4</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Mode 3: Atajos de Teclado (SHORTCUTS) */}
          <div
            onClick={() => {
              sound.play('tap');
              setShortcutIndex(0);
              setShortcutScore(0);
              setShortcutSelected(null);
              setShortcutDone(false);
              setIsShortcutsDrillOpen(true);
            }}
            className="p-5 rounded-2xl bg-gv-surface border border-gv-border hover:border-gv-primary/60 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-md group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gv-primary/15 border border-gv-primary/30 flex items-center justify-center text-gv-accent group-hover:scale-105 transition-transform">
                <Keyboard className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-gv-primary/15 text-gv-accent border border-gv-primary/30">
                +30 XP
              </span>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-gv-text">
                {tr(locale, {
                  es: 'Atajos de teclado',
                  en: 'Keyboard Shortcuts',
                  de: 'Tastenkombinationen',
                  fr: 'Raccourcis clavier',
                  ja: 'キーボードショートカット',
                  pt: 'Atalhos de teclado',
                })}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {tr(locale, {
                  es: 'Domina F4, Alt+=, Ctrl+Shift+L y combinaciones rápidas de productividad.',
                  en: 'Master F4, Alt+=, Ctrl+Shift+L, and high-speed productivity shortcuts.',
                  de: 'Meistere F4, Alt+=, Strg+Umschalt+L und schnelle Produktivitäts-Shortcuts.',
                  fr: 'Maîtrise F4, Alt+=, Ctrl+Maj+L et les raccourcis de productivité.',
                  ja: 'F4、Alt+=、Ctrl+Shift+Lなど高速ショートカットをマスター。',
                  pt: 'Domine F4, Alt+=, Ctrl+Shift+L e combinações rápidas de produtividade.',
                })}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gv-accent pt-1 border-t border-gv-border/60">
              <span>
                {tr(locale, {
                  es: '8 retos interactivos',
                  en: '8 interactive drills',
                  de: '8 interaktive Aufgaben',
                  fr: '8 défis interactifs',
                  ja: '8つの実践ドリル',
                  pt: '8 desafios interativos',
                })}
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* MissionDetailSheet Modal (Preview before launching StepByStepScreen) */}
      {previewMission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          {(() => {
            const parentCourse =
              practiceCourses.find((c) => c.id === previewMission.courseId) ||
              practiceCourses[0];
            const unlocked = isMissionUnlocked(previewMission, parentCourse);
            const done = isMissionDone(previewMission.ref);
            const ex = getStepByStepExercise(previewMission.ref, locale);

            return (
              <div className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-fade-in">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border"
                      style={{
                        backgroundColor: `${previewMission.color}18`,
                        borderColor: `${previewMission.color}45`,
                      }}
                    >
                      {previewMission.emoji}
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${previewMission.color}20`,
                          color: previewMission.color,
                        }}
                      >
                        {tr(locale, {
                          es: 'CLIENTE',
                          en: 'CLIENT',
                          de: 'KUNDE',
                          fr: 'CLIENT',
                          ja: 'クライアント',
                          pt: 'CLIENTE',
                        })}
                        : {previewMission.client}
                      </span>
                      <h3 className="text-lg font-black text-gv-text mt-1">
                        {previewMission.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewMission(null)}
                    className="p-1.5 rounded-lg text-gv-muted hover:text-gv-text cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs md:text-sm text-gv-muted leading-relaxed">
                  {previewMission.description}
                </p>

                {/* Workbook Specs */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-gv-surface-high border border-gv-border flex items-center gap-2.5">
                    <ListChecks className="w-4 h-4 text-gv-primary shrink-0" />
                    <div>
                      <div className="text-[10px] text-gv-muted font-bold">
                        {tr(locale, {
                          es: 'Estructura',
                          en: 'Structure',
                          de: 'Struktur',
                          fr: 'Structure',
                          ja: '構成',
                          pt: 'Estrutura',
                        })}
                      </div>
                      <div className="text-xs font-mono font-extrabold text-gv-text">
                        {ex.steps.length}{' '}
                        {tr(locale, {
                          es: 'pasos guiados',
                          en: 'guided steps',
                          de: 'geführte Schritte',
                          fr: 'étapes guidées',
                          ja: 'ガイド付きステップ',
                          pt: 'passos guiados',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gv-surface-high border border-gv-border flex items-center gap-2.5">
                    <Table2 className="w-4 h-4 text-gv-info shrink-0" />
                    <div>
                      <div className="text-[10px] text-gv-muted font-bold">
                        {tr(locale, {
                          es: 'Libro Excel',
                          en: 'Excel Workbook',
                          de: 'Excel-Mappe',
                          fr: 'Classeur Excel',
                          ja: 'Excelブック',
                          pt: 'Pasta Excel',
                        })}
                      </div>
                      <div className="text-xs font-mono font-extrabold text-gv-text">
                        {ex.sheets.length}{' '}
                        {tr(locale, {
                          es: 'hojas conectadas',
                          en: 'linked sheets',
                          de: 'verknüpfte Blätter',
                          fr: 'feuilles liées',
                          ja: '連携シート',
                          pt: 'abas conectadas',
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sheets preview */}
                <div className="flex flex-wrap gap-1.5">
                  {ex.sheets.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-lg bg-gv-bg border border-gv-border font-mono text-[11px] text-gv-text font-semibold"
                    >
                      📄 {s.name}
                    </span>
                  ))}
                </div>

                {/* Rewards */}
                <div className="p-3 rounded-xl bg-gv-surface-high/60 border border-gv-border flex items-center justify-around">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-gv-warning">
                    <Zap className="w-4 h-4 fill-gv-warning" />
                    <span>+{ex.earnedXp} XP</span>
                  </div>
                  <div className="w-px h-4 bg-gv-border" />
                  <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-gv-bytes">
                    <Gem className="w-4 h-4" />
                    <span>
                      +{ex.earnedBytes}{' '}
                      {tr(locale, {
                        es: 'Gemas',
                        en: 'Gems',
                        de: 'Juwelen',
                        fr: 'Gemmes',
                        ja: 'ジェム',
                        pt: 'Gemas',
                      })}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gv-border" />
                  <div className="font-mono text-[11px] font-bold text-gv-accent">
                    {previewMission.skills}
                  </div>
                </div>

                {!unlocked ? (
                  <div className="p-3.5 rounded-xl bg-gv-warning/10 border border-gv-warning/30 text-xs text-gv-warning font-semibold flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>
                        {tr(locale, {
                          es: 'Requisito previo:',
                          en: 'Prerequisite:',
                          de: 'Voraussetzung:',
                          fr: 'Prérequis :',
                          ja: '前提条件:',
                          pt: 'Pré-requisito:',
                        })}{' '}
                        <strong>
                          {previewMission.prerequisiteTitle ||
                            parentCourse.prerequisiteCourseTitle}
                        </strong>
                      </span>
                    </div>
                    {onNavigateTab && !stats.isPro && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewMission(null);
                          onNavigateTab('shop');
                        }}
                        className="w-full py-2.5 rounded-xl bg-gv-warning text-black font-black text-xs uppercase cursor-pointer"
                      >
                        {tr(locale, {
                          es: 'Desbloquear todo con Gridverse PRO',
                          en: 'Unlock everything with Gridverse PRO',
                          de: 'Alles freischalten mit Gridverse PRO',
                          fr: 'Tout débloquer avec Gridverse PRO',
                          ja: 'Gridverse PROですべてアンロック',
                          pt: 'Desbloquear tudo com o Gridverse PRO',
                        })}
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.play('tap');
                      const targetEx = getStepByStepExercise(previewMission.ref, locale);
                      setPreviewMission(null);
                      setActiveExercise(targetEx);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-gv-primary/25 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>
                      {done
                        ? tr(locale, {
                            es: 'REPETIR MISIÓN PASO A PASO',
                            en: 'REPLAY STEP-BY-STEP MISSION',
                            de: 'MISSION WIEDERHOLEN',
                            fr: 'REJOUER LA MISSION PAS À PAS',
                            ja: 'ミッションをもう一度プレイ',
                            pt: 'REPETIR MISSÃO PASSO A PASSO',
                          })
                        : tr(locale, {
                            es: 'COMENZAR MISIÓN',
                            en: 'START MISSION',
                            de: 'MISSION STARTEN',
                            fr: 'COMMENCER LA MISSION',
                            ja: 'ミッション開始',
                            pt: 'COMEÇAR MISSÃO',
                          })}
                    </span>
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Multi-Sheet StepByStep Workbook Modal */}
      {activeExercise && (
        <MissionModal
          exercise={activeExercise}
          stats={stats}
          locale={locale}
          onClose={() => setActiveExercise(null)}
          onSuccess={handleCompleteExercise}
          onLoseLife={onLoseLife}
        />
      )}

      {/* 60-Second Time Attack Modal (matching TimeAttackScreen) */}
      {isTimeAttackOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gv-border pb-3">
              <div className="flex items-center gap-2 text-gv-warning font-black text-sm">
                <Timer className="w-5 h-5" />
                <span>
                  {tr(locale, {
                    es: 'CONTRARRELOJ 60s',
                    en: '60s TIME ATTACK',
                    de: '60s ZEITANGRIFF',
                    fr: 'CONTRE-LA-MONTRE 60s',
                    ja: '60秒タイムアタック',
                    pt: 'CONTRA O RELÓGIO 60s',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {combo >= 2 && !isTaFinished && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gv-streak/20 border border-gv-streak text-gv-streak font-mono text-xs font-black flex items-center gap-1 animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-gv-streak" />
                    x{combo >= 8 ? 4 : combo >= 5 ? 3 : 2}
                  </span>
                )}
                <span
                  className={`font-mono text-lg font-black px-3 py-0.5 rounded-xl border ${
                    timeLeft <= 10
                      ? 'bg-gv-error/20 border-gv-error text-gv-error animate-pulse'
                      : 'bg-gv-bg border-gv-border text-gv-accent'
                  }`}
                >
                  {timeLeft}s
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimeAttackOpen(false)}
                  className="p-1 text-gv-muted hover:text-gv-text cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isTaFinished && taQuestions.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gv-muted">
                    {tr(locale, {
                      es: 'Puntaje',
                      en: 'Score',
                      de: 'Punkte',
                      fr: 'Score',
                      ja: 'スコア',
                      pt: 'Pontuação',
                    })}
                    : <strong className="text-gv-text text-sm">{score}</strong>
                  </span>
                  <span className="text-gv-warning">
                    {tr(locale, {
                      es: 'Récord',
                      en: 'Best',
                      de: 'Rekord',
                      fr: 'Record',
                      ja: 'ベスト',
                      pt: 'Recorde',
                    })}
                    : <strong>{personalRecord}</strong>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gv-surface-high border border-gv-border flex items-center gap-3">
                  <CeldiMascot
                    mood={
                      lastTaCorrect === true
                        ? 'celebrating'
                        : lastTaCorrect === false
                        ? 'sad'
                        : combo >= 3
                        ? 'onFire'
                        : 'thinking'
                    }
                    size={50}
                  />
                  <p className="text-sm md:text-base font-bold text-gv-text leading-snug">
                    {taQuestions[qIndex % taQuestions.length].prompt}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {taQuestions[qIndex % taQuestions.length].options.map((opt) => {
                    const isPicked = selectedTaAnswer === opt;
                    const isRight = opt === taQuestions[qIndex % taQuestions.length].correct;
                    let btnStyle =
                      'bg-gv-surface-high hover:bg-gv-primary/15 border-gv-border hover:border-gv-primary text-gv-text';
                    if (selectedTaAnswer !== null) {
                      if (isRight) {
                        btnStyle = 'bg-gv-primary/25 border-gv-primary text-gv-accent';
                      } else if (isPicked) {
                        btnStyle = 'bg-gv-error/25 border-gv-error text-gv-error';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswerTimeAttack(opt)}
                        className={`p-3.5 rounded-xl border text-left font-mono text-xs md:text-sm font-bold transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <CeldiMascot mood="celebrating" size={88} />
                {isNewRecord && (
                  <span className="px-3 py-1 rounded-full bg-gv-warning/20 border border-gv-warning text-gv-warning font-mono text-xs font-black">
                    🏆{' '}
                    {tr(locale, {
                      es: '¡NUEVO RÉCORD PERSONAL!',
                      en: 'NEW PERSONAL RECORD!',
                      de: 'NEUER PERSÖNLICHER REKORD!',
                      fr: 'NOUVEAU RECORD PERSONNEL !',
                      ja: '自己ベスト更新！',
                      pt: 'NOVO RECORDE PESSOAL!',
                    })}
                  </span>
                )}
                <h4 className="text-xl font-black text-gv-text">
                  {tr(locale, {
                    es: '¡Tiempo terminado!',
                    en: 'Time’s up!',
                    de: 'Zeit abgelaufen!',
                    fr: 'Temps écoulé !',
                    ja: 'タイムアップ！',
                    pt: 'Tempo esgotado!',
                  })}
                </h4>
                <p className="text-xs text-gv-muted">
                  {tr(locale, {
                    es: 'Puntaje final',
                    en: 'Final score',
                    de: 'Endstand',
                    fr: 'Score final',
                    ja: '最終スコア',
                    pt: 'Pontuação final',
                  })}
                  : <strong className="text-gv-accent font-mono">{score} pts</strong> ·{' '}
                  {tr(locale, {
                    es: 'Combo máx',
                    en: 'Max combo',
                    de: 'Max-Combo',
                    fr: 'Combo max',
                    ja: '最大コンボ',
                    pt: 'Combo máx',
                  })}
                  : <strong className="text-gv-streak font-mono">x{maxCombo}</strong>
                </p>
                <div className="flex items-center gap-3 w-full mt-3">
                  <button
                    type="button"
                    onClick={handleOpenTimeAttack}
                    className="flex-1 py-3 rounded-xl bg-gv-surface-high border border-gv-border hover:border-gv-primary text-gv-text font-black text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />{' '}
                    {tr(locale, {
                      es: 'Jugar otra vez',
                      en: 'Play Again',
                      de: 'Nochmal spielen',
                      fr: 'Rejouer',
                      ja: 'もう一度プレイ',
                      pt: 'Jogar novamente',
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTimeAttackOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-gv-primary text-black font-black text-xs uppercase cursor-pointer"
                  >
                    {tr(locale, {
                      es: 'Continuar',
                      en: 'Continue',
                      de: 'Weiter',
                      fr: 'Continuer',
                      ja: '続ける',
                      pt: 'Continuar',
                    })}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Drill Modal */}
      {isShortcutsDrillOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gv-border pb-3">
              <div className="flex items-center gap-2 text-gv-accent font-black text-sm">
                <Keyboard className="w-5 h-5" />
                <span>
                  {tr(locale, {
                    es: 'ENTRENAMIENTO DE ATAJOS',
                    en: 'SHORTCUTS DRILL',
                    de: 'SHORTCUT-TRAINING',
                    fr: 'ENTRAÎNEMENT AUX RACCOURCIS',
                    ja: 'ショートカット練習',
                    pt: 'TREINO DE ATALHOS',
                  })}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsShortcutsDrillOpen(false)}
                className="p-1 text-gv-muted hover:text-gv-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!shortcutDone ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono text-gv-muted">
                  <span>
                    {tr(locale, {
                      es: `Reto ${shortcutIndex + 1} de ${shortcutDrillQuestions.length}`,
                      en: `Drill ${shortcutIndex + 1} of ${shortcutDrillQuestions.length}`,
                      de: `Aufgabe ${shortcutIndex + 1} von ${shortcutDrillQuestions.length}`,
                      fr: `Défi ${shortcutIndex + 1} sur ${shortcutDrillQuestions.length}`,
                      ja: `問題 ${shortcutIndex + 1} / ${shortcutDrillQuestions.length}`,
                      pt: `Desafio ${shortcutIndex + 1} de ${shortcutDrillQuestions.length}`,
                    })}
                  </span>
                  <span className="text-gv-accent font-bold">
                    {tr(locale, {
                      es: 'Aciertos',
                      en: 'Hits',
                      de: 'Treffer',
                      fr: 'Réussites',
                      ja: '正解数',
                      pt: 'Acertos',
                    })}
                    : {shortcutScore}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gv-surface-high border border-gv-border">
                  <p className="text-sm md:text-base font-bold text-gv-text leading-snug">
                    {shortcutDrillQuestions[shortcutIndex].q}
                  </p>
                  <p className="text-[11px] font-mono text-gv-muted mt-2">
                    🍎{' '}
                    {tr(locale, {
                      es: 'En Mac equivale a:',
                      en: 'On Mac equivalent to:',
                      de: 'Auf Mac entspricht das:',
                      fr: 'Sur Mac équivaut à :',
                      ja: 'Macでの対応キー:',
                      pt: 'No Mac equivale a:',
                    })}{' '}
                    <span className="text-gv-accent">
                      {shortcutDrillQuestions[shortcutIndex].mac}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {shortcutDrillQuestions[shortcutIndex].opts.map((opt) => {
                    const isPicked = shortcutSelected === opt;
                    const isCorrect = opt === shortcutDrillQuestions[shortcutIndex].ans;
                    let cls =
                      'bg-gv-surface-high hover:bg-gv-primary/15 border-gv-border text-gv-text';
                    if (shortcutSelected !== null) {
                      if (isCorrect) cls = 'bg-gv-primary/25 border-gv-primary text-gv-accent';
                      else if (isPicked) cls = 'bg-gv-error/25 border-gv-error text-gv-error';
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (shortcutSelected !== null) return;
                          setShortcutSelected(opt);
                          if (isCorrect) {
                            sound.play('correct');
                            setShortcutScore((s) => s + 1);
                          } else {
                            sound.play('wrong');
                          }
                          setTimeout(() => {
                            if (shortcutIndex + 1 < shortcutDrillQuestions.length) {
                              setShortcutIndex((i) => i + 1);
                              setShortcutSelected(null);
                            } else {
                              sound.play('level_win');
                              setShortcutDone(true);
                              onReward(30, 15, 'SHORTCUTS');
                            }
                          }, 600);
                        }}
                        className={`p-3.5 rounded-xl border font-mono text-xs md:text-sm font-bold text-left transition-all cursor-pointer flex items-center justify-between ${cls}`}
                      >
                        <span>⌨️ {opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <CeldiMascot mood="celebrating" size={84} />
                <h4 className="text-xl font-black text-gv-text">
                  {tr(locale, {
                    es: '¡Atajos Dominados!',
                    en: 'Shortcuts Mastered!',
                    de: 'Shortcuts gemeistert!',
                    fr: 'Raccourcis Maîtrisés !',
                    ja: 'ショートカット制覇！',
                    pt: 'Atalhos Dominados!',
                  })}
                </h4>
                <p className="text-xs text-gv-muted">
                  {tr(locale, {
                    es: `Acertaste ${shortcutScore} de ${shortcutDrillQuestions.length} combinaciones de teclado (+30 XP y +15 Gemas).`,
                    en: `You got ${shortcutScore} of ${shortcutDrillQuestions.length} keyboard shortcuts right (+30 XP & +15 Gems).`,
                    de: `Du hast ${shortcutScore} von ${shortcutDrillQuestions.length} Tastenkombinationen richtig (+30 XP & +15 Juwelen).`,
                    fr: `Tu as réussi ${shortcutScore} raccourcis sur ${shortcutDrillQuestions.length} (+30 XP et +15 Gemmes).`,
                    ja: `${shortcutDrillQuestions.length}問中${shortcutScore}問正解しました（+30 XP & +15 ジェム）。`,
                    pt: `Você acertou ${shortcutScore} de ${shortcutDrillQuestions.length} atalhos de teclado (+30 XP e +15 Gemas).`,
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => setIsShortcutsDrillOpen(false)}
                  className="w-full py-3 rounded-xl bg-gv-primary text-black font-black text-xs uppercase cursor-pointer mt-2"
                >
                  {tr(locale, {
                    es: 'Continuar',
                    en: 'Continue',
                    de: 'Weiter',
                    fr: 'Continuer',
                    ja: '続ける',
                    pt: 'Continuar',
                  })}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
