import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';
import { SkillTag } from '../components/SkillTag';
import { skillCategories } from '../data/skills';

// Map the data's color names onto the arcade two-tone palette.
const accentMap: Record<string, 'yellow' | 'orange'> = {
  cyan: 'yellow',
  green: 'yellow',
  purple: 'orange',
  orange: 'orange',
};
const hexMap: Record<string, string> = {
  cyan: '#FFD200',
  green: '#FFD200',
  purple: '#FF7A18',
  orange: '#FF7A18',
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
          <SectionTitle label="// 04.skills" title="スキル" />

          <div className="grid sm:grid-cols-2 gap-5">
            {skillCategories.map((cat) => (
              <GlassCard key={cat.category} accent={accentMap[cat.color]} className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-4" style={{ backgroundColor: hexMap[cat.color] }} />
                  <h3 className="font-pixel text-[10px]" style={{ color: hexMap[cat.color] }}>
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
