import React from 'react';

/** Shared look for the public pages (front page and product catalog). */

export const PRIMARY_BTN =
  'bg-gradient-to-r from-[#2563EB] via-[#5379EE] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] text-white shadow-[0_10px_24px_rgba(37,99,235,0.3)]';

export const PILL_BTN =
  'inline-flex items-center justify-center rounded-full font-bold uppercase tracking-wide text-xs whitespace-nowrap transition-all active:scale-[0.98] cursor-pointer';

/** Badge colours for Nutri-Score grades: A–B green, C amber, D–E red. */
export const gradeClass = (grade: string) => {
  if (grade === 'A' || grade === 'B') return 'bg-emerald-500 text-white';
  if (grade === 'C') return 'bg-amber-500 text-white';
  return 'bg-rose-500 text-white';
};

/** Section heading with an underlined accent phrase. */
export const Heading: React.FC<{
  lead: string;
  accent: string;
  light?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
}> = ({ lead, accent, light, as: Tag = 'h2', className = 'text-3xl sm:text-4xl' }) => (
  <Tag className={`font-extrabold tracking-tight leading-[1.15] ${light ? 'text-white' : 'text-[#1E293B]'} ${className}`}>
    {lead}{' '}
    <span
      className={`underline decoration-[3px] underline-offset-[6px] ${
        light ? 'text-[#BFDBFE] decoration-[#BFDBFE]' : 'text-[#2563EB] decoration-[#2563EB]'
      }`}
    >
      {accent}
    </span>
  </Tag>
);
