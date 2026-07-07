type TagColor = 'cyan' | 'purple' | 'green' | 'orange';

interface SkillTagProps {
  label: string;
  color?: TagColor;
}

// Two-tone arcade palette: everything reads as yellow or orange on black.
const colorMap: Record<TagColor, string> = {
  cyan: '#FFD200',
  green: '#FFD200',
  purple: '#FF7A18',
  orange: '#FF7A18',
};

export function SkillTag({ label, color = 'cyan' }: SkillTagProps) {
  const c = colorMap[color];
  return (
    <span
      className="inline-block px-2.5 py-1 border-2 text-[11px] font-dot tracking-wide transition-transform duration-150 cursor-default hover:-translate-y-0.5"
      style={{ color: c, borderColor: c, background: 'rgba(0,0,0,0.35)', boxShadow: '2px 2px 0 #000' }}
    >
      {label}
    </span>
  );
}
