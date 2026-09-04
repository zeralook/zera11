const paths = {
  bag: <><path d="M18 10V8a6 6 0 0 0-12 0v2"/><path d="M4 10h16l-1 10H5L4 10Z"/><path d="M8 14h.01M16 14h.01"/></>,
  package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/><path d="m8 5.25 8 4.5"/></>,
  truck: <><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M9 18h7"/></>,
  money: <><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14-4L4 9"/><path d="M4 5v4h4"/><path d="M4 13a8 8 0 0 0 14 4l2-2"/><path d="M20 19v-4h-4"/></>,
  message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.5-.7L4 20l1.7-3.7A7.2 7.2 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
  whatsapp: <><path d="M19.5 4.6A10 10 0 0 0 3.8 17.1L3 21l3.9-1a10 10 0 0 0 12.6-15.4Z"/><path d="M8.2 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.2.1.4-.1.6l-.6.7c.7 1.2 1.6 2.1 2.8 2.8l.7-.6c.2-.2.4-.2.6-.1l1.9.8c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.5.3-1.2.5-1.8.3-2-.5-3.7-1.6-5.1-3-1.5-1.5-2.5-3.1-3-5.1-.2-.6 0-1.3.3-1.8Z"/></>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16.5 9"/></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 14h4"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.2"/><path d="m16 16 4 4"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m7 7 10 10M17 7 7 17"/></>,
};

import { useId } from 'react';

export default function Icon3D({ name, size = 58, className = '', title }) {
  const content = paths[name] || paths.bag;
  const uid = useId().replace(/:/g, '');
  return (
    <span className={`icon-3d ${className}`.trim()} style={{ '--icon-size': `${size}px` }} aria-hidden={title ? undefined : true} title={title}>
      <svg viewBox="0 0 24 24" role={title ? 'img' : undefined} aria-label={title} fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id={`zera-icon-gold-${uid}`} x1="4" y1="3" x2="20" y2="21">
            <stop offset="0" stopColor="#F0D5A5" />
            <stop offset="0.48" stopColor="#B8935F" />
            <stop offset="1" stopColor="#7D5A32" />
          </linearGradient>
        </defs>
        <g stroke={`url(#zera-icon-gold-${uid})`}>{content}</g>
      </svg>
    </span>
  );
}
