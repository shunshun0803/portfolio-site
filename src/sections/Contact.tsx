import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';
import { socialLinks } from '../data/links';

const emailLink = socialLinks.find((l) => l.href.startsWith('mailto'))!;

export function Contact() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionTitle
            label="// 05.contact"
            title="お問い合わせ"
          />

          <GlassCard glowColor="cyan" className="p-8 mb-6">
            <p className="text-[#475569] text-sm leading-relaxed mb-8">
              現在、ゲーム開発・クライアントエンジニアリング分野での
              <span className="text-[#0EA5E9] font-semibold">インターンシップやアルバイトの機会</span>を探しています。
              プロジェクトについてのご相談・質問・ご連絡など、どんなことでもお待ちしています。
            </p>

            <a
              href={emailLink.href}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-md"
              style={{ borderColor: `${emailLink.color}40`, backgroundColor: emailLink.bg }}
            >
              <span className="text-2xl" style={{ color: emailLink.color }}>{emailLink.icon}</span>
              <div className="text-left">
                <div className="text-xs text-[#64748B] font-mono mb-0.5">{emailLink.label}</div>
                <div className="text-[#0F172A] text-sm font-medium">{emailLink.value}</div>
              </div>
              <span className="ml-4 text-sm" style={{ color: emailLink.color }}>↗</span>
            </a>
          </GlassCard>

          {/* Footer */}
          <div className="text-[#94A3B8] text-xs font-mono">
            <span>shunshun0803</span>
            <span className="mx-2">·</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
