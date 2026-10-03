import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  Eye,
  X,
} from 'lucide-react';
import { UniversityLogo } from '../common/UniversityLogo';

export const ReportsView: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showDocModal, setShowDocModal] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setDownloadSuccess(format);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Official Institutional Letterhead Header */}
      <div className="rounded-2xl border border-[#382320] bg-gradient-to-r from-[#1c1211] via-[#221514] to-[#170e0d] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <UniversityLogo size="lg" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60 uppercase">
                  BBSUTSD Official Governance
                </span>
                <span className="text-xs text-[#8f7e71]">Khairpur Mirs, Sindh</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-1">
                The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur
              </h2>
              <p className="text-xs text-[#a39589] mt-0.5">
                Central Laboratory Directorate · Semester Asset Utilization &amp; Statutory Compliance Audits
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowDocModal('clearance')}
              className="flex items-center gap-1.5 rounded-xl border border-amber-800/60 bg-amber-950/30 px-3.5 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-900/40 transition"
            >
              <Eye className="h-4 w-4 text-amber-400" />
              <span>Preview Clearance Certificate</span>
            </button>
            <button
              onClick={() => handleExport('Official PDF Executive Audit')}
              className="flex items-center gap-1.5 rounded-xl border border-[#382320] bg-[#1a1211] px-3.5 py-2 text-xs font-semibold text-[#f5efe8] hover:border-red-900/50 hover:bg-[#251917] transition"
            >
              <FileText className="h-4 w-4 text-red-400" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExport('Excel Comprehensive Ledger')}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] transition"
            >
              <FileSpreadsheet className="h-4 w-4 text-red-300" />
              <span>Export CSV / Excel</span>
            </button>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="rounded-xl bg-[#141d17] border border-emerald-800/60 p-3 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            Generated and verified {downloadSuccess} under seal of The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur.
          </span>
        </div>
      )}

      {/* Analytics Metric Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 shadow-xl">
          <span className="text-xs font-medium text-[#8a796e]">Campus Asset Utilization Index</span>
          <div className="mt-2 text-2xl font-bold text-white tabular-nums font-mono">92.8%</div>
          <p className="mt-1 text-xs text-emerald-400">+3.6% vs previous academic term</p>
        </div>

        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 shadow-xl">
          <span className="text-xs font-medium text-[#8a796e]">Average Turnaround Policy</span>
          <div className="mt-2 text-2xl font-bold text-white tabular-nums font-mono">5.4 Days</div>
          <p className="mt-1 text-xs text-[#a39589]">Institutional loan policy ceiling: 7.0 Days</p>
        </div>

        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 shadow-xl">
          <span className="text-xs font-medium text-[#8a796e]">Damage &amp; Discrepancy Rate</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400 tabular-nums font-mono">0.24%</div>
          <p className="mt-1 text-xs text-emerald-400">Strictly adheres to BBSUTSD quality threshold</p>
        </div>
      </div>

      {/* Departmental Utilization Breakdown */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            BBSUTSD Departmental Equipment Allocation &amp; Active Utilization
          </h3>
          <span className="text-xs font-mono text-[#8f7e71]">Academic Term 2025–2026</span>
        </div>

        <div className="space-y-4 pt-1">
          <div>
            <div className="flex justify-between text-xs font-medium text-[#c4b5a8] mb-1">
              <span>Department of Electrical Engineering Technology (142 Units)</span>
              <span className="tabular-nums font-mono text-red-400 font-semibold">95% Active</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
              <div className="h-full bg-red-600 rounded-full shadow-[0_0_8px_#ef4444]" style={{ width: '95%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-[#c4b5a8] mb-1">
              <span>Department of Mechanical Engineering Technology (96 Units)</span>
              <span className="tabular-nums font-mono text-amber-400 font-semibold">89% Active</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '89%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-[#c4b5a8] mb-1">
              <span>Department of Electronics Engineering Technology (88 Units)</span>
              <span className="tabular-nums font-mono text-stone-300 font-semibold">84% Active</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
              <div className="h-full bg-stone-500 rounded-full" style={{ width: '84%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-[#c4b5a8] mb-1">
              <span>Department of Computer Science &amp; IT (130 Units)</span>
              <span className="tabular-nums font-mono text-red-400 font-semibold">92% Active</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
              <div className="h-full bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" style={{ width: '92%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-[#c4b5a8] mb-1">
              <span>Department of Petroleum &amp; Chemical Technology (115 Units)</span>
              <span className="tabular-nums font-mono text-emerald-400 font-semibold">78% Active</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-[#c4b5a8] mb-1">
              <span>Department of Civil Engineering Technology (74 Units)</span>
              <span className="tabular-nums font-mono text-sky-400 font-semibold">82% Active</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
              <div className="h-full bg-sky-600 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate Preview Modal */}
      {showDocModal === 'clearance' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-amber-700/60 bg-[#160f0e] p-6 shadow-2xl text-[#f5efe8] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDocModal(null)}
              className="absolute top-4 right-4 text-[#8f7e71] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Official Letterhead Header */}
            <div className="text-center border-b-2 border-red-900/60 pb-5 mb-5">
              <div className="flex justify-center mb-2">
                <UniversityLogo size="xl" showText={false} />
              </div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur
              </h3>
              <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest mt-0.5">
                Central Laboratory Directorate · Office of the HOD
              </p>
              <p className="text-[11px] text-[#9c8c7f]">
                Khairpur Mirs, Sindh, Pakistan · Web: www.bbsutsd.edu.pk
              </p>
            </div>

            {/* Certificate Body */}
            <div className="bg-[#1c1312] p-5 rounded-xl border border-[#382320] space-y-4 text-xs">
              <div className="text-center font-bold text-sm tracking-wide text-red-300 underline uppercase">
                Official Laboratory Clearance Certificate (Provisional)
              </div>

              <div className="grid grid-cols-2 gap-3 text-[#b8a89b]">
                <div>
                  <span className="block text-[10px] uppercase text-[#7d6c60]">Student Name:</span>
                  <span className="font-semibold text-white">Bilal Abbasi</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#7d6c60]">Roll Number:</span>
                  <span className="font-mono font-semibold text-white">22BBSUTSD-EET-042</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#7d6c60]">Department:</span>
                  <span className="text-white">Department of Electrical Engineering Technology</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#7d6c60]">Certificate Ref:</span>
                  <span className="font-mono text-red-400">BBSUTSD/LAB/CLR/2026/089</span>
                </div>
              </div>

              <p className="text-[#a39589] leading-relaxed pt-2 border-t border-[#2d1b19]">
                This is to officially certify that the student above has reconciled and returned all issued electronic equipment, precision tooling, and measurement apparatus to the designated laboratories. No overdue holds, damage penalties, or laboratory dues remain outstanding.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2d1b19]">
                <div>
                  <div className="h-10 flex items-end">
                    <span className="font-serif italic text-amber-200 text-sm">Engr. Tarique H. Soomro</span>
                  </div>
                  <div className="border-t border-[#543b37] pt-1 text-[10px] text-[#8a796e]">
                    Laboratory Technologist / Assistant Incharge
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-10 flex items-end justify-end">
                    <span className="font-serif italic text-amber-200 text-sm">Prof. Dr. Abdul Qadir Memon</span>
                  </div>
                  <div className="border-t border-[#543b37] pt-1 text-[10px] text-[#8a796e]">
                    Head of Department (HOD) / Director Laboratories
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-red-800/60 bg-red-950/40 px-4 py-2 text-xs font-semibold text-white hover:bg-red-900/50 transition"
              >
                <Printer className="h-4 w-4 text-red-300" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowDocModal(null)}
                className="rounded-xl border border-[#382320] bg-[#1c1312] px-4 py-2 text-xs font-semibold text-stone-300 hover:bg-[#251917] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
