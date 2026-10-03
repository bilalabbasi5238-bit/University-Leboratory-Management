import React from 'react';
import {
  Building2,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  AlertOctagon,
  Clock,
  MapPin,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  Laboratory,
  Equipment,
  IssueRecord,
  ActiveNavModule,
  User,
} from '../../types';
import { LightningFilament } from '../common/LightningEffect';
import { UniversityLogo } from '../common/UniversityLogo';

interface LabAssistantDashboardProps {
  currentUser: User;
  laboratories: Laboratory[];
  equipment: Equipment[];
  issues: IssueRecord[];
  onNavigate: (module: ActiveNavModule) => void;
  onSelectEquipment?: (eq: Equipment) => void;
}

export const LabAssistantDashboard: React.FC<LabAssistantDashboardProps> = ({
  currentUser,
  laboratories,
  equipment,
  issues,
  onNavigate,
  onSelectEquipment,
}) => {
  const assignedIds = currentUser.assignedLabIds || ['lab-01'];
  const myLabs = laboratories.filter((l) => assignedIds.includes(l.id));
  const primaryLabName = currentUser.assignedLabName || myLabs[0]?.name || 'Power Systems & Microelectronics Lab (ETC-204)';
  const myEquipment = equipment.filter((e) => assignedIds.includes(e.labId));
  const myIssues = issues.filter((i) => assignedIds.includes(i.labId));

  const totalAssignedEquipment = myEquipment.length;
  const activeLoans = myIssues.filter((i) => i.status === 'active' || i.status === 'overdue').length;
  const overdueLoans = myIssues.filter((i) => i.status === 'overdue').length;

  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Assistant Scope Header with Dark Atmosphere */}
      <div className="relative overflow-hidden rounded-2xl border border-red-900/60 bg-gradient-to-r from-[#1c1211] via-[#221514] to-[#170e0d] p-5 sm:p-6 shadow-xl">
        <LightningFilament className="top-0 opacity-50" />

        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <div className="hidden sm:block mt-0.5">
              <UniversityLogo size="md" showText={false} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/60 shadow-[0_0_10px_rgba(217,119,6,0.25)]">
                  <Zap className="h-3 w-3 text-amber-400" />
                  Lab Assistant
                </span>
                <span aria-hidden="true" className="text-red-950">·</span>
                <span className="font-mono text-xs text-[#a39589]">Staff ID: {currentUser.staffId}</span>
                <span aria-hidden="true" className="text-red-950">·</span>
                <span className="text-xs text-[#a39589]">BBSUTSD Khairpur</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1.5 sm:text-2xl">
                Welcome back, Lab Assistant
              </h2>

              {/* Prominent "My Assigned Laboratory" badge section */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#a39589]">My Assigned Laboratory:</span>
                <span className="font-bold text-white bg-[#1c1312] border border-[#3d2724] px-3 py-1 rounded-xl shadow-xs">
                  {primaryLabName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('issue_equipment')}
              className="group flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-red-300 group-hover:translate-x-0.5 transition-transform" />
              <span>Fast Issue Desk</span>
            </button>
            <button
              onClick={() => onNavigate('return_equipment')}
              className="flex items-center gap-1.5 rounded-xl border border-[#3d2724] bg-[#1a1211] px-4 py-2.5 text-xs font-semibold text-[#f5efe8] hover:border-red-900/50 hover:bg-[#251917] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <ArrowDownLeft className="h-3.5 w-3.5 text-red-400" />
              <span>Receive Return</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scoped Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#17100f] p-4 shadow-md hover:border-red-900/50 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-medium">Assigned Labs</span>
            <Building2 className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums font-mono">
            {myLabs.length}
          </div>
          <div className="mt-1 text-[11px] text-[#7d6c60]">
            {myLabs.map((l) => l.roomNumber || l.code).join(' & ') || 'Facility assigned'}
          </div>
        </div>

        <div className="rounded-2xl border border-[#2e1d1b] bg-[#17100f] p-4 shadow-md hover:border-red-900/50 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-medium">Under Supervision</span>
            <Layers className="h-4 w-4 text-[#8a796e]" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums font-mono">
            {totalAssignedEquipment}
          </div>
          <div className="mt-1 text-[11px] text-[#7d6c60]">
            Cataloged units
          </div>
        </div>

        <div className="rounded-2xl border border-[#2e1d1b] bg-[#17100f] p-4 shadow-md hover:border-red-900/50 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-medium">Active Loans in Labs</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-300 tabular-nums font-mono">
            {activeLoans}
          </div>
          <div className="mt-1 text-[11px] text-[#7d6c60]">
            Capstone checkouts
          </div>
        </div>

        <div className="rounded-2xl border border-red-900/70 bg-gradient-to-br from-red-950/40 via-[#220d0f] to-[#16090a] p-4 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:border-red-600 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-red-300">
            <span className="text-xs font-semibold">Overdue in My Labs</span>
            <AlertOctagon className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-red-400 tabular-nums font-mono">
            {overdueLoans}
          </div>
          <div className="mt-1 text-[11px] text-red-400/80">
            Requires follow-up
          </div>
        </div>
      </div>

      {/* Assigned Labs Detail Cards */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Supervised Laboratory Facilities</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {myLabs.map((lab) => (
            <div
              key={lab.id}
              className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 hover:border-red-900/60 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-red-300 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-800/50">
                  {lab.code}
                </span>
                <span className="text-xs text-[#8a796e] font-mono">{lab.contactExtension}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-2.5">{lab.name}</h4>
              <p className="text-xs text-[#9e8d80] mt-0.5">
                {lab.building} · {lab.floor} · Room {lab.roomNumber}
              </p>

              <div className="mt-4 pt-3.5 border-t border-[#231614] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#7d6c60]">Capacity: </span>
                  <span className="font-medium text-stone-300">{lab.capacity} seats</span>
                </div>
                <div>
                  <span className="text-[#7d6c60]">Equipment: </span>
                  <span className="font-medium text-stone-300 font-mono">{lab.totalEquipmentCount}</span>
                </div>
                <div>
                  <span className="text-[#7d6c60]">Active Loans: </span>
                  <span className="font-semibold text-amber-400 font-mono">{lab.activeIssuesCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Circulation Desk in Assigned Labs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Loans list in my labs */}
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] lg:col-span-2 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-[#281816] px-5 py-4 bg-[#1b1211]">
            <div>
              <h3 className="text-sm font-semibold text-white">Current Loans Under My Duty</h3>
              <p className="text-xs text-[#9e8d80]">Checked out from supervised facilities</p>
            </div>
            <button
              onClick={() => onNavigate('issue_equipment')}
              className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1 transition"
            >
              Issue item <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#191110] text-[11px] font-semibold uppercase text-[#8a796e] border-b border-[#241715]">
                <tr>
                  <th className="px-5 py-3">Equipment / Tag</th>
                  <th className="px-4 py-3">Student Borrowing</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231614]">
                {myIssues.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[#7d6c60]">
                      No active equipment loans currently issued from your assigned facilities.
                    </td>
                  </tr>
                ) : (
                  myIssues.map((iss) => (
                    <tr key={iss.id} className="hover:bg-[#201514] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-[#f5efe8]">{iss.equipmentName}</div>
                        <div className="font-mono text-[11px] text-red-400/90">{iss.assetTag}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-[#f5efe8]">{iss.studentName}</div>
                        <div className="font-mono text-[11px] text-[#8a796e]">{iss.studentRollNo}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium tabular-nums font-mono">
                        <span className={iss.status === 'overdue' ? 'text-red-400 font-bold' : 'text-stone-300'}>
                          {iss.dueDate}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {iss.status === 'overdue' ? (
                          <span className="text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                            Overdue
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-emerald-400">Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Physical Storage Shelf Locator Helper */}
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
            <MapPin className="h-4 w-4" />
            <span>Physical Shelf Locator</span>
          </div>
          <p className="text-xs text-[#9e8d80] mt-1">
            Hierarchy quick lookup for fast retrieval & restocking.
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-[#2d1b19] bg-[#1c1312] p-3">
              <span className="text-[10px] font-semibold text-red-400/90 uppercase font-mono">TEC-304 Microelectronics</span>
              <div className="mt-1 text-xs text-[#d1c2b5]">
                <span className="font-medium text-white">Cabinet C-02:</span> Oscilloscopes (Shelf S-01 to S-03)
              </div>
              <div className="mt-1 text-xs text-[#d1c2b5]">
                <span className="font-medium text-white">Cabinet C-03:</span> Precision Multimeters & Probes
              </div>
            </div>

            <div className="rounded-xl border border-[#2d1b19] bg-[#1c1312] p-3">
              <span className="text-[10px] font-semibold text-red-400/90 uppercase font-mono">NPS-212 Optics Lab</span>
              <div className="mt-1 text-xs text-[#d1c2b5]">
                <span className="font-medium text-white">Laser Vault LV-01:</span> DPSS Green Lasers & Goggles
              </div>
              <div className="mt-1 text-xs text-[#d1c2b5]">
                <span className="font-medium text-white">Cabinet OPT-02:</span> Interferometer mirrors
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#231614]">
            <button
              onClick={() => onNavigate('equipment')}
              className="w-full rounded-xl border border-[#382320] bg-[#1c1312] py-2 text-xs font-semibold text-[#f5efe8] hover:border-red-900/50 hover:bg-[#251917] transition text-center"
            >
              Browse Equipment Hierarchy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
