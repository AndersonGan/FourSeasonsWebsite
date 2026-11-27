/**
 * Proposed four-petal emblem — one petal per season around a red seal.
 * PROPOSED ONLY: replace with the restaurant's supplied logo when available
 * (see docs/OWNER_CHECKLIST.md).
 */
export function Emblem({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <g transform="translate(32 32)">
        {/* spring / summer / autumn / winter petals */}
        <path d="M0-4C-9-12-8-27 0-30 8-27 9-12 0-4Z" fill="#EDA9B1" />
        <path d="M4 0C12-9 27-8 30 0 27 8 12 9 4 0Z" fill="#246B54" />
        <path d="M0 4C9 12 8 27 0 30-8 27-9 12 0 4Z" fill="#E8B64B" />
        <path d="M-4 0C-12 9-27 8-30 0-27-8-12-9-4 0Z" fill="#263A4F" />
        <circle r="11" fill="#B82025" />
        <circle r="8.2" fill="none" stroke="#FFF2DB" strokeWidth="1.2" />
        <text
          y="3.6"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fontSize="10"
          fill="#FFF2DB"
          letterSpacing="-0.3"
        >
          4S
        </text>
      </g>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 ${className ?? ""}`}>
      <Emblem className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <span className="flex min-w-0 flex-col whitespace-nowrap leading-none">
        <span className="font-display text-[1.15rem] font-semibold sm:text-[1.32rem] tracking-[-0.01em] text-red">Four Seasons</span>
        <span className="mt-1 text-[0.56rem] max-[359px]:hidden font-extrabold uppercase tracking-[0.14em] sm:text-[0.62rem] sm:tracking-[0.22em] text-bamboo">Restaurant · Grants Pass</span>
      </span>
    </span>
  );
}
