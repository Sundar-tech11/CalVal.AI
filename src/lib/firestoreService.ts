import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  increment,
  Unsubscribe,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from './firebase';
import { SavedValuation, UserProfile } from '../types';

// Timeout helper to guarantee promises never hang in restricted iframes or offline states
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }).catch((err) => {
      clearTimeout(timer);
      throw err;
    }),
    timeoutPromise,
  ]);
}

/**
 * Creates or updates the user profile document at /users/{uid}
 */
export async function syncUserProfile(user: User): Promise<UserProfile> {
  const path = `users/${user.uid}`;
  const now = new Date().toISOString();
  const userRef = doc(db, 'users', user.uid);

  const defaultProfile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'CalVal Investor',
    photoURL: user.photoURL || undefined,
    role: 'user',
    savedCount: 0,
    favoritesCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  try {
    let existingProfile: UserProfile | null = null;
    try {
      // 3.5s timeout for initial profile check
      const existingSnap = await withTimeout(
        getDoc(userRef),
        3500,
        'Profile lookup timed out'
      );
      if (existingSnap.exists()) {
        existingProfile = existingSnap.data() as UserProfile;
      }
    } catch (readErr: any) {
      console.warn('Profile read notice (offline, timeout, or connecting):', readErr?.message || readErr);
    }

    if (!existingProfile) {
      // Initial profile creation with 5s timeout
      await withTimeout(
        setDoc(userRef, cleanFirestoreData(defaultProfile), { merge: true }),
        5000,
        'Profile creation timed out'
      ).catch((err) => {
        console.warn('Could not persist profile to Firestore immediately:', err?.message || err);
      });
      return defaultProfile;
    } else {
      const updates: Partial<UserProfile> = {
        updatedAt: now,
      };
      if (user.displayName && user.displayName !== existingProfile.displayName) {
        updates.displayName = user.displayName;
      }
      if (user.photoURL && user.photoURL !== existingProfile.photoURL) {
        updates.photoURL = user.photoURL;
      }
      await withTimeout(
        updateDoc(userRef, cleanFirestoreData(updates)),
        5000,
        'Profile update timed out'
      ).catch((err) => {
        console.warn('Could not update profile to Firestore immediately:', err?.message || err);
      });
      return { ...existingProfile, ...updates };
    }
  } catch (error: any) {
    if (
      error?.message?.includes('the client is offline') ||
      error?.message?.includes('timed out') ||
      error?.code === 'unavailable'
    ) {
      console.warn('Firestore client is offline or timed out while syncing profile. Using local profile state.');
      return defaultProfile;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Retrieves the current user profile from /users/{uid}
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await withTimeout(
      getDoc(userRef),
      4000,
      'Profile retrieval timed out'
    );
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (error: any) {
    if (
      error?.message?.includes('the client is offline') ||
      error?.message?.includes('timed out') ||
      error?.code === 'unavailable'
    ) {
      console.warn('Firestore client is offline or timed out; could not retrieve user profile.');
      return null;
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Updates user profile details like displayName
 */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    await withTimeout(
      updateDoc(userRef, cleanFirestoreData({
        ...data,
        updatedAt: new Date().toISOString(),
      })),
      5000,
      'Profile update timed out'
    );
  } catch (error: any) {
    if (
      error?.message?.includes('the client is offline') ||
      error?.message?.includes('timed out') ||
      error?.code === 'unavailable'
    ) {
      console.warn('Firestore client is offline or timed out; profile update queued locally.');
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

function cleanFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

/**
 * Saves a property appraisal under /users/{uid}/valuations
 * Uses explicit client-side document reference generation and timeout protection
 * to ensure that save promises never hang indefinitely.
 */
export async function saveValuation(
  uid: string,
  valuationData: Omit<SavedValuation, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  const path = `users/${uid}/valuations`;
  try {
    const valuationsCol = collection(db, 'users', uid, 'valuations');
    // Generate document reference synchronously to obtain the ID immediately
    const docRef = doc(valuationsCol);
    const now = new Date().toISOString();
    const docData: SavedValuation = {
      ...valuationData,
      id: docRef.id,
      userId: uid,
      createdAt: now,
      updatedAt: now,
    };

    // Timeout: 8 seconds maximum for server write acknowledgement
    await withTimeout(
      setDoc(docRef, cleanFirestoreData(docData)),
      8000,
      'Save timed out (8s). Firestore could not reach the server. Please verify network connectivity and that Cloud Firestore is created in your Firebase Console.'
    );

    // Update user profile counts in background without blocking the valuation response
    const userRef = doc(db, 'users', uid);
    updateDoc(userRef, {
      savedCount: increment(1),
      ...(valuationData.isFavorite ? { favoritesCount: increment(1) } : {}),
      updatedAt: now,
    }).catch(async (err) => {
      // If user profile doc does not exist yet, create it with required schema
      if (err?.code === 'not-found' || err?.message?.includes('No document to update')) {
        await setDoc(userRef, cleanFirestoreData({
          uid,
          email: '',
          displayName: 'CalVal Investor',
          role: 'user',
          savedCount: 1,
          favoritesCount: valuationData.isFavorite ? 1 : 0,
          createdAt: now,
          updatedAt: now,
        })).catch((createErr) => {
          console.warn('Could not initialize user profile counter:', createErr);
        });
      } else {
        console.warn('Could not update profile counter:', err?.message || err);
      }
    });

    return docRef.id;
  } catch (error: any) {
    const errMessage = error instanceof Error ? error.message : String(error);
    if (errMessage.includes('Save timed out')) {
      throw error;
    }
    if (
      errMessage.includes('the client is offline') ||
      error?.code === 'unavailable'
    ) {
      throw new Error(
        'Cloud Firestore is currently unreachable or offline. Please check your internet connection or Firebase setup.'
      );
    }
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Real-time listener for user's valuations
 */
export function listenUserValuations(
  uid: string,
  callback: (valuations: SavedValuation[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = `users/${uid}/valuations`;
  const valuationsCol = collection(db, 'users', uid, 'valuations');
  const q = query(valuationsCol, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: SavedValuation[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as SavedValuation),
        id: docSnap.id,
      }));
      callback(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (err) {
        if (onError) onError(err);
      }
    }
  );
}

/**
 * Toggles the favorite status of a saved valuation
 */
export async function toggleFavoriteValuation(
  uid: string,
  valuationId: string,
  currentFavoriteStatus: boolean
): Promise<void> {
  const path = `users/${uid}/valuations/${valuationId}`;
  try {
    const valuationRef = doc(db, 'users', uid, 'valuations', valuationId);
    const newStatus = !currentFavoriteStatus;
    const now = new Date().toISOString();

    await withTimeout(
      updateDoc(valuationRef, {
        isFavorite: newStatus,
        updatedAt: now,
      }),
      5000,
      'Favorite toggle timed out'
    );

    // Update user favoritesCount
    const userRef = doc(db, 'users', uid);
    updateDoc(userRef, {
      favoritesCount: increment(newStatus ? 1 : -1),
      updatedAt: now,
    }).catch((err) => {
      console.warn('Could not update favoritesCount:', err?.message || err);
    });
  } catch (error: any) {
    if (
      error?.message?.includes('the client is offline') ||
      error?.message?.includes('timed out') ||
      error?.code === 'unavailable'
    ) {
      console.warn('Firestore offline or timed out; favorite toggle queued locally.');
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Deletes a valuation record
 */
export async function deleteValuation(
  uid: string,
  valuationId: string,
  wasFavorite: boolean
): Promise<void> {
  const path = `users/${uid}/valuations/${valuationId}`;
  try {
    const valuationRef = doc(db, 'users', uid, 'valuations', valuationId);
    await withTimeout(
      deleteDoc(valuationRef),
      5000,
      'Delete valuation timed out'
    );

    // Decrement user count
    const userRef = doc(db, 'users', uid);
    updateDoc(userRef, {
      savedCount: increment(-1),
      ...(wasFavorite ? { favoritesCount: increment(-1) } : {}),
      updatedAt: new Date().toISOString(),
    }).catch((err) => {
      console.warn('Could not decrement savedCount:', err?.message || err);
    });
  } catch (error: any) {
    if (
      error?.message?.includes('the client is offline') ||
      error?.message?.includes('timed out') ||
      error?.code === 'unavailable'
    ) {
      console.warn('Firestore offline or timed out; delete queued locally.');
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
