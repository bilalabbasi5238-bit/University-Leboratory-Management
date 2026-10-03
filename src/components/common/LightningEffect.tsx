import React from 'react';

/**
 * Subtle SVG red lightning / electric energy filaments and ambient glows.
 * Elegant, low-opacity, controlled aesthetic without distracting flashes.
 */

export const LightningFilament: React.FC<{
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}> = ({ className = '', orientation = 'horizontal' }) => {
  if (orientation === 'vertical') {
    return (
      <svg
        className={`pointer-events-none absolute inset-y-0 w-3 overflow-visible ${className}`}
        viewBox="0 0 12 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M6,0 Q8,20 5,35 T7,55 Q4,75 6,90 T6,100"
          stroke="url(#redLightningVertical)"
          strokeWidth="1.5"
          className="animate-energy-drift"
        />
        <defs>
          <linearGradient id="redLightningVertical" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ff4d4d" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#991b1b" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      className={`pointer-events-none absolute inset-x-0 h-2 overflow-visible ${className}`}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0,4 Q25,2 40,5 T70,3 Q85,6 100,4"
        stroke="url(#redLightningHorizontal)"
        strokeWidth="1.2"
        className="animate-energy-drift"
      />
      <defs>
        <linearGradient id="redLightningHorizontal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0" />
          <stop offset="25%" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#f87171" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const BackgroundEnergyField: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-0 opacity-40 select-none ${className}`}>
      {/* Soft warm burgundy radial gradient */}
      <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-red-950/20 via-red-900/10 to-transparent blur-3xl animate-electric-pulse" />
      <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-amber-950/15 via-red-950/10 to-transparent blur-3xl" />
      
      {/* Subtle geometric laboratory coordinate grid */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="labGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f87171" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#labGrid)" />
      </svg>
    </div>
  );
};

export const ElectricSparkIcon: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)] ${className}`}
  >
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
  </svg>
);
