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
    id: 'ShiroFlip',
    title: 'ShiroFlip',
    thumbnail: ShiroFlipImg,
    description:
      'unity1weekで開発した盤面の白黒を反転させながらゴールを目指すパズルゲーム。白いマスは安全、黒いマスは即死。反転は「ボタンを押した位置の周囲2マス」にしか効かないため、いつ押すかに加えて、どこに立って押すかが問われるのが核となる仕組みです。全39ステージ（チュートリアル9＋本編30）。1週間のゲームジャム作品ですが、期間内に「チュートリアル→全30ステージ→ゲームクリア」まで一本の流れとして遊べる状態に仕上げました。',
    tech: ['Unity', 'C#', 'UniTask', 'R3', 'VContainer'],
    demoUrl: 'https://unityroom.com/games/shunshun0803_shiroflip',
  },
  {
    id: 'ZombieShooter',
    title: 'Zombie Shooter',
    thumbnail: zombieShooterImg,
    description:
      '敵を撃ち落とし、1体でも突破されたらゲームオーバーというサバイバル・シューティングです。コンボや演出で「遊んでいて気持ちいい手応え」を出すことを目標に、UIの作り込みやDOTweenによるアニメーション演出にこだわって個人制作しました。',
    tech: ['Unity', 'C#', 'UniTask', 'R3', 'VContainer'],
    demoUrl: 'https://unityroom.com/games/shunshun0803_zombieshooter',
    videoUrl: 'https://youtu.be/umT_MEtIvRU',
  },
  {
    id: 'LOGICARTA',
    title: 'LOGICARTA',
    thumbnail: logicartaImg,
    description:
      ' Logicarta は、Unity 製のカード／デッキ構築要素を持つ戦略バトルゲームです。サモナー選択、グリッド上のユニット配置、敵ウェーブ、ショップ、報酬、アーティファクトなどを組み合わせたローグライト寄りの構成になっています。',
    tech: ['Unity', 'C#', 'UniTask', 'R3', 'VContainer'],
    demoUrl: 'https://unityroom.com/games/logicarta-demo',
    videoUrl: 'https://youtu.be/bqfVnrwbkg4',
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
  },
  {
    id: 'Tic-Tac-Toe',
    title: 'Tic Tac Toe',
    thumbnail: ticTacToeImg,
    description:
      'Unityで制作した3D三目並べゲームです.対戦相手のAIにQ学習（強化学習）を実装し、対局を重ねるごとに強くなる仕組みを自作しました。',
    tech: ['Unity', 'C#', 'Q-Learning'],
    demoUrl: 'https://unityroom.com/games/tic-tac-toe-ai',
    videoUrl: 'https://youtu.be/xzMpxUCaVlY',
  },
  {
    id: 'chronostep',
    title: 'ChronoStep',
    thumbnail: chronostepImg,
    description:
      'スーバーホットをイメージして作成したトップダウンシューターです。止まれば敵の弾丸もスローモーションに。 弾道の視覚化と弾の反射を実装して、戦略的なプレイを促進しています。',
    tech: ['Unity', 'C#'],
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
    demoUrl: 'https://unityroom.com/games/redsurvivor',
    videoUrl: 'https://youtu.be/k0NvsP5da2Y',
  },
  
  {
    id: 'SoulFall',
    title: 'Soul Fall',
    thumbnail: soulFallImg,
    description:
      '研究室の展示用に作成したソウルライクゲームのプロトタイプです。プレイヤーは剣と盾を駆使して、敵の攻撃を回避しながら戦います。シンプルな操作性と挑戦的なゲームプレイを目指しました。',
    tech: ['Unity', 'c#'],
    demoUrl: 'https://play.unity.com/ja/games/ad74b4af-9945-4fc5-a8a7-0d6be68b4e0d/soul-fall',
    videoUrl: 'https://youtu.be/rGvcQK5-_f4',
  },
  {
    id: 'Kitchen-Chaos',
    title: 'Kitchen Chaos',
    thumbnail: kitchenChaosImg,
    description:
      'youtubeの動画を参考に作成したOvercooked風のキッチンアクションゲームのプロトタイプです。プレイヤーはシェフとなり、注文された料理を作るために食材を切ったり、鍋で調理したりします。協力プレイも可能で、友達と一緒に楽しむことができます。',
    tech: ['Unity', 'C#'],
    demoUrl: 'https://shun08shun.itch.io/kitchenchaos',
  },
  {
    id: 'little-adventure',
    title: 'Little Adventure',
    thumbnail: littleAdventureImg,
    description:
      'Udemyのコースを参考に作成した3Dアクションゲームのプロトタイプです。NavMeshやAnimatorの使い方やPlayerの動きや敵の動きの実装を学びました。Cinemachineを使用して、カメラワークも工夫しています。',
    tech: ['Unity', 'C#', 'NavMesh', 'Animator'],
    demoUrl: 'https://shun08shun.itch.io/littleadventure',
  },
  
];
