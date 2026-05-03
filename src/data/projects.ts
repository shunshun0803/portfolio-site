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
    id: 'chronostep',
    title: 'ChronoStep',
    thumbnail: 'src/data/thumbnails/chronostep.jpg',
    description:
      'React・TypeScript・Tailwind CSS・Three.jsを使用して構築した、ゲーム開発プロジェクトを紹介するフューチャリスティックなポートフォリオサイト。',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
    demoUrl: 'https://unityroom.com/games/chronostep',
  },
  {
    id: 'red-survivor',
    title: 'RED.SURVIVOR',
    thumbnail: 'src/data/thumbnails/red-survivor.jpg',
    description:
      'React・TypeScript・Tailwind CSS・Three.jsを使用して構築した、ゲーム開発プロジェクトを紹介するフューチャリスティックなポートフォリオサイト。',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
    demoUrl: 'https://unityroom.com/games/redsurvivor',
  },
  
  {
    id: 'SoulFall',
    title: 'Soul Fall',
    thumbnail: 'src/data/thumbnails/soul-fall.png',
    description:
      'React・TypeScript・Tailwind CSS・Three.jsを使用して構築した、ゲーム開発プロジェクトを紹介するフューチャリスティックなポートフォリオサイト。',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
    demoUrl: 'https://play.unity.com/ja/games/ad74b4af-9945-4fc5-a8a7-0d6be68b4e0d/soul-fall',
  },
  {
    id: 'Kitchen-Chaos',
    title: 'Kitchen Chaos',
    thumbnail: 'src/data/thumbnails/kitchenChaos.png',
    description:
      'ゲームプレイ・アニメーション・サウンドを通じた敵キャラクターの行動パターン、アニメーション遷移、インタラクティブな感情表現を実験するための研究プロトタイプ。',
    tech: ['Unity', 'C#', 'AI', 'Animation', 'Audio'],
    demoUrl: 'https://shun08shun.itch.io/kitchenchaos',
  },
  {
    id: 'little-adventure',
    title: 'Little Adventure',
    thumbnail: 'src/data/thumbnails/little-adventure.png',
    description:
      'プレイヤーの移動・攻撃・回避・パリィ・ロックオン・スタミナ管理・ボスAI・ヒットストップ・カメラシェイク・戦闘フィードバックを実装した3Dアクションゲームプロトタイプ。',
    tech: ['Unity', 'C#', 'NavMesh', 'Animator', 'Cinemachine'],
    demoUrl: 'https://shun08shun.itch.io/littleadventure',
  },
  
];
