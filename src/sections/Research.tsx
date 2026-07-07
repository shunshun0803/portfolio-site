import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';
import { ProgressLog } from '../components/ProgressLog';

const researchAreas = [
  {
    title: '音響特徴抽出',
    desc: '音声・音楽信号から音量・ピッチ・テンポ・MFCCなどの特徴量をリアルタイムで抽出し、アニメーション制御の入力データとして活用。',
    color: '#FFD200',
    accent: 'yellow' as const,
    icon: '🎵',
  },
  {
    title: '感情推定AI',
    desc: '抽出した音響特徴を機械学習モデルで処理し、喜び・怒り・悲しみなどの感情ラベルおよび強度をリアルタイムで推定して出力。',
    color: '#FF7A18',
    accent: 'orange' as const,
    icon: '🤖',
  },
  {
    title: '表情・ボディ制御',
    desc: '感情推定の出力をリアルタイムで表情ブレンドシェイプや体のポーズ・身振りに変換し、キャラクターのアニメーションへ反映。',
    color: '#FF7A18',
    accent: 'orange' as const,
    icon: '🎭',
  },
  {
    title: 'リアルタイムパイプライン',
    desc: '音入力→特徴抽出→感情推定→アニメーション出力の一連のパイプラインを低遅延で動作させるシステムアーキテクチャの設計。',
    color: '#FFD200',
    accent: 'yellow' as const,
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
          <SectionTitle label="// 02.research" title="研究・開発" />

          <GlassCard accent="yellow" lift={false} className="p-6 mb-8">
            <p className="font-dot text-[#B7B29A] leading-relaxed text-sm">
              音から<span className="text-[#FFD200] font-bold">音量・ピッチ・テンポ・周波数スペクトル</span>などの特徴量を抽出し、
              機械学習モデルで感情ラベルに変換。その結果をキャラクターの
              <span className="text-[#FF7A18] font-bold">表情ブレンドシェイプ・体の動き</span>にリアルタイムで反映する
              アニメーションシステムの研究開発に取り組んでいます。
            </p>
          </GlassCard>

          <div className="grid sm:grid-cols-2 gap-4">
            {researchAreas.map((area) => (
              <GlassCard key={area.title} accent={area.accent} className="p-5 group">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{area.icon}</span>
                  <div>
                    <h3 className="font-dot text-sm font-bold mb-1" style={{ color: area.color }}>
                      {area.title}
                    </h3>
                    <p className="font-dot text-[#B7B29A] text-xs leading-relaxed">{area.desc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Progress movies (dev log) */}
          <ProgressLog />

          {/* Future direction */}
          <div
            className="mt-10 p-5"
            style={{ border: '2px dashed var(--orange)', background: 'rgba(255,122,24,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-pixel text-[9px] text-[#FF7A18]">今後の展望</span>
              <div className="h-1 flex-1" style={{ background: 'rgba(255,122,24,0.2)' }} />
            </div>
            <p className="font-dot text-[#B7B29A] text-xs leading-relaxed">
              複数感情の中間表現（感情ブレンド）への対応・音楽/音声/環境音それぞれへのモデル特化・リアルタイム推論の最適化による遅延削減を予定。
              将来的にはゲームキャラクターが環境音やBGMに応じて自律的に反応するインタラクティブシステムへの発展を目指しています。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
