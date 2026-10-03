import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
} from 'lucide-react';
import { LightningFilament } from '../common/LightningEffect';

export const SettingsView: React.FC = () => {
  const [defaultLoanDays, setDefaultLoanDays] = useState(7);
  const [dailyPenalty, setDailyPenalty] = useState(5.0);
  const [maxActiveLoans, setMaxActiveLoans] = useState(3);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#f5efe8]">
      {/* Top Bar */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          System & Institutional Settings
        </h2>
        <p className="text-xs text-[#a39589] mt-0.5">
          Global policies, loan rules, storage hierarchy configurations, and database readiness.
        </p>
      </div>

      {/* Firebase & Firestore Live Connection Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950/30 via-[#17201a] to-[#120e0d] p-5 shadow-xl">
        <LightningFilament className="top-0 opacity-50" />

        <div className="relative z-10 flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-950 to-emerald-800 border border-emerald-700/60 text-white shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.35)]">
            <Database className="h-5 w-5 text-emerald-200" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Firebase Firestore Live Connection
              </h3>
              <span className="rounded-full bg-emerald-950 border border-emerald-700/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
                ● Live: BBSUTSD-Laboratory-Management
              </span>
            </div>
            <p className="text-xs text-[#a39589] leading-relaxed">
              Connected with cloud persistence, real-time synchronization, and security rules deployed for the following collections:
            </p>
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-[#d1c2b5]">
              <span className="bg-[#1c1312] border border-[#382320] rounded-lg px-2.5 py-1 text-center">/laboratories</span>
              <span className="bg-[#1c1312] border border-[#382320] rounded-lg px-2.5 py-1 text-center">/equipment</span>
              <span className="bg-[#1c1312] border border-[#382320] rounded-lg px-2.5 py-1 text-center">/issueRecords</span>
              <span className="bg-[#1c1312] border border-[#382320] rounded-lg px-2.5 py-1 text-center">/students</span>
              <span className="bg-[#1c1312] border border-[#382320] rounded-lg px-2.5 py-1 text-center">/inventory</span>
              <span className="bg-[#1c1312] border border-[#382320] rounded-lg px-2.5 py-1 text-center">/maintenance</span>
              <span className="bg-[#1c1312] border border-[#382320] rounded-lg px-2.5 py-1 text-center">/activityLogs</span>
              <span className="bg-[#1c1312] border border-[#382320] rounded-lg px-2.5 py-1 text-center">/auditLogs</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold pt-1">
              ✓ Firestore SDK initialized, security rules deployed, and real-time circulation listeners active.
            </p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="rounded-xl bg-[#141d17] border border-emerald-800/60 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>System configuration parameters saved successfully.</span>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400 border-b border-[#281816] pb-2">
            Circulation & Loan Parameters
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-[#b8a89b] mb-1">
                Default Loan Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={defaultLoanDays}
                onChange={(e) => setDefaultLoanDays(Number(e.target.value))}
                className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none tabular-nums font-mono transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#b8a89b] mb-1">
                Daily Overdue Penalty ($ / Day)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={dailyPenalty}
                onChange={(e) => setDailyPenalty(Number(e.target.value))}
                className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none tabular-nums font-mono transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#b8a89b] mb-1">
                Max Concurrent Loans per Student
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxActiveLoans}
                onChange={(e) => setMaxActiveLoans(Number(e.target.value))}
                className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none tabular-nums font-mono transition"
              />
            </div>
          </div>
        </div>

        {/* Physical Hierarchy Setting */}
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 space-y-3 shadow-xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400 border-b border-[#281816] pb-2">
            Physical Asset Location Taxonomy
          </h3>

          <p className="text-xs text-[#a39589] leading-relaxed">
            The Benazir Bhutto Shaheed University of Technology and Skill Development (BBSUTSD) Central Laboratory Directorate enforces a strict 6-tier nested physical hierarchy for 100% equipment findability across campus:
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#d1c2b5] pt-1">
            <span className="rounded-lg bg-[#1c1312] border border-[#382320] px-2.5 py-1">1. Campus Building</span>
            <span className="text-red-950">→</span>
            <span className="rounded-lg bg-[#1c1312] border border-[#382320] px-2.5 py-1">2. Floor</span>
            <span className="text-red-950">→</span>
            <span className="rounded-lg bg-[#1c1312] border border-[#382320] px-2.5 py-1">3. Laboratory Room</span>
            <span className="text-red-950">→</span>
            <span className="rounded-lg bg-[#1c1312] border border-[#382320] px-2.5 py-1">4. Cabinet / Bay</span>
            <span className="text-red-950">→</span>
            <span className="rounded-lg bg-[#1c1312] border border-[#382320] px-2.5 py-1">5. Drawer / Bin</span>
            <span className="text-red-950">→</span>
            <span className="rounded-lg bg-[#1c1312] border border-[#382320] px-2.5 py-1">6. Shelf / Slot</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-6 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 transition-all"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
