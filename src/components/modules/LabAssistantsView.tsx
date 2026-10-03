import React from 'react';
import { Mail, Phone, Building2, Plus, Zap } from 'lucide-react';
import { LabAssistant } from '../../types';

interface LabAssistantsViewProps {
  assistants: LabAssistant[];
}

export const LabAssistantsView: React.FC<LabAssistantsViewProps> = ({ assistants }) => {
  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Laboratory Technical Staff & Duty Roster
          </h2>
          <p className="text-xs text-[#a39589] mt-0.5">
            Supervising operators assigned to research laboratory facilities and equipment bays.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 transition-all">
          <Plus className="h-4 w-4 text-red-300" />
          <span>Assign New Lab Assistant</span>
        </button>
      </div>

      {/* Grid of Lab Assistants */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {assistants.map((ast) => (
          <div
            key={ast.id}
            className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 space-y-4 hover:border-red-900/60 shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-red-300 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-800/50">
                    {ast.staffId}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                    Active Duty
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">{ast.name}</h3>
                <p className="text-xs text-[#9e8d80]">{ast.department}</p>
              </div>
            </div>

            {/* Assigned Labs */}
            <div>
              <span className="text-[11px] font-semibold text-[#8a796e] uppercase tracking-wider">
                Assigned Facilities ({ast.assignedLabs.length})
              </span>
              <div className="mt-2 space-y-1.5">
                {ast.assignedLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="flex items-center justify-between rounded-xl border border-[#2b1a18] bg-[#1c1312] px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-red-400" />
                      <span className="font-medium text-stone-200">{lab.name}</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-red-400">
                      {lab.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact details */}
            <div className="pt-2 border-t border-[#231614] flex items-center justify-between text-xs text-[#a39589]">
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#7d6c60]" />
                <span>{ast.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#7d6c60]" />
                <span className="font-mono text-[11px]">{ast.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
