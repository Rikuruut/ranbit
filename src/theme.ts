// ─────────────────────────────────────────────
//  theme.ts
//  旧Flutterの各画面に散在していた以下を統合:
//    _primaryColor / _accentColor / _offWhite  (timer_screen, settings_screen, shop_screen)
//    Colors.orange / Colors.blueGrey           (main_screen)
//    fontFamily: 'Mplus1p' / 'CherryBombOne'  (複数ファイル)
// ─────────────────────────────────────────────

export const COLORS = {
  // ── メインパレット ──────────────────────────
  primary:  '#4E342E', // 旧 Colors.brown.shade800
  accent:   '#4FC3F7', // 旧 Color(0xFF4FC3F7) 水色
  offWhite: '#FDFBF7', // 旧 Color(0xFFFDFBF7) クリーム白

  // ── タブバー用 ──────────────────────────────
  orange:   '#FF9800', // 旧 Colors.orange
  blueGrey: '#607D8B', // 旧 Colors.blueGrey

  // ── 補助 ────────────────────────────────────
  brown:      '#795548',
  background: '#E1F5FE', // 旧 _outerBackgroundColor
  white:      '#FFFFFF',
} as const;

export const FONTS = {
  regular: 'Mplus1p-Regular',
  bold:    'Mplus1p-Bold',
  display: 'CherryBombOne',  // ロゴ・大見出し用
} as const;

// ─────────────────────────────────────────────
//  ゲームバランス定数
//  旧コードに散在していたマジックナンバーを命名して一元化。
//  バランス調整はここだけ変えればOK。
// ─────────────────────────────────────────────

export const TIMER = {
  /** ランダム停止の最短割合。最大時間の25%以降で止まる */
  MIN_STOP_RATIO: 0.25,

  /** タイマーのティック間隔(ms) */
  TICK_MS: 100,

  /** フィーバー: 10秒ごとに抽選 */
  FEVER_CHECK_INTERVAL_SEC: 10,

  /** フィーバー: 発生確率 3% */
  FEVER_CHANCE: 0.03,

  /** フィーバー: 継続時間(秒) */
  FEVER_DURATION_SEC: 10,

  /** フィーバー加速倍率の上限。旧コードは無制限で最大202倍になっていたのを修正 */
  FEVER_SPEED_MAX: 10.0,

  /** フィーバー加速の基礎倍率 */
  FEVER_SPEED_BASE: 2.0,
} as const;

export const REWARDS = {
  /** 1秒 = 1EXP */
  EXP_PER_SEC: 1,

  /** 基礎EXP必要量 */
  BASE_LEVEL_EXP: 900,

  /** レベルごとの必要EXP増加量 */
  EXP_LEVEL_SCALE: 60,

  /** 通常レベルアップ報酬(人参) */
  CARROT_NORMAL: 20,

  /** 5の倍数レベル報酬(人参) */
  CARROT_MILESTONE: 50,

  /** 30分(1800秒)達成ボーナス(人参) */
  CARROT_LONG_BONUS: 5,
  LONG_BONUS_SEC: 1800,

  /** 人参の上限 */
  CARROT_MAX: 99999,
} as const;