interface SectionTitleProps {
  label: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ label, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-12 text-center">
      <span className="text-xs font-mono tracking-[0.3em] text-[#0EA5E9] uppercase">
        {label}
      </span>
      <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#0F172A]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[#475569] max-w-xl mx-auto text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#38BDF8]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#38BDF8]" />
      </div>
    </div>
  );
}
