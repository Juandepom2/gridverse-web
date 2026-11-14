import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  linkWithPopup,
  updateProfile,
  deleteUser,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { UserStats } from '../types';
import { MOCK_REGIONS } from '../data/mapData';

const firebaseConfig = {
  apiKey: 'AIzaSyDZ4Z-1UL1uLQ8IvFuY8ynyy1o4vrTBFnE',
  authDomain: 'gridverse-app.firebaseapp.com',
  projectId: 'gridverse-app',
  storageBucket: 'gridverse-app.firebasestorage.app',
  messagingSenderId: '1008557778901',
  appId: '1:1008557778901:web:c74f74410de3def3143f5c',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// RevenueCat public API keys from Flutter RevenueCatService
const RC_APPLE_KEY = 'appl_trneNZkWgToYTXgYBedkrzcfTKL';
const RC_GOOGLE_KEY = 'goog_SEwulhiglpXXXaGopviWlHILbHn';

export interface RevenueCatProInfo {
  isPro: boolean;
  planName?: string;
}

/**
 * Checks RevenueCat REST API for active `gridverse_pro` entitlement for the given uid.
 */
export async function checkRevenueCatProStatus(uid: string): Promise<RevenueCatProInfo> {
  for (const apiKey of [RC_APPLE_KEY, RC_GOOGLE_KEY]) {
    try {
      const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(uid)}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const sub = data?.subscriber;
      const ent = sub?.entitlements?.gridverse_pro;
      if (ent) {
        const expiresDate = ent.expires_date ? new Date(ent.expires_date) : null;
        const isActive = !expiresDate || expiresDate.getTime() > Date.now();
        if (isActive) {
          const prodId: string = ent.product_identifier || '';
          let planName = 'pro';
          if (prodId.includes('lifetime')) planName = 'lifetime';
          else if (prodId.includes('annual')) planName = 'annual';
          else if (prodId.includes('monthly')) planName = 'monthly';
          return { isPro: true, planName };
        }
      }
      // Also check non_subscriptions for lifetime purchase
      if (sub?.non_subscriptions?.gridverse_pro_lifetime?.length > 0) {
        return { isPro: true, planName: 'lifetime' };
      }
    } catch {
      // Ignore network/CORS errors and continue
    }
  }
  return { isPro: false };
}

/**
 * Returns all level refs in sequential map order: ['A1', 'A2', ..., 'L6']
 */
export function getAllLevelRefs(): string[] {
  return MOCK_REGIONS.flatMap((r) => r.levels.map((l) => l.ref.toUpperCase()));
}

/**
 * Converts Firestore `users/{uid}` document data into web `UserStats`,
 * matching Flutter's `UserGameData.fromMap` and `buildRegionsWithProgress`.
 */
