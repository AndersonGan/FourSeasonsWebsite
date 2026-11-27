/** Woodblock-inspired botanical art. Decorative only. */
type P = { className?: string };

export function Bamboo({ className, color = "#246B54", animate = true }: P & { color?: string; animate?: boolean }) {
  const leaf = (x: number, y: number, r: number, k: string) => (
    <path key={k} d="M0 0c10-6 28-7 40-2-12 7-28 8-40 2Z" fill={color} transform={`translate(${x} ${y}) rotate(${r})`} />
  );
  return (
    <svg viewBox="0 0 160 260" className={className} aria-hidden>
      <g className={animate ? "sway-slow" : undefined}>
        {[
          [46, 8],
          [84, 0],
          [118, 22],
        ].map(([x, top], i) => (
          <g key={i}>
            <path d={`M${x} 260V${top}`} stroke={color} strokeWidth="9" strokeLinecap="round" />
            {[60, 118, 176, 232].map((y) => (
              <path key={y} d={`M${(x ?? 0) - 7} ${y}h14`} stroke="#FFF2DB" strokeWidth="2.4" opacity=".75" />
            ))}
          </g>
        ))}
        {leaf(50, 40, -30, "a")}
        {leaf(50, 52, -10, "b")}
        {leaf(84, 30, 200, "c")}
        {leaf(86, 90, -24, "d")}
        {leaf(84, 104, 210, "e")}
        {leaf(120, 62, -40, "f")}
        {leaf(118, 74, -12, "g")}
        {leaf(48, 140, 205, "h")}
        {leaf(120, 150, 196, "i")}
      </g>
    </svg>
  );
}

export function PlumBranch({ className }: P) {
  const blossom = (x: number, y: number, k: number) => (
    <g key={k} transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx="0" cy="-7" r="6.4" fill="#C8303D" transform={`rotate(${a})`} />
      ))}
      <circle r="3.6" fill="#FFF2DB" />
      <circle r="1.4" fill="#E8B64B" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden>
      <path d="M30 250C70 190 92 140 150 30" stroke="#246B54" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M92 150c22-6 44-2 66 10M118 96c-20-4-36-14-46-30" stroke="#246B54" strokeWidth="4" fill="none" strokeLinecap="round" />
      {[[150, 34], [134, 64], [118, 96], [72, 66], [104, 124], [158, 160], [126, 152], [84, 176], [62, 206]].map(([x, y], i) => blossom(x!, y!, i))}
      <g className="petal">
        <ellipse cx="170" cy="90" rx="4" ry="6" fill="#C8303D" opacity=".8" />
      </g>
    </svg>
  );
}

export function Lotus({ className }: P) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="60" r="38" fill="#E8B64B" />
      <g transform="translate(100 140)">
        {[-60, -30, 0, 30, 60].map((a, i) => (
          <path key={a} d="M0 0C-14-20-14-44 0-60 14-44 14-20 0 0Z" fill={i % 2 ? "#F8DADE" : "#EDA9B1"} stroke="#C25A6B" strokeWidth="1.6" transform={`rotate(${a})`} />
        ))}
      </g>
      <g stroke="#FFF2DB" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity=".85">
        <path d="M40 162c20 8 100 8 120 0" />
        <path d="M30 176c26 9 114 9 140 0" />
        <path d="M24 190c30 8 122 8 152 0" />
      </g>
    </svg>
  );
}

export function HarvestMoon({ className }: P) {
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden>
      <circle cx="122" cy="62" r="44" fill="#FFF2DB" />
      <path d="M60 236 150 50" stroke="#24211D" strokeWidth="4" strokeLinecap="round" />
      {[[140, 72], [126, 100], [112, 128], [98, 156], [84, 184], [70, 212]].map(([x, y], i) => (
        <path
          key={i}
          transform={`translate(${x} ${y}) rotate(${i * 23 - 30}) scale(${1 - i * 0.04})`}
          d="M0-22 5-9 18-14 11-2 22 6 8 7 6 22 0 11-6 22-8 7-22 6-11-2-18-14-5-9Z"
          fill="#B82025"
          stroke="#8F161B"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

export function WinterPines({ className }: P) {
  const pine = (x: number, s: number, k: string) => (
    <g key={k} transform={`translate(${x} 210) scale(${s})`}>
      <path d="M0-120 30-70H14L40-30H18L48 10h-96l30-40h-22l26-40h-16Z" fill="#246B54" />
      <path d="M-3 10h6v18h-6Z" fill="#8a6a40" />
    </g>
  );
  return (
    <svg viewBox="0 0 220 240" className={className} aria-hidden>
      <path d="M40 210 110 60l70 150Z" fill="#8FA1AE" />
      <path d="M110 60 92 98l10-6 8 10 8-12 10 8Z" fill="#FFF2DB" />
      {pine(52, 0.95, "a")}
      {pine(176, 0.85, "b")}
      <g transform="translate(112 214)">
        <ellipse rx="26" ry="16" fill="#B82025" stroke="#E8B64B" strokeWidth="2.4" />
        <Steamlet />
      </g>
    </svg>
  );
}

function Steamlet() {
  return (
    <g className="steam" fill="none" stroke="#FFF2DB" strokeWidth="2.4" strokeLinecap="round">
      <path d="M-8-20c-4-6 4-8 0-14" />
      <path d="M0-20c-4-6 4-8 0-14" />
      <path d="M8-20c-4-6 4-8 0-14" />
    </g>
  );
}

/** Thin divider of alternating seasonal sprigs. */
export function SprigRule({ className }: P) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden>
      <path d="M0 12h96M144 12h96" stroke="currentColor" strokeWidth="1.5" />
      <g transform="translate(120 12)">
        {[0, 90, 180, 270].map((a, i) => (
          <path key={a} d="M0-2C-3-5-3-10 0-11 3-10 3-5 0-2Z" transform={`rotate(${a}) scale(1)`} fill={["#EDA9B1", "#246B54", "#E8B64B", "#263A4F"][i]} />
        ))}
        <circle r="2.4" fill="#B82025" />
      </g>
    </svg>
  );
}
