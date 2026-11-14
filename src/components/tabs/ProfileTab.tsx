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

const CELDI_AVATAR_OPTIONS: { key: string; mood: CeldiMood; label: string }[] = [
  { key: 'celdi:happy', mood: 'happy', label: 'Feliz' },
  { key: 'celdi:celebrating', mood: 'celebrating', label: 'Celebrando' },
  { key: 'celdi:thinking', mood: 'thinking', label: 'Pensando' },
  { key: 'celdi:neutral', mood: 'onFire', label: 'Enfoque' },
  { key: 'celdi:sad', mood: 'sad', label: 'Desafío' },
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
    (locale === 'es' ? 'Estudiante Gridverse' : 'Gridverse Student');

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
  const rankTitle =
    stats.xp >= 5000
      ? 'Maestro de Datos'
      : stats.xp >= 2500
      ? 'Ninja de Fórmulas'
      : stats.xp >= 1000
      ? 'Analista'
      : 'Becario';

  const rankProgressData = useMemo(() => {
    const xp = stats.xp;
    if (xp < 1000) {
      return {
        nextRankText: 'Becario → Analista',
        targetText: `${xp} / 1,000 XP`,
        progress: Math.max(0, Math.min(1, xp / 1000)),
      };
    }
    if (xp < 2500) {
      return {
        nextRankText: 'Analista → Ninja de Fórmulas',
        targetText: `${xp} / 2,500 XP`,
        progress: Math.max(0, Math.min(1, (xp - 1000) / 1500)),
      };
    }
    if (xp < 5000) {
      return {
        nextRankText: 'Ninja de Fórmulas → Maestro de Datos',
        targetText: `${xp} / 5,000 XP`,
        progress: Math.max(0, Math.min(1, (xp - 2500) / 2500)),
      };
    }
    return {
      nextRankText: 'Rango Máximo Alcanzado',
      targetText: `${xp} XP`,
      progress: 1,
    };
  }, [stats.xp]);

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
        title: 'Operaciones Básicas',
        subtitle: 'Celdas, formatos y aritmética',
        progress: pBasics,
        color: '#10B981',
        Icon: Grid,
      },
      {
        id: 'essentials',
        title: 'Fórmulas Esenciales',
        subtitle: 'SUMA, PROMEDIO y referencias $A$1',
        progress: pEssentials,
        color: '#0EA5E9',
        Icon: Sigma,
      },
      {
        id: 'logic',
        title: 'Lógica Condicional',
        subtitle: 'SI, Y, O, SI.ERROR y SI.CONJUNTO',
        progress: pLogic,
        color: '#F59E0B',
        Icon: GitBranch,
      },
      {
        id: 'tables',
        title: 'Tablas y Organización',
        subtitle: 'Ordenar, filtros y tablas oficiales',
        progress: pTables,
        color: '#14B8A6',
        Icon: Table2,
      },
      {
        id: 'lookup',
        title: 'Búsqueda y Calidad',
        subtitle: 'BUSCARV, BUSCARX y formato condicional',
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
  }, [stats.completedLevels, completedTotalNodesCount, completedPlayableCount, totalStars]);

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
      showToast('¡Perfil actualizado correctamente!');
    } catch (err: any) {
      showToast(err?.message || 'Error al guardar el perfil', 'err');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleShareProfile = async () => {
    sound.play('tap');
    const shareText = `¡Llevo ${stats.streak} días de racha y ${stats.xp} XP como ${rankTitle} en Gridverse! 🚀 Domina Excel jugando en https://gridverse.app`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mi progreso en Gridverse',
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
      showToast('¡Resumen de progreso copiado al portapapeles para compartir!');
    } catch {
      showToast(shareText);
    }
  };

  const handleRecommendApp = async () => {
    sound.play('tap');
    const inviteText =
      '¡Aprende y domina Microsoft Excel jugando celda por celda con Gridverse! 🚀 Descárgala o juega gratis en https://gridverse.app';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Recomendar Gridverse',
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
      showToast('¡Enlace de invitación copiado al portapapeles!');
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
      showToast('¡Muchas gracias por tu calificación de 5 estrellas! 💚');
    } catch {
      sound.play('correct');
      setShowRateModal(false);
      showToast('¡Gracias por apoyar a Gridverse!');
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
      showToast('Sesión iniciada con Google. Tu progreso y plan PRO se han sincronizado.');
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      showToast(e?.message || 'Error al iniciar sesión con Google', 'err');
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
      showToast('Sesión iniciada con Apple. Tu progreso y plan PRO se han sincronizado.');
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      showToast(
        e?.code === 'auth/operation-not-allowed'
          ? 'Apple Sign-In requiere configuración de dominio web en Firebase Auth.'
          : e?.message || 'Error al iniciar sesión con Apple',
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
      showToast('¡Cuenta de Apple vinculada exitosamente a tu perfil!');
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (e?.code === 'auth/credential-already-in-use') {
        const cred = OAuthProvider.credentialFromError(e);
        if (cred) {
          await signInWithCredential(auth, cred);
          sound.play('correct');
          showToast('Conectado a tu cuenta de Apple existente con tu progreso sincronizado.');
          return;
        }
      }
      showToast(e?.message || 'No se pudo vincular con Apple.', 'err');
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
      showToast('¡Cuenta de Google vinculada exitosamente a tu perfil!');
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (e?.code === 'auth/credential-already-in-use') {
        const cred = OAuthProvider.credentialFromError(e);
        if (cred) {
          await signInWithCredential(auth, cred);
          sound.play('correct');
          showToast('Conectado a tu cuenta de Google existente con tu progreso sincronizado.');
          return;
        }
      }
      showToast(e?.message || 'No se pudo vincular con Google.', 'err');
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
      showToast('Has cerrado sesión correctamente.');
    } else if (action === 'delete_account') {
      try {
        await deleteAccountAndFirestoreData();
        const reset = resetUserStats();
        onUpdateStats?.(reset);
        showToast('Tu cuenta y datos han sido eliminados permanentemente.');
      } catch (err: any) {
        showToast(
          err?.code === 'auth/requires-recent-login'
            ? 'Por seguridad, vuelve a iniciar sesión antes de eliminar tu cuenta.'
            : err?.message || 'No se pudo eliminar la cuenta.',
          'err'
        );
      }
    } else if (action === 'reset_local') {
      const reset = resetUserStats();
      onUpdateStats?.(reset);
      showToast('Datos locales reiniciados a la celda A1.');
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
    showToast('Lista de primeros pasos reactivada en el mapa.');
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
            title="Editar perfil y avatar"
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
                  PRO ACTIVO
                </span>
              )}
            </div>
            <p className="text-xs text-gv-muted truncate mt-0.5">
              {currentUser?.email
                ? `${currentUser.email} · ${rankTitle}`
                : `Cuenta local sin sincronizar · ${rankTitle}`}
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
          title="Compartir mi progreso"
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
                Guarda tu progreso en la nube
              </h2>
              <p className="text-xs text-gv-muted">
                Conecta tu cuenta gratis para respaldar tus niveles, racha, plan PRO y gemas en todos tus dispositivos.
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
              <span>Continuar con Apple</span>
            </button>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingAuth}
              className="py-2.5 px-4 rounded-xl bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border text-gv-text text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>
      ) : (
        (!hasAppleLinked || !hasGoogleLinked) && (
          <div className="rounded-2xl p-4 bg-gv-surface border border-gv-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-gv-muted">
              <Link2 className="w-4 h-4 text-gv-primary shrink-0" />
              <span>
                Vincula tus cuentas para entrar con el mismo progreso en iOS, Android y Web:
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
                  <span>Vincular con Apple</span>
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
                  <span>Vincular con Google</span>
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
        <div className="rounded-[20px] p-5 bg-gradient-to-br from-[#0F2419] via-[#131D18] to-[#1F1A0E] border-[1.5px] border-[#D4AF37] shadow-[0_8px_24px_rgba(212,175,55,0.18)] flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#F3E5AB] text-[10px] font-black tracking-wider uppercase">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              CERTIFICADO OFICIAL GRIDVERSE
            </span>
            <span className="px-2 py-0.5 rounded-md bg-gv-primary/20 text-gv-primary text-[10px] font-mono font-extrabold">
              100% COMPLETADO
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-[54px] h-[54px] rounded-[14px] bg-gradient-to-br from-[#D4AF37] to-[#996515] flex items-center justify-center text-[#090E17] shadow-lg shrink-0">
              <Award className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-black text-gv-text">
                Maestría Oficial en Hojas de Cálculo
              </h3>
              <p className="text-xs text-gv-muted mt-0.5">
                Otorgado a <strong className="text-gv-text">{userName}</strong> · ID Verificado
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
              className="flex-1 py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#090E17] text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Certificado</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setShowCertificateModal(true);
              }}
              className="py-3 px-4 rounded-xl border border-[#D4AF37]/60 text-[#F3E5AB] hover:bg-[#D4AF37]/10 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Ver</span>
            </button>
          </div>
        </div>
      ) : stats.isPro && !hasCompletedAll ? (
        <div className="rounded-[18px] p-4 bg-gv-surface border border-[#D4AF37]/40 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-gv-text truncate">
                  Certificado Oficial de Maestría
                </h3>
                <p className="text-xs text-[#D4AF37] font-semibold">
                  Beneficio exclusivo de Gridverse Pro
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#F3E5AB] text-xs font-mono font-extrabold">
                {certPercent}%
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  setShowCertificateModal(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Vista previa</span>
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
              {completedPlayableCount} de {totalPlayableLevels} niveles completados
            </span>
            <span className="text-gv-text font-semibold">
              {Math.max(0, totalPlayableLevels - completedPlayableCount)} restantes
            </span>
          </div>
        </div>
      ) : !stats.isPro && hasCompletedAll ? (
        <div className="rounded-[20px] p-5 bg-gradient-to-br from-[#1C180D] to-gv-surface border-[1.5px] border-[#D4AF37]/70 flex flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gv-text">
                ¡Mapa Completado! Reclama tu Certificado
              </h3>
              <p className="text-xs text-[#F3E5AB]">
                Desbloquea tu Certificado Oficial con Gridverse Pro
              </p>
            </div>
          </div>
          <p className="text-xs text-gv-muted">
            Has superado todas las regiones de Gridverse. Actualiza a Pro para emitir y descargar tu certificado oficial personalizado con código de verificación único.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                onNavigateTab?.('shop');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#D4AF37] text-[#090E17] text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Desbloquear Certificado con Pro</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.play('tap');
                setShowCertificateModal(true);
              }}
              className="py-2.5 px-3.5 rounded-xl border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-bold cursor-pointer"
            >
              Ver muestra
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            sound.play('tap');
            setShowCertificateModal(true);
          }}
          className="rounded-2xl p-4 bg-gradient-to-r from-[#1A160B] to-gv-surface border border-[#D4AF37]/45 flex items-center justify-between gap-3 cursor-pointer hover:border-[#D4AF37] transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-extrabold text-gv-text">
                  Certificación Oficial de Excel
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#F3E5AB] text-[9px] font-black tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-xs text-gv-muted mt-0.5">
                Obtén tu certificado con verificación oficial al completar el mapa con Pro.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-extrabold flex items-center gap-1 shrink-0">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver</span>
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
              EXCELENTE
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-gv-text font-mono leading-tight">
              {masteryData.accuracyPercent}%
            </p>
            <p className="text-xs text-gv-muted font-medium">Precisión</p>
          </div>
        </div>

        {/* Velocidad */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#0EA5E9]/15 flex items-center justify-center text-[#0EA5E9]">
              <Zap className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#0EA5E9]/15 text-[#0EA5E9] text-[9px] font-mono font-extrabold">
              RITMO PRO
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-gv-text font-mono leading-tight">~15s</p>
            <p className="text-xs text-gv-muted font-medium">Velocidad</p>
          </div>
        </div>

        {/* Fórmulas */}
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-3.5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B]">
              <Sigma className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#F59E0B]/15 text-[#F59E0B] text-[9px] font-mono font-extrabold">
              CATÁLOGO
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-gv-text font-mono leading-tight">
              {masteryData.unlockedFormulas} / 24
            </p>
            <p className="text-xs text-gv-muted font-medium">Fórmulas</p>
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
              Grado {masteryData.efficiencyGrade}
            </p>
            <p className="text-xs text-gv-muted font-medium">Eficiencia</p>
          </div>
        </div>
      </div>

      {/* 5.2 Dominio de Hojas de Cálculo (Gráfica de Maestría por Habilidades) */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-extrabold text-gv-text">
            Dominio de Hojas de Cálculo
          </h2>
          <p className="text-xs text-gv-muted">
            Progreso técnico desglosado por área
          </p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-[18px] p-4 flex flex-col gap-3.5">
          {masteryData.skills.map((skill) => {
            const pct = Math.round(skill.progress * 100);
            const levelBadge =
              pct >= 85
                ? 'Maestro'
                : pct >= 60
                ? 'Avanzado'
                : pct >= 35
                ? 'Intermedio'
                : pct > 8
                ? 'Aprendiendo'
                : 'Sin iniciar';
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
            Actividad Semanal
          </h2>
          <p className="text-xs text-gv-muted">
            Celdas y ejercicios resueltos por día
          </p>
        </div>

        <div className="bg-gv-surface border border-gv-border rounded-[18px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gv-text">
              <Flame className="w-4 h-4 text-gv-streak" />
              <span>Racha activa: {stats.streak} días</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-gv-primary/15 text-gv-primary text-[10px] font-mono font-bold">
              META DIARIA: 1+ CELDA
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
                Historial de Actividad Git
              </h3>
              <p className="text-[11px] text-gv-muted">
                Tus celdas completadas día a día
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
          <span className="font-mono">{completedPlayableCount} celdas superadas</span>
          <div className="flex items-center gap-1">
            <span>Menos</span>
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-surface-high border border-gv-border/60 inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-primary/35 inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-primary/65 inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-primary inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2.5px] bg-gv-accent inline-block" />
            <span>Más</span>
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
            <p className="text-xs text-gv-muted">Estrellas</p>
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
            <p className="text-xs text-gv-muted">Gemas acumuladas</p>
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
                Recomendar Gridverse
              </h3>
              <p className="text-xs text-gv-muted truncate">
                Invita a un amigo o colega a dominar Excel
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-gv-primary text-black text-xs font-extrabold shrink-0">
            Invitar
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
                Calificar Gridverse
              </h3>
              <p className="text-xs text-gv-muted truncate">
                ⭐⭐⭐⭐⭐ Apóyanos con tu reseña de 5 estrellas
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-[#F59E0B] text-black text-xs font-extrabold shrink-0">
            Calificar
          </span>
        </button>
      </div>

      {/* 8. Integrated Settings (ProfileSettingsView) */}
      <div className="pt-2 flex flex-col gap-5">
        <div className="border-t border-gv-border pt-5">
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-gv-muted mb-2.5">
            PREFERENCIAS DE JUEGO
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
                  <p className="text-sm font-semibold text-gv-text">Idioma</p>
                  <p className="text-xs text-gv-muted">
                    {stats.locale === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gv-muted" />
            </button>

            {/* Efectos de sonido (SFX) */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gv-accent" />
                <div>
                  <p className="text-sm font-semibold text-gv-text">
                    Efectos de sonido (SFX)
                  </p>
                  <p className="text-xs text-gv-muted">
                    Sonidos al tocar celdas, acertar o fallar
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
                    Música de fondo (BGM)
                  </p>
                  <p className="text-xs text-gv-muted">
                    Ambientación musical durante las lecciones
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
                    Recordatorio de racha
                  </p>
                  <p className="text-xs text-gv-muted">
                    Aviso diario para no perder tu cadena
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
                      ? 'Recordatorio diario de racha activado.'
                      : 'Recordatorio de racha desactivado.'
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
            ACCIONES Y GESTIÓN
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
                  Ver primeros pasos de bienvenida
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
                  Recomendar Gridverse
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
                  Calificar Gridverse
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
                      Cerrar sesión
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
                      Eliminar cuenta
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
                    Borrar datos locales
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
            LEGAL Y PRIVACIDAD
          </h2>
          <div className="bg-gv-surface border border-gv-border rounded-2xl divide-y divide-gv-border overflow-hidden">
            <a
              href="https://gridverse.app/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gv-muted" />
                <span className="text-sm font-medium text-gv-text">
                  Política de Privacidad
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-gv-muted" />
            </a>

            <a
              href="https://gridverse.app/terms/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-4 flex items-center justify-between hover:bg-gv-surface-high/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gv-muted" />
                <span className="text-sm font-medium text-gv-text">
                  Términos de Uso (EULA)
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-gv-muted" />
            </a>
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div>
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-gv-muted mb-2.5">
            INFORMACIÓN
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
              Domina Microsoft Excel celda por celda a través de microlecciones interactivas gamificadas.
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
              <h3 className="text-lg font-black text-gv-text">Editar Perfil</h3>
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
                  Elige tu Avatar de Celdi
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
                          {opt.label}
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
                        alt="Foto Real"
                        className="w-[46px] h-[46px] rounded-xl object-cover"
                      />
                      <span
                        className={`text-[10px] font-bold ${
                          editAvatar === currentUser.photoURL
                            ? 'text-gv-primary'
                            : 'text-gv-muted'
                        }`}
                      >
                        Foto Real
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gv-muted mb-1.5">
                  Nombre o Nickname
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Tu nombre en Gridverse..."
                  className="w-full px-4 py-3 rounded-xl bg-gv-surface-high border border-gv-border focus:border-gv-primary focus:outline-none text-sm font-bold text-gv-text"
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
                {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
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
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm font-black text-white">
                  Certificado Oficial Gridverse
                </span>
                {(!stats.isPro || !hasCompletedAll) && (
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3E5AB] text-[10px] font-mono font-bold">
                    VISTA PREVIA ({certPercent}% COMPLETADO)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="w-8 h-8 rounded-lg bg-gv-surface-high border border-gv-border flex items-center justify-center text-gv-muted hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ornamental 16:10 Certificate Document matching `certificate_document.dart` */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#090E17] via-[#0F1824] to-[#0A131A] border-[2.5px] border-[#D4AF37] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.75)]">
              <div className="border border-[#D4AF37]/45 rounded-xl p-6 sm:p-8 flex flex-col items-center text-center justify-between gap-5 relative overflow-hidden">
                {/* Top Header */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-black tracking-[0.22em] uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>GRIDVERSE ACADEMY OF SPREADSHEET MASTERY</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-wider uppercase">
                    CERTIFICADO DE MAESTRÍA EN EXCEL
                  </h2>
                  <div className="px-3 py-0.5 rounded-full bg-gv-primary/15 border border-gv-primary/40 text-gv-accent text-[9px] font-extrabold tracking-widest uppercase">
                    PROGRAMA OFICIAL DE ESPECIALIZACIÓN Y DOMINIO DE DATOS
                  </div>
                </div>

                {/* Recipient */}
                <div className="flex flex-col items-center gap-1.5 my-1">
                  <span className="text-[10px] tracking-[0.18em] text-slate-400 font-semibold uppercase">
                    SE OTORGA EL PRESENTE RECONOCIMIENTO OFICIAL A:
                  </span>
                  <p className="text-2xl sm:text-3xl font-serif font-black text-[#F3E5AB] tracking-wide uppercase">
                    {userName}
                  </p>
                  <div className="w-56 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1" />
                  <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                    Por haber completado satisfactoriamente las 12 regiones y 90 niveles prácticos de ingeniería en hojas de cálculo: Fórmulas Avanzadas, Lógica Condicional, BUSCARX, Tablas Dinámicas, Finanzas, Macros y Auditoría de Modelos.
                  </p>
                </div>

                {/* 4 Skill Chips */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[
                    '12 Módulos Aprobados',
                    'Fórmulas & Matrices',
                    'Tablas Dinámicas',
                    'Auditoría Integral',
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gv-primary/10 border border-gv-primary/35 text-slate-200 text-[10px] font-bold"
                    >
                      <CheckCircle2 className="w-3 h-3 text-gv-primary" />
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Footer: Issue Date, Gold Seal, Verification ID */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#D4AF37]/25">
                  <div className="text-center sm:text-left">
                    <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">
                      FECHA DE EMISIÓN
                    </p>
                    <p className="text-xs font-extrabold text-white mt-0.5">
                      {certificateMeta.dateStr}
                    </p>
                    <p className="text-[10px] text-[#D4AF37] font-semibold">
                      Gridverse Pro Certified
                    </p>
                  </div>

                  {/* Gold Seal */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#996515] p-1 shadow-[0_0_20px_rgba(212,175,55,0.45)] flex items-center justify-center shrink-0">
                    <div className="w-full h-full rounded-full border border-[#090E17] flex flex-col items-center justify-center text-[#090E17]">
                      <Award className="w-5 h-5 stroke-[2.2]" />
                      <span className="text-[6px] font-black tracking-tighter leading-none">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">
                      ID DE VERIFICACIÓN
                    </p>
                    <p className="text-xs font-mono font-extrabold text-[#F3E5AB] mt-0.5">
                      {certificateMeta.verificationId}
                    </p>
                    <p className="text-[10px] text-gv-primary font-semibold">
                      gridverse.app/verify
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Modal Action Buttons */}
            <div className="flex items-center justify-end gap-2.5">
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
                    <span>ID Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar ID</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.play('tap');
                  window.print();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e5c148] text-[#090E17] text-xs font-black flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>
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
                <h3 className="text-lg font-black text-gv-text">Calificar Gridverse</h3>
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
                ¿Te está gustando aprender Excel con Celdi? Tu reseña nos ayuda a crear más niveles y desafíos interactivos.
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
                placeholder="Cuéntanos qué es lo que más te gusta o qué te gustaría ver en Gridverse (opcional)..."
                className="w-full p-3.5 rounded-xl bg-gv-surface-high border border-gv-border focus:border-[#F59E0B] focus:outline-none text-xs text-gv-text resize-none"
              />

              <button
                type="submit"
                disabled={submittingFeedback}
                className="w-full py-3 rounded-xl bg-[#F59E0B] hover:bg-[#fbbf24] text-black font-black text-xs transition-colors cursor-pointer"
              >
                {submittingFeedback ? 'Enviando...' : 'Enviar Reseña'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Selector de Idioma */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gv-surface border border-gv-border rounded-3xl p-5 flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-black text-gv-text">Seleccionar Idioma</h3>
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
              ] as const
            ).map((langOpt) => {
              const isSelected = stats.locale === langOpt.code;
              return (
                <button
                  key={langOpt.code}
                  type="button"
                  onClick={() => {
                    sound.play('tap');
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
                ? '¿Cerrar sesión?'
                : confirmAction === 'delete_account'
                ? '¿Eliminar cuenta permanentemente?'
                : '¿Borrar datos locales?'}
            </h3>
            <p className="text-xs text-gv-muted leading-relaxed">
              {confirmAction === 'signout'
                ? 'Tu progreso sincronizado seguirá seguro en la nube cuando vuelvas a iniciar sesión.'
                : confirmAction === 'delete_account'
                ? 'Esta acción es irreversible y eliminará tu cuenta, niveles completados, racha y gemas de la nube.'
                : 'Se reiniciará tu progreso local en este navegador a la celda A1.'}
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 rounded-xl bg-gv-surface-high border border-gv-border text-gv-text text-xs font-bold cursor-pointer"
              >
                Cancelar
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
                {confirmAction === 'signout' ? 'Cerrar sesión' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
