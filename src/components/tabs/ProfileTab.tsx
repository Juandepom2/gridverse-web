import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Award,
  LogOut,
  CheckCircle2,
  Link2,
  Star,
  Gem,
  Share2,
  Pencil,
  Target,
  Zap,
  Sigma,
  Sparkles,
  Grid,
  GitBranch,
  Table2,
  SearchCheck,
  CloudUpload,
  ShieldCheck,
  Lock,
  Eye,
  Download,
  Printer,
  Copy,
  Check,
  Globe,
  Volume2,
  Music,
  Bell,
  Compass,
  UserPlus,
  Trash2,
  UserX,
  FileText,
  ExternalLink,
  X,
  ChevronRight,
  MessageSquareHeart,
  Sun,
  Moon,
} from 'lucide-react';
import { UserStats, SupportedLocale } from '../../types';
import {
  auth,
  signInWithGooglePopup,
  signInWithApplePopup,
  linkAccountWithApple,
  linkAccountWithGoogle,
  updateUserProfileData,
  deleteAccountAndFirestoreData,
  submitAppFeedback,
} from '../../lib/firebase';
import {
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { CeldiMascot, CeldiMood } from '../CeldiMascot';
import { sound } from '../../lib/audio';
import { MOCK_REGIONS } from '../../data/mapData';
import { resetUserStats, formatLocalDateKey } from '../../lib/storage';
import { tr } from '../../lib/i18n';

interface ProfileTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onUpdateStats?: (newStats: UserStats) => void;
  onNavigateTab?: (tab: string) => void;
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

const DiplomaBadgeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      d="M12 2.5L19.5 6.5V12C19.5 16.5 16.2 20.2 12 21.6C7.8 20.2 4.5 16.5 4.5 12V6.5L12 2.5Z"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11.2 14.2L15.5 9.8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CertificateCrest: React.FC<{ className?: string }> = ({ className = 'w-11 h-11' }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="24"
      y="5"
      width="26.87"
      height="26.87"
      rx="3"
      transform="rotate(45 24 5)"
      stroke="#B8860B"
      strokeWidth="1.25"
    />
    <rect
      x="24"
      y="8.5"
      width="21.92"
      height="21.92"
      rx="2"
      transform="rotate(45 24 8.5)"
      stroke="#D4AF37"
      strokeWidth="0.8"
      strokeDasharray="2 1.5"
    />
    <path d="M24 14V34M14 24H34" stroke="#996515" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M19 19L29 29M29 19L19 29" stroke="#B8860B" strokeWidth="0.9" strokeOpacity="0.7" />
    <circle cx="24" cy="24" r="3.2" fill="#B8860B" />
    <circle cx="24" cy="24" r="1.5" fill="#FFFDF8" />
    <path d="M24 10.5L25.5 12L24 13.5L22.5 12Z" fill="#B8860B" />
    <path d="M24 34.5L25.5 36L24 37.5L22.5 36Z" fill="#B8860B" />
    <path d="M10.5 24L12 25.5L13.5 24L12 22.5Z" fill="#B8860B" />
    <path d="M34.5 24L36 25.5L37.5 24L36 22.5Z" fill="#B8860B" />
  </svg>
);

const CertificateSeal: React.FC<{ verified?: boolean; className?: string }> = ({
  verified = true,
  className = 'w-16 h-16',
}) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sealGoldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#DFBA52" />
        <stop offset="50%" stopColor="#C59B27" />
        <stop offset="100%" stopColor="#8C5C0F" />
      </linearGradient>
      <path id="sealCircularPath" d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
    </defs>
    <circle cx="50" cy="50" r="47" fill="url(#sealGoldGrad)" />
    <circle cx="50" cy="50" r="43" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.85" strokeDasharray="2 1.5" />
    <circle cx="50" cy="50" r="40" stroke="#684206" strokeWidth="0.75" />
    <circle cx="50" cy="50" r="28" fill="#FFFDF8" stroke="#C59B27" strokeWidth="1.2" />
    <text fontSize="6" fontWeight="900" letterSpacing="1.8" fill="#FFFFFF" textAnchor="middle">
      <textPath href="#sealCircularPath" startOffset="50%">
        GRIDVERSE • OFFICIAL CERTIFIED •
      </textPath>
    </text>
    <g transform="translate(50, 50)">
      <rect
        x="-8"
        y="-8"
        width="16"
        height="16"
        rx="2"
        transform="rotate(45)"
        fill="#C59B27"
        fillOpacity="0.12"
        stroke="#996515"
        strokeWidth="1.1"
      />
      {verified ? (
        <>
          <path
            d="M-4 0.5L-1.2 3.5L4 -2"
            stroke="#7A4F0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            y="13.5"
            fontSize="4.8"
            fontWeight="900"
            letterSpacing="0.8"
            fill="#7A4F0B"
            textAnchor="middle"
          >
            VERIFIED
          </text>
        </>
      ) : (
        <>
          <circle cx="0" cy="0" r="2.5" fill="#7A4F0B" />
          <text
            y="13.5"
            fontSize="4.5"
            fontWeight="900"
            letterSpacing="0.8"
            fill="#7A4F0B"
            textAnchor="middle"
          >
            PREVIEW
          </text>
        </>
      )}
    </g>
  </svg>
);

const CELDI_AVATAR_OPTIONS: {
  key: string;
  mood: CeldiMood;
  label: Record<SupportedLocale, string>;
}[] = [
  {
    key: 'celdi:happy',
    mood: 'happy',
    label: { es: 'Feliz', en: 'Happy', de: 'Glücklich', fr: 'Heureux', ja: 'ハッピー', pt: 'Feliz' },
  },
  {
    key: 'celdi:celebrating',
    mood: 'celebrating',
    label: {
      es: 'Celebrando',
      en: 'Celebrating',
      de: 'Feiernd',
      fr: 'Fête',
      ja: 'お祝い',
      pt: 'Celebrando',
    },
  },
  {
    key: 'celdi:thinking',
    mood: 'thinking',
    label: {
      es: 'Pensando',
      en: 'Thinking',
      de: 'Denkend',
      fr: 'Réflexion',
      ja: '考え中',
      pt: 'Pensando',
    },
  },
  {
    key: 'celdi:neutral',
    mood: 'onFire',
    label: { es: 'Enfoque', en: 'Focus', de: 'Fokus', fr: 'Focus', ja: '集中', pt: 'Foco' },
  },
  {
    key: 'celdi:sad',
    mood: 'sad',
    label: {
      es: 'Desafío',
      en: 'Challenge',
      de: 'Herausforderung',
      fr: 'Défi',
      ja: 'チャレンジ',
      pt: 'Desafio',
    },
  },
];

function resolveCeldiMood(photoUrl?: string): CeldiMood {
  switch (photoUrl) {
    case 'celdi:celebrating':
      return 'celebrating';
    case 'celdi:thinking':
      return 'thinking';
    case 'celdi:neutral':
      return 'onFire';
    case 'celdi:sad':
      return 'sad';
    case 'celdi:happy':
    default:
      return 'happy';
  }
}

/**
 * Spreadsheet-style segmented progress bar matching Flutter's `CellProgressBar`
 */
