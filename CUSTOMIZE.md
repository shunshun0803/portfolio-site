# ポートフォリオサイト カスタマイズマニュアル

編集する必要があるファイルは **4つだけ** です。コードの知識がなくてもデータ部分を書き換えるだけで反映されます。

---

## 📁 編集するファイル一覧

| ファイル | 内容 |
|---|---|
| `src/data/projects.ts` | 作品・プロジェクト |
| `src/data/skills.ts` | スキル |
| `src/data/links.ts` | SNS・連絡先リンク |
| `src/sections/About.tsx` | 自己紹介文・ハイライトカード |

---

## 1. 作品のサムネイル画像を設定する

**画像の置き場所:** `public/thumbnails/` フォルダ

```
public/
  thumbnails/
    soulslike.png      ← ここに画像を置く
    game-ai.png
    ...
```

**`src/data/projects.ts` に1行追加するだけで反映されます：**

```ts
{
  id: 'soulslike-boss',
  title: '...',
  thumbnail: '/thumbnails/soulslike.png',  // ← この行を追加
  ...
}
```

- `thumbnail` がない場合は自動で3Dアニメーションにフォールバック
- 推奨サイズ: **横16:縦9**（例: 1280×720px）、PNG/JPG どちらでも可
- ホバーすると画像が少し拡大するアニメーションあり

---

## 2. 作品を追加・編集する

**ファイル:** `src/data/projects.ts`

```ts
export const projects: Project[] = [
  {
    id: 'soulslike-boss',           // ← 変えなくてOK（URLに使われない内部ID）
    title: '3Dソウルライクボス戦プロトタイプ',  // ← タイトル
    description: '説明文...',       // ← 説明（1〜3文程度が見やすい）
    tech: ['Unity', 'C#', 'NavMesh'],  // ← 使用技術タグ（いくつでも）
    githubUrl: 'https://github.com/...',  // ← GitHubリンク（なければ '' のまま）
    demoUrl: '',                    // ← デモリンク（なければ '' のまま）
  },
  // ↓ ここに { } を追加すると作品が増える
];
```

### 作品を追加するときのテンプレート

```ts
{
  id: 'my-new-project',             // 他と被らない英数字
  title: '新しいプロジェクト名',
  thumbnail: 'src/data/thumbnails/サムネ.jpg',
  description: 'どんなプロジェクトか説明。',
  tech: ['Unity', 'C#'],
  demoUrl: '',
},
```

### 注意点

- `projects` 配列の **先頭 = 古い順、末尾 = 最新** として扱われます
- 宇宙探索モードでは最大3件まで惑星として表示されます（`projects[0]`〜`projects[2]`）
- 4件目以降を追加する場合は別途お声がけください

---

## 2. スキルを追加・編集する

**ファイル:** `src/data/skills.ts`

```ts
export const skillCategories: SkillCategory[] = [
  {
    category: 'ゲーム開発',   // ← カテゴリ名
    color: 'cyan',            // ← 色: 'cyan' | 'purple' | 'green' | 'orange'
    skills: ['Unity', 'C#', 'Animator', 'NavMesh', 'Cinemachine'],  // ← スキルタグ
  },
  // ...
];
```

### スキルを追加する

既存カテゴリに追加するだけ：

```ts
skills: ['Unity', 'C#', 'Animator', 'NavMesh', 'Cinemachine', 'Shader Graph'],
//                                                               ↑ 末尾に追加
```

### カテゴリを増やす

```ts
{
  category: 'バックエンド',
  color: 'purple',
  skills: ['Node.js', 'Firebase'],
},
```

---

## 3. SNS・連絡先リンクを追加・編集する

**ファイル:** `src/data/links.ts`

このファイルを変更すると、**メインサイトのContactセクション** と **宇宙探索モードのContactパネル** の両方に自動反映されます。

```ts
export const socialLinks: SocialLink[] = [
  {
    label: 'メール',                          // ← 表示名
    value: 'shun1310026@gmail.com',           // ← 表示するテキスト
    href: 'mailto:shun1310026@gmail.com',     // ← クリック時のURL
    color: '#0EA5E9',                         // ← アクセントカラー（HEXコード）
    bg: '#E0F2FE',                            // ← メインサイト用の背景色
    icon: '✉',                               // ← アイコン（絵文字・文字）
  },
  // ...
];
```

### リンクを追加するときのテンプレート

```ts
{
  label: 'LinkedIn',
  value: 'linkedin.com/in/yourname',
  href: 'https://linkedin.com/in/yourname',
  color: '#0A66C2',
  bg: '#EFF6FF',
  icon: 'in',
},
```

### アイコンに使える絵文字の例

| サービス | おすすめ |
|---|---|
| メール | ✉ |
| GitHub | ⬡ |
| X (Twitter) | 𝕏 |
| YouTube | ▶ |
| Qiita | ◈ |
| Note | ✎ |
| LinkedIn | ⬦ |
| Zenn | ✦ |

---

## 4. 自己紹介文を編集する

**ファイル:** `src/sections/About.tsx`

ファイルを開くと以下のような部分があります。ここを書き換えるだけです。

```tsx
// 上部プロフィールカードのデータ
const profileData = [
  ['ROLE',   'ゲームクライアントエンジニア / Unity開発者'],  // ← 肩書き
  ['FOCUS',  'ゲームプレイシステム・AI・アニメーション'],    // ← 専門分野
  ['ENGINE', 'Unity (C#)'],                                 // ← 主な技術
  ['STATUS', 'インターン・就職機会を探しています'],           // ← 現在の状況
];
```

```tsx
// 説明文
<p>
  主にUnityとC#を使用して...  ← この文章を書き換える
</p>
```

---

## 5. 動作確認の方法

編集したら以下を実行してエラーがないか確認してください。

```bash
# 開発サーバーを起動してブラウザで確認
npm run dev

# 本番ビルドでエラーチェック
npm run build
```

---

## 6. 本番デプロイ前の確認事項

- `src/components/game/BossGame.tsx` の `BAR_HP` が `200` になっているか確認
  （開発中は `5` にしてあることがある）

```ts
// BossGame.tsx の上部
const BAR_HP = 200;  // ← 本番は200
```

---

## 7. よくある質問

**Q. 変更が画面に反映されない**
→ `npm run dev` を再起動してみてください

**Q. 赤いエラーが出た**
→ `{}` や `[]` の閉じ忘れ、`,` の付け忘れが多いです。エラー文の行番号を確認してください

**Q. 宇宙探索モードにプロジェクトが反映されない**
→ `projects.ts` の配列を更新するだけで自動反映されます（最大3件）
