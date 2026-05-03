import { useEffect, useRef, useState } from 'react';
import { projects } from '../../data/projects';
import { skillCategories } from '../../data/skills';
import { socialLinks } from '../../data/links';
import type { BossStats } from './BossGame';

interface ExploreGameProps {
  onExit:    () => void;
  bossStats: BossStats | null;
}

type PlanetId = 'about' | 'skills' | 'research' | 'contact' | `works-${number}`;

interface PlanetDef {
  id: PlanetId; label: string; number: string;
  color: string; wx: number; wy: number; radius: number; dim?: boolean;
}

interface Snippet { text: string; wx: number; wy: number; vx: number; vy: number; }

const WORLD_W    = 3000;
const WORLD_H    = 2000;
const STAR_COUNT = 600;
const APPROACH_D = 170;
const MAX_SPEED  = 5;
const FRICTION   = 0.92;
const ACCEL      = 0.38;

// Keys that should not propagate to background UI
const GAME_KEYS = new Set([
  'ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
  'KeyA','KeyS','KeyD','KeyW','Enter','Escape','Space',
]);

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

const worksPlanets: PlanetDef[] = projects.map((_, i) => {
  const n = projects.length;
  const t = n <= 1 ? 0.5 : i / (n - 1);
  return {
    id: `works-${i}` as PlanetId,
    label: `PROJ.${ROMAN[i] ?? String(i + 1)}`,
    number: '02',
    color: '#F97316',
    wx: Math.round(2080 + t * 500),
    wy: Math.round(380  + t * 680),
    radius: Math.round(46 + t * 32),
    dim: i === 0 && n > 1,
  };
});

const PLANET_DEFS: PlanetDef[] = [
  { id:'about',    label:'ABOUT',    number:'01', color:'#38BDF8', wx: 480, wy: 680, radius:70 },
  { id:'research', label:'RESEARCH', number:'04', color:'#22C55E', wx: 560, wy:1380, radius:66 },
  { id:'skills',   label:'SKILLS',   number:'03', color:'#A855F7', wx:1480, wy:1680, radius:62 },
  ...worksPlanets,
  { id:'contact',  label:'CONTACT',  number:'05', color:'#EC4899', wx:2620, wy:1640, radius:56 },
];

const SECTION_TITLES: Partial<Record<PlanetId, string>> = {
  about:'自己紹介', skills:'スキル', research:'研究・開発', contact:'お問い合わせ',
};

const SKILL_COLORS: Record<string, string> = {
  cyan:'#0EA5E9', purple:'#A855F7', green:'#16A34A', orange:'#EA580C',
};

const SHIP_COLORS      = ['#38BDF8', '#A855F7', '#FFD700'];
const SHIP_NAMES       = ['CYAN', 'PURPLE', 'GOLD'];
const SHIP_THRESHOLDS  = [0, 10, 30];

const CODE_SNIPPETS = [
  'animator.SetBool("isAttacking", true)',
  'NavMesh.CalculatePath(target, path)',
  'StartCoroutine(HitStop(0.08f))',
  'useFrame((state) => { ... })',
  'boss.barHp -= bullet.damage',
  'Cinemachine.GenerateImpulse()',
  'Physics.Raycast(origin, dir, out hit)',
  'AudioSource.PlayOneShot(clip)',
  'ctx.arc(x, y, r, 0, Math.PI * 2)',
  'const [gameMode, setGameMode]',
  'SetTrigger("Death")',
  'agent.SetDestination(target.position)',
  'Instantiate(prefab, pos, rot)',
  'rb.AddForce(direction * force)',
  'OnStateEnter(Animator anim, ...)',
];

