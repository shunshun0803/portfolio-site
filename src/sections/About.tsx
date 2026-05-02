import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';

const highlights = [
  { icon: '🎮', label: 'ゲーム開発', desc: '戦闘・AI・ゲームフィールに注力したUnityプロトタイプ開発' },
  { icon: '🤖', label: 'AI・アニメーション', desc: '敵キャラクターの行動・ステートマシン・フィードバック実装' },
  { icon: '🔊', label: 'サウンド・表現', desc: '音響統合とインタラクティブな感情表現設計' },
  { icon: '🌐', label: 'Web・ツール', desc: 'React・TypeScript・Three.jsを用いたUI開発' },
];

export function About() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionTitle label="// 01.about" title="自己紹介" />

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Text block */}
            <div className="space-y-4">
              <p className="text-[#0F172A] leading-relaxed">
                <span className="text-[#0EA5E9] font-semibold">ゲーム開発</span>・
                <span className="text-[#A855F7] font-semibold">アニメーション</span>・
                <span className="text-[#0EA5E9] font-semibold">AI</span>・
                <span className="text-[#A855F7] font-semibold">サウンド</span>
                に興味を持つ情報系の学生です。
              </p>
              <p className="text-[#475569] leading-relaxed text-sm">
                主にUnityとC#を使用してゲームプレイプロトタイプを開発しており、戦闘システム・プレイヤー制御・敵AI・アニメーション制御・フィードバック設計に取り組んでいます。
              </p>
              <p className="text-[#475569] leading-relaxed text-sm">
                正しく動作するだけでなく、操作していて気持ちいいと感じられる、表現力豊かでレスポンシブなゲーム体験の構築を目指しています。
              </p>

              {/* HUD-style info */}
              <GlassCard className="p-4 mt-6">
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { key: 'ROLE', val: 'ゲームクライアントエンジニア / Unity開発者' },
                    { key: 'FOCUS', val: 'ゲームプレイシステム・AI・アニメーション' },
                    { key: 'ENGINE', val: 'Unity (C#)' },
                    { key: 'STATUS', val: 'インターン・就職機会を探しています' },
                  ].map((row) => (
                    <div key={row.key} className="flex gap-3">
                      <span className="text-[#0EA5E9] w-16 shrink-0">{row.key}</span>
                      <span className="text-[#475569]">{row.val}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h) => (
                <GlassCard key={h.label} glowColor="cyan" className="p-4 group cursor-default">
                  <div className="text-2xl mb-2">{h.icon}</div>
                  <div className="text-[#0F172A] text-xs font-semibold mb-1 group-hover:text-[#0EA5E9] transition-colors duration-200">
                    {h.label}
                  </div>
                  <div className="text-[#475569] text-xs leading-relaxed">{h.desc}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
