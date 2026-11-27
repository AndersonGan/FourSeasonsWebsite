/**
 * Original food & packaging illustrations. Stylized, not photographs —
 * never present these as the restaurant's actual dishes.
 * All decorative (aria-hidden); text alternatives live in surrounding copy.
 */
type P = { className?: string };

export function Steam({ className, color = "currentColor" }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 60 50" className={`steam ${className ?? ""}`} aria-hidden fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round">
      <path d="M14 46c-6-7 6-11 0-19s5-12 2-20" />
      <path d="M30 46c-6-7 6-11 0-19s5-12 2-20" />
      <path d="M46 46c-6-7 6-11 0-19s5-12 2-20" />
    </svg>
  );
}

export function TakeoutBox({ className, seal = true }: P & { seal?: boolean }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      {/* chopsticks */}
      <g stroke="#E8B64B" strokeWidth="5" strokeLinecap="round">
        <path d="M150 74 205 8" />
        <path d="M160 78 216 16" />
      </g>
      {/* wire handle */}
      <path d="M78 74c0-40 84-40 84 0" fill="none" stroke="#24211D" strokeWidth="3" />
      {/* back flaps */}
      <path d="M62 72 92 44h56l30 28Z" fill="#E9D2A8" stroke="#24211D" strokeWidth="3" strokeLinejoin="round" />
      {/* body */}
      <path d="M52 76h136l-20 140H72Z" fill="#FFF8EA" stroke="#24211D" strokeWidth="3" strokeLinejoin="round" />
      <path d="M52 76h136l-8 14H60Z" fill="#F6E3C2" stroke="#24211D" strokeWidth="3" strokeLinejoin="round" />
      {/* front flaps */}
      <path d="M52 76 72 56l20 20M188 76l-20-20-20 20" fill="#FFF8EA" stroke="#24211D" strokeWidth="3" strokeLinejoin="round" />
      {/* side fold lines */}
      <path d="M120 90v126" stroke="#24211D" strokeWidth="1.6" strokeDasharray="4 6" opacity=".35" />
      {/* red band */}
      <path d="M62 104h116l-2.2 15H64.2Z" fill="#B82025" />
      {seal ? (
        <g transform="translate(120 160)">
          <circle r="24" fill="#B82025" />
          <circle r="19" fill="none" stroke="#FFF2DB" strokeWidth="1.6" />
          <text y="7" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="19" fill="#FFF2DB">4S</text>
        </g>
      ) : null}
    </svg>
  );
}

/** Golden Mar Far chicken slices on a plate with a pink-sauce bowl. */
export function MarFarPlate({ className }: P) {
  const slices = [
    [86, 92, -8], [112, 86, 4], [138, 92, 12], [80, 116, -14], [106, 112, 0], [132, 116, 8], [158, 112, 18],
    [92, 140, -6], [118, 138, 6], [144, 142, 14], [104, 164, -2], [130, 166, 10],
  ] as const;
  return (
    <svg viewBox="0 0 280 240" className={className} aria-hidden>
      <ellipse cx="124" cy="132" rx="104" ry="98" fill="#E9D2A8" stroke="#24211D" strokeWidth="3" />
      <ellipse cx="124" cy="130" rx="86" ry="80" fill="#FFF8EA" stroke="#246B54" strokeWidth="2.4" />
      {/* lettuce bed */}
      <path d="M62 150c10-40 40-70 84-72 30 0 50 16 52 34-20-8-36 4-52 0-24-6-52 20-84 38Z" fill="#7FA66B" opacity=".55" />
      {slices.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <rect x="-16" y="-9" width="32" height="18" rx="6" fill={i % 3 === 0 ? "#D9913A" : "#E8B64B"} stroke="#9A5A1C" strokeWidth="1.6" />
          <path d="M-10-3h6M-2 2h7M4-4h6" stroke="#9A5A1C" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
        </g>
      ))}
      {/* almonds / sesame */}
      {[[96, 104], [124, 126], [150, 104], [112, 152], [140, 154]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2.4" ry="1.4" fill="#FFF8EA" />
      ))}
      {/* pink sauce bowl */}
      <g transform="translate(232 186)">
        <ellipse rx="40" ry="36" fill="#FFF8EA" stroke="#24211D" strokeWidth="3" />
        <ellipse rx="29" ry="25" fill="#EDA9B1" />
        <path d="M-16-8c8-6 22-6 30 2" stroke="#FFF2DB" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
      </g>
    </svg>
  );
}

