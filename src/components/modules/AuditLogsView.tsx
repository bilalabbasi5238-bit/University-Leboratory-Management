import React from 'react';
import { AuditLog } from '../../types';

interface AuditLogsViewProps {
  auditLogs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs }) => {
  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Bar */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Security & Institutional Audit Trail
        </h2>
        <p className="text-xs text-[#a39589] mt-0.5">
          Immutable compliance ledger recording all state mutations, terminal IP addresses, and authorization changes.
        </p>
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#191110] text-[11px] font-semibold uppercase text-[#8a796e] border-b border-[#241715]">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor / Staff ID</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Entity & ID</th>
                <th className="px-4 py-3">Changes Summary</th>
                <th className="px-5 py-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#231614] font-mono text-[11px]">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-[#7d6c60] font-sans">
                    No institutional audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#201514] transition-colors">
                  <td className="px-5 py-3.5 text-[#8a796e] tabular-nums">{log.timestamp}</td>
                  <td className="px-4 py-3.5 font-sans font-medium text-white">{log.performedBy}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-red-400 font-bold">
                    {log.entity}: {log.entityId}
                  </td>
                  <td className="px-4 py-3.5 font-sans text-xs text-[#a39589] max-w-xs truncate">
                    {log.changesSummary}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[#7d6c60]">{log.ipAddress}</td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
