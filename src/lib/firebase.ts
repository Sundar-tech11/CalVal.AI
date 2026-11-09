import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';
import fallbackConfig from '../../firebase-applet-config.json';

// Configuration precedence: import.meta.env -> firebase-applet-config.json
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (fallbackConfig as any).apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (fallbackConfig as any).authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (fallbackConfig as any).projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (fallbackConfig as any).storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (fallbackConfig as any).messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || (fallbackConfig as any).appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || (fallbackConfig as any).measurementId,
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const customDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || (fallbackConfig as any).firestoreDatabaseId;

let firestoreDb: Firestore;
try {
  firestoreDb = initializeFirestore(
    app,
    { experimentalForceLongPolling: true },
    customDatabaseId && customDatabaseId !== '(default)' ? customDatabaseId : undefined
  );
} catch {
  firestoreDb = customDatabaseId && customDatabaseId !== '(default)'
    ? getFirestore(app, customDatabaseId)
    : getFirestore(app);
}

export const db: Firestore = firestoreDb;

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app };

// OperationType and Firestore error handler conforming to Firebase Security Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errMessage = error instanceof Error ? error.message : String(error);
  const isOffline = errMessage.includes('the client is offline') || errMessage.includes('unavailable');

  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isOffline) {
    console.warn('Firestore network notice (client offline/connecting):', errMessage, path);
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  }
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot as required by skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testPromise = getDocFromServer(doc(db, 'system_health', 'connection_test'));
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Connection test timed out')), 5000);
    });
    await Promise.race([testPromise, timeoutPromise]);
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('timed out'))) {
      console.warn('Firebase client appears offline or connecting:', error.message);
      return false;
    }
    // Permissions error or non-existent document is normal for test ping
    return true;
  }
}