export function parseFirestoreUserToStats(
  data: Record<string, any>,
  prevStats: UserStats
): UserStats {
  const allRefs = getAllLevelRefs();
  const rawCompleted = data.completedLevels || {};
  const completedLevels: Record<string, { stars: number; completedAt: string }> = {};

  for (const [k, v] of Object.entries(rawCompleted)) {
    const normKey = k.toUpperCase();
    if (typeof v === 'number') {
      completedLevels[normKey] = {
        stars: Math.max(1, Math.min(3, v)),
        completedAt: new Date().toISOString(),
      };
    } else if (v && typeof v === 'object' && typeof (v as any).stars === 'number') {
      completedLevels[normKey] = {
        stars: (v as any).stars,
        completedAt: (v as any).completedAt || new Date().toISOString(),
      };
    }
  }

  const rawCurrent = typeof data.currentLevel === 'string' ? data.currentLevel.toUpperCase() : 'A1';
  const normCurrentIdx = allRefs.indexOf(rawCurrent);

  // Find highest completed index
  let highestCompletedIdx = -1;
  for (let i = 0; i < allRefs.length; i++) {
    if (completedLevels[allRefs[i]]) {
      highestCompletedIdx = i;
    }
  }

  // Ensure any level strictly before currentLevel (or highestCompletedIdx) is marked completed
  // matching Flutter's `isPastLevel = currentIndex >= 0 && lvlIndex < currentIndex`
  const effectiveTargetIdx = Math.max(normCurrentIdx, highestCompletedIdx);
  if (effectiveTargetIdx > 0) {
    for (let i = 0; i < normCurrentIdx; i++) {
      const ref = allRefs[i];
      if (!completedLevels[ref]) {
        const lvl = MOCK_REGIONS.flatMap((r) => r.levels).find((l) => l.ref.toUpperCase() === ref);
        completedLevels[ref] = {
          stars: lvl?.type === 'chest' ? 1 : 3,
          completedAt: new Date().toISOString(),
        };
      }
    }
  }

  // Compute effective current (unlocked) level matching Flutter's `buildRegionsWithProgress`
  let effectiveCurrent = rawCurrent;
  if (!effectiveCurrent || completedLevels[effectiveCurrent]) {
    let nextPending: string | undefined;
    const searchStart = Math.max(normCurrentIdx, highestCompletedIdx) + 1;
    for (let i = Math.max(0, searchStart); i < allRefs.length; i++) {
      if (!completedLevels[allRefs[i]]) {
        nextPending = allRefs[i];
        break;
      }
    }
    if (!nextPending) {
      for (const r of allRefs) {
        if (!completedLevels[r]) {
          nextPending = r;
          break;
        }
      }
    }
    effectiveCurrent = nextPending || allRefs[allRefs.length - 1] || 'A1';
  }

  const xp = typeof data.xp === 'number' ? data.xp : prevStats.xp;
  const gems = typeof data.bytes === 'number' ? data.bytes : prevStats.gems;
  const lives = typeof data.integrity === 'number' ? data.integrity : prevStats.lives;
  const streakFromDoc = typeof data.streakDays === 'number' ? data.streakDays : 0;
  const streak =
    streakFromDoc > 0
      ? streakFromDoc
      : Object.keys(completedLevels).length > 0
      ? Math.max(1, prevStats.streak)
      : prevStats.streak;

  const isPro = Boolean(data.isPro) || Boolean(prevStats.isPro);
  const subscriptionPlan =
    typeof data.subscriptionPlan === 'string'
      ? data.subscriptionPlan
      : prevStats.subscriptionPlan;

  let levelTitle = typeof data.levelTitle === 'string' ? data.levelTitle : 'Becario';
  if (xp >= 5000) levelTitle = 'Maestro de Datos';
  else if (xp >= 2500) levelTitle = 'Ninja de Fórmulas';
  else if (xp >= 1000) levelTitle = 'Analista';

  return {
    ...prevStats,
    xp,
    gems,
    lives: isPro ? 5 : Math.max(0, Math.min(5, lives)),
    maxLives: 5,
    streak,
    completedLevels,
    unlockedLevel: effectiveCurrent,
    isPro,
    subscriptionPlan,
    levelTitle,
    displayName: typeof data.displayName === 'string' ? data.displayName : prevStats.displayName,
    photoUrl: typeof data.photoUrl === 'string' ? data.photoUrl : prevStats.photoUrl,
    activityHistory:
      data.activityHistory && typeof data.activityHistory === 'object'
        ? data.activityHistory
        : prevStats.activityHistory,
    lastStreakDate:
      typeof data.lastStreakDate === 'string' ? data.lastStreakDate : prevStats.lastStreakDate,
  };
}

/**
 * Writes updated `UserStats` to Firestore `users/{uid}` in the exact schema expected by Flutter's `isValidUser` rule.
 */
export async function syncStatsToFirestore(uid: string, stats: UserStats, user?: FirebaseUser | null): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    const completedIntMap: Record<string, number> = {};
    for (const [k, v] of Object.entries(stats.completedLevels)) {
      completedIntMap[k.toUpperCase()] = typeof v === 'number' ? v : (v?.stars ?? 3);
    }

    let levelTitle = stats.levelTitle || 'Becario';
    if (stats.xp >= 5000) levelTitle = 'Maestro de Datos';
    else if (stats.xp >= 2500) levelTitle = 'Ninja de Fórmulas';
    else if (stats.xp >= 1000) levelTitle = 'Analista';

    const payload: Record<string, any> = {
      xp: stats.xp,
      bytes: stats.gems,
      integrity: stats.isPro ? 5 : stats.lives,
      streakDays: stats.streak,
      currentLevel: stats.unlockedLevel.toUpperCase(),
      completedLevels: completedIntMap,
      levelTitle,
      updatedAt: serverTimestamp(),
    };

    if (stats.displayName || user?.displayName) {
      payload.displayName = stats.displayName || user?.displayName;
    }
    if (user?.email) payload.email = user.email;
    if (stats.photoUrl || user?.photoURL) {
      payload.photoUrl = stats.photoUrl || user?.photoURL;
    }
    if (stats.activityHistory && Object.keys(stats.activityHistory).length > 0) {
      payload.activityHistory = stats.activityHistory;
    }
    if (stats.lastStreakDate) {
      payload.lastStreakDate = stats.lastStreakDate;
    }
    if (stats.isPro) payload.isPro = true;
    if (stats.subscriptionPlan) payload.subscriptionPlan = stats.subscriptionPlan;

    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn('[FirestoreSync] Error syncing user stats:', err);
  }
}

