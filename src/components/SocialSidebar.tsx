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
            className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110"
            style={{
              color: link.color,
              borderColor: `${link.color}40`,
              backgroundColor: `${link.color}12`,
            }}
            onMouseEnter={(e) => {
              setHovered(link.label);
              e.currentTarget.style.backgroundColor = `${link.color}28`;
              e.currentTarget.style.borderColor = `${link.color}90`;
              e.currentTarget.style.boxShadow = `0 0 12px ${link.color}55`;
            }}
            onMouseLeave={(e) => {
              setHovered(null);
              e.currentTarget.style.backgroundColor = `${link.color}12`;
              e.currentTarget.style.borderColor = `${link.color}40`;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {link.icon}
          </a>

          {/* Tooltip */}
          {hovered === link.label && (
            <div
              className="absolute left-14 whitespace-nowrap text-xs font-mono px-2.5 py-1 rounded-lg pointer-events-none"
              style={{
                color: link.color,
                background: `${link.color}18`,
                border: `1px solid ${link.color}50`,
                animation: 'sidebarFadeIn .15s ease-out',
              }}
            >
              {link.label}
            </div>
          )}
        </div>
      ))}
      <div className="w-px h-12 mt-1" style={{ background: 'linear-gradient(to bottom, #94A3B8, transparent)' }} />

      <style>{`
        @keyframes sidebarFadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
