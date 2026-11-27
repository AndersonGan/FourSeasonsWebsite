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

/** Smooth closed blob through points (midpoint quadratic curves). */
function blobPath(pts: [number, number][]): string {
  const n = pts.length;
  const mid = (a: [number, number], b: [number, number]) => [r1((a[0] + b[0]) / 2), r1((a[1] + b[1]) / 2)] as const;
  const m0 = mid(pts[n - 1]!, pts[0]!);
  let d = `M${m0[0]} ${m0[1]}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i]!;
    const m = mid(p, pts[(i + 1) % n]!);
    d += `Q${r1(p[0])} ${r1(p[1])} ${m[0]} ${m[1]}`;
  }
  return d + "Z";
}

interface Nugget {
  x: number;
  y: number;
  body: string;
  bits: { d: string }[];
  hl: { x: number; y: number; rx: number; ry: number; rot: number };
  pale: boolean;
  delay: number;
}

function makeNuggets(): Nugget[] {
  const rnd = seeded(29);
  const out: Nugget[] = [];
  let tries = 0;
  // Pile centred on the plate; denser and higher in the middle.
  while (out.length < 44 && tries < 2000) {
    tries++;
    const a = rnd() * Math.PI * 2;
    const rr = Math.sqrt(rnd());
    const x = 136 + Math.cos(a) * rr * 84;
    const yBase = 124 + Math.sin(a) * rr * 44;
    if (out.some((o) => Math.hypot(o.x - x, (o.y + (1 - rr) * 16 - yBase) * 1.25) < 13.5)) continue;
    const lift = (1 - rr) * 16; // centre pieces sit higher on the heap
    const y = yBase - lift;
    const size = 10 + rnd() * 5 + (yBase - 80) * 0.045; // nearer = a touch bigger
    const pts: [number, number][] = [];
    const n = 9;
    const rot = rnd() * Math.PI;
    for (let i = 0; i < n; i++) {
      const t = rot + (i / n) * Math.PI * 2;
      const rad = size * (0.72 + rnd() * 0.42);
      pts.push([x + Math.cos(t) * rad * 1.12, y + Math.sin(t) * rad * 0.82]);
    }
    // occasional batter "tail"
    if (rnd() > 0.55) {
      const k = Math.floor(rnd() * n);
      const t = rot + (k / n) * Math.PI * 2;
      pts[k] = [x + Math.cos(t) * size * 1.55, y + Math.sin(t) * size * 1.15];
    }
    const bits = Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => {
      const t = Math.PI * (0.15 + rnd() * 0.7); // lower half: browned edges
      const bx = x + Math.cos(t) * size * 0.7;
      const by = y + Math.sin(t) * size * 0.55;
      const bs = 1.2 + rnd() * 2;
      const bp: [number, number][] = Array.from({ length: 6 }, (_, j) => {
        const u = (j / 6) * Math.PI * 2;
        return [bx + Math.cos(u) * bs * (0.7 + rnd() * 0.6), by + Math.sin(u) * bs * (0.6 + rnd() * 0.5)];
      });
      return { d: blobPath(bp) };
    });
    out.push({
      x,
      y,
      body: blobPath(pts),
      bits,
      hl: { x: r1(x - size * 0.3), y: r1(y - size * 0.32), rx: r1(size * 0.38), ry: r1(size * 0.2), rot: r1(-20 + rnd() * 20) },
      pale: rnd() > 0.6,
      delay: 0,
    });
  }
  // Paint back-to-front; drop order roughly bottom layer first.
  out.sort((a, b) => a.y - b.y);
  out.forEach((o, i) => (o.delay = Math.round(80 + i * 28)));
  return out;
}

const NUGGETS = makeNuggets();

/**
 * Mar Far Chicken as served at Four Seasons: golden battered chicken pieces
 * heaped on a square white plate, with pink sauce. Animated when wrapped in
 * <AnimateOnView> (pieces tumble onto the plate; steam and glints loop).
 * Static and complete without JavaScript or with reduced motion.
 */
export function MarFarPlate({ className }: P) {
  return (
    <svg viewBox="0 0 280 240" className={`mf-art ${className ?? ""}`} aria-hidden>
      <defs>
        <linearGradient id="mf-plate-top" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1ECE3" />
        </linearGradient>
        <radialGradient id="mf-batter" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#F8DC9A" />
          <stop offset="0.55" stopColor="#E8AE55" />
          <stop offset="1" stopColor="#BD772B" />
        </radialGradient>
        <radialGradient id="mf-batter-pale" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#FAE6B3" />
          <stop offset="0.6" stopColor="#EFC170" />
          <stop offset="1" stopColor="#C98739" />
        </radialGradient>
        <radialGradient id="mf-sauce" cx="38%" cy="35%" r="75%">
          <stop offset="0" stopColor="#FAD0D6" />
          <stop offset="0.6" stopColor="#EFA2AF" />
          <stop offset="1" stopColor="#DD8291" />
        </radialGradient>
        <filter id="mf-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* shadow */}
      <path d="M30 200 L250 190 L262 206 L22 214Z" fill="#24211D" opacity=".18" filter="url(#mf-soft)" />

      {/* square plate in perspective: rim thickness, top, inner well */}
      <path d="M44 62Q134 52 226 54Q232 54 234 60L258 182Q260 190 252 191Q136 202 22 196Q14 196 15 188L36 66Q38 62 44 62Z" transform="translate(0 7)" fill="#DCD5C8" stroke="#24211D" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M44 62Q134 52 226 54Q232 54 234 60L258 182Q260 190 252 191Q136 202 22 196Q14 196 15 188L36 66Q38 62 44 62Z" fill="url(#mf-plate-top)" stroke="#24211D" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M58 74Q134 66 214 67L236 174Q136 184 38 179Z" fill="#F4EFE6" opacity=".9" />
      <path d="M58 74Q134 66 214 67" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity=".9" />

      {/* the heap */}
      <g className="mf-heap">
        {NUGGETS.map((n, i) => (
          <g key={i} className="mf-drop" style={{ ["--d" as string]: `${n.delay}ms` }}>
            <path d={n.body} fill="#8A5418" opacity=".22" transform="translate(1.5 3)" />
            <path d={n.body} fill={`url(#${n.pale ? "mf-batter-pale" : "mf-batter"})`} stroke="#A8692A" strokeWidth="1.1" strokeLinejoin="round" />
            {n.bits.map((b, k) => (
              <path key={k} d={b.d} fill="#B9702A" opacity=".42" />
            ))}
            <ellipse cx={n.hl.x} cy={n.hl.y} rx={n.hl.rx} ry={n.hl.ry} transform={`rotate(${n.hl.rot} ${n.hl.x} ${n.hl.y})`} fill="#FFF6DC" opacity=".7" />
          </g>
        ))}
      </g>

      {/* glints on the crispy batter */}
      <g fill="#FFFBEA">
        {([[104, 98], [158, 92], [182, 128], [122, 138]] as const).map(([x, y], i) => (
          <path key={i} className="mf-glint" style={{ ["--d" as string]: `${i * 900}ms` }} d={`M${x} ${y - 5}L${x + 1.3} ${y - 1.3}L${x + 5} ${y}L${x + 1.3} ${y + 1.3}L${x} ${y + 5}L${x - 1.3} ${y + 1.3}L${x - 5} ${y}L${x - 1.3} ${y - 1.3}Z`} />
        ))}
      </g>

      {/* steam */}
      <g className="steam" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity=".85">
        <path d="M112 70c-6-7 6-11 0-19s5-12 2-20" />
        <path d="M136 64c-6-7 6-11 0-19s5-12 2-20" />
        <path d="M160 70c-6-7 6-11 0-19s5-12 2-20" />
      </g>

      {/* pink sauce ramekin */}
      <g transform="translate(238 198)">
        <ellipse rx="36" ry="27" fill="#24211D" opacity=".15" transform="translate(3 6)" />
        <ellipse rx="36" ry="27" fill="#FFFBF2" stroke="#24211D" strokeWidth="2.4" />
        <ellipse rx="26" ry="18" fill="url(#mf-sauce)" stroke="#C9707F" strokeWidth="1" />
        <path className="mf-shine" d="M-15-6c7-6 18-7 26-2" stroke="#FFF" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity=".75" />
        <circle cx="10" cy="6" r="2" fill="#FFF" opacity=".55" />
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
