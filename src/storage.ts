import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RecordEntry } from './types';

const KEYS = {
  LEVEL:         'ranbit_level',
  EXP:           'ranbit_exp',
  CARROT:        'ranbit_carrot',
  SAVED_GOAL:    'saved_goal',
  PRESET_GOALS:  'preset_goals',
  RECORDS:       'ranbit_records',
  SEEN_TUTORIAL: 'has_seen_home_tutorial',
  OWNED_ITEMS:   'shop_owned_items',
  SELECTED_BG:   'selected_background_id',
  SE_ENABLED:    'setting_se_enabled',
  SE_VOLUME:     'setting_se_volume',
  BGM_FILE:      'setting_bgm_file',
} as const;

// ── ユーザー進捗 ──────────────────────────────
export async function loadUserProgress() {
  const [level, exp, carrot] = await Promise.all([
    AsyncStorage.getItem(KEYS.LEVEL),
    AsyncStorage.getItem(KEYS.EXP),
    AsyncStorage.getItem(KEYS.CARROT),
  ]);
  return {
    level:       Number(level  ?? 1),
    exp:         Number(exp    ?? 0),
    carrotCount: Number(carrot ?? 0),
  };
}

export async function saveUserProgress(level: number, exp: number, carrot: number) {
  await Promise.all([
    AsyncStorage.setItem(KEYS.LEVEL,  String(level)),
    AsyncStorage.setItem(KEYS.EXP,    String(exp)),
    AsyncStorage.setItem(KEYS.CARROT, String(carrot)),
  ]);
}

// ── 記録 ─────────────────────────────────────
export async function loadRecords(): Promise<RecordEntry[]> {
  const json = await AsyncStorage.getItem(KEYS.RECORDS);
  return json ? JSON.parse(json) : [];
}

export async function appendRecord(entry: RecordEntry) {
  const records = await loadRecords();
  records.push(entry);
  await AsyncStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
}

// ── 目標 ─────────────────────────────────────
export async function loadGoal(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.SAVED_GOAL)) ?? '';
}

export async function saveGoal(goal: string) {
  await AsyncStorage.setItem(KEYS.SAVED_GOAL, goal);
}

export async function loadPresetGoals(): Promise<string[]> {
  const json = await AsyncStorage.getItem(KEYS.PRESET_GOALS);
  return json ? JSON.parse(json) : [];
}

export async function savePresetGoals(goals: string[]) {
  await AsyncStorage.setItem(KEYS.PRESET_GOALS, JSON.stringify(goals));
}

// ── チュートリアル ────────────────────────────
export async function hasSeenTutorial(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEYS.SEEN_TUTORIAL)) === 'true';
}

export async function markTutorialSeen() {
  await AsyncStorage.setItem(KEYS.SEEN_TUTORIAL, 'true');
}

// ── ショップ ──────────────────────────────────
export async function loadShopState() {
  const [owned, selected] = await Promise.all([
    AsyncStorage.getItem(KEYS.OWNED_ITEMS),
    AsyncStorage.getItem(KEYS.SELECTED_BG),
  ]);
  return {
    ownedItemIds:         JSON.parse(owned ?? '["bg_default"]') as string[],
    selectedBackgroundId: selected ?? 'bg_default',
  };
}

export async function saveShopState(ownedItemIds: string[], selectedBgId: string) {
  await Promise.all([
    AsyncStorage.setItem(KEYS.OWNED_ITEMS, JSON.stringify(ownedItemIds)),
    AsyncStorage.setItem(KEYS.SELECTED_BG, selectedBgId),
  ]);
}

// ── 設定 ─────────────────────────────────────
export async function loadSettings() {
  const [seEnabled, seVolume, bgmFile] = await Promise.all([
    AsyncStorage.getItem(KEYS.SE_ENABLED),
    AsyncStorage.getItem(KEYS.SE_VOLUME),
    AsyncStorage.getItem(KEYS.BGM_FILE),
  ]);
  return {
    seEnabled: seEnabled !== 'false',
    seVolume:  Number(seVolume ?? 1.0),
    bgmFile:   bgmFile ?? 'ambient.mp3',
  };
}

export async function saveSetting(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
}

// ── 全データ初期化 ────────────────────────────
export async function resetAllData() {
  await Promise.all(Object.values(KEYS).map((k) => AsyncStorage.removeItem(k)));
}