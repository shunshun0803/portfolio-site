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
      style={{ background: 'rgba(5,5,12,0.97)', animation: 'portalFadeIn 0.4s steps(2)' }}
    >
      {/* Expanding square rings (pixel warp) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 0.6, 1.2].map((delay) => (
          <div
            key={delay}
            className="absolute"
            style={{
              width: 200,
              height: 200,
              border: '4px solid #FFD200',
              animation: `ringExpand 2.5s steps(12) ${delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="text-center relative z-10">
        <div
          className="font-pixel text-2xl md:text-4xl mb-4 text-glow-yellow"
          style={{ color: '#FFD200', animation: 'portalPulse 0.4s steps(1) infinite alternate' }}
        >
          PORTAL OPEN
        </div>
        <div
          className="font-pixel text-[10px] text-[#FF7A18] tracking-[0.3em]"
          style={{ animation: 'portalPulse 0.6s steps(1) infinite alternate' }}
        >
          制作物宇宙へ転送中...
        </div>
      </div>

      <style>{`
        @keyframes portalFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes portalPulse  { from { opacity: 0.5 } to { opacity: 1 } }
        @keyframes ringExpand {
          0%   { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(5);   opacity: 0; }
        }
      `}</style>
    </div>
  );
}
