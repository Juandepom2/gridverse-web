import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../lib/audio';

export interface CellCoord {
  c: number;
  r: number;
}

export const CellRefUtil = {
  col(i: number): string {
    return String.fromCharCode(65 + i);
  },
  of(c: number, r: number): string {
    return `${this.col(c)}${r + 1}`;
  },
  parse(ref: string): CellCoord | null {
    const m = ref.trim().toUpperCase().match(/^([A-Z])(\d+)$/);
    if (!m) return null;
    return {
      c: m[1].charCodeAt(0) - 65,
      r: parseInt(m[2], 10) - 1,
    };
  },
  range(a: string, b: string): string {
    const p1 = this.parse(a);
    const p2 = this.parse(b);
    if (!p1 || !p2) return a || b || '';
    if (p1.c === p2.c && p1.r === p2.r) {
      return this.of(p1.c, p1.r);
    }
    const minC = Math.min(p1.c, p2.c);
    const maxC = Math.max(p1.c, p2.c);
    const minR = Math.min(p1.r, p2.r);
    const maxR = Math.max(p1.r, p2.r);
    return `${this.of(minC, minR)}:${this.of(maxC, maxR)}`;
  },
  inRange(cell: string, selection: string): boolean {
    if (!selection) return false;
    const parts = selection.split(':');
    const pCell = this.parse(cell);
    const p1 = this.parse(parts[0]);
    const p2 = this.parse(parts[parts.length - 1]);
    if (!pCell || !p1 || !p2) return false;
    const minC = Math.min(p1.c, p2.c);
    const maxC = Math.max(p1.c, p2.c);
    const minR = Math.min(p1.r, p2.r);
    const maxR = Math.max(p1.r, p2.r);
    return pCell.c >= minC && pCell.c <= maxC && pCell.r >= minR && pCell.r <= maxR;
  },
};

const REF_COLORS = ['#4DA3FF', '#B18CFF', '#FFC53D', '#FF8A3D'];

export function highlightsForFormula(formula: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!formula) return result;
  const regex = /([A-Z])(\d+)(?::([A-Z])(\d+))?/gi;
  let match: RegExpExecArray | null;
  let colorIdx = 0;
  while ((match = regex.exec(formula)) !== null) {
    const color = REF_COLORS[colorIdx++ % REF_COLORS.length];
    const a = `${match[1].toUpperCase()}${match[2]}`;
    const b = match[3] && match[4] ? `${match[3].toUpperCase()}${match[4]}` : a;
    const p1 = CellRefUtil.parse(a);
    const p2 = CellRefUtil.parse(b);
    if (p1 && p2) {
      const minC = Math.min(p1.c, p2.c);
      const maxC = Math.max(p1.c, p2.c);
      const minR = Math.min(p1.r, p2.r);
      const maxR = Math.max(p1.r, p2.r);
      for (let c = minC; c <= maxC; c++) {
        for (let r = minR; r <= maxR; r++) {
          if (c < 8 && r < 12) {
            result[CellRefUtil.of(c, r)] = color;
          }
        }
      }
    }
  }
  return result;
}

export function calcGridDimensions(
  data: Record<string, string>,
  extraRef?: string
): { cols: number; rows: number } {
  let maxC = 2; // at least 3 cols (A, B, C)
  let maxR = 3; // at least 4 rows (1, 2, 3, 4)

  const inspectRef = (str: string) => {
    const regex = /([A-Z])(\d+)/gi;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(str)) !== null) {
      const c = m[1].toUpperCase().charCodeAt(0) - 65;
      const r = parseInt(m[2], 10) - 1;
      if (c > maxC && c < 8) maxC = c;
      if (r > maxR && r < 12) maxR = r;
    }
  };

  for (const k of Object.keys(data)) {
    inspectRef(k);
  }
  if (extraRef) {
    inspectRef(extraRef);
  }

  return { cols: maxC + 1, rows: maxR + 1 };
}

