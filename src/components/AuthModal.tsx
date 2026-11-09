import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Globe,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authMode,
    closeAuthModal,
    setAuthMode,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [domainCopied, setDomainCopied] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      setError(null);
      setUnauthorizedDomain(null);
      setResetSent(false);
      setIsForgotPassword(false);
      setDomainCopied(false);
    }
  }, [authModalOpen, authMode]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const getFriendlyErrorMessage = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/unauthorized-domain') {
      return `Domain "${window.location.hostname}" is not authorized in Firebase Console. Whitelist it in Firebase Authentication Settings or use Email & Password below.`;
    }
    if (code === 'auth/operation-not-allowed') {
      return 'This sign-in provider is disabled in Firebase Console. Please enable it under Authentication > Sign-in method.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'Incorrect email or password. Please verify your credentials.';
    }
    if (code === 'auth/user-not-found') {
      return 'No account registered with this email address.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account already exists with this email address. Try signing in.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Sign-in window was closed before completion. Please try again.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    }
    if (code === 'auth/cancelled-popup-request') {
      return 'Authentication request was replaced by another popup.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many login attempts. Please wait a few moments and try again.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet connectivity.';
    }
    return err?.message || 'Authentication failed. Please try again.';
  };

  const handleCopyDomain = async (domainToCopy: string) => {
    try {
      await navigator.clipboard.writeText(domainToCopy);
      setDomainCopied(true);
      setTimeout(() => setDomainCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      setUnauthorizedDomain(null);
      await signInWithGoogle();
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain') {
        const currentHost = window.location.hostname;
        setUnauthorizedDomain(currentHost);
        setError(getFriendlyErrorMessage(err));
      } else {
        setError(getFriendlyErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isForgotPassword) {
      if (!email.trim()) {
        setError('Please enter your email to receive a password reset link.');
        return;
      }
      try {
        setLoading(true);
        await sendPasswordReset(email.trim());
        setResetSent(true);
      } catch (err: any) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (authMode === 'signup') {
      if (!displayName.trim()) {
        setError('Please enter your name or firm.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      try {
        setLoading(true);
        await signUpWithEmail(email, password, displayName);
      } catch (err: any) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter both email and password.');
        return;
      }
      try {
        setLoading(true);
        await signInWithEmail(email, password);
      } catch (err: any) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFillDemo = () => {
    setEmail('investor@calval.ai');
    setPassword('CalVal2026!');
    setConfirmPassword('CalVal2026!');
    setDisplayName('California Analyst');
  };

  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'calval-cbe3d';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-md bg-[#101217] border border-stone-800 rounded-2xl shadow-2xl shadow-black/90 p-6 sm:p-8 overflow-hidden text-stone-100 max-h-[92vh] overflow-y-auto">
        {/* Amber accent glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-lg text-stone-400 hover:text-white bg-stone-900/60 hover:bg-stone-800 border border-stone-800/80 transition cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-stone-900/90 border border-amber-500/40 p-2 shadow-md shadow-amber-950/30 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-2xl font-serif font-normal text-stone-50 tracking-tight">
            {isForgotPassword
              ? 'Reset Password'
              : authMode === 'signin'
              ? 'Welcome to CalVal.AI'
              : 'Create Investor Account'}
          </h2>
          <p className="text-xs text-stone-400 font-light mt-1">
            {isForgotPassword
              ? 'Enter your email to receive recovery instructions.'
              : authMode === 'signin'
              ? 'Access saved valuations, custom portfolios, and model benchmarks.'
              : 'Save California housing appraisals and track submarket valuations.'}
          </p>
        </div>

        {/* Google One-Click Auth */}
        {!isForgotPassword && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800/90 text-stone-200 hover:text-white text-xs font-medium border border-stone-700/80 hover:border-amber-500/40 transition duration-200 shadow-md shadow-black/40 cursor-pointer disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Specialized Domain Authorization Guidance if unauthorized-domain occurred */}
            {unauthorizedDomain && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-stone-200 text-xs space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-300 text-xs">
                      Firebase Domain Whitelist Required
                    </h4>
                    <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                      Google OAuth requires this preview domain to be authorized in your Firebase Project (
                      <span className="font-mono text-amber-200">{projectId}</span>):
                    </p>
                  </div>
                </div>

                {/* Hostname display with copy button */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-black/60 border border-stone-800">
                  <Globe className="w-3.5 h-3.5 text-stone-400 ml-1 shrink-0" />
                  <span className="font-mono text-[10px] text-amber-200 truncate flex-1 select-all">
                    {unauthorizedDomain}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyDomain(unauthorizedDomain)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[10px] font-medium text-stone-200 hover:text-white transition cursor-pointer shrink-0"
                  >
                    {domainCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[10px] text-stone-400 space-y-1">
                  <p>
                    1. Go to{' '}
                    <a
                      href={`https://console.firebase.google.com/project/${projectId}/authentication/settings`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline hover:text-amber-300 inline-flex items-center gap-0.5"
                    >
                      Firebase Console Settings <ExternalLink className="w-2.5 h-2.5 inline" />
                    </a>
                  </p>
                  <p>2. Under <strong>Authorized domains</strong>, click <strong>Add domain</strong> and paste the host.</p>
                </div>

                <div className="pt-1.5 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
                  <span className="text-amber-200/90 font-medium">Or register with Email below:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError(null);
                    }}
                    className="text-amber-400 hover:underline font-semibold cursor-pointer"
                  >
                    Sign Up Free
                  </button>
                </div>
              </div>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-[#101217] px-2 text-stone-500">Or with Email</span>
              </div>
            </div>
          </div>
        )}

        {/* Generic Error message (when not unauthorized domain, or general message) */}
        {error && !unauthorizedDomain && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Reset Sent */}
        {resetSent ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Password Reset Link Sent</span>
            </div>
            <p className="text-emerald-300/80 text-[11px]">
              We have dispatched a reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setResetSent(false);
              }}
              className="mt-2 text-amber-400 hover:underline text-xs block cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && !isForgotPassword && (
              <div>
                <label className="block text-stone-400 text-[11px] uppercase tracking-wider font-mono mb-1">
                  Full Name / Firm
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alexandra Vance"
                    className="w-full pl-9 pr-3 py-2 bg-stone-900/90 border border-stone-800 rounded-xl text-stone-100 text-xs placeholder:text-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-stone-400 text-[11px] uppercase tracking-wider font-mono mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@calval.ai"
                  className="w-full pl-9 pr-3 py-2 bg-stone-900/90 border border-stone-800 rounded-xl text-stone-100 text-xs placeholder:text-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-400 text-[11px] uppercase tracking-wider font-mono">
                    Password
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 transition cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-stone-900/90 border border-stone-800 rounded-xl text-stone-100 text-xs placeholder:text-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>
              </div>
            )}

            {authMode === 'signup' && !isForgotPassword && (
              <div>
                <label className="block text-stone-400 text-[11px] uppercase tracking-wider font-mono mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-stone-900/90 border border-stone-800 rounded-xl text-stone-100 text-xs placeholder:text-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold tracking-wide transition shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 hover-control-gold"
            >
              <span>
                {loading
                  ? 'Verifying...'
                  : isForgotPassword
                  ? 'Send Reset Link'
                  : authMode === 'signin'
                  ? 'Sign In to CalVal.AI'
                  : 'Complete Registration'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Demo Account Helper for fast testing */}
        {!isForgotPassword && (
          <div className="mt-3 flex items-center justify-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] text-stone-400 hover:text-amber-400 transition cursor-pointer underline underline-offset-2"
            >
              Fill test demo credentials (investor@calval.ai)
            </button>
          </div>
        )}

        {/* Bottom Switcher */}
        <div className="mt-4 pt-4 border-t border-stone-800/80 text-center text-xs text-stone-400">
          {isForgotPassword ? (
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
            >
              Back to Sign In
            </button>
          ) : authMode === 'signin' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
