export interface TimelineEvent {
  date: string;
  title: string;
  detail?: string;
  highlight?: boolean; // 企業イベント・受賞など、特に目立たせたいもの
}

/**
 * 経歴・実績のタイムライン（上ほど新しい）。
 * 【要記入】を含むテキストはサイト上で赤字になる。
 */
export const timeline: TimelineEvent[] = [
  {
    date: '2026.09〜',
    title: '3Dアクション「ARCHEIA」制作開始',
    detail: '無双×ソウルライク。第1〜2章プレイ可能・単体テスト282件',
  },
  {
    date: '2026.08',
    title: 'サイバーエージェント プロトスプリントリーグ 参加',
    detail: '3人チームで2日間開発。進行管理と各メンバーの実装の統合を担当',
    highlight: true,
  },
  {
    date: '2026.07',
    title: 'unity1week「しろ」参加',
    detail: '1週間でパズルゲーム「ShiroFlip」を個人開発',
  },
  {
    date: '2026.04',
    title: '会津大学大学院 入学',
    detail: '学部3年次から大学院へ進学（制度上、学部は2026年3月に退学）。音に反応するキャラクターアニメーションを研究',
  },
  {
    date: '2026.02〜03',
    title: 'サイバーエージェント Game Client College 受講',
    detail: 'ゲームクライアントのアーキテクチャ設計を学び、Logicarta の設計改善に活用',
    highlight: true,
  },
  {
    date: '2025',
    title: '本格的にゲーム開発を開始',
    detail: '以降、作品ごとに意図的に新しい技術（DI・R3・ML-Agents・シェーダー等）へ挑戦',
  },
  {
    date: '2023.04',
    title: '会津大学 コンピュータ理工学部 入学',
  },
];
