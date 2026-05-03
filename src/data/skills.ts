export interface SkillCategory {
  category: string;
  color: 'cyan' | 'purple' | 'green' | 'orange';
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'ゲーム開発',
    color: 'cyan',
    skills: ['Unity', 'C#', 'UniTask', 'R3', 'VContainer'],
  },
  {
    category: 'その他言語',
    color: 'purple',
    skills: ['Go', 'Java', 'Python', 'c++'],
  },
  {
    category: 'ツール',
    color: 'green',
    skills: ['Git', 'GitHub', 'Blender', 'Logic Pro'],
  },
  {
    category: '研究・その他',
    color: 'orange',
    skills: ['AI', 'アニメーション', 'サウンド', 'Python', 'HLSL'],
  },
];