interface SpreadsheetGridProps {
  data?: Record<string, string>;
  displayValues?: Record<string, string>;
  selectedCell?: string;
  onSelectCell?: (selection: string) => void;
  targetFormula?: string;
  formulaBarOverride?: string;
  showFormulaBar?: boolean;
  allowRange?: boolean;
  expectRange?: boolean;
  extraRef?: string;
  highlightedCells?: string[];
  highlights?: Record<string, string>;
  readOnly?: boolean;
  columns?: number;
  rows?: number;
  compact?: boolean;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  data = {},
  displayValues = {},
  selectedCell = '',
  onSelectCell,
  targetFormula,
  formulaBarOverride,
  showFormulaBar = true,
  allowRange = false,
  expectRange = false,
  extraRef,
  highlightedCells = [],
  highlights = {},
  readOnly = false,
  columns: customColumns,
  rows: customRows,
}) => {
  const [anchor, setAnchor] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  // Sync external selectedCell changes
  useEffect(() => {
    if (!selectedCell) {
      setAnchor(null);
      setEnd(null);
    } else if (selectedCell.includes(':')) {
      const [a, b] = selectedCell.split(':');
      setAnchor(a);
      setEnd(b);
    } else {
      setAnchor(selectedCell);
      setEnd(selectedCell);
    }
  }, [selectedCell]);

  // Global mouseup / touchend to end dragging
  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  const autoDims = calcGridDimensions(
    data,
    [extraRef, selectedCell, targetFormula].filter(Boolean).join(' ')
  );
  const numCols = customColumns ? Math.max(customColumns, autoDims.cols) : autoDims.cols;
  const numRows = customRows ? Math.max(customRows, autoDims.rows) : autoDims.rows;

  const columns = Array.from({ length: numCols }, (_, i) => CellRefUtil.col(i));
  const rows = Array.from({ length: numRows }, (_, i) => i + 1);

  const currentSelection =
    anchor && end ? CellRefUtil.range(anchor, end) : selectedCell || '';

  // Parse active selection bounds
  const selParts = currentSelection ? currentSelection.split(':') : [];
  const pStart = selParts[0] ? CellRefUtil.parse(selParts[0]) : null;
  const pEnd = selParts[selParts.length - 1]
    ? CellRefUtil.parse(selParts[selParts.length - 1])
    : null;

  const minSelC = pStart && pEnd ? Math.min(pStart.c, pEnd.c) : -1;
  const maxSelC = pStart && pEnd ? Math.max(pStart.c, pEnd.c) : -1;
  const minSelR = pStart && pEnd ? Math.min(pStart.r, pEnd.r) : -1;
  const maxSelR = pStart && pEnd ? Math.max(pStart.r, pEnd.r) : -1;

  const emitSelection = (a: string, b: string) => {
    const nextRange = CellRefUtil.range(a, b);
    setAnchor(a);
    setEnd(b);
    if (onSelectCell) {
      onSelectCell(nextRange);
    }
  };

  // Start cell selection or range drag
  const handleCellPointerDown = (cellRef: string, e: React.PointerEvent) => {
    if (readOnly) return;
    sound.play('tap');

    if (allowRange && e.shiftKey && anchor) {
      emitSelection(anchor, cellRef);
      return;
    }

    // Two-tap convenience when user is on mobile/web and exercise expects a range:
    // If a single cell is currently selected and they tap a different cell without dragging,
    // extend the range from anchor to the new cell!
    if (allowRange && expectRange && anchor && end && anchor === end && anchor !== cellRef) {
      setIsDragging(true);
      emitSelection(anchor, cellRef);
      return;
    }

    setIsDragging(true);
    emitSelection(cellRef, cellRef);
  };

  const handleCellPointerEnter = (cellRef: string) => {
    if (readOnly || !isDragging || !allowRange || !anchor) return;
    if (cellRef !== end) {
      emitSelection(anchor, cellRef);
    }
  };

  // Touch move support for mobile range dragging
  const handleTouchMove = (e: React.TouchEvent) => {
    if (readOnly || !allowRange || !anchor) return;
    const touch = e.touches[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellTd = el?.closest('[data-cell-ref]') as HTMLElement | null;
    if (cellTd) {
      const ref = cellTd.getAttribute('data-cell-ref');
      if (ref && ref !== end) {
        emitSelection(anchor, ref);
      }
    }
  };

  // Excel-like Column Header Click (selects full column or data column)
  const handleColumnHeaderClick = (colIndex: number) => {
    if (readOnly) return;
    sound.play('tap');
    const colLetter = CellRefUtil.col(colIndex);
    if (!allowRange) {
      emitSelection(`${colLetter}1`, `${colLetter}1`);
      return;
    }

    // Determine highest populated row in this column, or total rows
    let lastPopulatedRow = 0;
    for (let r = 0; r < numRows; r++) {
      const ref = CellRefUtil.of(colIndex, r);
      if (data[ref] !== undefined && data[ref] !== '') {
        lastPopulatedRow = r + 1;
      }
    }
    const targetLastRow = lastPopulatedRow > 1 ? lastPopulatedRow : numRows;

    const fullColRange = `${colLetter}1:${colLetter}${targetLastRow}`;
    const dataOnlyColRange =
      targetLastRow >= 2 ? `${colLetter}2:${colLetter}${targetLastRow}` : fullColRange;

    // Check if row 1 is a text header while row 2 is numeric
    const r1Val = data[`${colLetter}1`] ?? '';
    const r2Val = data[`${colLetter}2`] ?? '';
    const r1IsHeader =
      r1Val !== '' &&
      isNaN(Number(r1Val.replace(/[$,%]/g, ''))) &&
      r2Val !== '' &&
      !isNaN(Number(r2Val.replace(/[$,%]/g, '')));

    // If expected range is dataOnlyColRange or row 1 is a header, toggle between data range and full column
    if (currentSelection === fullColRange && targetLastRow >= 2) {
      emitSelection(`${colLetter}2`, `${colLetter}${targetLastRow}`);
    } else if (currentSelection === dataOnlyColRange) {
      emitSelection(`${colLetter}1`, `${colLetter}${targetLastRow}`);
    } else if (r1IsHeader) {
      emitSelection(`${colLetter}2`, `${colLetter}${targetLastRow}`);
    } else {
      emitSelection(`${colLetter}1`, `${colLetter}${targetLastRow}`);
    }
  };

  // Excel-like Row Header Click (selects full row)
  const handleRowHeaderClick = (rowNumber: number) => {
    if (readOnly) return;
    sound.play('tap');
    if (!allowRange) {
      emitSelection(`A${rowNumber}`, `A${rowNumber}`);
      return;
    }

    // Determine rightmost populated column in this row, or total cols
    let lastPopulatedCol = 0;
    for (let c = 0; c < numCols; c++) {
      const ref = `${CellRefUtil.col(c)}${rowNumber}`;
      if (data[ref] !== undefined && data[ref] !== '') {
        lastPopulatedCol = c;
      }
    }
    const targetLastCol =
      lastPopulatedCol > 0 ? CellRefUtil.col(lastPopulatedCol) : CellRefUtil.col(numCols - 1);

    emitSelection(`A${rowNumber}`, `${targetLastCol}${rowNumber}`);
  };

  const rawFormulaValue =
    formulaBarOverride !== undefined
      ? formulaBarOverride
      : targetFormula
      ? targetFormula
      : anchor
      ? data[anchor] ?? ''
      : '';

  return (
    <div className="w-full bg-gv-surface border border-gv-border rounded-xl overflow-hidden shadow-md select-none">
      {/* Compact Excel Formula Bar */}
      {showFormulaBar && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gv-surface-high border-b border-gv-border text-xs font-mono">
          <div className="min-w-[54px] px-1.5 text-center py-0.5 bg-gv-surface rounded border border-gv-border font-bold text-gv-primary text-[11px]">
            {currentSelection || '\u00A0'}
          </div>
          <div className="text-gv-muted font-bold italic select-none text-xs px-1">fx</div>
          <div className="flex-1 px-2 py-0.5 bg-gv-surface rounded border border-gv-border text-gv-text truncate text-xs min-h-[22px] flex items-center">
            {rawFormulaValue}
          </div>
        </div>
      )}

      {/* Compact Grid Table */}
      <div className="overflow-x-auto" onTouchMove={handleTouchMove}>
        <table
          ref={tableRef}
          className="w-full border-collapse font-mono text-xs touch-none"
        >
          <thead>
            <tr className="bg-gv-surface-high text-gv-muted select-none">
              <th className="w-8 py-1 border-r border-b border-gv-border text-center font-normal text-gv-faint text-[10px]">
                #
              </th>
              {columns.map((col, cIdx) => {
                const isColActive =
                  minSelC !== -1 && cIdx >= minSelC && cIdx <= maxSelC;
                return (
                  <th
                    key={col}
                    onClick={() => handleColumnHeaderClick(cIdx)}
                    title={
                      allowRange
                        ? `Clic para seleccionar columna ${col}`
                        : `Columna ${col}`
                    }
                    className={`py-1 border-r border-b text-center font-bold min-w-[56px] text-[11px] transition-colors ${
                      !readOnly ? 'cursor-pointer hover:bg-gv-primary-soft/60' : ''
                    } ${
                      isColActive
                        ? 'bg-gv-primary-soft text-gv-primary border-gv-border border-b-2 border-b-gv-primary'
                        : 'border-gv-border text-gv-muted'
                    }`}
                  >
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => {
              const isRowActive =
                minSelR !== -1 && rIdx >= minSelR && rIdx <= maxSelR;
              return (
                <tr key={row}>
                  {/* Row Header Number */}
                  <td
                    onClick={() => handleRowHeaderClick(row)}
                    title={
                      allowRange ? `Clic para seleccionar fila ${row}` : `Fila ${row}`
                    }
                    className={`w-8 py-1 border-r border-b text-center select-none font-bold text-[10px] transition-colors ${
                      !readOnly ? 'cursor-pointer hover:bg-gv-primary-soft/60' : ''
                    } ${
                      isRowActive
                        ? 'bg-gv-primary-soft text-gv-primary border-gv-border border-r-2 border-r-gv-primary'
                        : 'bg-gv-surface-high/60 border-gv-border text-gv-muted'
                    }`}
                  >
                    {row}
                  </td>

                  {/* Cells */}
                  {columns.map((col, cIdx) => {
                    const cellRef = `${col}${row}`;
                    const inSelectedRange =
                      minSelC !== -1 &&
                      cIdx >= minSelC &&
                      cIdx <= maxSelC &&
                      rIdx >= minSelR &&
                      rIdx <= maxSelR;

                    const isTopEdge = inSelectedRange && rIdx === minSelR;
                    const isBottomEdge = inSelectedRange && rIdx === maxSelR;
                    const isLeftEdge = inSelectedRange && cIdx === minSelC;
                    const isRightEdge = inSelectedRange && cIdx === maxSelC;
                    const isBottomRightCorner = isBottomEdge && isRightEdge;

                    const refHighlightColor =
                      highlights[cellRef] ||
                      (highlightedCells.includes(cellRef) ? '#4DA3FF' : undefined);

                    const raw = data[cellRef] ?? '';
                    const shown = displayValues[cellRef] ?? raw;
                    const isError = shown.startsWith('#');
                    const isHeaderCell = rIdx === 0 && shown !== '' && isNaN(Number(shown));
                    const isNumber =
                      shown !== '' &&
                      !isNaN(Number(shown.replace(/[$,%\s]/g, '')));

                    // Box shadow / border overlay for crisp Excel range rectangle
                    const rangeBorderStyles: React.CSSProperties = {};
                    if (inSelectedRange) {
                      const shadows: string[] = [];
                      if (isTopEdge) shadows.push('inset 0 2px 0 0 #21C26B');
                      if (isBottomEdge) shadows.push('inset 0 -2px 0 0 #21C26B');
                      if (isLeftEdge) shadows.push('inset 2px 0 0 0 #21C26B');
                      if (isRightEdge) shadows.push('inset -2px 0 0 0 #21C26B');
                      if (shadows.length > 0) {
                        rangeBorderStyles.boxShadow = shadows.join(', ');
                      }
                    } else if (refHighlightColor) {
                      rangeBorderStyles.boxShadow = `inset 0 0 0 1.5px ${refHighlightColor}`;
                      rangeBorderStyles.backgroundColor = `${refHighlightColor}22`;
                    }

                    return (
                      <td
                        key={cellRef}
                        data-cell-ref={cellRef}
                        onPointerDown={(e) => handleCellPointerDown(cellRef, e)}
                        onPointerEnter={() => handleCellPointerEnter(cellRef)}
                        style={rangeBorderStyles}
                        className={`relative px-2 py-1.5 border-r border-b border-gv-grid transition-colors select-none text-xs h-7 sm:h-8 ${
                          !readOnly ? 'cursor-pointer' : ''
                        } ${isNumber ? 'text-right' : 'text-left'} ${
                          inSelectedRange
                            ? 'bg-gv-primary/20 text-gv-accent font-semibold'
                            : isError
                            ? 'bg-gv-error/15 text-gv-error font-bold'
                            : isHeaderCell
                            ? 'bg-gv-surface-high font-bold text-gv-text'
                            : 'hover:bg-gv-surface-high/60 text-gv-text font-medium'
                        }`}
                      >
                        <span className="truncate block">{shown}</span>

                        {/* Green Excel Fill Handle indicator on bottom-right of selection */}
                        {isBottomRightCorner && (
                          <div className="absolute bottom-[-3px] right-[-3px] w-2.5 h-2.5 bg-gv-primary rounded-full border-2 border-gv-surface z-10 pointer-events-none" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
