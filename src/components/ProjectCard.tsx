import { useState } from 'react';
import { type Project } from '../data/projects';
import { GlassCard } from './GlassCard';
import { SkillTag } from './SkillTag';
import { ProjectThumbnail } from './ProjectThumbnail';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const accentColor = index % 2 === 0 ? 'cyan' : 'purple';
  const accentHex = accentColor === 'cyan' ? '#38BDF8' : '#A855F7';
  const accentBg = accentColor === 'cyan' ? '#E0F2FE' : '#F3E8FF';

  return (
    <GlassCard
      glowColor={accentColor}
      className="flex flex-col h-full overflow-hidden group"
    >
      {/* 3D Thumbnail */}
      <div
        className="relative h-44 overflow-hidden cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${accentBg} 0%, #F8FAFC 100%)` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 z-10 pointer-events-none" style={{ borderColor: accentHex }} />
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 z-10 pointer-events-none" style={{ borderColor: accentHex }} />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 z-10 pointer-events-none" style={{ borderColor: accentHex }} />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 z-10 pointer-events-none" style={{ borderColor: accentHex }} />

        <ProjectThumbnail projectId={project.id} hovered={hovered} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-base leading-snug mb-2 text-[#0F172A]">
          <span className="group-hover:text-[#0EA5E9] transition-colors duration-200">
            {project.title}
          </span>
        </h3>
        <p className="text-[#475569] text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <SkillTag key={t} label={t} color={accentColor} />
          ))}
        </div>

        <div className="flex gap-3 pt-3 border-t border-black/5">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#475569] hover:text-[#0EA5E9] transition-colors duration-200 flex items-center gap-1"
            >
              <span>GitHub</span><span>↗</span>
            </a>
          ) : (
            <span className="text-xs text-[#94A3B8]">GitHub (soon)</span>
          )}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#475569] hover:text-[#A855F7] transition-colors duration-200 flex items-center gap-1"
            >
              <span>Demo</span><span>↗</span>
            </a>
          ) : (
            <span className="text-xs text-[#94A3B8] ml-auto">Demo (soon)</span>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
