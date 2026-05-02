import { useEffect } from 'react';

interface PortalOverlayProps {
  onComplete: () => void;
}

export function PortalOverlay({ onComplete }: PortalOverlayProps) {
  useEffect(() => {
    const id = setTimeout(onComplete, 2500);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'rgba(2,6,14,0.97)', animation: 'portalFadeIn 0.4s ease-out' }}
    >
      {/* Expanding rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 0.6, 1.2].map((delay) => (
          <div
            key={delay}
            className="absolute rounded-full border border-cyan-400/50"
            style={{
              width: 200,
              height: 200,
              animation: `ringExpand 2.5s ease-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="text-center relative z-10">
        <div
          className="text-4xl md:text-6xl font-bold font-mono mb-3"
          style={{
            color: '#38BDF8',
            textShadow: '0 0 40px #38BDF8, 0 0 80px #38BDF8',
            animation: 'portalPulse 0.9s ease-in-out infinite alternate',
          }}
        >
          PORTAL OPEN
        </div>
        <div
          className="text-[#A855F7] font-mono text-sm tracking-[0.3em]"
          style={{ animation: 'portalPulse 1.3s ease-in-out infinite alternate' }}
        >
          制作物宇宙へ転送中...
        </div>
      </div>

      <style>{`
        @keyframes portalFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes portalPulse  { from { opacity: 0.6 } to { opacity: 1 } }
        @keyframes ringExpand {
          0%   { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(5);   opacity: 0; }
        }
      `}</style>
    </div>
  );
}
