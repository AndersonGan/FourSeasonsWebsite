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

/** Deterministic pseudo-random numbers so server and client render identical SVG. */
function seeded(seed: number) {
  let x = seed;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Mar Far chicken: one breaded, fried chicken cutlet sliced into strips and
 * laid over shredded lettuce, with a ramekin of pink sauce. Same 280×240
 * frame as before so existing layouts keep working.
 */
export function MarFarPlate({ className }: P) {
  const rnd = seeded(11);
  // Lettuce shreds radiating under the cutlet.
  const shreds = Array.from({ length: 120 }, () => {
    const a = rnd() * Math.PI * 2;
    const d = 6 + Math.sqrt(rnd()) * 60;
    const x = 122 + Math.cos(a) * d * 1.05;
    const y = 128 + Math.sin(a) * d * 0.82;
    const len = 7 + rnd() * 12;
    const ang = a + (rnd() - 0.5) * 1.2;
    const bend = (rnd() - 0.5) * 7;
    const x2 = x + Math.cos(ang) * len;
    const y2 = y + Math.sin(ang) * len;
    const color = ["#B8D594", "#D3E6B0", "#A3C77F", "#E4F0CC", "#C7DE9F"][Math.floor(rnd() * 5)];
    return { d: `M${r1(x)} ${r1(y)}Q${r1((x + x2) / 2 + bend)} ${r1((y + y2) / 2 - bend)} ${r1(x2)} ${r1(y2)}`, color, w: r1(1.4 + rnd() * 1.6) };
  });
  // Seven strips of one cutlet, fanned slightly, each with its own jitter.
  const strips = Array.from({ length: 7 }, (_, i) => ({
    x: -66 + i * 19.5 + (rnd() - 0.5) * 2,
    y: (rnd() - 0.5) * 5 - Math.abs(i - 3) * 1.6,
    rot: (i - 3) * 2.4 + (rnd() - 0.5) * 2,
    h: 66 - Math.abs(i - 3) * 5 + rnd() * 3,
  }));
  const crumbs = Array.from({ length: 140 }, () => ({ x: r1(rnd() * 18), y: r1(rnd() * 70), r: r1(0.35 + rnd() * 0.75), dark: rnd() > 0.5 }));

  return (
    <svg viewBox="0 0 280 240" className={className} aria-hidden>
      <defs>
        <radialGradient id="mf-plate" cx="45%" cy="40%" r="70%">
          <stop offset="0" stopColor="#FFFDF7" />
          <stop offset="1" stopColor="#F3E7CF" />
        </radialGradient>
        <linearGradient id="mf-crust" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#F6CB6E" />
          <stop offset="0.45" stopColor="#E2A443" />
          <stop offset="1" stopColor="#B8742A" />
        </linearGradient>
        <linearGradient id="mf-crust-dark" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#EDB95A" />
          <stop offset="1" stopColor="#A9661F" />
        </linearGradient>
        <radialGradient id="mf-sauce" cx="38%" cy="35%" r="75%">
          <stop offset="0" stopColor="#FAD0D6" />
          <stop offset="0.6" stopColor="#EFA2AF" />
          <stop offset="1" stopColor="#DD8291" />
        </radialGradient>
        <radialGradient id="mf-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0.6" stopColor="#24211D" stopOpacity=".22" />
          <stop offset="1" stopColor="#24211D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft shadows */}
      <ellipse cx="130" cy="142" rx="112" ry="100" fill="url(#mf-shadow)" />
      <ellipse cx="236" cy="196" rx="44" ry="38" fill="url(#mf-shadow)" />

      {/* plate */}
      <ellipse cx="124" cy="130" rx="104" ry="98" fill="#FFFBF2" stroke="#24211D" strokeWidth="2.6" />
      <ellipse cx="124" cy="130" rx="96" ry="90" fill="none" stroke="#246B54" strokeWidth="1.4" />
      <ellipse cx="124" cy="130" rx="92" ry="86" fill="none" stroke="#246B54" strokeWidth="0.8" strokeDasharray="1.5 4" />
      <ellipse cx="124" cy="131" rx="80" ry="74" fill="url(#mf-plate)" />

      {/* shredded lettuce */}
      <g strokeLinecap="round" fill="none">
        {shreds.map((sh, i) => (
          <path key={i} d={sh.d} stroke={sh.color} strokeWidth={sh.w} />
        ))}
      </g>

      {/* sliced cutlet */}
      <g transform="translate(122 126) rotate(-16)">
        {/* shadow beneath the cutlet */}
        <rect x="-64" y="-28" width="134" height="58" rx="18" fill="#7A4A16" opacity=".14" transform="translate(2 4)" />
        {strips.map((st, i) => (
          <g key={i} transform={`translate(${r1(st.x)} ${r1(st.y)}) rotate(${r1(st.rot)})`}>
            {/* crust */}
            <rect x="0" y={r1(-st.h / 2)} width="18" height={r1(st.h)} rx="6" fill={`url(#${i % 3 === 1 ? "mf-crust-dark" : "mf-crust"})`} stroke="#8A5418" strokeWidth="1.3" />
            {/* crumb texture */}
            <g clipPath={`url(#mf-clip-${i})`}>
              {crumbs
                .filter((c) => c.y < st.h)
                .map((c, k) => (
                  <circle key={k} cx={c.x} cy={r1(c.y - st.h / 2)} r={c.r} fill={c.dark ? "#9A5A1C" : "#FBE3A6"} opacity={c.dark ? 0.45 : 0.7} />
                ))}
            </g>
            <clipPath id={`mf-clip-${i}`}>
              <rect x="0" y={r1(-st.h / 2)} width="18" height={r1(st.h)} rx="6" />
            </clipPath>
            {/* white-meat cut edge */}
            <rect x="14.6" y={r1(-st.h / 2 + 6)} width="2.4" height={r1(st.h - 12)} rx="1.2" fill="#F6E4BF" opacity=".9" />
            {/* highlight */}
            <path d={`M4 ${r1(-st.h / 2 + 8)}q2 ${r1(st.h * 0.25)} 0 ${r1(st.h * 0.5)}`} stroke="#FFF3CF" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".6" />
          </g>
        ))}
      </g>

      {/* pink sauce ramekin */}
      <g transform="translate(232 186)">
        <ellipse rx="40" ry="35" fill="#FFFBF2" stroke="#24211D" strokeWidth="2.6" />
        <ellipse rx="34" ry="29" fill="none" stroke="#246B54" strokeWidth="1" strokeDasharray="1.5 4" />
        <ellipse rx="29" ry="24" fill="url(#mf-sauce)" stroke="#C9707F" strokeWidth="1" />
        <path d="M-17-9c7-7 20-8 29-2" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".75" />
        <circle cx="12" cy="8" r="2.4" fill="#FFF" opacity=".55" />
        <path d="M-8 6c4 3 10 3 14 0" stroke="#D27586" strokeWidth="1.2" fill="none" opacity=".6" />
      </g>

      {/* chopsticks resting across the plate rim */}
      <g strokeLinecap="round">
        <path d="M206 34 262 112" stroke="#9A5A1C" strokeWidth="5.2" />
        <path d="M206 34 262 112" stroke="#E8B64B" strokeWidth="3.6" />
        <path d="M194 40 252 120" stroke="#9A5A1C" strokeWidth="5.2" />
        <path d="M194 40 252 120" stroke="#E8B64B" strokeWidth="3.6" />
        <path d="M206 34 216 48M194 40 204 54" stroke="#B82025" strokeWidth="4" />
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
