import React, { useState, useEffect } from 'react';
import {
  Heart,
  Flame,
  Gem,
  Volume2,
  VolumeX,
  Music,
  Globe,
  ExternalLink,
  Infinity as InfinityIcon,
  Clock,
  X,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import { UserStats, SupportedLocale } from '../types';
import { sound } from '../lib/audio';
import { getStreakTier } from '../lib/storage';
import { CeldiMascot } from './CeldiMascot';
import { tr, UI_STRINGS } from '../lib/i18n';

interface HeaderProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  nextLifeFormatted?: string | null;
  showLivesModal?: boolean;
  onToggleLivesModal?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onUpdateStats,
  onChangeTab,
  nextLifeFormatted,
  showLivesModal = false,
  onToggleLivesModal,
}) => {
  const [bgmActive, setBgmActive] = useState(sound.isBgmEnabled());
  const [localLivesModal, setLocalLivesModal] = useState(false);

  const isLivesModalOpen = showLivesModal || localLivesModal;
  const setLivesModalOpen = (open: boolean) => {
    setLocalLivesModal(open);
    if (onToggleLivesModal) onToggleLivesModal(open);
  };

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

  const currentTheme = stats.theme || 'dark';
  const toggleTheme = () => {
    const next = currentTheme === 'light' ? 'dark' : 'light';
    sound.play('tap');
    onUpdateStats({ ...stats, theme: next });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value as SupportedLocale;
    try {
      localStorage.setItem('gridverse_locale_user_set', 'true');
    } catch {}
    onUpdateStats({ ...stats, locale });
  };

  const handleRefillWithGems = () => {
    if (stats.isPro || stats.lives >= 5) return;
    if (stats.gems < 20) {
      setLivesModalOpen(false);
      onChangeTab('shop');
      return;
    }
    sound.play('coin');
    localStorage.removeItem('gridverse_next_life_at');
    onUpdateStats({
      ...stats,
      lives: 5,
      gems: stats.gems - 20,
    });
    setLivesModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-gv-surface/95 backdrop-blur-md border-b border-gv-border px-2 sm:px-4 py-1.5 sm:py-2.5 overflow-x-clip">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1 sm:gap-3 min-w-0">
          {/* Brand / Logo */}
          <div
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer shrink-0 min-w-0"
            onClick={() => onChangeTab('map')}
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gv-surface-high border border-gv-border flex items-center justify-center p-1 shadow-inner shrink-0">
              <img src="/logo.png" alt="Gridverse" className="w-5 h-5 sm:w-7 sm:h-7 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-black tracking-tight text-xs sm:text-base md:text-lg text-gv-text hidden min-[390px]:inline">
                  GRIDVERSE
                </span>
                {stats.isPro ? (
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-gv-primary text-black">
                    PRO
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-gv-primary-soft text-gv-accent border border-gv-primary/30 hidden md:inline">
                    Web
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gv-muted hidden lg:block truncate">
                {tr(stats.locale, UI_STRINGS.header.subtitle)}
              </p>
            </div>
          </div>

          {/* HUD Game Stats */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Streak 🔥 (Compounding Tier + Active Shields) */}
            {(() => {
              const tier = getStreakTier(stats.streak, stats.locale);
              const freezes = stats.streakFreezes ?? 0;
              return (
                <div
                  onClick={() => {
                    sound.play('tap');
                    onChangeTab('shop');
                  }}
                  className={`flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border text-[11px] sm:text-xs md:text-sm font-mono font-bold cursor-pointer transition-colors ${tier.badgeBgClass} ${tier.colorClass}`}
                  title={`${tier.label} · ${stats.streak}d${freezes > 0 ? ` · 🛡️ ${freezes}` : ''}`}
                >
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 fill-current animate-pulse-subtle shrink-0" />
                  <span className="tabular-nums">{stats.streak}</span>
                  {freezes > 0 && (
                    <span className="text-[9px] sm:text-[10px] text-gv-bytes font-black ml-0.5 hidden sm:inline">
                      🛡️{freezes}
                    </span>
                  )}
                </div>
              );
            })()}

            {/* Gems 💎 */}
            <div
              className="flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gv-bytes/10 border border-gv-bytes/25 text-[11px] sm:text-xs md:text-sm font-mono font-bold text-gv-bytes cursor-pointer hover:bg-gv-bytes/15 transition-colors"
              title={tr(stats.locale, {
                es: 'Gemas / Puntos ganados',
                en: 'Gems / Points earned',
                de: 'Edelsteine / Punkte',
                fr: 'Gemmes / Points gagnés',
                ja: '獲得ジェム・ポイント',
                pt: 'Gemas / Pontos ganhos',
              })}
              onClick={() => onChangeTab('shop')}
            >
              <Gem className="w-3 h-3 sm:w-4 sm:h-4 text-gv-bytes fill-gv-bytes/20 shrink-0" />
              <span className="tabular-nums">{stats.gems}</span>
            </div>

            {/* Lives ❤️ or PRO ∞ (matching Flutter StatChip & NoLivesDialog) */}
            {stats.isPro ? (
              <div
                className="flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gv-primary-soft border border-gv-primary/40 text-[11px] sm:text-xs md:text-sm font-mono font-extrabold text-gv-accent cursor-pointer hover:bg-gv-primary/20 transition-colors"
                title={tr(stats.locale, {
                  es: 'Gridverse PRO: Vidas Ilimitadas',
                  en: 'Gridverse PRO: Unlimited Lives',
                  de: 'Gridverse PRO: Unbegrenzte Leben',
                  fr: 'Gridverse PRO : Vies Illimitées',
                  ja: 'Gridverse PRO: ライフ無制限',
                  pt: 'Gridverse PRO: Vidas Ilimitadas',
                })}
                onClick={() => onChangeTab('shop')}
              >
                <InfinityIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gv-accent stroke-[2.5] shrink-0" />
                <span className="hidden sm:inline">PRO</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setLivesModalOpen(true);
                }}
                className="flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gv-integrity/10 border border-gv-integrity/25 text-[11px] sm:text-xs md:text-sm font-mono font-bold text-gv-integrity cursor-pointer hover:bg-gv-integrity/15 transition-colors"
                title={tr(stats.locale, {
                  es: 'Ver estado y regeneración de vidas',
                  en: 'View lives status and refill',
                  de: 'Leben-Status & Auffüllung ansehen',
                  fr: 'Voir l’état et la recharge des vies',
                  ja: 'ライフの状態と回復時間を確認',
                  pt: 'Ver status e recarga de vidas',
                })}
              >
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-gv-integrity text-gv-integrity shrink-0" />
                <span className="tabular-nums">{stats.lives}</span>
                {stats.lives < 5 && nextLifeFormatted && (
                  <span className="text-[10px] text-gv-warning font-mono pl-0.5 hidden md:inline">
                    ({nextLifeFormatted})
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Controls: Audio, Music BGM, Locale & Landing Link */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Background Music (BGM) Looping Toggle 🎵 */}
            <button
              onClick={toggleBgm}
              className={`p-1 sm:p-1.5 rounded-lg border text-xs font-semibold hidden sm:flex items-center gap-1 transition-colors cursor-pointer ${
                bgmActive
                  ? 'bg-gv-primary-soft border-gv-primary text-gv-accent animate-pulse-subtle'
                  : 'bg-gv-surface-high border-gv-border text-gv-muted hover:text-gv-text'
              }`}
              title={
                bgmActive
                  ? tr(stats.locale, {
                      es: 'Música de fondo activa',
                      en: 'Background music active',
                      de: 'Hintergrundmusik aktiv',
                      fr: 'Musique de fond active',
                      ja: 'BGM再生中',
                      pt: 'Música de fundo ativa',
                    })
                  : tr(stats.locale, {
                      es: 'Activar música de fondo',
                      en: 'Turn on background music',
                      de: 'Hintergrundmusik aktivieren',
                      fr: 'Activer la musique de fond',
                      ja: 'BGMをオンにする',
                      pt: 'Ativar música de fundo',
                    })
              }
            >
              <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] hidden lg:inline font-mono">BGM</span>
            </button>

            {/* Sound FX Mute Toggle */}
            <button
              onClick={toggleSound}
              className="p-1 sm:p-1.5 rounded-lg bg-gv-surface-high border border-gv-border text-gv-muted hover:text-gv-text hover:bg-gv-surface-higher transition-colors cursor-pointer"
              title={
                stats.soundEnabled
                  ? tr(stats.locale, {
                      es: 'Silenciar efectos SFX',
                      en: 'Mute sound effects',
                      de: 'Soundeffekte stummschalten',
                      fr: 'Couper les effets sonores',
                      ja: '効果音をミュート',
                      pt: 'Silenciar efeitos sonoros',
                    })
                  : tr(stats.locale, {
                      es: 'Activar efectos SFX',
                      en: 'Enable sound effects',
                      de: 'Soundeffekte aktivieren',
                      fr: 'Activer les effets sonores',
                      ja: '効果音を有効化',
                      pt: 'Ativar efeitos sonoros',
                    })
              }
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* Theme Toggle (Modo Claro / Modo Oscuro) ☀️🌙 */}
            <button
              onClick={toggleTheme}
              className="p-1 sm:p-1.5 rounded-lg bg-gv-surface-high border border-gv-border text-gv-muted hover:text-gv-text hover:bg-gv-surface-higher transition-colors cursor-pointer"
              title={
                currentTheme === 'light'
                  ? tr(stats.locale, {
                      es: 'Cambiar a modo oscuro',
                      en: 'Switch to dark mode',
                      de: 'Zu Dunkelmodus wechseln',
                      fr: 'Passer en mode sombre',
                      ja: 'ダークモードに切り替え',
                      pt: 'Mudar para modo escuro',
                    })
                  : tr(stats.locale, {
                      es: 'Cambiar a modo claro',
                      en: 'Switch to light mode',
                      de: 'Zu Hellmodus wechseln',
                      fr: 'Passer en mode clair',
                      ja: 'ライトモードに切り替え',
                      pt: 'Mudar para modo claro',
                    })
              }
              aria-label={
                currentTheme === 'light'
                  ? tr(stats.locale, {
                      es: 'Activar modo oscuro',
                      en: 'Enable dark mode',
                      de: 'Dunkelmodus aktivieren',
                      fr: 'Activer le mode sombre',
                      ja: 'ダークモードを有効化',
                      pt: 'Ativar modo escuro',
                    })
                  : tr(stats.locale, {
                      es: 'Activar modo claro',
                      en: 'Enable light mode',
                      de: 'Hellmodus aktivieren',
                      fr: 'Activer le mode clair',
                      ja: 'ライトモードを有効化',
                      pt: 'Ativar modo claro',
                    })
              }
            >
              {currentTheme === 'light' ? (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gv-primary" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gv-warning" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gv-muted absolute left-1.5 sm:left-2 pointer-events-none hidden sm:block" />
              <select
                value={stats.locale}
                onChange={handleLanguageChange}
                aria-label="Language"
                className="bg-gv-surface-high border border-gv-border text-gv-text text-[10px] sm:text-xs font-bold rounded-lg px-1.5 sm:pl-7 sm:pr-2 py-1 sm:py-1.5 cursor-pointer hover:bg-gv-surface-higher transition-colors focus:outline-none focus:border-gv-primary"
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
              title={tr(stats.locale, {
                es: 'Ir a la Landing Page oficial',
                en: 'Go to official Landing Page',
                de: 'Zur offiziellen Website',
                fr: 'Aller sur la page officielle',
                ja: '公式サイトへ移動',
                pt: 'Ir para a Landing Page oficial',
              })}
            >
              Landing <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* NoLivesDialog Modal (matching mobile no_lives_dialog.dart) */}
      {isLivesModalOpen && !stats.isPro && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLivesModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gv-muted">
                {tr(stats.locale, UI_STRINGS.header.energySystem)}
              </span>
              <button
                type="button"
                onClick={() => setLivesModalOpen(false)}
                className="p-1 rounded-lg text-gv-muted hover:text-gv-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CeldiMascot mood={stats.lives <= 0 ? 'sad' : 'thinking'} size={84} />

            <div>
              <h3 className="text-xl font-black text-gv-text">
                {stats.lives <= 0
                  ? tr(stats.locale, UI_STRINGS.header.outOfLivesTitle)
                  : tr(stats.locale, UI_STRINGS.header.playerLivesTitle)}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {stats.lives <= 0
                  ? tr(stats.locale, UI_STRINGS.header.outOfLivesDesc)
                  : tr(stats.locale, UI_STRINGS.header.playerLivesDesc)}
              </p>
            </div>

            {/* 5 Visual Hearts */}
            <div className="flex items-center justify-center gap-2.5 py-1">
              {[0, 1, 2, 3, 4].map((idx) => {
                const filled = idx < stats.lives;
                return (
                  <Heart
                    key={idx}
                    className={`w-7 h-7 transition-transform ${
                      filled
                        ? 'fill-gv-integrity text-gv-integrity scale-105'
                        : 'text-gv-border fill-gv-bg'
                    }`}
                  />
                );
              })}
            </div>

            {/* Countdown Timer Card */}
            {stats.lives >= 5 ? (
              <div className="w-full py-2.5 px-4 rounded-xl bg-gv-primary-soft border border-gv-primary/40 flex items-center justify-center gap-2 text-xs font-bold text-gv-accent">
                <CheckCircle2 className="w-4 h-4" />
                <span>5/5</span>
              </div>
            ) : (
              <div className="w-full py-3 px-4 rounded-xl bg-gv-surface-high border border-gv-border flex items-center justify-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-gv-warning" />
                <span className="text-gv-muted font-semibold">
                  {tr(stats.locale, UI_STRINGS.header.nextLifeIn)}
                </span>
                <span className="font-mono font-extrabold text-sm text-gv-warning">
                  {nextLifeFormatted || '20:00'}
                </span>
              </div>
            )}

            {/* Gem balance */}
            <div className="px-3.5 py-1.5 rounded-xl bg-gv-bytes/10 border border-gv-bytes/25 flex items-center gap-1.5 font-mono text-xs font-bold text-gv-bytes">
              <Gem className="w-4 h-4" />
              <span>
                {tr(stats.locale, UI_STRINGS.header.yourGems)} {stats.gems}
              </span>
            </div>

            {/* CTAs */}
            <div className="w-full flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLivesModalOpen(false);
                  onChangeTab('shop');
                }}
                className="w-full py-3 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-gv-primary/20"
              >
                <InfinityIcon className="w-4 h-4 stroke-[2.5]" />
                <span>{tr(stats.locale, UI_STRINGS.header.unlockInfiniteLives)}</span>
              </button>

              {stats.lives < 5 && (
                <button
                  type="button"
                  onClick={handleRefillWithGems}
                  className="w-full py-3 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-bytes/40 text-gv-bytes font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {stats.gems >= 20
                      ? tr(stats.locale, UI_STRINGS.header.refillLivesBtn)
                      : tr(stats.locale, UI_STRINGS.header.notEnoughGems)}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
