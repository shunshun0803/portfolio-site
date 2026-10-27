import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SectionTitle } from '../components/SectionTitle';
import { GlassCard } from '../components/GlassCard';
import { socialLinks } from '../data/links';

const emailLink = socialLinks.find((l) => l.href.startsWith('mailto'))!;
const snsLinks = socialLinks.filter((l) => l !== emailLink);

export function Contact() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="contact" className="py-24 px-6 grid-bg">
      <div className="max-w-3xl mx-auto text-center">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionTitle label="// 05.contact" title="お問い合わせ" />

          <GlassCard accent="yellow" className="p-8 mb-6">
            <p className="font-dot text-[#B7B29A] text-sm leading-relaxed mb-8">
              2028年3月修了予定（28卒）として、
              <span className="text-[#FFD200] font-bold">ゲームクライアントエンジニア職</span>を志望しています。
              選考・インターンシップのご案内や、作品についてのご質問など、お気軽にご連絡ください。
            </p>

            <a
              href={emailLink.href}
              className="pixel-btn inline-flex items-center gap-3 px-6 py-4 text-black"
              style={{ background: 'var(--yellow)', borderColor: '#000' }}
            >
              <span className="text-2xl">{emailLink.icon}</span>
              <div className="text-left">
                <div className="font-pixel text-[8px] mb-1">{emailLink.label}</div>
                <div className="font-dot text-sm font-bold">{emailLink.value}</div>
              </div>
              <span className="ml-4 text-sm">↗</span>
            </a>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {snsLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-btn inline-flex items-center gap-2 px-3 py-2 text-[#FFD200]"
                  style={{ background: 'var(--panel)', borderColor: 'var(--yellow)' }}
                >
                  <span>{link.icon}</span>
                  <span className="font-pixel text-[8px]">{link.label}</span>
                </a>
              ))}
            </div>
          </GlassCard>

          {/* Footer */}
          <div className="font-pixel text-[8px] text-[#6b6a58]">
            <span>SHUNSHUN0803</span>
            <span className="mx-2">·</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
