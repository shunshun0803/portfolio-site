import { useState, useEffect } from 'react';

const navLinks = [
  { label: '制作物', href: '#works' },
  { label: '研究・開発', href: '#research' },
  { label: '自己紹介', href: '#about' },
  { label: 'スキル', href: '#skills' },
  { label: 'お問い合わせ', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLink = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? { background: 'rgba(10,10,18,0.92)', borderBottom: '3px solid var(--yellow)', boxShadow: '0 4px 0 #000' }
          : { background: 'transparent' }
      }
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => handleLink('#hero')}
          className="font-pixel text-sm text-[#FFD200] text-glow-yellow tracking-tight"
        >
          SH.
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleLink(link.href)}
                className="font-dot text-sm text-[#B7B29A] hover:text-[#FFD200] transition-colors duration-200"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニューを開く"
        >
          <span
            className={`block w-5 h-1 bg-[#FFD200] transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-5 h-1 bg-[#FFD200] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-5 h-1 bg-[#FFD200] transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 py-4"
          style={{ background: 'rgba(10,10,18,0.96)', borderTop: '2px solid var(--line)' }}
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleLink(link.href)}
                  className="font-dot text-sm text-[#B7B29A] hover:text-[#FFD200] transition-colors duration-200 w-full text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
