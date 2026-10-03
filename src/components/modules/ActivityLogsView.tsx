import React from 'react';
import { Activity } from 'lucide-react';
import { ActivityLog } from '../../types';

interface ActivityLogsViewProps {
  logs: ActivityLog[];
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Bar */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Real-time Activity Stream
        </h2>
        <p className="text-xs text-[#a39589] mt-0.5">
          Live event feed capturing equipment issues, returns, calibrations, and system actions.
        </p>
      </div>

      {/* Activity Timeline List */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] divide-y divide-[#231614] shadow-xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#7d6c60]">
            No activity events recorded yet. Recent equipment issues, returns, and changes will be logged here.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-[#1f1514] transition-colors">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-[#201413] border border-red-950 text-red-400 shrink-0">
              <Activity className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{log.action}</span>
                  <span className="text-red-950">·</span>
                  <span className="font-mono text-xs font-bold text-red-400">{log.target}</span>
                </div>
                <span className="text-[11px] text-[#7d6c60] tabular-nums font-mono">{log.timestamp}</span>
              </div>

              <p className="mt-1 text-xs text-[#a39589] leading-relaxed">{log.details}</p>

              <div className="mt-2 flex items-center gap-2 text-[11px] text-[#7d6c60]">
                <span>By {log.userName}</span>
                <span aria-hidden="true" className="text-red-950">·</span>
                <span className="capitalize text-stone-400">{log.userRole.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};
