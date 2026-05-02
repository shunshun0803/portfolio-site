import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';

const contactLinks = [
  {
    label: 'メール',
    value: 'shun1310026@gmail.com',
    href: 'mailto:shun1310026@gmail.com',
    color: '#0EA5E9',
    bg: '#E0F2FE',
    icon: '✉',
  },
  {
    label: 'GitHub',
    value: 'github.com/shunshun0803',
    href: 'https://github.com/shunshun0803',
    color: '#A855F7',
    bg: '#F3E8FF',
    icon: '⬡',
  },
];

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
            subtitle="一緒に何か作りたい方、質問がある方は、お気軽にご連絡ください。"
          />

          <GlassCard glowColor="cyan" className="p-8 mb-6">
            <p className="text-[#475569] text-sm leading-relaxed mb-8">
              現在、ゲーム開発・クライアントエンジニアリング分野での
              <span className="text-[#0EA5E9] font-semibold">インターンシップやアルバイトの機会</span>を探しています。
              プロジェクトについてのご相談・質問・ご連絡など、どんなことでもお待ちしています。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 px-5 py-3 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-md"
                  style={{
                    borderColor: `${link.color}40`,
                    backgroundColor: link.bg,
                  }}
                >
                  <span className="text-lg" style={{ color: link.color }}>{link.icon}</span>
                  <div className="text-left">
                    <div className="text-xs text-[#64748B] font-mono">{link.label}</div>
                    <div className="text-[#0F172A] text-sm font-medium">{link.value}</div>
                  </div>
                  <span className="ml-auto text-xs" style={{ color: link.color }}>↗</span>
                </a>
              ))}
            </div>
          </GlassCard>

          {/* Footer */}
          <div className="text-[#94A3B8] text-xs font-mono">
            <span>shunshun0803</span>
            <span className="mx-2">·</span>
            <span>ゲームクライアントエンジニア / Unity開発者</span>
            <span className="mx-2">·</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
