export default function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" width="400" height="160">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f0f14" stopOpacity={1} />
          <stop offset="100%" stopColor="#1a1a24" stopOpacity={1} />
        </linearGradient>
        <linearGradient id="stringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8a96e" stopOpacity={0.3} />
          <stop offset="50%" stopColor="#e8c87a" stopOpacity={1} />
          <stop offset="100%" stopColor="#c8a96e" stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id="neckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2d1f0e" />
          <stop offset="100%" stopColor="#3d2a10" />
        </linearGradient>
        <linearGradient id="dotGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d080" />
          <stop offset="100%" stopColor="#c8920a" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* <!-- Background --> */}
      <rect width="400" height="160" rx="16" fill="url(#bgGrad)" />

      {/* <!-- Subtle grid lines in background --> */}
      <line x1="0" y1="40" x2="400" y2="40" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
      <line x1="0" y1="80" x2="400" y2="80" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
      <line x1="0" y1="120" x2="400" y2="120" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />

      {/* <!-- ===== GUITAR NECK / FRETBOARD ===== --> */}
      {/* <!-- Neck body --> */}
      <rect x="22" y="38" width="88" height="84" rx="4" fill="url(#neckGrad)" />
      {/* <!-- Neck wood grain lines --> */}
      <line x1="30" y1="38" x2="30" y2="122" stroke="#4a3318" strokeWidth="0.5" strokeOpacity="0.6" />
      <line x1="48" y1="38" x2="48" y2="122" stroke="#4a3318" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="70" y1="38" x2="70" y2="122" stroke="#4a3318" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="90" y1="38" x2="90" y2="122" stroke="#4a3318" strokeWidth="0.5" strokeOpacity="0.5" />
      <line x1="102" y1="38" x2="102" y2="122" stroke="#5a4020" strokeWidth="0.5" strokeOpacity="0.3" />

      {/* <!-- Neck border highlight --> */}
      <rect x="22" y="38" width="88" height="84" rx="4" fill="none" stroke="#5a3d1a" strokeWidth="1" />

      {/* <!-- Fret lines --> */}
      <line x1="22" y1="55" x2="110" y2="55" stroke="#c8a050" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="22" y1="72" x2="110" y2="72" stroke="#c8a050" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="22" y1="89" x2="110" y2="89" stroke="#c8a050" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="22" y1="106" x2="110" y2="106" stroke="#c8a050" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* <!-- Fret numbers --> */}
      <text x="13" y="67" fontFamily="monospace" fontSize="8" fill="#c8a050" fillOpacity="0.5" textAnchor="middle">1</text>
      <text x="13" y="84" fontFamily="monospace" fontSize="8" fill="#c8a050" fillOpacity="0.5" textAnchor="middle">2</text>
      <text x="13" y="101" fontFamily="monospace" fontSize="8" fill="#c8a050" fillOpacity="0.5" textAnchor="middle">3</text>

      {/* <!-- Guitar strings (6 strings) --> */}
      <line x1="32" y1="38" x2="32" y2="122" stroke="url(#stringGrad)" strokeWidth="1" filter="url(#glow)" />
      <line x1="44" y1="38" x2="44" y2="122" stroke="url(#stringGrad)" strokeWidth="1.2" filter="url(#glow)" />
      <line x1="56" y1="38" x2="56" y2="122" stroke="url(#stringGrad)" strokeWidth="1.4" filter="url(#glow)" />
      <line x1="68" y1="38" x2="68" y2="122" stroke="url(#stringGrad)" strokeWidth="1.6" filter="url(#glow)" />
      <line x1="80" y1="38" x2="80" y2="122" stroke="url(#stringGrad)" strokeWidth="1.8" filter="url(#glow)" />
      <line x1="92" y1="38" x2="92" y2="122" stroke="url(#stringGrad)" strokeWidth="2" filter="url(#glow)" />

      {/* <!-- Chord dots (Am chord shape) --> */}
      {/* <!-- Fret 1: string 2 (B string) --> */}
      <circle cx="44" cy="63" r="5.5" fill="url(#dotGold)" filter="url(#glow)" />
      {/* <!-- Fret 2: strings 3,4,5 --> */}
      <circle cx="56" cy="80" r="5.5" fill="url(#dotGold)" filter="url(#glow)" />
      <circle cx="68" cy="80" r="5.5" fill="url(#dotGold)" filter="url(#glow)" />
      <circle cx="80" cy="80" r="5.5" fill="url(#dotGold)" filter="url(#glow)" />

      {/* <!-- Chord label --> */}
      <text x="66" y="136" fontFamily="Georgia, serif" fontSize="10" fill="#c8a050" fillOpacity="0.7" textAnchor="middle" fontStyle="italic">Am</text>

      {/* <!-- Nut (top bar) --> */}
      <rect x="22" y="35" width="88" height="5" rx="2" fill="#d4aa60" />

      {/* <!-- Tuning pegs (simplified dots at top) --> */}
      <circle cx="32" cy="32" r="3" fill="#8a7040" stroke="#c8a050" strokeWidth="0.5" />
      <circle cx="44" cy="30" r="3" fill="#8a7040" stroke="#c8a050" strokeWidth="0.5" />
      <circle cx="56" cy="29" r="3" fill="#8a7040" stroke="#c8a050" strokeWidth="0.5" />
      <circle cx="68" cy="29" r="3" fill="#8a7040" stroke="#c8a050" strokeWidth="0.5" />
      <circle cx="80" cy="30" r="3" fill="#8a7040" stroke="#c8a050" strokeWidth="0.5" />
      <circle cx="92" cy="32" r="3" fill="#8a7040" stroke="#c8a050" strokeWidth="0.5" />

      {/* <!-- ===== TEXT ===== --> */}
      {/* <!-- "CHORD" main title --> */}
      <text x="138" y="82"
        fontFamily="'Palatino Linotype', Palatino, 'Book Antiqua', serif"
        fontSize="46"
        fontWeight="700"
        letterSpacing="3"
        fill="#f0e8d0"
        filter="url(#softGlow)">CHORD</text>

      {/* <!-- "BUILDER" subtitle --> */}
      <text x="140" y="108"
        fontFamily="'Courier New', Courier, monospace"
        fontSize="18"
        fontWeight="400"
        letterSpacing="10"
        fill="#c8a050">BUILDER</text>

      {/* <!-- Decorative line between title and subtitle --> */}
      <line x1="138" y1="90" x2="385" y2="90" stroke="#c8a050" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* <!-- Small tagline --> */}
      <text x="141" y="126"
        fontFamily="'Courier New', Courier, monospace"
        fontSize="9"
        letterSpacing="2"
        fill="#c8a050"
        fillOpacity="0.5">GUITAR CHORD ASSISTANT</text>

      {/* <!-- Decorative musical accent — small dots like a dotted bar line --> */}
      <circle cx="129" cy="80" r="2" fill="#c8a050" fillOpacity="0.4" />
      <circle cx="129" cy="90" r="2" fill="#c8a050" fillOpacity="0.4" />
      <circle cx="129" cy="100" r="2" fill="#c8a050" fillOpacity="0.4" />

    </svg>
  )
}