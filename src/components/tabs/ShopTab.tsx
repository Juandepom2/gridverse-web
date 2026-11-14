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
import { tr } from '../../lib/i18n';

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
        tr(locale, {
          es: 'Ingresa un correo electrónico válido para tu compañero Dúo.',
          en: 'Enter a valid email address for your Duo partner.',
          de: 'Gib eine gültige E-Mail-Adresse für deinen Duo-Partner ein.',
          fr: 'Saisis une adresse e-mail valide pour ton partenaire Duo.',
          ja: '有効なデュオパートナーのメールアドレスを入力してください。',
          pt: 'Insira um e-mail válido para seu parceiro Duo.',
        })
      );
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      setDuoStatusMsg(
        tr(locale, {
          es: 'Inicia sesión en la pestaña Perfil para vincular a tu compañero Dúo.',
          en: 'Sign in on the Profile tab to link your Duo partner.',
          de: 'Melde dich im Tab Profil an, um deinen Duo-Partner zu verknüpfen.',
          fr: 'Connecte-toi dans l’onglet Profil pour lier ton partenaire Duo.',
          ja: 'プロフィールタブでログインしてデュオパートナーを連携してください。',
          pt: 'Faça login na aba Perfil para vincular seu parceiro Duo.',
        })
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
        tr(locale, {
          es: `¡Compañero Dúo (${clean}) vinculado y sincronizado en la nube!`,
          en: `Duo partner (${clean}) linked and synced to the cloud!`,
          de: `Duo-Partner (${clean}) verknüpft und in der Cloud synchronisiert!`,
          fr: `Partenaire Duo (${clean}) lié et synchronisé dans le cloud !`,
          ja: `デュオパートナー（${clean}）をクラウドに連携しました！`,
          pt: `Parceiro Duo (${clean}) vinculado e sincronizado na nuvem!`,
        })
      );
    } catch {
      setDuoStatusMsg(
        tr(locale, {
          es: 'No se pudo guardar el correo Dúo. Intenta nuevamente.',
          en: 'Could not save Duo partner email. Try again.',
          de: 'Duo-E-Mail konnte nicht gespeichert werden. Bitte erneut versuchen.',
          fr: "Impossible d'enregistrer l'e-mail Duo. Réessaie.",
          ja: 'デュオメールを保存できませんでした。もう一度お試しください。',
          pt: 'Não foi possível salvar o e-mail Duo. Tente novamente.',
        })
      );
    } finally {
      setSavingDuo(false);
    }
  };

  const handleRefillLives = () => {
    if (stats.isPro) return;
    if (stats.gems < 20) {
      alert(
        tr(locale, {
          es: 'No tienes suficientes gemas (necesitas 20).',
          en: 'Not enough gems (need 20).',
          de: 'Nicht genug Edelsteine (20 benötigt).',
          fr: 'Pas assez de gemmes (20 requises).',
          ja: 'ジェムが不足しています（20ジェム必要）。',
          pt: 'Gemas insuficientes (necessário 20).',
        })
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
        tr(locale, {
          es: 'No tienes suficientes gemas (necesitas 30).',
          en: 'Not enough gems (need 30).',
          de: 'Nicht genug Edelsteine (30 benötigt).',
          fr: 'Pas assez de gemmes (30 requises).',
          ja: 'ジェムが不足しています（30ジェム必要）。',
          pt: 'Gemas insuficientes (necessário 30).',
        })
      );
      return;
    }
    sound.play('coin');
    onUpdateStats({
      ...stats,
      gems: stats.gems - 30,
    });
    alert(
      tr(locale, {
        es: '¡Escudo de Racha activado para tu próximo descanso!',
        en: 'Streak freeze shield active!',
        de: 'Streak-Schutzschild aktiviert!',
        fr: 'Bouclier de série activé !',
        ja: '連続記録フリーズシールドが有効になりました！',
        pt: 'Escudo de ofensiva ativado!',
      })
    );
  };

  const handleRestorePurchases = async () => {
    sound.play('tap');
    const user = auth.currentUser;
    if (!user) {
      setRestoreMessage(
        tr(locale, {
          es: 'Inicia sesión con tu cuenta de Google o Apple en la pestaña Perfil para restaurar tu plan PRO.',
          en: 'Sign in with Google or Apple in the Profile tab to restore your PRO plan.',
          de: 'Melde dich im Tab Profil mit Google oder Apple an, um deinen PRO-Plan wiederherzustellen.',
          fr: 'Connecte-toi avec Google ou Apple dans l’onglet Profil pour restaurer ton abonnement PRO.',
          ja: 'PROプランを復元するには、プロフィールタブでGoogleまたはAppleでログインしてください。',
          pt: 'Faça login com Google ou Apple na aba Perfil para restaurar seu plano PRO.',
        })
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
          tr(locale, {
            es: '¡Tu suscripción Gridverse PRO ha sido verificada y activada!',
            en: 'Your Gridverse PRO subscription is verified and active!',
            de: 'Dein Gridverse PRO-Abonnement wurde bestätigt und aktiviert!',
            fr: 'Ton abonnement Gridverse PRO a été vérifié et activé !',
            ja: 'Gridverse PROサブスクリプションが確認・有効化されました！',
            pt: 'Sua assinatura Gridverse PRO foi verificada e ativada!',
          })
        );
      } else {
        setRestoreMessage(
          tr(locale, {
            es: 'No se encontraron compras PRO activas asociadas a esta cuenta.',
            en: 'No active PRO purchases found for this account.',
            de: 'Keine aktiven PRO-Käufe für dieses Konto gefunden.',
            fr: 'Aucun achat PRO actif trouvé pour ce compte.',
            ja: 'このアカウントに有効なPRO購入が見つかりませんでした。',
            pt: 'Nenhuma compra PRO ativa encontrada para esta conta.',
          })
        );
      }
    } catch {
      setRestoreMessage(
        tr(locale, {
          es: 'Error al verificar suscripción. Intenta nuevamente.',
          en: 'Error verifying subscription. Please try again.',
          de: 'Fehler bei der Überprüfung. Bitte erneut versuchen.',
          fr: 'Erreur lors de la vérification. Réessaie.',
          ja: '確認中にエラーが発生しました。もう一度お試しください。',
          pt: 'Erro ao verificar assinatura. Tente novamente.',
        })
      );
    } finally {
      setRestoring(false);
    }
  };

  const planBadgeLabel = () => {
    const p = (stats.subscriptionPlan || 'lifetime').toLowerCase();
    if (p.includes('lifetime')) {
      return tr(locale, {
        es: 'PRO DE POR VIDA',
        en: 'LIFETIME PRO',
        de: 'LEBENSLANG PRO',
        fr: 'PRO À VIE',
        ja: '永久PROプラン',
        pt: 'PRO VITALÍCIO',
      });
    }
    if (p.includes('annual')) {
      return tr(locale, {
        es: 'PLAN ANUAL PRO',
        en: 'ANNUAL PRO',
        de: 'JAHRES-PRO',
        fr: 'PRO ANNUEL',
        ja: '年間PROプラン',
        pt: 'PLANO ANUAL PRO',
      });
    }
    if (p.includes('monthly')) {
      return tr(locale, {
        es: 'PLAN MENSUAL PRO',
        en: 'MONTHLY PRO',
        de: 'MONATS-PRO',
        fr: 'PRO MENSUEL',
        ja: '月間PROプラン',
        pt: 'PLANO MENSAL PRO',
      });
    }
    if (p.includes('duo')) {
      return tr(locale, {
        es: 'PLAN DÚO PRO',
        en: 'DUO PRO',
        de: 'DUO PRO',
        fr: 'DUO PRO',
        ja: 'デュオPROプラン',
        pt: 'PLANO DUO PRO',
      });
    }
    return tr(locale, {
      es: 'PRO ACTIVO',
      en: 'PRO ACTIVE',
      de: 'PRO AKTIV',
      fr: 'PRO ACTIF',
      ja: 'PRO 有効',
      pt: 'PRO ATIVO',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 px-4">
      {/* Header */}
      <div className="border-b border-gv-border pb-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gv-text flex items-center gap-2.5">
            {stats.isPro
              ? tr(locale, {
                  es: 'Tu Membresía PRO',
                  en: 'Your PRO Membership',
                  de: 'Deine PRO-Mitgliedschaft',
                  fr: 'Ton Abonnement PRO',
                  ja: 'あなたのPROメンバーシップ',
                  pt: 'Sua Assinatura PRO',
                })
              : tr(locale, {
                  es: 'Tienda y Planes PRO',
                  en: 'Shop & PRO Plans',
                  de: 'Shop & PRO-Pläne',
                  fr: 'Boutique & Plans PRO',
                  ja: 'ショップ & PROプラン',
                  pt: 'Loja e Planos PRO',
                })}
          </h1>
          <p className="text-xs text-gv-muted mt-1">
            {stats.isPro
              ? tr(locale, {
                  es: 'Tienes acceso total sin límites a todas las herramientas, cursos y vidas infinitas.',
                  en: 'You have full unlimited access to all tools, courses, and infinite lives.',
                  de: 'Du hast unbegrenzten Zugriff auf alle Tools, Kurse und unendliche Leben.',
                  fr: 'Tu disposes d’un accès illimité à tous les cours, outils et vies infinies.',
                  ja: 'すべてのコース・ツール・無限ライフに無制限でアクセスできます。',
                  pt: 'Você tem acesso total e ilimitado a todas as ferramentas, cursos e vidas infinitas.',
                })
              : tr(locale, {
                  es: 'Domina Excel y ahorra +4 horas cada semana con acceso ilimitado.',
                  en: 'Master Excel and save 4+ hours every week with unlimited access.',
                  de: 'Meistere Excel und spare jede Woche über 4 Stunden mit unbegrenztem Zugang.',
                  fr: 'Maîtrise Excel et économise +4 heures par semaine avec un accès illimité.',
                  ja: '無制限アクセスでExcelを極め、毎週4時間以上の業務時間を短縮しましょう。',
                  pt: 'Domine o Excel e economize +4 horas toda semana com acesso ilimitado.',
                })}
          </p>
        </div>

        <button
          onClick={handleRestorePurchases}
          disabled={restoring}
          className="px-3.5 py-2 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-xs font-bold text-gv-text flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gv-primary ${restoring ? 'animate-spin' : ''}`} />
          {tr(locale, {
            es: 'Restaurar / Sincronizar Compras',
            en: 'Restore / Sync Purchases',
            de: 'Käufe wiederherstellen / synchronisieren',
            fr: 'Restaurer / Synchroniser les achats',
            ja: '購入を復元・同期',
            pt: 'Restaurar / Sincronizar Compras',
          })}
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
              {tr(locale, {
                es: 'Gridverse PRO Activo',
                en: 'Gridverse PRO Active',
                de: 'Gridverse PRO Aktiv',
                fr: 'Gridverse PRO Actif',
                ja: 'Gridverse PRO 有効',
                pt: 'Gridverse PRO Ativo',
              })}
            </h2>
            <p className="text-xs md:text-sm text-gv-muted mt-1 leading-relaxed">
              {tr(locale, {
                es: 'Tu plan comprado en la app está sincronizado con tu cuenta web. Practica con vidas ilimitadas y acceso total a los 12 módulos.',
                en: 'Your mobile plan is synced with your web account. Practice with unlimited lives and full access to all 12 modules.',
                de: 'Dein App-Plan ist mit deinem Web-Konto synchronisiert. Übe mit unbegrenzten Leben und vollem Zugang zu allen 12 Modulen.',
                fr: 'Ton abonnement mobile est synchronisé avec ton compte web. Pratique avec des vies illimitées et un accès complet aux 12 modules.',
                ja: 'アプリで購入したプランがWebアカウントと同期されています。無限ライフと全12モジュールを自由に利用できます。',
                pt: 'Seu plano comprado no app está sincronizado com sua conta web. Pratique com vidas ilimitadas e acesso total aos 12 módulos.',
              })}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gv-surface border border-gv-border text-xs font-bold text-gv-text">
                <InfinityIcon className="w-4 h-4 text-gv-accent" />
                {tr(locale, {
                  es: 'Vidas Ilimitadas',
                  en: 'Unlimited Lives',
                  de: 'Unbegrenzte Leben',
                  fr: 'Vies Illimitées',
                  ja: 'ライフ無制限',
                  pt: 'Vidas Ilimitadas',
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gv-surface border border-gv-border text-xs font-bold text-gv-text">
                <Zap className="w-4 h-4 text-gv-warning" />
                {tr(locale, {
                  es: 'Acceso Total (+12 Cursos)',
                  en: 'Full Access (+12 Courses)',
                  de: 'Vollzugang (+12 Kurse)',
                  fr: 'Accès Total (+12 Cours)',
                  ja: '全12コース解放',
                  pt: 'Acesso Total (+12 Cursos)',
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gv-surface border border-gv-border text-xs font-bold text-gv-text">
                <Award className="w-4 h-4 text-gv-primary" />
                {tr(locale, {
                  es: 'Certificado PRO',
                  en: 'PRO Certificate',
                  de: 'PRO-Zertifikat',
                  fr: 'Certificat PRO',
                  ja: 'PRO認定証',
                  pt: 'Certificado PRO',
                })}
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
                  {tr(locale, {
                    es: 'Invitado / Compañero Plan Dúo',
                    en: 'Duo Plan Partner License',
                    de: 'Duo-Plan Partnerlizenz',
                    fr: 'Partenaire Plan Duo',
                    ja: 'デュオプラン パートナー連携',
                    pt: 'Convidado / Parceiro Plano Duo',
                  })}
                </h3>
                <p className="text-xs text-gv-muted">
                  {tr(locale, {
                    es: 'Si tu plan es Dúo, vincula el correo de tu compañero para compartir beneficios PRO.',
                    en: 'If you have a Duo plan, link your partner email to share PRO benefits.',
                    de: 'Wenn du einen Duo-Plan hast, verknüpfe die E-Mail deines Partners für gemeinsame PRO-Vorteile.',
                    fr: 'Si tu as un plan Duo, lie l’e-mail de ton partenaire pour partager les avantages PRO.',
                    ja: 'デュオプランをお持ちの場合、パートナーのメールアドレスを登録してPRO特典を共有できます。',
                    pt: 'Se o seu plano for Duo, vincule o e-mail do seu parceiro para compartilhar os benefícios PRO.',
                  })}
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
                  placeholder="partner@email.com"
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
                  ? '...'
                  : tr(locale, {
                      es: 'Vincular Compañero',
                      en: 'Link Partner',
                      de: 'Partner verknüpfen',
                      fr: 'Lier le partenaire',
                      ja: 'パートナーを連携',
                      pt: 'Vincular Parceiro',
                    })}
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
                ? tr(locale, {
                    es: 'Ocultar comparativa y planes',
                    en: 'Hide comparison & plans',
                    de: 'Vergleich & Pläne ausblenden',
                    fr: 'Masquer le comparatif et les plans',
                    ja: 'プラン比較を閉じる',
                    pt: 'Ocultar comparativo e planos',
                  })
                : tr(locale, {
                    es: 'Ver comparativa Gratis vs. PRO y todos los planes',
                    en: 'View Free vs. PRO comparison & all plans',
                    de: 'Gratis vs. PRO Vergleich & alle Pläne ansehen',
                    fr: 'Voir le comparatif Gratuit vs PRO et tous les plans',
                    ja: '無料 vs PRO 比較とすべてのプランを表示',
                    pt: 'Ver comparativo Grátis vs. PRO e todos os planos',
                  })}
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
                {tr(locale, {
                  es: 'ELIGE TU MODALIDAD',
                  en: 'CHOOSE YOUR MODE',
                  de: 'WÄHLE DEINEN MODUS',
                  fr: 'CHOISIS TA FORMULE',
                  ja: 'プランタイプを選択',
                  pt: 'ESCOLHA SUA MODALIDADE',
                })}
              </span>
              <h2 className="text-base md:text-lg font-black text-gv-text">
                {selectedCategory === 'individual'
                  ? tr(locale, {
                      es: 'Plan Individual (1 cuenta)',
                      en: 'Individual Plan (1 account)',
                      de: 'Einzelplan (1 Konto)',
                      fr: 'Plan Individuel (1 compte)',
                      ja: '個人プラン（1アカウント）',
                      pt: 'Plano Individual (1 conta)',
                    })
                  : tr(locale, {
                      es: 'Plan Dúo PRO (2 cuentas sincronizadas)',
                      en: 'Duo PRO Plan (2 synced accounts)',
                      de: 'Duo PRO-Plan (2 Konten)',
                      fr: 'Plan Duo PRO (2 comptes synchronisés)',
                      ja: 'デュオPROプラン（2アカウント共有）',
                      pt: 'Plano Duo PRO (2 contas sincronizadas)',
                    })}
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
                <span>
                  {tr(locale, {
                    es: 'Individual',
                    en: 'Individual',
                    de: 'Einzel',
                    fr: 'Individuel',
                    ja: '個人',
                    pt: 'Individual',
                  })}
                </span>
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
                <span>
                  {tr(locale, {
                    es: 'Dúo (2 personas)',
                    en: 'Duo (2 people)',
                    de: 'Duo (2 Personen)',
                    fr: 'Duo (2 personnes)',
                    ja: 'デュオ (2名)',
                    pt: 'Duo (2 pessoas)',
                  })}
                </span>
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
                  {tr(locale, {
                    es: 'MÁS POPULAR · 7 DÍAS GRATIS',
                    en: 'MOST POPULAR · 7 DAYS FREE',
                    de: 'BELIEBTESTE · 7 TAGE GRATIS',
                    fr: 'PLUS POPULAIRE · 7 JOURS GRATUITS',
                    ja: '一番人気 · 7日間無料',
                    pt: 'MAIS POPULAR · 7 DIAS GRÁTIS',
                  })}
                </span>
                <Sparkles className="w-4 h-4 text-gv-accent" />
              </div>
              <div>
                <h3 className="text-base font-black text-gv-text">
                  {selectedCategory === 'duo'
                    ? tr(locale, {
                        es: 'Anual Dúo',
                        en: 'Annual Duo',
                        de: 'Jahres-Duo',
                        fr: 'Annuel Duo',
                        ja: '年間デュオ',
                        pt: 'Anual Duo',
                      })
                    : tr(locale, {
                        es: 'Anual PRO',
                        en: 'Annual PRO',
                        de: 'Jahres-PRO',
                        fr: 'Annuel PRO',
                        ja: '年間PRO',
                        pt: 'Anual PRO',
                      })}
                </h3>
                <div className="text-2xl font-black text-gv-accent font-mono mt-1">
                  {selectedCategory === 'duo' ? '$54.99' : '$37.99'}
                  <span className="text-xs text-gv-muted font-normal">
                    {' '}
                    / {tr(locale, { es: 'año', en: 'year', de: 'Jahr', fr: 'an', ja: '年', pt: 'ano' })}
                  </span>
                </div>
                <p className="text-[11px] text-gv-muted mt-1">
                  {selectedCategory === 'duo'
                    ? tr(locale, {
                        es: 'Solo $0.52/semana por persona · 2 cuentas PRO',
                        en: 'Only $0.52/week per person · 2 PRO accounts',
                        de: 'Nur $0.52/Woche pro Person · 2 PRO-Konten',
                        fr: 'Seulement 0,52 $/semaine par personne · 2 comptes PRO',
                        ja: '1人あたり週$0.52 · 2アカウントPRO',
                        pt: 'Apenas $0.52/semana por pessoa · 2 contas PRO',
                      })
                    : tr(locale, {
                        es: 'Solo $0.73/semana · Menos que un café al mes',
                        en: 'Only $0.73/week · Less than a coffee per month',
                        de: 'Nur $0.73/Woche · Weniger als ein Kaffee im Monat',
                        fr: 'Seulement 0,73 $/semaine · Moins cher qu’un café',
                        ja: '週わずか$0.73 · 最もお得なプラン',
                        pt: 'Apenas $0.73/semana · Menos que um café por mês',
                      })}
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
                  {tr(locale, {
                    es: 'FLEXIBLE MES A MES',
                    en: 'FLEXIBLE MONTH TO MONTH',
                    de: 'FLEXIBEL MONATLICH',
                    fr: 'FLEXIBLE MOIS PAR MOIS',
                    ja: '月々フレキシブル',
                    pt: 'FLEXÍVEL MÊS A MÊS',
                  })}
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-gv-text">
                  {selectedCategory === 'duo'
                    ? tr(locale, {
                        es: 'Mensual Dúo',
                        en: 'Monthly Duo',
                        de: 'Monats-Duo',
                        fr: 'Mensuel Duo',
                        ja: '月間デュオ',
                        pt: 'Mensal Duo',
                      })
                    : tr(locale, {
                        es: 'Mensual PRO',
                        en: 'Monthly PRO',
                        de: 'Monats-PRO',
                        fr: 'Mensuel PRO',
                        ja: '月間PRO',
                        pt: 'Mensal PRO',
                      })}
                </h3>
                <div className="text-2xl font-black text-gv-text font-mono mt-1">
                  {selectedCategory === 'duo' ? '$9.99' : '$6.99'}
                  <span className="text-xs text-gv-muted font-normal">
                    {' '}
                    / {tr(locale, { es: 'mes', en: 'mo', de: 'Monat', fr: 'mois', ja: '月', pt: 'mês' })}
                  </span>
                </div>
                <p className="text-[11px] text-gv-muted mt-1">
                  {tr(locale, {
                    es: 'Sin plazos forzosos · Cancela cuando quieras',
                    en: 'No lock-in · Cancel anytime',
                    de: 'Keine Bindung · Jederzeit kündbar',
                    fr: 'Sans engagement · Annule quand tu veux',
                    ja: '縛りなし · いつでも解約可能',
                    pt: 'Sem fidelidade · Cancele quando quiser',
                  })}
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
                  {tr(locale, {
                    es: 'PAGO ÚNICO DE POR VIDA',
                    en: 'ONE-TIME LIFETIME PAYMENT',
                    de: 'EINMALIGE ZAHLUNG',
                    fr: 'PAIEMENT UNIQUE À VIE',
                    ja: '買い切り永久アクセス',
                    pt: 'PAGAMENTO ÚNICO VITALÍCIO',
                  })}
                </span>
                <Award className="w-4 h-4 text-gv-warning" />
              </div>
              <div>
                <h3 className="text-base font-black text-gv-text">
                  {selectedCategory === 'duo'
                    ? tr(locale, {
                        es: 'De por vida Dúo',
                        en: 'Lifetime Duo',
                        de: 'Lebenslang Duo',
                        fr: 'À vie Duo',
                        ja: '永久デュオ',
                        pt: 'Vitalício Duo',
                      })
                    : tr(locale, {
                        es: 'De por vida PRO',
                        en: 'Lifetime PRO',
                        de: 'Lebenslang PRO',
                        fr: 'À vie PRO',
                        ja: '永久PRO',
                        pt: 'Vitalício PRO',
                      })}
                </h3>
                <div className="text-2xl font-black text-gv-warning font-mono mt-1">
                  {selectedCategory === 'duo' ? '$119.99' : '$79.99'}
                  <span className="text-xs text-gv-muted font-normal">
                    {' '}
                    {tr(locale, {
                      es: 'pago único',
                      en: 'one-time',
                      de: 'einmalig',
                      fr: 'paiement unique',
                      ja: '買い切り',
                      pt: 'pagamento único',
                    })}
                  </span>
                </div>
                <p className="text-[11px] text-gv-muted mt-1">
                  {tr(locale, {
                    es: 'Acceso permanente para siempre sin renovaciones',
                    en: 'Permanent access forever without renewals',
                    de: 'Dauerhafter Zugang für immer ohne Verlängerungen',
                    fr: 'Accès permanent à vie sans renouvellement',
                    ja: '追加課金なしで永久にすべて利用可能',
                    pt: 'Acesso permanente para sempre sem renovações',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Explicit Comparison Table: Gratis vs PRO (matching Flutter shop_screen.dart) */}
          <div className="bg-gv-surface border border-gv-border rounded-2xl overflow-hidden shadow-lg">
            <div className="px-5 py-3.5 bg-gv-surface-high border-b border-gv-border flex items-center justify-between">
              <span className="text-xs md:text-sm font-black text-gv-text">
                {tr(locale, {
                  es: 'Comparativa: Plan Gratis vs. Gridverse PRO',
                  en: 'Comparison: Free Plan vs. Gridverse PRO',
                  de: 'Vergleich: Gratis-Plan vs. Gridverse PRO',
                  fr: 'Comparatif : Plan Gratuit vs Gridverse PRO',
                  ja: 'プラン比較: 無料プラン vs Gridverse PRO',
                  pt: 'Comparativo: Plano Grátis vs. Gridverse PRO',
                })}
              </span>
              <div className="flex items-center gap-1 text-gv-warning text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-gv-warning" />
                <span>4.9 ★</span>
              </div>
            </div>

            <div className="divide-y divide-gv-border text-xs">
              {[
                {
                  feature: tr(locale, {
                    es: 'Energía y Vidas de práctica',
                    en: 'Practice Energy & Lives',
                    de: 'Übungsenergie & Leben',
                    fr: 'Énergie et Vies de pratique',
                    ja: '練習ライフ・エネルギー',
                    pt: 'Energia e Vidas de prática',
                  }),
                  free: tr(locale, {
                    es: '5 vidas (20m espera)',
                    en: '5 lives (20m wait)',
                    de: '5 Leben (20m Wartezeit)',
                    fr: '5 vies (20m attente)',
                    ja: '5ライフ（20分回復）',
                    pt: '5 vidas (20m espera)',
                  }),
                  pro: tr(locale, {
                    es: 'Infinitas (∞)',
                    en: 'Unlimited (∞)',
                    de: 'Unbegrenzt (∞)',
                    fr: 'Illimitées (∞)',
                    ja: '無制限 (∞)',
                    pt: 'Infinitas (∞)',
                  }),
                },
                {
                  feature: tr(locale, {
                    es: 'Ruta completa de 12 Columnas (36 niveles)',
                    en: 'Full 12-Column Path (36 levels)',
                    de: 'Kompletter 12-Spalten-Pfad (36 Level)',
                    fr: 'Parcours complet de 12 Colonnes (36 niveaux)',
                    ja: '全12セクションの学習ルート（36レベル）',
                    pt: 'Trilha completa de 12 Colunas (36 níveis)',
                  }),
                  free: tr(locale, {
                    es: 'Básico',
                    en: 'Basic',
                    de: 'Basis',
                    fr: 'Basique',
                    ja: '基本のみ',
                    pt: 'Básico',
                  }),
                  pro: tr(locale, {
                    es: 'Desbloqueo Total',
                    en: 'Full Unlock',
                    de: 'Komplett frei',
                    fr: 'Déblocage Total',
                    ja: '完全アンロック',
                    pt: 'Desbloqueio Total',
                  }),
                },
                {
                  feature: tr(locale, {
                    es: 'Libros Multi-Hoja de Negocios Reales',
                    en: 'Real Business Multi-Sheet Workbooks',
                    de: 'Mehrblättrige Praxis-Arbeitsmappen',
                    fr: 'Classeurs Multi-Feuilles de Cas Réels',
                    ja: '実践マルチシート演習ブック',
                    pt: 'Pastas Multi-Planilha de Negócios Reais',
                  }),
                  free: tr(locale, {
                    es: 'Curso 1',
                    en: 'Course 1',
                    de: 'Kurs 1',
                    fr: 'Cours 1',
                    ja: 'コース 1',
                    pt: 'Curso 1',
                  }),
                  pro: tr(locale, {
                    es: 'Todos los Cursos',
                    en: 'All Courses',
                    de: 'Alle Kurse',
                    fr: 'Tous les Cours',
                    ja: '全コース',
                    pt: 'Todos os Cursos',
                  }),
                },
                {
                  feature: tr(locale, {
                    es: 'Bóveda de 107 Fórmulas + 32 Atajos Win/Mac',
                    en: '107 Formulas Vault + 32 Win/Mac Shortcuts',
                    de: '107 Formeln + 32 Win/Mac-Tastenkürzel',
                    fr: '107 Formules + 32 Raccourcis Win/Mac',
                    ja: '107関数辞典 + 32ショートカット',
                    pt: '107 Fórmulas + 32 Atalhos Win/Mac',
                  }),
                  free: tr(locale, {
                    es: 'Incluido',
                    en: 'Included',
                    de: 'Inklusive',
                    fr: 'Inclus',
                    ja: '含む',
                    pt: 'Incluído',
                  }),
                  pro: tr(locale, {
                    es: 'Incluido + Retos',
                    en: 'Included + Drills',
                    de: 'Inkl. + Drills',
                    fr: 'Inclus + Défis',
                    ja: '含む + 特訓',
                    pt: 'Incluído + Desafios',
                  }),
                },
                {
                  feature: tr(locale, {
                    es: 'Certificado Oficial Verificable (PDF / LinkedIn)',
                    en: 'Verifiable Official Certificate (PDF / LinkedIn)',
                    de: 'Verifizierbares Zertifikat (PDF / LinkedIn)',
                    fr: 'Certificat Officiel Vérifiable (PDF / LinkedIn)',
                    ja: '公式認定証（PDF / LinkedIn共有）',
                    pt: 'Certificado Oficial Verificável (PDF / LinkedIn)',
                  }),
                  free: null,
                  pro: tr(locale, {
                    es: 'Incluido con ID único',
                    en: 'Included with unique ID',
                    de: 'Inkl. eindeutiger ID',
                    fr: 'Inclus avec ID unique',
                    ja: '固有ID付きで発行',
                    pt: 'Incluído com ID único',
                  }),
                },
                {
                  feature: tr(locale, {
                    es: 'Sincronización Nube Móvil (iOS/Android) + Web',
                    en: 'Cloud Sync Mobile (iOS/Android) + Web',
                    de: 'Cloud-Sync Mobil (iOS/Android) + Web',
                    fr: 'Synchro Cloud Mobile (iOS/Android) + Web',
                    ja: 'モバイル（iOS/Android）+ Webクラウド同期',
                    pt: 'Sincronização Nuvem Mobile (iOS/Android) + Web',
                  }),
                  free: tr(locale, {
                    es: 'Incluido',
                    en: 'Included',
                    de: 'Inklusive',
                    fr: 'Inclus',
                    ja: '含む',
                    pt: 'Incluído',
                  }),
                  pro: tr(locale, {
                    es: 'Prioritaria + Dúo',
                    en: 'Priority + Duo',
                    de: 'Priorität + Duo',
                    fr: 'Prioritaire + Duo',
                    ja: '優先同期 + デュオ',
                    pt: 'Prioritária + Duo',
                  }),
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
                  {tr(locale, {
                    es: 'Adquiere tu plan desde la app móvil oficial y se activará automáticamente en Web.',
                    en: 'Get your plan on the official mobile app and it will activate automatically on Web.',
                    de: 'Hol dir deinen Plan in der offiziellen App – er wird im Web automatisch aktiviert.',
                    fr: 'Prends ton abonnement sur l’application mobile officielle et il sera activé sur le Web.',
                    ja: '公式モバイルアプリでプランを購入すると、Web版でも自動的に有効になります。',
                    pt: 'Adquira seu plano no app móvel oficial e ele será ativado automaticamente na Web.',
                  })}
                </p>
                <a
                  href="https://gridverse.app#download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-gv-primary/20"
                >
                  {tr(locale, {
                    es: 'Activar en la App >',
                    en: 'Activate in App >',
                    de: 'In der App aktivieren >',
                    fr: "Activer dans l'App >",
                    ja: 'アプリで有効化 >',
                    pt: 'Ativar no App >',
                  })}
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
                {tr(locale, {
                  es: 'Recargar Vidas al Máximo',
                  en: 'Refill Max Lives',
                  de: 'Leben voll aufladen',
                  fr: 'Recharger les Vies au Max',
                  ja: 'ライフを最大まで回復',
                  pt: 'Recarregar Vidas ao Máximo',
                })}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {stats.isPro
                  ? tr(locale, {
                      es: 'Ya cuentas con Vidas Ilimitadas gracias a tu suscripción PRO.',
                      en: 'You already have Unlimited Lives with your PRO subscription.',
                      de: 'Du hast bereits unbegrenzte Leben dank deines PRO-Abos.',
                      fr: 'Tu disposes déjà de Vies Illimitées grâce à ton abonnement PRO.',
                      ja: 'PROサブスクリプションによりライフ無制限が有効です。',
                      pt: 'Você já possui Vidas Ilimitadas graças à sua assinatura PRO.',
                    })
                  : tr(locale, {
                      es: 'Recupera tus 5 vidas inmediatamente para seguir resolviendo niveles sin esperar.',
                      en: 'Restore all 5 lives immediately to keep solving levels without waiting.',
                      de: 'Stelle sofort alle 5 Leben wieder her, um ohne Wartezeit weiterzuspielen.',
                      fr: 'Récupère tes 5 vies immédiatement pour continuer sans attendre.',
                      ja: '待ち時間なしで5つのライフを今すぐ全回復します。',
                      pt: 'Recupere suas 5 vidas imediatamente para continuar sem esperar.',
                    })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gv-border">
            <span className="text-xs font-mono text-gv-muted">
              {stats.isPro ? '∞' : `${stats.lives} / ${stats.maxLives}`}
            </span>
            <button
              onClick={handleRefillLives}
              disabled={stats.isPro || stats.lives >= stats.maxLives}
              className="px-4 py-2 rounded-xl bg-gv-bytes/15 hover:bg-gv-bytes/25 disabled:opacity-40 border border-gv-bytes/40 text-gv-bytes font-mono font-bold text-xs transition-all cursor-pointer"
            >
              {stats.isPro
                ? tr(locale, {
                    es: 'Incluido en PRO',
                    en: 'Included in PRO',
                    de: 'In PRO enthalten',
                    fr: 'Inclus dans PRO',
                    ja: 'PROに含まれます',
                    pt: 'Incluído no PRO',
                  })
                : stats.lives >= stats.maxLives
                ? tr(locale, {
                    es: 'Vidas llenas',
                    en: 'Full Lives',
                    de: 'Leben voll',
                    fr: 'Vies pleines',
                    ja: 'ライフ満タン',
                    pt: 'Vidas cheias',
                  })
                : '💎 20'}
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
                {tr(locale, {
                  es: 'Escudo Protector de Racha',
                  en: 'Streak Freeze Shield',
                  de: 'Streak-Schutzschild',
                  fr: 'Bouclier de Série',
                  ja: '連続記録フリーズシールド',
                  pt: 'Escudo Protetor de Ofensiva',
                })}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {tr(locale, {
                  es: 'Protege tu racha de días consecutivos si olvidas practicar durante 24 horas.',
                  en: 'Protect your daily streak if you miss practicing for 24 hours.',
                  de: 'Schütze deine tägliche Serie, falls du 24 Stunden lang nicht übst.',
                  fr: 'Protège ta série quotidienne si tu oublies de pratiquer pendant 24 heures.',
                  ja: '24時間練習を忘れても連続記録を保護します。',
                  pt: 'Proteja sua sequência de dias consecutivos se esquecer de praticar por 24 horas.',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gv-border">
            <span className="text-xs font-mono text-gv-muted">🔥 {stats.streak}d</span>
            <button
              onClick={handleBuyStreakFreeze}
              className="px-4 py-2 rounded-xl bg-gv-bytes/15 hover:bg-gv-bytes/25 border border-gv-bytes/40 text-gv-bytes font-mono font-bold text-xs transition-all cursor-pointer"
            >
              💎 30
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
