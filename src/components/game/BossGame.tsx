import { useEffect, useRef, useState } from 'react';

export interface BossStats {
  graze: number;
  clearFrames: number;
  bombsUsed: number;
}

interface BossGameProps {
  onBossDefeated: (stats: BossStats) => void;
  onExit: () => void;
  onRetry: () => void;
}

// ── 定数 ──────────────────────────────────────────────
const STAR_COUNT   = 280;
const BAR_HP       = 5;    // DEBUG: 本番は200
const BOSS_R       = 62;
const PLAYER_R     = 14;
const HITBOX_R     = 5;
const P_BULLET_R   = 4;
const PLAYER_SPD_N = 6;
const PLAYER_SPD_F = 2.5;
const P_BULLET_SPD = 15;
const INVINCIBLE_F = 120;
const BOMB_INV_F   = 180;

const PHASE_LABELS = ['PHASE I', 'PHASE II', 'PHASE III'];
const PHASE_COLORS = ['#38BDF8', '#A855F7', '#EF4444'];

type GState  = 'playing' | 'gameover' | 'victory';
type BType   = 'aimed' | 'circle' | 'spiral' | 'random' | 'hunter';
type Pattern = 'none' | 'circle' | 'spiral' | 'dash' | 'wave' | 'ring' | 'hunter' | 'meteor';

interface PBullet  { x: number; y: number; vx: number; vy: number; active: boolean; damage: number; homing: boolean }
interface BBullet  { x: number; y: number; vx: number; vy: number; active: boolean; type: BType }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number; color: string }
interface Star     { x: number; y: number; r: number; a: number }
interface Opt      { x: number; y: number }

const B_COLORS: Record<BType, string> = {
  aimed: '#FF7043', circle: '#FF69B4', spiral: '#FFD700', random: '#FF3366', hunter: '#88FF44',
};

