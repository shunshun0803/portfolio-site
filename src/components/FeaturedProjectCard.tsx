import { type Project, type FeaturedDetail } from '../data/projects';
import { SkillTag } from './SkillTag';
import { ProjectThumbnail } from './ProjectThumbnail';

interface FeaturedProjectCardProps {
  project: Project & { featured: FeaturedDetail };
  index: number;
}

// 未記入のプレースホルダーは赤で目立たせる（埋めれば自動で通常色に戻る）
const TODO_MARK = '【要記入】';
const textColor = (text: string, normal: string) => (text.includes(TODO_MARK) ? '#FF4040' : normal);

const stepLabels = [
  { key: 'challenge', label: '課題' },
  { key: 'approach',  label: '工夫' },
  { key: 'result',    label: '結果' },
] as const;

/**
 * 代表作用のワイドカード。
 * 左: スクリーン（サムネイル） / 右: 期間・体制・担当 → 課題→工夫→結果 → 技術 → リンク。
 */
export function FeaturedProjectCard({ project, index }: FeaturedProjectCardProps) {
  const accentHex = index % 2 === 0 ? '#FFD200' : '#FF7A18';
  const { period, team, role, points, outcome } = project.featured;

  const links = [
    { label: 'GITHUB', href: project.githubUrl },
    { label: 'DEMO',   href: project.demoUrl },
    { label: 'VIDEO',  href: project.videoUrl },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href));

  return (
    <article
      className="pixel-panel overflow-hidden"
      style={{ borderColor: accentHex, background: '#12121e' }}
    >
      {/* Marquee */}
      <div
        className="marquee-lit flex items-center gap-3 px-4 py-3"
        style={{ background: accentHex, borderBottom: '3px solid #000' }}
      >
        <span className="font-pixel text-[8px] text-black px-1.5 py-1" style={{ background: 'rgba(0,0,0,0.15)' }}>
          FEATURED {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="font-pixel text-xs md:text-sm leading-snug uppercase text-black">{project.title}</h3>
      </div>

      <div className="grid md:grid-cols-5">
        {/* Screen */}
        <div className="md:col-span-2 p-3" style={{ background: '#05050c' }}>
          <div className="relative aspect-video overflow-hidden" style={{ background: '#0d0d16', border: '2px solid #000' }}>
            {project.thumbnail ? (
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-contain" />
            ) : (
              <ProjectThumbnail projectId={project.id} hovered={false} />
            )}
            <div className="screen-scanlines" aria-hidden="true" />
          </div>

          {/* Meta */}
          <dl className="mt-4 space-y-2 text-xs">
            {[
              { key: 'PERIOD', val: period },
              { key: 'TEAM',   val: team },
              { key: 'ROLE',   val: role },
            ].map((row) => (
              <div key={row.key} className="flex gap-3">
                <dt className="font-pixel text-[8px] w-14 shrink-0 pt-0.5" style={{ color: accentHex }}>{row.key}</dt>
                <dd className="font-dot leading-relaxed" style={{ color: textColor(row.val, '#F5F1E0') }}>{row.val}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Details */}
        <div className="md:col-span-3 flex flex-col p-4 md:p-5">
          <p className="font-dot text-[#B7B29A] text-xs leading-relaxed mb-4">{project.description}</p>

          <div className="space-y-3 mb-4">
            {points.map((point, i) => (
              <div key={i} className="p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '2px solid var(--line)' }}>
                {stepLabels.map(({ key, label }) => {
                  const text = point[key];
                  if (!text) return null;
                  return (
                    <div key={key} className="flex gap-3 py-0.5">
                      <span className="font-dot text-[11px] font-bold w-8 shrink-0" style={{ color: accentHex }}>{label}</span>
                      <span className="font-dot text-xs leading-relaxed" style={{ color: textColor(text, '#B7B29A') }}>{text}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {outcome ? (
            <div className="flex gap-2 items-start mb-4">
              <span className="font-pixel text-[8px] pt-1" style={{ color: accentHex }}>★ RESULT</span>
              <span className="font-dot text-xs font-bold leading-relaxed" style={{ color: textColor(outcome, '#F5F1E0') }}>{outcome}</span>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.map((t) => (
              <SkillTag key={t} label={t} color={index % 2 === 0 ? 'cyan' : 'purple'} />
            ))}
          </div>

          <div className="flex gap-4 pt-3 mt-auto" style={{ borderTop: '2px solid var(--line)' }}>
            {links.length === 0 ? (
              <span className="font-pixel text-[9px] text-[#6b6a58]">IN DEVELOPMENT</span>
            ) : null}
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-[9px] text-[#B7B29A] hover:text-[#FFD200] transition-colors duration-200 flex items-center gap-1"
              >
                <span>{l.label}</span><span>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
