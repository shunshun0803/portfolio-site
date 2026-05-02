import { useEffect, useRef, useState } from 'react';

interface BossGameProps {
  onBossDefeated: () => void;
  onExit: () => void;
  onRetry: () => void;
}

// ── 定数 ──────────────────────────────────────────────
const STAR_COUNT   = 280;
const BOSS_HP_MAX  = 35;
const BOSS_R       = 62;
const PLAYER_R     = 14;   // 描画半径
const HITBOX_R     = 5;    // 当たり判定半径
const P_BULLET_R   = 4;
const PLAYER_SPD_N = 6;    // 通常速度
const PLAYER_SPD_F = 2.5;  // フォーカス速度
const P_BULLET_SPD = 15;
const INVINCIBLE_F = 120;

type GState  = 'playing' | 'gameover' | 'victory';
type BType   = 'aimed' | 'circle' | 'spiral' | 'random';
type Pattern = 'none' | 'circle' | 'spiral' | 'dash';

interface PBullet  { x: number; y: number; vx: number; vy: number; active: boolean }
interface BBullet  { x: number; y: number; vx: number; vy: number; active: boolean; type: BType }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number; color: string }
interface Star     { x: number; y: number; r: number; a: number }
interface Option   { x: number; y: number }

const B_COLORS: Record<BType, string> = {
  aimed: '#FF7043', circle: '#FF69B4', spiral: '#FFD700', random: '#FF3366',
};

