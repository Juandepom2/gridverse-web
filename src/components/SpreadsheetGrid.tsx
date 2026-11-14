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
  const columns = ['A', 'B', 'C', 'D'];
  const rows = [1, 2, 3, 4];

  const handleCellClick = (ref: string) => {
    if (readOnly) return;
    sound.play('tap');
    if (onSelectCell) {
      onSelectCell(ref);
    }
  };

  const activeValue = data[selectedCell] ?? '';

  return (
    <div className="w-full bg-gv-surface border border-gv-border rounded-xl overflow-hidden shadow-xl">
      {/* Excel Formula Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gv-surface-high border-b border-gv-border text-xs font-mono">
        <div className="w-12 text-center py-0.5 bg-gv-surface rounded border border-gv-border font-bold text-gv-accent">
          {selectedCell}
        </div>
        <div className="text-gv-muted font-bold select-none">fx</div>
        <div className="flex-1 px-2 py-0.5 bg-gv-surface rounded border border-gv-border text-gv-text truncate">
          {targetFormula ? targetFormula : activeValue}
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs md:text-sm">
          <thead>
            <tr className="bg-gv-surface-high text-gv-muted select-none">
              <th className="w-10 p-1.5 border-r border-b border-gv-border text-center font-normal text-gv-faint">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="p-1.5 border-r border-b border-gv-border text-center font-semibold text-gv-muted min-w-[70px]"
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
                <td className="w-10 p-1.5 border-r border-b border-gv-border text-center bg-gv-surface-high text-gv-muted select-none font-medium">
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
                      className={`relative p-2 border-r border-b border-gv-border transition-colors cursor-pointer select-none text-right font-medium ${
                        isSelected
                          ? 'bg-gv-primary-soft/40 outline-2 -outline-offset-2 outline-gv-primary'
                          : isHighlighted
                          ? 'bg-gv-info-soft/30 text-gv-info'
                          : 'hover:bg-gv-surface-high/60 text-gv-text'
                      }`}
                    >
                      <span className="truncate block">{val}</span>

                      {/* Green Excel Fill Handle indicator on selected cell */}
                      {isSelected && (
                        <div className="absolute bottom-[-3px] right-[-3px] w-2 h-2 bg-gv-accent border border-gv-primary-dark z-10" />
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
