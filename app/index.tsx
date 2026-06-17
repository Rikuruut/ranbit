import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../src/store";
import { FONTS } from "../src/theme";

// ─────────────────────────────────────────────
//  Start画面（スプラッシュ形式）
//
//  遷移条件: 以下の両方を満たしたとき
//    ① データ読み込みが完了した
//    ② 最低表示時間(MIN_DISPLAY_MS)が経過した
// ─────────────────────────────────────────────

// バージョン表記
const APP_VERSION = "ver0.1.2-alpha";
const MIN_DISPLAY_MS = 2500;
const { height: SCREEN_H } = Dimensions.get("window");

export default function StartScreen() {
  const insets = useSafeAreaInsets();
  const loadUserData = useAppStore((s: any) => s.loadUserData);

  // ── 遷移制御 ──
  const [dataReady, setDataReady] = useState(false);
  const [timeReady, setTimeReady] = useState(false);
  const hasNavigated = useRef(false);

  // ── アニメーション値 ──
  const furiganaOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const fadeOut = useSharedValue(1);

  // ── ① 裏でデータ読み込み ──
  useEffect(() => {
    (async () => {
      await loadUserData();
      setDataReady(true);
    })();
  }, []);

  // ── ② 最低表示時間のタイマー ──
  useEffect(() => {
    const timer = setTimeout(() => setTimeReady(true), MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // ── 両方揃ったらフェードアウト → 遷移 ──
  useEffect(() => {
    if (dataReady && timeReady && !hasNavigated.current) {
      hasNavigated.current = true;
      fadeOut.value = withTiming(0, { duration: 400 }, () => {
        runOnJS(navigate)();
      });
    }
  }, [dataReady, timeReady]);

  const navigate = () => {
    router.replace("/(tabs)");
  };

  // ── ロゴ登場アニメーション ──
  useEffect(() => {
    furiganaOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
    );
    logoOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
    );
    logoScale.value = withDelay(
      500,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }),
    );
  }, []);

  // ── アニメーションスタイル ──
  const furiganaStyle = useAnimatedStyle(() => ({
    opacity: furiganaOpacity.value * fadeOut.value,
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value * fadeOut.value,
    transform: [{ scale: logoScale.value }],
  }));
  const screenFadeStyle = useAnimatedStyle(() => ({
    opacity: fadeOut.value,
  }));

  return (
    <Animated.View style={[styles.screen, screenFadeStyle]}>
      {/* ── 背景画像 ── */}
      <Image
        source={require("../assets/images/start_screen2.webp")}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* ── バージョン表記(左上) ── */}
      <Text style={[styles.version, { top: insets.top + 16 }]}>
        {APP_VERSION}
      </Text>

      {/* ── タイトルグループ(中央) ── */}
      <View style={styles.content}>
        <View style={styles.titleGroup}>
          <Animated.Text style={[styles.furigana, furiganaStyle]}>
            らんびっと
          </Animated.Text>
          <Animated.Text style={[styles.logo, logoStyle]}>Ranbit</Animated.Text>
        </View>
      </View>

      {/* ── コピーライト(下部中央) ── */}
      <Text style={[styles.copyright, { bottom: insets.bottom + 20 }]}>
        © 2026 Ranbit
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    height: Platform.OS === "web" ? ("100dvh" as any) : SCREEN_H,
    overflow: "hidden",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
  },

  // ── タイトル ──
  titleGroup: {
    alignItems: "center",
    gap: 2,
  },
  furigana: {
    fontFamily: FONTS.display,
    fontSize: 24,
    letterSpacing: 8,
    color: "#F5DEB3",
    textShadowColor: "rgba(245, 222, 179, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  logo: {
    fontFamily: FONTS.display,
    fontSize: 90,
    color: "#F5DEB3",
    letterSpacing: 2,
    textShadowColor: "rgba(245, 222, 179, 0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  // ── バージョン・コピーライト ──
  version: {
    position: "absolute",
    left: 16,
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  copyright: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "rgba(0,0,0,0.4)",
    fontWeight: "bold",
  },
});
