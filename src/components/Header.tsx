import React from 'react';
import { Heart, Flame, Gem, Volume2, VolumeX, Globe, ExternalLink } from 'lucide-react';
import { UserStats, SupportedLocale } from '../types';
import { sound } from '../lib/audio';

interface HeaderProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onUpdateStats,
  activeTab,
  onChangeTab,
}) => {
  const toggleSound = () => {
    const next = !stats.soundEnabled;
    sound.setEnabled(next);
    onUpdateStats({ ...stats, soundEnabled: next });
    if (next) sound.play('tap');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value as SupportedLocale;
    onUpdateStats({ ...stats, locale });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-gv-surface/90 backdrop-blur-md border-b border-gv-border px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChangeTab('map')}>
          <div className="w-9 h-9 rounded-xl bg-gv-surface-high border border-gv-border flex items-center justify-center p-1 shadow-inner">
            <img src="/logo.png" alt="Gridverse" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-base md:text-lg text-gv-text">
                GRIDVERSE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gv-primary-soft text-gv-accent border border-gv-primary/30">
                Web
              </span>
            </div>
            <p className="text-[10px] text-gv-muted hidden sm:block">Aprende Excel jugando celda a celda</p>
          </div>
        </div>

        {/* HUD Game Stats */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Lives ❤️ */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gv-surface-high border border-gv-border text-xs md:text-sm font-bold text-gv-integrity cursor-pointer hover:bg-gv-surface-higher transition-colors"
            title="Vidas restantes para lecciones"
            onClick={() => onChangeTab('shop')}
          >
            <Heart className="w-4 h-4 fill-gv-integrity text-gv-integrity" />
            <span className="tabular-nums">{stats.lives}</span>
          </div>

          {/* Streak 🔥 */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gv-surface-high border border-gv-border text-xs md:text-sm font-bold text-gv-streak cursor-pointer hover:bg-gv-surface-higher transition-colors"
            title="Racha de días consecutivos"
          >
            <Flame className="w-4 h-4 fill-gv-streak text-gv-streak animate-pulse-subtle" />
            <span className="tabular-nums">{stats.streak}</span>
          </div>

          {/* Gems 💎 */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gv-surface-high border border-gv-border text-xs md:text-sm font-bold text-gv-bytes cursor-pointer hover:bg-gv-surface-higher transition-colors"
            title="Gemas / Puntos ganados"
            onClick={() => onChangeTab('shop')}
          >
            <Gem className="w-4 h-4 text-gv-bytes fill-gv-bytes/20" />
            <span className="tabular-nums">{stats.gems}</span>
          </div>
        </div>

        {/* Controls: Audio, Locale & Landing Link */}
        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-gv-surface-high border border-gv-border text-gv-muted hover:text-gv-text hover:bg-gv-surface-higher transition-colors"
            title={stats.soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          >
            {stats.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-gv-muted absolute left-2 pointer-events-none" />
            <select
              value={stats.locale}
              onChange={handleLanguageChange}
              className="bg-gv-surface-high border border-gv-border text-gv-text text-xs font-semibold rounded-lg pl-7 pr-2 py-1.5 cursor-pointer hover:bg-gv-surface-higher transition-colors focus:outline-none focus:border-gv-primary"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
              <option value="de">DE</option>
              <option value="fr">FR</option>
              <option value="ja">JA</option>
              <option value="pt">PT</option>
            </select>
          </div>

          {/* Landing Link */}
          <a
            href="https://gridverse.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-xs font-medium text-gv-muted hover:text-gv-accent transition-colors ml-1"
            title="Ir a la Landing Page oficial"
          >
            Landing <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