/** Bamboo steamer seen from above, with pleated dumplings and buns. */
export function DimSumSteamer({ className }: P) {
  const spots = [[-36, -30], [8, -42], [44, -12], [-46, 14], [-4, 6], [34, 34], [-16, 44]] as const;
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      <g transform="translate(120 120)">
        <circle r="110" fill="#D9A55B" stroke="#24211D" strokeWidth="3" />
        <circle r="98" fill="#E8C487" stroke="#9A5A1C" strokeWidth="2" />
        {/* woven slats */}
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} d={`M-96 ${-80 + i * 20}H96`} stroke="#B98236" strokeWidth="1.4" opacity=".55" />
        ))}
        <circle r="98" fill="none" stroke="#9A5A1C" strokeWidth="2" />
        {/* parchment liner */}
        <circle r="84" fill="#FFF2DB" opacity=".92" />
        {spots.map(([x, y], i) =>
          i % 3 === 2 ? (
            // BBQ pork bun
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="21" fill="#FFF8EA" stroke="#24211D" strokeWidth="2.2" />
              <path d="M-7-4 0 4 7-4M0 4v-11" stroke="#B82025" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            // pleated dumpling
            <g key={i} transform={`translate(${x} ${y}) rotate(${i * 37})`}>
              <path d="M-20 6c0-16 10-24 20-24s20 8 20 24c-13 6-27 6-40 0Z" fill="#F8EEDC" stroke="#24211D" strokeWidth="2.2" />
              <path d="M-10-10v12M-3-15v15M4-15v15M11-10v12" stroke="#C9A97A" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ),
        )}
      </g>
    </svg>
  );
}

/** Family-style table from above: shared plates on a lazy susan. */
export function FamilyTable({ className }: P) {
  return (
    <svg viewBox="0 0 320 320" className={className} aria-hidden>
      <circle cx="160" cy="160" r="152" fill="#B82025" />
      <circle cx="160" cy="160" r="142" fill="none" stroke="#E8B64B" strokeWidth="2" strokeDasharray="2 7" />
      <circle cx="160" cy="160" r="84" fill="#8F161B" />
      {/* plates */}
      {[
        [160, 82, "#E8B64B"], [238, 150, "#DC703B"], [210, 236, "#7FA66B"], [110, 236, "#F6E3C2"], [82, 150, "#EDA9B1"],
      ].map(([x, y, fill], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="40" fill="#FFF8EA" stroke="#24211D" strokeWidth="2.6" />
          <circle r="31" fill="none" stroke="#246B54" strokeWidth="1.6" />
          <circle r="23" fill={fill as string} opacity=".95" />
          {i === 2 ? <path d="M-12-4h24M-14 4h28M-8 12h16" stroke="#246B54" strokeWidth="3" strokeLinecap="round" /> : null}
          {i === 3 ? <g fill="#FFF">{Array.from({ length: 9 }).map((_, k) => <circle key={k} cx={-12 + (k % 3) * 12} cy={-10 + Math.floor(k / 3) * 10} r="3" />)}</g> : null}
          {i === 0 ? <path d="M-14-6h28M-16 3h32M-12 12h24" stroke="#9A5A1C" strokeWidth="4" strokeLinecap="round" /> : null}
        </g>
      ))}
      {/* center: teapot + cups */}
      <g transform="translate(160 160)">
        <circle r="30" fill="#FFF8EA" stroke="#24211D" strokeWidth="2.6" />
        <circle r="10" fill="#246B54" />
        <path d="M22-10c12-4 18 4 14 14" stroke="#24211D" strokeWidth="2.6" fill="none" />
      </g>
      {/* chopsticks at places */}
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a + 36} 160 160)`}>
          <path d="M160 14v34M168 14v34" stroke="#E8B64B" strokeWidth="3.4" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

export function SauceBowl({ className }: P) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      <path d="M8 26h104c0 28-22 48-52 48S8 54 8 26Z" fill="#FFF8EA" stroke="#24211D" strokeWidth="3" />
      <ellipse cx="60" cy="26" rx="52" ry="12" fill="#EDA9B1" stroke="#24211D" strokeWidth="3" />
      <path d="M30 24c12-6 32-6 46 0" stroke="#FFF2DB" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
      <path d="M22 44h76" stroke="#246B54" strokeWidth="2" strokeDasharray="3 5" />
    </svg>
  );
}

export function TeaCup({ className }: P) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <path d="M20 40h80l-8 40c-2 8-8 12-16 12H44c-8 0-14-4-16-12Z" fill="#FFF8EA" stroke="#24211D" strokeWidth="3" />
      <ellipse cx="60" cy="40" rx="40" ry="8" fill="#C9A24A" stroke="#24211D" strokeWidth="3" />
      <path d="M34 62c8 6 44 6 52 0" stroke="#246B54" strokeWidth="2.4" fill="none" />
    </svg>
  );
}
