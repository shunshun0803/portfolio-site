import { useState } from 'react';
import { socialLinks } from '../data/links';

const snsLinks = socialLinks.filter((l) => !l.href.startsWith('mailto'));

export function SocialSidebar() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {snsLinks.map((link) => (
        <div key={link.label} className="relative flex items-center">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="text-xl w-11 h-11 flex items-center justify-center border-2 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{
              color: '#FFD200',
              borderColor: '#FFD200',
              background: 'rgba(0,0,0,0.5)',
              boxShadow: '3px 3px 0 #000',
            }}
            onMouseEnter={(e) => {
              setHovered(link.label);
              e.currentTarget.style.background = '#FFD200';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              setHovered(null);
              e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
              e.currentTarget.style.color = '#FFD200';
            }}
          >
            {link.icon}
          </a>

          {/* Tooltip */}
          {hovered === link.label && (
            <div
              className="absolute left-14 whitespace-nowrap text-[10px] font-pixel px-2.5 py-1.5 pointer-events-none"
              style={{
                color: '#000',
                background: '#FFD200',
                boxShadow: '2px 2px 0 #000',
                animation: 'sidebarFadeIn .12s steps(2)',
              }}
            >
              {link.label}
            </div>
          )}
        </div>
      ))}
      <div className="w-1 h-12 mt-1" style={{ background: 'linear-gradient(to bottom, #FF7A18, transparent)' }} />

      <style>{`
        @keyframes sidebarFadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
