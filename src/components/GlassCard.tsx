import { type ReactNode } from 'react';

type Accent = 'yellow' | 'orange' | 'none';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  accent?: Accent;
  lift?: boolean;
}

const borderMap: Record<Accent, string> = {
  yellow: 'var(--yellow)',
  orange: 'var(--orange)',
  none: 'var(--line)',
};

/**
 * Retro pixel panel: solid dark fill, chunky border, hard (blur-free) drop shadow.
 * Named GlassCard for continuity, but the look is now an arcade UI panel.
 */
export function GlassCard({ children, className = '', accent = 'none', lift = true }: GlassCardProps) {
  return (
    <div
      className={`pixel-panel ${lift ? 'pixel-lift' : ''} ${className}`}
      style={{ borderColor: borderMap[accent] }}
    >
      {children}
    </div>
  );
}
