import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { ProjectCard } from '../components/ProjectCard';
import { FeaturedProjectCard } from '../components/FeaturedProjectCard';
import { projects, type Project, type FeaturedDetail } from '../data/projects';

const featuredProjects = projects.filter(
  (p): p is Project & { featured: FeaturedDetail } => Boolean(p.featured),
);
const otherProjects = projects.filter((p) => !p.featured);

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
        </div>
      </div>
    </section>
  );
}
