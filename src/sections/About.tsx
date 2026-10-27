import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';
import { timeline } from '../data/timeline';
import { todoColor } from '../utils/todo';

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

              {/* Motivation */}
              <div className="p-4" style={{ border: '2px dashed var(--orange)', background: 'rgba(255,122,24,0.06)' }}>
                <div className="font-pixel text-[9px] text-[#FF7A18] mb-2">▶ MOTIVATION</div>
                <p className="font-dot text-[#F5F1E0] leading-relaxed text-sm">
                  ゲーム開発に大きなやりがいを感じています。将来は
                  <span className="text-[#FFD200] font-bold">ゲーム会社</span>
                  で、ゲームクライアントエンジニアとして働きたいと考えています。
                </p>
              </div>

              {/* HUD-style status window */}
              <GlassCard accent="yellow" lift={false} className="p-4 mt-6">
                <div className="space-y-2.5 text-xs">
                  {[
                    { key: 'NAME', val: '伊藤 俊生' },
                    { key: 'SCHOOL', val: '会津大学大学院 修士1年' },
                    { key: 'GRADUATION', val: '2028年3月修了予定（28卒）' },
                    { key: 'TARGET', val: 'ゲームクライアントエンジニア' },
                    { key: 'FOCUS', val: 'ゲームプレイ・AI・アニメーション・サウンド・グラフィックス' },
                    { key: 'TECH', val: 'Unity (C#)・Go・Java・Python・Blender・HLSL' },
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

          {/* Timeline */}
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-pixel text-[10px] text-[#FFD200]">▶ HISTORY</span>
              <span className="font-pixel text-[8px] text-[#6b6a58]">経歴・実績</span>
              <div className="h-1 flex-1" style={{ background: 'var(--line)' }} />
            </div>

            <ol className="relative pl-6" style={{ borderLeft: '3px solid var(--line)' }}>
              {timeline.map((ev) => {
                const accent = ev.highlight ? '#FF7A18' : '#FFD200';
                return (
                  <li key={ev.title} className="relative mb-6 last:mb-0">
                    <span
                      className="absolute -left-[33px] top-1 w-3.5 h-3.5"
                      style={{ background: accent, border: '2px solid #000', boxShadow: '2px 2px 0 #000' }}
                      aria-hidden="true"
                    />
                    <div className="font-pixel text-[9px] mb-1" style={{ color: todoColor(ev.date, accent) }}>{ev.date}</div>
                    <div className="font-dot text-sm font-bold text-[#F5F1E0]">
                      {ev.title}
                      {ev.highlight ? (
                        <span className="ml-2 font-pixel text-[7px] px-1.5 py-0.5 text-black align-middle" style={{ background: accent }}>
                          PICK UP
                        </span>
                      ) : null}
                    </div>
                    {ev.detail ? (
                      <div className="font-dot text-xs text-[#B7B29A] leading-relaxed mt-1">{ev.detail}</div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
