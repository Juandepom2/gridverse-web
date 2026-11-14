import React, { useState, useEffect } from 'react';
import {
  Heart,
  Shield,
  Sparkles,
  CheckCircle2,
  Zap,
  Award,
  Infinity as InfinityIcon,
  RefreshCw,
  Users,
  User,
  Check,
  X,
  Mail,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import { UserStats, SupportedLocale } from '../../types';
import { sound } from '../../lib/audio';
import { auth, db, verifyAndSyncProAndLegacyProfile } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ShopTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onUpdateStats: (newStats: UserStats) => void;
}

export const ShopTab: React.FC<ShopTabProps> = ({ stats, locale, onUpdateStats }) => {
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  // Plan Comparison & Category Selector (matching Flutter shop_screen.dart)
  const [isViewingOtherPlans, setIsViewingOtherPlans] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'individual' | 'duo'>('individual');
  const [selectedTier, setSelectedTier] = useState<'annual' | 'monthly' | 'lifetime'>('annual');

  // Duo Partner Email management (synced to Firestore users/{uid}.duoPartnerEmail)
  const [duoEmail, setDuoEmail] = useState('');
  const [savingDuo, setSavingDuo] = useState(false);
  const [duoStatusMsg, setDuoStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadDuo = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const d = snap.data();
          if (typeof d.duoPartnerEmail === 'string') {
            setDuoEmail(d.duoPartnerEmail);
          }
        }
      } catch {
        // ignore
      }
    };
    loadDuo();
  }, []);

  const handleSaveDuoPartner = async () => {
    const clean = duoEmail.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
      setDuoStatusMsg(
        locale === 'es'
          ? 'Ingresa un correo electrónico válido para tu compañero Dúo.'
          : 'Enter a valid email address for your Duo partner.'
      );
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      setDuoStatusMsg(
        locale === 'es'
          ? 'Inicia sesión en la pestaña Perfil para vincular a tu compañero Dúo.'
          : 'Sign in on the Profile tab to link your Duo partner.'
      );
      return;
    }

    setSavingDuo(true);
    setDuoStatusMsg(null);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          duoPartnerEmail: clean,
          duoUpdatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      sound.play('coin');
      setDuoStatusMsg(
        locale === 'es'
          ? `¡Compañero Dúo (${clean}) vinculado y sincronizado en la nube!`
          : `Duo partner (${clean}) linked and synced to the cloud!`
      );
    } catch {
      setDuoStatusMsg(
        locale === 'es'
          ? 'No se pudo guardar el correo Dúo. Intenta nuevamente.'
          : 'Could not save Duo partner email. Try again.'
      );
    } finally {
      setSavingDuo(false);
    }
  };

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
    localStorage.removeItem('gridverse_next_life_at');
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
              ? 'Domina Excel y ahorra +4 horas cada semana con acceso ilimitado.'
              : 'Master Excel and save 4+ hours every week with unlimited access.'}
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

      {/* PRO HUB VIEW (when stats.isPro is true) */}
      {stats.isPro && (
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

          {/* 2. Compañero Dúo Management Card (matching Flutter duoPartnerEmail sync) */}
          <div className="bg-gv-surface border border-gv-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gv-primary/15 border border-gv-primary/30 flex items-center justify-center text-gv-accent">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gv-text">
                  {locale === 'es'
                    ? 'Invitado / Compañero Plan Dúo'
                    : 'Duo Plan Partner License'}
                </h3>
                <p className="text-xs text-gv-muted">
                  {locale === 'es'
                    ? 'Si tu plan es Dúo, vincula el correo de tu compañero para compartir beneficios PRO.'
                    : 'If you have a Duo plan, link your partner email to share PRO benefits.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gv-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={duoEmail}
                  onChange={(e) => setDuoEmail(e.target.value)}
                  placeholder="companero@correo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gv-bg border border-gv-border text-xs font-mono text-gv-text focus:outline-none focus:border-gv-primary"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveDuoPartner}
                disabled={savingDuo}
                className="px-4 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider cursor-pointer shrink-0"
              >
                {savingDuo
                  ? 'Guardando...'
                  : locale === 'es'
                  ? 'Vincular Compañero'
                  : 'Link Partner'}
              </button>
            </div>

            {duoStatusMsg && (
              <p className="text-xs font-semibold text-gv-accent">{duoStatusMsg}</p>
            )}
          </div>

          {/* Toggle to view all plans & comparison table */}
          <button
            type="button"
            onClick={() => {
              sound.play('tap');
              setIsViewingOtherPlans((prev) => !prev);
            }}
            className="self-center px-4 py-2 rounded-xl bg-gv-surface-high border border-gv-border text-xs font-bold text-gv-muted hover:text-gv-text flex items-center gap-1.5 cursor-pointer"
          >
            <span>
              {isViewingOtherPlans
                ? locale === 'es'
                  ? 'Ocultar comparativa y planes'
                  : 'Hide comparison & plans'
                : locale === 'es'
                ? 'Ver comparativa Gratis vs. PRO y todos los planes'
                : 'View Free vs. PRO comparison & all plans'}
            </span>
            {isViewingOtherPlans ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* PLANS & COMPARISON TABLE (Shown for Free users or when PRO clicks toggle) */}
      {(!stats.isPro || isViewingOtherPlans) && (
        <div className="flex flex-col gap-6">
          {/* Category Selector: Individual vs Dúo (2 personas) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gv-surface border border-gv-border rounded-2xl p-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-gv-primary">
                ELIGE TU MODALIDAD
              </span>
              <h2 className="text-base md:text-lg font-black text-gv-text">
                {selectedCategory === 'individual'
                  ? 'Plan Individual (1 cuenta)'
                  : 'Plan Dúo PRO (2 cuentas sincronizadas)'}
              </h2>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-gv-bg border border-gv-border">
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setSelectedCategory('individual');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedCategory === 'individual'
                    ? 'bg-gv-primary text-black shadow'
                    : 'text-gv-muted hover:text-gv-text'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Individual</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setSelectedCategory('duo');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedCategory === 'duo'
                    ? 'bg-gv-primary text-black shadow'
                    : 'text-gv-muted hover:text-gv-text'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Dúo (2 personas)</span>
              </button>
            </div>
          </div>

          {/* 3 Plan Tier Cards (Annual, Monthly, Lifetime) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan Anual */}
            <div
              onClick={() => {
                sound.play('tap');
                setSelectedTier('annual');
              }}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                selectedTier === 'annual'
                  ? 'bg-gv-primary-soft/40 border-gv-primary shadow-xl'
                  : 'bg-gv-surface border-gv-border hover:border-gv-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-gv-primary text-black font-mono text-[10px] font-black uppercase">
                  MÁS POPULAR · 7 DÍAS GRATIS
                </span>
                <Sparkles className="w-4 h-4 text-gv-accent" />
              </div>
              <div>
                <h3 className="text-base font-black text-gv-text">
                  {selectedCategory === 'duo' ? 'Anual Dúo' : 'Anual PRO'}
                </h3>
                <div className="text-2xl font-black text-gv-accent font-mono mt-1">
                  {selectedCategory === 'duo' ? '$54.99' : '$37.99'}
                  <span className="text-xs text-gv-muted font-normal"> / año</span>
                </div>
                <p className="text-[11px] text-gv-muted mt-1">
                  {selectedCategory === 'duo'
                    ? 'Solo $0.52/semana por persona · 2 cuentas PRO'
                    : 'Solo $0.73/semana · Menos que un café al mes'}
                </p>
              </div>
            </div>

            {/* Plan Mensual */}
            <div
              onClick={() => {
                sound.play('tap');
                setSelectedTier('monthly');
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                selectedTier === 'monthly'
                  ? 'bg-gv-primary-soft/40 border-gv-primary shadow-xl'
                  : 'bg-gv-surface border-gv-border hover:border-gv-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-gv-surface-higher border border-gv-border text-gv-muted font-mono text-[10px] font-bold uppercase">
                  FLEXIBLE MES A MES
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-gv-text">
                  {selectedCategory === 'duo' ? 'Mensual Dúo' : 'Mensual PRO'}
                </h3>
                <div className="text-2xl font-black text-gv-text font-mono mt-1">
                  {selectedCategory === 'duo' ? '$9.99' : '$6.99'}
                  <span className="text-xs text-gv-muted font-normal"> / mes</span>
                </div>
                <p className="text-[11px] text-gv-muted mt-1">
                  Sin plazos forzosos · Cancela cuando quieras
                </p>
              </div>
            </div>

            {/* Plan De Por Vida (Lifetime) */}
            <div
              onClick={() => {
                sound.play('tap');
                setSelectedTier('lifetime');
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                selectedTier === 'lifetime'
                  ? 'bg-gv-warning/15 border-gv-warning shadow-xl'
                  : 'bg-gv-surface border-gv-border hover:border-gv-warning/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-gv-warning text-black font-mono text-[10px] font-black uppercase">
                  PAGO ÚNICO DE POR VIDA
                </span>
                <Award className="w-4 h-4 text-gv-warning" />
              </div>
              <div>
                <h3 className="text-base font-black text-gv-text">
                  {selectedCategory === 'duo' ? 'De por vida Dúo' : 'De por vida PRO'}
                </h3>
                <div className="text-2xl font-black text-gv-warning font-mono mt-1">
                  {selectedCategory === 'duo' ? '$119.99' : '$79.99'}
                  <span className="text-xs text-gv-muted font-normal"> pago único</span>
                </div>
                <p className="text-[11px] text-gv-muted mt-1">
                  Acceso permanente para siempre sin renovaciones
                </p>
              </div>
            </div>
          </div>

          {/* Explicit Comparison Table: Gratis vs PRO (matching Flutter shop_screen.dart) */}
          <div className="bg-gv-surface border border-gv-border rounded-2xl overflow-hidden shadow-lg">
            <div className="px-5 py-3.5 bg-gv-surface-high border-b border-gv-border flex items-center justify-between">
              <span className="text-xs md:text-sm font-black text-gv-text">
                Comparativa: Plan Gratis vs. Gridverse PRO
              </span>
              <div className="flex items-center gap-1 text-gv-warning text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-gv-warning" />
                <span>4.9 Valoración de estudiantes</span>
              </div>
            </div>

            <div className="divide-y divide-gv-border text-xs">
              {[
                {
                  feature: 'Energía y Vidas de práctica',
                  free: '5 vidas (20m espera)',
                  pro: 'Infinitas (∞)',
                },
                {
                  feature: 'Ruta completa de 12 Columnas (36 niveles)',
                  free: 'Básico',
                  pro: 'Desbloqueo Total',
                },
                {
                  feature: 'Libros Multi-Hoja de Negocios Reales',
                  free: 'Curso 1',
                  pro: 'Todos los Cursos',
                },
                {
                  feature: 'Bóveda de 107 Fórmulas + 32 Atajos Win/Mac',
                  free: 'Incluido',
                  pro: 'Incluido + Retos',
                },
                {
                  feature: 'Certificado Oficial Verificable (PDF / LinkedIn)',
                  free: null,
                  pro: 'Incluido con ID único',
                },
                {
                  feature: 'Sincronización Nube Móvil (iOS/Android) + Web',
                  free: 'Incluido',
                  pro: 'Prioritaria + Dúo',
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center px-4 md:px-5 py-3 gap-2"
                >
                  <div className="col-span-6 font-semibold text-gv-text">{row.feature}</div>
                  <div className="col-span-3 text-center text-gv-muted font-mono text-[11px]">
                    {row.free ? (
                      row.free
                    ) : (
                      <X className="w-4 h-4 text-gv-muted/50 mx-auto" />
                    )}
                  </div>
                  <div className="col-span-3 text-center font-mono font-extrabold text-[11px] text-gv-accent flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5 text-gv-primary shrink-0" />
                    <span>{row.pro}</span>
                  </div>
                </div>
              ))}
            </div>

            {!stats.isPro && (
              <div className="p-4 bg-gv-surface-high border-t border-gv-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-gv-muted">
                  Adquiere tu plan desde la app móvil oficial y se activará automáticamente en Web.
                </p>
                <a
                  href="https://gridverse.app#download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-gv-primary/20"
                >
                  Activar en la App &gt;
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gem Power-ups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recargar Vidas */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gv-integrity/15 border border-gv-integrity/30 flex items-center justify-center text-gv-integrity shrink-0">
              <Heart className="w-6 h-6 fill-gv-integrity" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-gv-text">
                {locale === 'es' ? 'Recargar Vidas al Máximo' : 'Refill Max Lives'}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {stats.isPro
                  ? locale === 'es'
                    ? 'Ya cuentas con Vidas Ilimitadas gracias a tu suscripción PRO.'
                    : 'You already have Unlimited Lives with your PRO subscription.'
                  : locale === 'es'
                  ? 'Recupera tus 5 vidas inmediatamente para seguir resolviendo niveles sin esperar.'
                  : 'Restore all 5 lives immediately to keep solving levels without waiting.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gv-border">
            <span className="text-xs font-mono text-gv-muted">
              {stats.isPro ? 'Estado: ∞ Ilimitadas' : `Actual: ${stats.lives} / ${stats.maxLives}`}
            </span>
            <button
              onClick={handleRefillLives}
              disabled={stats.isPro || stats.lives >= stats.maxLives}
              className="px-4 py-2 rounded-xl bg-gv-bytes/15 hover:bg-gv-bytes/25 disabled:opacity-40 border border-gv-bytes/40 text-gv-bytes font-mono font-bold text-xs transition-all cursor-pointer"
            >
              {stats.isPro
                ? locale === 'es'
                  ? 'Incluido en PRO'
                  : 'Included in PRO'
                : stats.lives >= stats.maxLives
                ? locale === 'es'
                  ? 'Vidas llenas'
                  : 'Full Lives'
                : '💎 20 Gemas'}
            </button>
          </div>
        </div>

        {/* Protector de Racha */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gv-info/15 border border-gv-info/30 flex items-center justify-center text-gv-info shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-gv-text">
                {locale === 'es' ? 'Escudo Protector de Racha' : 'Streak Freeze Shield'}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {locale === 'es'
                  ? 'Protege tu racha de días consecutivos si olvidas practicar durante 24 horas.'
                  : 'Protect your daily streak if you miss practicing for 24 hours.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gv-border">
            <span className="text-xs font-mono text-gv-muted">Racha: 🔥 {stats.streak}d</span>
            <button
              onClick={handleBuyStreakFreeze}
              className="px-4 py-2 rounded-xl bg-gv-bytes/15 hover:bg-gv-bytes/25 border border-gv-bytes/40 text-gv-bytes font-mono font-bold text-xs transition-all cursor-pointer"
            >
              💎 30 Gemas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
