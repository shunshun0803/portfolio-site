import chronostepImg from './thumbnails/chronostep.jpg'
import redSurvivorImg from './thumbnails/red-survivor.jpg'
import soulFallImg from './thumbnails/soul-fall.png'
import kitchenChaosImg from './thumbnails/kitchenChaos.png'
import littleAdventureImg from './thumbnails/little-adventure.png'
import ticTacToeImg from './thumbnails/TicTacToeImg.png'
import zankiBossBattleImg from './thumbnails/Zanki.png'
import logicartaImg from './thumbnails/logicarta.png'
import zombieShooterImg from './thumbnails/zombieShooter.jpg'
import ShiroFlipImg from './thumbnails/ShiroFlipImg.jpg'
import EggIncubatorImg from './thumbnails/AppIcon.png'
import archeiaHordeImg from './thumbnails/archeia/cur_01_horde.webp'
import archeiaPerkImg from './thumbnails/archeia/cur_02_perk_selection.webp'
import archeiaFrostImg from './thumbnails/archeia/cur_03_frost_ex.webp'
import archeiaLastRitesImg from './thumbnails/archeia/cur_04_last_rites.webp'
import archeiaCrabImg from './thumbnails/archeia/03_boss_crab.webp'
import archeiaSnakeImg from './thumbnails/archeia/04_boss_snake.webp'
import archeiaFrogImg from './thumbnails/archeia/05_boss_frog.webp'
import archeiaFogImg from './thumbnails/archeia/06_fog_shrine.webp'
import archeiaTempleImg from './thumbnails/archeia/07_temple.webp'

/** 課題 → 工夫 → 結果 の1セット */
export interface CasePoint {
  challenge: string;
  approach: string;
  result?: string;
}

/** 代表作だけが持つ詳細情報。これがある作品は Works の上部に大きく表示される（配列順）。 */
export interface FeaturedDetail {
  period: string;   // 制作期間（例: '1週間（unity1week）'）
  team: string;     // 体制（例: '個人' / '4人チーム'）
  role: string;     // 自分の担当範囲
  points: CasePoint[];
  outcome?: string | string[]; // 受賞・順位・評価・技術的な見どころなど全体の成果（配列なら箇条書き）
  outcomeLabel?: string;       // outcome 欄の見出し（省略時は「★ RESULT」）
}

/** 代表作カードの上部に大きく出す成果物リンク（デモ動画・ビルド・ソースなど） */
export interface DeliverableLink {
  label: string;
  href: string;
  meta?: string;     // 長さ・形式・サイズなど（例: 'ZIP・約19 MB'）
  note?: string;     // 一言の補足（例: '展開して ARCHEIA.exe を起動'）
  primary?: boolean; // 主ボタンとして目立たせる
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  gallery?: { src: string; caption: string; alt: string }[]; // 代表作カードで切り替えて見せるスクリーンショット
  deliverables?: DeliverableLink[]; // 代表作カードの成果物リンク（この順で表示）
  pastVideos?: { label: string; url: string }[]; // 過去バージョンの映像（代表作カードの補足欄に表示）
  period?: string;    // 通常カード用の制作期間（代表作は featured.period を使う）
  learning?: boolean; // チュートリアルを参考にした学習用の作品。Works の末尾に分けて表示する
  featured?: FeaturedDetail;
}

