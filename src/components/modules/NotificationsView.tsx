import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Notifications & System Alerts
          </h2>
          <p className="text-xs text-[#a39589] mt-0.5">
            Institutional alerts for overdue loans, safety calibrations, and equipment tracking.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 rounded-xl border border-[#382320] bg-[#1c1312] px-3.5 py-2 text-xs font-semibold text-[#f5efe8] hover:border-red-900/60 hover:bg-[#251917] transition"
        >
          <Check className="h-4 w-4 text-red-400" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] divide-y divide-[#231614] shadow-xl overflow-hidden">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            className={`p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
              !n.read ? 'bg-red-950/20 border-l-2 border-red-500' : 'hover:bg-[#1f1514]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 shrink-0">
                {n.type === 'alert' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                {n.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-400" />}
                {n.type === 'info' && <Info className="h-5 w-5 text-sky-400" />}
                {n.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                  )}
                </div>
                <p className="mt-1 text-xs text-[#a39589] leading-relaxed">{n.message}</p>
                <span className="mt-2 block text-[11px] text-[#7d6c60] font-mono">{n.timestamp}</span>
              </div>
            </div>

            {!n.read && (
              <span className="text-xs font-semibold text-red-400 shrink-0 font-mono">NEW</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
