import { StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../src/store';
import { COLORS, FONTS } from '../../src/theme';

// 仮置き: タイマーの本実装は Phase3(useTimer.ts)で行う
export default function HomeScreen() {
  const { level, carrotCount } = useAppStore((s) => s.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐰 Ranbit</Text>
      <Text style={styles.info}>Lv.{level}　🥕 {carrotCount}</Text>
      <Text style={styles.sub}>タイマー画面(実装中)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: { fontFamily: FONTS.display, fontSize: 48, color: COLORS.primary },
  info:  { fontFamily: FONTS.bold,    fontSize: 18, color: COLORS.primary },
  sub:   { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.blueGrey },
});