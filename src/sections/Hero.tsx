import { PixelHero } from '../components/PixelHero';

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
      className="relative min-h-screen flex items-center grid-bg overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 pt-20 pb-8">
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border-2"
              style={{ borderColor: 'var(--green)', background: 'rgba(0,0,0,0.4)', boxShadow: '2px 2px 0 #000' }}
            >
              <span className="w-2 h-2 bg-[#46E86A] animate-pulse-glow" />
              <span className="font-pixel text-[8px] text-[#46E86A]">PLAYER 1 · 就活中</span>
            </div>

            <h1 className="font-pixel text-2xl md:text-3xl lg:text-4xl text-[#FFD200] leading-tight mb-5 text-glow-yellow">
              shunshun0803
            </h1>

            <div className="font-dot text-lg md:text-xl mb-5">
              <span className="text-[#FFD200]">ゲームクライアントエンジニア</span>
              <span className="text-[#6b6a58]"> / </span>
              <span className="text-[#FF7A18]">Unity開発者</span>
            </div>

            <p className="font-dot text-[#B7B29A] text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
              Unity・C#・アニメーション・AI・サウンドを活用したインタラクティブなゲームシステムを開発しています。
              応答性の高いゲームプレイ体験と、表現力豊かなリアルタイムインタラクションの実現に取り組んでいます。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start flex-wrap">
              <button
                onClick={onStartBoss}
                className="pixel-btn font-pixel text-[10px] px-6 py-4 text-black animate-pulse-glow"
                style={{ background: 'var(--yellow)' }}
              >
                ▶ PRESS START
              </button>
              <button
                onClick={() => scrollTo('#works')}
                className="pixel-btn font-pixel text-[10px] px-6 py-4 text-[#FFD200]"
                style={{ background: 'var(--panel)', borderColor: 'var(--yellow)' }}
              >
                制作物を見る
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="pixel-btn font-pixel text-[10px] px-6 py-4 text-[#FF7A18]"
                style={{ background: 'var(--panel)', borderColor: 'var(--orange)' }}
              >
                お問い合わせ
              </button>
            </div>

            <div className="mt-10 flex gap-8 justify-center md:justify-start">
              {[
                { value: 'Unity', label: 'ENGINE' },
                { value: 'C#',    label: 'LANG' },
                { value: '3D',    label: 'ACTION' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-[#FFD200] font-pixel text-sm">{s.value}</div>
                  <div className="text-[#6b6a58] font-pixel text-[8px] mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pixel canvas */}
          <div className="flex-1 w-full max-w-sm md:max-w-none h-72 md:h-[480px]">
            <PixelHero />
          </div>
        </div>

        <div className="flex justify-center pb-8">
          <button
            onClick={() => scrollTo('#works')}
            className="flex flex-col items-center gap-2 text-[#6b6a58] hover:text-[#FFD200] transition-colors duration-200"
          >
            <span className="font-pixel text-[8px]">SCROLL</span>
            <span className="animate-float">▼</span>
          </button>
        </div>
      </div>
    </section>
  );
}
