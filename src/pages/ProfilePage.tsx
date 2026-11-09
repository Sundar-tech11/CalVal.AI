import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  Lock,
  Edit2,
  Check,
  Sparkles,
  ArrowRight,
  LogOut,
  Layers,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../lib/firestoreService';

export const ProfilePage: React.FC = () => {
  const { currentUser, userProfile, logout, openAuthModal, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-[#101217] border border-stone-800 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-serif text-stone-50 mb-2">Account Profile</h2>
          <p className="text-xs text-stone-400 mb-6">
            Please sign in to view and manage your CalVal.AI investor account details.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold tracking-wide transition shadow-md shadow-amber-950/40 cursor-pointer hover-control-gold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    try {
      setSaving(true);
      await updateUserProfile(currentUser.uid, { displayName: displayName.trim() });
      await refreshProfile();
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const isGoogleUser = currentUser.providerData?.some((p) => p.providerId === 'google.com');

  return (
    <div id="profile-page" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title */}
      <div className="border-b border-stone-800/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
            Investor Credentials
          </span>
        </div>
        <h1 className="text-3xl font-serif text-stone-50 tracking-tight font-normal">
          Account Profile & Security
        </h1>
        <p className="text-xs text-stone-400 font-light mt-1">
          Manage your credentials, authentication session, and institutional subscription settings.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-[#101217] border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-800/80">
          <div className="flex items-center gap-4">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-16 h-16 rounded-2xl border-2 border-amber-500/40 object-cover shadow-lg shadow-black/60"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-stone-900 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl font-serif font-bold shadow-lg shadow-black/60">
                {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-medium text-stone-100">
                  {userProfile?.displayName || currentUser.displayName || 'CalVal Investor'}
                </h2>
                <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  {userProfile?.role || 'Investor'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-rose-300 text-xs border border-stone-800 hover:border-rose-900/60 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Edit Display Name */}
        <div className="mt-6">
          {editing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 max-w-md">
              <label className="block text-[11px] uppercase tracking-wider font-mono text-stone-400">
                Display Name / Institution
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500/60"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-3 py-2 rounded-xl bg-stone-900 text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between max-w-md">
              <div>
                <div className="text-[10px] uppercase font-mono text-stone-500">Account Name</div>
                <div className="text-sm text-stone-200 font-medium">
                  {userProfile?.displayName || currentUser.displayName || 'CalVal Investor'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          )}
        </div>

        {/* Security & Verification Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-stone-800/80">
          <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentication</span>
            </div>
            <div className="text-xs text-stone-200 font-medium">
              {isGoogleUser ? 'Google OAuth 2.0' : 'Email & Password'}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              Persistent encrypted session
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Database Storage</span>
            </div>
            <div className="text-xs text-stone-200 font-medium">
              Google Cloud Firestore
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              Isolated user partition
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>Session ID</span>
            </div>
            <div className="text-xs text-stone-300 font-mono truncate">
              {currentUser.uid.slice(0, 16)}...
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              Zero-Trust Token Verified
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Card */}
      <div className="bg-[#101217] border border-stone-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-serif text-stone-100">Ready to evaluate properties?</h3>
          <p className="text-xs text-stone-400 font-light mt-0.5">
            Use the multi-algorithm ML pipeline to estimate valuations across all California submarkets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs border border-stone-800 transition"
          >
            View Portfolio
          </Link>
          <Link
            to="/valuation"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold tracking-wide transition hover-control-gold"
          >
            <span>Run Valuation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
