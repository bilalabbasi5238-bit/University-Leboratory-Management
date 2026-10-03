import React, { useState } from 'react';

interface UniversityLogoProps {
  className?: string;
  imgClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textVariant?: 'short' | 'full';
  alt?: string;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  className = '',
  imgClassName = '',
  size = 'md',
  showText = false,
  textVariant = 'short',
  alt = 'The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur',
}) => {
  const [imgSrc, setImgSrc] = useState('/mainlogo.png');

  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
    '2xl': 'h-24 w-24 sm:h-28 sm:w-28',
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative shrink-0 ${sizeClasses} rounded-2xl overflow-hidden p-1 border border-amber-600/40 bg-gradient-to-br from-[#2a0e0c] via-[#1a0808] to-[#0d0404] shadow-[0_0_20px_rgba(220,38,38,0.35)] transition-transform duration-200 hover:scale-105 flex items-center justify-center`}
      >
        <img
          src={imgSrc}
          onError={() => {
            if (imgSrc === '/mainlogo.png') setImgSrc('/mainlogo');
            else if (imgSrc === '/mainlogo') setImgSrc('/mainlogo.svg');
          }}
          alt={alt}
          className={`h-full w-full object-contain ${imgClassName}`}
        />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          {textVariant === 'short' ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-base leading-none">
                  BBSUTSD
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 px-1 py-0.5 rounded bg-red-950/80 border border-red-800/40">
                  CENTRAL LABS
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#9c8c7f] leading-tight mt-0.5">
                Khairpur Campus
              </span>
            </>
          ) : (
            <>
              <span className="font-bold tracking-tight text-white text-base sm:text-lg leading-tight">
                The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur
              </span>
              <span className="text-xs font-semibold text-red-400 tracking-wider uppercase mt-0.5">
                Central Laboratory Directorate &amp; Asset Governance
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
