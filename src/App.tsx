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
import { BossGame } from './components/game/BossGame';
import { PortalOverlay } from './components/game/PortalOverlay';
import { ExploreGame } from './components/game/ExploreGame';

function App() {
  const [gameMode, setGameMode] = useState<GameMode>('idle');
  const [bossKey,  setBossKey]  = useState(0);

  useEffect(() => {
    const onScroll = () => {
      scrollStore.heroProgress = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleStartBoss    = () => setGameMode('boss');
  const handleBossDefeated = () => setGameMode('portal');
  const handlePortalDone   = () => setGameMode('explore');
  const handleExitGame     = () => setGameMode('idle');
  const handleRetryBoss    = () => setBossKey((k) => k + 1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <ParticleBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main>
          <Hero onStartBoss={handleStartBoss} />
          <About />
          <Works />
          <Skills />
          <Research />
          <Contact />
        </main>
      </div>

      {/* Game overlays (full-screen, z-50) */}
      {gameMode === 'boss' && (
        <BossGame
          key={bossKey}
          onBossDefeated={handleBossDefeated}
          onExit={handleExitGame}
          onRetry={handleRetryBoss}
        />
      )}
      {gameMode === 'portal'  && <PortalOverlay onComplete={handlePortalDone} />}
      {gameMode === 'explore' && <ExploreGame   onExit={handleExitGame} />}
    </div>
  );
}

export default App;
