export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
}

export const projects: Project[] = [
  {
    id: 'soulslike-boss',
    title: '3Dソウルライクボス戦プロトタイプ',
    description:
      'プレイヤーの移動・攻撃・回避・パリィ・ロックオン・スタミナ管理・ボスAI・ヒットストップ・カメラシェイク・戦闘フィードバックを実装した3Dアクションゲームプロトタイプ。',
    tech: ['Unity', 'C#', 'NavMesh', 'Animator', 'Cinemachine'],
    githubUrl: '',
    demoUrl: '',
  },
  {
    id: 'game-ai-research',
    title: 'ゲームAI研究プロトタイプ',
    description:
      'ゲームプレイ・アニメーション・サウンドを通じた敵キャラクターの行動パターン、アニメーション遷移、インタラクティブな感情表現を実験するための研究プロトタイプ。',
    tech: ['Unity', 'C#', 'AI', 'Animation', 'Audio'],
    githubUrl: '',
    demoUrl: '',
  },
  {
    id: 'portfolio-site',
    title: 'Webポートフォリオサイト',
    description:
      'React・TypeScript・Tailwind CSS・Three.jsを使用して構築した、ゲーム開発プロジェクトを紹介するフューチャリスティックなポートフォリオサイト。',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
    githubUrl: 'https://github.com/shunshun0803/portfolio-site',
    demoUrl: '',
  },
];
