import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';

const researchAreas = [
  {
    title: '音響特徴抽出',
    desc: '音声・音楽信号から音量・ピッチ・テンポ・MFCCなどの特徴量をリアルタイムで抽出し、アニメーション制御の入力データとして活用。',
    color: '#0EA5E9',
    icon: '🎵',
  },
  {
    title: '感情推定AI',
    desc: '抽出した音響特徴を機械学習モデルで処理し、喜び・怒り・悲しみなどの感情ラベルおよび強度をリアルタイムで推定して出力。',
    color: '#A855F7',
    icon: '🤖',
  },
  {
    title: '表情・ボディ制御',
    desc: '感情推定の出力をリアルタイムで表情ブレンドシェイプや体のポーズ・身振りに変換し、キャラクターのアニメーションへ反映。',
    color: '#16A34A',
    icon: '🎭',
  },
  {
    title: 'リアルタイムパイプライン',
    desc: '音入力→特徴抽出→感情推定→アニメーション出力の一連のパイプラインを低遅延で動作させるシステムアーキテクチャの設計。',
    color: '#EA580C',
    icon: '🔄',
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
            // subtitle="音響信号からキャラクターの感情・動きをリアルタイムで生成する、音とアニメーションの融合研究。"
          />

          <GlassCard className="p-6 mb-8">
            <p className="text-[#475569] leading-relaxed text-sm">
              音から<span className="text-[#0EA5E9] font-semibold">音量・ピッチ・テンポ・周波数スペクトル</span>などの特徴量を抽出し、
              機械学習モデルで感情ラベルに変換。その結果をキャラクターの
              <span className="text-[#A855F7] font-semibold">表情ブレンドシェイプ・体の動き</span>にリアルタイムで反映する
              アニメーションシステムの研究開発に取り組んでいます。
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
              複数感情の中間表現（感情ブレンド）への対応・音楽/音声/環境音それぞれへのモデル特化・リアルタイム推論の最適化による遅延削減を予定。
              将来的にはゲームキャラクターが環境音やBGMに応じて自律的に反応するインタラクティブシステムへの発展を目指しています。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
