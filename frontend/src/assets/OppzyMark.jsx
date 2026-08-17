// Ring + folded paper-plane mark. Path geometry is the user's exact
// MarkLogo.tsx artwork (ring, plane, tail). Defaults to the site's blue
// brand gradient for use on light backgrounds (navbar, auth card). Pass
// variant="white" for dark backgrounds (e.g. the auth-brand dark panel),
// where the blue gradient has too little contrast to read.
export default function OppzyMark({ className = '', variant = 'brand' }) {
  const fill = variant === 'white' ? '#ffffff' : 'url(#oppzyMarkGradient)';
  return (
    <svg
      className={className}
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Oppzy"
    >
      {variant !== 'white' && (
        <defs>
          <linearGradient id="oppzyMarkGradient" x1="64" y1="64" x2="736" y2="736" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0a66c2" />
            <stop offset="1" stopColor="#2c8ed6" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M401 151C250 151 128 273 128 424c0 151 122 273 273 273 46 0 89-11 127-32l-69-92c-18 7-37 11-58 11-88 0-160-72-160-160s72-160 160-160c68 0 126 42 149 102l116 12C641 247 532 151 401 151Z"
        fill={fill}
      />
      <path d="M352 386 694 431 609 500 429 421 590 539 514 607Z" fill={fill} />
      <path d="m590 539 32 55-41-22Z" fill={fill} />
    </svg>
  );
}
