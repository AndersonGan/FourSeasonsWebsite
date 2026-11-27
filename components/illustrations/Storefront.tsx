/**
 * Stylized storefront: red awning, outlined lettering, potted bamboo.
 * An interpretation inspired by the public storefront description — not a
 * reproduction of the actual sign. Replace with an approved photo when available.
 */
export function Storefront({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 320" className={className} aria-hidden>
      {/* building */}
      <rect x="20" y="30" width="380" height="270" fill="#F6E3C2" stroke="#24211D" strokeWidth="3" />
      <path d="M20 30h380v20H20Z" fill="#E9D2A8" stroke="#24211D" strokeWidth="3" />
      {/* sign band */}
      <rect x="48" y="62" width="324" height="58" fill="#B82025" stroke="#24211D" strokeWidth="3" />
      <text
        x="210"
        y="102"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="30"
        letterSpacing="1"
        fill="#FFF2DB"
        stroke="#24211D"
        strokeWidth="1.2"
        paintOrder="stroke"
      >
        FOUR SEASONS
      </text>
      {/* awning */}
      <path d="M36 132h348l-14 38H50Z" fill="#B82025" stroke="#24211D" strokeWidth="3" strokeLinejoin="round" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M${50 + i * 28} 170q14 14 28 0`} fill={i % 2 ? "#B82025" : "#8F161B"} stroke="#24211D" strokeWidth="2" />
      ))}
      {/* windows + door */}
      <rect x="54" y="196" width="112" height="86" fill="#FFF8EA" stroke="#24211D" strokeWidth="3" />
      <rect x="254" y="196" width="112" height="86" fill="#FFF8EA" stroke="#24211D" strokeWidth="3" />
      <path d="M110 196v86M54 239h112M310 196v86M254 239h112" stroke="#24211D" strokeWidth="2" />
      <rect x="182" y="190" width="56" height="110" fill="#246B54" stroke="#24211D" strokeWidth="3" />
      <rect x="192" y="202" width="36" height="44" fill="#FFF8EA" stroke="#24211D" strokeWidth="2" />
      <circle cx="228" cy="262" r="3" fill="#E8B64B" />
      <text x="210" y="229" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#B82025">OPEN</text>
      {/* lantern glow */}
      <g transform="translate(210 178)">
        <ellipse rx="9" ry="10" fill="#E8B64B" />
        <path d="M-9 0h18" stroke="#B82025" strokeWidth="2" />
      </g>
      {/* bamboo planters */}
      {[26, 354].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <rect x="0" y="270" width="40" height="30" fill="#B82025" stroke="#24211D" strokeWidth="2.6" />
          <g className="sway">
            {[10, 20, 30].map((bx, i) => (
              <g key={bx}>
                <path d={`M${bx} 272V${180 + i * 12}`} stroke="#246B54" strokeWidth="4.5" strokeLinecap="round" />
                <path d={`M${bx} ${200 + i * 10}c8-6 18-6 24-2-8 5-17 6-24 2Z`} fill="#246B54" />
                <path d={`M${bx} ${222 + i * 6}c-8-6-18-6-24-2 8 5 17 6 24 2Z`} fill="#246B54" />
              </g>
            ))}
          </g>
        </g>
      ))}
      {/* address plate */}
      <rect x="320" y="40" width="56" height="16" fill="#FFF8EA" stroke="#24211D" strokeWidth="1.6" />
      <text x="348" y="52" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="10" fill="#24211D">122</text>
    </svg>
  );
}
