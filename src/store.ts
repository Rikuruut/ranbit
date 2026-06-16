import { create } from 'zustand';
import {
  loadSettings,
  loadShopState,
  loadUserProgress,
  saveSetting,
  saveShopState,
  saveUserProgress,
} from './storage';
import { REWARDS } from './theme';

export type UserState = {
  level:       number;
  exp:         number;
  carrotCount: number;
};

type SettingsState = {
  seEnabled: boolean;
  seVolume:  number;
  bgmFile:   string;
};

type ShopState = {
  ownedItemIds:         string[];
  selectedBackgroundId: string;
};

export type AppStore = {
  user:     UserState;
  settings: SettingsState;
  shop:     ShopState;

  loadUserData:   () => Promise<void>;
  applyRewards:   (realSeconds: number) => Promise<{
    earnedExp:     number;
    levelUpCount:  number;
    earnedCarrots: number;
  }>;
  updateSettings: (partial: Partial<SettingsState>) => Promise<void>;
  purchaseItem:   (itemId: string, price: number) => Promise<boolean>;
  selectBackground: (bgId: string) => Promise<void>;
};

export const useAppStore = create<AppStore>((set, get) => ({
  user:     { level: 1, exp: 0, carrotCount: 0 },
  settings: { seEnabled: true, seVolume: 1.0, bgmFile: 'ambient.mp3' },
  shop:     { ownedItemIds: ['bg_default'], selectedBackgroundId: 'bg_default' },

  // ── 起動時ロード ─────────────────────────────
  loadUserData: async () => {
    const [progress, settings, shop] = await Promise.all([
      loadUserProgress(),
      loadSettings(),
      loadShopState(),
    ]);
    set({ user: progress, settings, shop });
  },

  // ── 報酬計算 ─────────────────────────────────
  applyRewards: async (realSeconds) => {
    const { user } = get();
    const earnedExp = Math.max(realSeconds * REWARDS.EXP_PER_SEC, realSeconds > 0 ? 1 : 0);

    let { level, exp, carrotCount } = user;
    exp += earnedExp;

    let levelUpCount  = 0;
    let earnedCarrots = 0;
    const nextLevelExp = (lv: number) => REWARDS.BASE_LEVEL_EXP + lv * REWARDS.EXP_LEVEL_SCALE;

    while (exp >= nextLevelExp(level)) {
      exp -= nextLevelExp(level);
      level++;
      levelUpCount++;
      earnedCarrots += level % 5 === 0 ? REWARDS.CARROT_MILESTONE : REWARDS.CARROT_NORMAL;
    }

    if (realSeconds >= REWARDS.LONG_BONUS_SEC) earnedCarrots += REWARDS.CARROT_LONG_BONUS;

    carrotCount = Math.min(carrotCount + earnedCarrots, REWARDS.CARROT_MAX);
    set({ user: { level, exp, carrotCount } });
    await saveUserProgress(level, exp, carrotCount);

    return { earnedExp, levelUpCount, earnedCarrots };
  },

  // ── 設定更新 ─────────────────────────────────
  // multiSet を使わず saveSetting を個別呼び出しに変更
  updateSettings: async (partial) => {
    const next = { ...get().settings, ...partial };
    set({ settings: next });

    const keyMap: Record<string, string> = {
      seEnabled: 'setting_se_enabled',
      seVolume:  'setting_se_volume',
      bgmFile:   'setting_bgm_file',
    };
    await Promise.all(
      Object.entries(partial).map(([k, v]) => saveSetting(keyMap[k], String(v)))
    );
  },

  // ── ショップ購入 ──────────────────────────────
  purchaseItem: async (itemId, price) => {
    const { user, shop } = get();
    if (user.carrotCount < price)        return false;
    if (shop.ownedItemIds.includes(itemId)) return false;

    const carrotCount  = user.carrotCount - price;
    const ownedItemIds = [...shop.ownedItemIds, itemId];

    set({ user: { ...user, carrotCount }, shop: { ...shop, ownedItemIds } });
    await Promise.all([
      saveUserProgress(user.level, user.exp, carrotCount),
      saveShopState(ownedItemIds, shop.selectedBackgroundId),
    ]);
    return true;
  },

  // ── 背景選択 ──────────────────────────────────
  selectBackground: async (bgId) => {
    const { shop } = get();
    const next = { ...shop, selectedBackgroundId: bgId };
    set({ shop: next });
    await saveShopState(next.ownedItemIds, bgId);
  },
}));