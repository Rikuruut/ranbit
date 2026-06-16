// ─────────────────────────────────────────────
//  types.ts
//  旧 timer_screen.dart の _saveRecord() で使っていた
//  Map<String, dynamic> を TypeScript の型として定義
// ─────────────────────────────────────────────

/** タイマー1回の記録 */
export type RecordEntry = {
  date:     string; // ISO8601 例: "2025-12-02T10:30:00.000Z"
  goal:     string; // 目標テキスト(空文字 = フリー)
  timeSec:  number; // 実経過時間(秒)
  carrot:   number; // 獲得人参数
};

/** ショップアイテム */
export type ShopItem = {
  id:       string;
  name:     string;
  price:    number;
  imagePath: string;
  isSecret?: boolean;
};

/** BGM選択肢 */
export type BgmOption = {
  label:    string;
  filename: string; // '' = 無音
};