const CellProgressBar: React.FC<{
  progress: number;
  segments?: number;
  activeColor?: string;
  height?: number;
}> = ({ progress, segments = 10, activeColor = '#21C26B', height = 10 }) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const exactFill = clamped * segments;
  return (
    <div className="flex items-center gap-1 w-full" style={{ height }}>
      {Array.from({ length: segments }).map((_, idx) => {
        const segFill = Math.max(0, Math.min(1, exactFill - idx));
        return (
          <div
            key={idx}
            className="flex-1 h-full rounded-[3px] bg-gv-surface-high border border-gv-border overflow-hidden relative"
          >
            {segFill > 0 && (
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.round(segFill * 100)}%`,
                  backgroundColor: activeColor,
                  boxShadow: segFill > 0.5 ? `0 0 8px ${activeColor}66` : undefined,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ProfileTab: React.FC<ProfileTabProps> = ({
  stats,
  locale,
  onUpdateStats,
  onNavigateTab,
}) => {
  const isLight = stats.theme === 'light';
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(() => auth.currentUser);
  const [authNotice, setAuthNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Modals & Interactive States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('celdi:happy');
  const [savingProfile, setSavingProfile] = useState(false);

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [copiedVerificationId, setCopiedVerificationId] = useState(false);

  const [showRateModal, setShowRateModal] = useState(false);
  const [rateStars, setRateStars] = useState(5);
  const [rateFeedbackText, setRateFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'signout' | 'delete_account' | 'reset_local' | null>(null);

  // Audio & Reminder settings mirrored from localStorage + stats
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('gridverse_bgm_enabled');
      return v === null ? true : v === 'true';
    } catch {
      return true;
    }
  });
  const [streakReminderEnabled, setStreakReminderEnabled] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('gridverse_streak_reminder');
      return v === null ? false : v === 'true';
    } catch {
      return false;
    }
  });

  // Selected Git heatmap day tooltip
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{
    dateKey: string;
    label: string;
    count: number;
  } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  const showToast = (text: string, type: 'ok' | 'err' = 'ok') => {
    setAuthNotice({ type, text });
    window.setTimeout(() => {
      setAuthNotice((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const linkedProviders = (currentUser?.providerData || []).map((p) => p.providerId);
  const hasGoogleLinked = linkedProviders.includes('google.com');
  const hasAppleLinked = linkedProviders.includes('apple.com');

  const userName =
    stats.displayName?.trim() ||
    currentUser?.displayName?.trim() ||
    (currentUser?.email ? currentUser.email.split('@')[0] : '') ||
    tr(locale, {
      es: 'Estudiante Gridverse',
      en: 'Gridverse Student',
      de: 'Gridverse-Schüler',
      fr: 'Étudiant Gridverse',
      ja: 'Gridverse受講生',
      pt: 'Estudante Gridverse',
    });

  const activePhotoUrl = stats.photoUrl || currentUser?.photoURL || 'celdi:happy';

  // Playable levels calculation (excluding chest nodes, matching Flutter's 90 playable levels)
  const playableLevels = useMemo(
    () => MOCK_REGIONS.flatMap((r) => r.levels).filter((l) => l.type !== 'chest'),
    []
  );
  const totalPlayableLevels = playableLevels.length; // 90

  const completedPlayableCount = useMemo(() => {
    let count = 0;
    for (const lvl of playableLevels) {
      if (stats.completedLevels[lvl.ref.toUpperCase()]) {
        count++;
      }
    }
    return count;
  }, [playableLevels, stats.completedLevels]);

  const completedTotalNodesCount = Object.keys(stats.completedLevels).length;

  const hasCompletedAll =
    Boolean(stats.completedLevels['L6']) || completedPlayableCount >= totalPlayableLevels;

  const totalStars = useMemo(() => {
    return Object.values(stats.completedLevels).reduce(
      (sum, item) => sum + (typeof item === 'number' ? item : item?.stars ?? 0),
      0
    );
  }, [stats.completedLevels]);

  // Rank & XP progress matching Flutter's `profile_screen.dart`
  const rIntern = tr(locale, {
    es: 'Becario',
    en: 'Intern',
    de: 'Praktikant',
    fr: 'Stagiaire',
    ja: 'インターン',
    pt: 'Estagiário',
  });
  const rAnalyst = tr(locale, {
    es: 'Analista',
    en: 'Analyst',
    de: 'Analyst',
    fr: 'Analyste',
    ja: 'アナリスト',
    pt: 'Analista',
  });
  const rNinja = tr(locale, {
    es: 'Ninja de Fórmulas',
    en: 'Formula Ninja',
    de: 'Formel-Ninja',
    fr: 'Ninja des Formules',
    ja: '数式ニンジャ',
    pt: 'Ninja das Fórmulas',
  });
  const rMaster = tr(locale, {
    es: 'Maestro de Datos',
    en: 'Data Master',
    de: 'Datenmeister',
    fr: 'Maître des Données',
    ja: 'データマスター',
    pt: 'Mestre de Dados',
  });

  const rankTitle =
    stats.xp >= 5000
      ? rMaster
      : stats.xp >= 2500
      ? rNinja
      : stats.xp >= 1000
      ? rAnalyst
      : rIntern;

  const rankProgressData = useMemo(() => {
    const xp = stats.xp;
    if (xp < 1000) {
      return {
        nextRankText: `${rIntern} → ${rAnalyst}`,
        targetText: `${xp} / 1,000 XP`,
        progress: Math.max(0, Math.min(1, xp / 1000)),
      };
    }
    if (xp < 2500) {
      return {
        nextRankText: `${rAnalyst} → ${rNinja}`,
        targetText: `${xp} / 2,500 XP`,
        progress: Math.max(0, Math.min(1, (xp - 1000) / 1500)),
      };
    }
    if (xp < 5000) {
      return {
        nextRankText: `${rNinja} → ${rMaster}`,
        targetText: `${xp} / 5,000 XP`,
        progress: Math.max(0, Math.min(1, (xp - 2500) / 2500)),
      };
    }
    return {
      nextRankText: tr(locale, {
        es: 'Rango Máximo Alcanzado',
        en: 'Max Rank Reached',
        de: 'Maximaler Rang erreicht',
        fr: 'Rang Maximum Atteint',
        ja: '最高ランク到達',
        pt: 'Rank Máximo Alcançado',
      }),
      targetText: `${xp} XP`,
      progress: 1,
    };
  }, [stats.xp, rIntern, rAnalyst, rNinja, rMaster, locale]);

  // Mastery Learning Dashboard metrics matching `mastery_learning_dashboard.dart`
  const masteryData = useMemo(() => {
    const countForPrefix = (prefix: string) => {
      let c = 0;
      for (const k of Object.keys(stats.completedLevels)) {
        if (k.toUpperCase().startsWith(prefix)) c++;
      }
      return c;
    };

    const countA = countForPrefix('A');
    const countB = countForPrefix('B');
    const countC = countForPrefix('C');
    const countD = countForPrefix('D');
    const countGH = countForPrefix('G') + countForPrefix('H');

    const pBasics = Math.max(0, Math.min(1, countA / 8));
    const pEssentials = Math.max(0, Math.min(1, countB / 12));
    const pLogic = Math.max(0, Math.min(1, countD / 9));
    const pTables = Math.max(0, Math.min(1, countC / 9));
    const pLookup = Math.max(0, Math.min(1, countGH / 10));

    const maxEarnedStars = completedTotalNodesCount * 3;
    const rawAccuracy = maxEarnedStars > 0 ? (totalStars / maxEarnedStars) * 100 : 95;
    const accuracyPercent = Math.max(75, Math.min(100, Math.round(rawAccuracy)));

    const unlockedFormulas = Math.max(2, Math.min(24, completedPlayableCount * 2));
    const efficiencyGrade =
      accuracyPercent >= 95
        ? 'A+'
        : accuracyPercent >= 88
        ? 'A'
        : accuracyPercent >= 80
        ? 'B+'
        : 'B';

    const skills = [
      {
        id: 'basics',
        title: tr(locale, {
          es: 'Operaciones Básicas',
          en: 'Basic Operations',
          de: 'Grundoperationen',
          fr: 'Opérations de Base',
          ja: '基本操作と算術',
          pt: 'Operações Básicas',
        }),
        subtitle: tr(locale, {
          es: 'Celdas, formatos y aritmética',
          en: 'Cells, formatting & arithmetic',
          de: 'Zellen, Formate und Arithmetik',
          fr: 'Cellules, formats et arithmétique',
          ja: 'セル参照、書式、四則演算',
          pt: 'Células, formatos e aritmética',
        }),
        progress: pBasics,
        color: '#10B981',
        Icon: Grid,
      },
      {
        id: 'essentials',
        title: tr(locale, {
          es: 'Fórmulas Esenciales',
          en: 'Essential Formulas',
          de: 'Wichtige Formeln',
          fr: 'Formules Essentielles',
          ja: '必須関数と絶対参照',
          pt: 'Fórmulas Essenciais',
        }),
        subtitle: tr(locale, {
          es: 'SUMA, PROMEDIO y referencias $A$1',
          en: 'SUM, AVERAGE & $A$1 references',
          de: 'SUMME, MITTELWERT & $A$1-Referenzen',
          fr: 'SOMME, MOYENNE et références $A$1',
          ja: 'SUM、AVERAGE、絶対参照 $A$1',
          pt: 'SOMA, MÉDIA e referências $A$1',
        }),
        progress: pEssentials,
        color: '#0EA5E9',
        Icon: Sigma,
      },
      {
        id: 'logic',
        title: tr(locale, {
          es: 'Lógica Condicional',
          en: 'Conditional Logic',
          de: 'Bedingte Logik',
          fr: 'Logique Conditionnelle',
          ja: '条件分岐ロジック',
          pt: 'Lógica Condicional',
        }),
        subtitle: tr(locale, {
          es: 'SI, Y, O, SI.ERROR y SI.CONJUNTO',
          en: 'IF, AND, OR, IFERROR & IFS',
          de: 'WENN, UND, ODER, WENNFEHLER & WENNS',
          fr: 'SI, ET, OU, SIERREUR et SI.CONDITIONS',
          ja: 'IF、AND、OR、IFERROR、IFS',
          pt: 'SE, E, OU, SEERRO e SES',
        }),
        progress: pLogic,
        color: '#F59E0B',
        Icon: GitBranch,
      },
      {
        id: 'tables',
        title: tr(locale, {
          es: 'Tablas y Organización',
          en: 'Tables & Organization',
          de: 'Tabellen & Struktur',
          fr: 'Tableaux et Organisation',
          ja: 'テーブルとデータ整理',
          pt: 'Tabelas e Organização',
        }),
        subtitle: tr(locale, {
          es: 'Ordenar, filtros y tablas oficiales',
          en: 'Sorting, filters & official tables',
          de: 'Sortieren, Filter und Tabellen',
          fr: 'Tri, filtres et tableaux officiels',
          ja: '並べ替え、フィルター、テーブル機能',
          pt: 'Ordenar, filtros e tabelas oficiais',
        }),
        progress: pTables,
        color: '#14B8A6',
        Icon: Table2,
      },
      {
        id: 'lookup',
        title: tr(locale, {
          es: 'Búsqueda y Calidad',
          en: 'Lookup & Quality',
          de: 'Verweise & Qualität',
          fr: 'Recherche et Qualité',
          ja: 'データ検索と品質管理',
          pt: 'Pesquisa e Qualidade',
        }),
        subtitle: tr(locale, {
          es: 'BUSCARV, BUSCARX y formato condicional',
          en: 'VLOOKUP, XLOOKUP & conditional formatting',
          de: 'SVERWEIS, XVERWEIS & bedingte Formatierung',
          fr: 'RECHERCHEV, RECHERCHEX et mise en forme',
          ja: 'VLOOKUP、XLOOKUP、条件付き書式',
          pt: 'PROCV, PROCX e formatação condicional',
        }),
        progress: pLookup,
        color: '#8B5CF6',
        Icon: SearchCheck,
      },
    ];

    return {
      accuracyPercent,
      unlockedFormulas,
      efficiencyGrade,
      skills,
    };
  }, [stats.completedLevels, completedTotalNodesCount, completedPlayableCount, totalStars, locale]);

  // Effective daily activity map (merging `stats.activityHistory` with streak fallback like Flutter)
  const effectiveActivityHistory = useMemo(() => {
    const map: Record<string, number> = { ...(stats.activityHistory || {}) };
    const today = new Date();
    const todayKey = formatLocalDateKey(today);

    if (stats.streak > 0) {
      let anchor = today;
      if (stats.lastStreakDate) {
        const parts = stats.lastStreakDate.split('-');
        if (parts.length === 3) {
          const parsed = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
          );
          if (!isNaN(parsed.getTime())) {
            anchor = parsed;
          }
        }
      }
      const cappedStreak = Math.min(stats.streak, 126);
      for (let i = 0; i < cappedStreak; i++) {
        const d = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - i);
        const key = formatLocalDateKey(d);
        if (!map[key] || map[key] <= 0) {
          map[key] = i === 0 ? Math.max(1, Math.min(4, completedPlayableCount || 1)) : 1;
        }
      }
    } else if (completedPlayableCount > 0 && Object.keys(map).length === 0) {
      map[todayKey] = Math.min(5, completedPlayableCount);
    }

    return map;
  }, [stats.activityHistory, stats.streak, stats.lastStreakDate, completedPlayableCount]);

  // Weekly activity bars (Monday to Sunday of current week)
  const weeklyActivity = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // JS getDay(): 0 = Sun, 1 = Mon ... 6 = Sat -> convert to 1..7 (Mon=1..Sun=7)
    const isoWeekday = today.getDay() === 0 ? 7 : today.getDay();
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (isoWeekday - 1)
    );
    const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const items = dayLabels.map((label, i) => {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const key = formatLocalDateKey(d);
      const isToday = i === isoWeekday - 1;
      const count = effectiveActivityHistory[key] || 0;
      return { label, key, isToday, count };
    });
    const maxVal = Math.max(3, ...items.map((it) => it.count));
    return { items, maxVal };
  }, [effectiveActivityHistory]);

  // 18-week GitHub-style streak heatmap grid matching `git_streak_calendar.dart`
  const gitCalendarData = useMemo(() => {
    const weeksToShow = 18;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isoWeekday = today.getDay() === 0 ? 7 : today.getDay();
    const currentWeekMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (isoWeekday - 1)
    );
    const startMonday = new Date(
      currentWeekMonday.getFullYear(),
      currentWeekMonday.getMonth(),
      currentWeekMonday.getDate() - (weeksToShow - 1) * 7
    );

    const monthShort = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    const weeks: {
      weekIndex: number;
      monthLabel: string;
      days: {
        date: Date;
        dateKey: string;
        humanLabel: string;
        isFuture: boolean;
        isToday: boolean;
        count: number;
        intensity: number;
      }[];
    }[] = [];

    let lastMonth = -1;
    for (let w = 0; w < weeksToShow; w++) {
      const weekStart = new Date(
        startMonday.getFullYear(),
        startMonday.getMonth(),
        startMonday.getDate() + w * 7
      );
      let monthLabel = '';
      if (weekStart.getMonth() !== lastMonth) {
        if (w === 0) {
          const nextW = new Date(
            startMonday.getFullYear(),
            startMonday.getMonth(),
            startMonday.getDate() + 7
          );
          if (nextW.getMonth() === weekStart.getMonth()) {
            monthLabel = monthShort[weekStart.getMonth()];
          }
        } else {
          monthLabel = monthShort[weekStart.getMonth()];
        }
        lastMonth = weekStart.getMonth();
      }

      const days = [];
      for (let dIdx = 0; dIdx < 7; dIdx++) {
        const cellDate = new Date(
          weekStart.getFullYear(),
          weekStart.getMonth(),
          weekStart.getDate() + dIdx
        );
        const dateKey = formatLocalDateKey(cellDate);
        const isFuture = cellDate.getTime() > today.getTime();
        const isToday = cellDate.getTime() === today.getTime();
        const count = isFuture ? 0 : effectiveActivityHistory[dateKey] || 0;
        let intensity = 0;
        if (count >= 5) intensity = 4;
        else if (count >= 3) intensity = 3;
        else if (count === 2) intensity = 2;
        else if (count === 1) intensity = 1;

        const humanLabel = `${cellDate.getDate()} ${monthShort[cellDate.getMonth()]} ${cellDate.getFullYear()}`;
        days.push({
          date: cellDate,
          dateKey,
          humanLabel,
          isFuture,
          isToday,
          count,
          intensity,
        });
      }

      weeks.push({ weekIndex: w, monthLabel, days });
    }

    return weeks;
  }, [effectiveActivityHistory]);

  // Deterministic Official Certificate Verification ID matching `certificate_section.dart`
  const certificateMeta = useMemo(() => {
    const now = new Date();
    const months = [
      'ENERO',
      'FEBRERO',
      'MARZO',
      'ABRIL',
      'MAYO',
      'JUNIO',
      'JULIO',
      'AGOSTO',
      'SEPTIEMBRE',
      'OCTUBRE',
      'NOVIEMBRE',
      'DICIEMBRE',
    ];
    const dateStr = `${now.getDate()} DE ${months[now.getMonth()]}, ${now.getFullYear()}`;
    const rawSeed = `${currentUser?.uid || 'GRIDVERSE'}-${userName}-${now.getFullYear()}-${
      now.getMonth() + 1
    }`;
    // Simple deterministic hex digest for verification ID
    let h1 = 0xdeadbeef ^ rawSeed.length;
    let h2 = 0x41c6ce57 ^ rawSeed.length;
    for (let i = 0; i < rawSeed.length; i++) {
      const ch = rawSeed.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const hex = (
      (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0')
    ).toUpperCase();
    const verificationId = `GV-PRO-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
    return { dateStr, verificationId };
  }, [currentUser?.uid, userName]);

  // Handlers
  const openEditProfile = () => {
    sound.play('tap');
    setEditName(userName);
    setEditAvatar(activePhotoUrl);
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = editName.trim().slice(0, 25);
    if (!cleanName) return;
    sound.play('tap');
    setSavingProfile(true);
    try {
      const updatedStats: UserStats = {
        ...stats,
        displayName: cleanName,
        photoUrl: editAvatar,
      };
      onUpdateStats?.(updatedStats);
      if (currentUser) {
        await updateUserProfileData(cleanName, editAvatar);
      }
      sound.play('correct');
      setShowEditProfileModal(false);
      showToast(tr(locale, {
        es: '¡Perfil actualizado correctamente!',
        en: 'Profile updated successfully!',
        de: 'Profil erfolgreich aktualisiert!',
        fr: 'Profil mis à jour avec succès !',
        ja: 'プロフィールを更新しました！',
        pt: 'Perfil atualizado com sucesso!',
      }));
    } catch (err: any) {
      showToast(err?.message || tr(locale, {
        es: 'Error al guardar el perfil',
        en: 'Error saving profile',
        de: 'Fehler beim Speichern des Profils',
        fr: 'Erreur lors de l’enregistrement du profil',
        ja: 'プロフィールの保存に失敗しました',
        pt: 'Erro ao salvar o perfil',
      }), 'err');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleShareProfile = async () => {
    sound.play('tap');
    const shareText = tr(locale, {
      es: `¡Llevo ${stats.streak} días de racha y ${stats.xp} XP como ${rankTitle} en Gridverse! 🚀 Domina Excel jugando en https://gridverse.app`,
      en: `I have a ${stats.streak}-day streak and ${stats.xp} XP as ${rankTitle} in Gridverse! 🚀 Master Excel by playing at https://gridverse.app`,
      de: `Ich habe eine ${stats.streak}-Tage-Serie und ${stats.xp} XP als ${rankTitle} in Gridverse! 🚀 Meistere Excel auf https://gridverse.app`,
      fr: `J'ai une série de ${stats.streak} jours et ${stats.xp} XP en tant que ${rankTitle} sur Gridverse ! 🚀 Maîtrise Excel sur https://gridverse.app`,
      ja: `Gridverseで${stats.streak}日連続学習＆${stats.xp} XP（ランク: ${rankTitle}）を達成！ 🚀 https://gridverse.app で楽しくExcelをマスター`,
      pt: `Tenho uma ofensiva de ${stats.streak} dias e ${stats.xp} XP como ${rankTitle} no Gridverse! 🚀 Domine o Excel jogando em https://gridverse.app`,
    });
    try {
      if (navigator.share) {
        await navigator.share({
          title: tr(locale, {
            es: 'Mi progreso en Gridverse',
            en: 'My Gridverse Progress',
            de: 'Mein Gridverse-Fortschritt',
            fr: 'Ma progression sur Gridverse',
            ja: 'Gridverseの学習進捗',
            pt: 'Meu progresso no Gridverse',
          }),
          text: shareText,
          url: 'https://gridverse.app',
        });
        return;
      }
    } catch {
      // Fallback to clipboard
    }
    try {
      await navigator.clipboard.writeText(shareText);
      showToast(tr(locale, {
        es: '¡Resumen de progreso copiado al portapapeles para compartir!',
        en: 'Progress summary copied to clipboard!',
        de: 'Fortschrittszusammenfassung in die Zwischenablage kopiert!',
        fr: 'Résumé de progression copié dans le presse-papiers !',
        ja: '進捗の要約をクリップボードにコピーしました！',
        pt: 'Resumo do progresso copiado para a área de transferência!',
      }));
    } catch {
      showToast(shareText);
    }
  };

  const handleRecommendApp = async () => {
    sound.play('tap');
    const inviteText = tr(locale, {
      es: '¡Aprende y domina Microsoft Excel jugando celda por celda con Gridverse! 🚀 Descárgala o juega gratis en https://gridverse.app',
      en: 'Learn and master Microsoft Excel cell by cell with Gridverse! 🚀 Play free at https://gridverse.app',
      de: 'Lerne und meistere Microsoft Excel spielerisch Zelle für Zelle mit Gridverse! 🚀 Kostenlos spielen unter https://gridverse.app',
      fr: 'Apprends et maîtrise Microsoft Excel cellule par cellule avec Gridverse ! 🚀 Joue gratuitement sur https://gridverse.app',
      ja: 'Gridverseでセルごとに楽しくMicrosoft Excelをマスターしよう！ 🚀 https://gridverse.app で無料プレイ',
      pt: 'Aprenda e domine o Microsoft Excel célula por célula com o Gridverse! 🚀 Jogue grátis em https://gridverse.app',
    });
    try {
      if (navigator.share) {
        await navigator.share({
          title: tr(locale, {
            es: 'Recomendar Gridverse',
            en: 'Recommend Gridverse',
            de: 'Gridverse weiterempfehlen',
            fr: 'Recommander Gridverse',
            ja: 'Gridverseをおすすめする',
            pt: 'Recomendar o Gridverse',
          }),
          text: inviteText,
          url: 'https://gridverse.app',
        });
        return;
      }
    } catch {
      // Fallback to clipboard
    }
    try {
      await navigator.clipboard.writeText(inviteText);
      showToast(tr(locale, {
        es: '¡Enlace de invitación copiado al portapapeles!',
        en: 'Invite link copied to clipboard!',
        de: 'Einladungslink in die Zwischenablage kopiert!',
        fr: 'Lien d’invitation copié dans le presse-papiers !',
        ja: '招待リンクをクリップボードにコピーしました！',
        pt: 'Link de convite copiado para a área de transferência!',
      }));
    } catch {
      showToast(inviteText);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.play('tap');
    setSubmittingFeedback(true);
    try {
      const summary = `[Calificación ${rateStars}/5 ⭐] ${
        rateFeedbackText.trim() || 'Excelente experiencia aprendiendo Excel en Gridverse.'
      }`;
      await submitAppFeedback(summary);
      sound.play('level_win');
      setShowRateModal(false);
      setRateFeedbackText('');
      showToast(tr(locale, {
        es: '¡Muchas gracias por tu calificación de 5 estrellas! 💚',
        en: 'Thank you so much for your 5-star rating! 💚',
        de: 'Vielen Dank für deine 5-Sterne-Bewertung! 💚',
        fr: 'Merci infiniment pour ta note 5 étoiles ! 💚',
        ja: '5つ星評価をありがとうございます！ 💚',
        pt: 'Muito obrigado pela sua avaliação de 5 estrelas! 💚',
      }));
    } catch {
      sound.play('correct');
      setShowRateModal(false);
      showToast(tr(locale, {
        es: '¡Gracias por apoyar a Gridverse!',
        en: 'Thank you for supporting Gridverse!',
        de: 'Danke für deine Unterstützung von Gridverse!',
        fr: 'Merci de soutenir Gridverse !',
        ja: 'Gridverseを応援していただきありがとうございます！',
        pt: 'Obrigado por apoiar o Gridverse!',
      }));
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleGoogleSignIn = async () => {
    sound.play('tap');
    setLoadingAuth(true);
    setAuthNotice(null);
    try {
      await signInWithGooglePopup();
      sound.play('correct');
      showToast(tr(locale, {
        es: 'Sesión iniciada con Google. Tu progreso y plan PRO se han sincronizado.',
        en: 'Signed in with Google. Your progress and PRO plan are synced.',
        de: 'Mit Google angemeldet. Dein Fortschritt und PRO-Plan sind synchronisiert.',
        fr: 'Connecté avec Google. Ta progression et ton plan PRO sont synchronisés.',
        ja: 'Googleでログインしました。進捗とPROプランが同期されました。',
        pt: 'Sessão iniciada com o Google. Seu progresso e plano PRO foram sincronizados.',
      }));
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      showToast(e?.message || tr(locale, {
          es: 'Error al iniciar sesión con Google',
          en: 'Error signing in with Google',
          de: 'Fehler bei der Anmeldung mit Google',
          fr: 'Erreur lors de la connexion avec Google',
          ja: 'Googleログインに失敗しました',
          pt: 'Erro ao fazer login com o Google',
        }), 'err');
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
      showToast(tr(locale, {
        es: 'Sesión iniciada con Apple. Tu progreso y plan PRO se han sincronizado.',
        en: 'Signed in with Apple. Your progress and PRO plan are synced.',
        de: 'Mit Apple angemeldet. Dein Fortschritt und PRO-Plan sind synchronisiert.',
        fr: 'Connecté avec Apple. Ta progression et ton plan PRO sont synchronisés.',
        ja: 'Appleでログインしました。進捗とPROプランが同期されました。',
        pt: 'Sessão iniciada com a Apple. Seu progresso e plano PRO foram sincronizados.',
      }));
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      showToast(
        e?.code === 'auth/operation-not-allowed'
          ? tr(locale, {
              es: 'Apple Sign-In requiere configuración de dominio web en Firebase Auth.',
              en: 'Apple Sign-In requires web domain configuration in Firebase Auth.',
              de: 'Apple Sign-In erfordert Web-Domain-Konfiguration in Firebase Auth.',
              fr: 'Apple Sign-In nécessite la configuration du domaine sur Firebase Auth.',
              ja: 'Firebase AuthでApple Sign-InのWebドメイン設定が必要です。',
              pt: 'O Apple Sign-In requer configuração de domínio da web no Firebase Auth.',
            })
          : e?.message || tr(locale, {
              es: 'Error al iniciar sesión con Apple',
              en: 'Error signing in with Apple',
              de: 'Fehler bei der Anmeldung mit Apple',
              fr: 'Erreur lors de la connexion avec Apple',
              ja: 'Appleログインに失敗しました',
              pt: 'Erro ao fazer login com a Apple',
            }),
        'err'
      );
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
      showToast(tr(locale, {
        es: '¡Cuenta de Apple vinculada exitosamente a tu perfil!',
        en: 'Apple account successfully linked to your profile!',
        de: 'Apple-Konto erfolgreich mit deinem Profil verknüpft!',
        fr: 'Compte Apple associé avec succès à ton profil !',
        ja: 'Appleアカウントを正常に連携しました！',
        pt: 'Conta da Apple vinculada com sucesso ao seu perfil!',
      }));
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (e?.code === 'auth/credential-already-in-use') {
        const cred = OAuthProvider.credentialFromError(e);
        if (cred) {
          await signInWithCredential(auth, cred);
          sound.play('correct');
          showToast(tr(locale, {
            es: 'Conectado a tu cuenta de Apple existente con tu progreso sincronizado.',
            en: 'Connected to existing Apple account with progress synced.',
            de: 'Mit bestehendem Apple-Konto verbunden und synchronisiert.',
            fr: 'Connecté au compte Apple existant avec progression synchronisée.',
            ja: '既存のAppleアカウントに接続し、進捗を同期しました。',
            pt: 'Conectado à sua conta Apple existente com progresso sincronizado.',
          }));
          return;
        }
      }
      showToast(e?.message || tr(locale, {
        es: 'No se pudo vincular con Apple.',
        en: 'Could not link Apple account.',
        de: 'Apple-Konto konnte nicht verknüpft werden.',
        fr: 'Impossible de lier le compte Apple.',
        ja: 'Appleアカウントの連携に失敗しました。',
        pt: 'Não foi possível vincular a conta da Apple.',
      }), 'err');
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
      showToast(tr(locale, {
        es: '¡Cuenta de Google vinculada exitosamente a tu perfil!',
        en: 'Google account successfully linked to your profile!',
        de: 'Google-Konto erfolgreich mit deinem Profil verknüpft!',
        fr: 'Compte Google associé avec succès à ton profil !',
        ja: 'Googleアカウントを正常に連携しました！',
        pt: 'Conta do Google vinculada com sucesso ao seu perfil!',
      }));
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (e?.code === 'auth/credential-already-in-use') {
        const cred = OAuthProvider.credentialFromError(e);
        if (cred) {
          await signInWithCredential(auth, cred);
          sound.play('correct');
          showToast(tr(locale, {
            es: 'Conectado a tu cuenta de Google existente con tu progreso sincronizado.',
            en: 'Connected to existing Google account with progress synced.',
            de: 'Mit bestehendem Google-Konto verbunden und synchronisiert.',
            fr: 'Connecté au compte Google existant avec progression synchronisée.',
            ja: '既存のGoogleアカウントに接続し、進捗を同期しました。',
            pt: 'Conectado à sua conta Google existente com progresso sincronizado.',
          }));
          return;
        }
      }
      showToast(e?.message || tr(locale, {
        es: 'No se pudo vincular con Google.',
        en: 'Could not link Google account.',
        de: 'Google-Konto konnte nicht verknüpft werden.',
        fr: 'Impossible de lier le compte Google.',
        ja: 'Googleアカウントの連携に失敗しました。',
        pt: 'Não foi possível vincular a conta do Google.',
      }), 'err');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleConfirmDialogAction = async () => {
    sound.play('tap');
    const action = confirmAction;
    setConfirmAction(null);
    if (action === 'signout') {
      await signOut(auth);
      showToast(tr(locale, {
        es: 'Has cerrado sesión correctamente.',
        en: 'You have signed out successfully.',
        de: 'Du hast dich erfolgreich abgemeldet.',
        fr: 'Tu t’es déconnecté avec succès.',
        ja: '正常にログアウトしました。',
        pt: 'Você saiu da conta com sucesso.',
      }));
    } else if (action === 'delete_account') {
      try {
        await deleteAccountAndFirestoreData();
        const reset = resetUserStats();
        onUpdateStats?.(reset);
        showToast(tr(locale, {
          es: 'Tu cuenta y datos han sido eliminados permanentemente.',
          en: 'Your account and data have been permanently deleted.',
          de: 'Dein Konto und deine Daten wurden dauerhaft gelöscht.',
          fr: 'Ton compte et tes données ont été définitivement supprimés.',
          ja: 'アカウントとデータが完全に削除されました。',
          pt: 'Sua conta e dados foram excluídos permanentemente.',
        }));
      } catch (err: any) {
        showToast(
          err?.code === 'auth/requires-recent-login'
            ? tr(locale, {
                es: 'Por seguridad, vuelve a iniciar sesión antes de eliminar tu cuenta.',
                en: 'For security, please sign in again before deleting your account.',
                de: 'Aus Sicherheitsgründen bitte erneut anmelden, bevor du dein Konto löschst.',
                fr: 'Par sécurité, reconnecte-toi avant de supprimer ton compte.',
                ja: 'セキュリティのため、アカウント削除前にもう一度ログインしてください。',
                pt: 'Por segurança, faça login novamente antes de excluir sua conta.',
              })
            : err?.message || tr(locale, {
                es: 'No se pudo eliminar la cuenta.',
                en: 'Could not delete account.',
                de: 'Konto konnte nicht gelöscht werden.',
                fr: 'Impossible de supprimer le compte.',
                ja: 'アカウントを削除できませんでした。',
                pt: 'Não foi possível excluir a conta.',
              }),
          'err'
        );
      }
    } else if (action === 'reset_local') {
      const reset = resetUserStats();
      onUpdateStats?.(reset);
      showToast(tr(locale, {
        es: 'Datos locales reiniciados a la celda A1.',
        en: 'Local data reset to cell A1.',
        de: 'Lokale Daten auf Zelle A1 zurückgesetzt.',
        fr: 'Données locales réinitialisées à la cellule A1.',
        ja: 'ローカルデータをセルA1にリセットしました。',
        pt: 'Dados locais reiniciados para a célula A1.',
      }));
    }
  };

  const handleReopenOnboarding = () => {
    sound.play('tap');
    try {
      localStorage.removeItem('gv_onboarding_dismissed');
      localStorage.removeItem('gv_onboarding_steps');
    } catch {
      // ignore
    }
    showToast(tr(locale, {
      es: 'Lista de primeros pasos reactivada en el mapa.',
      en: 'Starter checklist reactivated on the map.',
      de: 'Erste-Schritte-Checkliste auf der Karte reaktiviert.',
      fr: 'Liste des premiers pas réactivée sur la carte.',
      ja: 'マップ上で最初のステップ一覧を再表示しました。',
      pt: 'Lista de primeiros passos reativada na trilha.',
    }));
    onNavigateTab?.('map');
  };

  const certPercent = Math.min(
    100,
    Math.round((completedPlayableCount / Math.max(1, totalPlayableLevels)) * 100)
  );

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 py-6 px-4 pb-16">
      {/* Toast / Notification Banner */}
      {authNotice && (
        <div
          className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 shadow-lg animate-fade-in ${
            authNotice.type === 'ok'
              ? 'bg-gv-primary-soft border-gv-primary/40 text-gv-accent'
              : 'bg-gv-error/10 border-gv-error/40 text-gv-error'
          }`}
        >
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 shrink-0" />
            <span>{authNotice.text}</span>
          </div>
          <button
            onClick={() => setAuthNotice(null)}
            className="text-current opacity-70 hover:opacity-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Interactive Header Row (Avatar + Edit Badge + Name/Rank + Share Button) */}
      <div className="bg-gv-surface border border-gv-border rounded-2xl p-5 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 min-w-0">
          {/* Interactive Avatar with Edit Button */}
          <button
            type="button"
            onClick={openEditProfile}
            title={tr(locale, {
              es: 'Editar perfil y avatar',
              en: 'Edit profile and avatar',
              de: 'Profil und Avatar bearbeiten',
              fr: 'Modifier le profil et l’avatar',
              ja: 'プロフィールとアバターを編集',
              pt: 'Editar perfil e avatar',
            })}
            className="relative group shrink-0 cursor-pointer focus:outline-none"
          >
            <div className="w-[74px] h-[74px] rounded-[22px] bg-gv-surface-high border-2 border-gv-primary flex items-center justify-center overflow-hidden shadow-[0_6px_14px_rgba(33,194,107,0.18)] group-hover:scale-[1.03] transition-transform">
              {activePhotoUrl.startsWith('http') ? (
                <img
                  src={activePhotoUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <CeldiMascot mood={resolveCeldiMood(activePhotoUrl)} size={62} />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gv-primary border-2 border-gv-bg flex items-center justify-center text-black shadow-md group-hover:bg-gv-accent transition-colors">
              <Pencil className="w-3 h-3 stroke-[2.5]" />
            </span>
          </button>

          {/* Name, Subtitle & Rank/PRO Badges */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-gv-text truncate">
                {userName}
              </h1>
              {stats.isPro && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gv-primary text-black text-[10px] font-black uppercase tracking-wider shrink-0">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                  {tr(locale, {
                    es: 'PRO ACTIVO',
                    en: 'PRO ACTIVE',
                    de: 'PRO AKTIV',
                    fr: 'PRO ACTIF',
                    ja: 'PRO 有効',
                    pt: 'PRO ATIVO',
                  })}
                </span>
              )}
            </div>
            <p className="text-xs text-gv-muted truncate mt-0.5">
              {currentUser?.email
                ? `${currentUser.email} · ${rankTitle}`
                : `${tr(locale, {
                    es: 'Cuenta local sin sincronizar',
                    en: 'Unsynced local account',
                    de: 'Lokales Konto (nicht synchronisiert)',
                    fr: 'Compte local non synchronisé',
                    ja: '未同期のローカルアカウント',
                    pt: 'Conta local sem sincronização',
                  })} · ${rankTitle}`}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-gv-primary-soft text-gv-primary border border-gv-primary/35 uppercase">
                {rankTitle.toUpperCase()}
              </span>
              {hasGoogleLinked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gv-surface-high border border-gv-border text-gv-muted">
                  <GoogleLogo className="w-3 h-3" /> Google
                </span>
              )}
              {hasAppleLinked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gv-surface-high border border-gv-border text-gv-muted">
                  <AppleLogo className="w-3 h-3" /> Apple
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Share Profile Action Button */}
        <button
          type="button"
          onClick={handleShareProfile}
          title={tr(locale, {
            es: 'Compartir mi progreso',
            en: 'Share my progress',
            de: 'Fortschritt teilen',
            fr: 'Partager ma progression',
            ja: '進捗をシェア',
            pt: 'Compartilhar meu progresso',
          })}
          className="w-11 h-11 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border flex items-center justify-center text-gv-text transition-colors shrink-0 cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Cloud Save Banner (for Guests) OR Account Linking Bar (for Logged-in users) */}
      {!currentUser ? (
        <div className="rounded-2xl p-5 bg-gradient-to-br from-gv-primary/20 to-gv-surface border border-gv-primary/40 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gv-primary/20 text-gv-primary shrink-0">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-gv-text">
                {tr(locale, {
                  es: 'Guarda tu progreso en la nube',
                  en: 'Save your progress in the cloud',
                  de: 'Speichere deinen Fortschritt in der Cloud',
                  fr: 'Sauvegarde ta progression dans le cloud',
                  ja: '進捗をクラウドに保存しよう',
                  pt: 'Salve seu progresso na nuvem',
                })}
              </h2>
              <p className="text-xs text-gv-muted">
                {tr(locale, {
                  es: 'Conecta tu cuenta gratis para respaldar tus niveles, racha, plan PRO y gemas en todos tus dispositivos.',
                  en: 'Connect your free account to back up your levels, streak, PRO plan, and gems across all devices.',
                  de: 'Verbinde dein kostenloses Konto, um Level, Serie, PRO-Plan und Edelsteine auf allen Geräten zu sichern.',
                  fr: 'Connecte ton compte gratuit pour sauvegarder tes niveaux, série, plan PRO et gemmes sur tous tes appareils.',
                  ja: '無料アカウントを連携して、全デバイス間でレベル・連続記録・PROプラン・ジェムを同期しましょう。',
                  pt: 'Conecte sua conta grátis para sincronizar seus níveis, ofensiva, plano PRO e gemas em todos os dispositivos.',
                })}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={loadingAuth}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
            >
              <AppleLogo className="w-4 h-4" />
              <span>
                {tr(locale, {
                  es: 'Continuar con Apple',
                  en: 'Continue with Apple',
                  de: 'Weiter mit Apple',
                  fr: 'Continuer avec Apple',
                  ja: 'Appleで続ける',
                  pt: 'Continuar com a Apple',
                })}
              </span>
            </button>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingAuth}
              className="py-2.5 px-4 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>
                {tr(locale, {
                  es: 'Continuar con Google',
                  en: 'Continue with Google',
                  de: 'Weiter mit Google',
                  fr: 'Continuer avec Google',
                  ja: 'Googleで続ける',
                  pt: 'Continuar com o Google',
                })}
              </span>
            </button>
          </div>
        </div>
      ) : (
        (!hasAppleLinked || !hasGoogleLinked) && (
          <div className="rounded-2xl p-4 bg-gv-surface border border-gv-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-gv-muted">
              <Link2 className="w-4 h-4 text-gv-primary shrink-0" />
              <span>
                {tr(locale, {
                  es: 'Vincula tus cuentas para entrar con el mismo progreso en iOS, Android y Web:',
                  en: 'Link your accounts to sign in with the same progress on iOS, Android, and Web:',
                  de: 'Verknüpfe deine Konten für denselben Fortschritt auf iOS, Android und Web:',
                  fr: 'Lie tes comptes pour retrouver ta progression sur iOS, Android et Web :',
                  ja: 'iOS・Android・Webで同じ進捗を利用するためにアカウントを連携:',
                  pt: 'Vincule suas contas para acessar o mesmo progresso no iOS, Android e Web:',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {!hasAppleLinked && (
                <button
                  type="button"
                  onClick={handleLinkApple}
                  disabled={loadingAuth}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <AppleLogo className="w-3.5 h-3.5" />
                  <span>
                    {tr(locale, {
                      es: 'Vincular con Apple',
                      en: 'Link Apple',
                      de: 'Mit Apple verknüpfen',
                      fr: 'Lier Apple',
                      ja: 'Appleと連携',
                      pt: 'Vincular Apple',
                    })}
                  </span>
                </button>
              )}
              {!hasGoogleLinked && (
                <button
                  type="button"
                  onClick={handleLinkGoogle}
                  disabled={loadingAuth}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <GoogleLogo className="w-3.5 h-3.5" />
                  <span>
                    {tr(locale, {
                      es: 'Vincular con Google',
                      en: 'Link Google',
                      de: 'Mit Google verknüpfen',
                      fr: 'Lier Google',
                      ja: 'Googleと連携',
                      pt: 'Vincular Google',
                    })}
                  </span>
                </button>
              )}
            </div>
          </div>
        )
      )}

      {/* 3. Rank Progress Card (Tarjeta de Progreso de Rango) */}
      <div className="bg-gv-surface border border-gv-border rounded-2xl p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs font-bold text-gv-text">
              {rankProgressData.nextRankText}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#F59E0B]">
            {rankProgressData.targetText}
          </span>
        </div>
        <CellProgressBar
          progress={rankProgressData.progress}
          segments={10}
          activeColor="#F59E0B"
          height={10}
        />
      </div>

      {/* 4. Official Certificate Section (Certificado Oficial de Maestría) */}
      {stats.isPro && hasCompletedAll ? (
        <div
          className={`rounded-[20px] p-5 border-[1.5px] flex flex-col gap-4 ${
            isLight
              ? 'bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-gv-surface border-[#D4AF37] shadow-[0_8px_24px_rgba(212,175,55,0.15)]'
              : 'bg-gradient-to-br from-[#0F2419] via-[#131D18] to-[#1F1A0E] border-[#D4AF37] shadow-[0_8px_24px_rgba(212,175,55,0.18)]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wider uppercase ${
                isLight
                  ? 'bg-amber-500/15 border-amber-600/35 text-amber-900'
                  : 'bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#F3E5AB]'
              }`}
            >
              <DiplomaBadgeIcon className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-[#D4AF37]'}`} />
              {tr(locale, {
                es: 'CERTIFICADO OFICIAL GRIDVERSE',
                en: 'OFFICIAL GRIDVERSE CERTIFICATE',
                de: 'OFFIZIELLES GRIDVERSE-ZERTIFIKAT',
                fr: 'CERTIFICAT OFFICIEL GRIDVERSE',
                ja: 'GRIDVERSE 公式認定証',
                pt: 'CERTIFICADO OFICIAL GRIDVERSE',
              })}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-gv-primary/20 text-gv-primary text-[10px] font-mono font-extrabold">
              {tr(locale, {
                es: '100% COMPLETADO',
                en: '100% COMPLETED',
                de: '100% ABGESCHLOSSEN',
                fr: '100% COMPLÉTÉ',
                ja: '100% 完了',
                pt: '100% CONCLUÍDO',
              })}
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-[54px] h-[54px] rounded-[14px] bg-gradient-to-br from-[#D4AF37] to-[#996515] flex items-center justify-center text-[#090E17] shadow-lg shrink-0">
              <DiplomaBadgeIcon className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-black text-gv-text">
                {tr(locale, {
                  es: 'Maestría Oficial en Hojas de Cálculo',
                  en: 'Official Spreadsheet Mastery',
                  de: 'Offizielle Tabellenkalkulations-Meisterschaft',
                  fr: 'Maîtrise Officielle des Tableurs',
                  ja: 'スプレッドシート公式マスター認定',
                  pt: 'Maestria Oficial em Planilhas',
                })}
              </h3>
              <p className="text-xs text-gv-muted mt-0.5">
                {tr(locale, {
                  es: 'Otorgado a',
                  en: 'Awarded to',
                  de: 'Verliehen an',
                  fr: 'Décerné à',
                  ja: '授与者:',
                  pt: 'Concedido a',
                })}{' '}
                <strong className="text-gv-text">{userName}</strong> ·{' '}
                {tr(locale, {
                  es: 'ID Verificado',
                  en: 'Verified ID',
                  de: 'Verifizierte ID',
                  fr: 'ID Vérifié',
                  ja: '認証済みID',
                  pt: 'ID Verificado',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setShowCertificateModal(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#090E17] text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>
                {tr(locale, {
                  es: 'Descargar Certificado',
                  en: 'Download Certificate',
                  de: 'Zertifikat herunterladen',
                  fr: 'Télécharger le Certificat',
                  ja: '認定証をダウンロード',
                  pt: 'Baixar Certificado',
                })}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setShowCertificateModal(true);
              }}
              className={`py-3 px-4 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight
                  ? 'border-amber-600/40 text-amber-900 hover:bg-amber-500/10'
                  : 'border-[#D4AF37]/60 text-[#F3E5AB] hover:bg-[#D4AF37]/10'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>
                {tr(locale, {
                  es: 'Ver',
                  en: 'View',
                  de: 'Ansehen',
                  fr: 'Voir',
                  ja: '表示',
                  pt: 'Ver',
                })}
              </span>
            </button>
          </div>
        </div>
      ) : stats.isPro && !hasCompletedAll ? (
        <div
          className={`rounded-[18px] p-4 border flex flex-col gap-3 ${
            isLight
              ? 'bg-gradient-to-r from-amber-500/12 via-amber-500/5 to-gv-surface border-amber-500/35 shadow-sm'
              : 'bg-gv-surface border-[#D4AF37]/40'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                  isLight
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-700'
                    : 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]'
                }`}
              >
                <DiplomaBadgeIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-gv-text truncate">
                  {tr(locale, {
                    es: 'Certificado Oficial de Maestría',
                    en: 'Official Mastery Certificate',
                    de: 'Offizielles Meister-Zertifikat',
                    fr: 'Certificat Officiel de Maîtrise',
                    ja: '公式マスター認定証',
                    pt: 'Certificado Oficial de Maestria',
                  })}
                </h3>
                <p className={`text-xs font-semibold ${isLight ? 'text-amber-800' : 'text-[#D4AF37]'}`}>
                  {tr(locale, {
                    es: 'Beneficio exclusivo de Gridverse Pro',
                    en: 'Exclusive Gridverse Pro benefit',
                    de: 'Exklusiver Vorteil von Gridverse Pro',
                    fr: 'Avantage exclusif Gridverse Pro',
                    ja: 'Gridverse Pro限定特典',
                    pt: 'Benefício exclusivo do Gridverse Pro',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-extrabold ${
                  isLight
                    ? 'bg-amber-500/15 text-amber-900 border border-amber-500/30'
                    : 'bg-[#D4AF37]/15 text-[#F3E5AB]'
                }`}
              >
                {certPercent}%
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setShowCertificateModal(true);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900'
                    : 'bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#F3E5AB]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {tr(locale, {
                    es: 'Vista previa',
                    en: 'Preview',
                    de: 'Vorschau',
                    fr: 'Aperçu',
                    ja: 'プレビュー',
                    pt: 'Prévia',
                  })}
                </span>
              </button>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-gv-surface-high overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-all duration-300"
              style={{ width: `${certPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gv-muted">
            <span>
              {tr(locale, {
                es: `${completedPlayableCount} de ${totalPlayableLevels} niveles completados`,
                en: `${completedPlayableCount} of ${totalPlayableLevels} levels completed`,
                de: `${completedPlayableCount} von ${totalPlayableLevels} Leveln abgeschlossen`,
                fr: `${completedPlayableCount} sur ${totalPlayableLevels} niveaux terminés`,
                ja: `${totalPlayableLevels}レベル中${completedPlayableCount}クリア`,
                pt: `${completedPlayableCount} de ${totalPlayableLevels} níveis concluídos`,
              })}
            </span>
            <span className="text-gv-text font-semibold">
              {Math.max(0, totalPlayableLevels - completedPlayableCount)}{' '}
              {tr(locale, {
                es: 'restantes',
                en: 'remaining',
                de: 'übrig',
                fr: 'restants',
                ja: '残り',
                pt: 'restantes',
              })}
            </span>
          </div>
        </div>
      ) : !stats.isPro && hasCompletedAll ? (
        <div
          className={`rounded-[20px] p-5 border-[1.5px] flex flex-col gap-3.5 ${
            isLight
              ? 'bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-gv-surface border-amber-500/50 shadow-sm'
              : 'bg-gradient-to-br from-[#1C180D] to-gv-surface border-[#D4AF37]/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isLight
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-700'
                  : 'bg-[#D4AF37]/20 text-[#D4AF37]'
              }`}
            >
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gv-text">
                {tr(locale, {
                  es: '¡Mapa Completado! Reclama tu Certificado',
                  en: 'Map Completed! Claim Your Certificate',
                  de: 'Karte abgeschlossen! Hol dir dein Zertifikat',
                  fr: 'Carte terminée ! Réclame ton Certificat',
                  ja: 'マップ制覇！認定証を受け取ろう',
                  pt: 'Mapa Concluído! Resgate seu Certificado',
                })}
              </h3>
              <p className={`text-xs ${isLight ? 'text-amber-800 font-semibold' : 'text-[#F3E5AB]'}`}>
                {tr(locale, {
                  es: 'Desbloquea tu Certificado Oficial con Gridverse Pro',
                  en: 'Unlock your Official Certificate with Gridverse Pro',
                  de: 'Schalte dein offizielles Zertifikat mit Gridverse Pro frei',
                  fr: 'Débloque ton Certificat Officiel avec Gridverse Pro',
                  ja: 'Gridverse Proで公式認定証をアンロック',
                  pt: 'Desbloqueie seu Certificado Oficial com o Gridverse Pro',
                })}
              </p>
            </div>
          </div>
          <p className="text-xs text-gv-muted">
            {tr(locale, {
              es: 'Has superado todas las regiones de Gridverse. Actualiza a Pro para emitir y descargar tu certificado oficial personalizado con código de verificación único.',
              en: 'You completed every region in Gridverse. Upgrade to Pro to issue and download your personalized official certificate with a unique verification code.',
              de: 'Du hast alle Regionen abgeschlossen. Upgrade auf Pro, um dein offizielles Zertifikat mit eindeutigem Verifizierungscode herunterzuladen.',
              fr: 'Tu as terminé toutes les régions de Gridverse. Passe à Pro pour émettre et télécharger ton certificat officiel personnalisé avec code de vérification.',
              ja: 'Gridverseの全リージョンをクリアしました。Proにアップグレードして認証コード付きの公式認定証を発行・ダウンロードしましょう。',
              pt: 'Você superou todas as regiões do Gridverse. Atualize para o Pro para emitir e baixar seu certificado oficial com código de verificação único.',
            })}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                onNavigateTab?.('shop');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#090E17] text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {tr(locale, {
                  es: 'Desbloquear Certificado con Pro',
                  en: 'Unlock Certificate with Pro',
                  de: 'Mit Pro freischalten',
                  fr: 'Débloquer avec Pro',
                  ja: 'Proで認定証をアンロック',
                  pt: 'Desbloquear Certificado com Pro',
                })}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setShowCertificateModal(true);
              }}
              className={`py-2.5 px-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                isLight
                  ? 'border-amber-600/35 text-amber-900 hover:bg-amber-500/10'
                  : 'border-[#D4AF37]/50 text-[#F3E5AB] hover:bg-[#D4AF37]/10'
              }`}
            >
              {tr(locale, {
                es: 'Ver muestra',
                en: 'Sample',
                de: 'Muster',
                fr: 'Exemple',
                ja: 'サンプル',
                pt: 'Ver amostra',
              })}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            sound.play('tap');
            onNavigateTab?.('shop');
          }}
          className={`rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
            isLight
              ? 'bg-gradient-to-r from-amber-500/12 via-amber-500/5 to-gv-surface border border-amber-500/35 hover:border-amber-600/60 shadow-sm'
              : 'bg-gradient-to-r from-[#1A160B] to-gv-surface border border-[#D4AF37]/45 hover:border-[#D4AF37]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                isLight
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-700'
                  : 'bg-[#D4AF37]/15 border-[#D4AF37]/35 text-[#D4AF37]'
              }`}
            >
              <DiplomaBadgeIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-extrabold text-gv-text">
                  {tr(locale, {
                    es: 'Certificación Oficial de Excel',
                    en: 'Official Excel Certification',
                    de: 'Offizielle Excel-Zertifizierung',
                    fr: 'Certification Officielle Excel',
                    ja: 'Excel 公式認定証',
                    pt: 'Certificação Oficial de Excel',
                  })}
                </h3>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider ${
                    isLight
                      ? 'bg-amber-500/15 text-amber-900 border border-amber-500/30'
                      : 'bg-[#D4AF37]/20 text-[#F3E5AB]'
                  }`}
                >
                  PRO
                </span>
              </div>
              <p className="text-xs text-gv-muted mt-0.5">
                {tr(locale, {
                  es: 'Obtén tu certificado con verificación oficial al completar el mapa con Pro.',
                  en: 'Earn your verified certificate upon completing the map with Pro.',
                  de: 'Erhalte dein offizielles Zertifikat nach Abschluss der Karte mit Pro.',
                  fr: 'Obtiens ton certificat vérifié en complétant la carte avec Pro.',
                  ja: 'Proでマップをコンプリートすると公式認定証を取得できます。',
                  pt: 'Obtenha seu certificado oficial ao concluir o mapa com o Pro.',
                })}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1.5 rounded-lg border text-xs font-black flex items-center gap-1.5 shrink-0 transition-colors shadow-sm ${
              isLight
                ? 'bg-[#D4AF37] border-amber-600/30 text-[#090E17] hover:bg-[#e3be42]'
                : 'bg-[#D4AF37] border-[#D4AF37] text-[#090E17] hover:bg-[#e3be42]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {tr(locale, {
                es: 'Desbloquear',
                en: 'Unlock',
                de: 'Freischalten',
                fr: 'Débloquer',
                ja: 'アンロック',
                pt: 'Desbloquear',
              })}
            </span>
          </span>
        </div>
      )}

      {/* 5. Mastery Learning Dashboard */}
      {/* 5.1 4 KPI Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Precisión */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 flex items-center justify-center text-[#10B981]">
              <Target className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#10B981]/15 text-[#10B981] text-[9px] font-mono font-extrabold">
              {tr(locale, {
                es: 'EXCELENTE',
                en: 'EXCELLENT',
                de: 'EXZELLENT',
                fr: 'EXCELLENT',
                ja: '優秀',
                pt: 'EXCELENTE',
              })}
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-gv-text font-mono leading-tight">
              {masteryData.accuracyPercent}%
            </p>
            <p className="text-xs text-gv-muted font-medium">
              {tr(locale, {
                es: 'Precisión',
                en: 'Accuracy',
                de: 'Genauigkeit',
                fr: 'Précision',
                ja: '正答率',
                pt: 'Precisão',
              })}
            </p>
          </div>
        </div>

        {/* Velocidad */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#0EA5E9]/15 flex items-center justify-center text-[#0EA5E9]">
              <Zap className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#0EA5E9]/15 text-[#0EA5E9] text-[9px] font-mono font-extrabold">
              {tr(locale, {
                es: 'RITMO PRO',
                en: 'PRO PACE',
                de: 'PRO-TEMPO',
                fr: 'RYTHME PRO',
                ja: 'PROペース',
                pt: 'RITMO PRO',
              })}
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-gv-text font-mono leading-tight">~15s</p>
            <p className="text-xs text-gv-muted font-medium">
              {tr(locale, {
                es: 'Velocidad',
                en: 'Speed',
                de: 'Tempo',
                fr: 'Vitesse',
                ja: '解答速度',
                pt: 'Velocidade',
              })}
            </p>
          </div>
        </div>

        {/* Fórmulas */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B]">
              <Sigma className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#F59E0B]/15 text-[#F59E0B] text-[9px] font-mono font-extrabold">
              {tr(locale, {
                es: 'CATÁLOGO',
                en: 'CATALOG',
                de: 'KATALOG',
                fr: 'CATALOGUE',
                ja: '習得数',
                pt: 'CATÁLOGO',
              })}
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-gv-text font-mono leading-tight">
              {masteryData.unlockedFormulas} / 24
            </p>
            <p className="text-xs text-gv-muted font-medium">
              {tr(locale, {
                es: 'Fórmulas',
                en: 'Formulas',
                de: 'Formeln',
                fr: 'Formules',
                ja: '習得関数',
                pt: 'Fórmulas',
              })}
            </p>
          </div>
        </div>

        {/* Eficiencia */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#A855F7]/15 flex items-center justify-center text-[#A855F7]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#A855F7]/15 text-[#A855F7] text-[9px] font-mono font-extrabold">
              TOP RANK
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-gv-text font-mono leading-tight">
              {masteryData.efficiencyGrade}
            </p>
            <p className="text-xs text-gv-muted font-medium">
              {tr(locale, {
                es: 'Eficiencia',
                en: 'Efficiency',
                de: 'Effizienz',
                fr: 'Efficacité',
                ja: '効率ランク',
                pt: 'Eficiência',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 5.2 Dominio de Hojas de Cálculo (Gráfica de Maestría por Habilidades) */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-extrabold text-gv-text">
            {tr(locale, {
              es: 'Dominio de Hojas de Cálculo',
              en: 'Spreadsheet Mastery',
              de: 'Tabellen-Meisterschaft',
              fr: 'Maîtrise des Tableurs',
              ja: 'スプレッドシート習熟度',
              pt: 'Domínio de Planilhas',
            })}
          </h2>
          <p className="text-xs text-gv-muted">
            {tr(locale, {
              es: 'Progreso técnico desglosado por área',
              en: 'Technical progress broken down by skill area',
              de: 'Technischer Fortschritt nach Fachgebiet',
              fr: 'Progression technique détaillée par domaine',
              ja: '分野別のテクニカル進捗状況',
              pt: 'Progresso técnico detalhado por área',
            })}
          </p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-[18px] p-4 flex flex-col gap-3.5">
          {masteryData.skills.map((skill) => {
            const pct = Math.round(skill.progress * 100);
            const levelBadge =
              pct >= 85
                ? tr(locale, { es: 'Maestro', en: 'Master', de: 'Meister', fr: 'Maître', ja: 'マスター', pt: 'Mestre' })
                : pct >= 60
                ? tr(locale, { es: 'Avanzado', en: 'Advanced', de: 'Fortgeschritten', fr: 'Avancé', ja: '上級', pt: 'Avançado' })
                : pct >= 35
                ? tr(locale, { es: 'Intermedio', en: 'Intermediate', de: 'Mittelstufe', fr: 'Intermédiaire', ja: '中級', pt: 'Intermediário' })
                : pct > 8
                ? tr(locale, { es: 'Aprendiendo', en: 'Learning', de: 'Lernend', fr: 'En cours', ja: '学習中', pt: 'Aprendendo' })
                : tr(locale, { es: 'Sin iniciar', en: 'Not started', de: 'Nicht begonnen', fr: 'Non commencé', ja: '未開始', pt: 'Não iniciado' });
            const Icon = skill.Icon;
            return (
              <div key={skill.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${skill.color}24`,
                      border: `1px solid ${skill.color}55`,
                      color: skill.color,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-gv-text truncate">
                        {skill.title}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-extrabold"
                        style={{
                          backgroundColor: `${skill.color}22`,
                          color: skill.color,
                        }}
                      >
                        {levelBadge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gv-muted truncate">
                      {skill.subtitle}
                    </p>
                  </div>
                  <span
                    className="text-xs font-mono font-extrabold shrink-0"
                    style={{ color: skill.color }}
                  >
                    {pct}%
                  </span>
                </div>
                <CellProgressBar
                  progress={skill.progress}
                  segments={10}
                  activeColor={skill.color}
                  height={8}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 5.3 Actividad Semanal (Gráfica de Barras Semanal) */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-extrabold text-gv-text">
            {tr(locale, {
              es: 'Actividad Semanal',
              en: 'Weekly Activity',
              de: 'Wochenaktivität',
              fr: 'Activité Hebdomadaire',
              ja: '週間アクティビティ',
              pt: 'Atividade Semanal',
            })}
          </h2>
          <p className="text-xs text-gv-muted">
            {tr(locale, {
              es: 'Celdas y ejercicios resueltos por día',
              en: 'Cells and exercises solved per day',
              de: 'Gelöste Zellen und Übungen pro Tag',
              fr: 'Cellules et exercices résolus par jour',
              ja: '日別のクリアセル数',
              pt: 'Células e exercícios resolvidos por dia',
            })}
          </p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-[18px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gv-text">
              <Flame className="w-4 h-4 text-gv-streak" />
              <span>
                {tr(locale, {
                  es: `Racha activa: ${stats.streak} días`,
                  en: `Active streak: ${stats.streak} days`,
                  de: `Aktive Serie: ${stats.streak} Tage`,
                  fr: `Série active : ${stats.streak} jours`,
                  ja: `連続記録: ${stats.streak} 日`,
                  pt: `Ofensiva ativa: ${stats.streak} dias`,
                })}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-gv-primary/15 text-gv-primary text-[10px] font-mono font-bold">
              {tr(locale, {
                es: 'META DIARIA: 1+ CELDA',
                en: 'DAILY GOAL: 1+ CELL',
                de: 'TAGESZIEL: 1+ ZELLE',
                fr: 'OBJECTIF : 1+ CELLULE',
                ja: 'デイリー目標: 1+ セル',
                pt: 'META DIÁRIA: 1+ CÉLULA',
              })}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end pt-2">
            {weeklyActivity.items.map((item) => {
              const barRatio =
                item.count > 0
                  ? Math.max(0.22, Math.min(1, item.count / weeklyActivity.maxVal))
                  : 0.1;
              const barHeight = Math.round(68 * barRatio);
              return (
                <div key={item.key} className="flex flex-col items-center gap-1.5">
                  <div className="h-4 flex items-center justify-center">
                    {item.isToday ? (
                      <Flame
                        className={`w-3.5 h-3.5 ${
                          item.count > 0 ? 'text-gv-streak' : 'text-gv-muted'
                        }`}
                      />
                    ) : item.count > 0 ? (
                      <span className="text-[10px] font-mono font-bold text-gv-primary">
                        {item.count}
                      </span>
                    ) : null}
                  </div>
                  <div className="w-full max-w-[30px] h-[68px] rounded-lg bg-gv-surface-high border border-gv-border/70 flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-md transition-all duration-300"
                      style={{
                        height: `${barHeight}px`,
                        background:
                          item.count > 0
                            ? item.isToday
                              ? 'linear-gradient(to top, #21C26B, #7CFFB2)'
                              : 'linear-gradient(to top, rgba(33,194,107,0.6), #21C26B)'
                            : 'transparent',
                        boxShadow:
                          item.isToday && item.count > 0
                            ? '0 0 8px rgba(33,194,107,0.4)'
                            : undefined,
                      }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-mono ${
                      item.isToday
                        ? 'font-extrabold text-gv-primary'
                        : 'font-medium text-gv-muted'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5.4 GitHub-Style Streak Calendar (Historial de Actividad Git) */}
      <div className="bg-gv-surface border border-gv-border rounded-[18px] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gv-streak/15 border border-gv-streak/30 text-gv-streak">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gv-text">
                {tr(locale, {
                  es: 'Historial de Actividad Git',
                  en: 'Git Activity History',
                  de: 'Git-Aktivitätsverlauf',
                  fr: 'Historique d’Activité Git',
                  ja: 'Gitスタイル学習履歴',
                  pt: 'Histórico de Atividade Git',
                })}
              </h3>
              <p className="text-[11px] text-gv-muted">
                {tr(locale, {
                  es: 'Tus celdas completadas día a día',
                  en: 'Your completed cells day by day',
                  de: 'Deine täglich abgeschlossenen Zellen',
                  fr: 'Tes cellules complétées jour après jour',
                  ja: '日々のクリアセル記録',
                  pt: 'Suas células concluídas dia a dia',
                })}
              </p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-gv-primary/15 border border-gv-primary/40 flex items-center gap-1 text-gv-primary text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5 text-gv-streak" />
            <span>{stats.streak}d</span>
          </div>
        </div>

        {/* Heatmap Grid (18 weeks x 7 days) */}
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex items-start gap-2 min-w-full justify-between">
            {/* Weekday Labels Column */}
            <div className="flex flex-col gap-[4px] pt-[18px] pr-1 text-[9px] font-mono text-gv-muted select-none">
              <span className="h-[13px] leading-[13px]">L</span>
              <span className="h-[13px] leading-[13px]"></span>
              <span className="h-[13px] leading-[13px]">X</span>
              <span className="h-[13px] leading-[13px]"></span>
              <span className="h-[13px] leading-[13px]">V</span>
              <span className="h-[13px] leading-[13px]"></span>
              <span className="h-[13px] leading-[13px]">D</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex items-start gap-[4px] flex-1 justify-between">
              {gitCalendarData.map((week) => (
                <div key={week.weekIndex} className="flex flex-col gap-[4px]">
                  <span className="h-[14px] text-[9px] font-mono text-gv-muted leading-[14px]">
                    {week.monthLabel}
                  </span>
                  {week.days.map((day) => {
                    const bgClass = day.isFuture
                      ? 'bg-gv-surface-high/35 border-transparent'
                      : day.intensity === 4
                      ? 'bg-gv-accent border-gv-primary shadow-[0_0_6px_rgba(124,255,178,0.4)]'
                      : day.intensity === 3
                      ? 'bg-gv-primary border-gv-primary'
                      : day.intensity === 2
                      ? 'bg-gv-primary/65 border-gv-primary/40'
                      : day.intensity === 1
                      ? 'bg-gv-primary/35 border-gv-primary/30'
                      : 'bg-gv-surface-high border-gv-border/60';

                    return (
                      <button
                        key={day.dateKey}
                        type="button"
                        disabled={day.isFuture}
                        onClick={() =>
                          setSelectedHeatmapCell({
                            dateKey: day.dateKey,
                            label: day.humanLabel,
                            count: day.count,
                          })
                        }
                        title={`${day.humanLabel}: ${
                          day.count > 0
                            ? `${day.count} ${day.count === 1 ? 'celda completada' : 'celdas completadas'}`
                            : 'Sin actividad'
                        }`}
                        className={`w-[13px] h-[13px] rounded-[3.5px] border transition-transform hover:scale-125 cursor-pointer ${bgClass} ${
                          day.isToday ? 'ring-1 ring-white' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedHeatmapCell && (
          <div className="px-3 py-1.5 rounded-lg bg-gv-surface-high border border-gv-border flex items-center justify-between text-[11px]">
            <span className="font-mono text-gv-text">
              <strong className="text-gv-primary">{selectedHeatmapCell.label}:</strong>{' '}
              {selectedHeatmapCell.count > 0
                ? `${selectedHeatmapCell.count} ${
                    selectedHeatmapCell.count === 1 ? 'celda superada' : 'celdas superadas'
                  }`
                : 'Sin actividad registrada'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedHeatmapCell(null)}
              className="text-gv-muted hover:text-gv-text cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Footer Legend */}
        <div className="flex items-center justify-between text-[11px] text-gv-muted pt-1 border-t border-gv-border/50">
          <span className="font-mono">{completedPlayableCount} ✓</span>
          <div className="flex items-center gap-1">
            <span>{tr(locale, { es: 'Menos', en: 'Less', de: 'Weniger', fr: 'Moins', ja: '少', pt: 'Menos' })}</span>
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-surface-high border border-gv-border/60 inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-primary/35 inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-primary/65 inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-primary inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-accent inline-block" />
            <span>{tr(locale, { es: 'Más', en: 'More', de: 'Mehr', fr: 'Plus', ja: '多', pt: 'Mais' })}</span>
          </div>
        </div>
      </div>

      {/* 6. Complementary Resources Row (Estrellas & Gemas acumuladas) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gv-gold/15 text-gv-gold shrink-0">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-base font-black text-gv-text font-mono leading-tight">
              {totalStars}
            </p>
            <p className="text-xs text-gv-muted">
              {tr(locale, {
                es: 'Estrellas',
                en: 'Stars',
                de: 'Sterne',
                fr: 'Étoiles',
                ja: '獲得スター',
                pt: 'Estrelas',
              })}
            </p>
          </div>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gv-bytes/15 text-gv-bytes shrink-0">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <p className="text-base font-black text-gv-text font-mono leading-tight">
              {stats.gems}
            </p>
            <p className="text-xs text-gv-muted">
              {tr(locale, {
                es: 'Gemas acumuladas',
                en: 'Collected Gems',
                de: 'Gesammelte Edelsteine',
                fr: 'Gemmes accumulées',
                ja: '所持ジェム',
                pt: 'Gemas acumuladas',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 7. Recommend & Rate Gridverse Cards */}
      <div className="flex flex-col gap-2.5">
        {/* Recomendar Gridverse */}
        <button
          type="button"
          onClick={handleRecommendApp}
          className="w-full text-left rounded-2xl p-4 bg-gradient-to-br from-gv-primary/20 to-gv-surface border border-gv-primary/40 hover:border-gv-primary flex items-center justify-between gap-3 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gv-primary/20 border border-gv-primary/40 flex items-center justify-center text-gv-accent shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-gv-text">
                {tr(locale, {
                  es: 'Recomendar Gridverse',
                  en: 'Recommend Gridverse',
                  de: 'Gridverse weiterempfehlen',
                  fr: 'Recommander Gridverse',
                  ja: 'Gridverseを友達に紹介',
                  pt: 'Recomendar Gridverse',
                })}
              </h3>
              <p className="text-xs text-gv-muted truncate">
                {tr(locale, {
                  es: 'Invita a un amigo o colega a dominar Excel',
                  en: 'Invite a friend or colleague to master Excel',
                  de: 'Lade Freunde oder Kollegen ein, Excel zu meistern',
                  fr: 'Invite un ami ou collègue à maîtriser Excel',
                  ja: '友人や同僚を招待して一緒にExcelをマスター',
                  pt: 'Convide um amigo ou colega para dominar o Excel',
                })}
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-gv-primary text-black text-xs font-extrabold shrink-0">
            {tr(locale, {
              es: 'Invitar',
              en: 'Invite',
              de: 'Einladen',
              fr: 'Inviter',
              ja: '招待する',
              pt: 'Convidar',
            })}
          </span>
        </button>

        {/* Calificar Gridverse */}
        <button
          type="button"
          onClick={() => {
            sound.play('tap');
            setShowRateModal(true);
          }}
          className="w-full text-left rounded-2xl p-4 bg-gradient-to-br from-[#F59E0B]/20 to-gv-surface border border-[#F59E0B]/40 hover:border-[#F59E0B] flex items-center justify-between gap-3 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-gv-text">
                {tr(locale, {
                  es: 'Calificar Gridverse',
                  en: 'Rate Gridverse',
                  de: 'Gridverse bewerten',
                  fr: 'Évaluer Gridverse',
                  ja: 'Gridverseを評価する',
                  pt: 'Avaliar Gridverse',
                })}
              </h3>
              <p className="text-xs text-gv-muted truncate">
                {tr(locale, {
                  es: '⭐⭐⭐⭐⭐ Apóyanos con tu reseña de 5 estrellas',
                  en: '⭐⭐⭐⭐⭐ Support us with your 5-star review',
                  de: '⭐⭐⭐⭐⭐ Unterstütze uns mit 5 Sternen',
                  fr: '⭐⭐⭐⭐⭐ Soutiens-nous avec un avis 5 étoiles',
                  ja: '⭐⭐⭐⭐⭐ 5つ星レビューで応援してください',
                  pt: '⭐⭐⭐⭐⭐ Apoie-nos com sua avaliação 5 estrelas',
                })}
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-[#F59E0B] text-black text-xs font-extrabold shrink-0">
            {tr(locale, {
              es: 'Calificar',
              en: 'Rate',
              de: 'Bewerten',
              fr: 'Noter',
              ja: '評価する',
              pt: 'Avaliar',
            })}
          </span>
        </button>
      </div>

      {/* 8. Integrated Settings (ProfileSettingsView) */}
      <div className="pt-2 flex flex-col gap-5">
        <div className="border-t border-gv-border pt-5">
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-gv-muted mb-2.5">
            {tr(locale, {
              es: 'PREFERENCIAS DE JUEGO',
              en: 'GAME PREFERENCES',
              de: 'SPIELEINSTELLUNGEN',
              fr: 'PRÉFÉRENCES DE JEU',
              ja: 'アプリ設定',
              pt: 'PREFERÊNCIAS DE JOGO',
            })}
          </h2>
          <div className="bg-gv-surface border border-gv-border rounded-2xl divide-y divide-gv-border overflow-hidden">
            {/* Idioma */}
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setShowLanguageModal(true);
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gv-accent" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gv-text">
                    {tr(locale, {
                      es: 'Idioma',
                      en: 'Language',
                      de: 'Sprache',
                      fr: 'Langue',
                      ja: '言語 (Language)',
                      pt: 'Idioma',
                    })}
                  </p>
                  <p className="text-xs text-gv-muted">
                    {tr(stats.locale, {
                      es: '🇪🇸 Español',
                      en: '🇺🇸 English',
                      de: '🇩🇪 Deutsch',
                      fr: '🇫🇷 Français',
                      ja: '🇯🇵 日本語',
                      pt: '🇧🇷 Português',
                    })}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gv-muted" />
            </button>

            {/* Tema de la interfaz (Modo Claro / Oscuro) */}
            <div className="p-4 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                {stats.theme === 'light' ? (
                  <Sun className="w-5 h-5 text-gv-warning shrink-0" />
                ) : (
                  <Moon className="w-5 h-5 text-gv-accent shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gv-text truncate">
                    {tr(locale, {
                      es: 'Tema de la interfaz',
                      en: 'Interface Theme',
                      de: 'Design',
                      fr: "Thème de l'interface",
                      ja: 'テーマ',
                      pt: 'Tema da interface',
                    })}
                  </p>
                  <p className="text-xs text-gv-muted truncate">
                    {stats.theme === 'light'
                      ? tr(locale, {
                          es: 'Modo claro activo',
                          en: 'Light mode active',
                          de: 'Hellmodus aktiv',
                          fr: 'Mode clair actif',
                          ja: 'ライトモード有効',
                          pt: 'Modo claro ativo',
                        })
                      : tr(locale, {
                          es: 'Modo oscuro activo',
                          en: 'Dark mode active',
                          de: 'Dunkelmodus aktiv',
                          fr: 'Mode sombre actif',
                          ja: 'ダークモード有効',
                          pt: 'Modo escuro ativo',
                        })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gv-surface-high border border-gv-border rounded-xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (stats.theme !== 'dark') {
                      sound.play('tap');
                      onUpdateStats?.({ ...stats, theme: 'dark' });
                    }
                  }}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    stats.theme !== 'light'
                      ? 'bg-gv-surface text-gv-text shadow-sm border border-gv-border'
                      : 'text-gv-muted hover:text-gv-text'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>
                    {tr(locale, {
                      es: 'Oscuro',
                      en: 'Dark',
                      de: 'Dunkel',
                      fr: 'Sombre',
                      ja: 'ダーク',
                      pt: 'Escuro',
                    })}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (stats.theme !== 'light') {
                      sound.play('tap');
                      onUpdateStats?.({ ...stats, theme: 'light' });
                    }
                  }}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    stats.theme === 'light'
                      ? 'bg-gv-surface text-gv-text shadow-sm border border-gv-border'
                      : 'text-gv-muted hover:text-gv-text'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-gv-warning" />
                  <span>
                    {tr(locale, {
                      es: 'Claro',
                      en: 'Light',
                      de: 'Hell',
                      fr: 'Clair',
                      ja: 'ライト',
                      pt: 'Claro',
                    })}
                  </span>
                </button>
              </div>
            </div>

            {/* Efectos de sonido (SFX) */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gv-accent" />
                <div>
                  <p className="text-sm font-semibold text-gv-text">
                    {tr(locale, {
                      es: 'Efectos de sonido (SFX)',
                      en: 'Sound Effects (SFX)',
                      de: 'Soundeffekte (SFX)',
                      fr: 'Effets sonores (SFX)',
                      ja: '効果音 (SFX)',
                      pt: 'Efeitos sonoros (SFX)',
                    })}
                  </p>
                  <p className="text-xs text-gv-muted">
                    {tr(locale, {
                      es: 'Sonidos al tocar celdas, acertar o fallar',
                      en: 'Sounds when tapping cells, solving, or missing',
                      de: 'Töne beim Antippen, Lösen oder Fehlern',
                      fr: 'Sons lors du toucher des cellules et validations',
                      ja: 'セル選択や正解・不正解時のサウンド',
                      pt: 'Sons ao tocar células, acertar ou errar',
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={stats.soundEnabled}
                onClick={() => {
                  const next = !stats.soundEnabled;
                  sound.setSfxEnabled(next);
                  if (next) sound.play('tap');
                  onUpdateStats?.({ ...stats, soundEnabled: next });
                }}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  stats.soundEnabled ? 'bg-gv-primary' : 'bg-gv-surface-high border border-gv-border'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    stats.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Música de fondo (BGM) */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-gv-accent" />
                <div>
                  <p className="text-sm font-semibold text-gv-text">
                    {tr(locale, {
                      es: 'Música de fondo (BGM)',
                      en: 'Background Music (BGM)',
                      de: 'Hintergrundmusik (BGM)',
                      fr: 'Musique de fond (BGM)',
                      ja: 'BGM（背景音楽）',
                      pt: 'Música de fundo (BGM)',
                    })}
                  </p>
                  <p className="text-xs text-gv-muted">
                    {tr(locale, {
                      es: 'Ambientación musical durante las lecciones',
                      en: 'Chill ambient music during lessons',
                      de: 'Entspannte Musik während der Lektionen',
                      fr: 'Ambiance musicale pendant les leçons',
                      ja: 'レッスン中のチルBGM',
                      pt: 'Ambientação musical durante as lições',
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={bgmEnabled}
                onClick={() => {
                  const next = !bgmEnabled;
                  setBgmEnabled(next);
                  try {
                    localStorage.setItem('gridverse_bgm_enabled', String(next));
                  } catch {
                    // ignore
                  }
                  if (!next) {
                    sound.stopBgm();
                  } else {
                    sound.play('tap');
                  }
                }}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  bgmEnabled ? 'bg-gv-primary' : 'bg-gv-surface-high border border-gv-border'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    bgmEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Recordatorio de racha */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gv-streak" />
                <div>
                  <p className="text-sm font-semibold text-gv-text">
                    {tr(locale, {
                      es: 'Recordatorio de racha',
                      en: 'Streak Reminder',
                      de: 'Streak-Erinnerung',
                      fr: 'Rappel de série',
                      ja: '連続記録リマインダー',
                      pt: 'Lembrete de ofensiva',
                    })}
                  </p>
                  <p className="text-xs text-gv-muted">
                    {tr(locale, {
                      es: 'Aviso diario para no perder tu cadena',
                      en: 'Daily reminder to keep your streak alive',
                      de: 'Tägliche Erinnerung für deine Serie',
                      fr: 'Rappel quotidien pour garder ta série',
                      ja: '連続記録を途切れさせないための通知',
                      pt: 'Aviso diário para não perder sua sequência',
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={streakReminderEnabled}
                onClick={() => {
                  sound.play('tap');
                  const next = !streakReminderEnabled;
                  setStreakReminderEnabled(next);
                  try {
                    localStorage.setItem('gridverse_streak_reminder', String(next));
                  } catch {
                    // ignore
                  }
                  showToast(
                    next
                      ? tr(locale, {
                          es: 'Recordatorio diario de racha activado.',
                          en: 'Daily streak reminder enabled.',
                          de: 'Tägliche Streak-Erinnerung aktiviert.',
                          fr: 'Rappel quotidien de série activé.',
                          ja: 'デイリーリマインダーを有効にしました。',
                          pt: 'Lembrete diário de ofensiva ativado.',
                        })
                      : tr(locale, {
                          es: 'Recordatorio de racha desactivado.',
                          en: 'Streak reminder disabled.',
                          de: 'Streak-Erinnerung deaktiviert.',
                          fr: 'Rappel de série désactivé.',
                          ja: 'リマインダーを無効にしました。',
                          pt: 'Lembrete de ofensiva desativado.',
                        })
                  );
                }}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  streakReminderEnabled
                    ? 'bg-gv-primary'
                    : 'bg-gv-surface-high border border-gv-border'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    streakReminderEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ACCIONES Y GESTIÓN */}
        <div>
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-gv-muted mb-2.5">
            {tr(locale, {
              es: 'ACCIONES Y GESTIÓN',
              en: 'ACCOUNT & ACTIONS',
              de: 'KONTO & AKTIONEN',
              fr: 'ACTIONS ET GESTION',
              ja: 'アカウント管理',
              pt: 'AÇÕES E CONTA',
            })}
          </h2>
          <div className="bg-gv-surface border border-gv-border rounded-2xl divide-y divide-gv-border overflow-hidden">
            <button
              type="button"
              onClick={handleReopenOnboarding}
              className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-gv-accent" />
                <span className="text-sm font-medium text-gv-text">
                  {tr(locale, {
                    es: 'Ver primeros pasos de bienvenida',
                    en: 'View welcome checklist',
                    de: 'Start-Checkliste anzeigen',
                    fr: 'Voir les premiers pas de bienvenue',
                    ja: '最初のステップを再表示',
                    pt: 'Ver primeiros passos de boas-vindas',
                  })}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gv-muted" />
            </button>

            <button
              type="button"
              onClick={handleRecommendApp}
              className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-gv-primary" />
                <span className="text-sm font-medium text-gv-text">
                  {tr(locale, {
                    es: 'Recomendar Gridverse',
                    en: 'Recommend Gridverse',
                    de: 'Gridverse weiterempfehlen',
                    fr: 'Recommander Gridverse',
                    ja: 'Gridverseを紹介する',
                    pt: 'Recomendar Gridverse',
                  })}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gv-muted" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setShowRateModal(true);
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-sm font-medium text-gv-text">
                  {tr(locale, {
                    es: 'Calificar Gridverse',
                    en: 'Rate Gridverse',
                    de: 'Gridverse bewerten',
                    fr: 'Évaluer Gridverse',
                    ja: 'Gridverseを評価する',
                    pt: 'Avaliar Gridverse',
                  })}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gv-muted" />
            </button>

            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('tap');
                    setConfirmAction('signout');
                  }}
                  className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-gv-warning" />
                    <span className="text-sm font-medium text-gv-warning">
                      {tr(locale, {
                        es: 'Cerrar sesión',
                        en: 'Sign out',
                        de: 'Abmelden',
                        fr: 'Se déconnecter',
                        ja: 'ログアウト',
                        pt: 'Sair da conta',
                      })}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gv-muted" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('tap');
                    setConfirmAction('delete_account');
                  }}
                  className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <UserX className="w-5 h-5 text-gv-error" />
                    <span className="text-sm font-medium text-gv-error">
                      {tr(locale, {
                        es: 'Eliminar cuenta',
                        en: 'Delete account',
                        de: 'Konto löschen',
                        fr: 'Supprimer le compte',
                        ja: 'アカウントを削除',
                        pt: 'Excluir conta',
                      })}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gv-muted" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setConfirmAction('reset_local');
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-gv-error" />
                  <span className="text-sm font-medium text-gv-error">
                    {tr(locale, {
                      es: 'Borrar datos locales',
                      en: 'Reset local data',
                      de: 'Lokale Daten zurücksetzen',
                      fr: 'Effacer les données locales',
                      ja: 'ローカルデータをリセット',
                      pt: 'Apagar dados locais',
                    })}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gv-muted" />
              </button>
            )}
          </div>
        </div>

        {/* LEGAL Y PRIVACIDAD */}
        <div>
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-gv-muted mb-2.5">
            {tr(locale, {
              es: 'LEGAL Y PRIVACIDAD',
              en: 'LEGAL & PRIVACY',
              de: 'RECHTLICHES & DATENSCHUTZ',
              fr: 'MENTIONS LÉGALES & CONFIDENTIALITÉ',
              ja: '法的情報とプライバシー',
              pt: 'LEGAL E PRIVACIDADE',
            })}
          </h2>
          <div className="bg-gv-surface border border-gv-border rounded-2xl divide-y divide-gv-border overflow-hidden">
            <a
              href={`https://gridverse.app/${locale === 'en' ? '' : `${locale}/`}privacy/`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gv-muted" />
                <span className="text-sm font-medium text-gv-text">
                  {tr(locale, {
                    es: 'Política de Privacidad',
                    en: 'Privacy Policy',
                    de: 'Datenschutzerklärung',
                    fr: 'Politique de Confidentialité',
                    ja: 'プライバシーポリシー',
                    pt: 'Política de Privacidade',
                  })}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-gv-muted" />
            </a>

            <a
              href={`https://gridverse.app/${locale === 'en' ? '' : `${locale}/`}terms/`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gv-muted" />
                <span className="text-sm font-medium text-gv-text">
                  {tr(locale, {
                    es: 'Términos de Uso (EULA)',
                    en: 'Terms of Use (EULA)',
                    de: 'Nutzungsbedingungen (EULA)',
                    fr: "Conditions d'Utilisation (EULA)",
                    ja: '利用規約 (EULA)',
                    pt: 'Termos de Uso (EULA)',
                  })}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-gv-muted" />
            </a>
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div>
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-gv-muted mb-2.5">
            {tr(locale, {
              es: 'INFORMACIÓN',
              en: 'INFORMATION',
              de: 'INFORMATIONEN',
              fr: 'INFORMATIONS',
              ja: 'アプリ情報',
              pt: 'INFORMAÇÕES',
            })}
          </h2>
          <div className="bg-gv-surface border border-gv-border rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gv-primary/20 border border-gv-primary/40 flex items-center justify-center text-gv-primary font-mono font-black text-xs">
                  fx
                </div>
                <span className="text-sm font-black text-gv-text">Gridverse</span>
              </div>
              <span className="text-xs font-mono text-gv-muted">v1.0.0</span>
            </div>
            <p className="text-xs text-gv-muted">
              {tr(locale, {
                es: 'Domina Microsoft Excel celda por celda a través de microlecciones interactivas gamificadas.',
                en: 'Master Microsoft Excel cell by cell through gamified interactive micro-lessons.',
                de: 'Meistere Microsoft Excel Zelle für Zelle mit spielerischen Mikro-Lektionen.',
                fr: 'Maîtrise Microsoft Excel cellule par cellule grâce à des micro-leçons interactives.',
                ja: 'ゲーミフィケーション形式のマイクロレッスンで、Excelを1セルずつマスターしよう。',
                pt: 'Domine o Microsoft Excel célula por célula através de microaulas interativas gamificadas.',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Modal 1: Editar Perfil (EditProfileSheet) */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gv-text">
                {tr(locale, {
                  es: 'Editar Perfil',
                  en: 'Edit Profile',
                  de: 'Profil bearbeiten',
                  fr: 'Modifier le profil',
                  ja: 'プロフィール編集',
                  pt: 'Editar Perfil',
                })}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="text-gv-muted hover:text-gv-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold text-gv-muted mb-2.5">
                  {tr(locale, {
                    es: 'Elige tu Avatar de Celdi',
                    en: 'Choose your Celdi Avatar',
                    de: 'Wähle deinen Celdi-Avatar',
                    fr: 'Choisis ton Avatar Celdi',
                    ja: 'Celdiアバターを選択',
                    pt: 'Escolha seu Avatar do Celdi',
                  })}
                </p>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
                  {CELDI_AVATAR_OPTIONS.map((opt) => {
                    const isSelected = editAvatar === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          sound.play('tap');
                          setEditAvatar(opt.key);
                        }}
                        className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gv-primary/15 border-gv-primary scale-105'
                            : 'bg-gv-surface-high border-gv-border opacity-80 hover:opacity-100'
                        }`}
                      >
                        <CeldiMascot mood={opt.mood} size={46} />
                        <span
                          className={`text-[10px] font-bold ${
                            isSelected ? 'text-gv-primary' : 'text-gv-muted'
                          }`}
                        >
                          {opt.label[locale] || opt.label.es}
                        </span>
                      </button>
                    );
                  })}

                  {currentUser?.photoURL && currentUser.photoURL.startsWith('http') && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.play('tap');
                        setEditAvatar(currentUser.photoURL!);
                      }}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                        editAvatar === currentUser.photoURL
                          ? 'bg-gv-primary/15 border-gv-primary scale-105'
                          : 'bg-gv-surface-high border-gv-border opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={currentUser.photoURL}
                        alt="Photo"
                        className="w-[46px] h-[46px] rounded-xl object-cover"
                      />
                      <span
                        className={`text-[10px] font-bold ${
                          editAvatar === currentUser.photoURL
                            ? 'text-gv-primary'
                            : 'text-gv-muted'
                        }`}
                      >
                        {tr(locale, {
                          es: 'Foto Real',
                          en: 'Real Photo',
                          de: 'Echtes Foto',
                          fr: 'Photo réelle',
                          ja: 'プロフィール写真',
                          pt: 'Foto Real',
                        })}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gv-muted mb-1.5">
                  {tr(locale, {
                    es: 'Nombre o Nickname',
                    en: 'Name or Nickname',
                    de: 'Name oder Spitzname',
                    fr: 'Nom ou Pseudo',
                    ja: '名前またはニックネーム',
                    pt: 'Nome ou Apelido',
                  })}
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={tr(locale, {
                    es: 'Tu nombre en Gridverse...',
                    en: 'Your name in Gridverse...',
                    de: 'Dein Name in Gridverse...',
                    fr: 'Ton nom sur Gridverse...',
                    ja: 'Gridverseでの名前...',
                    pt: 'Seu nome no Gridverse...',
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-gv-surface-high border border-gv-border focus:border-gv-primary focus:outline-none text-base sm:text-sm font-bold text-gv-text"
                />
                <p className="text-[10px] text-gv-muted text-right mt-1 font-mono">
                  {editName.length}/25
                </p>
              </div>

              <button
                type="submit"
                disabled={savingProfile || !editName.trim()}
                className="w-full py-3.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingProfile
                  ? tr(locale, {
                      es: 'Guardando...',
                      en: 'Saving...',
                      de: 'Speichern...',
                      fr: 'Enregistrement...',
                      ja: '保存中...',
                      pt: 'Salvando...',
                    })
                  : tr(locale, {
                      es: 'Guardar Cambios',
                      en: 'Save Changes',
                      de: 'Änderungen speichern',
                      fr: 'Enregistrer les modifications',
                      ja: '変更を保存',
                      pt: 'Salvar Alterações',
                    })}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Certificado Oficial de Maestría (CertificateDocument) */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl flex flex-col gap-4 my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <DiplomaBadgeIcon className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm font-black text-white">
                  {tr(locale, {
                    es: 'Certificado Oficial Gridverse',
                    en: 'Official Gridverse Certificate',
                    de: 'Offizielles Gridverse-Zertifikat',
                    fr: 'Certificat Officiel Gridverse',
                    ja: 'Gridverse 公式認定証',
                    pt: 'Certificado Oficial Gridverse',
                  })}
                </span>
                {!stats.isPro ? (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                    {tr(locale, {
                      es: 'BENEFICIO EXCLUSIVO PRO',
                      en: 'EXCLUSIVE PRO BENEFIT',
                      de: 'EXKLUSIVER PRO-VORTEIL',
                      fr: 'AVANTAGE EXCLUSIF PRO',
                      ja: 'GRIDVERSE PRO限定特典',
                      pt: 'BENEFÍCIO EXCLUSIVO PRO',
                    })}
                  </span>
                ) : !hasCompletedAll ? (
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3E5AB] text-[10px] font-mono font-bold">
                    {tr(locale, {
                      es: `EN PROGRESO (${certPercent}% COMPLETADO)`,
                      en: `IN PROGRESS (${certPercent}% COMPLETED)`,
                      de: `IN BEARBEITUNG (${certPercent}% ABGESCHLOSSEN)`,
                      fr: `EN COURS (${certPercent}% COMPLÉTÉ)`,
                      ja: `進行中 (${certPercent}% 完了)`,
                      pt: `EM PROGRESSO (${certPercent}% CONCLUÍDO)`,
                    })}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-gv-primary/20 border border-gv-primary/40 text-gv-accent text-[10px] font-mono font-bold">
                    {tr(locale, {
                      es: 'OFICIAL & VERIFICADO',
                      en: 'OFFICIAL & VERIFIED',
                      de: 'OFFIZIELL & VERIFIZIERT',
                      fr: 'OFFICIEL & VÉRIFIÉ',
                      ja: '公式・認証済み',
                      pt: 'OFICIAL & VERIFICADO',
                    })}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="w-8 h-8 rounded-lg bg-gv-surface-high border border-gv-border flex items-center justify-center text-gv-muted hover:text-gv-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Minimalist Executive Certificate Document - White Parchment Default */}
            <div className="relative rounded-2xl bg-[#FCFDFD] border-[1.5px] border-[#D4AF37]/70 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden text-center flex flex-col justify-between min-h-[460px] gap-6 text-slate-900 select-none">
              {/* Subtle Hairline Inset Border */}
              <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/35 rounded-xl pointer-events-none" />

              {/* Watermark for Non-Pro or Incomplete States */}
              {!stats.isPro && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none p-4">
                  <div className="transform -rotate-12 px-6 py-2.5 rounded-xl bg-amber-500/10 border-2 border-dashed border-amber-600/50 backdrop-blur-[1px] text-amber-900 font-mono text-xs sm:text-sm font-black tracking-[0.25em] uppercase shadow-md">
                    {tr(locale, {
                      es: 'MUESTRA · REQUIERE PRO',
                      en: 'SAMPLE · REQUIRES PRO',
                      de: 'MUSTER · PRO ERFORDERLICH',
                      fr: 'EXEMPLE · PRO REQUIS',
                      ja: 'サンプル · PRO限定',
                      pt: 'AMOSTRA · REQUER PRO',
                    })}
                  </div>
                </div>
              )}
              {stats.isPro && !hasCompletedAll && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none p-4">
                  <div className="transform -rotate-12 px-6 py-2.5 rounded-xl bg-amber-500/10 border-2 border-dashed border-[#B8860B]/50 backdrop-blur-[1px] text-[#7A4F0B] font-mono text-xs sm:text-sm font-black tracking-[0.25em] uppercase shadow-md">
                    {tr(locale, {
                      es: `VISTA PREVIA · ${certPercent}% COMPLETADO`,
                      en: `PREVIEW · ${certPercent}% COMPLETED`,
                      de: `VORSCHAU · ${certPercent}% ABGESCHLOSSEN`,
                      fr: `APERÇU · ${certPercent}% COMPLÉTÉ`,
                      ja: `プレビュー · ${certPercent}% 完了`,
                      pt: `PRÉVIA · ${certPercent}% CONCLUÍDO`,
                    })}
                  </div>
                </div>
              )}

              {/* Top Header: Monogram Emblem + Academy + Title */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <CertificateCrest className="w-12 h-12 mb-1" />
                <span className="text-[10px] tracking-[0.3em] text-[#996515] font-bold uppercase">
                  GRIDVERSE ACADEMY
                </span>
                <h2 className="text-xl sm:text-2xl font-light text-slate-900 tracking-wide mt-0.5">
                  {tr(locale, {
                    es: 'Certificado de Maestría en Excel',
                    en: 'Certificate of Excel Mastery',
                    de: 'Zertifikat für Excel-Meisterschaft',
                    fr: "Certificat de Maîtrise d'Excel",
                    ja: 'Excel マスター認定証',
                    pt: 'Certificado de Maestria em Excel',
                  })}
                </h2>
                <span className="text-[10px] tracking-[0.2em] text-slate-500 font-medium uppercase">
                  {tr(locale, {
                    es: 'Especialización en Análisis de Datos & Hojas de Cálculo',
                    en: 'Specialization in Data Analysis & Spreadsheets',
                    de: 'Spezialisierung auf Datenanalyse & Tabellen',
                    fr: 'Spécialisation en Analyse de Données & Tableurs',
                    ja: 'データ分析＆スプレッドシート専門プログラム',
                    pt: 'Especialização em Análise de Dados & Planilhas',
                  })}
                </span>
              </div>

              {/* Recipient & Citation */}
              <div className="relative z-10 flex flex-col items-center my-1">
                <span className="text-[9px] tracking-[0.25em] text-slate-500 font-semibold uppercase">
                  {tr(locale, {
                    es: 'OTORGADO CON DISTINCIÓN A',
                    en: 'PROUDLY PRESENTED TO',
                    de: 'VERLIEHEN AN',
                    fr: 'DÉCERNÉ À',
                    ja: '授与者',
                    pt: 'CONCEDIDO A',
                  })}
                </span>
                <p className="text-2xl sm:text-3xl font-serif text-slate-900 tracking-wide my-2 font-normal">
                  {userName}
                </p>
                <div className="w-28 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-2" />
                <p className="text-xs text-slate-600 max-w-lg leading-relaxed mx-auto font-light">
                  {tr(locale, {
                    es: 'Por haber completado con excelencia el programa de 90 niveles prácticos: Fórmulas Avanzadas, Lógica Condicional, BUSCARX, Tablas Dinámicas y Modelado Financiero.',
                    en: 'For successfully completing the comprehensive curriculum of 90 hands-on levels: Advanced Formulas, Conditional Logic, XLOOKUP, Pivot Tables, and Financial Modeling.',
                    de: 'Für den erfolgreichen Abschluss aller 90 praxisnahen Level: Fortgeschrittene Formeln, Bedingte Logik, XVERWEIS, Pivot-Tabellen und Finanzmodellierung.',
                    fr: 'Pour avoir complété avec succès les 90 niveaux pratiques : Formules Avancées, Logique Conditionnelle, RECHERCHEX, Tableaux Croisés et Modélisation.',
                    ja: '高度な数式、条件付き論理、XLOOKUP、ピボットテーブル、財務モデリングを含む全90実践レベルの優秀修了を証します。',
                    pt: 'Por ter concluído com excelência o programa de 90 níveis práticos: Fórmulas Avançadas, Lógica Condicional, PROCX, Tabelas Dinâmicas e Modelagem Financeira.',
                  })}
                </p>

                {/* Minimalist Inline Competencies */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono tracking-wider flex-wrap mt-3.5">
                  <span>12 Módulos</span>
                  <span className="text-[#D4AF37]">·</span>
                  <span>Fórmulas & Matrices</span>
                  <span className="text-[#D4AF37]">·</span>
                  <span>Tablas Dinámicas</span>
                  <span className="text-[#D4AF37]">·</span>
                  <span>Auditoría de Modelos</span>
                </div>
              </div>

              {/* Footer: Issue Date, Bespoke Seal, Verification ID */}
              <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D4AF37]/30">
                <div className="text-center sm:text-left">
                  <p className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">
                    {tr(locale, {
                      es: 'FECHA DE EMISIÓN',
                      en: 'ISSUE DATE',
                      de: 'AUSSTELLUNGSDATUM',
                      fr: "DATE D'ÉMISSION",
                      ja: '発行日',
                      pt: 'DATA DE EMISSÃO',
                    })}
                  </p>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {certificateMeta.dateStr}
                  </p>
                  <p className="text-[10px] text-[#996515] font-semibold">
                    Gridverse Pro Certified
                  </p>
                </div>

                {/* Bespoke Vector Seal */}
                <CertificateSeal
                  verified={Boolean(stats.isPro && hasCompletedAll)}
                  className="w-16 h-16 shrink-0 drop-shadow-sm"
                />

                <div className="text-center sm:text-right">
                  <p className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">
                    {tr(locale, {
                      es: 'ID DE VERIFICACIÓN',
                      en: 'VERIFICATION ID',
                      de: 'VERIFIZIERUNGS-ID',
                      fr: 'ID DE VÉRIFICATION',
                      ja: '認証ID',
                      pt: 'ID DE VERIFICAÇÃO',
                    })}
                  </p>
                  <p className="text-xs font-mono font-extrabold text-slate-900 mt-0.5">
                    {stats.isPro && hasCompletedAll ? certificateMeta.verificationId : 'GV-PRO-••••-••••'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    gridverse.app/verify
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Modal Action Buttons */}
            <div className="flex items-center justify-end gap-2.5">
              {!stats.isPro ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-gv-surface border border-gv-border text-gv-muted hover:text-gv-text text-xs font-bold cursor-pointer"
                  >
                    {tr(locale, {
                      es: 'Cerrar',
                      en: 'Close',
                      de: 'Schließen',
                      fr: 'Fermer',
                      ja: '閉じる',
                      pt: 'Fechar',
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.play('tap');
                      setShowCertificateModal(false);
                      onNavigateTab?.('shop');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e5c148] text-[#090E17] text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {tr(locale, {
                        es: 'Desbloquear Certificado con Pro',
                        en: 'Unlock Certificate with Pro',
                        de: 'Mit Pro freischalten',
                        fr: 'Débloquer avec Pro',
                        ja: 'Proで認定証をアンロック',
                        pt: 'Desbloquear Certificado com Pro',
                      })}
                    </span>
                  </button>
                </>
              ) : !hasCompletedAll ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-gv-surface border border-gv-border text-gv-muted hover:text-gv-text text-xs font-bold cursor-pointer"
                  >
                    {tr(locale, {
                      es: 'Cerrar',
                      en: 'Close',
                      de: 'Schließen',
                      fr: 'Fermer',
                      ja: '閉じる',
                      pt: 'Fechar',
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.play('tap');
                      setShowCertificateModal(false);
                      onNavigateTab?.('map');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e5c148] text-[#090E17] text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>
                      {tr(locale, {
                        es: `Completar Mapa (${completedPlayableCount}/${totalPlayableLevels})`,
                        en: `Complete Map (${completedPlayableCount}/${totalPlayableLevels})`,
                        de: `Karte abschließen (${completedPlayableCount}/${totalPlayableLevels})`,
                        fr: `Compléter la carte (${completedPlayableCount}/${totalPlayableLevels})`,
                        ja: `マップをクリア (${completedPlayableCount}/${totalPlayableLevels})`,
                        pt: `Concluir Mapa (${completedPlayableCount}/${totalPlayableLevels})`,
                      })}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={async () => {
                      sound.play('tap');
                      try {
                        await navigator.clipboard.writeText(certificateMeta.verificationId);
                        setCopiedVerificationId(true);
                        setTimeout(() => setCopiedVerificationId(false), 2500);
                      } catch {
                        // ignore
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gv-surface border border-gv-border text-gv-text text-xs font-bold flex items-center gap-1.5 hover:bg-gv-surface-high cursor-pointer"
                  >
                    {copiedVerificationId ? (
                      <>
                        <Check className="w-4 h-4 text-gv-primary" />
                        <span>
                          {tr(locale, {
                            es: 'ID Copiado',
                            en: 'ID Copied',
                            de: 'ID kopiert',
                            fr: 'ID Copié',
                            ja: 'IDをコピーしました',
                            pt: 'ID Copiado',
                          })}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>
                          {tr(locale, {
                            es: 'Copiar ID',
                            en: 'Copy ID',
                            de: 'ID kopieren',
                            fr: 'Copier ID',
                            ja: 'IDをコピー',
                            pt: 'Copiar ID',
                          })}
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.play('tap');
                      window.print();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e5c148] text-[#090E17] text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Printer className="w-4 h-4" />
                    <span>
                      {tr(locale, {
                        es: 'Imprimir / Guardar PDF',
                        en: 'Print / Save PDF',
                        de: 'Drucken / Als PDF speichern',
                        fr: 'Imprimer / Enregistrer en PDF',
                        ja: '印刷 / PDF保存',
                        pt: 'Imprimir / Salvar PDF',
                      })}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Calificar Gridverse (5-Star Review + Feedback) */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-lg font-black text-gv-text">
                  {tr(locale, {
                    es: 'Calificar Gridverse',
                    en: 'Rate Gridverse',
                    de: 'Gridverse bewerten',
                    fr: 'Évaluer Gridverse',
                    ja: 'Gridverseを評価する',
                    pt: 'Avaliar Gridverse',
                  })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRateModal(false)}
                className="text-gv-muted hover:text-gv-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="flex flex-col gap-4">
              <p className="text-xs text-gv-muted">
                {tr(locale, {
                  es: '¿Te está gustando aprender Excel con Celdi? Tu reseña nos ayuda a crear más niveles y desafíos interactivos.',
                  en: 'Enjoying learning Excel with Celdi? Your review helps us build more interactive levels and challenges.',
                  de: 'Gefällt dir das Excel-Lernen mit Celdi? Deine Bewertung hilft uns, weitere interaktive Level zu entwickeln.',
                  fr: "Tu aimes apprendre Excel avec Celdi ? Ton avis nous aide à créer plus de niveaux et défis interactifs.",
                  ja: 'Celdiと一緒に楽しくExcelを学べていますか？あなたのレビューが新しいレベル開発の力になります。',
                  pt: 'Está gostando de aprender Excel com o Celdi? Sua avaliação nos ajuda a criar mais níveis e desafios interativos.',
                })}
              </p>

              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      sound.play('tap');
                      setRateStars(star);
                    }}
                    className="p-1.5 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rateStars
                          ? 'text-[#F59E0B] fill-[#F59E0B]'
                          : 'text-gv-muted'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={rateFeedbackText}
                onChange={(e) => setRateFeedbackText(e.target.value)}
                placeholder={tr(locale, {
                  es: 'Cuéntanos qué es lo que más te gusta o qué te gustaría ver en Gridverse (opcional)...',
                  en: 'Tell us what you love most or what you would like to see in Gridverse (optional)...',
                  de: 'Sag uns, was dir am besten gefällt oder was du dir wünschst (optional)...',
                  fr: 'Dis-nous ce que tu préfères ou ce que tu aimerais voir dans Gridverse (optionnel)...',
                  ja: '気に入っている点や追加してほしい機能をお聞かせください（任意）...',
                  pt: 'Conte-nos o que você mais gosta ou o que gostaria de ver no Gridverse (opcional)...',
                })}
                className="w-full p-3.5 rounded-xl bg-gv-surface-high border border-gv-border focus:border-[#F59E0B] focus:outline-none text-base sm:text-xs text-gv-text resize-none"
              />

              <button
                type="submit"
                disabled={submittingFeedback}
                className="w-full py-3 rounded-xl bg-[#F59E0B] hover:bg-[#fbbf24] text-black font-black text-xs transition-colors cursor-pointer"
              >
                {submittingFeedback
                  ? tr(locale, {
                      es: 'Enviando...',
                      en: 'Sending...',
                      de: 'Wird gesendet...',
                      fr: 'Envoi...',
                      ja: '送信中...',
                      pt: 'Enviando...',
                    })
                  : tr(locale, {
                      es: 'Enviar Reseña',
                      en: 'Submit Review',
                      de: 'Bewertung senden',
                      fr: 'Envoyer mon avis',
                      ja: 'レビューを送信',
                      pt: 'Enviar Avaliação',
                    })}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Selector de Idioma */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gv-surface border border-gv-border rounded-3xl p-5 flex flex-col gap-2.5 shadow-2xl">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-black text-gv-text">
                {tr(locale, {
                  es: 'Seleccionar Idioma',
                  en: 'Select Language',
                  de: 'Sprache auswählen',
                  fr: 'Choisir la langue',
                  ja: '言語を選択',
                  pt: 'Selecionar Idioma',
                })}
              </h3>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="text-gv-muted hover:text-gv-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(
              [
                { code: 'es', label: '🇪🇸 Español (BUSCARX, SUMA)' },
                { code: 'en', label: '🇺🇸 English (XLOOKUP, SUM)' },
                { code: 'de', label: '🇩🇪 Deutsch (XVERWEIS, SUMME)' },
                { code: 'fr', label: '🇫🇷 Français (RECHERCHEX, SOMME)' },
                { code: 'ja', label: '🇯🇵 日本語 (XLOOKUP, SUM)' },
                { code: 'pt', label: '🇧🇷 Português (PROCX, SOMA)' },
              ] as const
            ).map((langOpt) => {
              const isSelected = stats.locale === langOpt.code;
              return (
                <button
                  key={langOpt.code}
                  type="button"
                  onClick={() => {
                    sound.play('tap');
                    try {
                      localStorage.setItem('gridverse_locale_user_set', 'true');
                    } catch {}
                    onUpdateStats?.({ ...stats, locale: langOpt.code });
                    setShowLanguageModal(false);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gv-primary/15 border-gv-primary text-gv-accent'
                      : 'bg-gv-surface-high border-gv-border text-gv-text hover:border-gv-muted'
                  }`}
                >
                  <span>{langOpt.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-gv-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal 5: Confirmación (Cerrar Sesión / Eliminar Cuenta / Borrar Datos Locales) */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gv-surface border border-gv-border rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-base font-black text-gv-text">
              {confirmAction === 'signout'
                ? tr(locale, {
                    es: '¿Cerrar sesión?',
                    en: 'Sign out?',
                    de: 'Abmelden?',
                    fr: 'Se déconnecter ?',
                    ja: 'ログアウトしますか？',
                    pt: 'Sair da conta?',
                  })
                : confirmAction === 'delete_account'
                ? tr(locale, {
                    es: '¿Eliminar cuenta permanentemente?',
                    en: 'Delete account permanently?',
                    de: 'Konto dauerhaft löschen?',
                    fr: 'Supprimer le compte définitivement ?',
                    ja: 'アカウントを完全に削除しますか？',
                    pt: 'Excluir conta permanentemente?',
                  })
                : tr(locale, {
                    es: '¿Borrar datos locales?',
                    en: 'Reset local data?',
                    de: 'Lokale Daten zurücksetzen?',
                    fr: 'Effacer les données locales ?',
                    ja: 'ローカルデータをリセットしますか？',
                    pt: 'Apagar dados locais?',
                  })}
            </h3>
            <p className="text-xs text-gv-muted leading-relaxed">
              {confirmAction === 'signout'
                ? tr(locale, {
                    es: 'Tu progreso sincronizado seguirá seguro en la nube cuando vuelvas a iniciar sesión.',
                    en: 'Your synced progress will remain safe in the cloud when you sign back in.',
                    de: 'Dein synchronisierter Fortschritt bleibt sicher in der Cloud gespeichert.',
                    fr: 'Ta progression synchronisée restera en sécurité dans le cloud.',
                    ja: '同期された進捗はクラウドに安全に保存され、再ログイン時に復元されます。',
                    pt: 'Seu progresso sincronizado continuará seguro na nuvem quando você entrar novamente.',
                  })
                : confirmAction === 'delete_account'
                ? tr(locale, {
                    es: 'Esta acción es irreversible y eliminará tu cuenta, niveles completados, racha y gemas de la nube.',
                    en: 'This action is irreversible and will delete your account, completed levels, streak, and gems from the cloud.',
                    de: 'Diese Aktion kann nicht rückgängig gemacht werden und löscht dein Konto sowie deinen Fortschritt dauerhaft.',
                    fr: 'Cette action est irréversible et supprimera ton compte, tes niveaux, ta série et tes gemmes.',
                    ja: 'この操作は取り消せません。アカウント、クリア済みレベル、連続記録、ジェムが完全に削除されます。',
                    pt: 'Esta ação é irreversível e excluirá sua conta, níveis concluídos, ofensiva e gemas da nuvem.',
                  })
                : tr(locale, {
                    es: 'Se reiniciará tu progreso local en este navegador a la celda A1.',
                    en: 'Your local progress in this browser will be reset back to cell A1.',
                    de: 'Dein lokaler Fortschritt in diesem Browser wird auf Zelle A1 zurückgesetzt.',
                    fr: 'Ta progression locale sur ce navigateur sera réinitialisée à la cellule A1.',
                    ja: 'このブラウザのローカル進捗がセルA1にリセットされます。',
                    pt: 'Seu progresso local neste navegador será reiniciado para a célula A1.',
                  })}
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 rounded-xl bg-gv-surface-high border border-gv-border text-gv-text text-xs font-bold cursor-pointer"
              >
                {tr(locale, {
                  es: 'Cancelar',
                  en: 'Cancel',
                  de: 'Abbrechen',
                  fr: 'Annuler',
                  ja: 'キャンセル',
                  pt: 'Cancelar',
                })}
              </button>
              <button
                type="button"
                onClick={handleConfirmDialogAction}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black cursor-pointer ${
                  confirmAction === 'signout'
                    ? 'bg-gv-warning text-black'
                    : 'bg-gv-error text-white'
                }`}
              >
                {confirmAction === 'signout'
                  ? tr(locale, {
                      es: 'Cerrar sesión',
                      en: 'Sign out',
                      de: 'Abmelden',
                      fr: 'Se déconnecter',
                      ja: 'ログアウト',
                      pt: 'Sair',
                    })
                  : tr(locale, {
                      es: 'Confirmar',
                      en: 'Confirm',
                      de: 'Bestätigen',
                      fr: 'Confirmer',
                      ja: '確認',
                      pt: 'Confirmar',
                    })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
