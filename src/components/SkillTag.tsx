type TagColor = 'cyan' | 'purple' | 'green' | 'orange';

interface SkillTagProps {
  label: string;
  color?: TagColor;
}

const colorMap: Record<TagColor, string> = {
  cyan: 'border-[#38BDF8]/50 text-[#0369A1] bg-[#E0F2FE] hover:bg-[#BAE6FD]',
  purple: 'border-[#A855F7]/50 text-[#7E22CE] bg-[#F3E8FF] hover:bg-[#E9D5FF]',
  green: 'border-[#22C55E]/50 text-[#15803D] bg-[#DCFCE7] hover:bg-[#BBF7D0]',
  orange: 'border-[#F97316]/50 text-[#C2410C] bg-[#FFF7ED] hover:bg-[#FED7AA]',
};

export function SkillTag({ label, color = 'cyan' }: SkillTagProps) {
  return (
    <span
      className={`inline-block px-3 py-1.5 rounded-md border text-xs font-mono tracking-wide transition-all duration-200 cursor-default ${colorMap[color]}`}
    >
      {label}
    </span>
  );
}
