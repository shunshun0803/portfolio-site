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
  outcome?: string; // 受賞・順位・評価・技術的な見どころなど全体の成果
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
  period?: string;    // 通常カード用の制作期間（代表作は featured.period を使う）
  learning?: boolean; // チュートリアルを参考にした学習用の作品。Works の末尾に分けて表示する
  featured?: FeaturedDetail;
}

export const projects: Project[] = [
  // ── 代表作（featured あり・この順で上部に表示） ──
  {
    id: 'ARCHEIA',
    title: 'ARCHEIA ─ The Ember Rite ─',
    // thumbnail: archeiaImg,  // TODO: スクリーンショットを ./thumbnails に置いて import する
    description:
      '古代文明の遺跡を守る機械の番人が赤い光に侵されて狂い、古代の灯火を継ぐ少女「灯守（ひもり）」が各地の光の源を祓っていく3Dアクションゲームです（制作中）。無双シリーズの爽快感とソウルライクの手応えの掛け合わせを狙い、全6章構想のうち第1〜2章がプレイ可能。2系統コンボ・派生攻撃・空中コンボ・ジャストガードからの致命の反撃・無双乱舞・ロックオン、機械兵の群れと拠点制圧、中ボス・章ボス、潮位や鏡を使った謎解き、水門の防衛戦を実装しています。キャラクター・モーション・環境・音は購入／配布素材を使用しています。',
    tech: ['Unity 6', 'URP', 'C#', 'VContainer', 'R3', 'UniTask', 'RenderGraph'],
    featured: {
      period: '2026年9月〜（制作中）',
      team: '個人（AIコーディングツールと分担）',
      role: '方向性・世界観・章構成の決定、素材選定、試遊に基づく改善判断と数値調整。実装は主人公のAnimator・Cinemachineのカメラ・共通部品パッケージを担当。C#・シェーダーの大部分はClaude Codeに任せ、設計ルール（MVP・DI・テスト・コメント方針）はCLAUDE.mdに自分で明文化',
      points: [
        {
          challenge: '剣閃がカーブで反転する',
          approach: 'カメラに板を向ける方式に補正を重ねるのをやめ、刃が通過した面をそのまま形状にする方式に切り替えた',
          result: '急な軌道でも破綻しなくなった。直らないときは方式ごと変える判断が必要だと学んだ',
        },
        {
          challenge: '攻撃後に棒立ちのまま滑る',
          approach: 'コンボ遷移を固定秒数で予測していたのをやめ、アニメーションの実進捗に同期させた',
          result: '再生速度を変えても再調整が不要に',
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
      outcome: '単体テスト282件（ゲームルールをUnity非依存のC#層に分離） / RenderGraphによる自作ポストエフェクト / 草 約70万本をGPUインスタンシングで描画',
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
      period: '2026年2月〜5月（約4ヶ月・約480時間）',
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
      period: '2026年4月（約1ヶ月・約150時間）',
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
    period: '2026年6月（約2週間・約110時間）',
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
    period: '2026年4月（約1週間・約42時間）',
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
    period: '2026年1月（約2週間・約70時間）',
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
    period: '2025年11月〜2026年1月（約3ヶ月・約360時間）',
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
