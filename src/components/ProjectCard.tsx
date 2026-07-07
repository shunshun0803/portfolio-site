import { useState } from 'react';
import { type Project } from '../data/projects';
import { SkillTag } from './SkillTag';
import { ProjectThumbnail } from './ProjectThumbnail';
import { isDirectVideo } from '../utils/media';

interface ProjectCardProps {
  project: Project;
  index: number;
}

/**
 * A single project rendered as a retro arcade cabinet:
 * lit marquee (title) → CRT screen bezel (thumbnail/video) → control panel (tech + links).
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = index % 2 === 0 ? 'yellow' : 'orange';
  const accentHex = accent === 'yellow' ? '#FFD200' : '#FF7A18';
  const hasDirectVideo = isDirectVideo(project.videoUrl);

  return (
    <div
      className="pixel-panel pixel-lift flex flex-col h-full overflow-hidden group"
      style={{ borderColor: accentHex, background: '#12121e' }}
    >
      {/* Marquee sign (illuminated title header) */}
      <div
        className="marquee-lit relative px-3 py-3 text-center"
        style={{ background: accentHex, borderBottom: '3px solid #000' }}
      >
        <h3 className="font-pixel text-xs md:text-sm leading-snug uppercase text-black">
          {project.title}
        </h3>
      </div>

      {/* CRT screen bezel */}
      <div className="p-3" style={{ background: '#05050c' }}>
        <div
          className="relative h-40 overflow-hidden cursor-pointer"
          style={{ background: '#0d0d16', border: '2px solid #000' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hasDirectVideo ? (
            <>
              <video
                src={project.videoUrl}
                poster={project.thumbnail}
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onMouseEnter={(event) => event.currentTarget.play().catch(() => undefined)}
                onMouseLeave={(event) => {
                  event.currentTarget.pause();
                  event.currentTarget.currentTime = 0;
                }}
              />
            </>
          ) : project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ProjectThumbnail projectId={project.id} hovered={hovered} />
          )}

          {/* CRT scanline overlay */}
          <div className="screen-scanlines" aria-hidden="true" />

          {/* Corner brackets (above the screen) */}
          <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-l-4 border-t-4 z-10 pointer-events-none" style={{ borderColor: accentHex }} />
          <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-r-4 border-t-4 z-10 pointer-events-none" style={{ borderColor: accentHex }} />
          <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-l-4 border-b-4 z-10 pointer-events-none" style={{ borderColor: accentHex }} />
          <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-r-4 border-b-4 z-10 pointer-events-none" style={{ borderColor: accentHex }} />

          {hasDirectVideo ? (
            <div
              className="absolute left-2 bottom-2 z-10 px-2 py-1 text-[9px] font-pixel text-black"
              style={{ background: accentHex, boxShadow: '2px 2px 0 #000' }}
              aria-hidden="true"
            >
              VIDEO
            </div>
          ) : null}
        </div>
      </div>

      {/* Control panel */}
      <div className="flex flex-col flex-1 px-4 pb-4">
        <p className="font-dot text-[#B7B29A] text-xs leading-relaxed mb-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <SkillTag key={t} label={t} color={accent === 'yellow' ? 'cyan' : 'purple'} />
          ))}
        </div>

        <div className="flex items-center gap-3 pt-3 mt-auto" style={{ borderTop: '2px solid var(--line)' }}>
          {/* Decorative arcade buttons */}
          <span className="flex gap-1.5 items-center" aria-hidden="true">
            <span className="w-2.5 h-2.5" style={{ background: '#FF4040', boxShadow: '1px 1px 0 #000' }} />
            <span className="w-2.5 h-2.5" style={{ background: '#FFD200', boxShadow: '1px 1px 0 #000' }} />
          </span>

          <div className="flex gap-4 ml-auto">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-[9px] text-[#B7B29A] hover:text-[#FF7A18] transition-colors duration-200 flex items-center gap-1"
              >
                <span>DEMO</span><span>↗</span>
              </a>
            ) : (
              <span className="font-pixel text-[9px] text-[#6b6a58]">SOON</span>
            )}
            {project.videoUrl ? (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-[9px] text-[#B7B29A] hover:text-[#FFD200] transition-colors duration-200 flex items-center gap-1"
              >
                <span>VIDEO</span><span>↗</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
