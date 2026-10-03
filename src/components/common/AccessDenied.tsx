import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { ActiveNavModule } from '../../types';

interface AccessDeniedProps {
  onBackToDashboard: () => void;
  requiredRole?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  onBackToDashboard,
  requiredRole = 'HOD / Admin',
}) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center text-[#f5efe8]">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-950 via-[#360e12] to-[#1a080a] border border-red-700/60 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
        <ShieldAlert className="h-10 w-10 text-red-400" />
      </div>

      <span className="font-mono text-xs uppercase tracking-wider text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-800/60 mb-2">
        Error 403 · Access Restricted
      </span>

      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Access Denied
      </h2>

      <p className="mt-2 max-w-md text-xs sm:text-sm text-[#a39589] leading-relaxed">
        This laboratory management section requires elevated <span className="font-semibold text-white">{requiredRole}</span> administrative privileges. Your current role does not have authorization to view this resource.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to My Dashboard</span>
        </button>
      </div>
    </div>
  );
};
