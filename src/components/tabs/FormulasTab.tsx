import React, { useState } from 'react';
import { Search, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { FORMULAS_DATA, FormulaDoc } from '../../data/formulasData';
import { SupportedLocale } from '../../types';
import { sound } from '../../lib/audio';

interface FormulasTabProps {
  locale: SupportedLocale;
}

export const FormulasTab: React.FC<FormulasTabProps> = ({ locale }) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = FORMULAS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = search.toLowerCase();
    const localizedName = (item.nameByLocale[locale] || item.nameEn).toLowerCase();
    const localizedDesc = (item.descriptionByLocale[locale] || '').toLowerCase();
    const matchesSearch =
      localizedName.includes(q) ||
      item.nameEn.toLowerCase().includes(q) ||
      localizedDesc.includes(q) ||
      item.tags.some((t) => t.includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (formula: FormulaDoc) => {
    navigator.clipboard.writeText(formula.exampleFormula);
    sound.play('tap');
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gv-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gv-primary" />
            <h1 className="text-xl md:text-2xl font-black text-gv-text">
              {locale === 'es' ? 'Diccionario de Fórmulas' : 'Formula Dictionary'}
            </h1>
          </div>
          <p className="text-xs text-gv-muted mt-1">
            {locale === 'es'
              ? 'Sintaxis localizada exacta, mejores prácticas y ejemplos copiables al portapapeles.'
              : 'Exact localized syntax, best practices, and 1-click copy-paste examples.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gv-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={locale === 'es' ? 'Buscar BUSCARX, SUMA...' : 'Search XLOOKUP, SUM...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gv-surface border border-gv-border rounded-xl text-xs md:text-sm text-gv-text placeholder:text-gv-faint focus:outline-none focus:border-gv-primary transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: locale === 'es' ? 'Todas' : 'All' },
          { id: 'lookup', label: locale === 'es' ? 'Búsqueda' : 'Lookup' },
          { id: 'math', label: locale === 'es' ? 'Matemáticas' : 'Math' },
          { id: 'logical', label: locale === 'es' ? 'Lógica' : 'Logical' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-gv-primary text-black border-gv-primary font-bold'
                : 'bg-gv-surface border-gv-border text-gv-muted hover:text-gv-text hover:bg-gv-surface-high'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Formula Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => {
          const name = item.nameByLocale[locale] || item.nameEn;
          const desc = item.descriptionByLocale[locale] || item.descriptionByLocale.es;
          const syntax = item.syntaxByLocale[locale] || item.syntaxByLocale.es;
          const proTip = item.proTipByLocale[locale] || item.proTipByLocale.es;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-gv-surface border border-gv-border rounded-xl p-5 flex flex-col gap-3 shadow-md hover:border-gv-border/80 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-black text-gv-accent font-mono">
                      {name}
                    </h3>
                    {name !== item.nameEn && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-gv-surface-high text-gv-muted border border-gv-border font-mono">
                        EN: {item.nameEn}
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-gv-muted mt-1 leading-relaxed">{desc}</p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(item)}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                    isCopied
                      ? 'bg-gv-primary-soft border-gv-primary text-gv-accent'
                      : 'bg-gv-surface-high border-gv-border text-gv-text hover:bg-gv-surface-higher'
                  }`}
                  title="Copiar fórmula de ejemplo"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">
                    {isCopied ? (locale === 'es' ? '¡Copiado!' : 'Copied!') : (locale === 'es' ? 'Copiar' : 'Copy')}
                  </span>
                </button>
              </div>

              {/* Syntax Code block */}
              <div className="bg-gv-bg border border-gv-border rounded-lg p-2.5 font-mono text-xs text-gv-accent overflow-x-auto">
                {syntax}
              </div>

              {/* Example Formula */}
              <div className="flex items-center justify-between text-xs bg-gv-surface-high/60 rounded-lg px-3 py-2 border border-gv-border/60">
                <span className="text-gv-muted font-medium">Ejemplo:</span>
                <span className="font-mono text-gv-text font-bold">{item.exampleFormula}</span>
              </div>

              {/* Pro Tip */}
              {proTip && (
                <div className="flex items-start gap-2 text-xs text-gv-muted bg-gv-primary-soft/30 border border-gv-primary/20 rounded-lg p-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-gv-primary shrink-0 mt-0.5" />
                  <p className="leading-relaxed"><strong className="text-gv-accent">Pro Tip:</strong> {proTip}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
