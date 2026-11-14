import React from 'react';
import { sound } from '../lib/audio';

interface SpreadsheetGridProps {
  data?: Record<string, string>;
  selectedCell?: string;
  onSelectCell?: (cellRef: string) => void;
  targetFormula?: string;
  highlightedCells?: string[];
  readOnly?: boolean;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  data = {},
  selectedCell = 'A1',
  onSelectCell,
  targetFormula,
  highlightedCells = [],
  readOnly = false,
}) => {
  // Determine grid dimensions dynamically (matching Flutter's _calcGridDimensions)
  // At least 3 columns (A, B, C) and 3 rows (1, 2, 3)
  let maxCol = 2; // 0=A, 1=B, 2=C
  let maxRow = 3; // rows 1, 2, 3

  const allRefs = [...Object.keys(data), selectedCell, ...(targetFormula ? [targetFormula] : [])];
  for (const ref of allRefs) {
    const match = ref.match(/([A-Z])(\d+)/i);
    if (match) {
      const colIdx = match[1].toUpperCase().charCodeAt(0) - 65;
      const rowIdx = parseInt(match[2], 10);
      if (colIdx > maxCol && colIdx < 6) maxCol = colIdx;
      if (rowIdx > maxRow && rowIdx < 7) maxRow = rowIdx;
    }
  }

  // Cap max columns to 4 (A, B, C, D) and rows to 4 to prevent vertical scroll
  const numCols = Math.min(Math.max(maxCol + 1, 3), 4);
  const numRows = Math.min(Math.max(maxRow, 3), 4);

  const columns = Array.from({ length: numCols }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: numRows }, (_, i) => i + 1);

  const handleCellClick = (ref: string) => {
    if (readOnly) return;
    sound.play('tap');
    if (onSelectCell) {
      onSelectCell(ref);
    }
  };

  const activeValue = data[selectedCell] ?? '';

  return (
    <div className="w-full bg-gv-surface border border-gv-border rounded-xl overflow-hidden shadow-md">
      {/* Compact Excel Formula Bar */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gv-surface-high border-b border-gv-border text-[11px] font-mono">
        <div className="w-9 text-center py-0.5 bg-gv-surface rounded border border-gv-border font-bold text-gv-accent">
          {selectedCell}
        </div>
        <div className="text-gv-muted font-bold select-none text-[10px]">fx</div>
        <div className="flex-1 px-2 py-0.5 bg-gv-surface rounded border border-gv-border text-gv-text truncate text-[11px]">
          {targetFormula ? targetFormula : activeValue}
        </div>
      </div>

      {/* Compact Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-gv-surface-high/80 text-gv-muted select-none">
              <th className="w-8 py-1 border-r border-b border-gv-border text-center font-normal text-gv-faint text-[10px]">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-1 border-r border-b border-gv-border text-center font-semibold text-gv-muted min-w-[50px] text-[11px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                {/* Row Header Number */}
                <td className="w-8 py-1 border-r border-b border-gv-border text-center bg-gv-surface-high/60 text-gv-muted select-none font-medium text-[10px]">
                  {row}
                </td>

                {/* Cells */}
                {columns.map((col) => {
                  const cellRef = `${col}${row}`;
                  const isSelected = selectedCell === cellRef;
                  const isHighlighted = highlightedCells.includes(cellRef);
                  const val = data[cellRef] ?? '';

                  return (
                    <td
                      key={cellRef}
                      onClick={() => handleCellClick(cellRef)}
                      className={`relative px-2 py-1.5 border-r border-b border-gv-border transition-colors cursor-pointer select-none text-right font-medium text-xs h-7 sm:h-8 ${
                        isSelected
                          ? 'bg-gv-primary-soft/50 outline-2 -outline-offset-2 outline-gv-primary text-gv-accent'
                          : isHighlighted
                          ? 'bg-gv-info-soft/30 text-gv-info'
                          : 'hover:bg-gv-surface-high/60 text-gv-text'
                      }`}
                    >
                      <span className="truncate block">{val}</span>

                      {/* Green Excel Fill Handle indicator on selected cell */}
                      {isSelected && (
                        <div className="absolute bottom-[-2px] right-[-2px] w-2 h-2 bg-gv-accent border border-gv-primary-dark z-10" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
