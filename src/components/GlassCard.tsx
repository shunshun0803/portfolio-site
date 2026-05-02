import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'none';
}

export function GlassCard({ children, className = '', glowColor = 'none' }: GlassCardProps) {
  const glowClass =
    glowColor === 'cyan'
      ? 'hover:glow-cyan hover:border-[#38BDF8]/30'
      : glowColor === 'purple'
      ? 'hover:glow-purple hover:border-[#A855F7]/30'
      : 'hover:shadow-lg';

  return (
    <div
      className={`glass rounded-xl transition-all duration-300 ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}
