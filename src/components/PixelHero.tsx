import { useEffect, useRef, useState } from 'react';
import { INVADER_A, INVADER_B, drawSprite } from '../utils/sprites';

interface Bullet { x: number; y: number; }
interface Star   { x: number; y: number; z: number; }
interface Spark  { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; }

const COLS = 6, ROWS = 3;
const TOTAL = COLS * ROWS;
const SCORE_PER_KILL = 100;
const HI_KEY = 'pixelhero-hiscore';
const CLEAR_HOLD = 2.0; // seconds the secret message stays up

const pad6 = (n: number) => n.toString().padStart(6, '0').slice(-6);

/**
 * Self-contained pixel-art hero canvas running an ATTRACT-MODE demo:
 * the cannon auto-targets invaders, shots blow them up (score ticks up),
 * and clearing the wave flashes a secret message before respawning.
 * Pure 2D canvas — no WebGL, no user input required.
 */
export function PixelHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement!;

    const resize = () => {
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Starfield (3 depths)
    const stars: Star[] = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random() * 0.7 + 0.3,
    }));

    // Invader alive-state + explosion sparks
    const alive: boolean[] = Array.from({ length: TOTAL }, () => true);
    const bullets: Bullet[] = [];
    const sparks: Spark[] = [];

    // Score (mutable, synced to React state on change)
    let scoreVal = 0;
    let hiVal = 0;
    try { hiVal = parseInt(localStorage.getItem(HI_KEY) || '0', 10) || 0; } catch { hiVal = 0; }
    setHi(hiVal);

    // Loop state
    let last = performance.now();
    let fireTimer = 0;
    let frameFlip = 0, flipTimer = 0;
    let shipX = 0.5;              // normalized cannon position
    let targetIdx = -1;          // currently targeted invader index
    let phase: 'play' | 'cleared' = 'play';
    let clearTimer = 0;
    let raf = 0;

    // Layout for a given frame; returns geometry + per-invader position helper
    const layout = (t: number, px: number) => {
      const invW = 11 * px, invH = 8 * px;
      const gapX = invW * 1.6, gapY = invH * 1.9;
      const gridW = (COLS - 1) * gapX + invW;
      const startX = (W - gridW) / 2 + Math.sin(t * 0.6) * px * 3;
      const startY = H * 0.16;
      return { invW, invH, gapX, gapY, startX, startY };
    };

    const bumpScore = (delta: number) => {
      scoreVal += delta;
      setScore(scoreVal);
      if (scoreVal > hiVal) {
        hiVal = scoreVal;
        setHi(hiVal);
        try { localStorage.setItem(HI_KEY, String(hiVal)); } catch { /* ignore */ }
      }
    };

    const explode = (cx: number, cy: number) => {
      const palette = ['#FFD200', '#FF7A18', '#FFFFFF', '#FF4040'];
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 2.4 + 0.6;
        const life = 0.4 + Math.random() * 0.4;
        sparks.push({
          x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          life, max: life, color: palette[(Math.random() * palette.length) | 0],
        });
      }
    };

    const respawn = () => { for (let i = 0; i < TOTAL; i++) alive[i] = true; };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      const px = Math.max(2, Math.round(Math.min(W, H) / 90));
      const { invW, invH, gapX, gapY, startX, startY } = layout(t, px);

      const invPos = (idx: number) => {
        const c = idx % COLS, r = (idx / COLS) | 0;
        return {
          ox: startX + c * gapX,
          oy: startY + r * gapY + Math.sin(t * 1.5 + c * 0.5) * px,
        };
      };

      // animation flip
      flipTimer += dt;
      if (flipTimer > 0.55) { frameFlip ^= 1; flipTimer = 0; }

      const shipY = H * 0.86;

      if (phase === 'play') {
        // pick / validate a target among the living
        if (targetIdx < 0 || !alive[targetIdx]) {
          const living = alive.map((a, i) => (a ? i : -1)).filter((i) => i >= 0);
          targetIdx = living.length ? living[(Math.random() * living.length) | 0] : -1;
        }
        // steer cannon under its target
        let targetX = 0.5 + Math.sin(t * 0.8) * 0.2;
        if (targetIdx >= 0) targetX = invPos(targetIdx).ox / W + (invW / 2) / W;
        shipX += (targetX - shipX) * Math.min(1, dt * 3.2);

        // auto-fire
        fireTimer += dt;
        if (fireTimer > 0.42) {
          fireTimer = 0;
          bullets.push({ x: shipX * W, y: shipY - px * 4 });
        }
      }

      // advance bullets + collision (only while playing)
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= dt * H * 1.0;
        if (b.y < -px * 4) { bullets.splice(i, 1); continue; }
        if (phase !== 'play') continue;
        for (let idx = 0; idx < TOTAL; idx++) {
          if (!alive[idx]) continue;
          const { ox, oy } = invPos(idx);
          if (b.x >= ox && b.x <= ox + invW && b.y >= oy && b.y <= oy + invH) {
            alive[idx] = false;
            bullets.splice(i, 1);
            explode(ox + invW / 2, oy + invH / 2);
            bumpScore(SCORE_PER_KILL);
            break;
          }
        }
      }

      // wave cleared?
      if (phase === 'play' && !alive.some(Boolean)) {
        phase = 'cleared';
        clearTimer = 0;
        bullets.length = 0;
      }
      if (phase === 'cleared') {
        clearTimer += dt;
        if (clearTimer >= CLEAR_HOLD) { respawn(); phase = 'play'; targetIdx = -1; }
      }

      // advance sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vx *= 0.92; s.vy *= 0.92;
        s.life -= dt;
        if (s.life <= 0) sparks.splice(i, 1);
      }

      // ── draw ──────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // stars
      for (const s of stars) {
        s.y += dt * s.z * 0.06;
        if (s.y > 1) { s.y = 0; s.x = Math.random(); }
        const size = s.z > 0.75 ? 2 : 1;
        ctx.globalAlpha = 0.25 + s.z * 0.5;
        ctx.fillStyle = s.z > 0.75 ? '#FFD200' : '#F5F1E0';
        ctx.fillRect(Math.round(s.x * W), Math.round(s.y * H), size, size);
      }
      ctx.globalAlpha = 1;

      // invaders (living only)
      const sprite = frameFlip ? INVADER_B : INVADER_A;
      for (let idx = 0; idx < TOTAL; idx++) {
        if (!alive[idx]) continue;
        const r = (idx / COLS) | 0;
        const color = r % 2 === 0 ? '#FFD200' : '#FF7A18';
        const { ox, oy } = invPos(idx);
        drawSprite(ctx, sprite, px, ox, oy, color);
      }

      // sparks (pixel squares)
      for (const s of sparks) {
        ctx.globalAlpha = Math.max(0, s.life / s.max);
        ctx.fillStyle = s.color;
        const sz = Math.max(2, Math.round(px * 0.7 * (s.life / s.max)));
        ctx.fillRect(s.x | 0, s.y | 0, sz, sz);
      }
      ctx.globalAlpha = 1;

      // bullets
      ctx.fillStyle = '#FF4040';
      for (const b of bullets) ctx.fillRect(Math.round(b.x - px / 2), Math.round(b.y), Math.max(2, px / 1.5), px * 3);

      // player cannon
      const shipPxX = shipX * W;
      ctx.fillStyle = '#F5F1E0';
      const bw = px * 13, bh = px * 2;
      ctx.fillRect(shipPxX - bw / 2, shipY, bw, bh);
      ctx.fillRect(shipPxX - px * 3, shipY - px * 2, px * 6, px * 2);
      ctx.fillStyle = '#FFD200';
      ctx.fillRect(shipPxX - px, shipY - px * 4, px * 2, px * 2);

      // secret message on clear
      if (phase === 'cleared') {
        const blink = Math.floor(clearTimer * 4) % 2 === 0;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FF7A18';
        ctx.font = `${Math.max(8, Math.round(px * 3))}px "Press Start 2P", monospace`;
        ctx.fillText('STAGE CLEAR', W / 2, H * 0.42);
        if (blink) {
          ctx.fillStyle = '#FFD200';
          ctx.font = `${Math.max(9, Math.round(px * 3.6))}px "Press Start 2P", monospace`;
          ctx.fillText('THANKS FOR', W / 2, H * 0.54);
          ctx.fillText('PLAYING!', W / 2, H * 0.62);
        }
        ctx.textAlign = 'left';
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-full relative pixel-panel" style={{ borderColor: 'var(--yellow)', background: '#05050c' }}>
      <canvas ref={canvasRef} className="block w-full h-full pixelated" />
      {/* Arcade HUD */}
      <div className="absolute top-2 left-3 pointer-events-none leading-tight">
        <div className="font-pixel text-[8px] text-[#FFD200] opacity-80">1UP</div>
        <div className="font-pixel text-[10px] text-[#F5F1E0]">{pad6(score)}</div>
      </div>
      <div className="absolute top-2 right-3 text-right pointer-events-none leading-tight">
        <div className="font-pixel text-[8px] text-[#FF7A18] opacity-80 animate-blink">HI-SCORE</div>
        <div className="font-pixel text-[10px] text-[#F5F1E0]">{pad6(hi)}</div>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-[#B7B29A] opacity-70 pointer-events-none">
        SHUNSHUN0803
      </div>
    </div>
  );
}
