export interface ProgressVideo {
  id: string;
  src?: string;        // ローカル: 'videos/xxx.mp4'（public/videos 配下・相対パスでOK）
  youtubeId?: string;  // YouTube: 'abcdEFGH' か URL
  poster?: string;     // 静止画（任意・'videos/xxx.jpg' などの相対パス可）
}

/**
 * 研究・開発の進捗ムービー（動画のみ）。
 * - 上にあるものほど新しい想定（表示は配列順）。
 * - YouTube を使う場合は `youtubeId`（ID or URL）を指定。
 * - ローカル動画を使う場合は `public/videos/` にファイルを置き `src` に相対パスを指定。
 * 下記2件はサンプル。実際の進捗動画に差し替えてください。
 */
export const progressVideos: ProgressVideo[] = [
  {
    id: 'p1',
    youtubeId: 'https://youtu.be/ZGQdmtCKLC8',
  },
  {
    id: 'p2',
    youtubeId: 'https://youtu.be/oaTmVhmhwV8',
  },
  {
    id: 'p3',
    youtubeId: 'https://youtu.be/5Q9ffpFuuEE',
  }
  // ── ローカル mp4 を使う場合の例（public/videos/ にファイルを置いて有効化）──
  // {
  //   id: 'p3',
  //   src: 'videos/progress-01.mp4',
  //   poster: 'videos/progress-01.jpg',
  // },
];
