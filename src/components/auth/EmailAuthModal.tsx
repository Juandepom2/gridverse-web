import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, X, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { SupportedLocale } from '../../types';
import { tr } from '../../lib/i18n';
import { sound } from '../../lib/audio';
import {
  signInWithEmail,
  signUpWithEmail,
  resetPasswordWithEmail,
  signInWithGooglePopup,
} from '../../lib/firebase';

interface EmailAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: SupportedLocale;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
  allowGoogle?: boolean;
}

export const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
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

export const EmailAuthModal: React.FC<EmailAuthModalProps> = ({
  isOpen,
  onClose,
  locale,
  initialMode = 'signin',
  onSuccess,
  title,
  subtitle,
  allowGoogle = true,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const getFriendlyErrorMessage = (code?: string): string => {
    switch (code) {
      case 'auth/invalid-email':
        return tr(locale, {
          es: 'Ingresa un correo electrónico válido.',
          en: 'Enter a valid email address.',
          de: 'Gib eine gültige E-Mail-Adresse ein.',
          fr: 'Saisis une adresse e-mail valide.',
          ja: '有効なメールアドレスを入力してください。',
          pt: 'Insira um e-mail válido.',
        });
      case 'auth/user-not-found':
        return tr(locale, {
          es: 'No encontramos ninguna cuenta con este correo.',
          en: 'No account found with this email.',
          de: 'Kein Konto mit dieser E-Mail gefunden.',
          fr: 'Aucun compte trouvé avec cet e-mail.',
          ja: 'このメールアドレスのアカウントは見つかりませんでした。',
          pt: 'Nenhuma conta encontrada com este e-mail.',
        });
      case 'auth/wrong-password':
      case 'auth/invalid-login-credentials':
      case 'auth/invalid-credential':
        return tr(locale, {
          es: 'Correo o contraseña incorrectos.',
          en: 'Incorrect email or password.',
          de: 'Falsche E-Mail-Adresse oder Passwort.',
          fr: 'E-mail ou mot de passe incorrect.',
          ja: 'メールアドレスまたはパスワードが正しくありません。',
          pt: 'E-mail ou senha incorretos.',
        });
      case 'auth/email-already-in-use':
        return tr(locale, {
          es: 'Este correo ya está registrado. Inicia sesión en su lugar.',
          en: 'This email is already registered. Please sign in instead.',
          de: 'Diese E-Mail ist bereits registriert. Bitte melde dich an.',
          fr: 'Cet e-mail est déjà utilisé. Connecte-toi à la place.',
          ja: 'このメールアドレスは既に登録されています。ログインしてください。',
          pt: 'Este e-mail já está em uso. Faça login em vez disso.',
        });
      case 'auth/weak-password':
        return tr(locale, {
          es: 'La contraseña debe tener al menos 6 caracteres.',
          en: 'Password must be at least 6 characters.',
          de: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
          fr: 'Le mot de passe doit comporter au moins 6 caractères.',
          ja: 'パスワードは6文字以上である必要があります。',
          pt: 'A senha deve ter pelo menos 6 caracteres.',
        });
      case 'auth/too-many-requests':
        return tr(locale, {
          es: 'Demasiados intentos fallidos. Intenta más tarde.',
          en: 'Too many failed attempts. Please try again later.',
          de: 'Zu viele Fehlversuche. Bitte später versuchen.',
          fr: 'Trop de tentatives échouées. Réessaie plus tard.',
          ja: '試行回数が多すぎます。後でもう一度お試しください。',
          pt: 'Muitas tentativas falhas. Tente novamente mais tarde.',
        });
      default:
        return tr(locale, {
          es: 'Ocurrió un error. Verifica tus datos e intenta nuevamente.',
          en: 'An error occurred. Check your details and try again.',
          de: 'Ein Fehler ist aufgetreten. Bitte überprüfe deine Daten.',
          fr: 'Une erreur est survenue. Vérifie tes informations et réessaie.',
          ja: 'エラーが発生しました。入力内容を確認してください。',
          pt: 'Ocorreu um erro. Verifique seus dados e tente novamente.',
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg(
        tr(locale, {
          es: 'Ingresa tu correo electrónico.',
          en: 'Enter your email address.',
          de: 'Gib deine E-Mail-Adresse ein.',
          fr: 'Saisis ton e-mail.',
          ja: 'メールアドレスを入力してください。',
          pt: 'Insira seu e-mail.',
        })
      );
      return;
    }

    if (mode === 'forgot') {
      sound.play('tap');
      setLoading(true);
      try {
        await resetPasswordWithEmail(cleanEmail);
        sound.play('correct');
        setSuccessNotice(
          tr(locale, {
            es: '¡Listo! Si el correo existe, enviamos un enlace para restablecer tu contraseña.',
            en: 'Done! If the email exists, we sent a password reset link.',
            de: 'Erledigt! Wir haben einen Link zum Zurücksetzen gesendet.',
            fr: 'C’est fait ! Un lien de réinitialisation a été envoyé.',
            ja: 'リセット用のリンクを送信しました。メールをご確認ください。',
            pt: 'Pronto! Enviamos um link para redefinir sua senha.',
          })
        );
      } catch (err: any) {
        setErrorMsg(getFriendlyErrorMessage(err?.code));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg(
        tr(locale, {
          es: 'Ingresa tu contraseña.',
          en: 'Enter your password.',
          de: 'Gib dein Passwort ein.',
          fr: 'Saisis ton mot de passe.',
          ja: 'パスワードを入力してください。',
          pt: 'Insira sua senha.',
        })
      );
      return;
    }

    sound.play('tap');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(cleanEmail, password);
      } else {
        await signUpWithEmail(cleanEmail, password, displayName);
      }
      sound.play('coin');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      sound.play('wrong');
      setErrorMsg(getFriendlyErrorMessage(err?.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    sound.play('tap');
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGooglePopup();
      sound.play('coin');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setErrorMsg(getFriendlyErrorMessage(err?.code));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gv-surface border-2 border-gv-primary rounded-2xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl relative">
        <button
          type="button"
          onClick={() => {
            sound.play('tap');
            onClose();
          }}
          className="absolute top-4 right-4 text-gv-muted hover:text-gv-text cursor-pointer p-1 rounded-lg transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gv-primary/15 border border-gv-primary/30 flex items-center justify-center text-gv-accent mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-gv-text">
            {title ||
              (mode === 'signin'
                ? tr(locale, {
                    es: 'Iniciar sesión con Correo',
                    en: 'Sign in with Email',
                    de: 'Mit E-Mail anmelden',
                    fr: 'Se connecter par e-mail',
                    ja: 'メールでログイン',
                    pt: 'Entrar com E-mail',
                  })
                : mode === 'signup'
                ? tr(locale, {
                    es: 'Crear cuenta con Correo',
                    en: 'Create account with Email',
                    de: 'Konto mit E-Mail erstellen',
                    fr: 'Créer un compte par e-mail',
                    ja: 'メールでアカウント作成',
                    pt: 'Criar conta com E-mail',
                  })
                : tr(locale, {
                    es: 'Recuperar contraseña',
                    en: 'Reset password',
                    de: 'Passwort zurücksetzen',
                    fr: 'Réinitialiser le mot de passe',
                    ja: 'パスワードを再設定',
                    pt: 'Recuperar senha',
                  }))}
          </h3>
          <p className="text-xs text-gv-muted mt-1 leading-relaxed">
            {subtitle ||
              (mode === 'forgot'
                ? tr(locale, {
                    es: 'Ingresa tu correo para recibir un enlace seguro de recuperación.',
                    en: 'Enter your email to receive a secure recovery link.',
                    de: 'Gib deine E-Mail ein, um einen Wiederherstellungslink zu erhalten.',
                    fr: 'Saisis ton e-mail pour recevoir un lien de réinitialisation.',
                    ja: '再設定リンクを受け取るメールアドレスを入力してください。',
                    pt: 'Insira seu e-mail para receber um link de recuperação.',
                  })
                : tr(locale, {
                    es: 'Sincroniza tus vidas, racha, progreso y membresía PRO en todos tus dispositivos.',
                    en: 'Sync your lives, streak, progress, and PRO membership across all devices.',
                    de: 'Synchronisiere Leben, Serie, Fortschritt und PRO auf allen Geräten.',
                    fr: 'Synchronise tes vies, ta série, tes progrès et ton PRO sur tous tes appareils.',
                    ja: '全デバイス間でライフ、連続日数、進捗、PROプランを同期。',
                    pt: 'Sincronize vidas, ofensiva, progresso e PRO em todos os dispositivos.',
                  }))}
          </p>
        </div>

        {/* Mode Switch Tabs (Sign in / Sign up) */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-gv-surface-high rounded-xl border border-gv-border text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setMode('signin');
                setErrorMsg(null);
                setSuccessNotice(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-gv-primary text-black font-black shadow-sm'
                  : 'text-gv-muted hover:text-gv-text'
              }`}
            >
              {tr(locale, {
                es: 'Iniciar sesión',
                en: 'Sign in',
                de: 'Anmelden',
                fr: 'Connexion',
                ja: 'ログイン',
                pt: 'Entrar',
              })}
            </button>
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setMode('signup');
                setErrorMsg(null);
                setSuccessNotice(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-gv-primary text-black font-black shadow-sm'
                  : 'text-gv-muted hover:text-gv-text'
              }`}
            >
              {tr(locale, {
                es: 'Registrarse',
                en: 'Sign up',
                de: 'Registrieren',
                fr: 'S’inscrire',
                ja: '新規登録',
                pt: 'Cadastrar',
              })}
            </button>
          </div>
        )}

        {/* Status / Error Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gv-integrity/15 border border-gv-integrity/40 text-xs text-gv-integrity font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gv-accent/15 border border-gv-accent/40 text-xs text-gv-accent font-medium">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gv-muted uppercase tracking-wider">
                {tr(locale, {
                  es: 'Tu Nombre (opcional)',
                  en: 'Your Name (optional)',
                  de: 'Dein Name (optional)',
                  fr: 'Ton nom (optionnel)',
                  ja: 'お名前（任意）',
                  pt: 'Seu Nome (opcional)',
                })}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gv-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex"
                  maxLength={25}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gv-surface-high border border-gv-border text-xs text-gv-text placeholder:text-gv-muted focus:outline-none focus:border-gv-primary transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gv-muted uppercase tracking-wider">
              {tr(locale, {
                es: 'Correo electrónico',
                en: 'Email address',
                de: 'E-Mail-Adresse',
                fr: 'Adresse e-mail',
                ja: 'メールアドレス',
                pt: 'E-mail',
              })}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gv-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gv-surface-high border border-gv-border text-xs text-gv-text placeholder:text-gv-muted focus:outline-none focus:border-gv-primary transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gv-muted uppercase tracking-wider">
                  {tr(locale, {
                    es: 'Contraseña',
                    en: 'Password',
                    de: 'Passwort',
                    fr: 'Mot de passe',
                    ja: 'パスワード',
                    pt: 'Senha',
                  })}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.play('tap');
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessNotice(null);
                    }}
                    className="text-[11px] text-gv-accent hover:underline cursor-pointer"
                  >
                    {tr(locale, {
                      es: '¿La olvidaste?',
                      en: 'Forgot password?',
                      de: 'Vergessen?',
                      fr: 'Oublié ?',
                      ja: 'お忘れですか？',
                      pt: 'Esqueceu?',
                    })}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gv-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gv-surface-high border border-gv-border text-xs text-gv-text placeholder:text-gv-muted focus:outline-none focus:border-gv-primary transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-md"
          >
            <span>
              {loading
                ? '...'
                : mode === 'signin'
                ? tr(locale, {
                    es: 'Iniciar Sesión',
                    en: 'Sign In',
                    de: 'Anmelden',
                    fr: 'Connexion',
                    ja: 'ログイン',
                    pt: 'Entrar',
                  })
                : mode === 'signup'
                ? tr(locale, {
                    es: 'Crear Mi Cuenta Gratis',
                    en: 'Create My Free Account',
                    de: 'Kostenloses Konto erstellen',
                    fr: 'Créer mon compte gratuit',
                    ja: '無料アカウントを作成',
                    pt: 'Criar Minha Conta Grátis',
                  })
                : tr(locale, {
                    es: 'Enviar Enlace de Recuperación',
                    en: 'Send Recovery Link',
                    de: 'Wiederherstellungslink senden',
                    fr: 'Envoyer le lien de réinitialisation',
                    ja: '再設定リンクを送信',
                    pt: 'Enviar Link de Recuperação',
                  })}
            </span>
          </button>
        </form>

        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => {
              sound.play('tap');
              setMode('signin');
              setErrorMsg(null);
            }}
            className="text-xs text-gv-muted hover:text-gv-text flex items-center justify-center gap-1.5 cursor-pointer py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {tr(locale, {
                es: 'Volver a Iniciar sesión',
                en: 'Back to Sign in',
                de: 'Zurück zur Anmeldung',
                fr: 'Retour à la connexion',
                ja: 'ログインに戻る',
                pt: 'Voltar ao login',
              })}
            </span>
          </button>
        )}

        {allowGoogle && (
          <div className="pt-2 border-t border-gv-border flex flex-col gap-2">
            <div className="text-[10px] text-center font-bold text-gv-muted uppercase tracking-wider">
              {tr(locale, {
                es: 'O continúa con un clic',
                en: 'Or continue with one click',
                de: 'Oder mit einem Klick fortfahren',
                fr: 'Ou continue en un clic',
                ja: 'またはワンクリックで続行',
                pt: 'Ou continue com um clique',
              })}
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>
                {tr(locale, {
                  es: 'Continuar con Google',
                  en: 'Continue with Google',
                  de: 'Weiter mit Google',
                  fr: 'Continuer avec Google',
                  ja: 'Googleで続行',
                  pt: 'Continuar com Google',
                })}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