export const projects: Project[] = [
  // ── 代表作（featured あり・この順で上部に表示） ──
  {
    id: 'ARCHEIA',
    title: 'ARCHEIA ─ The Ember Rite ─',
    thumbnail: archeiaHordeImg,
    gallery: [
      {
        src: archeiaHordeImg,
        caption: '第1章：機械兵の群れを斬り払う',
        alt: '夜の草原で、主人公が特殊攻撃「ラストフューリー」を放ち、拠点の周りに集まった機械兵の群れを斬り払っている戦闘画面',
      },
      {
        src: archeiaPerkImg,
        caption: '3枚から強化を選ぶ',
        alt: 'レベルアップ時の「強化を選ぶ」画面。狂戦士「怒り」、残光「シャドウスラスト」、氷「永久凍土」の3枚のカードが並び、それぞれの効果が書かれている',
      },
      {
        src: archeiaFrostImg,
        caption: '氷ビルドの強化特殊攻撃「フロストブルーム」',
        alt: '主人公が氷の強化特殊攻撃「フロストブルーム」を放ち、青い氷の弧と光の柱が機械兵を巻き込んでいる画面',
      },
      {
        src: archeiaLastRitesImg,
        caption: '古代機竜アルケイオンへのラストライツ',
        alt: '赤い魔法陣の上で、遺跡の番人「古代機竜アルケイオン」にとどめの「LAST RITES」を決めた瞬間の画面',
      },
      {
        src: archeiaCrabImg,
        caption: '第2章：カニ型の番人とのボス戦',
        alt: '赤い円形の闘技場で、主人公が剣閃をまとった斬撃でカニ型の機械のボスに斬りかかっている画面',
      },
      {
        src: archeiaFrogImg,
        caption: '第3章：霧の湿地の番人「霧喰らいのバトラクス」',
        alt: '赤い霧に包まれた湿地で、塔の前に現れたカエル型の機械のボス「霧喰らいのバトラクス」と主人公が向き合う画面',
      },
      {
        src: archeiaFogImg,
        caption: '第3章：霧の湿地の祠',
        alt: '灰色の霧に包まれた湿地で、主人公が青く光る石の祠の前に立っている画面',
      },
      {
        src: archeiaSnakeImg,
        caption: '第4章：密林の寺院の番人「蛇神ナーガラジャ」',
        alt: '夜の草原で、主人公が巨大な蛇型の機械のボス「蛇神ナーガラジャ」にとどめを決め、「LAST RITES」の文字が出ている画面',
      },
      {
        src: archeiaTempleImg,
        caption: '第4章：密林の寺院',
        alt: '密林に囲まれた石造りの寺院を上空から見下ろした景色',
      },
    ],
    deliverables: [
      {
        label: 'デモ動画を見る',
        meta: '2分13秒',
        href: 'https://drive.google.com/file/d/16E1yYJWBQSAUaCWRxUOEnbi6rkexxume/view',
        primary: true,
      },
      {
        label: 'Windows版を入手',
        meta: 'ZIP・約755 MB',
        note: '展開して ARCHEIA.exe を起動',
        href: 'https://drive.google.com/file/d/1fkuYSKp_WtX2spuDDdiYyjdlKhlk4bMm/view',
      },
      {
        label: 'ソースコードを見る',
        meta: 'ZIP・約19 MB',
        note: 'コード閲覧用。外部素材は同梱していません',
        href: 'https://drive.google.com/file/d/1bA8GBBM-CZhmeyL5BUFbopdfgcx4S7vY/view',
      },
    ],
    pastVideos: [
      { label: '旧版プレイデモ', url: 'https://youtu.be/YeUKxFf2Q2c' },
      { label: '旧版アクションデモ', url: 'https://youtu.be/8I0dVK6sgcQ' },
    ],
    description:
      '『ARCHEIA — The Ember Rite』は、群れを一気に斬り払う爽快感と、ボスの攻撃を読んで反撃する緊張感を組み合わせた、個人制作の3Dアクションゲームです。灯守の少女となり、赤い光に侵された機械の番人に挑みます。草原から密林の寺院まで第1〜4章がプレイ可能です。△の短押しと長押しで特殊攻撃を使い分け、章ごとの強化で天空・残光・氷・灯の精・狂戦士の5系統のビルドを組めます。キャラクター・モーション・環境・音は購入／配布素材を使用しています。',
    tech: ['Unity 6', 'URP', 'C#', 'VContainer', 'R3', 'UniTask', 'RenderGraph'],
    featured: {
      period: '2026年9月〜（制作中）',
      team: '個人（AIコーディングツールと分担）',
      role: 'ゲームの企画、戦闘システムの設計、実装方針の決定を担当しました。主人公のAnimator ControllerとCinemachineのロックオンカメラを自分で組み、主人公・雑魚・ボスの行動状態に応じたモーションの切り替えを試遊で確認し、調整しました。コード実装の多くにはClaude Codeを活用し、コードレビューとテストプレイを通じて、攻撃のタイミングやボスの予備動作の読みやすさを改善しました。',
      points: [
        {
          challenge: '攻撃モーションの再生速度を変えると、固定秒数で管理していた当たり判定やコンボ受付が、モーションの進み具合とずれる。',
          approach: '主人公の攻撃は、Animatorの正規化再生時間を参照して、当たり判定を有効にする区間とコンボ入力の受付区間を制御するようにした',
          result: '判定と入力受付がモーションの進み具合に揃い、再生速度を変えても再調整が不要に',
        },
        {
          challenge: 'ボスの技の選び方と、各技の予備動作や攻撃後の隙を、それぞれ調整できるようにしたい。',
          approach: '技を選ぶ処理はビヘイビアツリーに持たせ、選んだ技の予備動作・攻撃・隙は別の状態遷移で管理した。',
          result: '技を出す条件と、予備動作や攻撃後の隙の長さを、それぞれ調整できるようになった。',
        },
        {
          challenge: '剣閃がカーブで反転する',
          approach: 'カメラに板を向ける方式に補正を重ねるのをやめ、刃が通過した面をそのまま形状にする方式に切り替えた',
          result: '急な軌道でも破綻しなくなった。直らないときは方式ごと変える判断が必要だと学んだ',
        },
        {
          challenge: '試遊で「近接攻撃が当たらない」という感想',
          approach: '実測して剣先が判定に1.3m届いていないことを特定。直すと強くなりすぎたため、敵の攻撃力と同時攻撃数も下げて再調整',
          result: '感覚的な不満を、数値で原因を特定して解消',
        },
        {
          challenge: '試遊で「何をすればいいか分からない」「2章が1章の焼き直し」と言われた',
          approach: '撃破ノルマを拠点制圧に変え、撃破報酬での成長要素を追加。2章には水門防衛戦と潜り兵を新しく作った',
        },
      ],
      outcomeLabel: '設計・共通部品',
      outcome: [
        '戦闘や進行のルールをUnityのコンポーネントから分離し、EditModeテストで検証',
        'ボタンの連打・二重実行の防止と、画面を破棄するときのイベント購読解除を共通パッケージ化',
      ],
    },
  },
  {
    id: 'LOGICARTA',
    title: 'LOGICARTA',
    thumbnail: logicartaImg,
    description:
      'カードゲーム × タワーディフェンス × オートチェスを組み合わせた、Unity製の戦略バトルゲームです。サモナー選択、グリッド上のユニット配置、敵ウェーブ、ショップ、報酬、アーティファクトなどを組み合わせたローグライト寄りの構成になっています。',
    tech: ['Unity', 'C#', 'UniTask', 'R3', 'VContainer'],
    demoUrl: 'https://unityroom.com/games/logicarta-demo',
    videoUrl: 'https://youtu.be/bqfVnrwbkg4',
    featured: {
      period: '2026年2月〜5月（約4ヶ月）',
      team: '個人',
      role: '全工程（企画・ゲームデザイン・プログラミング・アーキテクチャ設計・UI実装）',
      points: [
        {
          challenge: '多種のカードデータや複雑なイベント管理など、経験のない規模の設計に挑戦したところ、依存関係が複雑化して機能を追加するたびに別の箇所が壊れる状態に陥った',
          approach: 'サイバーエージェントの Game Client College で学んだ知識をもとに、VContainer による DI と R3 によるイベント駆動設計を導入して構造を作り直した',
          result: '変更に強いコードベースに改善。設計の重要性を実践を通じて学んだ',
        },
      ],
    },
  },
  {
    id: 'zanki: Boss Battle',
    title: 'Zanki: Boss Battle',
    thumbnail: zankiBossBattleImg,
    description:
      '隻狼インスパイアのボスバトル3Dアクションゲームプロトタイプです。ボスAIにML-Agents（強化学習）を実装し、プレイヤーの行動パターンを学習しながら強くなる仕組みを自作しました。体幹崩壊・パリィ・コンボなどのシステムをMVP+TDD設計で実装し、スキルベースの緊張感ある戦闘体験を目指しました。',
    tech: ['Unity', 'C#', 'ML-Agents', 'UniTask', 'R3', 'VContainer'],
    demoUrl: 'https://unityroom.com/games/zanki_boss',
    videoUrl: 'https://youtu.be/8jzUQTzkxY8',
    // githubUrl: 'https://github.com/shunshun0803/xxx',
    featured: {
      period: '2026年4月（約1ヶ月）',
      team: '個人',
      role: '全工程（企画・プログラミング・3Dアクション実装・強化学習AI設計・アニメーション）',
      points: [
        {
          challenge: 'ルールベースのボスAIは、パターンを読まれると緊張感が薄れる',
          approach: 'ML-Agents（強化学習）で、プレイヤーの行動に適応して動くボスAIに挑戦した',
        },
        {
          challenge: 'ダメージだけを報酬にすると、一方的に突進するだけの単調な挙動になった',
          approach: '「適切な距離を保つ」「攻撃後に離脱する」「被ダメージを減らす」など複数の報酬・ペナルティを組み合わせた',
          result: '接近・攻撃・離脱のサイクルを学習。ルールベースAIと比較し、より自然で読みにくい動きになることを確認',
        },
      ],
    },
  },
  {
    id: 'EggIncubator',
    title: 'タマゴインキュベータ',
    thumbnail: EggIncubatorImg,
    description:
        'サイバーエージェントのプロトスプリントリーグで開発した、スマホを傾けてフライパンの上のタマゴを落とさずに孵す体感アクション。落とせば即ゲームオーバー。タマゴは中の生き物が動くたびに自分から暴れるため、放っておくと勝手に縁へ寄っていきます。孵化が進むのはフライパンに現れる「スイートスポット」にタマゴが乗っている間だけで、これは中央には出現せず縁寄りを移動し続けるため、安全な場所で待つという選択肢が成立しないのが核となる仕組みです。',
    tech: ['Unity', 'C#', 'Input System', 'ジャイロセンサー', 'URP', 'DOTween'],
    videoUrl: 'https://youtube.com/shorts/OYaqz8FUPKQ?feature=share',
    // githubUrl: 'https://github.com/shunshun0803/xxx',
    featured: {
      period: '2026年8月（2日間）',
      team: '3人チーム / iOS',
      role: 'ゲーム全体の進行・状態管理、孵化進捗と難易度の制御、スイートスポットの挙動、各メンバーの実装の統合、UI・演出・操作感の調整',
      points: [
        {
          challenge: '説明を読まなくても、触ってすぐ遊び方が分かる操作にしたい',
          approach: '端末の傾きとUnityの物理演算を組み合わせ、「傾ければ転がる」だけで成立する操作にした',
        },
        {
          challenge: '傾けるだけの操作だと「中央で待ち続ける」のが最適解になり、緊張感が生まれない',
          approach: 'スイートスポットを中央に出さず縁寄りを移動させ、孵化に近づくほどタマゴの動きも激しくした',
          result: '成功に近づくほど失敗の危険も高まる、リスクとリターンのある体験に',
        },
        {
          challenge: '3人が分担して作った機能（ジャイロ操作・物理挙動・演出）を、2日間で1つのゲームとして成立させる',
          approach: '全体の進行・状態管理を自分が持ち、各メンバーの実装を統合して操作感まで調整した',
        },
      ],
      outcome: 'サイバーエージェント プロトスプリントリーグ参加作品（初の本格チーム開発）',
    },
  },

  // ── その他の作品 ──
  {
    id: 'ShiroFlip',
    title: 'ShiroFlip',
    thumbnail: ShiroFlipImg,
    description:
      'unity1weekで開発した盤面の白黒を反転させながらゴールを目指すパズルゲーム。白いマスは安全、黒いマスは即死。反転は「ボタンを押した位置の周囲2マス」にしか効かないため、いつ押すかに加えて、どこに立って押すかが問われるのが核となる仕組みです。全30ステージ。1週間のゲームジャム作品ですが、期間内に全30ステージからゲームクリアまで一本の流れとして遊べる状態に仕上げました。',
    tech: ['Unity', 'C#', 'UniTask', 'R3', 'VContainer'],
    period: '2026年7〜8月（unity1week・1週間）',
    demoUrl: 'https://unityroom.com/games/shunshun0803_shiroflip',
  },
  {
    id: 'ZombieShooter',
    title: 'Zombie Shooter',
    thumbnail: zombieShooterImg,
    description:
      '敵を撃ち落とし、1体でも突破されたらゲームオーバーというサバイバル・シューティングです。コンボや演出で「遊んでいて気持ちいい手応え」を出すことを目標に、UIの作り込みやDOTweenによるアニメーション演出にこだわって個人制作しました。',
    tech: ['Unity', 'C#', 'UniTask', 'R3', 'VContainer'],
    period: '2026年6月（約2週間）',
    demoUrl: 'https://unityroom.com/games/shunshun0803_zombieshooter',
    videoUrl: 'https://youtu.be/umT_MEtIvRU',
  },
  {
    id: 'Tic-Tac-Toe',
    title: 'Tic Tac Toe',
    thumbnail: ticTacToeImg,
    description:
      'Unityで制作した3D三目並べゲームです。対戦相手のAIにQ学習（強化学習）を実装し、対局を重ねるごとに強くなる仕組みを自作しました。',
    tech: ['Unity', 'C#', 'Q-Learning'],
    period: '2026年4月（約1週間）',
    demoUrl: 'https://unityroom.com/games/tic-tac-toe-ai',
    videoUrl: 'https://youtu.be/xzMpxUCaVlY',
  },
  {
    id: 'chronostep',
    title: 'ChronoStep',
    thumbnail: chronostepImg,
    description:
      'SUPERHOTから着想を得たトップダウンシューターです。止まれば敵の弾丸もスローモーションに。弾道の視覚化と弾の反射を実装して、戦略的なプレイを促進しています。',
    tech: ['Unity', 'C#'],
    period: '2026年1月（約2週間）',
    demoUrl: 'https://unityroom.com/games/chronostep',
    videoUrl: 'https://youtu.be/GIvMayEjD4M',
  },
  {
    id: 'red-survivor',
    title: 'RED.SURVIVOR',
    thumbnail: redSurvivorImg,
    description:
      'ヴァンサバ風の3Dアクションゲームプロトタイプです。3つの武器を強化しながら敵を倒していきましょう。VFXやポストエフェクトを駆使して、爽快な戦闘体験を目指しました。',
    tech: ['Unity', 'C#', 'R3','UniTask', 'VContainer'],
    period: '2025年11月〜2026年1月（約3ヶ月）',
    demoUrl: 'https://unityroom.com/games/redsurvivor',
    videoUrl: 'https://youtu.be/k0NvsP5da2Y',
  },

  {
    id: 'SoulFall',
    title: 'Soul Fall',
    thumbnail: soulFallImg,
    description:
      '研究室の展示用に作成したソウルライクゲームのプロトタイプです。プレイヤーは剣と盾を駆使して、敵の攻撃を回避しながら戦います。シンプルな操作性と挑戦的なゲームプレイを目指しました。',
    tech: ['Unity', 'C#'],
    demoUrl: 'https://play.unity.com/ja/games/ad74b4af-9945-4fc5-a8a7-0d6be68b4e0d/soul-fall',
    videoUrl: 'https://youtu.be/rGvcQK5-_f4',
  },
  {
    id: 'Kitchen-Chaos',
    title: 'Kitchen Chaos',
    thumbnail: kitchenChaosImg,
    description:
      'YouTubeの動画を参考に作成したOvercooked風のキッチンアクションゲームのプロトタイプです。プレイヤーはシェフとなり、注文された料理を作るために食材を切ったり、鍋で調理したりします。協力プレイも可能で、友達と一緒に楽しむことができます。',
    tech: ['Unity', 'C#'],
    demoUrl: 'https://shun08shun.itch.io/kitchenchaos',
    learning: true,
  },
  {
    id: 'little-adventure',
    title: 'Little Adventure',
    thumbnail: littleAdventureImg,
    description:
      'Udemyのコースを参考に作成した3Dアクションゲームのプロトタイプです。NavMeshやAnimatorの使い方やPlayerの動きや敵の動きの実装を学びました。Cinemachineを使用して、カメラワークも工夫しています。',
    tech: ['Unity', 'C#', 'NavMesh', 'Animator'],
    demoUrl: 'https://shun08shun.itch.io/littleadventure',
    learning: true,
  },

];
