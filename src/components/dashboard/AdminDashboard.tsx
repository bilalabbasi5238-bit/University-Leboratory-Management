import React from 'react';
import {
  Building2,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  Laboratory,
  Equipment,
  IssueRecord,
  ActivityLog,
  ActiveNavModule,
  NotificationItem,
} from '../../types';
import { LightningFilament } from '../common/LightningEffect';
import { UniversityLogo } from '../common/UniversityLogo';

interface AdminDashboardProps {
  laboratories: Laboratory[];
  equipment: Equipment[];
  issues: IssueRecord[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  onNavigate: (module: ActiveNavModule) => void;
  onSelectEquipment?: (eq: Equipment) => void;
  onSelectLaboratory?: (lab: Laboratory) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  laboratories,
  equipment,
  issues,
  activityLogs,
  notifications,
  onNavigate,
  onSelectEquipment,
  onSelectLaboratory,
}) => {
  const totalLaboratories = laboratories.length;
  const totalEquipmentCount = equipment.length > 0 ? equipment.length : laboratories.reduce((acc, l) => acc + (l.totalEquipmentCount || 0), 0);
  const totalIssuedCount = issues.filter((i) => i.status === 'active' || i.status === 'overdue').length;
  const totalOverdueCount = issues.filter((i) => i.status === 'overdue').length;
  const totalDamagedCount = equipment.filter((e) => e.status === 'damaged').length;
  const availableCount = Math.max(0, totalEquipmentCount - totalIssuedCount - totalDamagedCount);

  // Dynamic distribution percentages
  const availablePct = totalEquipmentCount > 0 ? ((availableCount / totalEquipmentCount) * 100).toFixed(1) : '0.0';
  const issuedPct = totalEquipmentCount > 0 ? ((totalIssuedCount / totalEquipmentCount) * 100).toFixed(1) : '0.0';
  const damagedPct = totalEquipmentCount > 0 ? ((totalDamagedCount / totalEquipmentCount) * 100).toFixed(1) : '0.0';
  const overduePct = totalEquipmentCount > 0 ? ((totalOverdueCount / totalEquipmentCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Institutional Banner / Scope header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#382320] bg-gradient-to-r from-[#1c1211] via-[#221514] to-[#170e0d] p-5 sm:p-6 shadow-xl">
        <LightningFilament className="top-0 opacity-40" />

        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <div className="hidden sm:block mt-0.5">
              <UniversityLogo size="md" showText={false} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-red-300 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-800/60 shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                  <Zap className="h-3 w-3 text-red-400" />
                  HOD / Admin
                </span>
                <span aria-hidden="true" className="text-red-950">·</span>
                <span className="text-xs font-semibold text-amber-300/90 tracking-wide uppercase">
                  Central Laboratory Directorate
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white mt-1.5">
                The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur
              </h2>
              <p className="text-xs text-[#a39589] mt-0.5">
                Centralized university laboratory governance, equipment asset tracking, and physical inventory oversight.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('issue_equipment')}
              className="group flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-red-300 group-hover:translate-x-0.5 transition-transform" />
              <span>Fast Issue</span>
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

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div
          onClick={() => onNavigate('laboratories')}
          className="group cursor-pointer rounded-2xl border border-[#2e1d1b] bg-[#17100f] p-4 transition-all duration-200 hover:border-red-900/50 hover:bg-[#1f1514] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-medium">Laboratories</span>
            <Building2 className="h-4 w-4 text-[#8a796e] group-hover:text-red-400 transition-colors" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums font-mono">
            {totalLaboratories}
          </div>
          <div className="mt-1 text-[11px] text-[#7d6c60]">
            <span>6 facilities</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('equipment')}
          className="group cursor-pointer rounded-2xl border border-[#2e1d1b] bg-[#17100f] p-4 transition-all duration-200 hover:border-red-900/50 hover:bg-[#1f1514] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-medium">Total Equipment</span>
            <Layers className="h-4 w-4 text-[#8a796e] group-hover:text-red-400 transition-colors" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums font-mono">
            {totalEquipmentCount}
          </div>
          <div className="mt-1 text-[11px] text-[#7d6c60]">
            <span>Cataloged units</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('equipment')}
          className="group cursor-pointer rounded-2xl border border-[#2e1d1b] bg-[#17100f] p-4 transition-all duration-200 hover:border-red-900/50 hover:bg-[#1f1514] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-medium">Available</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-400 tabular-nums font-mono">
            {availableCount}
          </div>
          <div className="mt-1 text-[11px] text-[#7d6c60]">
            <span>Ready for checkout</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('issue_equipment')}
          className="group cursor-pointer rounded-2xl border border-[#2e1d1b] bg-[#17100f] p-4 transition-all duration-200 hover:border-red-900/50 hover:bg-[#1f1514] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-medium">Issued on Loan</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-300 tabular-nums font-mono">
            {totalIssuedCount}
          </div>
          <div className="mt-1 text-[11px] text-[#7d6c60]">
            <span>Active loans</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('maintenance')}
          className="group cursor-pointer rounded-2xl border border-[#2e1d1b] bg-[#17100f] p-4 transition-all duration-200 hover:border-red-900/50 hover:bg-[#1f1514] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-medium">Maintenance</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-rose-300 tabular-nums font-mono">
            {totalDamagedCount}
          </div>
          <div className="mt-1 text-[11px] text-[#7d6c60]">
            <span>Active tickets</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('overdue_items')}
          className="group cursor-pointer rounded-2xl border border-red-900/70 bg-gradient-to-br from-red-950/40 via-[#220d0f] to-[#16090a] p-4 shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all duration-200 hover:border-red-600 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-red-300">
            <span className="text-xs font-semibold">Overdue Loans</span>
            <AlertOctagon className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-red-400 tabular-nums font-mono">
            {totalOverdueCount}
          </div>
          <div className="mt-1 text-[11px] text-red-400/80 font-medium">
            <span>Action required</span>
          </div>
        </div>
      </div>

      {/* Grid: Laboratory Overview + Equipment Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Laboratory Facilities Summary (2 cols) */}
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] lg:col-span-2 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-[#281816] px-5 py-4 bg-[#1b1211]">
            <div>
              <h3 className="text-sm font-semibold text-white">Laboratory Facilities Operations</h3>
              <p className="text-xs text-[#9e8d80]">Hierarchy mapping, supervising assistants, and live loads</p>
            </div>
            <button
              onClick={() => onNavigate('laboratories')}
              className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1 transition"
            >
              View all labs <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#191110] text-[11px] font-semibold uppercase text-[#8a796e] border-b border-[#241715]">
                <tr>
                  <th className="px-5 py-3">Facility Name & Code</th>
                  <th className="px-4 py-3">Building & Room</th>
                  <th className="px-4 py-3">Supervising Assistant</th>
                  <th className="px-4 py-3 text-right">Equipment Units</th>
                  <th className="px-5 py-3 text-right">Active Loans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231614]">
                {laboratories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[#7d6c60]">
                      No laboratories registered yet. Click on Laboratories to register the first facility.
                    </td>
                  </tr>
                ) : (
                  laboratories.map((lab) => {
                    const labEq = equipment.filter((e) => e.labId === lab.id).length;
                    const labOut = issues.filter(
                      (i) => i.labId === lab.id && (i.status === 'active' || i.status === 'overdue')
                    ).length;

                    return (
                      <tr
                        key={lab.id}
                        onClick={() => onSelectLaboratory?.(lab)}
                        className="hover:bg-[#201514] transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-[#f5efe8]">{lab.name}</div>
                          <div className="font-mono text-[11px] text-red-400/80">{lab.code}</div>
                        </td>
                        <td className="px-4 py-3.5 text-[#a39589]">
                          <div>{lab.building}</div>
                          <div className="text-[11px] text-[#7d6c60]">
                            {lab.floor} · {lab.roomNumber}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[#b8a89b]">
                          <span className="font-medium">{lab.assignedAssistantName}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-medium text-white tabular-nums font-mono">
                          {labEq}
                        </td>
                        <td className="px-5 py-3.5 text-right tabular-nums font-mono">
                          <span className="font-bold text-amber-400">{labOut}</span>
                          <span className="text-[#7d6c60] text-[11px]"> out</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Equipment Status Distribution & Circulation Quick Tools */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-white">Equipment Allocation Distribution</h3>
            <p className="text-xs text-[#9e8d80] mt-0.5">Faculty-wide asset distribution</p>

            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium text-[#b8a89b] mb-1">
                  <span>Available on Shelf</span>
                  <span className="tabular-nums font-mono text-emerald-400">{availablePct}% ({availableCount})</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${availablePct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-[#b8a89b] mb-1">
                  <span>Currently Issued</span>
                  <span className="tabular-nums font-mono text-amber-400">{issuedPct}% ({totalIssuedCount})</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${issuedPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-[#b8a89b] mb-1">
                  <span>Under Repair / Calib</span>
                  <span className="tabular-nums font-mono text-rose-400">{damagedPct}% ({totalDamagedCount})</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${damagedPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-[#b8a89b] mb-1">
                  <span>Overdue Items Flagged</span>
                  <span className="tabular-nums font-mono text-red-500">{overduePct}% ({totalOverdueCount})</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#241715] overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full shadow-[0_0_8px_#ef4444]" style={{ width: `${overduePct}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#241715]">
              <div className="flex items-center justify-between text-xs text-[#a39589]">
                <span>Physical Hierarchy Tracking:</span>
                <span className="font-semibold text-red-400">Enforced 100%</span>
              </div>
              <p className="text-[11px] text-[#7d6c60] mt-1">
                Every unit maps to Building → Floor → Lab → Cabinet → Shelf
              </p>
            </div>
          </div>

          {/* Quick Circulation Tools */}
          <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 shadow-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8a796e]">
              Circulation Desk Actions
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('issue_equipment')}
                className="flex flex-col items-start rounded-xl border border-[#33201d] bg-[#1c1312] p-3 hover:border-red-900/60 hover:bg-[#251917] hover:shadow-[0_0_12px_rgba(220,38,38,0.2)] transition text-left"
              >
                <ArrowUpRight className="h-4 w-4 text-red-400 mb-1" />
                <span className="text-xs font-semibold text-white">New Issue</span>
                <span className="text-[10px] text-[#8a796e]">Student checkout</span>
              </button>
              <button
                onClick={() => onNavigate('return_equipment')}
                className="flex flex-col items-start rounded-xl border border-[#33201d] bg-[#1c1312] p-3 hover:border-red-900/60 hover:bg-[#251917] hover:shadow-[0_0_12px_rgba(220,38,38,0.2)] transition text-left"
              >
                <ArrowDownLeft className="h-4 w-4 text-emerald-400 mb-1" />
                <span className="text-xs font-semibold text-white">Check In</span>
                <span className="text-[10px] text-[#8a796e]">Inspect & restock</span>
              </button>
              <button
                onClick={() => onNavigate('overdue_items')}
                className="flex flex-col items-start rounded-xl border border-[#33201d] bg-[#1c1312] p-3 hover:border-red-900/60 hover:bg-[#251917] hover:shadow-[0_0_12px_rgba(220,38,38,0.2)] transition text-left"
              >
                <AlertOctagon className="h-4 w-4 text-red-500 mb-1" />
                <span className="text-xs font-semibold text-white">Overdue Desk</span>
                <span className="text-[10px] text-[#8a796e]">1 item delinquent</span>
              </button>
              <button
                onClick={() => onNavigate('maintenance')}
                className="flex flex-col items-start rounded-xl border border-[#33201d] bg-[#1c1312] p-3 hover:border-red-900/60 hover:bg-[#251917] hover:shadow-[0_0_12px_rgba(220,38,38,0.2)] transition text-left"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400 mb-1" />
                <span className="text-xs font-semibold text-white">Maintenance</span>
                <span className="text-[10px] text-[#8a796e]">2 open tickets</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Equipment Issues + Real-time Activity Logs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Equipment Issues Table (2 cols) */}
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] lg:col-span-2 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-[#281816] px-5 py-4 bg-[#1b1211]">
            <div>
              <h3 className="text-sm font-semibold text-white">Active Loan Registry</h3>
              <p className="text-xs text-[#9e8d80]">Student loan records and scheduled return deadlines</p>
            </div>
            <button
              onClick={() => onNavigate('issue_equipment')}
              className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1 transition"
            >
              All checkouts <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#191110] text-[11px] font-semibold uppercase text-[#8a796e] border-b border-[#241715]">
                <tr>
                  <th className="px-5 py-3">Equipment / Tag</th>
                  <th className="px-4 py-3">Borrower (Student)</th>
                  <th className="px-4 py-3">Issued Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231614]">
                {issues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-[#201514] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#f5efe8]">{iss.equipmentName}</div>
                      <div className="font-mono text-[11px] text-red-400/90">{iss.assetTag}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-[#f5efe8]">{iss.studentName}</div>
                      <div className="font-mono text-[11px] text-[#8a796e]">{iss.studentRollNo}</div>
                    </td>
                    <td className="px-4 py-3.5 text-[#a39589] tabular-nums font-mono">{iss.issueDate}</td>
                    <td className="px-4 py-3.5 font-medium tabular-nums font-mono">
                      <span className={iss.status === 'overdue' ? 'text-red-400 font-bold' : 'text-stone-300'}>
                        {iss.dueDate}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {iss.status === 'overdue' ? (
                        <span className="inline-flex items-center text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                          Overdue
                        </span>
                      ) : iss.status === 'returned' ? (
                        <span className="inline-flex items-center text-xs font-medium text-[#8a796e]">
                          Returned
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                          Active Loan
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Activity Stream (1 col) */}
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#281816] px-5 py-4 bg-[#1b1211]">
            <div>
              <h3 className="text-sm font-semibold text-white">Live Activity Feed</h3>
              <p className="text-xs text-[#9e8d80]">Campus operations stream</p>
            </div>
            <button
              onClick={() => onNavigate('activity_logs')}
              className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1 transition"
            >
              Full log <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444] shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{log.action}</span>
                    <span className="text-[10px] text-[#7d6c60] font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-xs font-medium text-red-400 mt-0.5">{log.target}</p>
                  <p className="text-[11px] text-[#a39589] mt-0.5 leading-relaxed">{log.details}</p>
                  <div className="text-[10px] text-[#7d6c60] mt-0.5">By {log.userName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
