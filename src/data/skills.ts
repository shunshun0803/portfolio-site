export interface SkillCategory {
  category: string;
  color: 'cyan' | 'purple' | 'green' | 'orange';
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'ゲーム開発',
    color: 'cyan',
    skills: ['Unity', 'C#', 'Animator', 'NavMesh', 'Cinemachine'],
  },
  {
    category: 'フロントエンド',
    color: 'purple',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
  },
  {
    category: 'ツール',
    color: 'green',
    skills: ['Git', 'GitHub', 'Blender', 'Reaper'],
  },
  {
    category: '研究・その他',
    color: 'orange',
    skills: ['AI', 'アニメーション', 'サウンドデザイン', 'Python'],
  },
];
