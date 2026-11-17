import { useState } from 'react';
import { type Project, type FeaturedDetail } from '../data/projects';
import { SkillTag } from './SkillTag';
import { LazyProjectThumbnail as ProjectThumbnail } from './LazyProjectThumbnail';
import { todoColor as textColor } from '../utils/todo';

interface FeaturedProjectCardProps {
  project: Project & { featured: FeaturedDetail };
  index: number;
}

const stepLabels = [
  { key: 'challenge', label: '課題' },
  { key: 'approach',  label: '工夫' },
  { key: 'result',    label: '結果' },
] as const;

/**
 * 代表作用のワイドカード。
 * 上: 成果物リンク / 左: スクリーン（ギャラリー）・期間・体制・担当 / 右: 概要 → 課題→工夫→結果 → 技術 → リンク。
 */
export function FeaturedProjectCard({ project, index }: FeaturedProjectCardProps) {
  const accentHex = index % 2 === 0 ? '#FFD200' : '#FF7A18';
  const { period, team, role, points, outcome, outcomeLabel } = project.featured;
  // 既定の見出しはピクセルフォント、日本語の見出しは読みやすいドットフォントで出す
  const outcomeHeading = outcomeLabel ? (
    <span className="font-dot text-xs font-bold" style={{ color: accentHex }}>★ {outcomeLabel}</span>
  ) : (
    <span className="font-pixel text-[8px]" style={{ color: accentHex }}>★ RESULT</span>
  );

  const outcomes = outcome === undefined ? [] : Array.isArray(outcome) ? outcome : [outcome];
  const deliverables = project.deliverables ?? [];
  const pastVideos = project.pastVideos ?? [];

  const links = [
    { label: 'GITHUB', href: project.githubUrl },
    { label: 'DEMO',   href: project.demoUrl },
    { label: 'VIDEO',  href: project.videoUrl },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href));

  const gallery = project.gallery ?? [];
  const [selected, setSelected] = useState(0);
  const current = gallery[selected];

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

      {/* 成果物リンク（タイトル直下に置き、スマホでもスクロールせずに見つけられるようにする） */}
      {deliverables.length > 0 ? (
        <div className="grid sm:grid-cols-3 gap-3 p-3" style={{ background: '#05050c', borderBottom: '2px solid var(--line)' }}>
          {deliverables.map((d) => (
            <a
              key={d.href}
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn flex flex-col gap-1 px-3 py-2.5 min-w-0"
              style={
                d.primary
                  ? { background: accentHex, borderColor: '#000', color: '#000' }
                  : { background: 'var(--panel)', borderColor: accentHex, color: accentHex }
              }
            >
              <span className="flex items-baseline gap-2 flex-wrap">
                <span className="font-dot text-sm font-bold">{d.primary ? '▶ ' : ''}{d.label}</span>
                {d.meta ? <span className="font-dot text-[11px] opacity-80">（{d.meta}）</span> : null}
                <span className="ml-auto text-xs" aria-hidden="true">↗</span>
              </span>
              {d.note ? (
                <span className="font-dot text-[11px] leading-snug" style={{ color: d.primary ? '#000' : '#B7B29A' }}>
                  {d.note}
                </span>
              ) : null}
            </a>
          ))}
        </div>
      ) : null}

      <div className="grid md:grid-cols-5">
        {/* Screen */}
        <div className="md:col-span-2 p-3" style={{ background: '#05050c' }}>
          <div className="relative aspect-video overflow-hidden" style={{ background: '#0d0d16', border: '2px solid #000' }}>
            {current ? (
              // カード内では小さいので、クリックで原寸（1920×1080）を開けるようにする
              <a href={current.src} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-zoom-in">
                <img src={current.src} alt={current.alt} className="w-full h-full object-contain" />
              </a>
            ) : project.thumbnail ? (
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-contain" />
            ) : (
              <ProjectThumbnail projectId={project.id} hovered={false} />
            )}
            <div className="screen-scanlines" aria-hidden="true" />
          </div>

          {gallery.length > 1 ? (
            <>
              <p className="font-dot text-[11px] text-[#B7B29A] mt-2 min-h-[2.5em] leading-snug">
                {current?.caption}
                <span className="text-[#6b6a58]">（クリックで拡大）</span>
              </p>
              <div className="grid grid-cols-5 gap-1 mt-1">
                {gallery.map((shot, i) => (
                  <button
                    key={shot.src}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={`画像${i + 1}：${shot.caption}`}
                    aria-pressed={i === selected}
                    className="aspect-video overflow-hidden transition-opacity duration-150"
                    style={{
                      border: `2px solid ${i === selected ? accentHex : '#000'}`,
                      opacity: i === selected ? 1 : 0.55,
                    }}
                  >
                    <img src={shot.src} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          ) : null}

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

          {outcomes.length === 1 ? (
            <div className="flex gap-2 items-start mb-4">
              <span className="pt-1 shrink-0">{outcomeHeading}</span>
              <span className="font-dot text-xs font-bold leading-relaxed" style={{ color: textColor(outcomes[0], '#F5F1E0') }}>{outcomes[0]}</span>
            </div>
          ) : outcomes.length > 1 ? (
            <div className="mb-4">
              {outcomeHeading}
              <ul className="mt-1.5 space-y-1">
                {outcomes.map((o) => (
                  <li key={o} className="flex gap-2 font-dot text-xs font-bold leading-relaxed" style={{ color: textColor(o, '#F5F1E0') }}>
                    <span style={{ color: accentHex }}>▸</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.map((t) => (
              <SkillTag key={t} label={t} color={index % 2 === 0 ? 'cyan' : 'purple'} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 mt-auto" style={{ borderTop: '2px solid var(--line)' }}>
            {links.length === 0 && deliverables.length === 0 ? (
              <span className="font-pixel text-[9px] text-[#6b6a58]">IN DEVELOPMENT</span>
            ) : null}
            {pastVideos.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-dot text-[11px] text-[#6b6a58]">補足：過去の映像</span>
                {pastVideos.map((v) => (
                  <a
                    key={v.url}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-dot text-[11px] text-[#B7B29A] hover:text-[#FFD200] transition-colors duration-200"
                  >
                    {v.label} ↗
                  </a>
                ))}
              </div>
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
