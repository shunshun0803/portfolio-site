export interface SocialLink {
  label: string;
  value: string;
  href: string;
  color: string;
  bg: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
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
  {
    label: 'X',
    value: '@shun08shun_on',
    href: 'https://x.com/shun08shun_on',
    color: '#1D9BF0',
    bg: '#E7F5FE',
    icon: '𝕏',
  },
  {
    label: 'YouTube',
    value: 'YouTube Channel',
    href: 'https://www.youtube.com/channel/UCMRdHQGIiGEze3fYwoKhB2w',
    color: '#FF4444',
    bg: '#FEE2E2',
    icon: '▶',
  },
  {
    label: 'Qiita',
    value: 'qiita.com/shunshun0803',
    href: 'https://qiita.com/shunshun0803',
    color: '#55C500',
    bg: '#F0FFF4',
    icon: '◈',
  },
  {
    label: 'Note',
    value: 'note.com/rapid_iris8433',
    href: 'https://note.com/rapid_iris8433',
    color: '#41C9B0',
    bg: '#E6FFFA',
    icon: '✎',
  },
];