// ── コンポーネント ────────────────────────────────────
export function BossGame({ onBossDefeated, onExit, onRetry }: BossGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [barHpPct,   setBarHpPct]   = useState(100);
  const [currentBar, setCurrentBar] = useState(0);
  const [lives,      setLives]      = useState(3);
  const [bombs,      setBombs]      = useState(2);
  const [gstate,     setGstate]     = useState<GState>('playing');
  const [graze,      setGraze]      = useState(0);

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
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2, a: Math.random() * 0.7 + 0.15,
    }));

    const player = {
      x: W / 2, y: H * 0.83,
      lives: 3, inv: 0, shotCd: 0, focused: false, optShotCd: 0,
      bombs: 2, bombTimer: 0,
    };

    const opts: Opt[] = [
      { x: W / 2 - 38, y: H * 0.83 },
      { x: W / 2 + 38, y: H * 0.83 },
    ];

    const boss = {
      x: W / 2, y: H * 0.23,
      bar: 0,
      barHp: BAR_HP,
      hitFlash: 0, moveTimer: 0,
      invincible: 0,
      transitioning: false,
      transTimer: 0,
      scale: 1.0,
      defeated: false, victoryTimer: 0,
    };

    const ai = {
      normalTimer: 0,
      pattern: 'none' as Pattern,
      patternTimer: 0,
      specialCd: 220,
      spiralAngle: 0,
      dashVx: 0, dashVy: 0,
      flashTimer: 0,
    };

    const pBullets: PBullet[] = Array.from({ length: 60  }, () => ({ x:0,y:0,vx:0,vy:0,active:false,damage:1,homing:false }));
    const bBullets: BBullet[] = Array.from({ length: 240 }, () => ({ x:0,y:0,vx:0,vy:0,active:false,type:'aimed' as BType }));
    const particles: Particle[] = [];

    let grazeCount = 0;
    let bombsUsed  = 0;
    let clearFrame = 0;
    const GRAZE_DIST = PLAYER_R + 22;
    const grazed = new Set<BBullet>();
    const keys: Record<string, boolean> = {};
    let gs: GState = 'playing';
    let frame = 0;

    // ── ヘルパー ──
    const getPhase = (): 1|2|3 => (boss.bar + 1) as 1|2|3;
    const phColor  = (p: 1|2|3) => PHASE_COLORS[p - 1];

    const burst = (x: number, y: number, color: string, n: number, spd = 4) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * spd + 1;
        const life = (30 + Math.random() * 40) | 0;
        particles.push({ x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life, maxLife:life, r:Math.random()*5+1, color });
      }
      if (particles.length > 600) particles.splice(0, particles.length - 600);
    };

    const fireBoss = (count: number, baseAngle: number, spread: number, type: BType, spd: number) => {
      for (let i = 0; i < count; i++) {
        const slot = bBullets.find((b) => !b.active);
        if (!slot) return;
        const offset = count > 1 ? ((i/(count-1))-0.5)*spread : 0;
        const a = baseAngle + offset;
        slot.x=boss.x; slot.y=boss.y; slot.vx=Math.cos(a)*spd; slot.vy=Math.sin(a)*spd;
        slot.active=true; slot.type=type;
      }
    };

    // 任意位置から発射（meteor用）
    const fireFrom = (fx: number, fy: number, angle: number, type: BType, spd: number) => {
      const slot = bBullets.find((b) => !b.active);
      if (!slot) return;
      slot.x=fx; slot.y=fy; slot.vx=Math.cos(angle)*spd; slot.vy=Math.sin(angle)*spd;
      slot.active=true; slot.type=type;
    };

    const fireShot = (fromX: number, fromY: number, angle: number, damage = 1, homing = false) => {
      const slot = pBullets.find((b) => !b.active);
      if (!slot) return;
      slot.x = fromX; slot.y = fromY;
      slot.vx = Math.cos(angle) * P_BULLET_SPD;
      slot.vy = Math.sin(angle) * P_BULLET_SPD;
      slot.active = true; slot.damage = damage; slot.homing = homing;
    };

    const shootPlayer = () => {
      if (player.shotCd > 0 || gs !== 'playing' || boss.transitioning) return;
      const up = -Math.PI / 2;
      if (player.focused) {
        fireShot(player.x - 5, player.y - PLAYER_R, up - 0.04);
        fireShot(player.x,     player.y - PLAYER_R, up);
        fireShot(player.x + 5, player.y - PLAYER_R, up + 0.04);
      } else {
        fireShot(player.x,     player.y - PLAYER_R, up);
        fireShot(player.x - 8, player.y - PLAYER_R, up - 0.12);
        fireShot(player.x + 8, player.y - PLAYER_R, up + 0.12);
      }
      player.shotCd = 14;
    };

    const activatePattern = (pattern: Pattern) => {
      ai.pattern = pattern;
      ai.patternTimer = 0;
      ai.spiralAngle = Math.random() * Math.PI * 2;
      ai.flashTimer = 8;
    };

    const startTransition = () => {
      boss.transitioning = true;
      boss.transTimer = 0;
      boss.scale = 1.0;
      boss.invincible = 220;
      bBullets.forEach(b => { b.active = false; });
      pBullets.forEach(b => { b.active = false; });
      grazed.clear();
      ai.pattern = 'none';
      ai.patternTimer = 0;
      const ph = getPhase();
      burst(boss.x, boss.y, phColor(ph), 50, 6);
      burst(boss.x, boss.y, '#ffffff', 25, 4);
    };

    const activateBomb = () => {
      if (player.bombs <= 0 || player.bombTimer > 0 || gs !== 'playing') return;
      player.bombs--;
      bombsUsed++;
      player.inv = BOMB_INV_F;
      player.bombTimer = 60;
      bBullets.forEach(b => { b.active = false; });
      grazed.clear();
      if (boss.invincible === 0) {
        boss.barHp = Math.max(0, boss.barHp - 5);
        boss.hitFlash = 15;
      }
      burst(player.x, player.y, '#ffffff', 30, 6);
      burst(player.x, player.y, '#38BDF8', 20, 4);
    };

    // ── 入力 ──
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === 'Escape') onExit();
      if (e.code === 'KeyZ') activateBomb();
    };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);

    let rafId: number;

    // ── ゲームループ ──
    const loop = () => {
      frame++;

      if (gs === 'playing') {
        const ph = getPhase();
        player.focused = keys['ShiftLeft'] || keys['ShiftRight'];
        const spd = player.focused ? PLAYER_SPD_F : PLAYER_SPD_N;

        if (keys['ArrowLeft']  || keys['KeyA']) player.x -= spd;
        if (keys['ArrowRight'] || keys['KeyD']) player.x += spd;
        if (keys['ArrowUp']    || keys['KeyW']) player.y -= spd;
        if (keys['ArrowDown']  || keys['KeyS']) player.y += spd;
        player.x = Math.max(PLAYER_R, Math.min(W - PLAYER_R, player.x));
        player.y = Math.max(H * 0.45, Math.min(H - PLAYER_R - 10, player.y));
        if (player.inv       > 0) player.inv--;
        if (player.shotCd    > 0) player.shotCd--;
        if (player.bombTimer > 0) player.bombTimer--;
        if (boss.invincible  > 0) boss.invincible--;

        // オプション追従
        const optOffX = player.focused ? 22 : 38;
        const optOffY = player.focused ? -5 : 5;
        opts[0].x += (player.x - optOffX - opts[0].x) * 0.12;
        opts[0].y += (player.y + optOffY - opts[0].y) * 0.12;
        opts[1].x += (player.x + optOffX - opts[1].x) * 0.12;
        opts[1].y += (player.y + optOffY - opts[1].y) * 0.12;

        if (boss.transitioning) {
          // ── フェーズ遷移演出 ──
          boss.transTimer++;
          const t = boss.transTimer;
          if (t < 40) {
            boss.scale = Math.max(0.05, 1 - (t / 40) * 0.95);
          } else if (t < 65) {
            boss.scale = 0.05;
            if (t % 10 === 0) burst(boss.x+(Math.random()-0.5)*60, boss.y+(Math.random()-0.5)*60, PHASE_COLORS[boss.bar], 12, 3);
          } else {
            boss.scale = Math.min(1.0, 0.05 + ((t - 65) / 55) * 0.95);
          }
          if (t >= 120) {
            boss.bar++;
            boss.barHp = BAR_HP;
            boss.scale = 1.0;
            boss.transitioning = false;
            ai.normalTimer = 0; ai.patternTimer = 0; ai.pattern = 'none';
            ai.specialCd = boss.bar === 1 ? 160 : 120;
            ai.flashTimer = 12;
            setCurrentBar(boss.bar);
          }

        } else {
          // ── 通常ゲームプレイ ──

          // 自機射撃
          shootPlayer();
          if (player.optShotCd > 0) player.optShotCd--;
          if (player.optShotCd === 0) {
            const a0 = Math.atan2(boss.y - opts[0].y, boss.x - opts[0].x);
            const a1 = Math.atan2(boss.y - opts[1].y, boss.x - opts[1].x);
            fireShot(opts[0].x, opts[0].y, a0, 0.4, true);
            fireShot(opts[1].x, opts[1].y, a1, 0.4, true);
            player.optShotCd = 18;
          }

          // ボス移動
          if (ai.pattern === 'dash') {
            boss.x += ai.dashVx; boss.y += ai.dashVy;
            ai.dashVx *= 0.93; ai.dashVy *= 0.93;
          } else if (ph === 1) {
            boss.moveTimer += 0.012;
            boss.x = W/2 + Math.sin(boss.moveTimer) * W*0.30;
            boss.y = H*0.22 + Math.sin(boss.moveTimer*2) * H*0.10;
          } else if (ph === 2) {
            boss.moveTimer += 0.022;
            boss.x = W/2 + Math.sin(boss.moveTimer*0.9)*W*0.30 + Math.sin(boss.moveTimer*1.7)*W*0.06;
            boss.y = H*0.25 + Math.sin(boss.moveTimer*1.3)*H*0.12;
          } else {
            const tgtX = player.x + Math.sin(frame*0.03)*80;
            const tgtY = Math.min(H*0.45, Math.max(BOSS_R+20, player.y - H*0.28));
            boss.x += (tgtX - boss.x) * 0.010;
            boss.y += (tgtY - boss.y) * 0.010;
            boss.x += Math.sin(frame*0.05)*2.5;
            boss.y += Math.cos(frame*0.038)*1.5;
          }
          boss.x = Math.max(BOSS_R+10, Math.min(W-BOSS_R-10, boss.x));
          boss.y = Math.max(BOSS_R+10, Math.min(H*0.55, boss.y));
          if (boss.hitFlash > 0) boss.hitFlash--;
          if (ai.flashTimer  > 0) ai.flashTimer--;

          // 通常射撃
          const normalInterval = ph===1 ? 95 : ph===2 ? 68 : 50;
          if (ai.pattern === 'none') {
            ai.normalTimer++;
            if (ai.normalTimer >= normalInterval) {
              ai.normalTimer = 0;
              const angle = Math.atan2(player.y-boss.y, player.x-boss.x);
              const count = ph===1 ? 1 : ph===2 ? 3 : 5;
              fireBoss(count, angle, ph===2?0.45:0.55, 'aimed', 2.4+ph*0.35);
              if (ph===3 && Math.random()<0.5) fireBoss(1, Math.random()*Math.PI*2, 0, 'random', 3.2);
            }
          }

          // スペルトリガー
          ai.specialCd--;
          if (ai.specialCd <= 0 && ai.pattern === 'none') {
            const pool: Pattern[] =
              ph===1 ? ['circle','spiral','dash','wave'] :
              ph===2 ? ['circle','ring','dash','wave','spiral'] :
              ['circle','ring','spiral','wave','hunter','meteor'];
            activatePattern(pool[Math.floor(Math.random()*pool.length)]);
            ai.specialCd = ph===1 ? 220 : ph===2 ? 165 : 125;
          }

          // ── パターン実行 ──
          ai.patternTimer++;

          // circle: 全方位リング
          if (ai.pattern === 'circle') {
            if (ai.patternTimer === 1) {
              const n = ph===1?12:ph===2?16:20;
              const spd2 = 2.6+ph*0.3;
              for (let i=0;i<n;i++) fireBoss(1,(i/n)*Math.PI*2,0,'circle',spd2);
              if (ph>=2) for (let i=0;i<n;i++) fireBoss(1,(i/n)*Math.PI*2+Math.PI/n,0,'circle',spd2*0.65);
            }
            if (ai.patternTimer >= 2) ai.pattern = 'none';
          }

          // spiral: 回転スパイラル
          if (ai.pattern === 'spiral') {
            if (ai.patternTimer % 4 === 0) {
              const spd2 = 2.8+ph*0.25;
              fireBoss(1, ai.spiralAngle, 0, 'spiral', spd2);
              if (ph>=2) fireBoss(1, ai.spiralAngle+Math.PI, 0, 'spiral', spd2);
              if (ph>=3) fireBoss(1, ai.spiralAngle+Math.PI*0.5, 0, 'spiral', spd2);
              ai.spiralAngle += ph===1?0.20:ph===2?0.16:0.13;
            }
            if (ai.patternTimer >= (ph===1?110:ph===2?90:72)) ai.pattern = 'none';
          }

          // dash: 突進
          if (ai.pattern === 'dash') {
            if (ai.patternTimer === 1) {
              const dx=player.x-boss.x; const dy=player.y-boss.y;
              const len=Math.hypot(dx,dy)||1;
              ai.dashVx=(dx/len)*13; ai.dashVy=(dy/len)*13;
            }
            if (ai.patternTimer%10===0) fireBoss(3, Math.random()*Math.PI*2, Math.PI*0.5, 'circle', 2.2);
            if (ai.patternTimer>=60) { ai.pattern='none'; ai.dashVx=0; ai.dashVy=0; }
          }

          // wave: プレイヤー方向扇形×3ウェーブ
          if (ai.pattern === 'wave') {
            if ([1,50,99].includes(ai.patternTimer)) {
              const angle = Math.atan2(player.y-boss.y, player.x-boss.x);
              const n = ph===1?11:ph===2?13:15;
              const spread = ph===1?1.1:ph===2?1.2:1.35;
              fireBoss(n, angle, spread, 'circle', 2.8+ph*0.2);
            }
            if (ai.patternTimer >= 148) ai.pattern = 'none';
          }

          // ring: 2重リング（外側速い/内側遅い）
          if (ai.pattern === 'ring') {
            if (ai.patternTimer === 1) {
              const n = ph===1?16:ph===2?20:24;
              const fast = 3.2+ph*0.2;
              for (let i=0;i<n;i++) fireBoss(1,(i/n)*Math.PI*2,0,'circle',fast);
              for (let i=0;i<n;i++) fireBoss(1,(i/n)*Math.PI*2+Math.PI/n,0,'spiral',1.4);
            }
            if (ai.patternTimer >= 2) ai.pattern = 'none';
          }

          // hunter: 軽めのホーミング弾を時間差で発射
          if (ai.pattern === 'hunter') {
            const maxShots = ph===1?4:ph===2?5:6;
            const interval = 25;
            const shotIdx = Math.floor((ai.patternTimer-1)/interval);
            if ((ai.patternTimer-1)%interval===0 && shotIdx < maxShots) {
              const randAngle = Math.random()*Math.PI*2;
              const slot = bBullets.find(b=>!b.active);
              if (slot) {
                slot.x=boss.x; slot.y=boss.y;
                slot.vx=Math.cos(randAngle)*2.0; slot.vy=Math.sin(randAngle)*2.0;
                slot.active=true; slot.type='hunter';
              }
            }
            if (ai.patternTimer >= interval*maxShots+40) ai.pattern='none';
          }

          // meteor: 画面上から降ってくる弾（Phase III限定）
          if (ai.pattern === 'meteor') {
            if (ai.patternTimer%5===0 && ai.patternTimer<=120) {
              const x = Math.random()*W;
              const angle = Math.PI*0.5 + (Math.random()-0.5)*0.5;
              fireFrom(x, -15, angle, 'random', 3.8+Math.random()*1.5);
            }
            if (ai.patternTimer>=150) ai.pattern='none';
          }

          // プレイヤー弾 → ボスヒット
          for (const b of pBullets) {
            if (!b.active) continue;
            b.x += b.vx; b.y += b.vy;
            if (b.y<-10||b.x<-10||b.x>W+10) { b.active=false; continue; }
            if (b.homing && !boss.defeated) {
              const hdx=boss.x-b.x; const hdy=boss.y-b.y;
              const hdist=Math.hypot(hdx,hdy)||1;
              b.vx += (hdx/hdist*P_BULLET_SPD - b.vx)*0.07;
              b.vy += (hdy/hdist*P_BULLET_SPD - b.vy)*0.07;
              const hs=Math.hypot(b.vx,b.vy)||1;
              b.vx=(b.vx/hs)*P_BULLET_SPD; b.vy=(b.vy/hs)*P_BULLET_SPD;
            }
            if (boss.invincible > 0) continue;
            const dx=b.x-boss.x; const dy=b.y-boss.y;
            if (dx*dx+dy*dy < (BOSS_R+P_BULLET_R)**2) {
              b.active=false;
              boss.barHp=Math.max(0,boss.barHp-b.damage);
              boss.hitFlash=8;
              burst(b.x,b.y,phColor(ph),5);
              if (boss.barHp<=0) {
                if (boss.bar<2) {
                  startTransition();
                } else {
                  boss.defeated=true; gs='victory'; clearFrame=frame;
                  bBullets.forEach(b2=>{b2.active=false;});
                  pBullets.forEach(b2=>{b2.active=false;});
                  burst(boss.x,boss.y,'#ffffff',90,9); burst(boss.x,boss.y,'#FFD700',70,8);
                  burst(boss.x,boss.y,'#A855F7',60,7); burst(boss.x,boss.y,'#38BDF8',60,7);
                  burst(boss.x,boss.y,'#EF4444',50,6); burst(boss.x,boss.y,'#FF69B4',40,5);
                  setGstate('victory');
                }
              }
            }
          }

          // ボス弾 → プレイヤーヒット（hunter ホーミング補正含む）
          for (const b of bBullets) {
            if (!b.active) continue;
            if (b.type === 'hunter') {
              const hdx=player.x-b.x; const hdy=player.y-b.y;
              const hdist=Math.hypot(hdx,hdy)||1;
              const hs=2.2;
              b.vx += (hdx/hdist*hs - b.vx)*0.03;
              b.vy += (hdy/hdist*hs - b.vy)*0.03;
              const cs=Math.hypot(b.vx,b.vy);
              if (cs>hs) { b.vx=(b.vx/cs)*hs; b.vy=(b.vy/cs)*hs; }
            }
            b.x+=b.vx; b.y+=b.vy;
            if (b.x<-20||b.x>W+20||b.y<-20||b.y>H+20) { b.active=false; grazed.delete(b); continue; }
            const dx=b.x-player.x; const dy=b.y-player.y;
            const distSq=dx*dx+dy*dy;
            if (!grazed.has(b) && distSq<GRAZE_DIST**2) {
              grazed.add(b); grazeCount++;
              if (frame%6===0) setGraze(grazeCount);
            }
            if (player.inv===0 && distSq<(HITBOX_R+(b.type==='aimed'?7:8))**2) {
              b.active=false; grazed.delete(b);
              player.lives=Math.max(0,player.lives-1);
              player.inv=INVINCIBLE_F;
              player.bombs=Math.min(2,player.bombs+1);  // ミス時ボム補充
              burst(player.x,player.y,'#FF6B6B',14);
              if (player.lives<=0) { gs='gameover'; setGstate('gameover'); }
            }
          }
        }

        if (frame%6===0) {
          setBarHpPct(Math.round((boss.barHp/BAR_HP)*100));
          setCurrentBar(boss.bar); setLives(player.lives); setBombs(player.bombs);
        }

      } else if (gs==='victory') {
        boss.victoryTimer++;
        const vt=boss.victoryTimer;
        if (vt<115&&vt%7===0) {
          const ex=boss.x+(Math.random()-0.5)*BOSS_R*2.5;
          const ey=boss.y+(Math.random()-0.5)*BOSS_R*2.5;
          const cs=['#38BDF8','#A855F7','#EF4444','#FFD700','#ffffff','#FF69B4'];
          burst(ex,ey,cs[Math.floor(Math.random()*cs.length)],28,5);
        }
        if (vt===15)  { burst(boss.x,boss.y,'#ffffff',90,9); }
        if (vt===40)  { burst(boss.x,boss.y,'#FFD700',70,8); burst(boss.x,boss.y,'#A855F7',50,6); }
        if (vt===70)  { burst(boss.x,boss.y,'#38BDF8',70,8); burst(boss.x,boss.y,'#EF4444',60,7); }
        if (vt===280) setTimeout(() => onBossDefeated({ graze: grazeCount, clearFrames: clearFrame, bombsUsed }), 0);
      }

      // パーティクル更新
      for (let i=particles.length-1;i>=0;i--) {
        const p=particles[i];
        p.x+=p.vx; p.y+=p.vy; p.vx*=0.93; p.vy*=0.93;
        if (--p.life<=0) particles.splice(i,1);
      }

      // ── 描画 ──
      ctx.save();
      if (gs==='victory'&&boss.victoryTimer<80) {
        const shake=Math.max(0,14-boss.victoryTimer*0.17);
        ctx.translate((Math.random()-0.5)*shake,(Math.random()-0.5)*shake);
      }

      ctx.fillStyle='#04080f'; ctx.fillRect(0,0,W,H);

      if (ai.flashTimer>0) {
        ctx.globalAlpha=ai.flashTimer/12*0.35;
        ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.globalAlpha=1;
      }

      stars.forEach((s)=>{
        ctx.globalAlpha=s.a; ctx.fillStyle='#ffffff';
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha=1;

      if (gs!=='gameover') {
        const ph=getPhase();
        const col=phColor(ph);
        const plse=1+Math.sin(frame*0.05)*0.05;

        // ── ボス ──
        if (!boss.defeated) {
          ctx.save();
          ctx.translate(boss.x,boss.y); ctx.scale(boss.scale,boss.scale); ctx.translate(-boss.x,-boss.y);

          const grad=ctx.createRadialGradient(boss.x,boss.y,BOSS_R*0.4,boss.x,boss.y,BOSS_R*3*plse);
          grad.addColorStop(0,col+'55'); grad.addColorStop(1,'transparent');
          ctx.fillStyle=grad;
          ctx.beginPath(); ctx.arc(boss.x,boss.y,BOSS_R*3*plse,0,Math.PI*2); ctx.fill();

          const fl=boss.hitFlash>0;
          ctx.shadowColor=fl?'#ffffff':col; ctx.shadowBlur=fl?60:30;
          ctx.fillStyle=fl?'#ffffff50':col+'28';
          ctx.strokeStyle=fl?'#ffffff':col; ctx.lineWidth=fl?4:2.5;
          ctx.beginPath(); ctx.arc(boss.x,boss.y,BOSS_R,0,Math.PI*2); ctx.fill(); ctx.stroke();
          ctx.shadowBlur=0;

          if (ph===1) {
            ctx.save(); ctx.translate(boss.x,boss.y); ctx.rotate(frame*0.018);
            ctx.strokeStyle=col+'70'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.ellipse(0,0,BOSS_R*1.5,BOSS_R*0.35,0,0,Math.PI*2); ctx.stroke();
            ctx.restore();
          } else if (ph===2) {
            ctx.save(); ctx.translate(boss.x,boss.y); ctx.rotate(frame*0.026);
            for (let i=0;i<6;i++) {
              const a=(i/6)*Math.PI*2;
              ctx.strokeStyle=col+'65'; ctx.lineWidth=1.5;
              ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(a)*BOSS_R*0.75,Math.sin(a)*BOSS_R*0.75); ctx.stroke();
            }
            ctx.restore();
          } else {
            [{rot:frame*0.038,rx:BOSS_R*1.38,ry:BOSS_R*0.30},{rot:-frame*0.024,rx:BOSS_R*1.12,ry:BOSS_R*0.48}]
              .forEach(({rot,rx,ry})=>{
                ctx.save(); ctx.translate(boss.x,boss.y); ctx.rotate(rot);
                ctx.strokeStyle=col+'82'; ctx.lineWidth=1.5;
                ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2); ctx.stroke(); ctx.restore();
              });
          }
          if (ai.pattern==='dash') {
            ctx.shadowColor=col; ctx.shadowBlur=40;
            ctx.strokeStyle=col+'80'; ctx.lineWidth=BOSS_R*0.5; ctx.lineCap='round';
            ctx.beginPath(); ctx.moveTo(boss.x-ai.dashVx*3,boss.y-ai.dashVy*3); ctx.lineTo(boss.x,boss.y); ctx.stroke();
            ctx.shadowBlur=0; ctx.lineCap='butt';
          }
          ctx.restore();
        }

        // ── ボス弾 ──
        bBullets.forEach((b)=>{
          if (!b.active) return;
          const bc=B_COLORS[b.type];
          const br=b.type==='aimed'?7:b.type==='hunter'?9:8;
          ctx.shadowColor=bc; ctx.shadowBlur=br*1.8;
          ctx.fillStyle=bc;
          ctx.beginPath(); ctx.arc(b.x,b.y,br,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0; ctx.fillStyle='#ffffff';
          ctx.beginPath(); ctx.arc(b.x,b.y,br*0.42,0,Math.PI*2); ctx.fill();
        });

        // ── プレイヤー弾 ──
        pBullets.forEach((b)=>{
          if (!b.active) return;
          const bc=b.homing?'#FFD700':'#38BDF8';
          const sc=b.homing?'#FF8C00':'#ffffff';
          ctx.shadowColor=sc; ctx.shadowBlur=10;
          ctx.strokeStyle=sc; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(b.x-b.vx*1.5,b.y-b.vy*1.5); ctx.stroke();
          ctx.fillStyle=bc;
          ctx.beginPath(); ctx.arc(b.x,b.y,P_BULLET_R,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0;
        });

        // ── オプション（子機） ──
        opts.forEach((opt)=>{
          ctx.shadowColor='#38BDF8'; ctx.shadowBlur=18;
          ctx.fillStyle='#38BDF8';
          ctx.beginPath(); ctx.arc(opt.x,opt.y,5,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0;
          ctx.strokeStyle='#7DD3FA88'; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(opt.x,opt.y,9,0,Math.PI*2); ctx.stroke();
        });

        // ── プレイヤー（宇宙船） ──
        if (player.inv===0||frame%6<3) {
          ctx.save(); ctx.translate(player.x,player.y);
          if (player.focused) {
            ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.arc(0,0,HITBOX_R+3,0,Math.PI*2); ctx.stroke();
          }
          ctx.shadowColor='#38BDF8'; ctx.shadowBlur=22;
          ctx.fillStyle='#1E6A9E'; ctx.strokeStyle='#7DD3FA'; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(-5,-4); ctx.lineTo(-20,6); ctx.lineTo(-16,12); ctx.lineTo(-4,6); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(5,-4); ctx.lineTo(20,6); ctx.lineTo(16,12); ctx.lineTo(4,6); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle='#38BDF8'; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.moveTo(0,-PLAYER_R); ctx.lineTo(PLAYER_R*0.6,PLAYER_R*0.7); ctx.lineTo(0,PLAYER_R*0.3); ctx.lineTo(-PLAYER_R*0.6,PLAYER_R*0.7); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle='#ffffff'; ctx.shadowColor='#ffffff'; ctx.shadowBlur=8;
          ctx.beginPath(); ctx.arc(0,-PLAYER_R*0.4,3,0,Math.PI*2); ctx.fill();
          const flameH=5+Math.random()*4;
          ctx.fillStyle='#FFD700'; ctx.shadowColor='#FF8C00'; ctx.shadowBlur=12;
          ctx.beginPath(); ctx.moveTo(-5,PLAYER_R*0.7); ctx.lineTo(0,PLAYER_R*0.7+flameH); ctx.lineTo(5,PLAYER_R*0.7); ctx.closePath(); ctx.fill();
          ctx.shadowBlur=0; ctx.restore();
        }

        // ── ボム波紋エフェクト ──
        if (player.bombTimer>0) {
          const prog=1-player.bombTimer/60;
          const r=prog*Math.min(W,H)*0.6;
          ctx.globalAlpha=(1-prog)*0.5;
          ctx.strokeStyle='#ffffff'; ctx.lineWidth=3;
          ctx.shadowColor='#38BDF8'; ctx.shadowBlur=20;
          ctx.beginPath(); ctx.arc(player.x,player.y,r,0,Math.PI*2); ctx.stroke();
          ctx.globalAlpha=1; ctx.shadowBlur=0;
        }

        // ── フェーズ遷移テキスト ──
        if (boss.transitioning) {
          const t=boss.transTimer;
          if (t<20) {
            ctx.globalAlpha=(1-t/20)*0.85;
            ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.globalAlpha=1;
          }
          if (t>=50&&t<110&&boss.bar+1<3) {
            const fadeIn=Math.min(1,(t-50)/15);
            const fadeOut=t>95?Math.max(0,(110-t)/15):1;
            const nc=PHASE_COLORS[boss.bar+1];
            ctx.globalAlpha=fadeIn*fadeOut;
            ctx.font='bold 52px monospace'; ctx.textAlign='center';
            ctx.fillStyle=nc; ctx.shadowColor=nc; ctx.shadowBlur=50;
            ctx.fillText(PHASE_LABELS[boss.bar+1],W/2,H/2-10);
            ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.textAlign='left';
          }
        }
      }

      // パーティクル
      particles.forEach((p)=>{
        ctx.globalAlpha=p.life/p.maxLife;
        ctx.shadowColor=p.color; ctx.shadowBlur=8;
        ctx.fillStyle=p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*(p.life/p.maxLife),0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      });
      ctx.globalAlpha=1;

      // ── 最終撃破演出 ──
      if (gs==='victory') {
        const vt=boss.victoryTimer;
        if (vt>45&&vt<165) {
          const alpha=Math.min(0.5,(vt-45)/35*0.5);
          const hue=(vt*3.5)%360;
          ctx.globalAlpha=alpha;
          ctx.fillStyle=`hsl(${hue},100%,65%)`; ctx.fillRect(0,0,W,H); ctx.globalAlpha=1;
        }
        if (vt>65&&vt<255) {
          const fadeIn=Math.min(1,(vt-65)/25);
          const fadeOut=vt>230?Math.max(0,(255-vt)/25):1;
          ctx.globalAlpha=fadeIn*fadeOut;
          ctx.font='bold 72px monospace'; ctx.textAlign='center';
          ctx.shadowColor='#FFD700'; ctx.shadowBlur=60;
          ctx.fillStyle='#ffffff'; ctx.fillText('YOU WIN',W/2,H/2);
          ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.textAlign='left';
        }
        if (vt>230) {
          ctx.globalAlpha=Math.min(1,(vt-230)/50);
          ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.globalAlpha=1;
        }
      }

      ctx.restore();
      rafId=requestAnimationFrame(loop);
    };

    rafId=requestAnimationFrame(loop);
    return ()=>{
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown',onKeyDown);
      window.removeEventListener('keyup',  onKeyUp);
      window.removeEventListener('resize', onResize);
    };
  }, [onBossDefeated, onExit]);

  const barColors=['#38BDF8','#A855F7','#EF4444'];

  return (
    <div className="fixed inset-0 z-50" style={{background:'#04080f'}}>
      <canvas ref={canvasRef} style={{display:'block'}} />

      {/* HPゲージ */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5" style={{width:'300px'}}>
        <div className="text-[10px] font-mono text-white/40 tracking-widest text-center">BOSS</div>
        <div className="relative w-full h-3 rounded-full bg-black/60 overflow-hidden border"
          style={{borderColor:`${barColors[currentBar]}40`}}>
          <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"
            style={{width:`${barHpPct}%`,background:`linear-gradient(90deg,${barColors[currentBar]},${barColors[currentBar]}88)`}} />
        </div>
        <div className="flex gap-2">
          {[0,1,2].map(i=>(
            <div key={i} className="w-2 h-2 rounded-full transition-all duration-300" style={{
              background:i<currentBar?barColors[i]+'50':i===currentBar?barColors[i]:'#1e293b',
              boxShadow:i===currentBar?`0 0 6px ${barColors[i]}`:'none',
            }}/>
          ))}
        </div>
      </div>

      {/* 残機 */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <span className="text-[10px] font-mono text-[#64748B]">LIVES</span>
        {[0,1,2].map((i)=>(
          <div key={i} className="w-3 h-3 rounded-full" style={{
            background:i<lives?'#38BDF8':'#1e293b',
            boxShadow:i<lives?'0 0 8px #38BDF8':'none',
          }}/>
        ))}
      </div>

      {/* ボム */}
      <div className="absolute bottom-6 left-36 flex items-center gap-2">
        <span className="text-[10px] font-mono text-[#64748B]">BOMB</span>
        {[0,1].map((i)=>(
          <div key={i} className="w-3 h-3 rounded-full" style={{
            background:i<bombs?'#A855F7':'#1e293b',
            boxShadow:i<bombs?'0 0 8px #A855F7':'none',
          }}/>
        ))}
      </div>

      {/* GRAZEカウンター */}
      {graze>0&&(
        <div className="absolute bottom-6 right-6 text-right">
          <div className="text-[10px] font-mono text-[#FFD700]/70">GRAZE</div>
          <div className="text-lg font-bold font-mono" style={{color:'#FFD700',textShadow:'0 0 10px #FFD700'}}>{graze}</div>
        </div>
      )}

      {/* 操作説明 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="text-[10px] font-mono text-[#475569]">
          WASD/矢印 移動　Shift 低速フォーカス　Z ボム
        </div>
      </div>

      {/* 中断 */}
      <button onClick={onExit}
        className="absolute top-5 right-5 text-[10px] font-mono text-[#475569] hover:text-white transition-colors px-2.5 py-1 border border-white/10 rounded bg-black/40">
        ESC 中断
      </button>

      {/* ゲームオーバー */}
      {gstate==='gameover'&&(
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75">
          <div className="text-5xl font-bold font-mono text-red-400 mb-8" style={{textShadow:'0 0 40px #EF4444'}}>
            GAME OVER
          </div>
          <button onClick={onRetry} className="px-8 py-3 font-mono text-sm text-white border border-white/30 rounded hover:bg-white/10 transition-colors mb-3">
            再挑戦
          </button>
          <button onClick={onExit} className="text-xs font-mono text-[#64748B] hover:text-white transition-colors">
            ポートフォリオに戻る
          </button>
        </div>
      )}
    </div>
  );
}
