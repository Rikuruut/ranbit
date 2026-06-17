import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from '../src/theme';

const APP_VERSION = 'ver0.1.0-alpha';
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function StartScreen() {
  const insets = useSafeAreaInsets();

  // ── 脈動アニメーション ──
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleStart = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.screen}>
      {/* ── 背景画像: 画面全体を埋める(position absolute) ── */}
      <Image
        source={require('../assets/images/start_screen.webp')}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* ── バージョン表記(左上) ── */}
      <Text style={[styles.version, { top: insets.top + 16 }]}>
        {APP_VERSION}
      </Text>

      {/* ── メインコンテンツ ── */}
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        <View style={styles.titleGroup}>
          <Text style={styles.furigana}>らんびっと</Text>
          <Text style={styles.logo}>Ranbit</Text>
        </View>

        <View style={styles.spacer} />

        <Animated.View style={[styles.buttonWrapper, pulseStyle]}>
          <Pressable onPress={handleStart} style={styles.button}>
            <Text style={styles.buttonText}>はじめる</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* ── コピーライト(下部中央) ── */}
      <Text style={[styles.copyright, { bottom: insets.bottom + 20 }]}>
        © 2026 Ranbit
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── 画面全体: ビューポートぴったりに固定してスクロールを防ぐ ──
  screen: {
    flex: 1,
    width: '100%',
    height: Platform.OS === 'web' ? '100dvh' as any : SCREEN_H,
    overflow: 'hidden',
  },

  // ── 背景画像: 画面全体に絶対配置 ──
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  titleGroup: {
    alignItems: 'center',
  },
  furigana: {
    fontFamily: FONTS.display,
    fontSize: 30,
    letterSpacing: 2,
    color: '#FFFACD',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  logo: {
    fontFamily: FONTS.display,
    fontSize: 90,
    letterSpacing: 2,
    color: '#FFFACD',
    marginTop: -35,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },

  spacer: {
    flex: 1,
  },
  buttonWrapper: {
    marginBottom: 130,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  buttonText: {
    fontFamily: FONTS.display,
    fontSize: 50,
    letterSpacing: 5,
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },

  version: {
    position: 'absolute',
    left: 16,
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#000',
    zIndex: 1,
  },
  copyright: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    fontWeight: 'bold',
  },
});