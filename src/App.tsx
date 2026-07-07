import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { ParticleBackground } from './components/ParticleBackground';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Works } from './sections/Works';
import { Skills } from './sections/Skills';
import { Research } from './sections/Research';
import { Contact } from './sections/Contact';
import { scrollStore } from './store/scroll';
import { type GameMode } from './store/game';
import { BossGame, type BossStats } from './components/game/BossGame';
import { PortalOverlay } from './components/game/PortalOverlay';
import { ExploreGame } from './components/game/ExploreGame';
import { SocialSidebar } from './components/SocialSidebar';

function App() {
  const [gameMode,  setGameMode]  = useState<GameMode>('idle');
  const [bossKey,   setBossKey]   = useState(0);
  const [bossStats, setBossStats] = useState<BossStats | null>(null);

  useEffect(() => {
    const onScroll = () => {
      scrollStore.heroProgress = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleStartBoss    = () => setGameMode('boss');
  const handleBossDefeated = (stats: BossStats) => { setBossStats(stats); setGameMode('portal'); };
  const handlePortalDone   = () => setGameMode('explore');
  const handleExitGame     = () => setGameMode('idle');
  const handleRetryBoss    = () => setBossKey((k) => k + 1);

  return (
    <div className="min-h-screen scanlines" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <ParticleBackground />

      <SocialSidebar />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main>
          <Hero onStartBoss={handleStartBoss} />
          <Works />
          <Research />
          <About />
          <Skills />
          <Contact />
        </main>
      </div>

      {gameMode === 'boss' && (
        <BossGame
          key={bossKey}
          onBossDefeated={handleBossDefeated}
          onExit={handleExitGame}
          onRetry={handleRetryBoss}
        />
      )}
      {gameMode === 'portal'  && <PortalOverlay onComplete={handlePortalDone} />}
      {gameMode === 'explore' && <ExploreGame   onExit={handleExitGame} bossStats={bossStats} />}
    </div>
  );
}

export default App;
