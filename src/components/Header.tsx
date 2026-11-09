import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Menu,
  X,
  RotateCcw,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Building2,
  FolderPlus
} from 'lucide-react';
import { DatasetStats, ModelMeta } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  stats: DatasetStats | null;
  activeModel: ModelMeta | null;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, activeModel, onReset }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, userProfile, logout, openAuthModal } = useAuth();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Valuation', href: '/valuation' },
    { label: 'California Map', href: '/california-map' },
    { label: 'Consensus', href: '/consensus' },
    { label: 'Market Analytics', href: '/analytics' },
    { label: 'Explainable AI', href: '/explainable-ai' },
    { label: 'Methodology', href: '/methodology' },
    ...(currentUser ? [{ label: 'Portfolio', href: '/dashboard' }] : []),
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile and dropdown menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header id="app-header" className="navbar-glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-stone-900/90 border border-amber-500/40 p-1 flex items-center justify-center shadow-md shadow-amber-950/20 group-hover:border-amber-400 group-hover:shadow-amber-500/20 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="text-xl font-serif tracking-tight text-stone-50 font-normal">
                CalVal<span className="text-amber-400 italic">.AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest uppercase font-mono px-1.5 py-0.2 rounded bg-stone-900/80 text-stone-400 border border-stone-800/80">
                California ML
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-light tracking-wide">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`py-1 transition-all duration-200 relative ${
                  active
                    ? 'text-amber-300 font-medium drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'text-stone-300 hover:text-amber-300 hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA, Auth & Model Status */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/80 border border-stone-800/90 text-[11px] text-stone-300 font-mono shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-stone-400">Model:</span>
            <strong className="text-amber-300 font-medium">
              {activeModel ? activeModel.name.split(' ')[0] : 'XGBoost'}
            </strong>
          </div>

          <button
            id="btn-reset-defaults"
            type="button"
            onClick={onReset}
            title="Reset parameters to California default"
            className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/40 text-stone-400 hover:text-amber-200 transition-all duration-200 cursor-pointer hover:shadow-[0_0_12px_-2px_rgba(245,158,11,0.2)]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Account / Auth Trigger */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-stone-200 transition cursor-pointer"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Avatar'}
                    className="w-6 h-6 rounded-lg object-cover border border-amber-500/40"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xs font-serif font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium max-w-[100px] truncate">
                  {userProfile?.displayName || currentUser.displayName?.split(' ')[0] || 'Investor'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#101217] border border-stone-800 rounded-xl shadow-2xl py-2 z-50 text-xs text-stone-200 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-2 border-b border-stone-800/80">
                    <p className="font-medium text-stone-100 truncate">
                      {userProfile?.displayName || currentUser.displayName || 'Investor'}
                    </p>
                    <p className="text-[11px] text-stone-400 font-mono truncate">{currentUser.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-stone-900 hover:text-amber-300 transition"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Portfolio Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-stone-900 hover:text-amber-300 transition"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                      <span>Profile & Security</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-stone-800/80">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-rose-300 hover:bg-rose-950/40 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white text-xs font-medium border border-stone-700/80 hover:border-amber-500/40 transition cursor-pointer"
            >
              Sign In
            </button>
          )}

          <Link
            to="/valuation"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold tracking-wide transition-all duration-200 shadow-md shadow-amber-950/40 cursor-pointer hover-control-gold"
          >
            Estimate Value
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          {currentUser ? (
            <Link
              to="/dashboard"
              className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 text-xs font-medium"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs font-medium"
            >
              Sign In
            </button>
          )}
          <Link
            to="/valuation"
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold sm:hidden transition hover-control-gold"
          >
            Estimate
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800 hover:border-amber-500/40 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0b0d11]/95 backdrop-blur-2xl border-b border-stone-800/80 shadow-2xl px-4 pt-2 pb-5 space-y-3">
          <div className="flex flex-col space-y-1 text-sm text-stone-300 font-light">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg transition ${
                    active
                      ? 'bg-stone-900 text-amber-300 font-medium'
                      : 'hover:bg-stone-900 hover:text-amber-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {currentUser && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-stone-900 hover:text-amber-300 transition flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-stone-400" />
                <span>Profile & Security</span>
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              Active: {activeModel ? activeModel.name : 'XGBoost'}
            </span>
            <button
              type="button"
              onClick={() => {
                onReset();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {currentUser && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 text-xs flex items-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({currentUser.email})</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
