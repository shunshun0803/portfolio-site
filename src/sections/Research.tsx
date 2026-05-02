import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';

const researchAreas = [
  {
    title: 'ゲームプレイシステム',
    desc: '戦闘メカニクス・プレイヤーアクション・スタミナシステム・ステートマシンの設計と実装。ゲームフィールを最優先に考えた開発。',
    color: '#0EA5E9',
    icon: '⚔️',
  },
  {
    title: '敵AI・行動設計',
    desc: 'NavMesh・ビヘイビアツリー・状態遷移を活用した、動的でリアクティブなボスAIの構築。',
    color: '#A855F7',
    icon: '🤖',
  },
  {
    title: 'アニメーション・フィードバック',
    desc: 'アニメーションブレンド・ヒットストップ・カメラシェイク・VFXトリガーなど、表現力を高めるフィードバック実装。',
    color: '#16A34A',
    icon: '🎬',
  },
  {
    title: 'サウンド・感情表現',
    desc: 'アダプティブオーディオ・BGM遷移・サウンド主導のフィードバックを統合し、感情に響くゲームプレイを実現。',
    color: '#EA580C',
    icon: '🔊',
  },
];

export function Research() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="research" className="py-24 px-6 grid-bg">
      <div className="max-w-5xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionTitle
            label="// 04.research"
            title="研究・開発"
            subtitle="インタラクティブシステム・AI行動・表現力豊かなゲームデザインの交差点を探求しています。"
          />

          <GlassCard className="p-6 mb-8">
            <p className="text-[#475569] leading-relaxed text-sm">
              現在は<span className="text-[#0EA5E9] font-semibold">ゲームAI研究を目的とした3Dアクションゲームプロトタイプ</span>の開発に取り組んでいます。
              プレイヤーアクション・ボスの行動・アニメーション制御・ヒットストップ・カメラシェイク・VFX・BGMなどのフィードバックシステムを実装中です。
              今後は<span className="text-[#A855F7] font-semibold">AIを用いた行動制御</span>や、より豊かな表現を持つインタラクティブシステムの探求を予定しており、
              機械学習やアダプティブAIの統合も視野に入れています。
            </p>
          </GlassCard>

          <div className="grid sm:grid-cols-2 gap-4">
            {researchAreas.map((area) => (
              <GlassCard key={area.title} className="p-5 group">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{area.icon}</span>
                  <div>
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{ color: area.color }}
                    >
                      {area.title}
                    </h3>
                    <p className="text-[#475569] text-xs leading-relaxed">{area.desc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Future direction */}
          <div className="mt-8 p-5 rounded-xl border border-dashed border-[#A855F7]/40 bg-[#F3E8FF]/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-[#A855F7] font-semibold">今後の展望</span>
              <div className="h-px flex-1 bg-[#A855F7]/20" />
            </div>
            <p className="text-[#475569] text-xs leading-relaxed">
              アダプティブ敵AIへの機械学習統合・プロシージャルアニメーションブレンド・ゲームプレイ状態に連動したリアルタイム音響合成の探求を予定しています。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