/**
 * Checks if the user also has a Duo Partner PRO invitation or another document with the same email,
 * and checks RevenueCat for `gridverse_pro`.
 */
export async function verifyAndSyncProAndLegacyProfile(
  user: FirebaseUser,
  currentData: Record<string, any> | undefined
): Promise<{ isPro: boolean; planName?: string; mergedData?: Record<string, any> }> {
  let isPro = Boolean(currentData?.isPro);
  let planName: string | undefined = currentData?.subscriptionPlan;
  let mergedData: Record<string, any> | undefined = currentData ? { ...currentData } : undefined;

  // 1. Check RevenueCat REST API for this UID
  const rcInfo = await checkRevenueCatProStatus(user.uid);
  if (rcInfo.isPro) {
    isPro = true;
    planName = rcInfo.planName || planName || 'lifetime';
  }

  // 2. Check if there is a Duo Partner invitation or another profile sharing the same email
  if (user.email) {
    const cleanEmail = user.email.trim().toLowerCase();
    try {
      const duoQ = query(
        collection(db, 'users'),
        where('duoPartnerEmail', '==', cleanEmail),
        limit(1)
      );
      const duoSnap = await getDocs(duoQ);
      if (!duoSnap.empty) {
        isPro = true;
        planName = planName || 'duo';
      }
    } catch {
      // Ignore query error
    }

    // If current document has no progress, check if another document exists with the same email
    const hasCompleted =
      currentData?.completedLevels && Object.keys(currentData.completedLevels).length > 0;
    if (!hasCompleted) {
      try {
        const emailQ = query(
          collection(db, 'users'),
          where('email', '==', user.email.trim()),
          limit(3)
        );
        const emailSnap = await getDocs(emailQ);
        for (const d of emailSnap.docs) {
          if (d.id !== user.uid) {
            const other = d.data();
            const otherCount = other.completedLevels
              ? Object.keys(other.completedLevels).length
              : 0;
            if (otherCount > 0) {
              mergedData = { ...other, ...currentData, completedLevels: other.completedLevels, currentLevel: other.currentLevel, xp: Math.max(other.xp || 0, currentData?.xp || 0), bytes: Math.max(other.bytes || 100, currentData?.bytes || 0) };
              const otherRc = await checkRevenueCatProStatus(d.id);
              if (otherRc.isPro || other.isPro) {
                isPro = true;
                planName = otherRc.planName || other.subscriptionPlan || 'lifetime';
              }
              break;
            }
          }
        }
      } catch {
        // Ignore
      }
    }
  }

  if (isPro && (!currentData?.isPro || (planName && currentData?.subscriptionPlan !== planName))) {
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          isPro: true,
          ...(planName ? { subscriptionPlan: planName } : {}),
          proUpdatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch {
      // Ignore
    }
  }

  return { isPro, planName, mergedData };
}

export async function signInWithGooglePopup() {
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithApplePopup() {
  return signInWithPopup(auth, appleProvider);
}

export async function linkAccountWithApple() {
  if (!auth.currentUser) throw new Error('No hay sesión activa para vincular.');
  return linkWithPopup(auth.currentUser, appleProvider);
}

export async function linkAccountWithGoogle() {
  if (!auth.currentUser) throw new Error('No hay sesión activa para vincular.');
  return linkWithPopup(auth.currentUser, googleProvider);
}

export async function updateUserProfileData(
  displayName: string,
  photoUrl: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await updateProfile(user, {
      displayName: displayName.trim().slice(0, 25),
      ...(photoUrl.startsWith('http') ? { photoURL: photoUrl } : {}),
    });
  } catch (err) {
    console.warn('[Auth] Error updating Firebase Auth profile:', err);
  }
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        displayName: displayName.trim().slice(0, 25),
        photoUrl: photoUrl.slice(0, 500),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('[Firestore] Error updating user profile doc:', err);
  }
}

export async function deleteAccountAndFirestoreData(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (err) {
    console.warn('[Firestore] Error deleting user doc:', err);
  }
  await deleteUser(user);
}

export async function submitAppFeedback(feedback: string): Promise<void> {
  const user = auth.currentUser;
  const cleanText = feedback.trim().slice(0, 1990);
  if (!cleanText) return;
  await addDoc(collection(db, 'app_feedback'), {
    uid: user?.uid || 'guest_web',
    email: user?.email || 'guest@gridverse.app',
    feedback: cleanText,
    createdAt: serverTimestamp(),
    platform: 'web',
  });
}
