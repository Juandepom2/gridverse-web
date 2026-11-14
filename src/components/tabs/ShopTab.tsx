import React from 'react';
import { Heart, Flame, Shield, Check, Sparkles } from 'lucide-react';
import { UserStats, SupportedLocale } from '../../types';
import { sound } from '../../lib/audio';

interface ShopTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onUpdateStats: (newStats: UserStats) => void;
}

export const ShopTab: React.FC<ShopTabProps> = ({ stats, locale, onUpdateStats }) => {
  const handleRefillLives = () => {
    if (stats.gems < 20) {
      alert(locale === 'es' ? 'No tienes suficientes gemas (necesitas 20).' : 'Not enough gems (need 20).');
      return;
    }
    sound.play('coin');
    onUpdateStats({
      ...stats,
      lives: stats.maxLives,
      gems: stats.gems - 20,
    });
  };

  const handleBuyStreakFreeze = () => {
    if (stats.gems < 30) {
      alert(locale === 'es' ? 'No tienes suficientes gemas (necesitas 30).' : 'Not enough gems (need 30).');
      return;
    }
    sound.play('coin');
    onUpdateStats({
      ...stats,
      gems: stats.gems - 30,
    });
    alert(locale === 'es' ? '¡Escudo de Racha activado para tu próximo descanso!' : 'Streak freeze shield active!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 px-4">
      <div className="border-b border-gv-border pb-4">
        <h1 className="text-xl md:text-2xl font-black text-gv-text">
          {locale === 'es' ? 'Tienda de Gridverse' : 'Gridverse Shop'}
        </h1>
        <p className="text-xs text-gv-muted mt-1">
          {locale === 'es'
            ? 'Canjea tus gemas ganadas por recargas de vidas, protecciones de racha y potenciadores.'
            : 'Redeem your earned gems for life refills, streak shields and learning boosts.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recargar Vidas */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gv-integrity/15 border border-gv-integrity/30 flex items-center justify-center text-gv-integrity shrink-0">
              <Heart className="w-6 h-6 fill-gv-integrity text-gv-integrity" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gv-text">
                {locale === 'es' ? 'Recargar Vidas' : 'Refill Lives'}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {locale === 'es'
                  ? 'Restaura tus 5 vidas completas al instante para seguir aprendiendo sin pausas.'
                  : 'Instantly restore all 5 lives to keep learning without waiting.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gv-border">
            <span className="text-xs font-bold text-gv-bytes flex items-center gap-1">
              20 Gemas 💎
            </span>
            <button
              onClick={handleRefillLives}
              disabled={stats.lives >= stats.maxLives}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                stats.lives >= stats.maxLives
                  ? 'bg-gv-surface-high text-gv-muted border border-gv-border cursor-not-allowed'
                  : 'bg-gv-primary hover:bg-gv-accent text-black font-black'
              }`}
            >
              {stats.lives >= stats.maxLives
                ? locale === 'es' ? 'Lleno' : 'Full'
                : locale === 'es' ? 'Comprar' : 'Buy'}
            </button>
          </div>
        </div>

        {/* Escudo de Racha */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gv-streak/15 border border-gv-streak/30 flex items-center justify-center text-gv-streak shrink-0">
              <Shield className="w-6 h-6 text-gv-streak" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gv-text">
                {locale === 'es' ? 'Congelador de Racha' : 'Streak Freeze'}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {locale === 'es'
                  ? 'Protege tu racha de días consecutivos si un día no puedes practicar.'
                  : 'Protects your consecutive day streak if you miss a day.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gv-border">
            <span className="text-xs font-bold text-gv-bytes flex items-center gap-1">
              30 Gemas 💎
            </span>
            <button
              onClick={handleBuyStreakFreeze}
              className="px-4 py-2 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text text-xs font-bold transition-all cursor-pointer"
            >
              {locale === 'es' ? 'Equipar' : 'Equip'}
            </button>
          </div>
        </div>
      </div>

      {/* Pro Banner */}
      <div className="bg-gradient-to-r from-gv-surface-high via-gv-surface to-gv-surface-high border border-gv-accent/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gv-primary/20 border border-gv-accent flex items-center justify-center text-gv-accent shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gv-text flex items-center gap-2">
              <span>Gridverse PRO</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gv-accent text-black font-black uppercase">
                Premium
              </span>
            </h3>
            <p className="text-xs text-gv-muted mt-0.5">
              Vidas ilimitadas, todos los niveles de fórmulas avanzadas y certificados descargables.
            </p>
          </div>
        </div>
        <a
          href="https://gridverse.app#download"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black text-xs font-black uppercase tracking-wider shrink-0 shadow-lg shadow-gv-primary/20 transition-all"
        >
          {locale === 'es' ? 'Ver en la App' : 'View in App'}
        </a>
      </div>
    </div>
  );
};
