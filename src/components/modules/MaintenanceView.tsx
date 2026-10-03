import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { MaintenanceRecord, Equipment } from '../../types';

interface MaintenanceViewProps {
  records: MaintenanceRecord[];
  equipment: Equipment[];
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ records, equipment }) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'reported'>('all');

  const filtered = records.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Maintenance, Calibration & Repair Registry
          </h2>
          <p className="text-xs text-[#a39589] mt-0.5">
            Hardware upkeep, manufacturer calibration cycles, and vendor service tracking.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 transition-all">
          <Plus className="h-4 w-4 text-red-300" />
          <span>Create Maintenance Ticket</span>
        </button>
      </div>

      {/* Maintenance Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d1211] border border-[#382320] text-red-400 mb-3">
            <Wrench className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Maintenance Tickets</h3>
          <p className="text-xs text-[#8a796e] max-w-sm mx-auto mt-1">
            All equipment assets across university laboratories are operating within normal operational and calibration parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 space-y-4 hover:border-red-900/60 shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
                    {item.assetTag}
                  </span>
                  <span
                    className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                      item.priority === 'high' || item.priority === 'critical'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">{item.equipmentName}</h3>
                <p className="text-xs text-[#8a796e]">{item.labName}</p>
              </div>

              <span
                className={`text-xs font-semibold capitalize font-mono ${
                  item.status === 'in_progress' ? 'text-amber-400' : 'text-red-400'
                }`}
              >
                {item.status.replace('_', ' ')}
              </span>
            </div>

            <div className="rounded-xl bg-[#1c1312] border border-[#2d1b19] p-3 text-xs">
              <span className="text-red-400 font-medium">Issue Description:</span>
              <p className="text-[#d1c2b5] mt-1 leading-relaxed">
                {item.issueDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-[#8a796e] pt-1 border-t border-[#231614]">
              <div>
                <span>Reported By: </span>
                <span className="font-medium text-white">{item.reportedBy}</span>
              </div>
              <div>
                <span>Date: </span>
                <span className="font-mono text-stone-300">{item.reportedDate}</span>
              </div>
              {item.technicianName && (
                <div className="col-span-2">
                  <span>Assigned Service Engineer: </span>
                  <span className="font-medium text-white">{item.technicianName}</span>
                </div>
              )}
              {item.cost && (
                <div>
                  <span>Estimated Cost: </span>
                  <span className="font-bold text-emerald-400 font-mono">${item.cost}</span>
                </div>
              )}
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};
