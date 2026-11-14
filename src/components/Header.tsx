import React, { useState, useEffect } from 'react';
import { Heart, Flame, Gem, Volume2, VolumeX, Music, Globe, ExternalLink, Infinity as InfinityIcon } from 'lucide-react';
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
  onChangeTab,
}) => {
  const [bgmActive, setBgmActive] = useState(sound.isBgmEnabled());

  useEffect(() => {
    return sound.subscribe(() => {
      setBgmActive(sound.isBgmEnabled());
    });
  }, []);

  const toggleSound = () => {
    const next = !stats.soundEnabled;
    sound.setSfxEnabled(next);
    onUpdateStats({ ...stats, soundEnabled: next });
    if (next) sound.play('tap');
  };

  const toggleBgm = () => {
    const next = !bgmActive;
    sound.setBgmEnabled(next);
    setBgmActive(next);
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
              {stats.isPro ? (
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-gv-primary text-black">
                  PRO
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gv-primary-soft text-gv-accent border border-gv-primary/30">
                  Web
                </span>
              )}
            </div>
            <p className="text-[10px] text-gv-muted hidden sm:block">Aprende Excel jugando celda a celda</p>
          </div>
        </div>

        {/* HUD Game Stats */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Streak 🔥 */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gv-streak/10 border border-gv-streak/25 text-xs md:text-sm font-mono font-bold text-gv-streak cursor-pointer hover:bg-gv-streak/15 transition-colors"
            title="Racha de días consecutivos"
          >
            <Flame className="w-4 h-4 fill-gv-streak text-gv-streak animate-pulse-subtle" />
            <span className="tabular-nums">{stats.streak}</span>
          </div>

          {/* Gems 💎 */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gv-bytes/10 border border-gv-bytes/25 text-xs md:text-sm font-mono font-bold text-gv-bytes cursor-pointer hover:bg-gv-bytes/15 transition-colors"
            title="Gemas / Puntos ganados"
            onClick={() => onChangeTab('shop')}
          >
            <Gem className="w-4 h-4 text-gv-bytes fill-gv-bytes/20" />
            <span className="tabular-nums">{stats.gems}</span>
          </div>

          {/* Lives ❤️ or PRO ∞ (matching Flutter StatChip in stat_chip.dart) */}
          {stats.isPro ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gv-primary-soft border border-gv-primary/40 text-xs md:text-sm font-mono font-extrabold text-gv-accent cursor-pointer hover:bg-gv-primary/20 transition-colors"
              title="Gridverse PRO: Vidas Ilimitadas"
              onClick={() => onChangeTab('shop')}
            >
              <InfinityIcon className="w-4 h-4 text-gv-accent stroke-[2.5]" />
              <span>PRO</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gv-integrity/10 border border-gv-integrity/25 text-xs md:text-sm font-mono font-bold text-gv-integrity cursor-pointer hover:bg-gv-integrity/15 transition-colors"
              title="Vidas restantes para lecciones"
              onClick={() => onChangeTab('shop')}
            >
              <Heart className="w-4 h-4 fill-gv-integrity text-gv-integrity" />
              <span className="tabular-nums">{stats.lives}</span>
            </div>
          )}
        </div>

        {/* Controls: Audio, Music BGM, Locale & Landing Link */}
        <div className="flex items-center gap-2">
          {/* Background Music (BGM) Looping Toggle 🎵 */}
          <button
            onClick={toggleBgm}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              bgmActive
                ? 'bg-gv-primary-soft border-gv-primary text-gv-accent animate-pulse-subtle'
                : 'bg-gv-surface-high border-gv-border text-gv-muted hover:text-gv-text'
            }`}
            title={bgmActive ? 'Música de fondo activa (bgm_chill.wav)' : 'Activar música de fondo'}
          >
            <Music className="w-4 h-4" />
            <span className="text-[10px] hidden lg:inline font-mono">BGM</span>
          </button>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-gv-surface-high border border-gv-border text-gv-muted hover:text-gv-text hover:bg-gv-surface-higher transition-colors cursor-pointer"
            title={stats.soundEnabled ? 'Silenciar efectos SFX' : 'Activar efectos SFX'}
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
