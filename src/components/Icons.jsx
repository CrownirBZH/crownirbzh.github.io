const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const ArrowIcon = () => (
  <svg {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const CheckIcon = () => (
  <svg {...base}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export const MailIcon = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)

export const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3V9.75zm6.5 0h3.8v1.6h.06c.53-1 1.83-1.9 3.76-1.9 4.02 0 4.76 2.5 4.76 5.8V21h-4v-5.1c0-1.3-.03-2.9-1.85-2.9-1.85 0-2.13 1.4-2.13 2.8V21h-4V9.75z" />
  </svg>
)

// Logo du site (le même dessin que le favicon), sans son fond : les lettres
// C et H soulignées d'un trait violet. Le cadre (viewBox) englobe tout le
// dessin, épaisseur des traits comprise : de x = 5 à 54 et de y = 15 à 54.
export const Logo = () => (
  <svg viewBox="3.5 8.5 52 52" aria-hidden="true">
    <g fill="none" stroke="#f2f3f5" strokeWidth="6" strokeLinecap="round">
      <path d="M28 21a12 12 0 1 0 0 18" />
      <path d="M37 18v24M51 18v24M37 30h14" />
    </g>
    <rect x="13" y="49" width="38" height="5" rx="2.5" fill="#8f7dff" />
  </svg>
)
