import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { ProjectCard } from '../components/ProjectCard';
import { FeaturedProjectCard } from '../components/FeaturedProjectCard';
import { projects, type Project, type FeaturedDetail } from '../data/projects';

const featuredProjects = projects.filter(
  (p): p is Project & { featured: FeaturedDetail } => Boolean(p.featured),
);
const otherProjects = projects.filter((p) => !p.featured);

const aiUsages = [
  '企画段階での壁打ち・アイデア出し',
  'アーキテクチャや設計方針の相談',
  'コードの実装・リファクタリング',
  'コードレビュー、テストケースの洗い出し',
  '画像・BGM・効果音などのアセット生成',
];

export function Works() {
  // セクションが縦長（スマホで数千px）なので、割合ベースの閾値だと永遠に表示されない
  const { ref, isVisible } = useIntersectionObserver(0);

  return (
    <section id="works" className="py-24 px-6 grid-bg">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionTitle
            label="// 01.works"
            title="制作物"
            // subtitle="ゲーム開発・インタラクティブシステム・技術的探求を示す代表的なプロジェクト。"
          />

          {featuredProjects.length > 0 ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-pixel text-[10px] text-[#FFD200] animate-blink">▶ FEATURED</span>
                <span className="font-pixel text-[8px] text-[#6b6a58]">代表作</span>
                <div className="h-1 flex-1" style={{ background: 'var(--line)' }} />
              </div>

              <div className="space-y-8 mb-16">
                {featuredProjects.map((project, i) => (
                  <FeaturedProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </>
          ) : null}

          <div className="flex items-center gap-3 mb-6">
            <span className="font-pixel text-[10px] text-[#FFD200]">▶ SELECT YOUR GAME</span>
            <span className="font-pixel text-[8px] text-[#6b6a58]">{otherProjects.length} CABINETS</span>
            <div className="h-1 flex-1" style={{ background: 'var(--line)' }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {otherProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* Generative AI usage disclosure */}
          <div
            className="mt-16 p-5"
            style={{ border: '2px dashed var(--orange)', background: 'rgba(255,122,24,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="font-pixel text-[9px] text-[#FF7A18]">生成AIの利用について</span>
              <div className="h-1 flex-1" style={{ background: 'rgba(255,122,24,0.2)' }} />
            </div>
            <p className="font-dot text-[#B7B29A] text-xs leading-relaxed mb-3">
              掲載作品の開発では、Claude Code（Anthropic社の生成AIツール）を次の用途で利用しています。
            </p>
            <ul className="font-dot text-[#B7B29A] text-xs leading-relaxed mb-3 grid sm:grid-cols-2 gap-x-6 gap-y-1">
              {aiUsages.map((u) => (
                <li key={u} className="flex gap-2">
                  <span className="text-[#FF7A18]">▸</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
            <p className="font-dot text-[#B7B29A] text-xs leading-relaxed">
              特に ARCHEIA ではコードの大部分を Claude Code に生成させており、自分は方向性の決定、設計ルールの策定、試遊に基づく改善判断、Animator・カメラ・共通部品などの実装を担当しています。
              いずれの作品でも、生成されたコードや設計案は必ず自分で内容を理解し、必要に応じて修正した上で採用しており、
              <span className="text-[#F5F1E0] font-bold">最終的な判断は自分で行う</span>ことを徹底しています。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