export function ExploreGame({ onExit, bossStats }: ExploreGameProps) {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const nearRef         = useRef<PlanetId | null>(null);
  const landedRef       = useRef<PlanetId | null>(null);
  const scanRef         = useRef<Partial<Record<PlanetId, number>>>({});
  const scanCompleteRef = useRef(false);
  const visitedRef      = useRef<Set<PlanetId>>(new Set());
  const readyRef        = useRef(false); // ignore key events until fully mounted

  const [nearPlanetId,   setNearPlanetId]   = useState<PlanetId | null>(null);
  const [landedPlanetId, setLandedPlanetId] = useState<PlanetId | null>(null);
  const [scanComplete,   setScanComplete]   = useState(false);
  const [revealCount,    setRevealCount]    = useState(0);

  const graze     = bossStats?.graze ?? 0;
  const shipTier  = graze < SHIP_THRESHOLDS[1] ? 0 : graze < SHIP_THRESHOLDS[2] ? 1 : 2;
  const shipColor = SHIP_COLORS[shipTier];
  const speedMult = shipTier >= 2 ? 1.2 : 1.0;

  const closeLanding = () => { landedRef.current = null; setLandedPlanetId(null); };

  // Typing reveal
  useEffect(() => {
    if (!landedPlanetId) return;
    setRevealCount(0);
    const id = setInterval(() => setRevealCount(c => c + 1), 280);
    return () => clearInterval(id);
  }, [landedPlanetId]);

  // ── Game loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Blur any focused background element to prevent key events triggering it
    (document.activeElement as HTMLElement | null)?.blur();

    // Delay input acceptance to avoid carried-over key presses
    const readyTimer = setTimeout(() => { readyRef.current = true; }, 600);

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const onResize = () => { W=window.innerWidth; H=window.innerHeight; canvas.width=W; canvas.height=H; };
    window.addEventListener('resize', onResize);

    // Stars in world space
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random()*WORLD_W, y: Math.random()*WORLD_H,
      r: Math.random()*1.4+0.2, a: Math.random()*0.7+0.15,
    }));

    // Shooting-star code snippets (diagonal, with trail)
    const snippets: Snippet[] = CODE_SNIPPETS.map(text => {
      const spd   = 1.6 + Math.random() * 2.2;
      const angle = Math.PI * 0.38 + (Math.random() - 0.5) * 0.28; // ~55-75° from horizontal
      return {
        text,
        wx: Math.random() * WORLD_W,
        wy: Math.random() * WORLD_H,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
      };
    });

    const player = { x: WORLD_W/2, y: WORLD_H/2, vx:0, vy:0, angle:-Math.PI/2 };
    const cam    = { x: WORLD_W/2, y: WORLD_H/2 };
    const keys: Record<string, boolean> = {};
    const sm = speedMult;

    const onKeyDown = (e: KeyboardEvent) => {
      if (GAME_KEYS.has(e.code)) e.preventDefault();
      if (!readyRef.current) return;
      keys[e.code] = true;
      if (e.code === 'Escape') {
        if (landedRef.current) { landedRef.current=null; setLandedPlanetId(null); }
        else onExit();
        return;
      }
      if (e.code === 'Enter' && nearRef.current && !landedRef.current) {
        if ((scanRef.current[nearRef.current] ?? 0) >= 1) {
          const id = nearRef.current;
          landedRef.current = id;
          visitedRef.current.add(id);
          setLandedPlanetId(id);
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);

    let rafId: number;

    const loop = (now: number) => {
      const t = now / 1000;

      // Movement
      if (!landedRef.current) {
        if (keys['ArrowLeft']  || keys['KeyA']) player.vx -= ACCEL*sm;
        if (keys['ArrowRight'] || keys['KeyD']) player.vx += ACCEL*sm;
        if (keys['ArrowUp']    || keys['KeyW']) player.vy -= ACCEL*sm;
        if (keys['ArrowDown']  || keys['KeyS']) player.vy += ACCEL*sm;
        const spd    = Math.hypot(player.vx, player.vy);
        const maxSpd = MAX_SPEED*sm;
        if (spd > maxSpd) { player.vx=(player.vx/spd)*maxSpd; player.vy=(player.vy/spd)*maxSpd; }
        player.vx *= FRICTION; player.vy *= FRICTION;
        player.x = Math.max(50, Math.min(WORLD_W-50, player.x+player.vx));
        player.y = Math.max(50, Math.min(WORLD_H-50, player.y+player.vy));
        if (Math.hypot(player.vx, player.vy) > 0.15)
          player.angle = Math.atan2(player.vy, player.vx) + Math.PI/2;
      }

      // Camera
      cam.x += (player.x - cam.x) * 0.08;
      cam.y += (player.y - cam.y) * 0.08;
      if (WORLD_W > W) cam.x = Math.max(W/2, Math.min(WORLD_W-W/2, cam.x)); else cam.x = WORLD_W/2;
      if (WORLD_H > H) cam.y = Math.max(H/2, Math.min(WORLD_H-H/2, cam.y)); else cam.y = WORLD_H/2;

      // Snippet shooting-star movement
      snippets.forEach(s => {
        s.wx += s.vx; s.wy += s.vy;
        if (s.wy > WORLD_H+80 || s.wx > WORLD_W+300 || s.wx < -300) {
          s.wy = -50; s.wx = Math.random() * WORLD_W;
        }
      });

      // Proximity & scan
      if (!landedRef.current) {
        let newNear: PlanetId | null = null;
        for (const p of PLANET_DEFS) {
          if (Math.hypot(player.x-p.wx, player.y-p.wy) < APPROACH_D) { newNear=p.id; break; }
        }
        if (newNear) {
          const prev = scanRef.current[newNear] ?? 0;
          const next = Math.min(1, prev + 0.008);
          scanRef.current[newNear] = next;
          if (!scanCompleteRef.current && next >= 1) {
            scanCompleteRef.current = true; setScanComplete(true);
          }
        }
        if (newNear !== nearRef.current) {
          nearRef.current = newNear; setNearPlanetId(newNear);
          const done = newNear ? (scanRef.current[newNear]??0) >= 1 : false;
          scanCompleteRef.current = done; setScanComplete(done);
        }
      }

      // ── Draw ──────────────────────────────────────────────────────
      ctx.fillStyle='#04080f'; ctx.fillRect(0,0,W,H);

      ctx.save();
      ctx.translate(W/2 - cam.x, H/2 - cam.y);

      // Stars
      stars.forEach(s => {
        ctx.globalAlpha=s.a; ctx.fillStyle='#ffffff';
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha=1;

      // Works timeline connector
      const wNodes = PLANET_DEFS.filter(p => p.id.startsWith('works'));
      ctx.strokeStyle='#F9731660'; ctx.lineWidth=2; ctx.setLineDash([8,10]);
      ctx.beginPath();
      wNodes.forEach((p,i) => i===0?ctx.moveTo(p.wx,p.wy):ctx.lineTo(p.wx,p.wy));
      ctx.stroke(); ctx.setLineDash([]);

      // Shooting-star code snippets
      snippets.forEach(s => {
        const dist  = Math.hypot(s.wx-player.x, s.wy-player.y);
        const close = dist < 280;
        const alpha = close ? 0.92 : 0.62;
        const spd   = Math.hypot(s.vx, s.vy) || 1;
        const nx = s.vx/spd, ny = s.vy/spd;
        const tLen  = 55;

        // Gradient trail
        const grd = ctx.createLinearGradient(s.wx, s.wy, s.wx-nx*tLen, s.wy-ny*tLen);
        grd.addColorStop(0, `rgba(56,189,248,${alpha})`);
        grd.addColorStop(1, 'rgba(56,189,248,0)');
        ctx.strokeStyle=grd; ctx.lineWidth=close?2:1.2;
        ctx.shadowColor='#38BDF8'; ctx.shadowBlur=close?12:5;
        ctx.beginPath(); ctx.moveTo(s.wx,s.wy); ctx.lineTo(s.wx-nx*tLen, s.wy-ny*tLen); ctx.stroke();
        ctx.shadowBlur=0;

        // Text at head
        ctx.globalAlpha=alpha*0.95;
        ctx.font='10px monospace'; ctx.fillStyle='#38BDF8';
        ctx.fillText(s.text, s.wx+3, s.wy-2);
        ctx.globalAlpha=1;
      });

      // Planets
      PLANET_DEFS.forEach(p => {
        const isNear  = nearRef.current===p.id;
        const scan    = scanRef.current[p.id]??0;
        const visited = visitedRef.current.has(p.id);
        const baseA   = p.dim ? 0.62 : 1.0;
        const pulse   = 1+Math.sin(t*1.4)*0.07;

        ctx.globalAlpha=baseA;

        // Glow
        const gr=ctx.createRadialGradient(p.wx,p.wy,p.radius*.5,p.wx,p.wy,p.radius*3.2*pulse);
        gr.addColorStop(0,p.color+'44'); gr.addColorStop(1,'transparent');
        ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(p.wx,p.wy,p.radius*3.2*pulse,0,Math.PI*2); ctx.fill();

        // Decorations
        ctx.save(); ctx.translate(p.wx,p.wy);
        if (p.id==='about') {
          ctx.save(); ctx.rotate(t*.4);
          ctx.strokeStyle=p.color+'55'; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.ellipse(0,0,p.radius*1.7,p.radius*.28,0,0,Math.PI*2); ctx.stroke();
          ctx.restore();
        } else if (p.id.startsWith('works')) {
          const wi=parseInt(p.id.slice(6)), or=p.radius*(1.5+wi*.14);
          ctx.strokeStyle=p.color+'40'; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(0,0,or,0,Math.PI*2); ctx.stroke();
          const sa=t*Math.max(0.1, .45-wi*.08);
          ctx.shadowColor=p.color; ctx.shadowBlur=6; ctx.fillStyle=p.color+'CC';
          ctx.beginPath(); ctx.arc(Math.cos(sa)*or,Math.sin(sa)*or,2.5,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0;
        } else if (p.id==='skills') {
          ctx.strokeStyle=p.color+'28'; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(0,0,p.radius*1.6,0,Math.PI*2); ctx.stroke();
          for (let i=0;i<6;i++){
            const ha=(i/6)*Math.PI*2+t*.22;
            ctx.fillStyle=p.color+'66';
            ctx.beginPath(); ctx.arc(Math.cos(ha)*p.radius*1.6,Math.sin(ha)*p.radius*1.6,2,0,Math.PI*2); ctx.fill();
          }
        } else if (p.id==='research') {
          ctx.strokeStyle=p.color+'40'; ctx.lineWidth=1; ctx.setLineDash([5,6]);
          ctx.beginPath(); ctx.arc(0,0,p.radius*1.85,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
          const sa=t*.22; ctx.shadowColor=p.color; ctx.shadowBlur=8; ctx.fillStyle=p.color;
          ctx.beginPath(); ctx.arc(Math.cos(sa)*p.radius*1.85,Math.sin(sa)*p.radius*1.85,3,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0;
        } else if (p.id==='contact') {
          for (let ri=0;ri<3;ri++){
            const ph=((t*.55+ri*.333)%1);
            ctx.globalAlpha=baseA*(1-ph)*.38;
            ctx.strokeStyle=p.color; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.arc(0,0,p.radius*(1.1+ph*2),0,Math.PI*2); ctx.stroke();
          }
          ctx.globalAlpha=baseA;
        }
        ctx.restore();

        // Body
        ctx.shadowColor=p.color; ctx.shadowBlur=isNear?44:24;
        ctx.fillStyle=p.color+'28'; ctx.strokeStyle=p.color;
        ctx.lineWidth=isNear?3.5:visited?2.5:2;
        ctx.beginPath(); ctx.arc(p.wx,p.wy,p.radius,0,Math.PI*2); ctx.fill(); ctx.stroke();
        if (visited) {
          ctx.strokeStyle=p.color+'60'; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(p.wx,p.wy,p.radius+9,0,Math.PI*2); ctx.stroke();
        }
        ctx.shadowBlur=0;

        // Scan bar
        if (scan>0 && scan<1 && isNear) {
          const bw=90, bh=5, bx=p.wx-bw/2, by=p.wy+p.radius+30;
          ctx.fillStyle='#ffffff15'; ctx.fillRect(bx,by,bw,bh);
          ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=8;
          ctx.fillRect(bx,by,bw*scan,bh); ctx.shadowBlur=0;
          ctx.font='9px monospace'; ctx.fillStyle=p.color+'CC';
          ctx.textAlign='center'; ctx.globalAlpha=.8;
          ctx.fillText('SCANNING...', p.wx, by+17); ctx.globalAlpha=baseA;
        }

        // Blinking ring
        if (scan>=1 && isNear) {
          const blink=.55+.45*Math.sin(t*7);
          ctx.globalAlpha=baseA*(.35+blink*.5);
          ctx.strokeStyle=p.color; ctx.lineWidth=1.5; ctx.setLineDash([6,4]);
          ctx.beginPath(); ctx.arc(p.wx,p.wy,p.radius+16+Math.sin(t*4)*3,0,Math.PI*2); ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.globalAlpha=1;

        // Label
        const labelY = p.wy + ((scan>0&&scan<1&&isNear) ? p.radius+50 : p.radius+26);
        ctx.font=`${p.dim?'10':'11'}px monospace`;
        ctx.fillStyle=visited ? p.color+'CC' : 'rgba(255,255,255,0.72)';
        ctx.textAlign='center';
        ctx.fillText(`// ${p.number}.${p.label.toLowerCase()}`, p.wx, labelY);
        ctx.textAlign='left';
      });

      // Player ship
      if (!landedRef.current) {
        const sc=shipColor;
        ctx.save(); ctx.translate(player.x,player.y); ctx.rotate(player.angle);
        ctx.shadowColor=sc; ctx.shadowBlur=20;
        ctx.fillStyle=sc; ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(-8,10); ctx.lineTo(0,5); ctx.lineTo(8,10);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.shadowColor='#ffffff55'; ctx.fillStyle='#ffffff80';
        ctx.beginPath(); ctx.arc(0,7,2.5,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.restore();
      }

      ctx.restore(); // end world transform

      // ── Minimap (screen space) ──────────────────────────────────
      const MM_W=162, MM_H=104, MM_X=W-MM_W-14, MM_Y=H-MM_H-14;
      const mmSX=MM_W/WORLD_W, mmSY=MM_H/WORLD_H;
      ctx.fillStyle='rgba(4,8,15,0.78)'; ctx.fillRect(MM_X,MM_Y,MM_W,MM_H);
      ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=1; ctx.strokeRect(MM_X,MM_Y,MM_W,MM_H);
      ctx.strokeStyle='#F9731638'; ctx.lineWidth=.8; ctx.setLineDash([3,5]);
      ctx.beginPath();
      wNodes.forEach((p,i)=>{
        i===0?ctx.moveTo(MM_X+p.wx*mmSX,MM_Y+p.wy*mmSY):ctx.lineTo(MM_X+p.wx*mmSX,MM_Y+p.wy*mmSY);
      });
      ctx.stroke(); ctx.setLineDash([]);
      PLANET_DEFS.forEach(p=>{
        const mx=MM_X+p.wx*mmSX, my=MM_Y+p.wy*mmSY;
        const vis=visitedRef.current.has(p.id);
        ctx.globalAlpha=vis?.92:.30; ctx.fillStyle=p.color;
        if (vis){ctx.shadowColor=p.color; ctx.shadowBlur=5;}
        ctx.beginPath(); ctx.arc(mx,my,vis?3.5:2.2,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      });
      ctx.globalAlpha=1;
      const pmx=MM_X+player.x*mmSX, pmy=MM_Y+player.y*mmSY;
      ctx.fillStyle='#ffffff'; ctx.shadowColor='#ffffff'; ctx.shadowBlur=7;
      ctx.beginPath(); ctx.arc(pmx,pmy,2.5,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      ctx.font='8px monospace'; ctx.fillStyle='rgba(255,255,255,0.28)';
      ctx.fillText('STAR MAP', MM_X+4, MM_Y+10);

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(readyTimer);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      window.removeEventListener('resize',  onResize);
    };
  }, [onExit, shipColor, speedMult]);

  // ── Panel helpers ────────────────────────────────────────────────
  const landedDef  = PLANET_DEFS.find(p => p.id===landedPlanetId);
  const worksIdx   = landedPlanetId?.startsWith('works-') ? parseInt(landedPlanetId.slice(6)) : -1;
  const project    = worksIdx>=0 ? projects[worksIdx]??null : null;
  const panelTitle = project ? project.title : (landedPlanetId ? SECTION_TITLES[landedPlanetId]??'' : '');
  const panelNum   = landedDef ? (worksIdx>=0 ? `02-${ROMAN[worksIdx] ?? String(worksIdx+1)}` : landedDef.number) : '';

  const formatTime = (frames: number) => {
    const s=Math.floor(frames/60), m=Math.floor(s/60);
    return m>0 ? `${m}:${String(s%60).padStart(2,'0')}` : `${s}s`;
  };
  const starRating = (g: number) => {
    const n=g<5?1:g<15?2:g<30?3:g<60?4:5;
    return '★'.repeat(n)+'☆'.repeat(5-n);
  };
  const show = (i: number) => i < revealCount;

  return (
    <div className="fixed inset-0 z-50" style={{ background:'#04080f' }}>
      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'100%' }} />

      {/* Top hint */}
      {!landedPlanetId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="text-[10px] font-mono text-[#38BDF8]/60 bg-black/40 px-4 py-1.5 rounded-full tracking-wider">
            WASD / ↑↓←→ で移動　惑星に近づいてスキャン → ENTER で着陸
          </div>
        </div>
      )}

      {/* Exit */}
      {!landedPlanetId && (
        <button onClick={onExit}
          className="absolute top-4 right-4 text-[10px] font-mono text-[#CBD5E1] hover:text-white transition-colors px-3 py-1.5 border border-white/20 rounded bg-black/50">
          ポートフォリオに戻る [ESC]
        </button>
      )}

      {/* Pilot status overlay */}
      {bossStats && !landedPlanetId && (
        <div className="absolute top-14 left-4 font-mono bg-black/60 border border-white/10 rounded-xl px-4 py-3"
          style={{ borderColor: shipColor+'25' }}>
          <div className="text-[9px] tracking-widest mb-2" style={{ color: shipColor }}>
            PILOT STATUS
          </div>
          <div className="flex items-start gap-4">
            <svg width="14" height="20" viewBox="-8 -14 16 26" className="mt-0.5 shrink-0">
              <polygon points="0,-14 -8,10 0,5 8,10" fill={shipColor} stroke="white" strokeWidth="0.8"/>
            </svg>
            <div className="text-[10px] space-y-1 text-[#94A3B8]">
              <div>
                <span style={{ color: shipColor }}>{SHIP_NAMES[shipTier]}</span>
                {shipTier>=2 && <span className="text-[#FFD70099] ml-1">+SPD</span>}
              </div>
              <div>GRAZE&nbsp;<span className="text-white">{bossStats.graze}</span>
                &nbsp;·&nbsp;{starRating(bossStats.graze)}</div>
              <div>TIME&nbsp;<span className="text-white">{formatTime(bossStats.clearFrames)}</span>
                &nbsp;·&nbsp;BOMB&nbsp;<span className="text-white">{bossStats.bombsUsed}</span></div>
              {shipTier<2 && (
                <div className="text-[#334155]">
                  {shipTier===0 ? `${10-bossStats.graze}G → PURPLE` : `${30-bossStats.graze}G → GOLD`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approach hint */}
      {nearPlanetId && !landedPlanetId && scanComplete && (() => {
        const def=PLANET_DEFS.find(p=>p.id===nearPlanetId)!;
        return (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ animation:'explFadeIn .2s ease-out' }}>
            <div className="text-xs font-mono px-5 py-2 rounded-full border"
              style={{ color:def.color, borderColor:def.color+'55', background:'#04080fCC' }}>
              [ENTER]&nbsp;&nbsp;{def.label} に着陸
            </div>
          </div>
        );
      })()}

      {/* Landing panel */}
      {landedPlanetId && landedDef && (
        <div className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex:60, background:'rgba(4,8,15,0.90)',
                   backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
                   animation:'explFadeIn .25s ease-out' }}>
          <div className="relative w-full max-w-4xl mx-4 rounded-2xl border p-10 overflow-y-auto"
            style={{ maxHeight:'90vh', borderColor:landedDef.color+'40',
                     background:'#080f1a', boxShadow:`0 0 80px ${landedDef.color}20` }}>

            <div className="text-[10px] font-mono mb-1 tracking-widest" style={{ color:landedDef.color }}>
              // {panelNum}.{landedDef.label.toLowerCase()}
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">{panelTitle}</h2>

            {/* ABOUT */}
            {landedPlanetId==='about' && (
              <div className="space-y-5">
                {show(0) && (
                  <div className="rounded-xl border border-white/10 p-4 font-mono text-xs space-y-2 bg-white/5"
                    style={{ animation:'explFadeIn .3s ease-out' }}>
                    {([
                      ['ROLE',  'ゲームクライアントエンジニア / Unity開発者'],
                      ['FOCUS', 'ゲームプレイシステム・AI・サウンド・グラフィックス'],
                      ['ENGINE','Unity (C#)'],
                      ['STATUS','インターン・就職機会を探しています'],
                    ] as [string,string][]).map(([k,v]) => (
                      <div key={k} className="flex gap-4">
                        <span className="w-16 shrink-0" style={{ color:landedDef.color }}>{k}</span>
                        <span className="text-[#CBD5E1]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {show(1) && (
                  <p className="text-[#CBD5E1] text-sm leading-relaxed"
                    style={{ animation:'explFadeIn .3s ease-out' }}>
                    主にUnityとC#を使用してゲームプレイプロトタイプを開発しており、戦闘システム・プレイヤー制御・敵AI・アニメーション制御・フィードバック設計に取り組んでいます。
                    正しく動作するだけでなく、操作していて気持ちいいと感じられるゲーム体験の構築を目指しています。
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { icon:'🎮', label:'ゲーム開発',   desc:'アクション・3Dヴァンサバ・トップダウンSTG・スレスパ風タワーディフェンスなど、多ジャンルのUnityゲーム開発' },
                    { icon:'🤖', label:'AI',          desc:'対戦ゲームへの機械学習統合によるゲームAI開発。行動学習・意思決定・ステートマシンの研究と実装' },
                    { icon:'🔊', label:'サウンド',     desc:'Logic Proを用いた楽曲・効果音制作と、ゲームエンジン内のインタラクティブ音響システム設計' },
                    { icon:'🎨', label:'グラフィックス', desc:'Blenderによる3Dモデリング・アニメーション制作とVFX・シェーダーによるビジュアルフィードバック実装' },
                  ]).map((h,i) => show(2+i) && (
                    <div key={h.label} className="rounded-lg border border-white/10 p-3 bg-white/5"
                      style={{ animation:'explFadeIn .3s ease-out' }}>
                      <div className="text-xl mb-1">{h.icon}</div>
                      <div className="text-xs font-semibold text-white mb-1">{h.label}</div>
                      <div className="text-[#94A3B8] text-xs leading-relaxed">{h.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WORKS */}
            {project && (
              <div className="space-y-4">
                {show(0) && (
                  <div className="flex items-center gap-2 text-[10px] font-mono"
                    style={{ animation:'explFadeIn .3s ease-out' }}>
                    <span style={{ color:landedDef.color }}>PROJECT {ROMAN[worksIdx] ?? String(worksIdx+1)}</span>
                    <span className="text-[#334155]">/ {projects.length}</span>
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[#94A3B8]">{worksIdx===0?'最初期':worksIdx===projects.length-1?'最新':'中期'}</span>
                  </div>
                )}
                {show(1) && (
                  <p className="text-[#CBD5E1] text-sm leading-relaxed"
                    style={{ animation:'explFadeIn .3s ease-out' }}>{project.description}</p>
                )}
                {show(2) && (
                  <div className="flex flex-wrap gap-1.5" style={{ animation:'explFadeIn .3s ease-out' }}>
                    {project.tech.map(tech => (
                      <span key={tech} className="text-[10px] px-2 py-0.5 rounded font-mono"
                        style={{ background:landedDef.color+'18', color:landedDef.color,
                                 border:`1px solid ${landedDef.color}40` }}>{tech}</span>
                    ))}
                  </div>
                )}
                {show(3) && (project.githubUrl||project.demoUrl) && (
                  <div className="flex gap-4" style={{ animation:'explFadeIn .3s ease-out' }}>
                    {project.githubUrl&&project.githubUrl.length>0 && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-mono hover:underline" style={{ color:landedDef.color }}>GitHub ↗</a>
                    )}
                    {project.demoUrl&&project.demoUrl.length>0 && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-mono text-[#A855F7] hover:underline">Demo ↗</a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SKILLS */}
            {landedPlanetId==='skills' && (
              <div className="grid grid-cols-2 gap-4">
                {skillCategories.map((cat,i) => show(i) && (
                  <div key={cat.category} className="rounded-xl border border-white/10 p-4 bg-white/5"
                    style={{ animation:'explFadeIn .3s ease-out' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-3 rounded-full" style={{ background:SKILL_COLORS[cat.color] }} />
                      <span className="text-xs font-mono font-semibold" style={{ color:SKILL_COLORS[cat.color] }}>
                        {cat.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded font-mono"
                          style={{ background:SKILL_COLORS[cat.color]+'18', color:SKILL_COLORS[cat.color],
                                   border:`1px solid ${SKILL_COLORS[cat.color]}40` }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RESEARCH */}
            {landedPlanetId==='research' && (
              <div className="space-y-4">
                {show(0) && (
                  <div className="rounded-xl border border-white/10 p-4 bg-white/5 text-[#CBD5E1] text-sm leading-relaxed"
                    style={{ animation:'explFadeIn .3s ease-out' }}>
                    音から<span className="text-[#38BDF8] font-semibold">音量・ピッチ・テンポ・周波数スペクトル</span>などの特徴量を抽出し、
                    機械学習モデルで感情ラベルに変換。その結果をキャラクターの
                    <span className="text-[#A855F7] font-semibold">表情ブレンドシェイプ・体の動き</span>にリアルタイムで反映する
                    アニメーションシステムの研究開発に取り組んでいます。
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { icon:'🎵', title:'音響特徴抽出',           color:'#0EA5E9', desc:'音声・音楽信号から音量・ピッチ・テンポ・MFCCなどの特徴量をリアルタイムで抽出し、アニメーション制御の入力データとして活用。' },
                    { icon:'🤖', title:'感情推定AI',             color:'#A855F7', desc:'抽出した音響特徴を機械学習モデルで処理し、喜び・怒り・悲しみなどの感情ラベルおよび強度をリアルタイムで推定して出力。' },
                    { icon:'🎭', title:'表情・ボディ制御',        color:'#16A34A', desc:'感情推定の出力をリアルタイムで表情ブレンドシェイプや体のポーズ・身振りに変換し、キャラクターのアニメーションへ反映。' },
                    { icon:'🔄', title:'リアルタイムパイプライン', color:'#EA580C', desc:'音入力→特徴抽出→感情推定→アニメーション出力の一連のパイプラインを低遅延で動作させるシステムアーキテクチャの設計。' },
                  ]).map((a,i) => show(1+i) && (
                    <div key={a.title} className="rounded-lg border border-white/10 p-3 bg-white/5"
                      style={{ animation:'explFadeIn .3s ease-out' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{a.icon}</span>
                        <div>
                          <div className="text-xs font-semibold mb-1" style={{ color:a.color }}>{a.title}</div>
                          <div className="text-[#94A3B8] text-xs leading-relaxed">{a.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {show(5) && (
                  <div className="rounded-xl border border-dashed border-[#A855F7]/40 p-4"
                    style={{ background:'#A855F710', animation:'explFadeIn .3s ease-out' }}>
                    <div className="text-xs font-mono text-[#A855F7] font-semibold mb-2">今後の展望</div>
                    <div className="text-[#CBD5E1] text-xs leading-relaxed">
                      複数感情の中間表現（感情ブレンド）への対応・音楽/音声/環境音それぞれへのモデル特化・リアルタイム推論の最適化による遅延削減を予定。
                      将来的にはゲームキャラクターが環境音やBGMに応じて自律的に反応するインタラクティブシステムへの発展を目指しています。
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CONTACT */}
            {landedPlanetId==='contact' && (
              <div className="space-y-6">
                {show(0) && (
                  <p className="text-[#CBD5E1] text-sm leading-relaxed"
                    style={{ animation:'explFadeIn .3s ease-out' }}>
                    現在、ゲーム開発・クライアントエンジニアリング分野での
                    <span className="text-[#38BDF8] font-semibold">インターンシップやアルバイトの機会</span>を探しています。
                    どんなことでもお気軽にご連絡ください。
                  </p>
                )}
                {show(1) && (() => {
                  const lk = socialLinks.find(l => l.href.startsWith('mailto'))!;
                  return (
                    <a href={lk.href}
                      className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border transition-all duration-200 hover:scale-105"
                      style={{ borderColor:lk.color+'40', background:lk.color+'12', animation:'explFadeIn .3s ease-out' }}>
                      <span className="text-xl shrink-0" style={{ color:lk.color }}>{lk.icon}</span>
                      <div>
                        <div className="text-[9px] font-mono text-[#94A3B8]">{lk.label}</div>
                        <div className="text-white text-sm font-medium">{lk.value}</div>
                      </div>
                      <span className="ml-4 text-xs shrink-0" style={{ color:lk.color }}>↗</span>
                    </a>
                  );
                })()}
                {show(2) && (
                  <div className="flex flex-wrap gap-3 pt-1" style={{ animation:'explFadeIn .3s ease-out' }}>
                    {socialLinks.filter(l => !l.href.startsWith('mailto')).map(lk => (
                      <a key={lk.label} href={lk.href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-mono transition-all duration-200 hover:scale-110"
                        style={{ color:'#94A3B8' }}
                        onMouseEnter={e => (e.currentTarget.style.color = lk.color)}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                        <span>{lk.icon}</span>
                        <span>{lk.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button onClick={closeLanding}
              className="mt-8 text-[10px] font-mono text-[#475569] hover:text-white transition-colors">
              [ESC] 探索に戻る
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes explFadeIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
