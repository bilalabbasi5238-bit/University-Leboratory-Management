import React, { useState } from 'react';
import {
  ArrowDownLeft,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { IssueRecord, EquipmentCondition } from '../../types';
import { LightningFilament } from '../common/LightningEffect';

interface ReturnEquipmentViewProps {
  issues: IssueRecord[];
  onReturnProcessed?: (issueId: string, condition: EquipmentCondition, remarks: string) => void;
}

export const ReturnEquipmentView: React.FC<ReturnEquipmentViewProps> = ({
  issues,
  onReturnProcessed,
}) => {
  const activeIssues = issues.filter((i) => i.status === 'active' || i.status === 'overdue');
  const [selectedIssueId, setSelectedIssueId] = useState(activeIssues[0]?.id || '');
  const [condition, setCondition] = useState<EquipmentCondition>('good');
  const [returnShelf, setReturnShelf] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedIssue = activeIssues.find((i) => i.id === selectedIssueId);
  const isOverdue = selectedIssue?.status === 'overdue';

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setIsSuccess(true);
    onReturnProcessed?.(selectedIssue.id, condition, remarks);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#f5efe8]">
      {/* Header card with dark atmosphere */}
      <div className="relative overflow-hidden rounded-2xl border border-[#382320] bg-gradient-to-r from-[#1c1211] via-[#221514] to-[#170e0d] p-5 shadow-xl">
        <LightningFilament className="top-0 opacity-40" />
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
          <ArrowDownLeft className="h-4 w-4" />
          <span>BBSUTSD Circulation Desk</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mt-1">
          Return Equipment (Check-In Inspection)
        </h2>
        <p className="text-xs text-[#a39589] mt-0.5">
          Verify physical condition, assess overdue delinquency penalties, and restock to designated laboratory shelf.
        </p>
      </div>

      {isSuccess ? (
        <div className="rounded-2xl border border-red-800/60 bg-[#1f1413] p-8 text-center space-y-3 shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-950/80 border border-red-700 text-red-300 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <CheckCircle2 className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Equipment Returned & Checked In</h3>
          <p className="text-xs text-[#a39589] max-w-md mx-auto">
            Asset <span className="font-mono font-bold text-red-400">{selectedIssue?.assetTag}</span> has been returned by{' '}
            <span className="font-semibold text-white">{selectedIssue?.studentName}</span>. Restocked with condition{' '}
            <span className="font-semibold capitalize text-emerald-400">{condition}</span>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setIsSuccess(false);
                setSelectedIssueId('');
              }}
              className="rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] transition"
            >
              Process Another Return
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleReturnSubmit} className="space-y-6">
          {/* Active Loans Selector */}
          <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400 border-b border-[#281816] pb-2">
              1. Select Active Loan to Check In ({activeIssues.length} items out)
            </h3>

            {activeIssues.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#7d6c60]">
                No active loans currently checked out.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeIssues.map((iss) => (
                  <div
                    key={iss.id}
                    onClick={() => setSelectedIssueId(iss.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      selectedIssueId === iss.id
                        ? 'border-red-600 bg-[#201413] shadow-[0_0_18px_rgba(220,38,38,0.25)]'
                        : 'border-[#30201d] bg-[#1a1211] hover:border-red-900/50 hover:bg-[#201514]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
                        {iss.assetTag}
                      </span>
                      {iss.status === 'overdue' ? (
                        <span className="text-[11px] font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                          OVERDUE
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-medium">Active</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white mt-2">{iss.equipmentName}</p>
                    <div className="mt-2 text-xs text-[#a39589] space-y-0.5">
                      <div>Borrower: {iss.studentName} ({iss.studentRollNo})</div>
                      <div>Due: <span className="tabular-nums font-mono text-white">{iss.dueDate} {iss.dueTime ? `at ${iss.dueTime}` : ''}</span></div>
                      {iss.purpose && (
                        <div className="text-[11px] text-red-300/80 truncate">Purpose: {iss.purpose}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedIssue && (
            <>
              {/* Overdue Warning Alert */}
              {isOverdue && (
                <div className="rounded-2xl border border-red-800/60 bg-gradient-to-r from-red-950/60 via-[#271012] to-[#1c0c0e] p-4 flex items-start gap-3 shadow-xl">
                  <ShieldAlert className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-red-300">Delinquency Violation Detected</h4>
                    <p className="text-xs text-red-200/90 mt-0.5 leading-relaxed">
                      Due date was <span className="font-bold font-mono text-white">{selectedIssue.dueDate}</span>. Institutional late fee ($5.00/day = $20.00) will be charged to student bursar account unless authorized for waiver by HOD.
                    </p>
                  </div>
                </div>
              )}

              {/* Physical Condition Inspection */}
              <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 space-y-4 shadow-xl">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400 border-b border-[#281816] pb-2">
                  2. Physical Inspection & Restocking
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[#b8a89b] mb-1.5">
                      Condition Upon Return
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['excellent', 'good', 'fair', 'damaged'] as EquipmentCondition[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCondition(c)}
                          className={`rounded-xl border py-2 text-xs capitalize font-semibold transition ${
                            condition === c
                              ? c === 'damaged'
                                ? 'border-red-600 bg-red-950 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                                : 'border-red-600 bg-red-950/70 text-white shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                              : 'border-[#382320] bg-[#1c1312] text-[#a39589] hover:bg-[#251917]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#b8a89b] mb-1.5">
                      Return Storage Destination
                    </label>
                    <input
                      type="text"
                      value={returnShelf}
                      onChange={(e) => setReturnShelf(e.target.value)}
                      placeholder="e.g. Cabinet C-02 · Shelf S-01 (default shelf)"
                      className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-[#f5efe8] focus:border-red-600 focus:outline-none transition"
                    />
                    <p className="mt-1 text-[11px] text-[#7d6c60]">
                      Facility: {selectedIssue.labName}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#b8a89b] mb-1.5">
                    Inspection Remarks & Notes
                  </label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Probes, power adapter, and BNC cables verified in carrying case."
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-[#f5efe8] focus:border-red-600 focus:outline-none transition"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-6 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-red-300" />
                    <span>Complete Check-In & Restock</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};