// ── コンポーネント ────────────────────────────────────
export function BossGame({ onBossDefeated, onExit, onRetry }: BossGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hpPct,  setHpPct]  = useState(100);
  const [phase,  setPhase]  = useState<1|2|3>(1);
  const [lives,  setLives]  = useState(3);
  const [gstate, setGstate] = useState<GState>('playing');
  const [graze,  setGraze]  = useState(0);

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

    // プレイヤー
    const player = {
      x: W / 2, y: H * 0.83,
      lives: 3, inv: 0, shotCd: 0, focused: false, optShotCd: 0,
    };

    // サブウェポン（オプション）: 左右2つ、プレイヤーに遅れてついてくる
    const opts: Option[] = [
      { x: W / 2 - 38, y: H * 0.83 },
      { x: W / 2 + 38, y: H * 0.83 },
    ];

    const boss = {
      x: W / 2, y: H * 0.23,
      hp: BOSS_HP_MAX,
      hitFlash: 0, moveTimer: 0,
      defeated: false, victoryTimer: 0,
    };

    const ai = {
      normalTimer: 0,
      pattern: 'none' as Pattern,
      patternTimer: 0,
      specialCd: 200,
      spiralAngle: 0,
      dashVx: 0, dashVy: 0,
      flashTimer: 0,
    };

    // バッファ: プレイヤー弾は多めに
    const pBullets: PBullet[] = Array.from({ length: 60 }, () => ({ x:0,y:0,vx:0,vy:0,active:false }));
    const bBullets: BBullet[] = Array.from({ length: 120 }, () => ({ x:0,y:0,vx:0,vy:0,active:false,type:'aimed' as BType }));
    const particles: Particle[] = [];

    let grazeCount = 0;
    const GRAZE_DIST = PLAYER_R + 22;
    const grazed = new Set<BBullet>();
    const keys: Record<string, boolean> = {};
    let gs: GState = 'playing';
    let frame = 0;

    // ── ヘルパー ──
    const getPhase = (): 1|2|3 => {
      if (boss.hp > BOSS_HP_MAX * 0.66) return 1;
      if (boss.hp > BOSS_HP_MAX * 0.33) return 2;
      return 3;
    };
    const phColor = (p: 1|2|3) => p === 1 ? '#38BDF8' : p === 2 ? '#A855F7' : '#EF4444';

    const burst = (x: number, y: number, color: string, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 5 + 1;
        const life = (30 + Math.random() * 30) | 0;
        particles.push({ x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life, maxLife:life, r:Math.random()*4+1, color });
      }
      if (particles.length > 500) particles.splice(0, particles.length - 500);
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

    // プレイヤー弾：角度指定で発射
    const fireShot = (fromX: number, fromY: number, angle: number) => {
      const slot = pBullets.find((b) => !b.active);
      if (!slot) return;
      slot.x = fromX; slot.y = fromY;
      slot.vx = Math.cos(angle) * P_BULLET_SPD;
      slot.vy = Math.sin(angle) * P_BULLET_SPD;
      slot.active = true;
    };

    const shootPlayer = () => {
      if (player.shotCd > 0 || gs !== 'playing') return;
      const up = -Math.PI / 2;

      if (player.focused) {
        // フォーカス: 3本の密集ショット（威力集中）
        fireShot(player.x - 5, player.y - PLAYER_R, up - 0.04);
        fireShot(player.x,     player.y - PLAYER_R, up);
        fireShot(player.x + 5, player.y - PLAYER_R, up + 0.04);
      } else {
        // 非フォーカス: 5本拡散ショット
        fireShot(player.x,      player.y - PLAYER_R, up);
        fireShot(player.x - 8,  player.y - PLAYER_R, up - 0.10);
        fireShot(player.x + 8,  player.y - PLAYER_R, up + 0.10);
        fireShot(player.x - 18, player.y - PLAYER_R, up - 0.20);
        fireShot(player.x + 18, player.y - PLAYER_R, up + 0.20);
      }
      player.shotCd = 8;
    };

    const activateSpell = (pattern: Pattern) => {
      ai.pattern = pattern;
      ai.patternTimer = 0;
      ai.spiralAngle = Math.random() * Math.PI * 2;
      ai.flashTimer = 8;
    };

    // ── 入力 ──
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === 'Escape') onExit();
    };
    const onKeyUp   = (e: KeyboardEvent) => { keys[e.code] = false; };
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

        // プレイヤー移動
        if (keys['ArrowLeft']  || keys['KeyA']) player.x -= spd;
        if (keys['ArrowRight'] || keys['KeyD']) player.x += spd;
        if (keys['ArrowUp']    || keys['KeyW']) player.y -= spd;
        if (keys['ArrowDown']  || keys['KeyS']) player.y += spd;
        player.x = Math.max(PLAYER_R, Math.min(W - PLAYER_R, player.x));
        player.y = Math.max(H * 0.45, Math.min(H - PLAYER_R - 10, player.y));
        if (player.inv    > 0) player.inv--;
        if (player.shotCd > 0) player.shotCd--;
        shootPlayer();

        // オプション追従（プレイヤーに遅れてついてくる）
        const optOffX = player.focused ? 22 : 38;
        const optOffY = player.focused ? -5 : 5;
        opts[0].x += (player.x - optOffX - opts[0].x) * 0.12;
        opts[0].y += (player.y + optOffY - opts[0].y) * 0.12;
        opts[1].x += (player.x + optOffX - opts[1].x) * 0.12;
        opts[1].y += (player.y + optOffY - opts[1].y) * 0.12;

        // オプション常時自動射撃
        if (player.optShotCd > 0) player.optShotCd--;
        if (player.optShotCd === 0 && gs === 'playing') {
          fireShot(opts[0].x, opts[0].y - 8, -Math.PI / 2 - 0.08);
          fireShot(opts[1].x, opts[1].y - 8, -Math.PI / 2 + 0.08);
          player.optShotCd = 10;
        }

        // ボス移動
        const bossSpd = ph === 1 ? 0.016 : ph === 2 ? 0.026 : 0.038;
        if (ai.pattern === 'dash') {
          boss.x += ai.dashVx; boss.y += ai.dashVy;
          ai.dashVx *= 0.93; ai.dashVy *= 0.93;
        } else {
          boss.moveTimer += bossSpd;
          boss.x = W/2 + Math.sin(boss.moveTimer)*W*0.30;
          boss.y = H*0.23 + Math.sin(boss.moveTimer*1.7)*H*0.06;
        }
        boss.x = Math.max(BOSS_R+10, Math.min(W-BOSS_R-10, boss.x));
        boss.y = Math.max(BOSS_R+10, Math.min(H*0.55, boss.y));
        if (boss.hitFlash > 0) boss.hitFlash--;
        if (ai.flashTimer  > 0) ai.flashTimer--;

        // 通常射撃
        const normalInterval = ph===1?68:ph===2?46:34;
        if (ai.pattern==='none') {
          ai.normalTimer++;
          if (ai.normalTimer >= normalInterval) {
            ai.normalTimer = 0;
            const angle = Math.atan2(player.y-boss.y, player.x-boss.x);
            const count = ph===1?1:ph===2?3:5;
            fireBoss(count, angle, ph===2?0.45:0.55, 'aimed', 3.0+ph*0.5);
            if (ph===3 && Math.random()<0.6) fireBoss(1, Math.random()*Math.PI*2, 0, 'random', 4.5);
          }
        }

        // スペルトリガー
        ai.specialCd--;
        if (ai.specialCd<=0 && ai.pattern==='none') {
          const opts2: Pattern[] =
            ph===1 ? ['circle','spiral','dash'] :
            ph===2 ? ['circle','dash','circle'] :
            ['circle','spiral','circle'];
          activateSpell(opts2[Math.floor(Math.random()*opts2.length)]);
          ai.specialCd = ph===1?210:ph===2?155:115;
        }

        // パターン実行
        ai.patternTimer++;
        if (ai.pattern==='circle') {
          if (ai.patternTimer===1) {
            const n = ph===1?14:ph===2?18:22;
            const spd2 = 3.5+ph*0.4;
            for (let i=0;i<n;i++) fireBoss(1,(i/n)*Math.PI*2,0,'circle',spd2);
            if (ph>=2) for (let i=0;i<n;i++) fireBoss(1,(i/n)*Math.PI*2+Math.PI/n,0,'circle',spd2*0.65);
          }
          if (ai.patternTimer>=2) ai.pattern='none';
        }
        if (ai.pattern==='spiral') {
          if (ai.patternTimer%3===0) {
            const spd2=3.8+ph*0.3;
            fireBoss(1,ai.spiralAngle,0,'spiral',spd2);
            if (ph>=2) fireBoss(1,ai.spiralAngle+Math.PI,0,'spiral',spd2);
            if (ph>=3) fireBoss(1,ai.spiralAngle+Math.PI*0.5,0,'spiral',spd2);
            ai.spiralAngle += ph===1?0.22:ph===2?0.18:0.15;
          }
          if (ai.patternTimer>=(ph===1?90:ph===2?72:60)) ai.pattern='none';
        }
        if (ai.pattern==='dash') {
          if (ai.patternTimer===1) {
            const dx=player.x-boss.x; const dy=player.y-boss.y;
            const len=Math.hypot(dx,dy)||1;
            ai.dashVx=(dx/len)*16; ai.dashVy=(dy/len)*16;
          }
          if (ai.patternTimer%8===0) fireBoss(4,Math.random()*Math.PI*2,Math.PI*0.6,'circle',2.8);
          if (ai.patternTimer>=55) { ai.pattern='none'; ai.dashVx=0; ai.dashVy=0; }
        }

        // プレイヤー弾 → ボスヒット
        for (const b of pBullets) {
          if (!b.active) continue;
          b.x+=b.vx; b.y+=b.vy;
          if (b.y<-10||b.x<-10||b.x>W+10) { b.active=false; continue; }
          const dx=b.x-boss.x; const dy=b.y-boss.y;
          if (dx*dx+dy*dy<(BOSS_R+P_BULLET_R)**2) {
            b.active=false;
            boss.hp=Math.max(0,boss.hp-1); boss.hitFlash=10;
            burst(b.x,b.y,phColor(ph),7);
            if (boss.hp<=0 && !boss.defeated) {
              boss.defeated=true; gs='victory';
              burst(boss.x,boss.y,'#38BDF8',60); burst(boss.x,boss.y,'#A855F7',60);
              burst(boss.x,boss.y,'#FFD700',40); burst(boss.x,boss.y,'#ffffff',25);
              setGstate('victory');
            }
          }
        }

        // ボス弾 → プレイヤーヒット
        for (const b of bBullets) {
          if (!b.active) continue;
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
            player.lives=Math.max(0,player.lives-1); player.inv=INVINCIBLE_F;
            burst(player.x,player.y,'#FF6B6B',14);
            if (player.lives<=0) { gs='gameover'; setGstate('gameover'); }
          }
        }

        if (frame%6===0) {
          setHpPct(Math.round((boss.hp/BOSS_HP_MAX)*100));
          setPhase(getPhase()); setLives(player.lives);
        }
      } else if (gs==='victory') {
        boss.victoryTimer++;
        if (boss.victoryTimer===150) setTimeout(onBossDefeated,0);
      }

      // パーティクル更新
      for (let i=particles.length-1;i>=0;i--) {
        const p=particles[i];
        p.x+=p.vx; p.y+=p.vy; p.vx*=0.93; p.vy*=0.93;
        if (--p.life<=0) particles.splice(i,1);
      }

      // ── 描画 ──
      ctx.fillStyle='#04080f';
      ctx.fillRect(0,0,W,H);

      if (ai.flashTimer>0) {
        ctx.globalAlpha=ai.flashTimer/8*0.35;
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
        const grad=ctx.createRadialGradient(boss.x,boss.y,BOSS_R*0.4,boss.x,boss.y,BOSS_R*3*plse);
        grad.addColorStop(0,col+'55'); grad.addColorStop(1,'transparent');
        ctx.fillStyle=grad;
        ctx.beginPath(); ctx.arc(boss.x,boss.y,BOSS_R*3*plse,0,Math.PI*2); ctx.fill();

        const fl=boss.hitFlash>0;
        ctx.shadowColor=fl?'#ffffff':col; ctx.shadowBlur=fl?60:30;
        ctx.fillStyle=fl?'#ffffff50':col+'28'; ctx.strokeStyle=fl?'#ffffff':col; ctx.lineWidth=fl?4:2.5;
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

        // ── ボス弾（東方スタイル: 色リング＋白コア） ──
        bBullets.forEach((b)=>{
          if (!b.active) return;
          const bc=B_COLORS[b.type];
          const br=b.type==='aimed'?7:8;
          ctx.shadowColor=bc; ctx.shadowBlur=br*1.8;
          ctx.fillStyle=bc;
          ctx.beginPath(); ctx.arc(b.x,b.y,br,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0; ctx.fillStyle='#ffffff';
          ctx.beginPath(); ctx.arc(b.x,b.y,br*0.42,0,Math.PI*2); ctx.fill();
        });

        // ── プレイヤー弾（針状の白い弾） ──
        pBullets.forEach((b)=>{
          if (!b.active) return;
          ctx.shadowColor='#ffffff'; ctx.shadowBlur=10;
          ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(b.x-b.vx*1.5,b.y-b.vy*1.5); ctx.stroke();
          ctx.fillStyle='#38BDF8';
          ctx.beginPath(); ctx.arc(b.x,b.y,P_BULLET_R,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0;
        });

        // ── オプション（子機: シアンの光点） ──
        opts.forEach((opt)=>{
          ctx.shadowColor='#38BDF8'; ctx.shadowBlur=18;
          ctx.fillStyle='#38BDF8';
          ctx.beginPath(); ctx.arc(opt.x,opt.y,5,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0;
          ctx.strokeStyle='#7DD3FA88'; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(opt.x,opt.y,9,0,Math.PI*2); ctx.stroke();
        });

        // ── プレイヤー（宇宙船） ──
        if (player.inv===0 || frame%6<3) {
          ctx.save();
          ctx.translate(player.x,player.y);

          // フォーカス時: ヒットボックスサークル表示
          if (player.focused) {
            ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.arc(0,0,HITBOX_R+3,0,Math.PI*2); ctx.stroke();
          }

          ctx.shadowColor='#38BDF8'; ctx.shadowBlur=22;

          // 翼（左右）
          ctx.fillStyle='#1E6A9E'; ctx.strokeStyle='#7DD3FA'; ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(-5,-4); ctx.lineTo(-20,6); ctx.lineTo(-16,12); ctx.lineTo(-4,6);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(5,-4); ctx.lineTo(20,6); ctx.lineTo(16,12); ctx.lineTo(4,6);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          // 機体（三角形）
          ctx.fillStyle='#38BDF8'; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5;
          ctx.beginPath();
          ctx.moveTo(0,-PLAYER_R);
          ctx.lineTo(PLAYER_R*0.6,PLAYER_R*0.7);
          ctx.lineTo(0,PLAYER_R*0.3);
          ctx.lineTo(-PLAYER_R*0.6,PLAYER_R*0.7);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          // コックピット（小さい丸）
          ctx.fillStyle='#ffffff'; ctx.shadowColor='#ffffff'; ctx.shadowBlur=8;
          ctx.beginPath(); ctx.arc(0,-PLAYER_R*0.4,3,0,Math.PI*2); ctx.fill();

          // エンジン炎
          const flameH=5+Math.random()*4;
          ctx.fillStyle='#FFD700'; ctx.shadowColor='#FF8C00'; ctx.shadowBlur=12;
          ctx.beginPath();
          ctx.moveTo(-5,PLAYER_R*0.7); ctx.lineTo(0,PLAYER_R*0.7+flameH); ctx.lineTo(5,PLAYER_R*0.7);
          ctx.closePath(); ctx.fill();

          ctx.shadowBlur=0;
          ctx.restore();
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

      if (gs==='victory' && boss.victoryTimer<30) {
        ctx.globalAlpha=((30-boss.victoryTimer)/30)*0.55;
        ctx.fillStyle='#38BDF8'; ctx.fillRect(0,0,W,H); ctx.globalAlpha=1;
      }

      rafId=requestAnimationFrame(loop);
    };

    rafId=requestAnimationFrame(loop);
    return ()=>{
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown',onKeyDown); window.removeEventListener('keyup',onKeyUp);
      window.removeEventListener('resize',onResize);
    };
  }, [onBossDefeated, onExit]);

  const col        = phase===1?'#38BDF8':phase===2?'#A855F7':'#EF4444';
  const phaseLabel = phase===1?'PHASE I':phase===2?'PHASE II':'PHASE III !!!';

  return (
    <div className="fixed inset-0 z-50" style={{background:'#04080f'}}>
      <canvas ref={canvasRef} style={{display:'block'}} />

      {/* ボスHP */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-72">
        <div className="flex justify-between text-[10px] font-mono mb-1" style={{color:col}}>
          <span>BOSS</span><span>{phaseLabel}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-black/60 border overflow-hidden" style={{borderColor:col+'50'}}>
          <div className="h-full rounded-full transition-all duration-100"
            style={{width:`${hpPct}%`,background:`linear-gradient(90deg,${col},${col}88)`}} />
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
          WASD/矢印 移動　Shift 低速フォーカス（当たり判定表示）
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
