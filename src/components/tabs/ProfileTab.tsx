import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Award,
  CheckCircle,
  LogOut,
  CheckCircle2,
  Link2,
  Star,
  Gem,
} from 'lucide-react';
import { UserStats, SupportedLocale } from '../../types';
import {
  auth,
  signInWithGooglePopup,
  signInWithApplePopup,
  linkAccountWithApple,
  linkAccountWithGoogle,
} from '../../lib/firebase';
import {
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { CeldiMascot } from '../CeldiMascot';
import { sound } from '../../lib/audio';

interface ProfileTabProps {
  stats: UserStats;
  locale: SupportedLocale;
}

const AppleLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const ProfileTab: React.FC<ProfileTabProps> = ({ stats, locale }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(() => auth.currentUser);
  const [authNotice, setAuthNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  const linkedProviders = (currentUser?.providerData || []).map((p) => p.providerId);
  const hasGoogleLinked = linkedProviders.includes('google.com');
  const hasAppleLinked = linkedProviders.includes('apple.com');

  const handleGoogleSignIn = async () => {
    sound.play('tap');
    setLoadingAuth(true);
    setAuthNotice(null);
    try {
      await signInWithGooglePopup();
      sound.play('correct');
      setAuthNotice({
        type: 'ok',
        text:
          locale === 'es'
            ? 'Sesión iniciada con Google. Tu progreso y plan PRO se han sincronizado.'
            : 'Signed in with Google. Your progress and PRO plan are synced.',
      });
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.warn('Google sign-in error:', e);
      setAuthNotice({
        type: 'err',
        text: e?.message || 'Error al iniciar sesión con Google',
      });
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleAppleSignIn = async () => {
    sound.play('tap');
    setLoadingAuth(true);
    setAuthNotice(null);
    try {
      await signInWithApplePopup();
      sound.play('correct');
      setAuthNotice({
        type: 'ok',
        text:
          locale === 'es'
            ? 'Sesión iniciada con Apple. Tu progreso y plan PRO se han sincronizado.'
            : 'Signed in with Apple. Your progress and PRO plan are synced.',
      });
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.warn('Apple sign-in error:', e);
      setAuthNotice({
        type: 'err',
        text:
          e?.code === 'auth/operation-not-allowed'
            ? 'Apple Sign-In requiere configuración de dominio web en Firebase Auth.'
            : e?.message || 'Error al iniciar sesión con Apple',
      });
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLinkApple = async () => {
    sound.play('tap');
    setLoadingAuth(true);
    setAuthNotice(null);
    try {
      const res = await linkAccountWithApple();
      setCurrentUser(res.user);
      sound.play('correct');
      setAuthNotice({
        type: 'ok',
        text:
          locale === 'es'
            ? '¡Cuenta de Apple vinculada exitosamente a tu perfil!'
            : 'Apple account successfully linked to your profile!',
      });
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (e?.code === 'auth/credential-already-in-use') {
        // The Apple ID already has an existing Firebase user; sign in with that credential or inform user
        const cred = OAuthProvider.credentialFromError(e);
        if (cred) {
          await signInWithCredential(auth, cred);
          sound.play('correct');
          setAuthNotice({
            type: 'ok',
            text:
              locale === 'es'
                ? 'Conectado a tu cuenta de Apple existente con tu progreso sincronizado.'
                : 'Connected to your existing Apple account with synced progress.',
          });
          return;
        }
      }
      setAuthNotice({
        type: 'err',
        text: e?.message || 'No se pudo vincular con Apple.',
      });
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLinkGoogle = async () => {
    sound.play('tap');
    setLoadingAuth(true);
    setAuthNotice(null);
    try {
      const res = await linkAccountWithGoogle();
      setCurrentUser(res.user);
      sound.play('correct');
      setAuthNotice({
        type: 'ok',
        text:
          locale === 'es'
            ? '¡Cuenta de Google vinculada exitosamente a tu perfil!'
            : 'Google account successfully linked to your profile!',
      });
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (e?.code === 'auth/credential-already-in-use') {
        const cred = OAuthProvider.credentialFromError(e);
        if (cred) {
          await signInWithCredential(auth, cred);
          sound.play('correct');
          setAuthNotice({
            type: 'ok',
            text:
              locale === 'es'
                ? 'Conectado a tu cuenta de Google existente con tu progreso sincronizado.'
                : 'Connected to your existing Google account with synced progress.',
          });
          return;
        }
      }
      setAuthNotice({
        type: 'err',
        text: e?.message || 'No se pudo vincular con Google.',
      });
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    sound.play('tap');
    await signOut(auth);
    setAuthNotice(null);
  };

  const completedCount = Object.keys(stats.completedLevels).length;
  const totalStars = Object.values(stats.completedLevels).reduce(
    (sum, item) => sum + (typeof item === 'number' ? item : item?.stars ?? 0),
    0
  );

  const rankTitle =
    stats.xp >= 5000
      ? locale === 'es'
        ? 'Maestro de Datos'
        : 'Data Master'
      : stats.xp >= 2500
      ? locale === 'es'
        ? 'Ninja de Fórmulas'
        : 'Formula Ninja'
      : stats.xp >= 1000
      ? locale === 'es'
        ? 'Analista'
        : 'Analyst'
      : locale === 'es'
      ? 'Becario'
      : 'Intern';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 px-4">
      {/* Profile Header Card */}
      <div className="bg-gv-surface border border-gv-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          {stats.photoUrl && stats.photoUrl.startsWith('http') ? (
            <img
              src={stats.photoUrl}
              alt={stats.displayName || 'Avatar'}
              className="w-[74px] h-[74px] rounded-[22px] border-2 border-gv-primary object-cover shadow-lg"
            />
          ) : (
            <CeldiMascot mood="happy" size={74} />
          )}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <h1 className="text-xl font-black text-gv-text">
                {stats.displayName ||
                  currentUser?.displayName ||
                  (locale === 'es' ? 'Maestro de Celdas' : 'Cell Master')}
              </h1>
              {stats.isPro && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gv-primary text-black text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                  PRO ACTIVO
                </span>
              )}
            </div>
            <p className="text-xs text-gv-muted font-mono mt-0.5">
              {currentUser?.email ||
                (locale === 'es'
                  ? 'Modo Invitado (Inicia sesión para sincronizar con tu móvil)'
                  : 'Guest Mode (Sign in to sync with mobile)')}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 flex-wrap">
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded bg-gv-primary-soft text-gv-primary border border-gv-primary/35 uppercase">
                {rankTitle}
              </span>
              {hasGoogleLinked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-gv-surface-high border border-gv-border text-gv-muted">
                  <GoogleLogo className="w-3 h-3" /> Google
                </span>
              )}
              {hasAppleLinked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-gv-surface-high border border-gv-border text-gv-muted">
                  <AppleLogo className="w-3 h-3" /> Apple
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Auth & Account Linking Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto justify-center">
          {currentUser ? (
            <>
              {!hasAppleLinked && (
                <button
                  onClick={handleLinkApple}
                  disabled={loadingAuth}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
                >
                  <AppleLogo className="w-4 h-4" />
                  <span>{locale === 'es' ? 'Vincular con Apple' : 'Link with Apple'}</span>
                </button>
              )}
              {!hasGoogleLinked && (
                <button
                  onClick={handleLinkGoogle}
                  disabled={loadingAuth}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <GoogleLogo className="w-4 h-4" />
                  <span>{locale === 'es' ? 'Vincular con Google' : 'Link with Google'}</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gv-surface-high border border-gv-border text-gv-muted hover:text-gv-text text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                {locale === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
              </button>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleAppleSignIn}
                disabled={loadingAuth}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <AppleLogo className="w-4 h-4" />
                {locale === 'es' ? 'Continuar con Apple' : 'Continue with Apple'}
              </button>
              <button
                onClick={handleGoogleSignIn}
                disabled={loadingAuth}
                className="px-4 py-2.5 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <GoogleLogo className="w-4 h-4" />
                {locale === 'es' ? 'Continuar con Google' : 'Continue with Google'}
              </button>
            </div>
          )}
        </div>
      </div>

      {authNotice && (
        <div
          className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            authNotice.type === 'ok'
              ? 'bg-gv-primary-soft border-gv-primary/40 text-gv-accent'
              : 'bg-gv-error/10 border-gv-error/40 text-gv-error'
          }`}
        >
          <Link2 className="w-4 h-4 shrink-0" />
          <span>{authNotice.text}</span>
        </div>
      )}

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        <div className="bg-gv-surface border border-gv-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gv-muted font-medium">
            <Trophy className="w-4 h-4 text-gv-warning" />
            <span>XP Total</span>
          </div>
          <p className="text-xl font-black text-gv-text font-mono">{stats.xp}</p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gv-muted font-medium">
            <Flame className="w-4 h-4 text-gv-streak" />
            <span>{locale === 'es' ? 'Racha Actual' : 'Current Streak'}</span>
          </div>
          <p className="text-xl font-black text-gv-text font-mono">
            {stats.streak} {locale === 'es' ? 'días' : 'days'}
          </p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gv-muted font-medium">
            <CheckCircle className="w-4 h-4 text-gv-accent" />
            <span>{locale === 'es' ? 'Celdas Superadas' : 'Cells Completed'}</span>
          </div>
          <p className="text-xl font-black text-gv-text font-mono">{completedCount}</p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gv-muted font-medium">
            <Star className="w-4 h-4 text-gv-warning" />
            <span>{locale === 'es' ? 'Estrellas' : 'Stars'}</span>
          </div>
          <p className="text-xl font-black text-gv-text font-mono">{totalStars}</p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-xl p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-gv-muted font-medium">
            <Gem className="w-4 h-4 text-gv-bytes" />
            <span>{locale === 'es' ? 'Celda Activa' : 'Active Cell'}</span>
          </div>
          <p className="text-xl font-black text-gv-primary font-mono">{stats.unlockedLevel}</p>
        </div>
      </div>

      {/* Certificate / Achievement Banner */}
      <div className="bg-gv-surface border border-gv-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gv-primary-soft border border-gv-primary/30 flex items-center justify-center text-gv-accent shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gv-text flex items-center gap-2">
              <span>
                {locale === 'es'
                  ? 'Certificado Oficial de Dominio en Excel'
                  : 'Official Spreadsheet Mastery Certificate'}
              </span>
              {stats.isPro && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-gv-primary/20 text-gv-accent border border-gv-primary/30 font-mono">
                  PRO HABILITADO
                </span>
              )}
            </h3>
            <p className="text-xs text-gv-muted">
              {locale === 'es'
                ? 'Completa los módulos del mapa para desbloquear y descargar tu certificado oficial de Gridverse.'
                : 'Complete the map modules to unlock and download your verified Gridverse certificate.'}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-gv-accent px-3 py-1.5 rounded-lg bg-gv-surface-high border border-gv-border shrink-0">
          {completedCount}/101 {locale === 'es' ? 'celdas' : 'cells'}
        </span>
      </div>
    </div>
  );
};
