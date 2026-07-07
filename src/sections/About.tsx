import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';

const highlights = [
  { icon: '🎮', label: 'ゲーム開発', desc: 'アクション・3Dヴァンサバ・トップダウンSTG・スレスパ風タワーディフェンスなど、多ジャンルのUnityゲーム開発', accent: 'yellow' as const },
  { icon: '🤖', label: 'AI', desc: '対戦ゲームへの機械学習統合によるゲームAI開発。行動学習・意思決定・ステートマシンの研究と実装', accent: 'orange' as const },
  { icon: '🔊', label: 'サウンド', desc: 'Logic Proを用いた楽曲・効果音制作と、ゲームエンジン内のインタラクティブ音響システム設計', accent: 'orange' as const },
  { icon: '🎨', label: 'グラフィックス', desc: 'Blenderによる3Dモデリング・アニメーション制作とVFX・シェーダーによるビジュアルフィードバック実装', accent: 'yellow' as const },
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
          <SectionTitle label="// 03.about" title="自己紹介" />

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Text block */}
            <div className="space-y-4">
              <p className="font-dot text-[#F5F1E0] leading-relaxed">
                <span className="text-[#FFD200] font-bold">ゲーム開発</span>・
                <span className="text-[#FF7A18] font-bold">AI</span>・
                <span className="text-[#FFD200] font-bold">サウンド</span>・
                <span className="text-[#FF7A18] font-bold">グラフィックス</span>
                に興味を持つ情報系の学生です。
              </p>
              <p className="font-dot text-[#B7B29A] leading-relaxed text-sm">
                主にUnityとC#を使用してゲーム開発をしており、戦闘システム・プレイヤー制御・敵AI・アニメーション制御・フィードバック設計に取り組んでいます。
              </p>
              <p className="font-dot text-[#B7B29A] leading-relaxed text-sm">
                正しく動作するだけでなく、操作していて気持ちいいと感じられる、表現力豊かでレスポンシブなゲーム体験の構築を目指しています。
              </p>

              {/* HUD-style status window */}
              <GlassCard accent="yellow" lift={false} className="p-4 mt-6">
                <div className="space-y-2.5 text-xs">
                  {[
                    { key: 'ROLE', val: 'ゲームクライアントエンジニア / Unity開発者' },
                    { key: 'FOCUS', val: 'ゲームプレイ・AI・アニメーション・サウンド・グラフィックス' },
                    { key: 'TECH', val: 'Unity (C#)・Go・Java・Python・Blender・HLSL' },
                    { key: 'STATUS', val: '就活中' },
                  ].map((row) => (
                    <div key={row.key} className="flex gap-3">
                      <span className="font-pixel text-[8px] text-[#FFD200] w-24 shrink-0 pt-0.5">{row.key}</span>
                      <span className="font-dot text-[#B7B29A]">{row.val}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((h) => (
                <GlassCard key={h.label} accent={h.accent} className="p-4 group cursor-default">
                  <div className="text-2xl mb-2">{h.icon}</div>
                  <div className="font-dot text-sm font-bold mb-1 text-[#F5F1E0] group-hover:text-[#FFD200] transition-colors duration-200">
                    {h.label}
                  </div>
                  <div className="font-dot text-[#B7B29A] text-xs leading-relaxed">{h.desc}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
