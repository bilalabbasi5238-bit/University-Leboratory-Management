import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { IssueRecord } from '../../types';
import { LightningFilament } from '../common/LightningEffect';

interface OverdueItemsViewProps {
  issues: IssueRecord[];
}

export const OverdueItemsView: React.FC<OverdueItemsViewProps> = ({ issues }) => {
  const overdueIssues = issues.filter((i) => i.status === 'overdue');
  const [remindedIds, setRemindedIds] = useState<string[]>([]);
  const [holdIds, setHoldIds] = useState<string[]>([]);

  const handleSendReminder = (id: string) => {
    setRemindedIds((prev) => [...prev, id]);
  };

  const handleToggleHold = (id: string) => {
    if (holdIds.includes(id)) {
      setHoldIds((prev) => prev.filter((i) => i !== id));
    } else {
      setHoldIds((prev) => [...prev, id]);
    }
  };

  const totalBursarAccrual = overdueIssues.length * 20;

  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Banner with prominent red glow */}
      <div className="relative overflow-hidden rounded-2xl border border-red-900/70 bg-gradient-to-r from-red-950/50 via-[#220d0f] to-[#16090a] p-5 sm:p-6 shadow-[0_0_25px_rgba(220,38,38,0.2)]">
        <LightningFilament className="top-0 opacity-70" />

        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
              <AlertOctagon className="h-4 w-4" />
              <span>BBSUTSD Delinquency &amp; Hold Registry</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1 sm:text-2xl">
              Overdue Laboratory Assets ({overdueIssues.length} Delinquency Violations)
            </h2>
            <p className="text-xs text-[#a39589] mt-0.5">
              Automated bursar hold enforcement and compliance tracking for unreturned university property.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-xl bg-[#1d1211] px-3.5 py-2 font-mono font-semibold border border-red-900/60 text-red-400 shadow-sm tabular-nums">
              Bursar Accrual: ${totalBursarAccrual.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Overdue Table */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#191110] text-[11px] font-semibold uppercase text-[#8a796e] border-b border-[#241715]">
              <tr>
                <th className="px-5 py-3">Asset Tag & Equipment</th>
                <th className="px-4 py-3">Student Borrower</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Days Overdue</th>
                <th className="px-4 py-3">Bursar / Academic Hold</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#231614]">
              {overdueIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[#7d6c60]">
                    No overdue equipment items across university laboratories!
                  </td>
                </tr>
              ) : (
                overdueIssues.map((item) => {
                  const isReminded = remindedIds.includes(item.id);
                  const hasHold = holdIds.includes(item.id);

                  return (
                    <tr key={item.id} className="hover:bg-[#201514] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-red-300 bg-red-950/70 px-2 py-0.5 rounded border border-red-800/60">
                            {item.assetTag}
                          </span>
                          <span className="font-bold text-white">{item.equipmentName}</span>
                        </div>
                        <div className="text-[11px] text-[#8a796e] mt-1">
                          Facility: {item.labName}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">{item.studentName}</div>
                        <div className="font-mono text-[11px] text-red-400">
                          {item.studentRollNo} · {item.studentEmail}
                        </div>
                      </td>

                      <td className="px-4 py-4 tabular-nums text-stone-300 font-mono">
                        {item.dueDate}
                      </td>

                      <td className="px-4 py-4 font-bold text-red-400 tabular-nums font-mono">
                        4 days
                      </td>

                      <td className="px-4 py-4">
                        {hasHold ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                            <ShieldAlert className="h-3 w-3 text-red-400" />
                            Academic Hold Enforced
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#7d6c60]">No hold placed</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleSendReminder(item.id)}
                          disabled={isReminded}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                            isReminded
                              ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-400 cursor-default'
                              : 'border-[#382320] bg-[#1c1312] text-[#f5efe8] hover:border-red-900/60 hover:bg-[#251917]'
                          }`}
                        >
                          {isReminded ? 'Reminder Sent' : 'Send Reminder'}
                        </button>

                        <button
                          onClick={() => handleToggleHold(item.id)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                            hasHold
                              ? 'bg-red-950 text-red-200 border border-red-800 hover:bg-red-900'
                              : 'bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white border border-red-700/60 shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                          }`}
                        >
                          {hasHold ? 'Release Hold' : 'Place Hold'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* University Overdue Policy Note */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 shadow-xl">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400">
          Institutional Overdue Protocol (§4.12)
        </h3>
        <p className="mt-2 text-xs text-[#a39589] leading-relaxed">
          Under Academic Regulation §4.12, unreturned laboratory equipment exceeding 72 hours triggers automated notifications to the student, academic advisor, and department chair. If unresolved after 14 days, a bursar hold prevents course registration and transcript issuance.
        </p>
      </div>
    </div>
  );
};
