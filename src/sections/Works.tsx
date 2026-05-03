import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { ProjectCard } from '../components/ProjectCard';
import { projects } from '../data/projects';

export function Works() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="works" className="py-24 px-6 grid-bg">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionTitle
            label="// 02.works"
            title="制作物"
            // subtitle="ゲーム開発・インタラクティブシステム・技術的探求を示す代表的なプロジェクト。"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
