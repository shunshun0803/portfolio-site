import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';
import { SkillTag } from '../components/SkillTag';
import { skillCategories } from '../data/skills';

const categoryGlowMap = {
  cyan: 'cyan' as const,
  purple: 'purple' as const,
  green: 'none' as const,
  orange: 'none' as const,
};

const categoryBorderMap: Record<string, string> = {
  cyan: '#0EA5E9',
  purple: '#A855F7',
  green: '#16A34A',
  orange: '#EA580C',
};

export function Skills() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionTitle
            label="// 03.skills"
            title="スキル"
            subtitle="実際に使用している技術・ツール一覧。偽のゲージなし、実力ベースのタグ表示。"
          />

          <div className="grid sm:grid-cols-2 gap-5">
            {skillCategories.map((cat) => (
              <GlassCard
                key={cat.category}
                glowColor={categoryGlowMap[cat.color]}
                className="p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ backgroundColor: categoryBorderMap[cat.color] }}
                  />
                  <h3
                    className="text-sm font-mono font-semibold"
                    style={{ color: categoryBorderMap[cat.color] }}
                  >
                    {cat.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <SkillTag key={skill} label={skill} color={cat.color} />
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
