import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, testFirestoreConnection } from '../lib/firebase';
import { syncUserProfile, getUserProfile } from '../lib/firestoreService';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authModalOpen: boolean;
  authMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: 'signin' | 'signup') => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Test Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection().catch((err) => {
      console.warn('Initial firestore ping notice:', err);
    });
  }, []);

  const refreshProfile = async () => {
    if (auth.currentUser) {
      try {
        const profile = await getUserProfile(auth.currentUser.uid);
        if (profile) setUserProfile(profile);
      } catch (err) {
        console.error('Failed to reload profile:', err);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(user);
          setUserProfile(profile);
        } catch (err) {
          console.warn('Could not sync user profile to Firestore:', err);
          // Set fallback profile in state
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'CalVal Investor',
            photoURL: user.photoURL || undefined,
            role: 'user',
            savedCount: 0,
            favoritesCount: 0,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const profile = await syncUserProfile(result.user).catch(() => null);
        if (profile) setUserProfile(profile);
      }
      closeAuthModal();
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain') {
        console.warn(
          `Firebase Google Sign-in notice: "${window.location.hostname}" is not yet in the Firebase Console Authorized Domains whitelist for project.`
        );
      } else {
        console.error('Google Sign-in error:', err);
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (result.user) {
        const profile = await syncUserProfile(result.user).catch(() => null);
        if (profile) setUserProfile(profile);
      }
      closeAuthModal();
    } catch (err: any) {
      console.error('Email Sign-in error:', err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (result.user && displayName) {
        await updateProfile(result.user, { displayName: displayName.trim() });
      }
      if (result.user) {
        const profile = await syncUserProfile(result.user).catch(() => null);
        if (profile) setUserProfile(profile);
      }
      closeAuthModal();
    } catch (err: any) {
      console.error('Email Sign-up error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Sign-out error:', err);
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      console.error('Password reset error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        authModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        sendPasswordReset,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
