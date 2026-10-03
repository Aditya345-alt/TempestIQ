"use client";

type FlagPillProps = {
  flagSrc: string;
  flagAlt: string;
  className?: string;
};

const PILL_SHADOW =
  "shadow-[0px_61px_17px_0px_rgba(0,0,0,0),0px_39px_16px_0px_rgba(0,0,0,0.01),0px_22px_13px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.09),0px_2px_5px_0px_rgba(0,0,0,0.1)]";

export const FlagPill = ({
  flagSrc,
  flagAlt,
  className = "",
}: FlagPillProps) => (
  <div
    className={`flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border-[0.75px] border-white/5 bg-[#1b2246] px-3 py-[3px] ipad:gap-2 ipad:border ipad:px-4 ipad:py-1 ${PILL_SHADOW} ${className}`}
  >
    <div className="relative size-6 shrink-0 overflow-hidden ipad:size-8">
      <img
        src={flagSrc}
        alt={flagAlt}
        width={32}
        height={32}
        className="size-full object-cover"
      />
    </div>
    <div
      aria-hidden="true"
      className="h-[9px] w-[60px] rounded-full bg-[#232d5c] ipad:h-3 ipad:w-20"
    />
  </div>
);