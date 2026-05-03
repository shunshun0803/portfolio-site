import { ThreeHeroScene } from '../components/ThreeHeroScene';

interface HeroProps {
  onStartBoss: () => void;
}

export function Hero({ onStartBoss }: HeroProps) {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center grid-bg overflow-hidden bg-gradient-to-br from-[#F0F9FF] via-[#F8FAFC] to-[#FAF5FF]"
    >
      {/* Radial accent glows */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 pt-20 pb-8">
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse-glow" />
              <span className="text-xs font-mono text-[#0EA5E9]">就活中</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-3">
              shunshun0803
            </h1>

            <div className="text-lg md:text-xl font-mono mb-5">
              <span className="text-[#0EA5E9]">ゲームクライアントエンジニア</span>
              <span className="text-[#94A3B8]"> / </span>
              <span className="text-[#A855F7]">Unity開発者</span>
            </div>

            <p className="text-[#475569] text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
              Unity・C#・アニメーション・AI・サウンドを活用したインタラクティブなゲームシステムを開発しています。
              応答性の高いゲームプレイ体験と、表現力豊かなリアルタイムインタラクションの実現に取り組んでいます。
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start flex-wrap">
              <button
                onClick={() => scrollTo('#works')}
                className="px-6 py-3 rounded-lg font-medium text-sm text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #38BDF8, #A855F7)',
                  boxShadow: '0 4px 20px rgba(56,189,248,0.35)',
                }}
              >
                制作物を見る
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="px-6 py-3 rounded-lg font-medium text-sm text-[#0EA5E9] border border-[#38BDF8]/50 hover:bg-[#38BDF8]/10 hover:border-[#38BDF8] transition-all duration-200"
              >
                お問い合わせ
              </button>
              <button
                onClick={onStartBoss}
                className="px-6 py-3 rounded-lg font-medium text-sm text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #EF4444, #A855F7)',
                  boxShadow: '0 4px 20px rgba(239,68,68,0.30)',
                }}
              >
                ⚔ ミニゲームを遊ぶ
              </button>
            </div>

            <div className="mt-10 flex gap-6 justify-center md:justify-start">
              {[
                { value: 'Unity', label: 'メインエンジン' },
                { value: 'C#',    label: 'メイン言語' },
                { value: '3D',    label: 'アクションゲーム' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-[#0EA5E9] font-bold font-mono text-lg">{s.value}</div>
                  <div className="text-[#64748B] text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Three.js */}
          <div className="flex-1 w-full max-w-sm md:max-w-none h-72 md:h-[480px]">
            <ThreeHeroScene />
          </div>
        </div>

        <div className="flex justify-center pb-8">
          <button
            onClick={() => scrollTo('#about')}
            className="flex flex-col items-center gap-1 text-[#94A3B8] hover:text-[#0EA5E9] transition-colors duration-200"
          >
            <span className="text-xs font-mono">スクロール</span>
            <div className="w-px h-8 bg-gradient-to-b from-[#38BDF8]/60 to-transparent" />
          </button>
        </div>
      </div>
    </section>
  );
}
