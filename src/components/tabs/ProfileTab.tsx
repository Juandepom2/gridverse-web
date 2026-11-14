import React, { useState, useEffect } from 'react';
import { User, Trophy, Flame, Zap, Award, CheckCircle, LogIn, LogOut } from 'lucide-react';
import { UserStats, SupportedLocale } from '../../types';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { CeldiMascot } from '../CeldiMascot';

interface ProfileTabProps {
  stats: UserStats;
  locale: SupportedLocale;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ stats, locale }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      console.warn('Google sign-in error:', e);
      alert(e?.message || 'Error al iniciar sesión con Google');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const completedCount = Object.keys(stats.completedLevels).length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 px-4">
      {/* Profile Header Card */}
      <div className="bg-gv-surface border border-gv-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <CeldiMascot mood="happy" size={76} />
          <div>
            <h1 className="text-xl font-black text-gv-text">
              {currentUser?.displayName || (locale === 'es' ? 'Maestro de Celdas' : 'Cell Master')}
            </h1>
            <p className="text-xs text-gv-muted font-mono mt-0.5">
              {currentUser?.email || (locale === 'es' ? 'Modo Invitado (Progreso Guardado en Local)' : 'Guest Mode (Saved locally)')}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gv-primary-soft text-gv-accent border border-gv-primary/30 uppercase">
                Rango: Analista Junior
              </span>
            </div>
          </div>
        </div>

        {/* Auth Button */}
        <div>
          {currentUser ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-gv-surface-high border border-gv-border text-gv-muted hover:text-gv-text text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              {locale === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
            </button>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="px-4 py-2.5 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4 text-gv-primary" />
              {locale === 'es' ? 'Vincular Google' : 'Sync with Google'}
            </button>
          )}
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
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
            <span>Racha Actual</span>
          </div>
          <p className="text-xl font-black text-gv-text font-mono">{stats.streak} días</p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gv-muted font-medium">
            <CheckCircle className="w-4 h-4 text-gv-accent" />
            <span>Lecciones</span>
          </div>
          <p className="text-xl font-black text-gv-text font-mono">{completedCount}</p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gv-muted font-medium">
            <Award className="w-4 h-4 text-gv-boss" />
            <span>Nivel Dominado</span>
          </div>
          <p className="text-xl font-black text-gv-text font-mono">{stats.unlockedLevel}</p>
        </div>
      </div>

      {/* Certificate / Achievement Banner */}
      <div className="bg-gv-surface border border-gv-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gv-primary-soft border border-gv-primary/30 flex items-center justify-center text-gv-accent shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gv-text">
              {locale === 'es' ? 'Certificado de Excel & Hojas de Cálculo' : 'Spreadsheet Mastery Certificate'}
            </h3>
            <p className="text-xs text-gv-muted">
              {locale === 'es'
                ? 'Completa los 3 primeros módulos para desbloquear tu certificado oficial de Gridverse.'
                : 'Complete the first 3 modules to unlock your verified Gridverse certificate.'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-gv-faint px-3 py-1.5 rounded-lg bg-gv-surface-high border border-gv-border shrink-0">
          {completedCount}/15 lecciones
        </span>
      </div>
    </div>
  );
};
