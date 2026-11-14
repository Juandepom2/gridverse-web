import React, { useState } from 'react';
import {
  Heart,
  Shield,
  Sparkles,
  CheckCircle2,
  Zap,
  Award,
  Infinity as InfinityIcon,
  RefreshCw,
} from 'lucide-react';
import { UserStats, SupportedLocale } from '../../types';
import { sound } from '../../lib/audio';
import { auth, db, verifyAndSyncProAndLegacyProfile } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ShopTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onUpdateStats: (newStats: UserStats) => void;
}

export const ShopTab: React.FC<ShopTabProps> = ({ stats, locale, onUpdateStats }) => {
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const handleRefillLives = () => {
    if (stats.isPro) return;
    if (stats.gems < 20) {
      alert(
        locale === 'es'
          ? 'No tienes suficientes gemas (necesitas 20).'
          : 'Not enough gems (need 20).'
      );
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
      alert(
        locale === 'es'
          ? 'No tienes suficientes gemas (necesitas 30).'
          : 'Not enough gems (need 30).'
      );
      return;
    }
    sound.play('coin');
    onUpdateStats({
      ...stats,
      gems: stats.gems - 30,
    });
    alert(
      locale === 'es'
        ? '¡Escudo de Racha activado para tu próximo descanso!'
        : 'Streak freeze shield active!'
    );
  };

  const handleRestorePurchases = async () => {
    sound.play('tap');
    const user = auth.currentUser;
    if (!user) {
      setRestoreMessage(
        locale === 'es'
          ? 'Inicia sesión con tu cuenta de Google o Apple en la pestaña Perfil para restaurar tu plan PRO.'
          : 'Sign in with Google or Apple in the Profile tab to restore your PRO plan.'
      );
      return;
    }

    setRestoring(true);
    setRestoreMessage(null);
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      const data = snap.exists() ? snap.data() : undefined;
      const result = await verifyAndSyncProAndLegacyProfile(user, data);
      if (result.isPro) {
        sound.play('coin');
        onUpdateStats({
          ...stats,
          isPro: true,
          subscriptionPlan: result.planName || 'lifetime',
          lives: 5,
        });
        setRestoreMessage(
          locale === 'es'
            ? '¡Tu suscripción Gridverse PRO ha sido verificada y activada!'
            : 'Your Gridverse PRO subscription is verified and active!'
        );
      } else {
        setRestoreMessage(
          locale === 'es'
            ? 'No se encontraron compras PRO activas asociadas a esta cuenta.'
            : 'No active PRO purchases found for this account.'
        );
      }
    } catch {
      setRestoreMessage(
        locale === 'es'
          ? 'Error al verificar suscripción. Intenta nuevamente.'
          : 'Error verifying subscription. Please try again.'
      );
    } finally {
      setRestoring(false);
    }
  };

  const planBadgeLabel = () => {
    const p = (stats.subscriptionPlan || 'lifetime').toLowerCase();
    if (p.includes('lifetime')) {
      return locale === 'es' ? 'PRO DE POR VIDA' : 'LIFETIME PRO';
    }
    if (p.includes('annual')) {
      return locale === 'es' ? 'PLAN ANUAL PRO' : 'ANNUAL PRO';
    }
    if (p.includes('monthly')) {
      return locale === 'es' ? 'PLAN MENSUAL PRO' : 'MONTHLY PRO';
    }
    if (p.includes('duo')) {
      return locale === 'es' ? 'PLAN DÚO PRO' : 'DUO PRO';
    }
    return locale === 'es' ? 'PRO ACTIVO' : 'PRO ACTIVE';
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 px-4">
      {/* Header */}
      <div className="border-b border-gv-border pb-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gv-text flex items-center gap-2.5">
            {stats.isPro
              ? locale === 'es'
                ? 'Tu Membresía PRO'
                : 'Your PRO Membership'
              : locale === 'es'
              ? 'Tienda y Planes PRO'
              : 'Shop & PRO Plans'}
          </h1>
          <p className="text-xs text-gv-muted mt-1">
            {stats.isPro
              ? locale === 'es'
                ? 'Tienes acceso total sin límites a todas las herramientas, cursos y vidas infinitas.'
                : 'You have full unlimited access to all tools, courses, and infinite lives.'
              : locale === 'es'
              ? 'Canjea tus gemas ganadas o sincroniza tu suscripción PRO de la app móvil.'
              : 'Redeem your earned gems or sync your mobile app PRO subscription.'}
          </p>
        </div>

        <button
          onClick={handleRestorePurchases}
          disabled={restoring}
          className="px-3.5 py-2 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-xs font-bold text-gv-text flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gv-primary ${restoring ? 'animate-spin' : ''}`} />
          {locale === 'es' ? 'Restaurar / Sincronizar Compras' : 'Restore / Sync Purchases'}
        </button>
      </div>

      {restoreMessage && (
        <div className="px-4 py-3 rounded-xl bg-gv-primary-soft border border-gv-primary/40 text-xs font-bold text-gv-accent">
          {restoreMessage}
        </div>
      )}

      {/* PRO HUB VIEW (Matching Flutter shop_screen.dart _buildProHubView when stats.isPro is true) */}
      {stats.isPro ? (
        <div className="flex flex-col gap-5">
          {/* 1. VIP Active Status Card */}
          <div className="bg-gradient-to-br from-gv-surface via-gv-surface-high to-gv-primary/15 border-[1.5px] border-gv-primary/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gv-primary text-black text-[11px] font-black uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{planBadgeLabel()}</span>
              </div>
              <Award className="w-7 h-7 text-gv-warning" />
            </div>

            <h2 className="text-xl font-black text-gv-text tracking-tight">
              {locale === 'es' ? 'Gridverse PRO Activo' : 'Gridverse PRO Active'}
            </h2>
            <p className="text-xs md:text-sm text-gv-muted mt-1 leading-relaxed">
              {locale === 'es'
                ? 'Tu plan comprado en la app está sincronizado con tu cuenta web. Practica con vidas ilimitadas y acceso total a los 12 módulos.'
                : 'Your mobile plan is synced with your web account. Practice with unlimited lives and full access to all 12 modules.'}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gv-surface border border-gv-border text-xs font-bold text-gv-text">
                <InfinityIcon className="w-4 h-4 text-gv-accent" />
                {locale === 'es' ? 'Vidas Ilimitadas' : 'Unlimited Lives'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gv-surface border border-gv-border text-xs font-bold text-gv-text">
                <Zap className="w-4 h-4 text-gv-warning" />
                {locale === 'es' ? 'Acceso Total (+12 Cursos)' : 'Full Access (+12 Courses)'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gv-surface border border-gv-border text-xs font-bold text-gv-text">
                <Award className="w-4 h-4 text-gv-primary" />
                {locale === 'es' ? 'Certificado PRO' : 'PRO Certificate'}
              </span>
            </div>
          </div>

          {/* 2. Superpoderes Desbloqueados */}
          <div className="bg-gv-surface border border-gv-border rounded-2xl divide-y divide-gv-border">
            <div className="p-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gv-integrity/15 border border-gv-integrity/30 flex items-center justify-center text-gv-integrity shrink-0">
                <Heart className="w-5 h-5 fill-gv-integrity" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gv-text">
                  {locale === 'es' ? 'Vidas Ilimitadas (∞)' : 'Unlimited Lives (∞)'}
                </h3>
                <p className="text-xs text-gv-muted mt-0.5">
                  {locale === 'es'
                    ? 'Practica sin interrupciones ni esperas de 45 minutos al cometer errores.'
                    : 'Practice without interruptions or 45-minute waits on mistakes.'}
                </p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gv-warning/15 border border-gv-warning/30 flex items-center justify-center text-gv-warning shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gv-text">
                  {locale === 'es'
                    ? 'Acceso Total a Módulos y Fórmulas'
                    : 'Full Access to Modules & Formulas'}
                </h3>
                <p className="text-xs text-gv-muted mt-0.5">
                  {locale === 'es'
                    ? 'Las 12 columnas del mapa, misiones reales de práctica y bóveda de fórmulas desbloqueadas.'
                    : 'All 12 map columns, real-world practice missions, and formula vault unlocked.'}
                </p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gv-primary-soft border border-gv-primary/30 flex items-center justify-center text-gv-primary shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gv-text">
                  {locale === 'es' ? 'Certificado Oficial PRO' : 'Official PRO Certificate'}
                </h3>
                <p className="text-xs text-gv-muted mt-0.5">
                  {locale === 'es'
                    ? 'Acredita tu dominio de hojas de cálculo con tu certificado oficial de Gridverse.'
                    : 'Verify your spreadsheet mastery with your official Gridverse certificate.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Non-Pro Banner */
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
                {locale === 'es'
                  ? 'Vidas ilimitadas, todos los niveles de fórmulas avanzadas y certificados descargables. Si ya compraste PRO en móvil, inicia sesión con tu cuenta para sincronizarlo automáticamente.'
                  : 'Unlimited lives, all advanced formula levels, and downloadable certificates. Sign in with your mobile account to sync automatically.'}
              </p>
            </div>
          </div>
          <a
            href="https://gridverse.app#download"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black text-xs font-black uppercase tracking-wider shrink-0 shadow-lg shadow-gv-primary/20 transition-all"
          >
            {locale === 'es' ? 'Obtener en la App' : 'Get in App'}
          </a>
        </div>
      )}

      {/* Gem Power-ups */}
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
                {stats.isPro
                  ? locale === 'es'
                    ? 'Con tu plan Gridverse PRO ya tienes Vidas Ilimitadas (∞) activas para siempre.'
                    : 'With your Gridverse PRO plan you already have Unlimited Lives (∞) active.'
                  : locale === 'es'
                  ? 'Restaura tus 5 vidas completas al instante para seguir aprendiendo sin pausas.'
                  : 'Instantly restore all 5 lives to keep learning without waiting.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gv-border">
            <span className="text-xs font-bold text-gv-bytes flex items-center gap-1">
              {stats.isPro ? '∞ PRO' : '20 Gemas 💎'}
            </span>
            <button
              onClick={handleRefillLives}
              disabled={stats.isPro || stats.lives >= stats.maxLives}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                stats.isPro || stats.lives >= stats.maxLives
                  ? 'bg-gv-surface-high text-gv-muted border border-gv-border cursor-not-allowed'
                  : 'bg-gv-primary hover:bg-gv-accent text-black font-black'
              }`}
            >
              {stats.isPro
                ? locale === 'es'
                  ? 'Ilimitadas ∞'
                  : 'Unlimited ∞'
                : stats.lives >= stats.maxLives
                ? locale === 'es'
                  ? 'Lleno'
                  : 'Full'
                : locale === 'es'
                ? 'Comprar'
                : 'Buy'}
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
    </div>
  );
};
