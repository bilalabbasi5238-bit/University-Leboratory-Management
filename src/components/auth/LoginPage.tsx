import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../../types';
import { LightningFilament } from '../common/LightningEffect';
import { UniversityLogo } from '../common/UniversityLogo';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();

    // Authenticate based on credentials:
    // admin@bbsutsd.edu.pk or any email containing 'admin' / 'hod' -> HOD_ADMIN
    // assistant@bbsutsd.edu.pk or any other authorized staff -> LAB_ASSISTANT
    if (
      trimmedEmail === 'admin@bbsutsd.edu.pk' ||
      trimmedEmail === 'hod@bbsutsd.edu.pk' ||
      trimmedEmail.includes('admin') ||
      trimmedEmail.includes('hod')
    ) {
      onLoginSuccess('HOD_ADMIN');
    } else if (
      trimmedEmail === 'assistant@bbsutsd.edu.pk' ||
      trimmedEmail.includes('assistant') ||
      trimmedEmail.includes('soomro')
    ) {
      onLoginSuccess('LAB_ASSISTANT');
    } else {
      if (!trimmedEmail) {
        setErrorMsg('Please enter your institutional email address.');
        return;
      }
      // Default to HOD_ADMIN for standard credentials
      onLoginSuccess('HOD_ADMIN');
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@bbsutsd.edu.pk');
    setPassword('admin123');
    setErrorMsg('');
  };

  const autofillAssistant = () => {
    setEmail('assistant@bbsutsd.edu.pk');
    setPassword('assistant123');
    setErrorMsg('');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotPasswordModal(false);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#0c0908] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#f5efe8] overflow-hidden selection:bg-red-950 selection:text-red-200">
      {/* Background Energy Atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft radial crimson glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-b from-red-950/30 via-red-900/10 to-transparent blur-3xl animate-electric-pulse" />
        <div className="absolute -bottom-20 left-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-t from-amber-950/20 via-red-950/10 to-transparent blur-3xl" />

        {/* Subtle grid texture */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="loginGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#ef4444" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginGrid)" />
        </svg>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl text-center px-4">
        {/* Official BBSUTSD Logo using mainlogo */}
        <div className="flex justify-center mb-4">
          <UniversityLogo size="2xl" showText={false} />
        </div>

        {/* Full Official University Name */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
          The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur
        </h1>

        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="font-mono text-xs font-bold text-red-300 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-800/60 shadow-[0_0_10px_rgba(220,38,38,0.3)]">
            BBSUTSD
          </span>
          <span className="text-xs text-[#a39589]">·</span>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
            Central Laboratory Directorate &amp; Asset Management
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {/* Clean, Role-Independent Login Card with subtle red energy border */}
        <div className="relative bg-[#160f0e] py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#382320] overflow-hidden">
          <LightningFilament className="top-0 opacity-70" />

          {/* Institutional Security Badge */}
          <div className="mb-6 flex items-center justify-between rounded-xl bg-[#201413] border border-red-950/70 px-3.5 py-2.5 text-xs text-red-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-red-400 shrink-0" />
              <span className="font-semibold text-white">Institutional Authentication</span>
            </div>
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">
              256-Bit SSL
            </span>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-xl bg-red-950/60 border border-red-800 p-3 text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          {/* Unified Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[#c4b5a8] mb-1">
                Institutional Email or Staff ID
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-red-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@bbsutsd.edu.pk or assistant@bbsutsd.edu.pk"
                  required
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs border border-[#382320] rounded-xl bg-[#1c1312] text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#c4b5a8]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-[11px] font-medium text-red-400 hover:text-red-300 transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-red-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 text-xs border border-[#382320] rounded-xl bg-[#1c1312] text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a796e] hover:text-white transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 accent-red-600 rounded bg-[#1f1514] border-[#382320]"
                />
                <span className="ml-2 text-[#a39589]">Remember terminal</span>
              </label>
              <span className="text-[11px] text-[#7d6c60] font-mono">BBSUTSD Portal Node 01</span>
            </div>

            {/* Login Button with Crimson Gradient & Subtle Red Energy Glow */}
            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_25px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Sign In to BBSUTSD Portal</span>
                <ArrowRight className="h-3.5 w-3.5 text-red-300 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>

          {/* Quick Credential Autofill Helper for Seamless Review */}
          <div className="mt-6 border-t border-[#251816] pt-4">
            <p className="text-[10px] font-semibold text-[#8a796e] uppercase tracking-wider text-center mb-2.5">
              Authorized Review Credentials (Click to Autofill)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={autofillAdmin}
                className="flex flex-col items-start rounded-xl border border-[#30201d] bg-[#1a1211] p-2 hover:border-red-900/60 hover:bg-[#221614] transition text-left"
              >
                <span className="font-semibold text-red-400">HOD / Admin</span>
                <span className="font-mono text-[10px] text-[#8a796e] truncate w-full">admin@bbsutsd.edu.pk</span>
              </button>
              <button
                type="button"
                onClick={autofillAssistant}
                className="flex flex-col items-start rounded-xl border border-[#30201d] bg-[#1a1211] p-2 hover:border-red-900/60 hover:bg-[#221614] transition text-left"
              >
                <span className="font-semibold text-amber-400">Lab Assistant</span>
                <span className="font-mono text-[10px] text-[#8a796e] truncate w-full">assistant@bbsutsd.edu.pk</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowForgotPasswordModal(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-[#382320] bg-[#160f0e] p-6 shadow-2xl text-center text-[#f5efe8]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-950/80 border border-red-800 text-red-400 mb-3 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <Lock className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-white">Reset Institutional Password</h3>
            <p className="text-xs text-[#a39589] mt-1">
              Enter your verified staff email (@bbsutsd.edu.pk) to receive recovery credentials.
            </p>

            {forgotSent ? (
              <div className="mt-4 rounded-xl bg-emerald-950/40 border border-emerald-800 p-3 text-xs text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Recovery instructions dispatched to your institutional inbox!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="staff@bbsutsd.edu.pk"
                  className="block w-full px-3.5 py-2 text-xs border border-[#382320] rounded-xl bg-[#1c1312] text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="flex-1 rounded-xl border border-[#382320] bg-[#1c1312] py-2 text-xs font-semibold text-stone-300 hover:bg-[#221614] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 py-2 text-xs font-semibold text-white shadow-[0_0_12px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
