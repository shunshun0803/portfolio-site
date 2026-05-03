import { useState, useEffect } from 'react';

const navLinks = [
  { label: '自己紹介', href: '#about' },
  { label: '制作物', href: '#works' },
  { label: 'スキル', href: '#skills' },
  { label: '研究・開発', href: '#research' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-black/5' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span
          className="text-lg font-bold text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(to right, #0EA5E9, #A855F7)' }}
        >
          SH.
        </span>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleLink(link.href)}
                className="text-sm text-[#475569] hover:text-[#0EA5E9] transition-colors duration-200 font-medium"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニューを開く"
        >
          <span
            className={`block w-5 h-0.5 bg-[#0EA5E9] transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#0EA5E9] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#0EA5E9] transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-black/5 px-6 py-4">
          <ul className="flex flex-col gap-4 mb-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleLink(link.href)}
                  className="text-sm text-[#475569] hover:text-[#0EA5E9] transition-colors duration-200 w-full text-left font-medium"
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
