import { useEffect, useRef, useState } from 'react';
import { projects, type Project } from '../../data/projects';

interface ExploreGameProps {
  onExit: () => void;
}

const PLANET_DEFS = [
  { id: 'soulslike-boss',   rx: 0.25, ry: 0.32, label: 'Soulslike Boss',   color: '#38BDF8', radius: 38 },
  { id: 'game-ai-research', rx: 0.75, ry: 0.58, label: 'Game AI Research',  color: '#A855F7', radius: 38 },
  { id: 'portfolio-site',   rx: 0.5,  ry: 0.78, label: 'Portfolio Site',    color: '#22C55E', radius: 38 },
];

const STAR_COUNT  = 280;
const DEBRIS_COUNT = 18;
const APPROACH_DIST = 110;
const MAX_SPEED = 4.5;
const FRICTION  = 0.93;
const ACCEL     = 0.35;

export function ExploreGame({ onExit }: ExploreGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nearProject, setNearProject] = useState<Project | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    // Stars (fixed positions, created once)
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.7 + 0.15,
    }));

    // Debris — drifting remnants from the boss
    const debris = Array.from({ length: DEBRIS_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2.5 + 0.8,
      color: Math.random() > 0.5 ? '#38BDF8' : '#A855F7',
      a: Math.random() * 0.5 + 0.15,
    }));

    // Player state
    const player = { x: W / 2, y: H / 2, vx: 0, vy: 0, angle: -Math.PI / 2 };
    const keys: Record<string, boolean> = {};

    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === 'Escape') onExit();
    };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let rafId: number;
    let prevNearId: string | null = null;

    const loop = (now: number) => {

      // Player input
      const left  = keys['ArrowLeft']  || keys['KeyA'];
      const right = keys['ArrowRight'] || keys['KeyD'];
      const up    = keys['ArrowUp']    || keys['KeyW'];
      const down  = keys['ArrowDown']  || keys['KeyS'];

      if (left)  player.vx -= ACCEL;
      if (right) player.vx += ACCEL;
      if (up)    player.vy -= ACCEL;
      if (down)  player.vy += ACCEL;

      const spd = Math.hypot(player.vx, player.vy);
      if (spd > MAX_SPEED) {
        player.vx = (player.vx / spd) * MAX_SPEED;
        player.vy = (player.vy / spd) * MAX_SPEED;
      }
      player.vx *= FRICTION;
      player.vy *= FRICTION;

      player.x = ((player.x + player.vx) % W + W) % W;
      player.y = ((player.y + player.vy) % H + H) % H;

      if (spd > 0.15) {
        player.angle = Math.atan2(player.vy, player.vx) + Math.PI / 2;
      }

      // Debris drift
      debris.forEach((d) => {
        d.x = ((d.x + d.vx) % W + W) % W;
        d.y = ((d.y + d.vy) % H + H) % H;
      });

      // ── Draw ──
      ctx.fillStyle = '#04080f';
      ctx.fillRect(0, 0, W, H);

      // Stars
      stars.forEach((s) => {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Debris glow
      debris.forEach((d) => {
        ctx.globalAlpha = d.a;
        ctx.shadowColor = d.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;

      // Planets
      const t = now / 1000;
      PLANET_DEFS.forEach((p) => {
        const px = p.rx * W;
        const py = p.ry * H;
        const pulse = 1 + Math.sin(t * 1.4) * 0.12;

        // Outer glow
        const grad = ctx.createRadialGradient(px, py, p.radius * 0.6, px, py, p.radius * 2.8 * pulse);
        grad.addColorStop(0, p.color + '55');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 2.8 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 24;
        ctx.fillStyle = p.color + '30';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = '11px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.textAlign = 'center';
        ctx.fillText(p.label, px, py + p.radius + 18);
      });

      // Proximity check
      let newNearId: string | null = null;
      PLANET_DEFS.forEach((p) => {
        const dx = player.x - p.rx * W;
        const dy = player.y - p.ry * H;
        if (Math.hypot(dx, dy) < APPROACH_DIST) newNearId = p.id;
      });
      if (newNearId !== prevNearId) {
        prevNearId = newNearId;
        setNearProject(newNearId ? (projects.find((pr) => pr.id === newNearId) ?? null) : null);
      }

      // Player ship
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#38BDF8';
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(-8,  10);
      ctx.lineTo( 0,   5);
      ctx.lineTo( 8,  10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Engine glow
      ctx.shadowColor = '#A855F7';
      ctx.fillStyle = '#A855F7';
      ctx.beginPath();
      ctx.arc(0, 7, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      rafId = requestAnimationFrame(loop);

    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
    };
  }, [onExit]);

  const near = nearProject;

  return (
    <div className="fixed inset-0 z-50" style={{ background: '#04080f' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Top hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="text-[10px] font-mono text-[#38BDF8]/60 bg-black/40 px-4 py-1.5 rounded-full tracking-wider">
          WASD / ↑↓←→ で移動　惑星に接近するとプロジェクト情報が表示される
        </div>
      </div>

      {/* Exit */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 text-[10px] font-mono text-[#94A3B8] hover:text-white transition-colors px-3 py-1.5 border border-white/20 rounded bg-black/50"
      >
        ポートフォリオに戻る [ESC]
      </button>

      {/* Project panel */}
      {near && (
        <div
          key={near.id}
          className="absolute bottom-0 left-0 right-0"
          style={{
            background: 'linear-gradient(to top, rgba(4,8,15,0.97) 70%, transparent)',
            animation: 'panelSlideUp 0.3s ease-out',
            padding: '2rem 1.5rem 1.5rem',
          }}
        >
          <div className="max-w-xl mx-auto">
            <div className="text-[10px] font-mono text-[#38BDF8] mb-1 tracking-widest">// PLANET DISCOVERED</div>
            <div className="text-lg font-bold text-white mb-1">{near.title}</div>
            <div className="text-[#94A3B8] text-sm leading-relaxed mb-3">{near.description}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {near.tech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded font-mono"
                  style={{ background: '#38BDF820', color: '#38BDF8', border: '1px solid #38BDF840' }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              {near.githubUrl && near.githubUrl.length > 0 && (
                <a href={near.githubUrl} target="_blank" rel="noopener noreferrer"
                   className="text-xs font-mono text-[#38BDF8] hover:underline">
                  GitHub ↗
                </a>
              )}
              {near.demoUrl && near.demoUrl.length > 0 && (
                <a href={near.demoUrl} target="_blank" rel="noopener noreferrer"
                   className="text-xs font-mono text-[#A855F7] hover:underline">
                  Demo ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes panelSlideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
