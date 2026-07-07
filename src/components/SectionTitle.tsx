interface SectionTitleProps {
  label: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ label, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-12 text-center">
      <span className="font-pixel text-[10px] tracking-[0.15em] text-[#FFD200] uppercase text-glow-yellow">
        {label}
      </span>
      <h2 className="mt-4 font-dot text-3xl md:text-4xl font-bold text-[#F5F1E0] flex items-center justify-center gap-3">
        <span className="text-[#FF7A18]">▶</span>
        <span>{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-3 text-[#B7B29A] max-w-xl mx-auto text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
      {/* pixel underline: blocky dashes */}
      <div className="mt-5 flex items-center justify-center gap-1">
        <span className="inline-block w-2 h-2" style={{ background: 'var(--orange)' }} />
        <span className="inline-block w-14 h-1" style={{ background: 'var(--yellow)' }} />
        <span className="inline-block w-2 h-2" style={{ background: 'var(--yellow)' }} />
        <span className="inline-block w-14 h-1" style={{ background: 'var(--yellow)' }} />
        <span className="inline-block w-2 h-2" style={{ background: 'var(--orange)' }} />
      </div>
    </div>
  );
}
